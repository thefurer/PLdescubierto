
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Activity, AlertCircle } from 'lucide-react';
import { useAdminManagement } from '@/hooks/useAdminManagement';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ActionsHistoryViewer = () => {
  const { adminActions, loadAdminActions } = useAdminManagement();

  // Cargar historial de acciones automáticamente al montar el componente
  useEffect(() => {
    loadAdminActions();
  }, [loadAdminActions]);

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case 'create':
      case 'authorize_email':
        return 'bg-green-100 text-green-800';
      case 'update':
      case 'assign_permissions':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
      case 'revoke_authorization':
        return 'bg-red-100 text-red-800';
      case 'login':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionTypeText = (actionType: string) => {
    const actionTexts: Record<string, string> = {
      'create': 'Crear',
      'update': 'Actualizar',
      'delete': 'Eliminar',
      'login': 'Inicio de Sesión',
      'authorize_email': 'Autorizar Email',
      'revoke_authorization': 'Revocar Autorización',
      'assign_permissions': 'Asignar Permisos',
      'permission_change': 'Cambio de Permisos'
    };
    return actionTexts[actionType] || actionType;
  };

  const formatDetails = (details: any) => {
    if (!details || typeof details !== 'object') return '-';
    
    // Formatear detalles específicos según el tipo de acción
    if (details.email) {
      return `Email: ${details.email}`;
    }
    
    if (details.section && details.permissions) {
      const perms = details.permissions;
      const permsList = [];
      if (perms.can_view) permsList.push('Ver');
      if (perms.can_edit) permsList.push('Editar');
      if (perms.can_delete) permsList.push('Eliminar');
      return `Sección: ${details.section}, Permisos: ${permsList.join(', ')}`;
    }
    
    return JSON.stringify(details).substring(0, 100) + '...';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <History className="h-6 w-6 text-purple-500" />
          <div>
            <CardTitle>Historial de Acciones Administrativas</CardTitle>
            <CardDescription>
              Registro completo de todas las acciones realizadas por administradores
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {adminActions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No hay acciones registradas</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha/Hora</TableHead>
                <TableHead>Administrador</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Tabla Afectada</TableHead>
                <TableHead>Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminActions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">
                        {new Date(action.created_at).toLocaleDateString('es-ES')}
                      </div>
                      <div className="text-gray-500">
                        {new Date(action.created_at).toLocaleTimeString('es-ES')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{action.admin_name}</div>
                      <div className="text-sm text-gray-500">{action.admin_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getActionTypeColor(action.action_type)}>
                      <Activity className="h-3 w-3 mr-1" />
                      {getActionTypeText(action.action_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {action.target_table ? (
                      <Badge variant="outline">{action.target_table}</Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-sm">
                      {formatDetails(action.details)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionsHistoryViewer;
