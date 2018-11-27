import http from "axios"
import config from 'src/config/index'
import {remember} from '@imagina/qhelper/_plugins/remember'

export default {
  index(){
    return new Promise((resolve, reject) => {
      http.get(config('api.api_url') + '/notification/platforms')
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
}
