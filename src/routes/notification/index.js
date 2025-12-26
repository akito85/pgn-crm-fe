import NotificationHistory from "../../app/pages/Notifications/NotificationHistory"
import IconPreview from "../../app/pages/Notifications/IconPreview"

export const NOTIFICATION_ELEMENT = {
  VIEW_NOTIFICATION_PAGE: <NotificationHistory />,
  ICON_PREVIEW_PAGE: <IconPreview />
}

export const NOTIFICATION_ROUTE = {
  VIEW_NOTIFICATION: "/notifications/view",
  ICON_PREVIEW: "/notifications/iconPreview",
}

export const notification = [
  {
    path: NOTIFICATION_ROUTE.VIEW_NOTIFICATION,
    element: NOTIFICATION_ELEMENT.VIEW_NOTIFICATION_PAGE
  },
  {
    path: NOTIFICATION_ROUTE.ICON_PREVIEW,
    element: NOTIFICATION_ELEMENT.ICON_PREVIEW_PAGE
  }
]
