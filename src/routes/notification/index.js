import NotificationHistory from "../../app/pages/Notifications/NotificationHistory"
import NotificationSettings from "../../app/pages/Notifications/NotificationSettings"
import TemplatesList from "../../app/pages/Notifications/admin/TemplatesList"
import TemplateBuilder from "../../app/pages/Notifications/admin/TemplateBuilder"
import FieldCatalog from "../../app/pages/Notifications/admin/FieldCatalog"
import GlobalNotificationSettings from "../../app/pages/Notifications/admin/GlobalNotificationSettings"


export const NOTIFICATION_ELEMENT = {
  VIEW_NOTIFICATION_PAGE: <NotificationHistory />,
  VIEW_NOTIFICATION_SETTINGS_PAGE: <NotificationSettings />,
  // --- admin console (same /notifications namespace, group-access gated) ---
  ADMIN_TEMPLATES_PAGE: <TemplatesList />,
  // Same builder, two modes — mirrors UserForm type="create"/"update".
  // The id for update is passed via route state (location.state.id), not the URL.
  ADMIN_TEMPLATE_CREATE_PAGE: <TemplateBuilder mode="create" />,
  ADMIN_TEMPLATE_UPDATE_PAGE: <TemplateBuilder mode="update" />,
  ADMIN_FIELD_CATALOG_PAGE: <FieldCatalog />,
  ADMIN_GLOBAL_SETTINGS_PAGE: <GlobalNotificationSettings />
}

export const NOTIFICATION_ROUTE = {
  VIEW_NOTIFICATION: "/notifications/view",                       // user (unchanged)
  VIEW_NOTIFICATION_SETTINGS: "/notifications/settings/view",     // user prefs (unchanged)
  // --- admin console: NOT whitelisted in LayoutMenu.publicPaths, gated by group access ---
  ADMIN_TEMPLATES: "/notifications/templates",
  ADMIN_TEMPLATE_CREATE: "/notifications/templates/create",
  ADMIN_TEMPLATE_UPDATE: "/notifications/templates/update",       // id via route state, not URL
  ADMIN_FIELD_CATALOG: "/notifications/catalog",
  ADMIN_GLOBAL_SETTINGS: "/notifications/global-settings"
}

export const notification = [
  {
    path: NOTIFICATION_ROUTE.VIEW_NOTIFICATION,
    element: NOTIFICATION_ELEMENT.VIEW_NOTIFICATION_PAGE
  },
  {
    path: NOTIFICATION_ROUTE.VIEW_NOTIFICATION_SETTINGS,
    element: NOTIFICATION_ELEMENT.VIEW_NOTIFICATION_SETTINGS_PAGE
  },
  {
    path: NOTIFICATION_ROUTE.ADMIN_TEMPLATES,
    element: NOTIFICATION_ELEMENT.ADMIN_TEMPLATES_PAGE
  },
  {
    path: NOTIFICATION_ROUTE.ADMIN_TEMPLATE_CREATE,
    element: NOTIFICATION_ELEMENT.ADMIN_TEMPLATE_CREATE_PAGE
  },
  {
    path: NOTIFICATION_ROUTE.ADMIN_TEMPLATE_UPDATE,
    element: NOTIFICATION_ELEMENT.ADMIN_TEMPLATE_UPDATE_PAGE
  },
  {
    path: NOTIFICATION_ROUTE.ADMIN_FIELD_CATALOG,
    element: NOTIFICATION_ELEMENT.ADMIN_FIELD_CATALOG_PAGE
  },
  {
    path: NOTIFICATION_ROUTE.ADMIN_GLOBAL_SETTINGS,
    element: NOTIFICATION_ELEMENT.ADMIN_GLOBAL_SETTINGS_PAGE
  }
]
