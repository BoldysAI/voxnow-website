import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Shield, CheckCircle, Star, Clock } from 'lucide-react';
import { trackViewContent, trackCustomEvent } from '../utils/fbPixel';

export function OngoingFreeTrialPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Track ongoing free trial page view
    trackViewContent({
      content_name: 'Ongoing Free Trial Page',
      content_category: 'Subscription'
    });
  }, []);

  const handleSubscriptionClick = () => {
    // Track subscription click
    trackCustomEvent('SubscriptionClick', {
      content_name: 'Stripe Free Trial Subscription',
      content_category: 'Conversion',
      value: 90,
      currency: 'EUR'
    });
    window.open('https://buy.stripe.com/8x85kF8Za4DN29v5pIeAg05', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm fixed w-full z-50 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/">
                <img 
                  src="https://res.cloudinary.com/drdqov4zs/image/upload/v1741862267/My%20Brand/LOGO_VoxNow_d6fbzq.png"
                  alt="VoxNow Logo"
                  className="h-12 hover:opacity-80 transition-opacity cursor-pointer"
                />
              </Link>
            </div>
            <Link
              to="/"
              className="text-vox-blue hover:text-now-green transition-colors duration-300 flex items-center font-medium"
              onClick={() => trackCustomEvent('BackToHomeClick', { 
                content_name: 'Navigation',
                source: 'Ongoing Free Trial Page'
              })}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-orange-50 border border-orange-200 px-6 py-3 rounded-full shadow-sm mb-6">
              <Clock className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-orange-700 font-medium">Essai gratuit en cours - 7 jours restants</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Vous êtes à mi-parcours !
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Vous avez testé VoxNow pendant la moitié de votre période d'essai. Il vous reste 
              <strong className="text-vox-blue"> 7 jours </strong>pour profiter gratuitement du service. 
              Configurez dès maintenant votre moyen de paiement pour assurer la continuité.
            </p>
          </div>

          {/* Subscription Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 mb-12">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-vox-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold gradient-text mb-4">
                Configurer votre abonnement
              </h2>
              
              <div className="flex items-center justify-center mb-6">
                <span className="text-5xl font-bold text-vox-blue">90€</span>
                <span className="text-xl text-gray-600 ml-2">/mois</span>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                <p className="text-orange-800 font-semibold mb-2">
                  🚀 Vous ne serez pas facturé maintenant !
                </p>
                <p className="text-orange-700 text-sm">
                  Entrez simplement votre moyen de paiement pour assurer la continuité du service. 
                  Vous pouvez encore vous désabonner pendant les 7 jours qui suivent sans aucun frais. 
                  Si vous ne faites rien, vous serez automatiquement débité dans 7 jours et recevrez 
                  une facture chaque mois.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-now-green mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Service déjà configuré</p>
                    <p className="text-gray-600 text-sm">Votre messagerie intelligente continue de fonctionner</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-now-green mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Transcription et résumés</p>
                    <p className="text-gray-600 text-sm">Continuez à recevoir vos messages transcrits par email</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-now-green mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Automatisations personnalisées</p>
                    <p className="text-gray-600 text-sm">Vos SMS automatiques et intégrations restent actifs</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-now-green mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Aucune interruption</p>
                    <p className="text-gray-600 text-sm">Transition transparente depuis votre période d'essai</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-now-green mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Support continu</p>
                    <p className="text-gray-600 text-sm">Accompagnement et optimisations en cours d'usage</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-now-green mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Évolutions incluses</p>
                    <p className="text-gray-600 text-sm">Nouvelles fonctionnalités et améliorations automatiques</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button
                onClick={handleSubscriptionClick}
                className="bg-gradient-to-r from-orange-500 to-vox-blue text-white px-12 py-4 rounded-full text-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center mx-auto"
              >
                <CreditCard className="h-6 w-6 mr-3" />
                Configurer mon moyen de paiement
              </button>
              
              <p className="text-gray-500 text-sm mt-4">
                Paiement sécurisé par Stripe • Aucun débit avant 7 jours • Résiliable sans frais pendant 7 jours
              </p>
            </div>
          </div>

          {/* Security & Trust */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Paiement sécurisé</h3>
              <p className="text-gray-600 text-sm">Transactions protégées par Stripe, leader mondial du paiement en ligne</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">7 jours pour décider</h3>
              <p className="text-gray-600 text-sm">Résiliez sans frais pendant les 7 prochains jours de votre essai gratuit</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Service premium</h3>
              <p className="text-gray-600 text-sm">Support client dédié et accompagnement personnalisé inclus</p>
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-gray-200">
            <h3 className="text-2xl font-bold gradient-text text-center mb-8">
              Que se passe-t-il ensuite ?
            </h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Configuration immédiate</h4>
                <p className="text-gray-600 text-sm">Votre moyen de paiement est enregistré de façon sécurisée</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-now-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-now-green">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Essai continue</h4>
                <p className="text-gray-600 text-sm">Profitez encore de 7 jours gratuits complets</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-light-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-light-blue">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Débit automatique</h4>
                <p className="text-gray-600 text-sm">Dans 7 jours : premier débit et facture par email</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-light-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-light-green">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Service continu</h4>
                <p className="text-gray-600 text-sm">Votre service VoxNow reste actif sans interruption</p>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-xl font-bold text-vox-blue mb-4">
                Besoin d'aide ou d'optimisations ?
              </h3>
              <p className="text-gray-600 mb-6">
                Notre équipe reste disponible pour optimiser votre utilisation de VoxNow
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:sacha@voxnow.be"
                  className="bg-gradient-to-r from-vox-blue to-now-green text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  onClick={() => trackCustomEvent('ContactSupport', {
                    content_name: 'Email Support',
                    source: 'Ongoing Free Trial Page'
                  })}
                >
                  Nous contacter par email
                </a>
                <button
                  onClick={() => {
                    trackCustomEvent('CalendlyClick', {
                      content_name: 'Demo Booking from Ongoing Free Trial',
                      content_category: 'Support'
                    });
                    window.open('https://calendly.com/hey-sachadelcourt/voxnow', '_blank');
                  }}
                  className="bg-white border-2 border-vox-blue text-vox-blue px-6 py-3 rounded-lg font-semibold hover:bg-vox-blue hover:text-white transition-all duration-300 flex items-center justify-center"
                >
                  Réserver un appel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}