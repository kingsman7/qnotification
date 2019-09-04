//Layout container
import master from 'src/layouts/master'
import blank from 'src/layouts/blank'

//Middleware
import auth from '@imagina/quser/_router/middlewares/auth'
import access from '@imagina/quser/_router/middlewares/access'

export default {
  // Notifications List
  notifications: {
    permission: null,
    activated: true,
    path: '/notifications',
    name: 'qnotification.admin.notifications.index',
    layout: require('@imagina/qnotification/_layouts/admin/notifications/index').default,
    containerLayout: master,
    title: 'qnotification.sidebar.adminNotifications',
    icon: 'notifications',
    middleware: [auth,access]
  },
}
