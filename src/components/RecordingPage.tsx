import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mic, MessageSquare, Zap } from 'lucide-react';
import { VoiceRecorder } from './VoiceRecorder';
import { trackViewContent, trackCustomEvent } from '../utils/fbPixel';

export function RecordingPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Track recording page view
    trackViewContent({
      content_name: 'Recording Page',
      content_category: 'Voice Recording'
    });
  }, []);

  const handleRecordingComplete = (audioBlob: Blob) => {
    console.log('Recording completed:', audioBlob);
    // Additional handling if needed
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
                source: 'Recording Page'
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
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 px-6 py-3 rounded-full shadow-sm mb-6">
              <Mic className="h-5 w-5 text-vox-blue mr-2" />
              <span className="text-gray-700 font-medium">Configuration de votre service VoxNow</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Configurez votre messagerie vocale
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Enregistrez le message d'accueil que vos clients entendront quand ils vous appellent. 
              Nous configurerons ensuite votre service VoxNow personnalisé.
            </p>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-vox-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-6 w-6 text-vox-blue" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Configuration personnalisée</h3>
                <p className="text-gray-600 text-sm">Nous analysons vos besoins pour configurer le service</p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-now-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-now-green" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Code de déviation</h3>
                <p className="text-gray-600 text-sm">Vous recevrez un code personnalisé pour activer le service</p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-light-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeft className="h-6 w-6 text-light-blue transform rotate-180" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Activation rapide</h3>
                <p className="text-gray-600 text-sm">Service opérationnel en quelques minutes</p>
              </div>
            </div>
          </div>

          {/* Voice Recorder Component */}
          <div className="max-w-2xl mx-auto">
            <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
          </div>

          {/* How it works */}
          <div className="mt-16 bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
            <h2 className="text-2xl font-bold gradient-text text-center mb-8">
              Processus de configuration
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-vox-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-vox-blue">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Remplissez</h3>
                <p className="text-gray-600 text-sm">Saisissez vos informations de contact</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-now-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-now-green">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Enregistrez</h3>
                <p className="text-gray-600 text-sm">Laissez un message vocal pour configurer votre messagerie</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-light-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-light-blue">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Configurons</h3>
                <p className="text-gray-600 text-sm">Notre équipe configure votre service personnalisé</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-light-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-light-green">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Activez</h3>
                <p className="text-gray-600 text-sm">Utilisez le code reçu pour activer votre ligne</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-vox-blue to-now-green p-[1px] rounded-2xl">
              <div className="bg-white px-8 py-6 rounded-2xl">
                <h3 className="text-xl font-bold bg-gradient-to-r from-vox-blue to-now-green bg-clip-text text-transparent mb-4">
                  Besoin d'aide pour la configuration ?
                </h3>
                <button
                  onClick={() => {
                    trackCustomEvent('CalendlyClick', {
                      content_name: 'Demo Booking from Recording Page',
                      content_category: 'Lead Generation'
                    });
                    window.open('https://calendly.com/hey-sachadelcourt/voxnow', '_blank');
                  }}
                  className="inline-flex items-center bg-gradient-to-r from-vox-blue to-now-green text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Réserver une démo
                  <ArrowLeft className="ml-2 h-5 w-5 transform rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}