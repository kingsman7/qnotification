import {helper} from '@imagina/qhelper/_plugins/helper'; //LocalForage
import Echo from "laravel-echo";
import store from 'src/store/index';
import Pusher from "pusher-js";

class Notification {
  constructor() {
    this.Echo = new Echo({
      broadcaster: env('BROADCAST_DRIVER', 'pusher'),
      key: env('PUSHER_APP_KEY'),
      cluster: env('PUSHER_APP_CLUSTER'),
      encrypted: env('PUSHER_APP_ENCRYPTED'),
    });
  }

  global() {
    this.Echo.channel('global')
      .listen('.clearCache', (message) => {
        helper.clearCache(message["key"]);
      })
      .listen('.notification'+store.state.auth.userId, (response) => {
        store.commit('notification/PUSH_NOTIFICATION', response.data);
      })
      .listen('.report'+store.state.auth.userId, (response) => {
        let data = response.data
        let dataReport = {
          isGenerating: false,
          isAvailable: true,
          url: data.url,
        }
        store.dispatch('report/SET_REPORT_DATA', data.report, dataReport)
      });
  }
}


const notification = new Notification();


export default ({Vue}) => {
  Vue.prototype.$notification = notification;
}

export {notification};
