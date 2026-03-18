import React from 'react';
import { useLocation } from 'react-router-dom';
import LayoutMenu from './SidebarMenu/LayoutMenu';

/**
 * Global layout wrapper for all protected routes
 * This prevents the layout from re-rendering on every navigation
 * Certain routes (like switch-entity) will render without sidebar/header
 */
const ProtectedLayout = ({ children }) => {
  const location = useLocation();
  const noLayoutRoutes = ['/switch-entity', '/switch-position'];
  
  // If current route is in noLayoutRoutes, render children without LayoutMenu
  if (noLayoutRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }
  
  return <LayoutMenu>{children}</LayoutMenu>;
};

export default ProtectedLayout;
