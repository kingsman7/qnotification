export const UPDATE_NOTIFICATIONS = (state, data) => {
  state.notifications = state.notifications.concat(data.notifications);
  state.total = data.total;
  state.news = data.news;
};

export const PUSH_NOTIFICATION = (state, notification) => {
  state.notifications.unshift(notification)
  state.news++
  state.total++
}

export const UPDATE_NOTIFICATION = (state, data) => {
  for(var index in state.notifications){
    let item = state.notifications[index]
    if(item.id == data.id){
      state.notifications[index] = data
      break;
    }
  }

  state.news--
}


