import {helper} from '@imagina/qhelper/_plugins/helper'; //LocalForage
import Echo from "laravel-echo";
import store from 'src/store/index';
import Pusher from "pusher-js";
import {alert} from '@imagina/qhelper/_plugins/alert'

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
        
        if(store.getters['report/isGeneratingReport'](data.reportName)){
          let storeData = {
            report: data.reportName,
            state:{
              isGenerating: false,
              isAvailable: true,
              generatedAt : store.getters['report/generatedAt'](data.reportName),
              isRunTimeOut: false,
              reportTitle: data.reportTitle,
            }
          }
          store.dispatch('report/SET_REPORT_DATA', storeData)
          alert.success('Report: ' + data.reportTitle + ', is available', 'top')
        }
        
      });
  }
}


const notification = new Notification();


export default ({Vue}) => {
  Vue.prototype.$notification = notification;
}

export {notification};
