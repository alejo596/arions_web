import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import { PublicLayout } from './layouts/PublicLayout';
import { HomePage } from './pages/public/HomePage';

import { AdminLayout } from './layouts/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminNews } from './pages/admin/AdminNews';
import { AdminInnovationProjects } from './pages/admin/AdminInnovationProjects';
import { AdminConstructionProjects } from './pages/admin/AdminConstructionProjects';
import { AdminContacts } from './pages/admin/AdminContacts';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminClients } from './pages/admin/AdminClients';
import { AdminBudgets } from './pages/admin/AdminBudgets';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 0,
      retry: 1
    }
  }
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <PublicLayout>
                    <HomePage />
                  </PublicLayout>
                }
              />

              {/* Admin Auth Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Protected Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="news" element={<AdminNews />} />
                <Route path="projects-innovation" element={<AdminInnovationProjects />} />
                <Route path="projects-construction" element={<AdminConstructionProjects />} />
                <Route path="clients" element={<AdminClients />} />
                <Route path="budgets" element={<AdminBudgets />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="audit-logs" element={<AdminAuditLogs />} />
              </Route>

              {/* Catch all redirect */}
              <Route path="*" element={<NavigateToHome />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const NavigateToHome = () => {
  window.location.href = '/';
  return null;
};
