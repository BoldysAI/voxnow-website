import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Shield, Users, CheckCircle2, Phone, Mail } from 'lucide-react';

export function BlogArticle2() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="https://res.cloudinary.com/drdqov4zs/image/upload/v1741862267/My%20Brand/LOGO_VoxNow_d6fbzq.png"
                alt="VoxNow Logo"
                className="h-10"
              />
            </Link>
            <Link
              to="/blog"
              className="flex items-center text-vox-blue hover:text-now-green transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au blog
            </Link>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-vox-blue">Accueil</Link>
          <span className="mx-2">›</span>
          <Link to="/blog" className="hover:text-vox-blue">Blog</Link>
          <span className="mx-2">›</span>
          <span>L'assistant virtuel belge pour gérer vos appels manqués</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Clock className="h-4 w-4 mr-2" />
            <span>4 min de lecture</span>
            <span className="mx-2">•</span>
            <span>Publié le {new Date().toLocaleDateString('fr-FR')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            VoxNow, l'assistant virtuel belge pour gérer vos appels manqués
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Un appel manqué peut signifier un client perdu. Pour les professions à forte interaction téléphonique 
            (avocats, notaires, agents immobiliers…), chaque demande compte. VoxNow automatise la gestion de vos 
            appels manqués, vous faisant gagner en réactivité et en organisation.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Pourquoi les appels manqués coûtent cher
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded mb-6">
                <h3 className="font-bold text-red-800 mb-2">📊 Statistique alarmante</h3>
                <p className="text-red-700 text-lg font-medium">
                  En Belgique, 32% des prospects ne rappellent pas après être tombés sur un répondeur.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Cela représente des pertes directes de clients potentiels. Dans un marché concurrentiel, 
                la rapidité de réponse devient un avantage décisif pour convertir un prospect en client.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Les fonctionnalités clés de VoxNow
            </h2>
            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start space-x-4">
                <div className="w-12 h-12 bg-vox-blue/10 rounded-xl flex items-center justify-center">
                  <Phone className="h-6 w-6 text-vox-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Transcription automatique des messages vocaux</h3>
                  <p className="text-gray-600">
                    Chaque message vocal est automatiquement converti en texte lisible, sans intervention manuelle.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start space-x-4">
                <div className="w-12 h-12 bg-now-green/10 rounded-xl flex items-center justify-center">
                  <Mail className="h-6 w-6 text-now-green" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Résumé contextuel pour savoir immédiatement l'objet de l'appel</h3>
                  <p className="text-gray-600">
                    Notre IA analyse le contenu et vous fournit un résumé avec le niveau d'urgence et le type de demande.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start space-x-4">
                <div className="w-12 h-12 bg-light-blue/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-light-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Réponse automatisée avec un lien adapté</h3>
                  <p className="text-gray-600">
                    Envoi automatique d'un SMS avec un lien pour ouvrir un dossier ou prendre rendez-vous.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start space-x-4">
                <div className="w-12 h-12 bg-light-green/10 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-light-green" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Archivage sécurisé</h3>
                  <p className="text-gray-600">
                    Tous vos messages sont archivés de manière sécurisée et facilement recherchables.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Les métiers qui bénéficient le plus de VoxNow
            </h2>
            <div className="bg-gradient-to-r from-vox-blue/5 to-now-green/5 p-8 rounded-2xl">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-vox-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-vox-blue" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Avocats</h3>
                  <p className="text-gray-600 text-sm">Gestion des consultations et urgences juridiques</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-now-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-now-green" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Notaires</h3>
                  <p className="text-gray-600 text-sm">Organisation des rendez-vous et actes notariés</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-light-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-light-blue" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Agents immobiliers</h3>
                  <p className="text-gray-600 text-sm">Suivi des prospects et visites immobilières</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-light-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-light-green" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Médecins et spécialistes</h3>
                  <p className="text-gray-600 text-sm">Prise de rendez-vous et urgences médicales</p>
                </div>

                <div className="text-center md:col-span-2 lg:col-span-1">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Consultants indépendants</h3>
                  <p className="text-gray-600 text-sm">Gestion de la relation client et projets</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Sécurité et confidentialité
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Protection totale de vos données</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">100% conforme au RGPD</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Hébergé en Europe</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Chiffrement de bout en bout</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Accès sécurisé</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-4">
                    Vos données et celles de vos clients restent protégées selon les plus hauts standards de sécurité.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Conclusion
            </h2>
            <div className="bg-gradient-to-r from-vox-blue to-now-green p-8 rounded-2xl text-white">
              <p className="text-lg mb-6">
                Ne laissez plus un appel manqué devenir une opportunité perdue. 
                VoxNow transforme chaque message vocal en action concrete.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  className="bg-white text-vox-blue px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors text-center"
                >
                  Essayer VoxNow gratuitement
                </Link>
                <a
                  href="https://calendly.com/hey-sachadelcourt/voxnow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-vox-blue transition-colors text-center"
                >
                  Demander une démo
                </a>
              </div>
            </div>
          </section>
        </div>

        {/* Related articles */}
        <section className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Articles connexes</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/blog/avocats-belgique-gagner-temps-voxnow"
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
            >
              <h4 className="font-bold text-gray-900 mb-2 group-hover:text-vox-blue transition-colors">
                Comment les avocats belges gagnent 5h par semaine avec VoxNow
              </h4>
              <p className="text-gray-600 text-sm">
                Découvrez comment optimiser votre temps et augmenter votre productivité...
              </p>
            </Link>
            <Link
              to="/blog"
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
            >
              <h4 className="font-bold text-gray-900 mb-2 group-hover:text-vox-blue transition-colors">
                Voir tous les articles
              </h4>
              <p className="text-gray-600 text-sm">
                Découvrez tous nos conseils pour optimiser votre gestion des appels...
              </p>
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}