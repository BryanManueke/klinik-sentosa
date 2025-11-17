import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, Role } from '@/contexts/AuthContext';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
