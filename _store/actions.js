import router from 'src/router/index';
import {helper} from '@imagina/qhelper/_plugins/helper';
import notificationService from '@imagina/qnotification/_services/notifications'
import store from 'src/store/index'

export const GET_NOTIFICATIONS = ({commit, getters, dispath}, params) => {
  return new Promise(resolve => {
    if(getters.page){
      notificationService.index({}, 20, getters.page).then(response => {
        commit('PUSH_NOTIFICATIONS', response.data)
        resolve('ok')
      })
    }else{
      resolve('ok')
    }
  })
}

export const UPDATE_NOTIFICATION = ({commit, getters, dispath}, params) => {
  notificationService.update(params.id).then(response => {
    commit('REFRESH_NOTIFICATIONS')
    commit('UPDATE_NOTIFICATION', response.data)
  })
}
