import NotificationHistory from "../../app/pages/Notifications/NotificationHistory"
import NotificationSettings from "../../app/pages/Notifications/NotificationSettings" 


export const NOTIFICATION_ELEMENT = {
  VIEW_NOTIFICATION_PAGE: <NotificationHistory />,
  VIEW_NOTIFICATION_SETTINGS_PAGE: <NotificationSettings />
}

export const NOTIFICATION_ROUTE = {
  VIEW_NOTIFICATION: "/notifications/view",
  VIEW_NOTIFICATION_SETTINGS: "/notifications/settings/view"
}

export const notification = [
  {
    path: NOTIFICATION_ROUTE.VIEW_NOTIFICATION,
    element: NOTIFICATION_ELEMENT.VIEW_NOTIFICATION_PAGE
  },
  {
    path: NOTIFICATION_ROUTE.VIEW_NOTIFICATION_SETTINGS,
    element: NOTIFICATION_ELEMENT.VIEW_NOTIFICATION_SETTINGS
  }
]
