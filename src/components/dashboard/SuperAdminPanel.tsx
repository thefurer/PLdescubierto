
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, History, Mail, Star, Database } from 'lucide-react';
import { useAdminManagement } from '@/hooks/useAdminManagement';
import EmailAuthorizationManager from './admin/EmailAuthorizationManager';
import PermissionsManager from './admin/PermissionsManager';
import ActionsHistoryViewer from './admin/ActionsHistoryViewer';
import { RatingsManager } from './RatingsManager';
import DatabaseDiagramDownloader from './DatabaseDiagramDownloader';

const SuperAdminPanel = () => {
  const { isMainAdmin } = useAdminManagement();
  const [activeTab, setActiveTab] = useState('emails');

  if (!isMainAdmin) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <Shield className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center">
            Solo el administrador principal puede acceder a este panel
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-500" />
            <div>
              <CardTitle className="text-2xl">Panel de Super Administrador</CardTitle>
              <CardDescription>
                Gestión completa del sistema y control de administradores
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Autorización de Emails
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Gestión de Permisos
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historial de Acciones
          </TabsTrigger>
          <TabsTrigger value="ratings" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Calificaciones
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Base de Datos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emails" className="mt-6">
          <EmailAuthorizationManager />
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <PermissionsManager />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <ActionsHistoryViewer />
        </TabsContent>

        <TabsContent value="ratings" className="mt-6">
          <RatingsManager />
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          <DatabaseDiagramDownloader />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminPanel;
