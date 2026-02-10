import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Shield, CheckCircle, Calendar, Gift, Star, ArrowRight, Linkedin, Mail } from 'lucide-react';
import { trackViewContent, trackCustomEvent } from '../utils/fbPixel';

export function PaymentPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  
  const testimonials = [
    {
      text: "Avant d'utiliser VoxNow, ma boîte vocale était constamment pleine. Par manque de temps ou de contexte, je laissais certains messages sans réponse, parfois sans même m'en rendre compte. VoxNow a changé cela. Grâce à la transcription automatique, je peux capter en un instant l'essentiel d'un appel, y compris d'un détenu ou d'un client en détresse. Cet outil m'a permis de rester humainement disponible, même quand je ne peux pas rappeler immédiatement. VoxNow m'a permis de regagner en sérénité, d'être plus réactif, et surtout de transformer des appels perdus en rencontres professionnelles utiles. Un outil simple, intelligent, et profondément utile à une pratique exigeante.",
      author: "Maître Gilles Rousseau",
      role: "Avocat au barreau de Bruxelles",
      image: "/testimonials/maitre_rousseau.jpeg",
      linkedin: "https://www.linkedin.com/in/gilles-rousseau-8a56a8144/",
      email: "gilles.rousseau@avocat.be"
    },
    {
      text: "VoxNow offre un gain de temps considérable puisque cet outil permet de centraliser les informations adressées par les clients, ce qui évite de multiplier les canaux d'informations. Cela permet ensuite de prioriser les demandes reçues afin de conserver un service de qualité auprès de ses clients",
      author: "Maître Samuel Pochet",
      role: "Avocat au Barreau de Namur",
      image: "/testimonials/maitre_pochet.jpeg",
      linkedin: "https://www.linkedin.com/in/samuel-pochet-a32ba476/",
      email: "s.pochet@avocat.be"
    },
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Track payment page view
    trackViewContent({
      content_name: 'Payment Page',
      content_category: 'Subscription'
    });
  }, []);

  // Intersection Observer for video autoplay (muted initially due to browser policies)
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start playing muted (required by browsers for autoplay)
            videoElement.muted = true;
            videoElement.play().catch((error) => {
              console.log('Autoplay prevented:', error);
            });
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle unmute button click
  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsVideoMuted(false);
      trackCustomEvent('TestimonialVideoUnmute', {
        content_name: 'Testimonial Video Unmuted',
        content_category: 'Video Engagement'
      });
    }
  };

  const handleSubscriptionClick = () => {
    // Track subscription click
    trackCustomEvent('SubscriptionClick', {
      content_name: 'Stripe Subscription',
      content_category: 'Conversion',
      value: 90,
      currency: 'EUR'
    });
    window.open('https://buy.stripe.com/aFa9AV8Zac6f01ng4meAg03', '_blank');
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
                source: 'Payment Page'
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
              <Gift className="h-5 w-5 text-now-green mr-2" />
              <span className="text-gray-700 font-medium">Abonnement VoxNow</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Continuez avec VoxNow
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Votre période d'essai est terminée et vous avez pu constater les bénéfices de VoxNow. 
              Continuez à optimiser votre cabinet avec notre abonnement mensuel.
            </p>
          </div>

          {/* Subscription Card */}
          <div className="bg-gradient-to-br from-blue-50 via-purple-50/30 to-green-50/20 relative overflow-hidden rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 mb-12">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 -left-40 w-96 h-96 bg-gradient-to-br from-vox-blue/10 to-now-green/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -right-40 w-96 h-96 bg-gradient-to-tr from-light-blue/10 to-light-green/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
            {/* Testimonials Section */}
            <section className="py-12">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 gradient-text">
                  Ce qu'en disent nos utilisateurs
                </h2>
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
            </section>

            {/* Testimonial Video Section */}
            <section className="py-12">
              <div className="max-w-5xl mx-auto">
                {/* Header with decorative elements */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 px-6 py-3 rounded-full shadow-sm mb-6">
                    <Star className="h-5 w-5 text-yellow-500 mr-2 fill-current" />
                    <span className="text-gray-700 font-medium">Témoignages clients</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-vox-blue via-light-blue to-now-green bg-clip-text text-transparent">
                      Voici ce que pensent nos clients
                    </span>
                    <br />
                    <span className="text-gray-900">de la solution VoxNow</span>
                  </h2>
                  
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Découvrez comment VoxNow transforme la gestion des appels pour les cabinets d'avocats
                  </p>
                </div>
                
                {/* Video Container with enhanced design */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-4 md:p-8 border border-gray-200">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl bg-black">
                      {/* Video aspect ratio container */}
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <video
                          ref={videoRef}
                          controls
                          playsInline
                          className="absolute top-0 left-0 w-full h-full"
                          poster="https://res.cloudinary.com/drdqov4zs/image/upload/v1741862267/My%20Brand/LOGO_VoxNow_d6fbzq.png"
                          onPlay={() => trackCustomEvent('TestimonialVideoPlay', {
                            content_name: 'Testimonial Video',
                            content_category: 'Video Engagement'
                          })}
                        >
                          <source src="/testimonial_video.mp4" type="video/mp4" />
                          Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                        
                        {/* Unmute button overlay - appears when video is muted */}
                        {isVideoMuted && (
                          <button
                            onClick={handleUnmute}
                            className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full shadow-lg hover:bg-white transition-all duration-300 flex items-center space-x-2 z-10 animate-pulse"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                            </svg>
                            <span className="font-medium">Cliquez pour activer le son</span>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Video caption */}
                    <div className="mt-6 text-center">
                      <p className="text-gray-600 italic">
                        "Nos clients partagent leur expérience avec VoxNow"
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-vox-blue/20 to-now-green/20 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-tr from-light-blue/20 to-light-green/20 rounded-full blur-2xl"></div>
                </div>

                {/* Trust indicators below video */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-lg text-center">
                    <div className="text-3xl font-bold gradient-text mb-2">+20</div>
                    <p className="text-gray-600">Cabinets satisfaits</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-lg text-center">
                    <div className="text-3xl font-bold gradient-text mb-2">1h/jour</div>
                    <p className="text-gray-600">Temps économisé</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-lg text-center">
                    <div className="text-3xl font-bold gradient-text mb-2">100%</div>
                    <p className="text-gray-600">Messages traités</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Price Section at the bottom */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-vox-blue to-now-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold gradient-text mb-4">
                Abonnement VoxNow
              </h2>
              
              <div className="flex items-center justify-center mb-6">
                <span className="text-5xl font-bold text-vox-blue">90€</span>
                <span className="text-xl text-gray-600 ml-2">/mois</span>
              </div>
              
              <p className="text-gray-600 mb-8">
                Votre service reste actif • Facturation automatique mensuelle • Sans engagement • Résiliable à tout moment
              </p>
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

            {/* CTA Button at the bottom */}
            <div className="text-center mt-8">
              <button
                onClick={handleSubscriptionClick}
                className="bg-gradient-to-r from-vox-blue to-now-green text-white px-12 py-4 rounded-full text-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center mx-auto"
              >
                <CreditCard className="h-6 w-6 mr-3" />
                Continuer avec VoxNow
              </button>
              
              <p className="text-gray-500 text-sm mt-4">
                Paiement sécurisé par Stripe • Facturation automatique mensuelle • Service maintenu sans interruption
              </p>
            </div>
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
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sans engagement</h3>
              <p className="text-gray-600 text-sm">Résiliez votre abonnement à tout moment, sans frais ni pénalités</p>
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
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 md:p-12 border border-gray-200">
            <h3 className="text-2xl font-bold gradient-text text-center mb-8">
              Après votre souscription
            </h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-vox-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-vox-blue">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Confirmation immédiate</h4>
                <p className="text-gray-600 text-sm">Email de confirmation de votre abonnement</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-now-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-now-green">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Service maintenu</h4>
                <p className="text-gray-600 text-sm">Votre messagerie intelligente continue sans interruption</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-light-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-light-blue">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Facturation automatique</h4>
                <p className="text-gray-600 text-sm">Facture envoyée automatiquement chaque mois par email</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-light-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-light-green">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Évolutions</h4>
                <p className="text-gray-600 text-sm">Nouvelles fonctionnalités ajoutées automatiquement</p>
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
                    source: 'Payment Page'
                  })}
                >
                  Nous contacter par email
                </a>
                <button
                  onClick={() => {
                    trackCustomEvent('CalendlyClick', {
                      content_name: 'Demo Booking from Payment',
                      content_category: 'Support'
                    });
                    window.open('https://calendly.com/hey-sachadelcourt/voxnow', '_blank');
                  }}
                  className="bg-white border-2 border-vox-blue text-vox-blue px-6 py-3 rounded-lg font-semibold hover:bg-vox-blue hover:text-white transition-all duration-300 flex items-center justify-center"
                >
                  Réserver un appel
                </button>
                <button
                  onClick={handleSubscriptionClick}
                  className="bg-gradient-to-r from-vox-blue to-now-green text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  Souscrire au service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}