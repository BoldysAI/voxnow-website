import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Calendar,
  MessageCircle, 
  Lock,
  FileText,
  Mail,
  Brain,
  Linkedin,
  PhoneCall,
  Link2,
  Gift,
  Shield,
  Users,
  BarChart3,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Auth } from './components/Auth';
import { FreeTrialForm } from './components/FreeTrialForm';
import { VoiceMessage } from './components/VoiceMessage';
import { WelcomeForm } from './components/WelcomeForm';
import { SuccessPage } from './components/SuccessPage';
import { TermsAndConditions } from './components/TermsAndConditions';
import { trackViewContent, trackCustomEvent } from './utils/fbPixel';
import { Dashboard } from './components/Dashboard';
import { RecordingPage } from './components/RecordingPage';
import { PaymentPage } from './components/PaymentPage';
import { BlogSection } from './components/BlogSection';
import { BlogList } from './components/BlogList';
import { BlogPost } from './components/BlogPost';
import { Chatbot } from './components/Chatbot';
import { HuezDashboard } from './components/HuezDashboard';
import { BlogArticle1 } from './components/BlogArticle1';
import { BlogArticle2 } from './components/BlogArticle2';

declare global {
  interface Window {
    Calendly: any;
  }
}

function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();
  const testimonials = [
    {
      text: "VoxNow me fait gagner un temps précieux : plus besoin d'écouter chaque message vocal, je reçois une transcription claire par mail. Cela me permet d'agir immédiatement selon l'urgence, avec la certitude de ne rien oublier et de tout gérer.",
      author: "Bastien Lombaerd",
      role: "Avocat au barreau de Bruxelles",
      image: "https://res.cloudinary.com/drdqov4zs/image/upload/v1743539346/Screenshot_2025-04-01_at_21.26.43_ce7kuf.png",
      linkedin: "https://www.linkedin.com/in/bastien-lombaerd-a432361a6/",
      email: "bastien.lombaerd@avocat.be"
    },
    {
      text: "VoxNow a transformé la gestion de mes messages vocaux. Je n'ai plus besoin d'écouter des dizaines de messages : je lis tout instantanément. En plus, les correspondants reçoivent un lien automatique vers mon calendrier si c'est pour ça qu'ils appellent, vraiment efficace !",
      author: "Philippe Corbisier",
      role: "Head of Sales @Leexi",
      image: "https://res.cloudinary.com/drdqov4zs/image/upload/v1743541968/Screenshot_2025-04-01_at_22.11.58_da4kk2.png",
      linkedin: "https://www.linkedin.com/in/philippecorbisier/",
      email: "philippe@leexi.eu"
    },
    {
      text: "Avant VoxNow, je perdais beaucoup de temps à écouter et organiser mes messages. Maintenant, tout est transcrit et surtout organisé !",
      author: "Alexandre de Clercq",
      role: "CEO @Jay",
      image: "https://res.cloudinary.com/drdqov4zs/image/upload/v1743541965/Screenshot_2025-04-01_at_22.12.25_c2palg.png",
      linkedin: "https://www.linkedin.com/in/alexandredeclercq/",
      email: "alexandre@jay.eu"
    },
    {
      text: "Je passe des heures par semaine à écouter ma messagerie vocale avec deux tiers de messages sans intérêt, une vraie perte de temps que VoxNow a compris comment résoudre !",
      author: "Vasco Calixto",
      role: "Commercial @Amazon Web Services",
      image: "https://res.cloudinary.com/drdqov4zs/image/upload/v1743539434/Screenshot_2025-04-01_at_21.27.24_pp6nly.png",
      linkedin: "https://www.linkedin.com/in/vasco-calixto/",
      email: "vkferrei@amazon.es"
    }
  ];

  useEffect(() => {
    // Track page view for home page
    trackViewContent({
      content_name: 'Home Page',
      content_category: 'Landing Page'
    });

    // No automatic rotation - stays on Bastien Lombaerd by default
  }, []);

  useEffect(() => {
    if (window.Calendly) {
      window.Calendly.initInlineWidget({
        url: 'https://calendly.com/hey-sachadelcourt/voxnow',
        parentElement: document.querySelector('.calendly-inline-widget'),
        prefill: {},
        utm: {}
      });
    }
  }, []);

  const scrollToCalendly = () => {
    // Track Calendly scroll
    trackCustomEvent('CalendlyScroll', {
      content_name: 'Demo Booking Scroll',
      content_category: 'Lead Generation'
    });
    
    // Scroll to Calendly embed section
    const calendlySection = document.querySelector('.calendly-inline-widget');
    if (calendlySection) {
      calendlySection.scrollIntoView({ behavior: 'smooth' });
    }
  };



  // Function to handle trial form scroll
  const handleTrialFormClick = () => {
    console.log('handleTrialFormClick called successfully');
    // Track trial form access
    trackCustomEvent('TrialFormAccess', {
      content_name: 'Free Trial Form',
      content_category: 'Lead Generation'
    });
    
    // Scroll to Free Trial Form section
    const trialFormSection = document.querySelector('#free-trial-section');
    if (trialFormSection) {
      trialFormSection.scrollIntoView({ behavior: 'smooth' });
    }
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
            <div className="flex items-center space-x-6">
              <Link
                to="/auth"
                className="text-vox-blue hover:text-now-green transition-colors duration-300 flex items-center font-medium"
                onClick={() => trackCustomEvent('ClientAreaClick', { content_name: 'Client Area Access' })}
              >
                <Lock className="h-5 w-5 mr-2" />
                Espace Client
              </Link>
              <button
                onClick={scrollToCalendly}
                className="bg-gradient-to-r from-vox-blue to-now-green text-white px-8 py-3 rounded-full hover:shadow-xl transition-all duration-300 flex items-center group font-semibold"
              >
                Réserver une démo
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 bg-gradient-to-br from-blue-50/50 via-white to-green-50/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-vox-blue/10 to-now-green/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-light-blue/10 to-light-green/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Vos demandes <span className="bg-gradient-to-r from-vox-blue to-now-green bg-clip-text text-transparent">juridiques téléphoniques</span> résumées et <span className="relative">
                <span className="bg-gradient-to-r from-light-blue to-light-green bg-clip-text text-transparent">traitées instantanément</span>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-vox-blue/30 to-now-green/30 rounded-full shadow-lg"></div>
              </span>
            </h1>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4 bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-vox-blue to-now-green rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <p className="text-lg text-gray-700 font-medium">
                  Vos messages vocaux <span className="text-vox-blue font-semibold">transcrits et résumés</span> en quelques secondes par email
                </p>
              </div>
              
              <div className="flex items-start space-x-4 bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-now-green to-light-green rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <p className="text-lg text-gray-700 font-medium">
                  Vos clients reçoivent un <span className="text-now-green font-semibold">SMS instantané</span> qui répond à leur demande et les accompagne dans l'ouverture de dossier
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mb-8">
              <button
                onClick={() => {
                  console.log('Button clicked - calling handleTrialFormClick');
                  handleTrialFormClick();
                }}
                className="bg-gradient-to-r from-vox-blue to-now-green text-white px-12 py-4 rounded-full text-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                Essai gratuit de 14 jours
              </button>
            </div>

            {/* Trust indicator */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-gradient-to-r from-vox-blue to-now-green rounded-full mr-2 animate-pulse"></div>
                <span className="text-gray-700 font-medium text-sm">+20 cabinets belges nous font déjà confiance</span>
              </div>
            </div>

            {/* Trust indicators avec photos */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-3">
                {[
                  { 
                    name: 'Bastien Lombaerd', 
                    image: 'https://res.cloudinary.com/drdqov4zs/image/upload/v1743539346/Screenshot_2025-04-01_at_21.26.43_ce7kuf.png'
                  },
                  { 
                    name: 'Gilles Rousseau', 
                    image: 'https://res.cloudinary.com/drdqov4zs/image/upload/v1754933128/Screenshot_2025-08-11_at_19.25.20_xsclfm.png'
                  },
                  { 
                    name: 'Geoffroy Huez', 
                    image: 'https://res.cloudinary.com/drdqov4zs/image/upload/v1754933288/Screenshot_2025-08-11_at_19.28.04_fqwjud.png'
                  },
                  { 
                    name: 'Thibault Delaey', 
                    image: 'https://res.cloudinary.com/drdqov4zs/image/upload/v1754933487/Screenshot_2025-08-11_at_19.31.21_jxramd.png'
                  },
                  { 
                    name: 'Samuel Pochet', 
                    image: 'https://res.cloudinary.com/drdqov4zs/image/upload/v1754934117/Screenshot_2025-08-11_at_19.41.51_bi7rn6.png'
                  }
                ].map((lawyer, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <button
                      onClick={() => {
                        trackCustomEvent('TrustIndicatorClick', {
                          content_name: `${lawyer.name} Photo Click`,
                          content_category: 'Trust Indicator'
                        });
                        // Scroll to testimonial lawyers section
                        const testimonialSection = document.querySelector('#testimonial-lawyers');
                        if (testimonialSection) {
                          testimonialSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg hover:scale-110 transition-transform duration-300 mb-2"
                    >
                      <img
                        src={lawyer.image}
                        alt={lawyer.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <span className="text-xs text-gray-600 text-center">{lawyer.name}</span>
                  </div>
                ))}
                
                {/* Plus indicator */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      trackCustomEvent('TrustIndicatorClick', {
                        content_name: 'More Lawyers Click',
                        content_category: 'Trust Indicator'
                      });
                      // Scroll to testimonial lawyers section
                      const testimonialSection = document.querySelector('#testimonial-lawyers');
                      if (testimonialSection) {
                        testimonialSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-vox-blue/20 to-now-green/20 border-2 border-gray-300 border-dashed flex items-center justify-center mb-2 hover:scale-110 transition-transform duration-300"
                  >
                    <span className="text-2xl text-gray-600 font-bold">+</span>
                  </button>
                  <span className="text-xs text-gray-600 text-center">Et bien plus</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Email Notifications Section */}
      <section id="gain-section" className="pt-4 pb-6 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                Voici ce que vous recevez instantanément par email
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Après chaque message vocal laissé sur votre répondeur, notre IA analyse et vous envoie un résumé complet
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="w-full lg:w-1/2">
                  <div className="space-y-8">
                    <div className="flex items-start space-x-6 bg-gradient-to-r from-blue-50 to-blue-50/50 p-6 rounded-2xl border border-blue-100">
                      <div className="mt-1 bg-vox-blue rounded-full p-3">
                        <PhoneCall className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg mb-2">Identification de l'appelant</p>
                        <p className="text-gray-600">Numéro et informations du correspondant pour une identification immédiate</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-6 bg-gradient-to-r from-green-50 to-green-50/50 p-6 rounded-2xl border border-green-100">
                      <div className="mt-1 bg-now-green rounded-full p-3">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg mb-2">Transcription complète</p>
                        <p className="text-gray-600">Le message vocal converti en texte mot pour mot avec une précision juridique</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-6 bg-gradient-to-r from-purple-50 to-purple-50/50 p-6 rounded-2xl border border-purple-100">
                      <div className="mt-1 bg-light-blue rounded-full p-3">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg mb-2">Résumé intelligent</p>
                        <p className="text-gray-600">Les points essentiels et actions à entreprendre extraits par notre IA spécialisée</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-6 bg-gradient-to-r from-orange-50 to-orange-50/50 p-6 rounded-2xl border border-orange-100">
                      <div className="mt-1 bg-light-green rounded-full p-3">
                        <Link2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg mb-2">Accès sécurisé au fichier audio</p>
                        <p className="text-gray-600">Lien protégé vers l'enregistrement original pour vos archives juridiques</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2 flex items-center">
                  <div className="relative h-[600px] w-full">
                    <img
                      src="https://res.cloudinary.com/drdqov4zs/image/upload/v1753823463/VoxNow_-_Exemple_-_Final_veeuom.png"
                      alt="Interface VoxNow - Exemple d'email reçu"
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                    <div className="absolute -z-10 w-full h-full blur-3xl opacity-20 bg-gradient-to-r from-vox-blue via-now-green to-light-blue rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI SMS Response Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                L'IA comprend et répond instantanément
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Notre intelligence artificielle analyse chaque message vocal et envoie automatiquement 
                une réponse personnalisée par SMS, adaptée au domaine juridique de votre cabinet.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 md:p-12 border border-gray-200">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="w-full lg:w-1/2">
                  <div className="space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-vox-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="h-6 w-6 text-vox-blue" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">Message vocal reçu</h4>
                          <p className="text-gray-600 italic">
                            "Bonjour, je souhaiterais ouvrir un dossier pour un divorce par consentement mutuel..."
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className="w-1 h-12 bg-gradient-to-b from-vox-blue to-now-green rounded-full"></div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-now-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="h-6 w-6 text-now-green" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">IA analyse et répond</h4>
                          <p className="text-gray-600">
                            L'intelligence artificielle identifie automatiquement le type de demande 
                            et envoie une réponse personnalisée avec les informations utiles.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-vox-blue/5 to-now-green/5 p-6 rounded-2xl border border-gray-200">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-light-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <FileText className="h-6 w-6 text-light-blue" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">Intégration Symplicy</h4>
                          <p className="text-gray-600 mb-3">
                            Pour les clients utilisant <a href="https://symplicy.com" target="_blank" rel="noopener noreferrer" className="text-vox-blue hover:text-now-green font-semibold underline">Symplicy.com</a>, 
                            VoxNow peut automatiquement envoyer un formulaire d'ouverture de dossier personnalisé.
                          </p>
                          <div className="bg-white p-4 rounded-lg border border-gray-100">
                            <p className="text-sm text-gray-700 font-medium">
                              ✨ Formulaire d'ouverture de dossier envoyé automatiquement
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Le client peut remplir ses informations avant même votre premier contact
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full lg:w-1/2 flex items-center justify-center">
                  <div className="relative">
                    <img
                      src="https://res.cloudinary.com/drdqov4zs/image/upload/v1753825610/VoxNow_-_exemple_SMS_final_xk36ye.png"
                      alt="Exemple de SMS automatique envoyé par VoxNow - Réponse intelligente pour demande de divorce"
                      className="max-w-xs h-auto drop-shadow-2xl rounded-2xl mx-auto"
                    />
                    <div className="absolute -z-10 w-full h-full blur-3xl opacity-20 bg-gradient-to-r from-vox-blue via-now-green to-light-blue rounded-full transform scale-110"></div>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <div className="inline-block bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    🚀 Résultat : Client satisfait, avocat informé, dossier pré-qualifié
                  </p>
                  <p className="text-gray-600">
                    Tout cela sans aucune intervention manuelle de votre part
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Pourquoi les avocats choisissent VoxNow
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une solution pensée spécifiquement pour les contraintes et besoins des cabinets d'avocats
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-light-green/20 to-light-green/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-8 w-8 text-light-green" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-vox-blue text-center">Gain de temps considérable</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Économisez jusqu'à 1 heure par jour en accédant instantanément aux transcriptions et résumés. 
                Fini les "1230" puis "1,2,3"... Concentrez-vous sur votre expertise juridique !
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50/30 p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-light-blue/20 to-light-blue/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-light-blue" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-vox-blue text-center">Service client optimisé</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Réponses automatiques et personnalisées selon le domaine juridique. 
                Vos clients reçoivent une réponse immédiate même en votre absence.
              </p>
            </div>

            <div className="bg-gradient-to-br from-white to-purple-50/30 p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-now-green/20 to-now-green/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-now-green" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-vox-blue text-center">Sécurité juridique renforcée</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Ne perdez plus jamais un client ou une opportunité. 
                Chaque message est archivé, transcrit et traité selon vos procédures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 gradient-text">
            Ce qu'en disent nos utilisateurs
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="transition-opacity duration-500">
                <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                  <div className="text-center mb-8">
                    <div className="flex justify-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-8 text-lg leading-relaxed text-center">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div className="flex items-center">
                    <div className="flex items-center flex-1">
                      <img
                        src={testimonials[currentTestimonial].image}
                        alt={testimonials[currentTestimonial].author}
                        className="w-16 h-16 rounded-full mr-4 border-2 border-gray-100"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-vox-blue text-lg">{testimonials[currentTestimonial].author}</p>
                        <p className="text-gray-600 mb-2">{testimonials[currentTestimonial].role}</p>
                        <div className="flex items-center space-x-2">
                          <a
                            href={testimonials[currentTestimonial].linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-vox-blue transition-colors p-1 rounded-full hover:bg-gray-50"
                            onClick={() => trackCustomEvent('TestimonialLinkedInClick', { 
                              author: testimonials[currentTestimonial].author 
                            })}
                          >
                            <Linkedin className="h-5 w-5" />
                          </a>
                          <a
                            href={`mailto:${testimonials[currentTestimonial].email}`}
                            className="text-gray-400 hover:text-vox-blue transition-colors p-1 rounded-full hover:bg-gray-50"
                            onClick={() => trackCustomEvent('TestimonialEmailClick', { 
                              author: testimonials[currentTestimonial].author 
                            })}
                          >
                            <Mail className="h-5 w-5" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const nextIndex = (currentTestimonial + 1) % testimonials.length;
                        setCurrentTestimonial(nextIndex);
                      }}
                      className="text-gray-400 hover:text-vox-blue transition-colors p-2 rounded-full hover:bg-gray-50 ml-4"
                      aria-label="Témoignage suivant"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-8 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-now-green w-8' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Lawyers Section */}
      <section id="testimonial-lawyers" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold gradient-text mb-4">
              Ces cabinets nous font déjà confiance
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les avocats qui ont déjà adopté VoxNow pour optimiser leur gestion des appels
            </p>
          </div>

          {/* Scrolling lawyer cards */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll space-x-8">
              {/* First set */}
              <div className="flex space-x-8 min-w-max">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 min-w-[280px] hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://res.cloudinary.com/drdqov4zs/image/upload/v1754933128/Screenshot_2025-08-11_at_19.25.20_xsclfm.png"
                      alt="Gilles Rousseau"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Gilles Rousseau</h3>
                      <p className="text-gray-600 text-sm mb-2">Avocat au Barreau</p>
                      <div className="flex space-x-2">
                        <a
                          href="https://www.linkedin.com/in/gilles-rousseau-8a56a8144/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerLinkedInClick', {
                            content_name: 'Gilles Rousseau LinkedIn',
                            content_category: 'Social Proof'
                          })}
                        >
                          LinkedIn
                        </a>
                        <span className="text-gray-300">•</span>
                        <a
                          href="mailto:gilles.rousseau@avocat.be"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerEmailClick', {
                            content_name: 'Gilles Rousseau Email',
                            content_category: 'Social Proof'
                          })}
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 min-w-[280px] hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://res.cloudinary.com/drdqov4zs/image/upload/v1754933288/Screenshot_2025-08-11_at_19.28.04_fqwjud.png"
                      alt="Geoffroy Huez"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Geoffroy Huez</h3>
                      <p className="text-gray-600 text-sm mb-2">Avocat au Barreau</p>
                      <div className="flex space-x-2">
                        <a
                          href="https://www.linkedin.com/in/geoffroy-huez-2589388a/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerLinkedInClick', {
                            content_name: 'Geoffroy Huez LinkedIn',
                            content_category: 'Social Proof'
                          })}
                        >
                          LinkedIn
                        </a>
                        <span className="text-gray-300">•</span>
                        <a
                          href="mailto:mandathuez@gmail.com"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerEmailClick', {
                            content_name: 'Geoffroy Huez Email',
                            content_category: 'Social Proof'
                          })}
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 min-w-[280px] hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://res.cloudinary.com/drdqov4zs/image/upload/v1754933487/Screenshot_2025-08-11_at_19.31.21_jxramd.png"
                      alt="Thibault Delaey"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Thibault Delaey</h3>
                      <p className="text-gray-600 text-sm mb-2">Avocat au Barreau</p>
                      <div className="flex space-x-2">
                        <a
                          href="https://www.linkedin.com/in/delaeythibault/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerLinkedInClick', {
                            content_name: 'Thibault Delaey LinkedIn',
                            content_category: 'Social Proof'
                          })}
                        >
                          LinkedIn
                        </a>
                        <span className="text-gray-300">•</span>
                        <a
                          href="mailto:ta.delaey@avocat.be"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerEmailClick', {
                            content_name: 'Thibault Delaey Email',
                            content_category: 'Social Proof'
                          })}
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 min-w-[280px] hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://res.cloudinary.com/drdqov4zs/image/upload/v1754934117/Screenshot_2025-08-11_at_19.41.51_bi7rn6.png"
                      alt="Samuel Pochet"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Samuel Pochet</h3>
                      <p className="text-gray-600 text-sm mb-2">Avocat au Barreau</p>
                      <div className="flex space-x-2">
                        <a
                          href="https://www.linkedin.com/in/samuel-pochet-827866169/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerLinkedInClick', {
                            content_name: 'Samuel Pochet LinkedIn',
                            content_category: 'Social Proof'
                          })}
                        >
                          LinkedIn
                        </a>
                        <span className="text-gray-300">•</span>
                        <a
                          href="mailto:s.pochet@avocat.be"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerEmailClick', {
                            content_name: 'Samuel Pochet Email',
                            content_category: 'Social Proof'
                          })}
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 min-w-[280px] hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://res.cloudinary.com/drdqov4zs/image/upload/v1743539346/Screenshot_2025-04-01_at_21.26.43_ce7kuf.png"
                      alt="Bastien Lombaerd"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Bastien Lombaerd</h3>
                      <p className="text-gray-600 text-sm mb-2">Avocat au Barreau</p>
                      <div className="flex space-x-2">
                        <a
                          href="https://www.linkedin.com/in/bastien-lombaerd-a432361a6/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerLinkedInClick', {
                            content_name: 'Bastien Lombaerd LinkedIn',
                            content_category: 'Social Proof'
                          })}
                        >
                          LinkedIn
                        </a>
                        <span className="text-gray-300">•</span>
                        <a
                          href="mailto:bastien.lombaerd@avocat.be"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerEmailClick', {
                            content_name: 'Bastien Lombaerd Email',
                            content_category: 'Social Proof'
                          })}
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second set (duplicate for seamless loop) */}
              <div className="flex space-x-8 min-w-max">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 min-w-[280px] hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://res.cloudinary.com/drdqov4zs/image/upload/v1754933128/Screenshot_2025-08-11_at_19.25.20_xsclfm.png"
                      alt="Gilles Rousseau"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Gilles Rousseau</h3>
                      <p className="text-gray-600 text-sm mb-2">Avocat au Barreau</p>
                      <div className="flex space-x-2">
                        <a
                          href="https://www.linkedin.com/in/gilles-rousseau-8a56a8144/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerLinkedInClick', {
                            content_name: 'Gilles Rousseau LinkedIn',
                            content_category: 'Social Proof'
                          })}
                        >
                          LinkedIn
                        </a>
                        <span className="text-gray-300">•</span>
                        <a
                          href="mailto:gilles.rousseau@avocat.be"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerEmailClick', {
                            content_name: 'Gilles Rousseau Email',
                            content_category: 'Social Proof'
                          })}
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 min-w-[280px] hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://res.cloudinary.com/drdqov4zs/image/upload/v1754933288/Screenshot_2025-08-11_at_19.28.04_fqwjud.png"
                      alt="Geoffroy Huez"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Geoffroy Huez</h3>
                      <p className="text-gray-600 text-sm mb-2">Avocat au Barreau</p>
                      <div className="flex space-x-2">
                        <a
                          href="https://www.linkedin.com/in/geoffroy-huez-2589388a/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerLinkedInClick', {
                            content_name: 'Geoffroy Huez LinkedIn',
                            content_category: 'Social Proof'
                          })}
                        >
                          LinkedIn
                        </a>
                        <span className="text-gray-300">•</span>
                        <a
                          href="mailto:mandathuez@gmail.com"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerEmailClick', {
                            content_name: 'Geoffroy Huez Email',
                            content_category: 'Social Proof'
                          })}
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 min-w-[280px] hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://res.cloudinary.com/drdqov4zs/image/upload/v1754933487/Screenshot_2025-08-11_at_19.31.21_jxramd.png"
                      alt="Thibault Delaey"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Thibault Delaey</h3>
                      <p className="text-gray-600 text-sm mb-2">Avocat au Barreau</p>
                      <div className="flex space-x-2">
                        <a
                          href="https://www.linkedin.com/in/delaeythibault/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerLinkedInClick', {
                            content_name: 'Thibault Delaey LinkedIn',
                            content_category: 'Social Proof'
                          })}
                        >
                          LinkedIn
                        </a>
                        <span className="text-gray-300">•</span>
                        <a
                          href="mailto:ta.delaey@avocat.be"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerEmailClick', {
                            content_name: 'Thibault Delaey Email',
                            content_category: 'Social Proof'
                          })}
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 min-w-[280px] hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://res.cloudinary.com/drdqov4zs/image/upload/v1754934117/Screenshot_2025-08-11_at_19.41.51_bi7rn6.png"
                      alt="Samuel Pochet"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Samuel Pochet</h3>
                      <p className="text-gray-600 text-sm mb-2">Avocat au Barreau</p>
                      <div className="flex space-x-2">
                        <a
                          href="https://www.linkedin.com/in/samuel-pochet-827866169/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerLinkedInClick', {
                            content_name: 'Samuel Pochet LinkedIn',
                            content_category: 'Social Proof'
                          })}
                        >
                          LinkedIn
                        </a>
                        <span className="text-gray-300">•</span>
                        <a
                          href="mailto:s.pochet@avocat.be"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerEmailClick', {
                            content_name: 'Samuel Pochet Email',
                            content_category: 'Social Proof'
                          })}
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 min-w-[280px] hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <img
                      src="https://res.cloudinary.com/drdqov4zs/image/upload/v1743539346/Screenshot_2025-04-01_at_21.26.43_ce7kuf.png"
                      alt="Bastien Lombaerd"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Bastien Lombaerd</h3>
                      <p className="text-gray-600 text-sm mb-2">Avocat au Barreau</p>
                      <div className="flex space-x-2">
                        <a
                          href="https://www.linkedin.com/in/bastien-lombaerd-a432361a6/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerLinkedInClick', {
                            content_name: 'Bastien Lombaerd LinkedIn',
                            content_category: 'Social Proof'
                          })}
                        >
                          LinkedIn
                        </a>
                        <span className="text-gray-300">•</span>
                        <a
                          href="mailto:bastien.lombaerd@avocat.be"
                          className="text-vox-blue hover:text-now-green transition-colors text-sm"
                          onClick={() => trackCustomEvent('LawyerEmailClick', {
                            content_name: 'Bastien Lombaerd Email',
                            content_category: 'Social Proof'
                          })}
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <button
              onClick={scrollToCalendly}
              className="bg-gradient-to-r from-vox-blue to-now-green text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Découvrir la solution
            </button>
          </div>
        </div>
      </section>

      {/* Free Trial Section */}
      <section id="free-trial-section" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <button
              onClick={handleTrialFormClick}
              className="mb-8 inline-flex items-center bg-white/90 backdrop-blur-sm border border-gray-200 px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Gift className="h-6 w-6 text-now-green mr-3 group-hover:scale-110 transition-transform" />
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors font-semibold">
                Offres exclusives early adopters 🎁
              </span>
            </button>
            
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Essai gratuit de 14 jours
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              L'essai gratuit de 14 jours comprend la transcription et le résumé instantané de votre messagerie vocale directement dans votre boîte email.
            </p>
            <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
              Pour intégrer des automatisations avancées (SMS automatiques, intégration agenda, transferts vers collaborateurs), 
              réservez une démo personnalisée avec notre équipe.
            </p>
          </div>
          <FreeTrialForm />
        </div>
      </section>

      {/* Beta Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 px-6 py-3 rounded-full shadow-sm mb-6">
                <Zap className="h-5 w-5 text-orange-600 mr-2" />
                <span className="text-orange-700 font-medium">En développement - Bêta</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                Fonctionnalités à venir
              </h2>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Votre gestion de prise de contact centralisée. En plus des emails et des SMS automatiques, 
                centralisez tout pour avoir un suivi en un clin d'œil.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-vox-blue/20 to-vox-blue/10 rounded-xl flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-vox-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Statistiques intelligentes</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Analysez le degré d'urgence des messages, le sentiment de vos prospects, 
                        les domaines juridiques les plus demandés et d'autres statistiques importantes 
                        pour comprendre votre cabinet.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-now-green/20 to-now-green/10 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-now-green" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Suivi centralisé</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Visualisez tous vos contacts en un seul endroit : messages vocaux transcrits, 
                        emails envoyés, SMS de réponse automatique, et statuts de traitement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-light-blue/20 to-light-blue/10 rounded-xl flex items-center justify-center">
                      <Brain className="h-6 w-6 text-light-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Analyses avancées par IA</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Notre IA analyse automatiquement chaque message pour identifier le domaine juridique, 
                        l'urgence, le sentiment et le type de demande pour vous aider à prioriser.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <img
                    src="https://res.cloudinary.com/drdqov4zs/image/upload/v1754916958/Screenshot_2025-08-11_at_14.51.14_qpnfnj.png"
                    alt="Dashboard VoxNow - Vue d'ensemble des messages vocaux et statistiques"
                    className="w-full rounded-2xl shadow-2xl border border-gray-200"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-vox-blue to-now-green text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    Dashboard principal
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="order-2 lg:order-1 space-y-6">
                <div className="relative">
                  <img
                    src="https://res.cloudinary.com/drdqov4zs/image/upload/v1754916958/Screenshot_2025-08-11_at_14.53.01_igj07w.png"
                    alt="Statistiques détaillées VoxNow - Analyse des domaines juridiques et types de demandes"
                    className="w-full rounded-2xl shadow-2xl border border-gray-200"
                  />
                  <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-light-blue to-light-green text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    Statistiques détaillées
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-light-green/20 to-light-green/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-light-green" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Insights métier</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Découvrez les tendances de votre cabinet : quels domaines juridiques 
                        sont les plus demandés, les pics d'activité, et les types de clients qui vous contactent.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400/20 to-orange-400/10 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Priorisation automatique</h3>
                      <p className="text-gray-600 leading-relaxed">
                        L'IA classe automatiquement vos messages par urgence et importance, 
                        vous permettant de traiter en priorité ce qui compte vraiment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Historique complet</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Gardez une trace de tous vos échanges avec recherche avancée, 
                        filtres par urgence, domaine juridique et statut de traitement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 rounded-xl flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Gestion des réponses</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Suivez le statut de vos emails automatiques et SMS de réponse. 
                        Voyez quels clients ont reçu une réponse et lesquels nécessitent un suivi manuel.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Workflow optimisé</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Transformez votre gestion des appels en processus fluide et organisé. 
                        Plus de messages oubliés, plus de temps perdu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <img
                    src="https://res.cloudinary.com/drdqov4zs/image/upload/v1754916958/Screenshot_2025-08-11_at_14.53.14_x7ippe.png"
                    alt="Interface de gestion VoxNow - Détails des messages et analyses IA"
                    className="w-full rounded-2xl shadow-2xl border border-gray-200"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-light-blue to-light-green text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    Analyses IA détaillées
                  </div>
                </div>
              </div>
            </div>

            {/* CTA for Beta Access */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-3xl p-8 md:p-12 border border-orange-200">
                <h3 className="text-2xl font-bold gradient-text mb-4">
                  Accès anticipé aux fonctionnalités bêta
                </h3>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  En tant qu'utilisateur VoxNow, vous aurez un accès prioritaire à ces nouvelles fonctionnalités 
                  dès leur sortie, sans coût supplémentaire.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={scrollToCalendly}
                    className="bg-gradient-to-r from-vox-blue to-now-green text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Réserver une démo
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-white border-2 border-vox-blue text-vox-blue px-8 py-3 rounded-full font-semibold hover:bg-vox-blue hover:text-white transition-all duration-300 flex items-center justify-center"
                  >
                    Découvrir en démo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                Tarifs transparents et adaptés
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Solution complète pour automatiser toute votre gestion d'appels. 
                Incluant transcription, résumé par IA et réponses automatiques par SMS.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Main Plan */}
              <div className="bg-gradient-to-br from-white to-green-50/30 rounded-3xl p-8 border-2 border-now-green shadow-xl hover:shadow-2xl transition-all duration-300 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-vox-blue to-now-green text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Le plus populaire
                  </span>
                </div>
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-now-green mb-2">VoxNow</h3>
                  <p className="text-gray-600 mb-6">Solution complète pour votre cabinet</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">90€</span>
                    <span className="text-gray-600">/mois/user</span>
                  </div>
                  <p className="text-sm text-gray-500">Jusqu'à 300 messages/mois</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-now-green mr-3" />
                    <span>Transcription instantanée</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-now-green mr-3" />
                    <span>Résumé par IA</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-now-green mr-3" />
                    <span>SMS automatiques</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-now-green mr-3" />
                    <span>Symplicy (si client)</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-now-green mr-3" />
                    <span>Stockage illimité des vocaux</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-now-green mr-3" />
                    <span>Accès aux fonctionnalités beta</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-now-green mr-3" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
                
                <button
                  onClick={handleTrialFormClick}
                  className="w-full bg-gradient-to-r from-vox-blue to-now-green text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Commencer l'essai gratuit
                </button>
              </div>

              {/* Custom Plan */}
              <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-light-blue mb-2">Custom</h3>
                  <p className="text-gray-600 mb-6">Pour les gros cabinets et besoins spécifiques</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-gray-900">Sur mesure</span>
                  </div>
                  <p className="text-sm text-gray-500">Messages illimités</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-now-green mr-3" />
                    <span>Toutes les fonctionnalités VoxNow</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-now-green mr-3" />
                    <span>Automatisation complète des appels</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-now-green mr-3" />
                    <span>Utilisateurs multiples</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-now-green mr-3" />
                    <span>API personnalisée</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-now-green mr-3" />
                    <span>Formation dédiée</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-now-green mr-3" />
                    <span>Support téléphonique</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-now-green mr-3" />
                    <span>Intégrations sur mesure</span>
                  </li>
                </ul>
                
                <button
                  onClick={scrollToCalendly}
                  className="w-full bg-gradient-to-r from-light-blue to-light-green text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Réserver une démo
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-6">
                Tous les plans incluent 14 jours d'essai gratuit. Aucun engagement, résiliation à tout moment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/dashboard"
                  className="bg-white border-2 border-vox-blue text-vox-blue px-6 py-3 rounded-lg font-semibold hover:bg-vox-blue hover:text-white transition-all duration-300"
                  onClick={() => trackCustomEvent('DashboardPreviewClick', {
                    content_name: 'Dashboard Preview',
                    content_category: 'Feature Preview'
                  })}
                >
                  Visiter l'espace démo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection />

      {/* Calendly Section */}
      <section id="calendly-section" className="py-24 bg-gradient-to-r from-vox-blue to-now-green text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              Optimisez votre cabinet en simplifiant la gestion de vos messages vocaux 📈
            </h2>
            <p className="text-xl mb-12 text-white/90 text-center max-w-3xl mx-auto">
              Rejoignez les cabinets d'avocats qui gagnent jusqu'à une heure par jour avec VoxNow.
            </p>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div id="calendly" className="calendly-inline-widget" style={{ minWidth: '320px', height: '700px' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <img 
                  src="https://res.cloudinary.com/drdqov4zs/image/upload/v1741862267/My%20Brand/LOGO_VoxNow_d6fbzq.png"
                  alt="VoxNow Logo"
                  className="h-12 mb-4 brightness-0 invert"
                />
                <p className="text-gray-400">
                  Votre messagerie vocale automatisée par l'IA
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <div className="space-y-2 text-gray-400">
                  <p>Chaussée de Saint Amand 20</p>
                  <p>7500 Tournai</p>
                  <p>+32 493 69 08 20</p>
                  <p>sacha@voxnow.be</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Légal</h4>
                <div className="space-y-2">
                  <Link
                    to="/blog"
                    className="text-gray-400 hover:text-white transition-colors block"
                    onClick={() => trackCustomEvent('FooterBlogClick', { 
                      content_name: 'Blog',
                      source: 'Footer'
                    })}
                  >
                    Blog
                  </Link>
                  <Link
                    to="/conditions-generales"
                    className="text-gray-400 hover:text-white transition-colors block"
                    onClick={() => trackCustomEvent('FooterTermsClick', { 
                      content_name: 'Terms and Conditions',
                      source: 'Footer'
                    })}
                  >
                    Conditions générales
                  </Link>
                  <Link
                    to="/paiement"
                    className="bg-gradient-to-r from-vox-blue to-now-green text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 inline-block mt-4 font-medium"
                    onClick={() => trackCustomEvent('FooterSubscriptionClick', { 
                      content_name: 'Subscription Page',
                      source: 'Footer'
                    })}
                  >
                    Procéder à un abonnement
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>&copy; 2025 VoxNow. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/messagerie" element={<VoiceMessage />} />
        <Route path="/bienvenue" element={<WelcomeForm />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/conditions-generales" element={<TermsAndConditions />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-huez" element={<HuezDashboard />} />
        <Route path="/recording" element={<RecordingPage />} />
        <Route path="/paiement" element={<PaymentPage />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/avocats-belgique-gagner-temps-voxnow" element={<BlogArticle1 />} />
        <Route path="/blog/solution-belge-gestion-appels-manques" element={<BlogArticle2 />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
      <Chatbot />
    </>
  );
}

export default App;