<template>
  <div id="pageNotifications"
       class="q-layout-page row layout-padding">

    <div class="text_title text-blue-9 col-xs-12 q-title text-right">
      <span>NOTIFICATIONS</span>
    </div>

    <div class="q-py-md q-title col-xs-12 text-negative">
      • YOUR NOTIFICATIONS
    </div>

    <div class="col-12">
      <div class="full-width row relative-position">
        <q-infinite-scroll :handler="getNotifications" inline ref="infiniteScrollUsers"
                           style="height: 470px; overflow-y: scroll; width: 100%">
          <q-list no-border separator class="full-width">
            <!-- collapsible to hide sub-level menu entries -->
            <q-collapsible :label="notification.user.fullName" :avatar="notification.user.mainimage"
                           :key="key" @click.native="updateNotification(notification,key)"
                           :class="!notification.viewedDate ? 'bg-blue-1' : 'bg-grey-2'"
                           :sublabel="$d($moment(notification.date, 'YYYY-MM-DD HH:mm').toDate(), 'long', $q.i18n.lang)"
                           v-for="(notification,key) in notifications">
              <div class="q-subheading-1 mesageNotification">
                {{notification.message}}
                <br>
                <q-btn v-if="notification.options.url" label="Go"
                       @click="goToNotificationURL(notification.options.url)"
                       color="secondary" icon="fas fa-globe" class="q-mt-md">
                </q-btn>
              </div>
            </q-collapsible>
          </q-list>

          <div slot="message" class="text-center">
            <q-spinner-dots color="primary" :size="40"></q-spinner-dots>
          </div>
        </q-infinite-scroll>
      </div>
    </div>
  </div>
</template>
<script>
  import notificationService from '@imagina/qnotification/_services/notifications'

  export default {
    props: {},
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {
        notifications : [],
        page: 0,
      }
    },
    methods: {
      //Get users with infinite scroll
      getNotifications(page, done) {
        if (page > this.page) {
          this.page = page //update current page infinite scroll

          //Request Notifications
          notificationService.index({},20,page).then(response => {
            let notifications = response.data.notifications
            setTimeout(() => {
              if (notifications.length) {//Load data
                this.notifications = this.notifications.concat(notifications)
                done()
              } else {//Stop infinite scroll
                this.$refs.infiniteScrollUsers.stop()
              }
            }, 500)
          })
        }
      },
      //Redirec to URL from notification
      goToNotificationURL(url){
        if(url)
          if (!url.match(/^https?:\/\//i)) {
            url = 'http://' + url;
          }
        window.open(url,'_blank')
      },
      //Update viewed at from notification
      updateNotification(notification,key){
        if(!notification.viewedDate){
          this.$store.dispatch('notification/UPDATE_NOTIFICATION',{id : notification.id})
        }

        this.notifications[key].viewedDate = true
      }
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
  #pageNotifications
    .q-list
      padding 0
    .q-collapsible-sub-item
      background white
      .mesageNotification
        padding 8px 0
        padding-left 45px
</style>
