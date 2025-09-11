# VoxNow Supabase Edge Functions

This directory contains Supabase Edge Functions for automatic voicemail analysis using OpenAI.

## 📁 Functions

### 1. `analyze-voicemail`
Main function that performs AI analysis on voicemail transcriptions using OpenAI GPT-4o-mini.

**Analyzes 6 categories:**
- **Sentiment**: positive, negative, neutral
- **Urgence**: urgent, moderate, not urgent  
- **Catégorie**: legal advice needed, case update requested, payment inquiry, etc.
- **Domaine juridique**: contract law, family law, employment law, etc.
- **Étape du dossier**: new case, ongoing case, case conclusion, follow-up needed
- **Intention**: information request, appointment booking, complaint, etc.

### 2. `analyze-voicemail-webhook`
Webhook handler that triggers the analysis function when new voicemails are added.

## 🚀 Deployment Instructions

### Prerequisites
1. Supabase CLI installed: `npm install -g supabase`
2. OpenAI API key
3. Supabase project set up

### Step 1: Deploy Functions
```bash
# Navigate to your project root
cd /path/to/voxnow-website

# Login to Supabase (if not already logged in)
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the functions
supabase functions deploy analyze-voicemail
supabase functions deploy analyze-voicemail-webhook
```

### Step 2: Set Environment Variables
```bash
# Set OpenAI API key
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here

# Verify secrets are set
supabase secrets list
```

### Step 3: Set Up Database Triggers

#### Option A: Database Webhooks (Recommended)
1. Go to your Supabase Dashboard
2. Navigate to **Database > Webhooks** 
3. Click **Create a new hook**
4. Configure:
   - **Name**: `voicemail-analysis-webhook`
   - **Table**: `voicemails`
   - **Events**: ☑️ Insert, ☑️ Update
   - **Type**: HTTP Request
   - **Method**: POST
   - **URL**: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/analyze-voicemail-webhook`
   - **HTTP Headers**: 
     ```
     Authorization: Bearer YOUR_SUPABASE_ANON_KEY
     Content-Type: application/json
     ```

#### Option B: Database Trigger Function
Run this SQL in your Supabase SQL Editor:
```sql
-- See supabase/functions/_shared/database.sql for complete code
```

### Step 4: Test the Setup

#### Test with SQL
```sql
-- Insert a test voicemail with transcription
INSERT INTO voicemails (
  user_id, 
  transcription, 
  received_at,
  status
) VALUES (
  'YOUR_USER_ID',
  'Bonjour, je souhaite prendre rendez-vous pour une consultation en droit de la famille. Mon divorce se passe mal et j''ai besoin de conseils urgents.',
  NOW(),
  'new'
);

-- Check if analysis was created
SELECT * FROM voicemail_analysis 
WHERE voicemail_id = 'THE_INSERTED_VOICEMAIL_ID';
```

#### Test Function Directly
```bash
# Test the analyze-voicemail function
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/analyze-voicemail' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "voicemailId": "test-id",
    "transcription": "Bonjour, je voudrais des informations sur un contrat de travail"
  }'
```

## 🔧 Configuration

### Environment Variables Required:
- `OPENAI_API_KEY`: Your OpenAI API key
- `SUPABASE_URL`: Automatically provided by Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Automatically provided by Supabase
- `SUPABASE_ANON_KEY`: Automatically provided by Supabase

### Database Tables Used:
- `voicemails` (source data)
- `voicemail_analysis` (analysis results)
- `analysis_logs` (optional debugging)

## 📊 Monitoring

### Check Function Logs
```bash
# View logs for analyze-voicemail function
supabase functions logs analyze-voicemail

# View logs for webhook function  
supabase functions logs analyze-voicemail-webhook
```

### Database Monitoring
```sql
-- Check recent analyses
SELECT 
  va.*,
  v.transcription 
FROM voicemail_analysis va
JOIN voicemails v ON va.voicemail_id = v.id
ORDER BY va.created_at DESC
LIMIT 10;

-- Check analysis distribution
SELECT 
  analysis_type,
  analysis_result,
  COUNT(*) as count
FROM voicemail_analysis
GROUP BY analysis_type, analysis_result
ORDER BY analysis_type, count DESC;
```

## 🐛 Troubleshooting

### Common Issues:

1. **Function not triggering**: Check webhook configuration in Supabase dashboard
2. **OpenAI errors**: Verify API key is set correctly with `supabase secrets list`
3. **Database permission errors**: Ensure service role key has proper permissions
4. **JSON parsing errors**: Check OpenAI response format in function logs

### Debug Steps:
1. Check function logs: `supabase functions logs FUNCTION_NAME`
2. Verify webhook is configured correctly in Supabase dashboard
3. Test function directly with curl
4. Check database triggers are active
5. Verify environment variables are set

## 🔄 Updates

To update the functions:
```bash
# Redeploy after making changes
supabase functions deploy analyze-voicemail --no-verify-jwt
supabase functions deploy analyze-voicemail-webhook --no-verify-jwt
```

## 📝 Notes

- Functions use GPT-4o-mini for cost efficiency while maintaining quality
- Analysis results are stored with confidence scores and processing time
- Functions include error handling and fallback values
- All responses are in English for consistency, except French keys in database
