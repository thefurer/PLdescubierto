
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, Shield, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SuperAdminPanel from './SuperAdminPanel';
import { useAdminManagement } from '@/hooks/useAdminManagement';

const AdminManager = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { isMainAdmin } = useAdminManagement();
  const { toast } = useToast();

  const assignAdminRole = async () => {
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

      if (error) {
        throw error;
      }

      toast({
        title: 'Éxito',
        description: `Rol de administrador asignado a ${email}`,
      });

      setEmail('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo asignar el rol de administrador',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createInitialAdmin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('create_initial_admin');

      if (error) {
        throw error;
      }

      toast({
        title: 'Éxito',
        description: 'Rol de administrador inicial creado',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo crear el administrador inicial',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={isMainAdmin ? "super-admin" : "basic"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Administración Básica
          </TabsTrigger>
          <TabsTrigger 
            value="super-admin" 
            className="flex items-center gap-2"
            disabled={!isMainAdmin}
          >
            <Settings className="h-4 w-4" />
            Super Administrador
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-500" />
                <div>
                  <CardTitle>Gestión de Administradores</CardTitle>
                  <CardDescription>
                    Asigna roles de administrador a usuarios del sistema
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="admin-email">Email del Usuario</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  disabled={loading}
                />
              </div>

              <Button 
                onClick={assignAdminRole} 
                disabled={loading || !email.trim()}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                Asignar Rol de Administrador
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración Inicial</CardTitle>
              <CardDescription>
                Solo usar una vez para crear el primer administrador del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={createInitialAdmin} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Shield className="h-4 w-4 mr-2" />
                )}
                Crear Administrador Inicial
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de Seguridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>• Solo los administradores pueden gestionar contenido del sitio</p>
              <p>• Los usuarios públicos pueden ver contenido activo</p>
              <p>• Todas las operaciones están protegidas por RLS</p>
              <p>• El formulario de contacto tiene límites de velocidad</p>
              <p>• Solo emails autorizados pueden registrarse en el sistema</p>
              <p>• El administrador principal controla todos los permisos granulares</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="super-admin">
          <SuperAdminPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminManager;
