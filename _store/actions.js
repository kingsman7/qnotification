import router from 'src/router/index';
import {helper} from '@imagina/qhelper/_plugins/helper';
import notificationService from '@imagina/qnotification/_services/notifications'
import store from 'src/store/index'

export const GET_NOTIFICATIONS = ({commit, getters, dispath}, params) => {
  let filter = params.filter ? params.filter : {}
  let take = params.take ? params.take : false
  let page = params.page ? params.page : false

  notificationService.index(filter, take, page).then(response => {
    commit('UPDATE_NOTIFICATIONS', response.data)
  })
}

export const UPDATE_NOTIFICATION = ({commit, getters, dispath}, params) => {
  notificationService.update(params.id).then(response => {
    commit('UPDATE_NOTIFICATION', response.data)
  })
}
