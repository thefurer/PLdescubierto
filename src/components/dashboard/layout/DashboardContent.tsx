import ContentEditor from '../ContentEditor';
import AttractionsManager from '../AttractionsManager';
import VisualDesignManager from '../VisualDesignManager';
import AdminManager from '../AdminManager';
import EnhancedHistoryViewer from '../EnhancedHistoryViewer';
import UserProfile from '../UserProfile';
import EditableTravelGuide from './EditableTravelGuide';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DashboardContentProps {
  activeTab: string;
}

const DashboardContent = ({ activeTab }: DashboardContentProps) => {
  const { isReadOnly, loading, isMainAdmin } = useUserRole();

  // Show read-only banner for non-admin users (except on profile page)
  const showReadOnlyBanner = isReadOnly && activeTab !== 'profile';

  const renderContent = () => {
    // Profile is always editable by the user themselves
    if (activeTab === 'profile') {
      return <UserProfile />;
    }

    // Admin section only visible to main admin
    if (activeTab === 'admin') {
      if (!isMainAdmin) {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Acceso Restringido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Solo el Super Administrador puede acceder a la gestión de administradores.
              </p>
            </CardContent>
          </Card>
        );
      }
      return <AdminManager />;
    }

    // Render content based on tab
    switch (activeTab) {
      case 'hero':
      case 'footer':
        return <ContentEditor filterSection={activeTab} />;
      case 'attractions':
        return <AttractionsManager />;
      case 'travel-guide':
        return <EditableTravelGuide />;
      case 'visual-design':
        return <VisualDesignManager />;
      case 'history':
        return <EnhancedHistoryViewer />;
      default:
        return <ContentEditor filterSection="hero" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {showReadOnlyBanner && (
        <Alert className="bg-amber-50 border-amber-200">
          <Eye className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Modo de solo lectura:</strong> Puedes ver el contenido pero no tienes permisos para editarlo. 
            Contacta al Super Administrador si necesitas acceso de edición.
          </AlertDescription>
        </Alert>
      )}
      <div className={isReadOnly && activeTab !== 'profile' && activeTab !== 'history' ? 'pointer-events-none opacity-75 select-none' : ''}>
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardContent;
