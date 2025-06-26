
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';

interface ProfileAvatarProps {
  profile: {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
  onAvatarUpdate: () => void;
}

const ProfileAvatar = ({ profile, onAvatarUpdate }: ProfileAvatarProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen para subir.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: data.publicUrl,
        })
        .eq('id', user?.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Avatar actualizado",
        description: "Tu foto de perfil ha sido actualizada."
      });

      onAvatarUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const userInitials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : profile.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.avatar_url || ''} alt="Avatar" />
          <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
        </Avatar>
        <label className="absolute bottom-0 right-0 bg-ocean hover:bg-ocean-dark text-white rounded-full p-2 cursor-pointer shadow-lg">
          <Camera className="h-4 w-4" />
          <input
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      {uploading && <p className="text-sm text-gray-500">Subiendo...</p>}
    </div>
  );
};

export default ProfileAvatar;
