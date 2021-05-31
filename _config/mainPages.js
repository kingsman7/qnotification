export default {
  notification: {
    permission: 'notification.notifications.manage',
    activated: true,
    path: 'notificaions/index',
    name: 'qnotification.main.notifications.index',
    layout: () => import('@imagina/qsite/_layouts/master'),
    page: () => import('@imagina/qnotification/_pages/admin/notification/index'),
    title: 'ui.label.notification',
    headerTitle: 'ui.label.notification',
    icon: 'far fa-bell',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  },
}
