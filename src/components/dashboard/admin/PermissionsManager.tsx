import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Users, Eye, Edit, Trash2, Save, Shield, MapPin, Palette, Navigation, Image, FileText, Star, Settings, Loader2, AlertTriangle } from 'lucide-react';
import { useAdminManagement } from '@/hooks/useAdminManagement';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
interface PermissionState {
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
}
interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  permissions: any[];
}
const SECTIONS = [{
  id: 'tourist_attractions',
  name: 'Gestión de Atracciones',
  description: 'Crear, editar y eliminar atracciones turísticas',
  icon: MapPin,
  color: 'text-green-600'
}, {
  id: 'visual_design',
  name: 'Diseño Visual',
  description: 'Configurar colores, tipografía y elementos visuales',
  icon: Palette,
  color: 'text-purple-600'
}, {
  id: 'navbar_settings',
  name: 'Configuración de Navegación',
  description: 'Gestionar menús y navegación del sitio',
  icon: Navigation,
  color: 'text-blue-600'
}, {
  id: 'gallery_management',
  name: 'Gestión de Galería',
  description: 'Subir y organizar imágenes de la galería',
  icon: Image,
  color: 'text-pink-600'
}, {
  id: 'content_management',
  name: 'Gestión de Contenido',
  description: 'Editar contenido de páginas y secciones',
  icon: FileText,
  color: 'text-orange-600'
}, {
  id: 'travel_guide',
  name: 'Guía de Viaje',
  description: 'Gestionar consejos y recomendaciones de viaje',
  icon: Star,
  color: 'text-yellow-600'
}, {
  id: 'system_settings',
  name: 'Configuración del Sistema',
  description: 'Configuraciones avanzadas del sistema',
  icon: Settings,
  color: 'text-gray-600'
}];
const PermissionsManager = () => {
  const {
    adminUsers,
    loadAdminUsers,
    isMainAdmin
  } = useAdminManagement();
  const [loading, setLoading] = useState(false);
  const [savingPermissions, setSavingPermissions] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Record<string, Record<string, PermissionState>>>({});
  const {
    toast
  } = useToast();
  useEffect(() => {
    if (isMainAdmin) {
      loadAdminUsers();
    }
  }, [isMainAdmin, loadAdminUsers]);
  useEffect(() => {
    // Inicializar permisos desde los datos de usuarios admin solo si no hay permisos locales
    if (adminUsers.length > 0 && Object.keys(permissions).length === 0) {
      const initialPermissions: Record<string, Record<string, PermissionState>> = {};
      adminUsers.forEach(user => {
        initialPermissions[user.id] = {};
        SECTIONS.forEach(section => {
          const userPermission = user.permissions?.find((p: any) => p.section_name === section.id);
          initialPermissions[user.id][section.id] = {
            can_view: userPermission?.can_view || false,
            can_edit: userPermission?.can_edit || false,
            can_delete: userPermission?.can_delete || false
          };
        });
      });
      setPermissions(initialPermissions);
      console.log('Initialized permissions:', initialPermissions);
    }
  }, [adminUsers]);
  const updatePermission = (userId: string, sectionId: string, permissionType: keyof PermissionState, value: boolean) => {
    console.log('Updating permission:', {
      userId,
      sectionId,
      permissionType,
      value
    });
    setPermissions(prev => {
      const currentUserPermissions = prev[userId] || {};
      const currentSectionPermissions = currentUserPermissions[sectionId] || {
        can_view: false,
        can_edit: false,
        can_delete: false
      };
      const newPermissions = {
        ...prev,
        [userId]: {
          ...currentUserPermissions,
          [sectionId]: {
            ...currentSectionPermissions,
            [permissionType]: value
          }
        }
      };
      console.log('New permissions state:', newPermissions);
      return newPermissions;
    });
  };
  const saveUserPermissions = async (userId: string) => {
    if (!isMainAdmin) {
      toast({
        title: 'Error',
        description: 'Solo el administrador principal puede gestionar permisos',
        variant: 'destructive'
      });
      return;
    }
    setSavingPermissions(userId);
    try {
      const userPermissions = permissions[userId];

      // Guardar permisos para cada sección
      for (const section of SECTIONS) {
        const sectionPermissions = userPermissions?.[section.id];
        if (sectionPermissions) {
          const {
            error
          } = await supabase.rpc('assign_section_permissions', {
            target_user_id: userId,
            section: section.id,
            can_view: sectionPermissions.can_view,
            can_edit: sectionPermissions.can_edit,
            can_delete: sectionPermissions.can_delete
          });
          if (error) throw error;
        }
      }
      toast({
        title: 'Éxito',
        description: 'Permisos actualizados correctamente'
      });

      // No recargar automáticamente para evitar sobrescribir cambios pendientes
      // await loadAdminUsers();
    } catch (error: any) {
      console.error('Error saving permissions:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudieron guardar los permisos',
        variant: 'destructive'
      });
    } finally {
      setSavingPermissions(null);
    }
  };
  const getPermissionIcon = (permissionType: keyof PermissionState) => {
    switch (permissionType) {
      case 'can_view':
        return <Eye className="h-4 w-4" />;
      case 'can_edit':
        return <Edit className="h-4 w-4" />;
      case 'can_delete':
        return <Trash2 className="h-4 w-4" />;
    }
  };
  const getPermissionLabel = (permissionType: keyof PermissionState) => {
    switch (permissionType) {
      case 'can_view':
        return 'Ver';
      case 'can_edit':
        return 'Editar';
      case 'can_delete':
        return 'Eliminar';
    }
  };
  const getUserPermissionsSummary = (userId: string) => {
    const userPermissions = permissions[userId];
    if (!userPermissions) return {
      total: 0,
      granted: 0
    };
    let total = 0;
    let granted = 0;
    Object.values(userPermissions).forEach(sectionPerms => {
      total += 3; // 3 permissions per section
      if (sectionPerms.can_view) granted++;
      if (sectionPerms.can_edit) granted++;
      if (sectionPerms.can_delete) granted++;
    });
    return {
      total,
      granted
    };
  };
  if (!isMainAdmin) {
    return <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <div>
              <CardTitle>Acceso Restringido</CardTitle>
              <CardDescription>
                Solo el administrador principal puede gestionar permisos granulares
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>;
  }
  return <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>Gestión de Permisos Granulares</CardTitle>
              <CardDescription>
                Asigne permisos específicos por módulo y acción para cada administrador
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                  <Eye className="h-4 w-4" />
                  <span className="font-semibold">Ver</span>
                </div>
                <p className="text-sm text-gray-600">Solo visualizar contenido</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                  <Edit className="h-4 w-4" />
                  <span className="font-semibold">Editar</span>
                </div>
                <p className="text-sm text-gray-600">Modificar contenido existente</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-red-600 mb-1">
                  <Trash2 className="h-4 w-4" />
                  <span className="font-semibold">Eliminar</span>
                </div>
                <p className="text-sm text-gray-600">Eliminar registros permanentemente</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {adminUsers.length === 0 ? <Card>
          <CardContent className="py-8 text-center text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay administradores registrados</p>
          </CardContent>
        </Card> : <Tabs defaultValue={adminUsers[0]?.id} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-auto p-2 bg-slate-200">
            {adminUsers.map(user => {
          const summary = getUserPermissionsSummary(user.id);
          return <TabsTrigger key={user.id} value={user.id} className="flex flex-col items-start p-3 h-auto data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <div className="flex items-center gap-2 w-full">
                    <Users className="h-4 w-4" />
                    <span className="font-medium truncate">{user.full_name}</span>
                  </div>
                  <div className="text-xs text-left w-full mt-1">
                    <div className="truncate text-muted-foreground">{user.email}</div>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {summary.granted}/{summary.total} permisos
                    </Badge>
                  </div>
                </TabsTrigger>;
        })}
          </TabsList>

          {adminUsers.map(user => <TabsContent key={user.id} value={user.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Permisos para {user.full_name}
                      </CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                    <Button onClick={() => saveUserPermissions(user.id)} disabled={savingPermissions === user.id} className="flex items-center gap-2">
                      {savingPermissions === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Guardar Permisos
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6">
                      {SECTIONS.map((section, index) => {
                  const SectionIcon = section.icon;
                  const userSectionPermissions = permissions[user.id]?.[section.id] || {
                    can_view: false,
                    can_edit: false,
                    can_delete: false
                  };
                  console.log('Rendering section permissions:', {
                    userId: user.id,
                    sectionId: section.id,
                    permissions: userSectionPermissions
                  });
                  return <div key={section.id}>
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <SectionIcon className={`h-6 w-6 ${section.color} mt-1`} />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">{section.name}</h4>
                                  <p className="text-sm text-gray-600 mb-4">{section.description}</p>
                                  
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      {(['can_view', 'can_edit', 'can_delete'] as const).map(permission => {
                              const isChecked = userSectionPermissions[permission] || false;
                              console.log('Switch state:', {
                                permission,
                                isChecked
                              });
                              return <div key={permission} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-2">
                                              {getPermissionIcon(permission)}
                                              <span className="font-medium">{getPermissionLabel(permission)}</span>
                                            </div>
                                            <Switch checked={isChecked} onCheckedChange={checked => {
                                  console.log('Switch clicked:', {
                                    permission,
                                    checked,
                                    userId: user.id,
                                    sectionId: section.id
                                  });
                                  updatePermission(user.id, section.id, permission, checked);
                                }} />
                                          </div>;
                            })}
                                    </div>
                                </div>
                              </div>
                            </div>
                            {index < SECTIONS.length - 1 && <Separator className="my-6" />}
                          </div>;
                })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>)}
        </Tabs>}
    </div>;
};
export default PermissionsManager;