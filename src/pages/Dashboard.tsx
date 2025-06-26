
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  FileText, 
  History, 
  User,
  LogOut,
  MapPin,
  Home,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContentEditor from '@/components/dashboard/ContentEditor';
import HistoryViewer from '@/components/dashboard/HistoryViewer';
import UserProfile from '@/components/dashboard/UserProfile';
import AttractionsManager from '@/components/dashboard/AttractionsManager';
import AdminManager from '@/components/dashboard/AdminManager';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hero');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-ocean-dark">
                Panel de Administración
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hola, {user?.user_metadata?.full_name || user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
              >
                Ver Sitio
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Panel de Control</CardTitle>
                <CardDescription>
                  Gestiona el contenido de tu sitio web
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  <Button
                    variant={activeTab === 'hero' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('hero')}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Editar Portada
                  </Button>
                  <Button
                    variant={activeTab === 'footer' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('footer')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Editar Pie de Página
                  </Button>
                  <Button
                    variant={activeTab === 'attractions' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('attractions')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Editar Atracciones
                  </Button>
                  <Button
                    variant={activeTab === 'admin' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('admin')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Gestión de Admins
                  </Button>
                  <Button
                    variant={activeTab === 'history' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('history')}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Historial de Cambios
                  </Button>
                  <Button
                    variant={activeTab === 'profile' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Mi Perfil
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeTab === 'hero' && <ContentEditor filterSection="hero" />}
            {activeTab === 'footer' && <ContentEditor filterSection="footer" />}
            {activeTab === 'attractions' && <AttractionsManager />}
            {activeTab === 'admin' && <AdminManager />}
            {activeTab === 'history' && <HistoryViewer />}
            {activeTab === 'profile' && <UserProfile />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
