// components/LogoutButton.tsx
import React from 'react';

interface LogoutButtonProps {
  handleLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ handleLogout }) => {
  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
