
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, User, Settings } from 'lucide-react';
import { useAdminManagement } from '@/hooks/useAdminManagement';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

const SECTIONS = [
  { id: 'hero', name: 'Hero', description: 'Sección principal del sitio' },
  { id: 'footer', name: 'Footer', description: 'Pie de página' },
  { id: 'attractions', name: 'Atracciones', description: 'Gestión de atracciones turísticas' },
  { id: 'gallery', name: 'Galería', description: 'Gestión de imágenes' },
  { id: 'content', name: 'Contenido General', description: 'Otros contenidos del sitio' }
];

const PermissionsManager = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [permissions, setPermissions] = useState({
    can_view: false,
    can_edit: false,
    can_delete: false
  });
  const { adminPermissions, loading, assignSectionPermissions, loadAdminPermissions } = useAdminManagement();
  const { toast } = useToast();

  // Cargar usuarios administradores
  const loadAdminUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          profiles!user_roles_user_id_fkey(id, email, full_name, created_at)
        `)
        .eq('role', 'admin');

      if (error) throw error;

      const users = data?.map(item => ({
        id: item.user_id,
        email: item.profiles?.email || 'Email no disponible',
        full_name: item.profiles?.full_name || 'Nombre no disponible',
        created_at: item.profiles?.created_at || ''
      })) || [];

      setAdminUsers(users);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios administradores',
        variant: 'destructive'
      });
    }
  };

  const handleAssignPermissions = async () => {
    if (!selectedUser || !selectedSection) {
      toast({
        title: 'Error',
        description: 'Selecciona un usuario y una sección',
        variant: 'destructive'
      });
      return;
    }

    await assignSectionPermissions(selectedUser, selectedSection, permissions);
    
    // Resetear formulario
    setSelectedUser('');
    setSelectedSection('');
    setPermissions({ can_view: false, can_edit: false, can_delete: false });
  };

  const getSectionName = (sectionId: string) => {
    return SECTIONS.find(s => s.id === sectionId)?.name || sectionId;
  };

  useEffect(() => {
    loadAdminUsers();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-green-500" />
            <div>
              <CardTitle>Asignar Permisos Granulares</CardTitle>
              <CardDescription>
                Configura qué secciones puede gestionar cada administrador
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Usuario Administrador</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar usuario" />
                </SelectTrigger>
                <SelectContent>
                  {adminUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sección</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sección" />
                </SelectTrigger>
                <SelectContent>
                  {SECTIONS.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Permisos</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="can_view"
                  checked={permissions.can_view}
                  onCheckedChange={(checked) => 
                    setPermissions(prev => ({ ...prev, can_view: checked }))
                  }
                />
                <Label htmlFor="can_view">Ver</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="can_edit"
                  checked={permissions.can_edit}
                  onCheckedChange={(checked) => 
                    setPermissions(prev => ({ ...prev, can_edit: checked }))
                  }
                />
                <Label htmlFor="can_edit">Editar</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="can_delete"
                  checked={permissions.can_delete}
                  onCheckedChange={(checked) => 
                    setPermissions(prev => ({ ...prev, can_delete: checked }))
                  }
                />
                <Label htmlFor="can_delete">Eliminar</Label>
              </div>
            </div>
          </div>

          <Button
            onClick={handleAssignPermissions}
            disabled={loading || !selectedUser || !selectedSection}
            className="w-full"
          >
            <Settings className="h-4 w-4 mr-2" />
            Asignar Permisos
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permisos Actuales</CardTitle>
          <CardDescription>
            Estado actual de permisos de todos los administradores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {adminPermissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No hay permisos asignados</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Sección</TableHead>
                  <TableHead>Ver</TableHead>
                  <TableHead>Editar</TableHead>
                  <TableHead>Eliminar</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminPermissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{permission.user_name}</div>
                        <div className="text-sm text-gray-500">{permission.user_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getSectionName(permission.section_name)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={permission.can_view ? "default" : "secondary"}>
                        {permission.can_view ? 'Sí' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={permission.can_edit ? "default" : "secondary"}>
                        {permission.can_edit ? 'Sí' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={permission.can_delete ? "default" : "secondary"}>
                        {permission.can_delete ? 'Sí' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(permission.granted_at).toLocaleDateString('es-ES')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PermissionsManager;
