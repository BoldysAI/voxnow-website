import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Mail,
  MessageCircle,
  Phone,
  Zap,
  Shield,
  FileText,
  Brain,
  TrendingUp,
  Users,
  Timer
} from 'lucide-react';
import { trackViewContent, trackCustomEvent } from '../utils/fbPixel';

export function TitulaireDeCompte() {
  useEffect(() => {
    // Track page view
    trackViewContent({
      content_name: 'Titulaire de Compte Landing Page',
      content_category: 'Landing Page'
    });

    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  const handleTrialClick = () => {
    trackCustomEvent('TitulaireTrialClick', {
      content_name: 'Titulaire Trial Form Access',
      content_category: 'Lead Generation'
    });
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
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-vox-blue hover:text-now-green transition-colors duration-300 font-medium"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 bg-gradient-to-br from-vox-blue/5 via-white to-now-green/5 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-vox-blue/10 to-now-green/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-vox-blue/5 to-now-green/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Avocats titulaires, <span className="bg-gradient-to-r from-vox-blue to-now-green bg-clip-text text-transparent">reprenez le contrôle</span> de vos appels
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              VoxNow transforme vos messages vocaux en emails clairs et résumés. 
              <br className="hidden md:block" />
              <span className="font-semibold text-vox-blue">Concentrez-vous sur vos dossiers, pas sur votre répondeur.</span>
            </p>

            {/* Visual illustration placeholder */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-gray-200 shadow-xl max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-left">
                  <div className="bg-gradient-to-r from-vox-blue to-now-green rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Avocat concentré sur ses dossiers</h3>
                  <p className="text-gray-600">Pendant que VoxNow gère automatiquement tous les appels entrants</p>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-now-green rounded-full"></div>
                        <span className="text-sm font-medium">Résumé: Demande virement 30€</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-light-blue rounded-full"></div>
                        <span className="text-sm font-medium">Client: M. Dupont</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-light-green rounded-full"></div>
                        <span className="text-sm font-medium">Action: Traiter rapidement</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/free-trial"
              onClick={handleTrialClick}
              className="inline-flex items-center bg-gradient-to-r from-vox-blue to-now-green text-white px-12 py-4 rounded-full text-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              👉 Essayez VoxNow gratuitement
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section Douleur - Le quotidien des titulaires */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Le quotidien épuisant des titulaires de compte
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Chaque jour, vous recevez des dizaines d'appels pour des demandes répétitives
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-2xl">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-800 mb-2">"Maître, pouvez-vous me faire un virement de 30€ ?"</p>
                      <p className="text-red-700 text-sm">15 appels par jour pour des virements</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-2xl">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-orange-800 mb-2">"Maître, j'ai besoin d'argent pour mon abonnement Netflix"</p>
                      <p className="text-orange-700 text-sm">Demandes d'avances pour dépenses personnelles</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-800 mb-2">"Maître, pouvez-vous envoyer un document à tel service ?"</p>
                      <p className="text-yellow-700 text-sm">Demandes administratives répétitives</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-2xl">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-purple-800 mb-2">"Maître, pouvez-vous avancer les frais ?"</p>
                      <p className="text-purple-700 text-sm">Demandes de financement de procédures</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl p-8 border border-gray-200">
                <div className="text-center mb-8">
                  <div className="bg-red-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Timer className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Le coût caché</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl border">
                    <span className="font-medium text-gray-700">Temps par appel</span>
                    <span className="font-bold text-red-600">2 minutes</span>
                  </div>
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl border">
                    <span className="font-medium text-gray-700">Appels par jour</span>
                    <span className="font-bold text-red-600">15-20</span>
                  </div>
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl border">
                    <span className="font-medium text-gray-700">Temps perdu/jour</span>
                    <span className="font-bold text-red-600">30-40 min</span>
                  </div>
                  <div className="flex items-center justify-between bg-red-50 p-4 rounded-xl border-2 border-red-200">
                    <span className="font-bold text-gray-900">Temps perdu/semaine</span>
                    <span className="font-bold text-red-600 text-xl">3+ heures</span>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-red-100 rounded-2xl border-2 border-red-200">
                  <p className="text-red-800 font-bold text-center text-lg">
                    "Chaque appel prend 2 minutes à écouter ou à rappeler, pour une demande qui aurait pu être traitée en 10 secondes."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment VoxNow simplifie */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Comment VoxNow <span className="bg-gradient-to-r from-vox-blue to-now-green bg-clip-text text-transparent">simplifie votre rôle</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une solution complète qui transforme votre gestion des appels clients
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="bg-gradient-to-r from-vox-blue to-light-blue rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Transcription instantanée par email</h3>
                <p className="text-gray-600 mb-4">
                  Chaque message vocal est automatiquement transcrit et envoyé dans votre boîte mail en quelques secondes.
                </p>
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-vox-blue font-medium">✅ Plus besoin d'écouter chaque message</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="bg-gradient-to-r from-now-green to-light-green rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Résumé clair de la demande</h3>
                <p className="text-gray-600 mb-4">
                  Notre IA analyse et résume chaque demande pour vous donner l'essentiel en un coup d'œil.
                </p>
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-sm text-now-green font-medium">✅ Gain de temps immédiat</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="bg-gradient-to-r from-light-blue to-now-green rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmation SMS envoyée au client</h3>
                <p className="text-gray-600 mb-4">
                  Vos clients reçoivent automatiquement un SMS les rassurant que leur demande est prise en charge.
                </p>
                <div className="bg-cyan-50 p-4 rounded-xl">
                  <p className="text-sm text-light-blue font-medium">✅ Image professionnelle renforcée</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bénéfices concrets */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Les bénéfices <span className="bg-gradient-to-r from-vox-blue to-now-green bg-clip-text text-transparent">concrets</span> pour l'avocat titulaire
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des résultats mesurables dès le premier jour d'utilisation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border border-blue-200">
                <div className="flex items-center mb-6">
                  <div className="bg-vox-blue rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Gain de temps drastique</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl">
                    <span className="font-medium">Avant VoxNow</span>
                    <span className="font-bold text-red-600">2 minutes par message</span>
                  </div>
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl">
                    <span className="font-medium">Avec VoxNow</span>
                    <span className="font-bold text-green-600">5 secondes par message</span>
                  </div>
                  <div className="bg-vox-blue text-white p-4 rounded-xl text-center">
                    <p className="font-bold text-lg">96% de temps économisé</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 border border-green-200">
                <div className="flex items-center mb-6">
                  <div className="bg-now-green rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Meilleure organisation</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium">Email clair et structuré</span>
                    </div>
                    <p className="text-sm text-gray-600">Toutes les informations essentielles en un coup d'œil</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium">Historique complet</span>
                    </div>
                    <p className="text-sm text-gray-600">Retrouvez facilement toutes les demandes passées</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 border border-purple-200">
                <div className="flex items-center mb-6">
                  <div className="bg-light-blue rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Relation client renforcée</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl">
                    <p className="font-medium text-gray-900 mb-2">SMS de confirmation automatique</p>
                    <p className="text-sm text-gray-600">"Votre demande a été reçue et sera traitée dans les meilleurs délais"</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <p className="font-medium text-gray-900 mb-2">Disponibilité 24/7</p>
                    <p className="text-sm text-gray-600">Vos clients sont rassurés même en dehors des heures d'ouverture</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl p-8 border border-yellow-200">
                <div className="flex items-center mb-6">
                  <div className="bg-light-green rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Simplicité d'installation</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <div className="bg-yellow-500 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <span className="font-medium">Code de déviation sur votre téléphone</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <div className="flex items-center mb-2">
                      <div className="bg-yellow-500 rounded-full w-6 h-6 flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <span className="font-medium">Configuration de votre email</span>
                    </div>
                  </div>
                  <div className="bg-yellow-500 text-white p-4 rounded-xl text-center">
                    <p className="font-bold">Installation en 30 secondes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preuve sociale */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-200">
              <div className="mb-8">
                <div className="bg-gradient-to-r from-vox-blue to-now-green rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Déjà adopté par des cabinets en Belgique
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Rejoignez les avocats qui ont déjà transformé leur gestion des appels
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-2xl border border-gray-200 mb-8">
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  "Les titulaires qui utilisent VoxNow économisent en moyenne"
                </p>
                <p className="text-4xl font-bold bg-gradient-to-r from-vox-blue to-now-green bg-clip-text text-transparent">
                  2 heures par semaine
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-3xl font-bold text-vox-blue mb-2">20+</p>
                  <p className="text-gray-600 font-medium">Cabinets utilisateurs</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-3xl font-bold text-now-green mb-2">500+</p>
                  <p className="text-gray-600 font-medium">Messages traités/jour</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <p className="text-3xl font-bold text-light-blue mb-2">96%</p>
                  <p className="text-gray-600 font-medium">De temps économisé</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-4 bg-gradient-to-br from-vox-blue to-now-green">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
              Essayez VoxNow gratuitement pendant 14 jours
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
              Sans engagement, sans carte bancaire. Installez-le en 3 minutes, gagnez du temps dès aujourd'hui.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-white/20">
              <div className="grid md:grid-cols-3 gap-6 text-center text-white">
                <div>
                  <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">14 jours gratuits</h3>
                  <p className="text-white/80">Testez sans risque</p>
                </div>
                <div>
                  <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Sans engagement</h3>
                  <p className="text-white/80">Annulez à tout moment</p>
                </div>
                <div>
                  <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Installation rapide</h3>
                  <p className="text-white/80">Opérationnel en 3 minutes</p>
                </div>
              </div>
            </div>

            <Link
              to="/free-trial"
              onClick={handleTrialClick}
              className="inline-flex items-center bg-white text-vox-blue px-12 py-4 rounded-full text-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              Commencer mon essai gratuit
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>

            <p className="text-white/80 mt-6 text-sm">
              Installation en 30 secondes • Support inclus • Satisfaction garantie
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}