import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VoicemailAnalysisRequest {
  voicemailId: string
  transcription: string
  summary?: string
}

interface AnalysisResult {
  analysis_type: string
  analysis_result: string
  confidence_score: number
  ai_model_name: string
  ai_model_version: string
  processing_time_ms: number
  raw_response: any
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { voicemailId, transcription, summary } = await req.json() as VoicemailAnalysisRequest

    if (!voicemailId || !transcription) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: voicemailId, transcription' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Starting analysis for voicemail ${voicemailId}`)

    // OpenAI API configuration
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }

    // Analysis prompt for legal voicemail content
    const analysisPrompt = `
Tu es un assistant IA spécialisé dans l'analyse de messages vocaux pour cabinets d'avocats belges.

Analyse le message vocal suivant et fournis une analyse structurée selon ces 6 catégories exactes :

TRANSCRIPTION: "${transcription}"
${summary ? `RÉSUMÉ: "${summary}"` : ''}

Analyse chaque catégorie et réponds UNIQUEMENT avec un JSON valide dans ce format exact :

{
  "Sentiment": "Positif|Négatif|Neutre",
  "Urgence": "Urgent|Modéré|Non Urgent",
  "Catégorie": "Conseil Juridique Requis|Mise À Jour De Dossier Demandée|Demande De Paiement|Document À Fournir|Document À Recevoir|Rendez-vous Demandé|Action Urgente Requise|Dossier En Cours",
  "Domaine juridique": "Droit Des Contrats|Droit De La Famille|Droit Du Travail|Droit Civil|Droit Administratif Et Public|Droit Pénal|Droit Des Affaires Et Commercial|Droit De La Consommation|Droit Bancaire Et Financier|Droit Des Successions|Droit Immobilier|Indéterminé",
  "Étape du dossier": "Nouveau Dossier|Dossier En Cours|Conclusion De Dossier|Suivi Nécessaire",
  "Intention": "Demande D'information|Prise De Rendez-vous|Plainte|Paiement|Soumission De Document|Consultation Juridique|Suivi De Dossier"
}

IMPORTANT: 
- Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire
- Utilise exactement les valeurs énumérées ci-dessus
- Toutes les réponses doivent être en français avec des majuscules en début de chaque mot
- Si tu n'es pas sûr, choisis l'option la plus probable
`

    // Call OpenAI API
    const startTime = Date.now()
    
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant IA expert en analyse de messages vocaux pour cabinets d\'avocats. Tu réponds uniquement avec du JSON valide.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.1
      })
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorText}`)
    }

    const openaiResult = await openaiResponse.json()
    const processingTime = Date.now() - startTime

    console.log('OpenAI response:', openaiResult)

    let analysisData: any
    try {
      // Extract JSON from OpenAI response
      const content = openaiResult.choices[0]?.message?.content || '{}'
      console.log('Raw content:', content)
      
      // Clean the content to extract JSON
      let jsonContent = content.trim()
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/```json\n?/, '').replace(/```$/, '')
      }
      if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/```\n?/, '').replace(/```$/, '')
      }
      
      analysisData = JSON.parse(jsonContent)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Content:', openaiResult.choices[0]?.message?.content)
      
      // Fallback analysis if JSON parsing fails
      analysisData = {
        "Sentiment": "Neutre",
        "Urgence": "Non Urgent", 
        "Catégorie": "Conseil Juridique Requis",
        "Domaine juridique": "Indéterminé",
        "Étape du dossier": "Dossier En Cours",
        "Intention": "Demande D'information"
      }
    }

    // Prepare analysis results for database insertion
    const analysisResults: AnalysisResult[] = []
    
    for (const [analysisType, result] of Object.entries(analysisData)) {
      analysisResults.push({
        analysis_type: analysisType,
        analysis_result: result as string,
        confidence_score: 0.85, // Default confidence score
        ai_model_name: 'gpt-4o-mini',
        ai_model_version: '2024-07-18',
        processing_time_ms: processingTime,
        raw_response: openaiResult
      })
    }

    console.log('Analysis results:', analysisResults)

    // Insert analysis results into voicemail_analysis table
    const insertPromises = analysisResults.map(async (analysis) => {
      const { error } = await supabase
        .from('voicemail_analysis')
        .insert({
          voicemail_id: voicemailId,
          analysis_type: analysis.analysis_type,
          analysis_result: analysis.analysis_result,
          confidence_score: analysis.confidence_score,
          ai_model_name: analysis.ai_model_name,
          ai_model_version: analysis.ai_model_version,
          processing_time_ms: analysis.processing_time_ms,
          raw_response: analysis.raw_response
        })

      if (error) {
        console.error(`Error inserting ${analysis.analysis_type} analysis:`, error)
        throw error
      }
    })

    await Promise.all(insertPromises)

    // Update voicemail status to indicate processing is complete
    const { error: updateError } = await supabase
      .from('voicemails')
      .update({ 
        status: 'reviewed',
        updated_at: new Date().toISOString()
      })
      .eq('id', voicemailId)

    if (updateError) {
      console.error('Error updating voicemail status:', updateError)
    }

    console.log(`Successfully analyzed voicemail ${voicemailId}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        voicemailId,
        analysisCount: analysisResults.length,
        processingTimeMs: processingTime
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in analyze-voicemail function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Check function logs for more information'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
