
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LogoUploadZoneProps {
  logoUrl?: string;
  uploading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

const LogoUploadZone = ({ logoUrl, uploading, onUpload, onRemove }: LogoUploadZoneProps) => {
  return (
    <div>
      <Label className="text-sm font-medium mb-3 block">Subir Logo</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
        {logoUrl ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img 
                src={logoUrl} 
                alt="Logo preview" 
                className="max-h-20 object-contain"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={onRemove}
                disabled={uploading}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">Logo subido exitosamente</p>
            <Label htmlFor="logo-upload" className="cursor-pointer">
              <Button variant="outline" disabled={uploading} asChild>
                <span>
                  {uploading ? 'Subiendo...' : 'Cambiar Logo'}
                </span>
              </Button>
            </Label>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <Button variant="outline" disabled={uploading} asChild>
                  <span>
                    {uploading ? 'Subiendo...' : 'Seleccionar Logo'}
                  </span>
                </Button>
              </Label>
              <Input
                id="logo-upload"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={onUpload}
                disabled={uploading}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              PNG, JPG, SVG hasta 2MB
            </p>
          </div>
        )}
        <Input
          id="logo-upload"
          type="file"
          className="sr-only"
          accept="image/*"
          onChange={onUpload}
          disabled={uploading}
        />
      </div>
    </div>
  );
};

export default LogoUploadZone;
