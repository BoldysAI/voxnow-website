import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import { trackViewContent, trackCustomEvent } from '../utils/fbPixel';

export function SuccessPage() {
  useEffect(() => {
    // Track success page view
    trackViewContent({
      content_name: 'Success Page',
      content_category: 'Conversion'
    });
  }, []);

  const scrollToCalendly = () => {
    // Track Calendly click from success page
    trackCustomEvent('CalendlyClickFromSuccess', {
      content_name: 'Demo Booking from Success',
      content_category: 'Lead Generation'
    });
    
    // Navigate back to home and scroll to Calendly
    window.location.href = '/#calendly';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        <Link
          to="/"
          className="text-vox-blue hover:text-now-green transition-colors duration-300 flex items-center mb-8"
          onClick={() => trackCustomEvent('BackToHomeClick', { 
            content_name: 'Navigation',
            source: 'Success Page'
          })}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour à l'accueil
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold gradient-text mb-6">
              Merci pour vos réponses !
            </h1>

            <p className="text-gray-600 mb-8">
              Vos réponses ont été enregistrées avec succès. Pour aller plus loin et découvrir comment VoxNow peut transformer votre gestion des messages vocaux, réservons un appel ensemble !
            </p>

            <button
              onClick={scrollToCalendly}
              className="bg-gradient-to-r from-vox-blue to-now-green text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center mx-auto"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Réserver un appel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}