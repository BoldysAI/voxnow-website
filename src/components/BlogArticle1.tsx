import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { useDomainConfig } from '../hooks/useDomainConfig';

export function BlogArticle1() {
  const config = useDomainConfig();
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
          <span>{config.domain === 'be' ? 'Comment les avocats belges gagnent 5h par semaine' : 'Comment les avocats français gagnent 5h par semaine'}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Clock className="h-4 w-4 mr-2" />
            <span>5 min de lecture</span>
            <span className="mx-2">•</span>
            <span>Publié le {new Date().toLocaleDateString('fr-FR')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {config.domain === 'be'
              ? 'Comment les avocats belges gagnent 5h par semaine avec la transcription automatique VoxNow'
              : 'Comment les avocats français gagnent 5h par semaine avec la transcription automatique VoxNow'}
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            Pour un avocat, chaque minute compte. Entre les audiences, les rendez-vous et la préparation des dossiers, 
            écouter et retranscrire les messages vocaux devient une perte de temps précieuse. VoxNow propose une solution 
            simple et rapide pour transformer ces minutes perdues en heures facturables.
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              La problématique des messages vocaux dans les cabinets d'avocats
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <p className="text-gray-700 leading-relaxed mb-4">
                {config.domain === 'be'
                  ? 'En Belgique, un avocat reçoit en moyenne entre 10 et 20 messages vocaux par semaine.'
                  : 'En France, un avocat reçoit en moyenne entre 10 et 20 messages vocaux par semaine.'}
                Les écouter, les retranscrire et y répondre peut représenter 2 à 5 heures de travail non facturable.
              </p>
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
                <p className="text-orange-800 font-medium">
                  💡 Le temps passé à écouter des messages vocaux représente en moyenne 5% du temps de travail d'un avocat.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Comment fonctionne VoxNow
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-vox-blue/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-vox-blue font-bold">1</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Redirection des appels manqués</h3>
                </div>
                <p className="text-gray-600">
                  Redirection vers un numéro VoxNow pour capturer automatiquement les messages.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-now-green/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-now-green font-bold">2</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Transcription instantanée</h3>
                </div>
                <p className="text-gray-600">
                  Transcription automatique du message vocal en texte lisible.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-light-blue/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-light-blue font-bold">3</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Résumé intelligent</h3>
                </div>
                <p className="text-gray-600">
                  Résumé automatique pour identifier l'urgence et l'objet de l'appel.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-light-green/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-light-green font-bold">4</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Intégration Symplicy</h3>
                </div>
                <p className="text-gray-600">
                  Possibilité d'envoyer un lien d'ouverture de dossier au client.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Les bénéfices pour un cabinet
            </h2>
            <div className="bg-gradient-to-r from-vox-blue/5 to-now-green/5 p-8 rounded-2xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-now-green mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Gain de temps : +5 heures/semaine</h3>
                    <p className="text-gray-600">Plus besoin d'écouter chaque message individuellement.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-now-green mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Réduction de la charge mentale</h3>
                    <p className="text-gray-600">Organisation automatique des demandes par priorité.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-now-green mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Meilleure réactivité</h3>
                    <p className="text-gray-600">Réponse plus rapide aux clients grâce aux résumés.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-now-green mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Centralisation des demandes</h3>
                    <p className="text-gray-600">Tous les messages organisés en un seul endroit.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Témoignage client
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-vox-blue">
              <blockquote className="text-lg italic text-gray-700 mb-4">
                "Depuis que j'utilise VoxNow, je peux prioriser mes appels urgents et traiter les autres plus sereinement. 
                C'est un vrai changement."
              </blockquote>
              <cite className="text-vox-blue font-medium">
                {config.domain === 'be' ? 'Me L., avocat à Bruxelles' : 'Me L., avocat à Paris'}
              </cite>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Conclusion
            </h2>
            <div className="bg-gradient-to-r from-vox-blue to-now-green p-8 rounded-2xl text-white">
              <p className="text-lg mb-6">
                VoxNow n'est pas un simple outil de transcription. C'est un assistant virtuel spécialisé pour les avocats{config.domain === 'be' ? ' belges' : ' français'}.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/"
                  className="bg-white text-vox-blue px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors text-center"
                >
                  Découvrir VoxNow
                </Link>
                <Link
                  to="/#calendly-section"
                  className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-vox-blue transition-colors text-center"
                >
                  Demander une démo gratuite
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Related articles */}
        <section className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Articles connexes</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/blog/solution-belge-gestion-appels-manques"
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
            >
              <h4 className="font-bold text-gray-900 mb-2 group-hover:text-vox-blue transition-colors">
                {config.domain === 'be'
                  ? "VoxNow, l'assistant virtuel belge pour gérer vos appels manqués"
                  : "VoxNow, l'assistant virtuel français pour gérer vos appels manqués"}
              </h4>
              <p className="text-gray-600 text-sm">
                Découvrez comment VoxNow aide les professionnels{config.domain === 'be' ? ' belges' : ' français'} à centraliser, transcrire et répondre plus vite...
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