
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
}

const Blog = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Temporada de Ballenas 2024: Un Éxito Extraordinario',
      content: 'Este año hemos sido testigos de uno de los espectáculos naturales más impresionantes...',
      author: 'Equipo Puerto López',
      date: '2024-09-15',
      excerpt: 'La temporada de ballenas jorobadas 2024 ha sido excepcional, con avistamientos récord y experiencias inolvidables para miles de visitantes.'
    },
    {
      id: '2',
      title: 'Nueva Ruta de Senderismo en Los Frailes',
      content: 'Inauguramos un nuevo sendero ecológico que conecta diferentes miradores...',
      author: 'Ministerio de Turismo',
      date: '2024-08-28',
      excerpt: 'Descubre la nueva ruta de senderismo que ofrece vistas panorámicas únicas de la costa ecuatoriana y la biodiversidad del Parque Nacional Machalilla.'
    },
    {
      id: '3',
      title: 'Festival Gastronómico del Mar 2024',
      content: 'Del 10 al 15 de octubre se realizará nuestro festival anual...',
      author: 'Cámara de Turismo',
      date: '2024-08-20',
      excerpt: 'Ven y disfruta de los sabores auténticos del mar en nuestro festival gastronómico, donde los mejores chefs locales presentarán sus especialidades.'
    }
  ]);
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-ocean-dark">Blog</h1>
                <p className="text-gray-600 mt-2">Noticias, historias y novedades de Puerto López</p>
              </div>
            </div>
            
            {user ? (
              <Button 
                onClick={() => setShowEditor(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva publicación
              </Button>
            ) : (
              <Card className="p-4 bg-yellow-50 border-yellow-200">
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

          {/* Blog Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-ocean-dark mb-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mb-3">
                        {post.excerpt}
                      </CardDescription>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {post.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(post.date)}
                        </div>
                      </div>
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
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="text-gray-700 leading-relaxed">
                    {post.content.length > 200 
                      ? `${post.content.substring(0, 200)}...` 
                      : post.content
                    }
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 mt-2 text-green-600 hover:text-green-700"
                  >
                    Leer más
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {posts.length === 0 && (
            <Card className="text-center p-8">
              <CardContent>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No hay publicaciones aún
                </h3>
                <p className="text-gray-500 mb-4">
                  {user 
                    ? 'Sé el primero en compartir una historia sobre Puerto López'
                    : 'Inicia sesión para ver y crear publicaciones'
                  }
                </p>
                {user && (
                  <Button 
                    onClick={() => setShowEditor(true)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear primera publicación
                  </Button>
                )}
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
