// API sécurisée pour les données Huez - Clé API masquée
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vérification d'authentification simple
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer huez-secure-token-2025') {
      return res.status(401).json({ error: 'Non autorisé' });
    }

    // Configuration Airtable sécurisée (côté serveur uniquement)
    // La clé API est maintenant hardcodée côté serveur et invisible du client
    const AIRTABLE_API_KEY = 'patozC94xMMGI4CTT.e4967e60f6012ef4e3e8f82eac56fdaef15452ab3c56d06c1de888c1e109367e';
    const AIRTABLE_URL = 'https://api.airtable.com/v0/appaHCYACotTr76A1/Voicemails%20%28huez%29?sort%5B0%5D%5Bfield%5D=fldbn2gYZ0pOIFCwv&sort%5B0%5D%5Bdirection%5D=desc';

    // Appel à l'API Airtable
    const response = await fetch(AIRTABLE_URL, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur Airtable: ${response.status}`);
    }

    const data = await response.json();
    
    // Optionnel : masquer certaines données sensibles avant de les renvoyer
    const sanitizedData = {
      ...data,
      records: data.records?.map(record => ({
        ...record,
        // On peut masquer certains champs si nécessaire
        fields: {
          ...record.fields,
          // Exemple : masquer les numéros de téléphone partiellement
          // 'Caller Phone number': record.fields['Caller Phone number']?.replace(/(\d{3})\d{3}(\d{3})/, '$1***$2')
        }
      }))
    };
    
    return res.status(200).json(sanitizedData);

  } catch (error) {
    console.error('Erreur API:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de la récupération des données',
      // Ne pas exposer les détails de l'erreur en production
      details: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
  }
}