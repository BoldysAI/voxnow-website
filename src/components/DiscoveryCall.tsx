import { CheckCircle2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const DiscoveryCall = () => {
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);

  useEffect(() => {
    // Check if Calendly is already available
    if (window.Calendly) {
      setCalendlyLoaded(true);
      return;
    }

    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    
    script.onload = () => {
      setCalendlyLoaded(true);
    };

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (calendlyLoaded && window.Calendly) {
      // Initialize the inline widget
      window.Calendly.initInlineWidget({
        url: 'https://calendly.com/hey-sachadelcourt/voxnow',
        parentElement: document.querySelector('.calendly-inline-widget'),
        prefill: {},
        utm: {}
      });
    }
  }, [calendlyLoaded]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm fixed w-full z-50 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <img 
                src="https://res.cloudinary.com/drdqov4zs/image/upload/v1741862267/My%20Brand/LOGO_VoxNow_d6fbzq.png"
                alt="VoxNow Logo"
                className="h-12 hover:opacity-80 transition-opacity cursor-pointer"
              />
            </Link>
            <Link
              to="/"
              className="text-vox-blue hover:text-now-green transition-colors duration-300 flex items-center font-medium"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="pt-32 pb-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Découvrons comment <span className="gradient-text">transformer votre cabinet</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                Réservez votre appel découverte gratuit de 15 minutes pour découvrir comment VoxNow peut révolutionner la gestion de vos appels
              </p>
            </div>

            {/* Solution Summary */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-vox-blue to-now-green rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      📞 Vos demandes juridiques téléphoniques résumées et traitées instantanément
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Vos messages vocaux transcrits et résumés en quelques secondes par email
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-now-green to-light-green rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      📱 Réponse automatique intelligente
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Vos clients reçoivent un SMS instantané qui répond à leur demande et les accompagne dans l'ouverture de dossier
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendly Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-vox-blue to-now-green p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-white mr-3" />
                  <h2 className="text-3xl font-bold text-white">
                    Réservez votre appel découverte gratuit
                  </h2>
                </div>
                <p className="text-blue-100 text-lg">
                  15 minutes pour comprendre vos besoins et vous présenter une solution personnalisée
                </p>
              </div>
              
              <div className="p-8">
                {/* Calendly Inline Widget */}
                {calendlyLoaded ? (
                  <div 
                    className="calendly-inline-widget" 
                    style={{ minWidth: '320px', height: '700px' }}
                  ></div>
                ) : (
                  <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vox-blue"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="text-center mt-16">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 px-6 py-3 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-gradient-to-r from-vox-blue to-now-green rounded-full mr-3 animate-pulse"></div>
                <span className="text-gray-700 font-medium">+20 cabinets belges nous font déjà confiance</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default DiscoveryCall;