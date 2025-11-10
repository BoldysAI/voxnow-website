import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Gift, ArrowRight, Calendar } from 'lucide-react';
import { FreeTrialForm } from './FreeTrialForm';
import { trackViewContent } from '../utils/fbPixel';
export function FreeTrialPage() {
  useEffect(() => {
    // Track page view
    trackViewContent({
      content_name: 'Free Trial Page',
      content_category: 'Landing Page'
    });

    // Scroll to top
    window.scrollTo(0, 0);
  }, []);
  return <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm fixed w-full z-50 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/">
                <img src="https://res.cloudinary.com/drdqov4zs/image/upload/v1741862267/My%20Brand/LOGO_VoxNow_d6fbzq.png" alt="VoxNow Logo" className="h-12 hover:opacity-80 transition-opacity cursor-pointer" />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-vox-blue hover:text-now-green transition-colors duration-300 font-medium">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-4 px-4 bg-gradient-to-br from-vox-blue/5 via-white to-now-green/5 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-vox-blue/10 to-now-green/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-vox-blue/5 to-now-green/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <button className="mb-8 inline-flex items-center bg-white/90 backdrop-blur-sm border border-gray-200 px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Gift className="h-6 w-6 text-now-green mr-3 group-hover:scale-110 transition-transform" />
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors font-semibold">
                Offres exclusives early adopters 🎁
              </span>
            </button>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Essai gratuit de <span className="bg-gradient-to-r from-vox-blue to-now-green bg-clip-text text-transparent">30 jours</span>
            </h1>

            <div className="grid md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
              <div className="flex items-start space-x-3 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-vox-blue to-now-green rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-gray-700 font-medium text-left">
                  Transcription instantanée
                </p>
              </div>
              
              <div className="flex items-start space-x-3 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-now-green to-light-green rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-gray-700 font-medium text-left">
                  Résumé IA
                </p>
              </div>

              <div className="flex items-start space-x-3 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-light-blue to-vox-blue rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-gray-700 font-medium text-left">
                  SMS automatique
                </p>
              </div>

              <div className="flex items-start space-x-3 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-light-green to-now-green rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-gray-700 font-medium text-left">
                  Dashboard personnalisé
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <FreeTrialForm />
            
            {/* Info sections after form */}
            <div className="mt-12 space-y-6">
              

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 text-center">
                <p className="text-gray-600 mb-4">
                  Pour intégrer des automatisations avancées (intégration agenda, transferts vers collaborateurs, workflows personnalisés), 
                  réservez une démo personnalisée avec notre équipe.
                </p>
                <a href="https://calendly.com/hey-sachadelcourt/voxnow" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-gradient-to-r from-vox-blue to-now-green text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                  <Calendar className="mr-2 h-5 w-5" />
                  Réserver une démo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ce qui est inclus dans votre <span className="bg-gradient-to-r from-vox-blue to-now-green bg-clip-text text-transparent">essai gratuit</span>
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez toute la puissance de VoxNow pendant 30 jours, sans engagement
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-vox-blue to-light-blue rounded-full p-3 flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Transcription automatique</h3>
                    <p className="text-gray-600">
                      Chaque message vocal est transcrit instantanément et envoyé par email avec une précision juridique.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-now-green to-light-green rounded-full p-3 flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Résumés intelligents</h3>
                    <p className="text-gray-600">
                      Notre IA extrait les points clés et les actions à entreprendre pour vous faire gagner du temps.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-light-blue to-vox-blue rounded-full p-3 flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Réponse SMS automatique</h3>
                    <p className="text-gray-600">
                      Un SMS est envoyé automatiquement au correspondant pour récapituler sa demande et lui assurer bonne réception.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-vox-blue to-now-green rounded-full p-3 flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Installation simple</h3>
                    <p className="text-gray-600">
                      Activation en 30 secondes via un simple code de déviation. Aucune installation technique requise.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-light-green to-now-green rounded-full p-3 flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Support dédié</h3>
                    <p className="text-gray-600">
                      Notre équipe vous accompagne durant toute la période d'essai pour une configuration optimale.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-vox-blue to-light-blue rounded-full p-3 flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Dashboard personnalisé</h3>
                    <p className="text-gray-600">
                      Accès à votre dashboard personnalisé pour récapituler tous vos emails et vos demandes en un coup d'œil.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust indicator */}
            <div className="text-center mt-12">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 px-6 py-3 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-gradient-to-r from-vox-blue to-now-green rounded-full mr-2 animate-pulse"></div>
                <span className="text-gray-700 font-medium">+20 cabinets belges nous font déjà confiance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-vox-blue/5 to-now-green/5">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Prêt à transformer votre gestion des appels ?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Rejoignez les avocats qui économisent plus de 2 heures par semaine avec VoxNow
            </p>
            <button onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }} className="inline-flex items-center bg-gradient-to-r from-vox-blue to-now-green text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Commencer l'essai gratuit
              <ArrowRight className="ml-3 h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t border-gray-100">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">
            © 2025 VoxNow. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>;
}