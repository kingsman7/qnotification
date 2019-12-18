const pages = config('pages') // Get Pages from config

console.warn(pages)

export default [
	{
    title: 'qnotification.sidebar.adminGroup',
    icon: 'notifications',
    children: [
      pages.qnotification.notifications
    ]
  },
]
