import React from 'react';
import LayoutMenu from './SidebarMenu/LayoutMenu';

/**
 * Global layout wrapper for all protected routes
 * This prevents the layout from re-rendering on every navigation
 */
const ProtectedLayout = ({ children }) => {
  return <LayoutMenu>{children}</LayoutMenu>;
};

export default ProtectedLayout;
