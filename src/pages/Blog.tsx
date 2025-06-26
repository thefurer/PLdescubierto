
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { useTranslations } from '@/hooks/useTranslations';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogEditor from '@/components/blog/BlogEditor';
import BlogHeader from '@/components/blog/BlogHeader';
import BlogFilters from '@/components/blog/BlogFilters';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogEmptyState from '@/components/blog/BlogEmptyState';
import ChatBot from '@/components/ChatBot';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  author: string;
  date: string;
  excerpt: string;
  category: string;
}

const Blog = () => {
  const { user } = useAuth();
  const t = useTranslations();
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Temporada de Ballenas 2024: Un Éxito Extraordinario',
      content: '# Temporada de Ballenas 2024\n\nEste año hemos sido testigos de uno de los espectáculos naturales más impresionantes en las costas de Puerto López. **La temporada de ballenas jorobadas 2024** ha superado todas las expectativas...\n\n## Números récord\n\n- **Más de 500 ballenas** avistadas\n- **95% de éxito** en los tours\n- **Miles de visitantes** satisfechos\n\n> "Ha sido la mejor temporada que hemos tenido en años" - Capitán María Rodríguez',
      author: 'Equipo Puerto López',
      date: '2024-09-15',
      excerpt: 'La temporada de ballenas jorobadas 2024 ha sido excepcional, con avistamientos récord y experiencias inolvidables para miles de visitantes.',
      category: 'noticias'
    },
    {
      id: '2',
      title: 'Nueva Ruta de Senderismo en Los Frailes',
      content: '## Nueva Ruta Ecológica\n\nInauguramos un **nuevo sendero ecológico** que conecta diferentes miradores con vistas panorámicas únicas...\n\n### Características del sendero:\n\n1. **3.5 km de longitud**\n2. **Dificultad moderada**\n3. **4 miradores panorámicos**\n4. **Flora y fauna nativa**',
      author: 'Ministerio de Turismo',
      date: '2024-08-28',
      excerpt: 'Descubre la nueva ruta de senderismo que ofrece vistas panorámicas únicas de la costa ecuatoriana y la biodiversidad del Parque Nacional Machalilla.',
      category: 'turismo'
    },
    {
      id: '3',
      title: 'Festival Gastronómico del Mar 2024',
      content: '# Festival Gastronómico del Mar\n\n**Del 10 al 15 de octubre** se realizará nuestro festival anual dedicado a los sabores del mar...\n\n## Actividades destacadas:\n\n- Concurso de ceviches\n- Degustaciones gratuitas\n- Shows en vivo\n- Talleres de cocina',
      author: 'Cámara de Turismo',
      date: '2024-08-20',
      excerpt: 'Ven y disfruta de los sabores auténticos del mar en nuestro festival gastronómico, donde los mejores chefs locales presentarán sus especialidades.',
      category: 'eventos'
    },
    {
      id: '4',
      title: 'Conservación Marina: Logros del 2024',
      content: '# Conservación Marina en Puerto López\n\n## Avances significativos\n\nEste año hemos logrado importantes avances en la conservación de nuestro ecosistema marino:\n\n### Protección de Tortugas Marinas\n- **150 nidos** protegidos\n- **85% de éxito** en eclosión\n- **Programa de voluntariado** activo\n\n### Limpieza de Playas\n- **12 jornadas** de limpieza comunitaria\n- **2 toneladas** de residuos recolectados\n- **500 voluntarios** participantes',
      author: 'Fundación Vida Marina',
      date: '2024-07-10',
      excerpt: 'Conoce los importantes logros en conservación marina que hemos alcanzado este año gracias al esfuerzo conjunto de la comunidad.',
      category: 'conservacion'
    },
    {
      id: '5',
      title: 'Tradiciones Ancestrales de los Pescadores',
      content: '# Tradiciones Pesqueras de Puerto López\n\n## Un legado cultural único\n\nLas tradiciones pesqueras de Puerto López son un testimonio vivo de la rica herencia cultural de nuestros ancestros...\n\n### Técnicas Tradicionales\n- **Pesca con redes** artesanales\n- **Navegación** por las estrellas\n- **Rituales** de buena pesca\n\n### Festividades\n- Festival del Pescador (Julio)\n- Bendición de las embarcaciones (Enero)\n- Competencias de pesca tradicional',
      author: 'Centro Cultural Puerto López',
      date: '2024-06-25',
      excerpt: 'Sumérgete en las tradiciones ancestrales de los pescadores de Puerto López y descubre un legado cultural que perdura generación tras generación.',
      category: 'cultura'
    }
  ]);
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'noticias', label: t.news, color: 'bg-blue-100 text-blue-800' },
    { value: 'eventos', label: t.events, color: 'bg-green-100 text-green-800' },
    { value: 'conservacion', label: t.conservation, color: 'bg-emerald-100 text-emerald-800' },
    { value: 'turismo', label: t.tourism, color: 'bg-purple-100 text-purple-800' },
    { value: 'cultura', label: t.culture, color: 'bg-orange-100 text-orange-800' }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddPost = (newPost: Omit<BlogPost, 'id' | 'date' | 'author'>) => {
    const post: BlogPost = {
      id: Date.now().toString(),
      ...newPost,
      author: user?.user_metadata?.full_name || 'Usuario',
      date: new Date().toISOString().split('T')[0]
    };
    setPosts([post, ...posts]);
    setShowEditor(false);
  };

  const handleEditPost = (updatedPost: BlogPost) => {
    setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
    setEditingPost(null);
    setShowEditor(false);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const handleCreatePost = () => {
    setShowEditor(true);
  };

  const handleEditPostClick = (post: BlogPost) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleCancelEditor = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  if (showEditor) {
    return (
      <BlogEditor
        post={editingPost}
        onSave={editingPost ? handleEditPost : handleAddPost}
        onCancel={handleCancelEditor}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-20 pb-8 bg-gradient-to-r from-ocean-dark via-ocean to-blue-600">
        <div className="container mx-auto px-4">
          <div className="text-center text-white py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Noticias y Eventos
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Mantente informado sobre las últimas noticias, eventos y descubrimientos de Puerto López
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                📰 {posts.length} Publicaciones
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                🏷️ 5 Categorías
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                👥 Comunidad Activa
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="container mx-auto px-4">
          <BlogHeader user={user} onCreatePost={handleCreatePost} />
          
          <BlogFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                categories={categories}
                user={user}
                onEdit={handleEditPostClick}
                onDelete={handleDeletePost}
              />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <BlogEmptyState
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              user={user}
              onCreatePost={handleCreatePost}
            />
          )}
        </div>
      </div>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default Blog;
