export const UPDATE_NOTIFICATIONS = (state, data ) => {
  state.notifications = data;
  state.total = state.notifications.length;
  let news = 0;
  state.notifications.forEach(notification =>{
    if(!notification.viewedDate)
      news++;
  })
  state.news = news;
};


