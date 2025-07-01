
import ContentEditor from '@/components/dashboard/ContentEditor';
import HistoryViewer from '@/components/dashboard/HistoryViewer';
import UserProfile from '@/components/dashboard/UserProfile';
import AttractionsManager from '@/components/dashboard/AttractionsManager';
import AdminManager from '@/components/dashboard/AdminManager';
import VisualDesignManager from '@/components/dashboard/VisualDesignManager';

interface DashboardContentProps {
  activeTab: string;
}

const DashboardContent = ({ activeTab }: DashboardContentProps) => {
  switch (activeTab) {
    case 'hero':
      return <ContentEditor filterSection="hero" />;
    case 'footer':
      return <ContentEditor filterSection="footer" />;
    case 'attractions':
      return <AttractionsManager />;
    case 'visual-design':
      return <VisualDesignManager />;
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

export default DashboardContent;
