import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { CommandPalette } from './components/common/CommandPalette';
import { CallSummaryModal } from './components/modals/CallSummaryModal';
import { QuickModals } from './components/modals/QuickModals';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Calls } from './pages/Calls';
import { Customers } from './pages/Customers';
import { CustomerDetails } from './pages/CustomerDetails';
import { Tasks } from './pages/Tasks';
import { FollowUps } from './pages/FollowUps';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

const MainLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { settings } = useApp();

  return (
    <div className={`flex min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${settings.compactMode ? 'text-[13px]' : ''}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebarMobile={() => setIsMobileSidebarOpen(prev => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calls" element={<Calls />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/follow-ups" element={<FollowUps />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="py-4 px-6 border-t border-slate-200 dark:border-slate-850 text-center text-xs text-slate-400">
          <p>© 2026 CallFlow Support Command Centre • All telephony nodes operating normally.</p>
        </footer>
      </div>

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <CommandPalette />
      <CallSummaryModal />
      <QuickModals />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </BrowserRouter>
  );
}
