import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const webhookData = await req.json()
    console.log('Webhook received:', webhookData)

    // Extract data from webhook payload
    const { record, type } = webhookData
    
    if (!record || !record.id) {
      return new Response(
        JSON.stringify({ error: 'Invalid webhook payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const voicemail = record

    // Only process if transcription exists and hasn't been analyzed yet
    if (!voicemail.transcription || voicemail.transcription.trim() === '') {
      console.log(`Voicemail ${voicemail.id} has no transcription, skipping analysis`)
      return new Response(
        JSON.stringify({ message: 'No transcription available, skipping analysis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if analysis already exists
    const { data: existingAnalysis } = await supabase
      .from('voicemail_analysis')
      .select('id')
      .eq('voicemail_id', voicemail.id)
      .limit(1)

    if (existingAnalysis && existingAnalysis.length > 0) {
      console.log(`Voicemail ${voicemail.id} already analyzed, skipping`)
      return new Response(
        JSON.stringify({ message: 'Voicemail already analyzed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call the main analysis function
    const analysisResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/analyze-voicemail`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        voicemailId: voicemail.id,
        transcription: voicemail.transcription,
        summary: voicemail.ai_summary
      })
    })

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text()
      throw new Error(`Analysis function failed: ${analysisResponse.status} - ${errorText}`)
    }

    const analysisResult = await analysisResponse.json()
    console.log('Analysis completed:', analysisResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Voicemail analysis triggered successfully',
        result: analysisResult
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in webhook handler:', error)
    
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
