export default {
	//index
	index: {
		permission: null,
		activated: true,
		path: '/notifications',
		name: 'notifications.index',
		page: () => import('@imagina/qnotification/_layouts/notifications'),
		layout: () => import('src/layouts/master'),
		title: 'Notifications',
		icon: 'fas fa-chart-bar'
	},
	//create
	create: {
		permission: 'fhia.roles.admin',
		activated: true,
		path: '/notifications/create',
		name: 'notifications.create',
		page: () => import('@imagina/qnotification/_layouts/create'),
		layout: () => import('src/layouts/master'),
		title: 'Create',
		icon: 'fas fa-chart-bar'
	},
}
