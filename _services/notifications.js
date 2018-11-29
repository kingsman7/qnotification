import http from "axios"
import config from 'src/config/index'
import {remember} from '@imagina/qhelper/_plugins/remember'

export default {
  index(filter, take, page, fields, include) {
    return new Promise((resolve, reject) => {
      http.get(config('api.api_url') + '/notification/user', {
        params: {
          filter: filter,
          take: take,
          page: page,
          fields: fields,
          include: include
        }
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
    });
  },

  create(data) {
    return new Promise((resolve, reject) => {
      http.post(config('api.api_url') + '/notification/create', data)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  update(notificationId){
    return new Promise((resolve, reject) => {
      http.put(config('api.api_url') + '/notification/update/'+notificationId)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
