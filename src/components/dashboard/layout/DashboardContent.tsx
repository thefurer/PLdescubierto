
import ContentEditor from '../ContentEditor';
import AttractionsManager from '../AttractionsManager';
import VisualDesignManager from '../VisualDesignManager';
import AdminManager from '../AdminManager';
import HistoryViewer from '../HistoryViewer';
import UserProfile from '../UserProfile';
import EditableTravelGuide from '../travel-guide/EditableTravelGuide';

interface DashboardContentProps {
  activeTab: string;
}

const DashboardContent = ({ activeTab }: DashboardContentProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'hero':
      case 'footer':
        return <ContentEditor activeTab={activeTab} />;
      case 'attractions':
        return <AttractionsManager />;
      case 'travel-guide':
        return <EditableTravelGuide />;
      case 'visual-design':
        return <VisualDesignManager />;
      case 'admin':
        return <AdminManager />;
      case 'history':
        return <HistoryViewer />;
      case 'profile':
        return <UserProfile />;
      default:
        return <ContentEditor activeTab={activeTab} />;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};

export default DashboardContent;
