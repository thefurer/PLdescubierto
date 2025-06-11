
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone } from 'lucide-react';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
}

interface ProfileFormProps {
  profile: Profile;
  onProfileUpdate: () => void;
}

const ProfileForm = ({ profile, onProfileUpdate }: ProfileFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [bio, setBio] = useState(profile.bio || '');

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          bio: bio
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado exitosamente."
      });

      onProfileUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Nombre completo</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Tu nombre completo"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              value={profile.email || ''}
              disabled
              className="pl-10 bg-gray-50"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Tu número de teléfono"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="bio">Biografía</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Cuéntanos sobre ti..."
          rows={4}
        />
      </div>

      <Button 
        onClick={updateProfile} 
        disabled={loading}
        className="bg-ocean hover:bg-ocean-dark"
      >
        {loading ? 'Actualizando...' : 'Guardar Cambios'}
      </Button>
    </div>
  );
};

export default ProfileForm;
