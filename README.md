##Module Notification
 Module to manage push notifications
##Required

####Plugins
- helper
- pusher
- laravel echo

##Usage

####Routes and Middleware

In file `src/router/routes` add:
```js
import notifications from '@imagina/qnotification/_router/routes' //Routes module
```

####ENV file:

add config keys:
```js
# Values for Broadcast
BROADCAST_DRIVER=pusher
PUSHER_APP_KEY=YOUR_APP_KEY
PUSHER_APP_SECRET=YOUR_APP_SECRET
PUSHER_APP_ID=YOUR_APP_ID
PUSHER_APP_CLUSTER=YOUR_APP_CLUSTER
PUSHER_APP_ENCRYPTED=YOUR_APP_ENCRYPTER
```
####Stores

In file `src/store/index` add:
```js
import notification from '@imagina/qnotification/_store/index'; //Import this file
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    notification //Add notificationStore
  }
});
```

##Components
- widget-notification: component with flat button and chips:

`  import WidgetNotification from "@imagina/qnotification/_components/widget-notification";`

- add to your master layout 

 `<widget-notification></widget-notification>`
 
