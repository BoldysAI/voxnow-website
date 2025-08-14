
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';

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
    image: '/lovable-uploads/cdf9b7b0-ef95-4ace-b826-7c6a83d3e724.png'
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
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '1',
    title: 'Pourquoi les avocats perdent 3 heures par semaine à écouter leurs messages vocaux',
    excerpt: 'Découvrez comment la transcription vocale automatique peut révolutionner la gestion de votre cabinet d\'avocat et vous faire gagner un temps précieux.',
    slug: 'transcription-vocale-avocat-perte-temps',
    date: '8 août 2025',
    author: 'Équipe VoxNow',
    readTime: '8 min',
    category: 'Productivité',
    image: 'https://images.unsplash.com/photo-1556484687-30636164638b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Boostez la productivité de votre cabinet d\'avocats grâce à l\'automatisation vocale',
    excerpt: 'Découvrez comment l\'automatisation vocale peut transformer votre cabinet et vous faire gagner jusqu\'à 5 heures par semaine. Solutions pratiques et cas concrets.',
    slug: 'automatisation-vocale-productivite-cabinet-avocat',
    date: '5 août 2025',
    author: 'Équipe VoxNow',
    readTime: '6 min',
    category: 'Automatisation',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: 'Les 5 erreurs que font les avocats avec leur messagerie vocale (et comment les éviter)',
    excerpt: 'Découvrez les erreurs les plus fréquentes des avocats en matière de messagerie vocale, et comment les éviter pour gagner du temps et des clients.',
    slug: 'erreurs-messagerie-vocale-avocat',
    date: '2 août 2025',
    author: 'Équipe VoxNow',
    readTime: '5 min',
    category: 'Bonnes pratiques',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    title: 'Transcrire ou écouter ? Ce que 100 avocats belges préfèrent en 2025',
    excerpt: 'Une étude exclusive auprès de 100 avocats belges révèle leurs habitudes face à la gestion des messages vocaux et les bénéfices de la transcription.',
    slug: 'etude-transcription-avocat-belgique',
    date: '28 juillet 2025',
    author: 'Équipe VoxNow',
    readTime: '7 min',
    category: 'Étude',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    title: 'Pourquoi les messages vocaux ralentissent la productivité des cabinets d\'avocats (et comment y remédier)',
    excerpt: 'Découvrez pourquoi les messages vocaux sont un frein à la productivité des avocats et comment automatiser leur traitement pour optimiser votre temps.',
    slug: 'productivite-avocat-messages-vocaux',
    date: '25 juillet 2025',
    author: 'Équipe VoxNow',
    readTime: '9 min',
    category: 'Productivité',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '6',
    title: 'Comment optimiser l\'accueil téléphonique d\'un cabinet d\'avocats à l\'ère digitale',
    excerpt: 'Un bon accueil téléphonique est essentiel dans un cabinet. Découvrez comment l\'automatiser sans perdre en humanité, et améliorer l\'efficacité de votre gestion client.',
    slug: 'accueil-telephonique-cabinet-avocat',
    date: '18 juillet 2025',
    author: 'Équipe VoxNow',
    readTime: '7 min',
    category: 'Expérience client',
    image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

export function BlogSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
            Blog VoxNow
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conseils, astuces et bonnes pratiques pour optimiser la gestion de votre cabinet d'avocat
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                  alt={post.title}
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
                
                <h3 className={`${
                  index === 0 
                    ? 'text-2xl text-gray-900 mb-4' 
                    : 'text-xl text-gray-900 mb-3'
                } font-bold group-hover:text-vox-blue transition-colors`}>
                  {post.title}
                </h3>
                
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
                    onClick={() => {
                      // Analytics tracking
                      if (typeof window !== 'undefined' && (window as any).fbq) {
                        (window as any).fbq('track', 'ViewContent', {
                          content_name: post.title,
                          content_category: 'Blog Post'
                        });
                      }
                    }}
                  >
                    Lire l'article
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="bg-gradient-to-r from-vox-blue to-now-green text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center"
          >
            Voir tous les articles
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}