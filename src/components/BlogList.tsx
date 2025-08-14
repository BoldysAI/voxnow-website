import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { trackViewContent, trackCustomEvent } from '../utils/fbPixel';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  image: string;
  metaDescription: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '7',
    title: 'Gagnez un temps précieux grâce à l\'intégration VoxNow + Symplicy',
    excerpt: 'Découvrez comment l\'intégration entre VoxNow et Symplicy révolutionne la gestion des demandes clients dans les cabinets d\'avocats. Automatisation complète, gain de temps et expérience client optimisée.',
    slug: 'integration-voxnow-symplicy-avocat',
    date: '22 juillet 2025',
    author: 'Équipe VoxNow',
    readTime: '10 min',
    category: 'Intégration',
    image: '/lovable-uploads/cdf9b7b0-ef95-4ace-b826-7c6a83d3e724.png',
    metaDescription: 'L\'intégration VoxNow + Symplicy automatise complètement la gestion des demandes clients. Transcription IA, envoi automatique de formulaires et gain de temps pour les avocats.'
  },
  {
    id: '8',
    title: 'Comment les avocats belges gagnent 5h par semaine avec la transcription automatique VoxNow',
    excerpt: 'Pour un avocat, chaque minute compte. Entre les audiences, les rendez-vous et la préparation des dossiers, écouter et retranscrire les messages vocaux devient une perte de temps précieuse. VoxNow propose une solution simple et rapide pour transformer ces minutes perdues en heures facturables.',
    slug: 'avocats-belgique-gagner-temps-voxnow',
    date: '15 août 2025',
    author: 'Équipe VoxNow',
    readTime: '5 min',
    category: 'Productivité',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    metaDescription: 'Gagnez jusqu\'à 5 heures par semaine grâce à VoxNow, la solution belge de transcription et de gestion intelligente des messages vocaux pour avocats.'
  },
  {
    id: '9',
    title: 'VoxNow, l\'assistant virtuel belge pour gérer vos appels manqués',
    excerpt: 'Un appel manqué peut signifier un client perdu. Pour les professions à forte interaction téléphonique (avocats, notaires, agents immobiliers…), chaque demande compte. VoxNow automatise la gestion de vos appels manqués, vous faisant gagner en réactivité et en organisation.',
    slug: 'solution-belge-gestion-appels-manques',
    date: '12 août 2025',
    author: 'Équipe VoxNow',
    readTime: '4 min',
    category: 'Technologie',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    metaDescription: 'Découvrez comment VoxNow aide les professionnels belges à centraliser, transcrire et répondre plus vite à leurs messages vocaux.'
  },
  {
    id: '1',
    title: 'Pourquoi les avocats perdent 3 heures par semaine à écouter leurs messages vocaux (et comment y remédier)',
    excerpt: 'Découvrez comment la transcription vocale automatique peut révolutionner la gestion de votre cabinet d\'avocat et vous faire gagner un temps précieux. Une analyse complète des enjeux et solutions.',
    slug: 'transcription-vocale-avocat-perte-temps',
    date: '8 août 2025',
    author: 'Équipe VoxNow',
    readTime: '8 min',
    category: 'Productivité',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    metaDescription: 'Découvrez comment la transcription vocale automatique peut faire gagner 3h/semaine aux avocats et optimiser la gestion de cabinet.'
  },
  {
    id: '2',
    title: 'Boostez la productivité de votre cabinet d\'avocats grâce à l\'automatisation vocale',
    excerpt: 'Entre les dossiers clients, les audiences et les appels, le quotidien d\'un avocat est surchargé. Découvrez comment l\'automatisation vocale peut transformer votre cabinet et vous faire gagner jusqu\'à 5 heures par semaine.',
    slug: 'automatisation-vocale-productivite-cabinet-avocat',
    date: '5 août 2025',
    author: 'Équipe VoxNow',
    readTime: '6 min',
    category: 'Automatisation',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    metaDescription: 'Boostez la productivité de votre cabinet d\'avocat avec l\'automatisation vocale. Gagnez jusqu\'à 5h/semaine grâce à l\'IA et la transcription automatique.'
  },
  {
    id: '3',
    title: 'Les 5 erreurs que font les avocats avec leur messagerie vocale (et comment les éviter)',
    excerpt: 'Dans un cabinet d\'avocats, chaque appel peut représenter un nouveau client ou une opportunité manquée. Découvrez les 5 erreurs les plus fréquentes avec la messagerie vocale et comment les corriger.',
    slug: 'erreurs-messagerie-vocale-avocat',
    date: '2 août 2025',
    author: 'Équipe VoxNow',
    readTime: '5 min',
    category: 'Bonnes pratiques',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    metaDescription: 'Découvrez les erreurs les plus fréquentes des avocats en matière de messagerie vocale, et comment les éviter pour gagner du temps et des clients.'
  },
  {
    id: '4',
    title: 'Transcrire ou écouter ? Ce que 100 avocats belges préfèrent en 2025',
    excerpt: 'Une étude exclusive menée auprès de 100 avocats en Belgique révèle leurs habitudes de gestion des messages vocaux et les bénéfices concrets de la transcription automatique.',
    slug: 'etude-transcription-avocat-belgique',
    date: '28 juillet 2025',
    author: 'Équipe VoxNow',
    readTime: '7 min',
    category: 'Étude',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    metaDescription: 'Une étude exclusive auprès de 100 avocats belges révèle leurs habitudes face à la gestion des messages vocaux et les bénéfices de la transcription.'
  },
  {
    id: '5',
    title: 'Pourquoi les messages vocaux ralentissent la productivité des cabinets d\'avocats (et comment y remédier)',
    excerpt: 'La productivité dans un cabinet d\'avocats ne se résume pas à la gestion des dossiers. Elle se joue aussi dans les détails invisibles, ces tâches chronophages qui grignotent le temps au quotidien sans qu\'on s\'en rende compte.',
    slug: 'productivite-avocat-messages-vocaux',
    date: '25 juillet 2025',
    author: 'Équipe VoxNow',
    readTime: '9 min',
    category: 'Productivité',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    metaDescription: 'Découvrez pourquoi les messages vocaux sont un frein à la productivité des avocats et comment automatiser leur traitement pour optimiser votre temps.'
  },
  {
    id: '6',
    title: 'Comment optimiser l\'accueil téléphonique d\'un cabinet d\'avocats à l\'ère digitale',
    excerpt: 'Pour beaucoup de cabinets d\'avocats, le premier contact avec un client potentiel passe encore par un appel téléphonique. Pourtant, la majorité des appels ne sont pas décrochés à la première tentative.',
    slug: 'accueil-telephonique-cabinet-avocat',
    date: '18 juillet 2025',
    author: 'Équipe VoxNow',
    readTime: '7 min',
    category: 'Expérience client',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    metaDescription: 'Un bon accueil téléphonique est essentiel dans un cabinet. Découvrez comment l\'automatiser sans perdre en humanité, et améliorer l\'efficacité de votre gestion client.'
  }
];

export function BlogList() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Track blog list page view
    trackViewContent({
      content_name: 'Blog List',
      content_category: 'Blog'
    });

    // Update page title
    document.title = 'Blog VoxNow - Conseils pour optimiser votre cabinet d\'avocat';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Découvrez nos conseils d\'experts pour optimiser la gestion de votre cabinet d\'avocat avec les dernières technologies et bonnes pratiques.');
    }
  }, []);

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
                source: 'Blog List'
              })}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Blog VoxNow
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Conseils d'experts, bonnes pratiques et innovations pour optimiser la gestion de votre cabinet d'avocat
            </p>
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 px-6 py-3 rounded-full shadow-sm">
              <span className="text-gray-700 font-medium">Spécialisé pour les professionnels du droit</span>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article 
                key={post.id} 
                className={`${
                  index === 0 
                    ? 'lg:col-span-2 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 shadow-2xl' 
                    : 'bg-white border border-gray-100 shadow-lg'
                } rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group`}
              >
                {index === 0 && (
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2">
                    <div className="flex items-center justify-center">
                      <span className="text-sm font-bold tracking-wider animate-pulse">🔥 FLASH NEWS</span>
                    </div>
                  </div>
                )}
                
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={`Illustration pour l'article : ${post.title}`}
                    className={`w-full ${index === 0 ? 'h-64' : 'h-48'} object-cover group-hover:scale-105 transition-transform duration-300`}
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`${
                      index === 0 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                        : 'bg-vox-blue text-white'
                    } px-3 py-1 rounded-full text-sm font-medium shadow-lg`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h2 className={`${
                    index === 0 
                      ? 'text-2xl text-gray-900 mb-4' 
                      : 'text-xl text-gray-900 mb-3'
                  } font-bold group-hover:text-vox-blue transition-colors leading-tight`}>
                    {post.title}
                  </h2>
                  
                  <p className={`text-gray-600 mb-4 leading-relaxed ${index === 0 ? 'text-lg' : ''}`}>
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-2" />
                      <span>{post.author}</span>
                    </div>
                    
                    <Link
                      to={`/blog/${post.slug}`}
                      className={`${
                        index === 0 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full hover:shadow-lg' 
                          : 'text-vox-blue hover:text-now-green'
                      } transition-colors font-medium flex items-center group`}
                      onClick={() => trackCustomEvent('BlogPostClick', {
                        content_name: post.title,
                        content_category: 'Blog Post'
                      })}
                    >
                      Lire l'article
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}