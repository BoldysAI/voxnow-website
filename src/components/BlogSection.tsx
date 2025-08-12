import React from 'react';
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
    id: '1',
    title: 'Pourquoi les avocats perdent 3 heures par semaine à écouter leurs messages vocaux',
    excerpt: 'Découvrez comment la transcription vocale automatique peut révolutionner la gestion de votre cabinet d\'avocat et vous faire gagner un temps précieux.',
    slug: 'transcription-vocale-avocat-perte-temps',
    date: '29 janvier 2025',
    author: 'Équipe VoxNow',
    readTime: '8 min',
    category: 'Productivité',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Boostez la productivité de votre cabinet d\'avocats grâce à l\'automatisation vocale',
    excerpt: 'Découvrez comment l\'automatisation vocale peut transformer votre cabinet et vous faire gagner jusqu\'à 5 heures par semaine. Solutions pratiques et cas concrets.',
    slug: 'automatisation-vocale-productivite-cabinet-avocat',
    date: '30 janvier 2025',
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
    date: '31 janvier 2025',
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
    date: '1 février 2025',
    author: 'Équipe VoxNow',
    readTime: '7 min',
    category: 'Étude',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '7',
    title: 'Gagnez un temps précieux grâce à l\'intégration VoxNow + Symplicy',
    excerpt: 'Découvrez comment l\'intégration entre VoxNow et Symplicy révolutionne la gestion des demandes clients dans les cabinets d\'avocats. Automatisation complète et gain de temps.',
    slug: 'integration-voxnow-symplicy-avocat',
    date: '4 février 2025',
    author: 'Équipe VoxNow',
    readTime: '10 min',
    category: 'Intégration',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    title: 'Pourquoi les messages vocaux ralentissent la productivité des cabinets d\'avocats (et comment y remédier)',
    excerpt: 'Découvrez pourquoi les messages vocaux sont un frein à la productivité des avocats et comment automatiser leur traitement pour optimiser votre temps.',
    slug: 'productivite-avocat-messages-vocaux',
    date: '2 février 2025',
    author: 'Équipe VoxNow',
    readTime: '9 min',
    category: 'Productivité',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '6',
    title: 'Comment optimiser l\'accueil téléphonique d\'un cabinet d\'avocats à l\'ère digitale',
    excerpt: 'Un bon accueil téléphonique est essentiel dans un cabinet. Découvrez comment l\'automatiser sans perdre en humanité, et améliorer l\'efficacité de votre gestion client.',
    slug: 'accueil-telephonique-cabinet-avocat',
    date: '3 février 2025',
    author: 'Équipe VoxNow',
    readTime: '7 min',
    category: 'Expérience client',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-vox-blue text-white px-3 py-1 rounded-full text-sm font-medium">
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
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-vox-blue transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-2" />
                    <span>{post.author}</span>
                  </div>
                  
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-vox-blue hover:text-now-green transition-colors font-medium flex items-center group"
                    onClick={() => {
                      trackCustomEvent('BlogPostClick', {
                        content_name: post.title,
                        content_category: 'Blog Post'
                      });
                      // Scroll will be handled by BlogPost component
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