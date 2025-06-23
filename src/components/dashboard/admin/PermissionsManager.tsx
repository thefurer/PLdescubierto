
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Users, Shield, Settings } from 'lucide-react';
import { useAdminManagement } from '@/hooks/useAdminManagement';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const sections = [
  { key: 'hero', name: 'Portada' },
  { key: 'footer', name: 'Pie de página' },
  { key: 'attractions', name: 'Atracciones' },
  { key: 'gallery', name: 'Galería' },
  { key: 'content', name: 'Contenido general' }
];

const PermissionsManager = () => {
  const { 
    adminUsers, 
    loadAdminUsers, 
    assignPermissions, 
    loading 
  } = useAdminManagement();
  
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Record<string, any>>({});

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const handlePermissionChange = async (
    userId: string, 
    section: string, 
    permissionType: 'can_view' | 'can_edit' | 'can_delete', 
    value: boolean
  ) => {
    const currentPerms = permissions[`${userId}_${section}`] || {
      can_view: false,
      can_edit: false,
      can_delete: false
    };

    const newPerms = { ...currentPerms, [permissionType]: value };
    
    setPermissions(prev => ({
      ...prev,
      [`${userId}_${section}`]: newPerms
    }));

    await assignPermissions(userId, section, newPerms);
  };

  const getPermissionValue = (userId: string, section: string, permissionType: string) => {
    return permissions[`${userId}_${section}`]?.[permissionType] || false;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-500" />
          <div>
            <CardTitle>Gestión de Permisos por Sección</CardTitle>
            <CardDescription>
              Asigna permisos granulares a cada administrador para secciones específicas
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {adminUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No hay administradores para gestionar</p>
          </div>
        ) : (
          <div className="space-y-6">
            {adminUsers.map((admin) => (
              <Card key={admin.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{admin.full_name}</CardTitle>
                      <CardDescription>{admin.email}</CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Settings className="h-3 w-3" />
                      Administrador
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sección</TableHead>
                        <TableHead className="text-center">Ver</TableHead>
                        <TableHead className="text-center">Editar</TableHead>
                        <TableHead className="text-center">Eliminar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sections.map((section) => (
                        <TableRow key={section.key}>
                          <TableCell className="font-medium">{section.name}</TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={getPermissionValue(admin.id, section.key, 'can_view')}
                              onCheckedChange={(value) => 
                                handlePermissionChange(admin.id, section.key, 'can_view', value)
                              }
                              disabled={loading}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={getPermissionValue(admin.id, section.key, 'can_edit')}
                              onCheckedChange={(value) => 
                                handlePermissionChange(admin.id, section.key, 'can_edit', value)
                              }
                              disabled={loading}
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={getPermissionValue(admin.id, section.key, 'can_delete')}
                              onCheckedChange={(value) => 
                                handlePermissionChange(admin.id, section.key, 'can_delete', value)
                              }
                              disabled={loading}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PermissionsManager;
