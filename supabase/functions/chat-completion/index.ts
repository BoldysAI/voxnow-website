import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Secure CORS configuration - only allow requests from specific origins
const getAllowedOrigins = () => {
  const allowedOrigins = [
    'https://voxnow.be',
    'https://voxnow.pt',
    'https://www.voxnow.be',
    'https://staging.voxnow.be', // Staging
    'http://localhost:8080', // Development
    'http://localhost:3000', // Alternative dev port
    'https://lovable.dev/', // Lovable Preview
  ];
  
  // Add environment-specific origins if needed
  const customOrigin = Deno.env.get('ALLOWED_ORIGIN');
  if (customOrigin) {
    allowedOrigins.push(customOrigin);
  }
  
  return allowedOrigins;
};

const getCorsHeaders = (origin?: string | null) => {
  const allowedOrigins = getAllowedOrigins();
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : 'null';
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  };
};

const VOXY_SYSTEM_PROMPT = `Tu es Voxy, le chatbot IA de VoxNow, une solution SaaS belge qui automatise la gestion des messages vocaux manqués pour les cabinets d'avocats.

CONTEXTE VOXNOW :
VoxNow résout le problème des avocats qui ratent des appels importants quand ils sont occupés (audience, réunion, fermé). Ces appels deviennent des messages vocaux qu'ils n'ont pas le temps d'écouter.

SOLUTION VOXNOW :

- Transcription et résumé automatique par IA en quelques secondes
- Envoi direct par e-mail au cabinet
- Réponse automatique par SMS au client en fonction de sa demande

FONCTIONNEMENT :
1. Abonnement mensuel 90€
2. Enregistrement du message d'accueil sur https://voxnow.be/recording
3. Réception des codes de déviation à taper sur le téléphone
4. Redirection automatique et transcription par e-mail

PRIX : 90€/mois TTC, sans engagement, transcriptions illimitées, paiement Stripe, support inclus

CIBLE : Avocats indépendants, cabinets petite/moyenne taille, secrétaires juridiques

TON & STYLE :
- Toujours en français
- Chaleureux, professionnel et rassurant
- Pas trop technique mais clair
- Réponses TRÈS courtes (maximum 2-3 phrases), sois ultra direct
- Mets en valeur les bénéfices (gain de temps, réactivité, image pro)
- IMPÉRATIF : Garde tes réponses courtes, comme un SMS

QUESTIONS FRÉQUENTES :
- Comment ça fonctionne ? → Redirection + transcription automatique par e-mail
- Prix ? → 90€/mois TTC sans engagement, tout inclus
- Compatible ? → Tous téléphones et opérateurs belges
- Sécurisé ? → Cryptage, serveurs Europe, e-mail privé
- Installation ? → Non, juste un code de redirection
- Test ? → Pas d'essai gratuit mais démo personnalisée
- Plusieurs avocats ? → Une ligne par cabinet ou par avocat

REDIRECTION CTA :
Après quelques échanges, propose une démo : "Je peux vous proposer une démo personnalisée de VoxNow. Réservez une démo grâce au bouton ci-dessous"

Réponds toujours comme Voxy, de manière utile et engageante !`

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatCompletionRequest {
  messages: ChatMessage[]
  maxTokens?: number
  temperature?: number
}

serve(async (req) => {
  // Get origin from request headers for CORS validation
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, maxTokens = 500, temperature = 0.7 } = await req.json() as ChatCompletionRequest

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid messages array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate messages format
    for (const message of messages) {
      if (!message.role || !message.content || !['system', 'user', 'assistant'].includes(message.role)) {
        return new Response(
          JSON.stringify({ error: 'Invalid message format. Each message must have role and content.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY environment variable is not set')
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Processing chat completion with ${messages.length} messages`)

    // Prepare messages with system prompt
    const chatMessages = [
      { role: 'system', content: VOXY_SYSTEM_PROMPT },
      ...messages.filter(msg => msg.role !== 'system') // Remove any system message from client
    ]

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: chatMessages,
        max_tokens: maxTokens,
        temperature: temperature
      })
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error(`OpenAI API error: ${openaiResponse.status} - ${errorText}`)
      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de la communication avec le service d\'IA',
          details: 'Service temporairement indisponible'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiResult = await openaiResponse.json()
    
    // Extract the response content
    const responseContent = openaiResult.choices[0]?.message?.content
    
    if (!responseContent) {
      console.error('No content in OpenAI response:', openaiResult)
      return new Response(
        JSON.stringify({ 
          error: 'Aucune réponse générée',
          content: "Désolé, je n'ai pas pu traiter votre demande. Pouvez-vous reformuler ?"
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Successfully processed chat completion')

    return new Response(
      JSON.stringify({ 
        success: true,
        content: responseContent,
        usage: openaiResult.usage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in chat-completion function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Erreur interne du serveur',
        content: "Désolé, je rencontre un problème technique. Vous pouvez me reposer votre question ou contacter directement notre équipe à sacha@voxnow.be"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
