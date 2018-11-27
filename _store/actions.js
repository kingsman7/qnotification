import router from 'src/router/index';
import {helper} from '@imagina/qhelper/_plugins/helper';
import notificationService from '@imagina/qnotification/_services/notifications'

export const GET_NOTIFICATIONS = ({commit, getters, dispath}) => {
  notificationService.index().then(notifications => {
    commit('UPDATE_NOTIFICATIONS',notifications.data)
  })
}

/*export const PUSH_NOTIFICATION = ({commit, getters, dispatch},data) => {
  commit('UPDATE_NOTIFICATIONS',data)
};*/
