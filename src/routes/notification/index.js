import NotificationHistory from "../../app/pages/Notifications/NotificationHistory"

export const NOTIFICATION_ELEMENT = {
  VIEW_NOTIFICATION_PAGE: <NotificationHistory />,
}

export const NOTIFICATION_ROUTE = {
  VIEW_NOTIFICATION: "/notifications/view",
}

export const notification = [
  {
    path: NOTIFICATION_ROUTE.VIEW_NOTIFICATION,
    element: NOTIFICATION_ELEMENT.VIEW_NOTIFICATION_PAGE
  },
]
