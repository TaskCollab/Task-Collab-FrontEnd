import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Providers/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    requireLogin?: boolean;
    requiredRole?: string | null;
}

/**
 * Props:
 * - children: the component(s) to render if access is granted.
 * - requireLogin (optional, default: false): if true, the user must be logged in.
 * - requiredRole (optional): if specified, the user must have this role.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireLogin = false, requiredRole = null }) => {
    const { user } = useAuth();

    // Check if the route requires login and if the user is logged in
    if (requireLogin && !user) {
        return <Navigate to="/login" replace />;
    }

    // If a specific role is required, check if the user has that role
    if (requiredRole && (!user || user.role !== requiredRole)) {
        return <Navigate to="/not-authorized" replace />;
    }

    // If all checks pass, render the children
    return <>{children}</>;
};

export default ProtectedRoute;