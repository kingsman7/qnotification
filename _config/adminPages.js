export default {
  // Providers
  setting: {
    permission: 'notification.notifications.manage',
    activated: true,
    path: {
      'en-us': '/notifications/setting',
      'es': '/notificaciones/configuracion',
    },
    name: 'notification.admin.providers',
    layout: () => import('@imagina/qsite/_layouts/master'),
    page: () => import('@imagina/qnotification/_pages/admin/setting/index'),
    title: 'qnotification.sidebar.adminConfig.title',
    headerTitle: 'qnotification.sidebar.adminConfig.headerTitle',
    icon: 'fab fa-stack-exchange',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  },
  notification: {
    permission: 'notification.notifications.manage',
    activated: true,
    path: 'qnotification/notificaion/index',
    name: 'qnotification.admin.notification',
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
