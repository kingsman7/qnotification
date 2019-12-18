export default {
  // Notifications List
  notifications: {
    permission: 'notification.notifications.manage',
    activated: true,
    path: '/notifications',
    name: 'qnotification.admin.notifications.index',
    page: () => import('@imagina/qnotification/_layouts/admin/notifications/index'),
    layout: () => import('src/layouts/master'),
    title: 'qnotification.sidebar.adminNotifications',
    icon: 'notifications',
    authenticated: true
  },
}
