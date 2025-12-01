import { useState } from 'react';
// import { authPage } from './components/authPage';
import { LoginRegister } from './components/LoginRegister';
import { Dashboard } from './components/Dashboard';
import { AREABuilder } from './components/AREABuilder';
import { ServicesPage } from './components/ServicesPage';
import { ActivityLog } from './components/ActivityLog';
import { Settings } from './components/Settings';

type Page = 'auth' | 'dashboard' | 'builder' | 'services' | 'activity' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('auth');
  };

  const handleEditArea = (areaId: string) => {
    setEditingAreaId(areaId);
    setCurrentPage('builder');
  };

  const handleCreateArea = () => {
    setEditingAreaId(null);
    setCurrentPage('builder');
  };

  // if (!isAuthenticated && currentPage !== 'auth' && currentPage !== 'auth') {
  //   return <LoginRegister onLogin={handleLogin} onNavigateToauth={() => navigateTo('auth')} />;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {currentPage === 'auth' && (
        <authPage 
          onNavigateToAuth={() => navigateTo('auth')} 
          onNavigateToDashboard={() => isAuthenticated ? navigateTo('dashboard') : navigateTo('auth')}
        />
      )}
      {currentPage === 'auth' && (
        <LoginRegister onLogin={handleLogin} onNavigateToauth={() => navigateTo('auth')} />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard 
          onNavigate={navigateTo} 
          onLogout={handleLogout}
          onEditArea={handleEditArea}
          onCreateArea={handleCreateArea}
        />
      )}
      {currentPage === 'builder' && (
        <AREABuilder 
          onNavigate={navigateTo} 
          onLogout={handleLogout}
          editingAreaId={editingAreaId}
        />
      )}
      {currentPage === 'services' && (
        <ServicesPage onNavigate={navigateTo} onLogout={handleLogout} />
      )}
      {currentPage === 'activity' && (
        <ActivityLog onNavigate={navigateTo} onLogout={handleLogout} />
      )}
      {currentPage === 'settings' && (
        <Settings onNavigate={navigateTo} onLogout={handleLogout} />
      )}
    </div>
  );
}
