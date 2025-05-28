
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGalleryManager } from '@/hooks/useGalleryManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Upload, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GalleryManager = () => {
  const { images, loading, uploading, uploadImage, deleteImage } = useGalleryManager();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: '',
    altText: '',
    file: null as File | null
  });
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'Error',
          description: 'El archivo es demasiado grande. Máximo 5MB.',
          variant: 'destructive'
        });
        return;
      }
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.title || !uploadForm.category) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos.',
        variant: 'destructive'
      });
      return;
    }

    await uploadImage(
      uploadForm.file,
      uploadForm.title,
      uploadForm.category,
      uploadForm.altText || undefined
    );

    setUploadForm({ title: '', category: '', altText: '', file: null });
    setIsUploadOpen(false);
  };

  const handleDelete = async (image: any) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      await deleteImage(image.id, image.storage_path);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestión de Imágenes</CardTitle>
              <CardDescription>
                Sube, organiza y gestiona las imágenes de tu galería
              </CardDescription>
            </div>
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Subir Imagen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Subir Nueva Imagen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file">Archivo de Imagen</Label>
                    <Input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Título descriptivo de la imagen"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoría *</Label>
                    <Input
                      id="category"
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="ej: naturaleza, aventura, cultura"
                    />
                  </div>
                  <div>
                    <Label htmlFor="altText">Texto Alternativo</Label>
                    <Input
                      id="altText"
                      value={uploadForm.altText}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, altText: e.target.value }))}
                      placeholder="Descripción para accesibilidad"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpload} disabled={uploading}>
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Subir
                    </Button>
                    <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {images.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-gray-500 mb-4">No hay imágenes en la galería</p>
            <Button onClick={() => setIsUploadOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Subir Primera Imagen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image.id}>
              <CardContent className="p-4">
                <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">{image.title}</h3>
                  <p className="text-xs text-gray-500 capitalize">{image.category}</p>
                  {image.alt_text && (
                    <p className="text-xs text-gray-400">{image.alt_text}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      {new Date(image.created_at).toLocaleDateString()}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(image)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
