
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCheck, Users, Shield } from 'lucide-react';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
  profiles?: {
    email: string;
    full_name: string;
  };
}

const UserRoleManager = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'moderator' | 'user'>('user');
  const { toast } = useToast();

  const fetchUserRoles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role,
          created_at,
          profiles (
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async () => {
    if (!email.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa un email válido',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.rpc('assign_admin_role', {
        user_email: email.trim()
      });

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: `Rol asignado exitosamente a ${email}`,
      });

      setEmail('');
      await fetchUserRoles();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo asignar el rol',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4 text-red-500" />;
      case 'moderator': return <UserCheck className="h-4 w-4 text-blue-500" />;
      default: return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchUserRoles();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Asignar Roles de Usuario</CardTitle>
          <CardDescription>
            Gestiona los roles y permisos de los usuarios del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="user-email">Email del Usuario</Label>
              <Input
                id="user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@ejemplo.com"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="user-role">Rol</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="moderator">Moderador</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={assignRole} disabled={loading || !email.trim()} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserCheck className="h-4 w-4 mr-2" />}
            Asignar Rol
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios con Roles Especiales</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              {userRoles.map((userRole) => (
                <div key={userRole.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getRoleIcon(userRole.role)}
                    <div>
                      <h4 className="font-medium">
                        {userRole.profiles?.full_name || 'Usuario sin nombre'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {userRole.profiles?.email || 'Email no disponible'}
                      </p>
                    </div>
                  </div>
                  <Badge className={getRoleBadgeColor(userRole.role)}>
                    {userRole.role}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRoleManager;
