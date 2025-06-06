
import { useState } from 'react';
import { ArrowLeft, Save, X, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RichTextEditor from './RichTextEditor';

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

interface BlogEditorProps {
  post?: BlogPost | null;
  onSave: (post: BlogPost | Omit<BlogPost, 'id' | 'date' | 'author'>) => void;
  onCancel: () => void;
}

const BlogEditor = ({ post, onSave, onCancel }: BlogEditorProps) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [category, setCategory] = useState(post?.category || 'noticias');
  const [image, setImage] = useState(post?.image || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const categories = [
    { value: 'noticias', label: 'Noticias', color: 'bg-blue-100 text-blue-800' },
    { value: 'eventos', label: 'Eventos', color: 'bg-green-100 text-green-800' },
    { value: 'conservacion', label: 'Conservación', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'turismo', label: 'Turismo', color: 'bg-purple-100 text-purple-800' },
    { value: 'cultura', label: 'Cultura', color: 'bg-orange-100 text-orange-800' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage('');
    setImageFile(null);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Por favor completa al menos el título y el contenido');
      return;
    }

    const postData = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || content.substring(0, 150).replace(/[#*>`-]/g, '') + '...',
      category,
      image: image || undefined
    };

    if (post) {
      onSave({
        ...post,
        ...postData
      });
    } else {
      onSave(postData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={onCancel}
                className="mr-6 glass-card hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-ocean-dark via-ocean to-green-primary bg-clip-text text-transparent">
                  {post ? 'Editar Noticia' : 'Nueva Noticia'}
                </h1>
                <p className="text-gray-600 mt-2">
                  Comparte noticias e historias sobre Puerto López
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="h-4 w-4 mr-2" />
              {post ? 'Actualizar' : 'Publicar'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-ocean" />
                    Contenido Principal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title" className="text-base font-semibold">Título *</Label>
                    <Input
                      id="title"
                      placeholder="Escribe un título atractivo para tu noticia..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-2 text-lg"
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <Label htmlFor="excerpt" className="text-base font-semibold">Resumen</Label>
                    <Input
                      id="excerpt"
                      placeholder="Un breve resumen de la noticia (opcional)"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Si no se proporciona, se generará automáticamente desde el contenido
                    </p>
                  </div>

                  {/* Rich Text Editor */}
                  <div>
                    <Label className="text-base font-semibold">Contenido *</Label>
                    <div className="mt-2">
                      <RichTextEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Escribe el contenido de tu noticia aquí... Usa la barra de herramientas para formatear el texto."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Category Selection */}
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                          category === cat.value 
                            ? 'border-ocean bg-ocean/10' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Badge className={cat.color}>
                          {cat.label}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Image Upload */}
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Imagen destacada</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!image ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Arrastra una imagen o haz clic para seleccionar</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('imageInput')?.click()}
                      >
                        Seleccionar imagen
                      </Button>
                      <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <img 
                        src={image} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('imageInput')?.click()}
                        className="absolute bottom-2 left-2 bg-white/90 hover:bg-white"
                      >
                        Cambiar
                      </Button>
                      <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Publishing Actions */}
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {post ? 'Actualizar noticia' : 'Publicar noticia'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onCancel}
                    className="w-full"
                  >
                    Cancelar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogEditor;
