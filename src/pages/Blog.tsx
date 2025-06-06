
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, User, Lock, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogEditor from '@/components/blog/BlogEditor';

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
  const navigate = useNavigate();
  const { user } = useAuth();
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
    }
  ]);
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { value: 'noticias', label: 'Noticias', color: 'bg-blue-100 text-blue-800' },
    { value: 'eventos', label: 'Eventos', color: 'bg-green-100 text-green-800' },
    { value: 'conservacion', label: 'Conservación', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'turismo', label: 'Turismo', color: 'bg-purple-100 text-purple-800' },
    { value: 'cultura', label: 'Cultura', color: 'bg-orange-100 text-orange-800' }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/\n/g, '<br>');
  };

  if (showEditor) {
    return (
      <BlogEditor
        post={editingPost}
        onSave={editingPost ? handleEditPost : handleAddPost}
        onCancel={() => {
          setShowEditor(false);
          setEditingPost(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="mr-6 glass-card hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-ocean-dark via-ocean to-green-primary bg-clip-text text-transparent">
                  Noticias
                </h1>
                <p className="text-xl text-gray-600 mt-2">Últimas noticias y eventos de Puerto López</p>
              </div>
            </div>
            
            {user ? (
              <Button 
                onClick={() => setShowEditor(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva noticia
              </Button>
            ) : (
              <Card className="p-4 bg-yellow-50 border-yellow-200 glass-card">
                <div className="flex items-center text-yellow-800">
                  <Lock className="h-5 w-5 mr-2" />
                  <span className="text-sm">
                    <Button 
                      variant="link" 
                      onClick={() => navigate('/auth')}
                      className="p-0 h-auto text-yellow-800 underline"
                    >
                      Inicia sesión
                    </Button>
                    {' '}para crear publicaciones
                  </span>
                </div>
              </Card>
            )}
          </div>

          {/* Search and Filters */}
          <Card className="mb-8 glass-card border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar noticias..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas las categorías</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPosts.map((post) => {
              const categoryInfo = categories.find(cat => cat.value === post.category);
              return (
                <Card key={post.id} className="glass-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={categoryInfo?.color}>
                            {categoryInfo?.label}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(post.date)}
                          </div>
                        </div>
                        <CardTitle className="text-xl text-ocean-dark mb-3 leading-tight">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 text-base leading-relaxed">
                          {post.excerpt}
                        </CardDescription>
                      </div>
                      
                      {user && (
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingPost(post);
                              setShowEditor(true);
                            }}
                            className="glass-card"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                            className="glass-card hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      {post.author}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {post.image && (
                      <div className="mb-6">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                        />
                      </div>
                    )}
                    
                    <div className="prose max-w-none">
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: renderContent(post.content.length > 300 
                            ? `${post.content.substring(0, 300)}...` 
                            : post.content
                          )
                        }}
                        className="text-gray-700 leading-relaxed"
                      />
                    </div>
                    
                    <Button 
                      variant="link" 
                      className="p-0 mt-4 text-ocean hover:text-ocean-dark font-semibold"
                    >
                      Leer artículo completo →
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredPosts.length === 0 && (
            <Card className="text-center p-12 glass-card border-0 shadow-lg">
              <CardContent>
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600">
                    No se encontraron noticias
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm || selectedCategory 
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : user 
                        ? 'Sé el primero en compartir una noticia sobre Puerto López'
                        : 'Inicia sesión para ver y crear publicaciones'
                    }
                  </p>
                  {user && !searchTerm && !selectedCategory && (
                    <Button 
                      onClick={() => setShowEditor(true)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear primera noticia
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
