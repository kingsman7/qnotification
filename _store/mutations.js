//Add data to state notifications
export const PUSH_NOTIFICATIONS = (state, data) => {
  //state.notifications = state.notifications.concat(data.notifications);
  state.notifications = data.notifications;
  state.total = data.total;
  state.news = data.news;
  state.page = data.notifications.length ? (state.page+1) : false
};

//Add new notification
export const PUSH_NOTIFICATION = (state, notification) => {
  let exist = state.notifications.find((ntf) => ntf.id == notification.id)
  if(!exist){
    state.notifications.unshift(notification)
    state.news++
    state.total++ 
  }
}

//Change status viewed to notification
export const UPDATE_NOTIFICATION = (state, data) => {
  state.news--

  for(var index in state.notifications){
    let item = state.notifications[index]
    if(item.id == data.id){
      state.notifications[index] = data
      break;
    }
  }
}

//Refresh notifications
export const REFRESH_NOTIFICATIONS = (state) => {
  let notifications = state.notifications
  state.notifications = []
  state.notifications = notifications
}




