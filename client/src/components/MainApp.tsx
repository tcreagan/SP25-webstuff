import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppPage from './pages/app/AppPage';
// Import your authenticated components here
// Example: import Dashboard from './pages/Dashboard';

interface MainAppProps {
  user: {
    username: string;
    token: string;
  };
}

const MainApp: React.FC<MainAppProps> = ({ user }) => {
  return (
    <Routes>
      {/* Add your authenticated routes here */}
      <Route path="/app/editor" element={<AppPage />} />
      <Route path="/" element={<Navigate to="/app/editor" replace />} />
      <Route path="*" element={<Navigate to="/app/editor" replace />} />
      {/* Example: <Route path="/dashboard" element={<Dashboard user={user} />} /> */}
    </Routes>
  );
};

export default MainApp; 
