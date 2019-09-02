const pages = config('pages') // Get Pages from config

//E-commerce
export default [
  {
    title: 'qevent.sidebar.adminGroup',
    icon: 'fas fa-calendar',
    children: [
      pages.qnotification.notifications,
    ]
  },
]
