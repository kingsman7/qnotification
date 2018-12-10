import Route from 'vue-routisan'
import auth from '@imagina/quser/_router/middlewares/auth' //Middleware auth
import access from '@imagina/quser/_router/middlewares/access' //Middleware access


/*VIEWS*/
import home from 'src/layouts/master'


Route.view('/notifications', home)
  .guard(auth)
  .children(() => {
      Route.view('/', require('../_layouts/notifications').default).name('notifications');
      Route.view('/create', require('../_layouts/create').default).options({
        name:'notifications.create',
        meta: {permission: 'fhia.roles.admin'},
        guard: access
      });
    }
  )

export default Route.all()
