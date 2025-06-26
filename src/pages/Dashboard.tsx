
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Settings, 
  FileText, 
  History, 
  User,
  LogOut,
  MapPin,
  Home,
  Shield,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import ContentEditor from '@/components/dashboard/ContentEditor';
import HistoryViewer from '@/components/dashboard/HistoryViewer';
import UserProfile from '@/components/dashboard/UserProfile';
import AttractionsManager from '@/components/dashboard/AttractionsManager';
import AdminManager from '@/components/dashboard/AdminManager';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('hero');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigationItems = [
    { id: 'hero', label: 'Editar Portada', icon: Home },
    { id: 'footer', label: 'Editar Pie de Página', icon: FileText },
    { id: 'attractions', label: 'Editar Atracciones', icon: MapPin },
    { id: 'admin', label: 'Gestión de Admins', icon: Shield },
    { id: 'history', label: 'Historial de Cambios', icon: History },
    { id: 'profile', label: 'Mi Perfil', icon: User }
  ];

  const renderNavigation = () => (
    <nav className="space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'default' : 'ghost'}
            className="w-full justify-start text-left"
            onClick={() => {
              setActiveTab(item.id);
              if (isMobile) setSidebarOpen(false);
            }}
          >
            <Icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'hero':
        return <ContentEditor filterSection="hero" />;
      case 'footer':
        return <ContentEditor filterSection="footer" />;
      case 'attractions':
        return <AttractionsManager />;
      case 'admin':
        return <AdminManager />;
      case 'history':
        return <HistoryViewer />;
      case 'profile':
        return <UserProfile />;
      default:
        return <ContentEditor filterSection="hero" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {isMobile && (
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="mr-2">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0">
                    <div className="p-6">
                      <h2 className="text-lg font-semibold mb-4">Panel de Control</h2>
                      {renderNavigation()}
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              <h1 className="text-xl md:text-2xl font-bold text-ocean-dark">
                Panel de Administración
              </h1>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="text-xs md:text-sm text-gray-600 hidden sm:block">
                Hola, {user?.user_metadata?.full_name || user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="text-xs md:text-sm"
              >
                <span className="hidden sm:inline">Ver Sitio</span>
                <span className="sm:hidden">Ver</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-xs md:text-sm"
              >
                <LogOut className="h-4 w-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base md:text-lg">Panel de Control</CardTitle>
                  <CardDescription className="text-sm">
                    Gestiona el contenido de tu sitio web
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 px-6 pb-6">
                  {renderNavigation()}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="space-y-4 md:space-y-6">
              {/* Mobile Tab Indicator */}
              {isMobile && (
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {(() => {
                        const activeItem = navigationItems.find(item => item.id === activeTab);
                        const Icon = activeItem?.icon || Home;
                        return (
                          <>
                            <Icon className="h-5 w-5 mr-2 text-ocean" />
                            <span className="font-medium text-sm">{activeItem?.label}</span>
                          </>
                        );
                      })()}
                    </div>
                    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Menu className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80 p-0">
                        <div className="p-6">
                          <h2 className="text-lg font-semibold mb-4">Panel de Control</h2>
                          {renderNavigation()}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </Card>
              )}
              
              {/* Dynamic Content */}
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
