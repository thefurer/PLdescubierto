import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Crown } from 'lucide-react';
import SuperAdminPanel from './SuperAdminPanel';
import { useAdminManagement } from '@/hooks/useAdminManagement';

const AdminManager = () => {
  const { isMainAdmin } = useAdminManagement();

  if (!isMainAdmin) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-yellow-500" />
            <div>
              <CardTitle>Acceso Restringido</CardTitle>
              <CardDescription>
                Solo el Super Administrador puede acceder a esta sección
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No tienes permisos para gestionar administradores. Contacta al Super Administrador si necesitas acceso.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Panel de Super Administrador</CardTitle>
              <CardDescription>
                Gestiona emails autorizados, roles de usuario y configuración del sistema
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <SuperAdminPanel />
    </div>
  );
};

export default AdminManager;
