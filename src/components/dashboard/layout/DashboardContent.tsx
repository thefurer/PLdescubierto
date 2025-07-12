
import ContentEditor from '../ContentEditor';
import VisualDesignManager from '../VisualDesignManager';
import AdminManager from '../AdminManager';
import HistoryViewer from '../HistoryViewer';
import UserProfile from '../UserProfile';

interface DashboardContentProps {
  activeTab: string;
}

const DashboardContent = ({ activeTab }: DashboardContentProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'hero':
        return <ContentEditor />;
      case 'visual-design':
        return <VisualDesignManager />;
      case 'admin':
        return <AdminManager />;
      case 'history':
        return <HistoryViewer />;
      case 'profile':
        return <UserProfile />;
      default:
        return <ContentEditor />;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};

export default DashboardContent;
