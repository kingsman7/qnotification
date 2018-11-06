import router from 'src/router/index';
import {helper} from '@imagina/qhelper/_plugins/helper';



export const PUSH_NOTIFICATION = ({commit, getters, dispatch},data) => {
  
  data.forEach((notification,index) =>{
    commit('PUSH_NOTIFICATION',notification)
  })
  helper.storage.set('notifications', getters.notifications);
};

export const FLUSH_NEWS = ({commit, getters, dispatch}) => {
  
  getters.notifications.forEach((notification,index) =>{
    notification.viewed = true;
  })
  helper.storage.set('notifications', getters.notifications);
  commit('FLUSH_NEWS')
};


export const FLUSH_NOTIFICATIONS = ({commit, dispatch}) => {
  commit('FLUSH_NOTIFICATIONS')
};
