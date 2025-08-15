
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import BlogHeader from '@/components/blog/BlogHeader';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogEditor from '@/components/blog/BlogEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { BlogPost } from '@/types/blog';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  const { user } = useAuth();
  const { posts, loading, createPost, updatePost } = useBlogPosts();

  const staticPosts = [
    {
      id: 1,
      title: "Guía Completa para el Avistamiento de Ballenas en Puerto López",
      excerpt: "Descubre los mejores consejos para disfrutar al máximo de la temporada de ballenas jorobadas en la costa ecuatoriana.",
      category: "Vida Marina",
      author: "María González",
      date: "2024-06-15",
      readTime: "8 min",
      image: "/placeholder.svg",
      tags: ["ballenas", "turismo", "guía"]
    },
    {
      id: 2,
      title: "Los Mejores Spots de Snorkeling en la Isla de la Plata",
      excerpt: "Explora los arrecifes de coral y la vida marina tropical en las aguas cristalinas de la Isla de la Plata.",
      category: "Actividades",
      author: "Carlos Ruiz",
      date: "2024-06-10",
      readTime: "6 min",
      image: "/placeholder.svg",
      tags: ["snorkeling", "isla de la plata", "buceo"]
    },
    {
      id: 3,
      title: "Gastronomía Local: Sabores del Mar en Puerto López",
      excerpt: "Un recorrido por los platos típicos y restaurantes imperdibles de Puerto López, desde ceviches hasta mariscos frescos.",
      category: "Gastronomía",
      author: "Ana Morales",
      date: "2024-06-05",
      readTime: "5 min",
      image: "/placeholder.svg",
      tags: ["comida", "gastronomía", "mariscos"]
    },
    {
      id: 4,
      title: "Senderos y Aventuras en el Parque Nacional Machalilla",
      excerpt: "Descubre las rutas de senderismo más espectaculares y los tesoros naturales del Parque Nacional Machalilla.",
      category: "Naturaleza",
      author: "Diego Pérez",
      date: "2024-05-28",
      readTime: "10 min",
      image: "/placeholder.svg",
      tags: ["senderismo", "naturaleza", "parque nacional"]
    },
    {
      id: 5,
      title: "Fotografía de Vida Silvestre: Capturando la Belleza Natural",
      excerpt: "Consejos profesionales para fotografiar la increíble fauna y paisajes de Puerto López.",
      category: "Fotografía",
      author: "Sofía Vega",
      date: "2024-05-20",
      readTime: "7 min",
      image: "/placeholder.svg",
      tags: ["fotografía", "vida silvestre", "técnicas"]
    },
    {
      id: 6,
      title: "Historia y Cultura: El Patrimonio de Puerto López",
      excerpt: "Un viaje a través de la rica historia y tradiciones culturales de este pueblo pesquero ecuatoriano.",
      category: "Cultura",
      author: "Roberto Silva",
      date: "2024-05-15",
      readTime: "9 min",
      image: "/placeholder.svg",
      tags: ["historia", "cultura", "tradiciones"]
    }
  ];

  const allPosts = [...posts, ...staticPosts];
  const categories = [...new Set(allPosts.map(post => post.category))];

  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.excerpt || post.content).toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreatePost = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleSavePost = async (postData: any) => {
    if (editingPost) {
      await updatePost(editingPost.id, postData);
    } else {
      await createPost(postData);
    }
    setShowEditor(false);
    setEditingPost(null);
  };

  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);
  };

  if (showEditor) {
    return (
      <BlogEditor
        post={editingPost}
        onSave={handleSavePost}
        onCancel={() => {
          setShowEditor(false);
          setEditingPost(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-ocean">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <BookOpen className="h-12 w-12 text-white mr-4" />
                <h1 className="text-6xl font-bold text-white drop-shadow-lg">
                  Blog de Puerto López
                </h1>
              </div>
              <p className="text-2xl text-white/90 drop-shadow-md mb-8">
                Historias, consejos y experiencias sobre el paraíso costero del Ecuador
              </p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar artículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/70"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <BlogHeader user={user} onCreatePost={handleCreatePost} />
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Badge variant="outline" className="text-ocean border-ocean hover:bg-ocean hover:text-white cursor-pointer">
              Todos
            </Badge>
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant="outline" 
                className="text-ocean border-ocean hover:bg-ocean hover:text-white cursor-pointer"
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-t-lg" />
                  <CardHeader className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-6 bg-gray-200 rounded" />
                    <div className="h-12 bg-gray-200 rounded" />
                  </CardHeader>
                </Card>
              ))
            ) : filteredPosts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No se encontraron publicaciones</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  onReadMore={handleReadMore}
                />
              ))
            )}
          </div>

          {/* Newsletter Section */}
          <div className="mt-16">
            <Card className="bg-ocean text-white">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-4">
                  ¡Mantente al día con nuestras últimas historias!
                </CardTitle>
                <CardDescription className="text-white/80">
                  Suscríbete a nuestro boletín y recibe las mejores historias y consejos de Puerto López directamente en tu correo.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input 
                    placeholder="Tu email" 
                    className="bg-white/10 border-white/20 text-white placeholder-white/70"
                  />
                  <button className="bg-white text-ocean px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                    Suscribirse
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default Blog;
