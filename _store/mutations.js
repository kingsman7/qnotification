export const FLUSH_NOTIFICATIONS = (state) => {
  state.notifications = [];
  state.total = 0;
  state.news = 0;
};

export const PUSH_NOTIFICATION = (state, data ) => {
  state.notifications.push(data);
  state.total = state.notifications.length;
  let news = 0;
  state.notifications.forEach(not =>{
    if(!not.viewed)
      news++;
  })
  state.news += news;
};

export const FLUSH_NEWS = (state) => {
  state.news = 0;
};