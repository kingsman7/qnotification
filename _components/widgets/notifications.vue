<template>
<div>
  <div class="relative-position q-mr-md">
    <q-chip
      round
      text-color="black"
      color="white"
      floating>{{notifications.pagination.total}}</q-chip>
  </div>
  <q-btn-dropdown
    dense
    outline
    rounded
    class="q-mr-lg"
    icon="notifications">
    <q-scroll-area
      style="width: 400px;height:200px;">
    <q-list separator class="q-pr-sm">
      <div v-if="notifications.data.length">
        <q-item
          v-for="(notification, index) in notifications.data"
          :key="index">
          <q-item-side
            color="info"
            :icon="notification.icon_class" />
          <q-item-main
            :label="notification.title"
            :sublabel="notification.message"/>
          <q-item-side
            right
            :stamp="notification.timeAgo" />
          <q-item-side right >
            <q-btn
              inverted
              color="primary"
              outline
              dense
              flat
              round
              @click="$router.push({name: notification.link})"
              size="10px"
              icon="fas fa-external-link-alt"/>
          </q-item-side>
          <q-item-side right >
            <q-btn
              inverted
              color="primary"
              outline
              flat
              dense
              round
              @click="updateNotification(notification)"
              size="15px"
              icon="far fa-times-circle"/>
          </q-item-side>
        </q-item>
      </div>
      <div v-else>
        <q-item>
          <q-item-side></q-item-side>
          <q-item-main>
            There are no notifications
          </q-item-main>
        </q-item>
        <q-item>
          <q-item-side></q-item-side>
          <q-item-main>
            <q-btn label="view All" class="full-width"></q-btn>
          </q-item-main>
        </q-item>
      </div>
    </q-list>
    </q-scroll-area>
  </q-btn-dropdown>
</div>
</template>

<script>
  import Echo from "laravel-echo";
  export default {
    data () {
      return {
        loading: false,
        showNotifications: false,
        notifications: {
          data: [],
          pagination:{
            page: 1,
            take: 10,
            total: 0,
          }
        },
        echo: null
      }
    },
    computed:{
      unreadNotifications (){
        return 0
      }
    },
    created() {
      this.$nextTick(()=> {
        this.getNotifications()
        this.initPusher()
      })
    },
    methods: {
      getNotifications(){
        this.loading = true
        let params ={
          params: {
            filter: {
              me: true
            },
            page: this.notifications.pagination.page,
            take: this.notifications.pagination.take
          },
        }
        this.$crud.index('apiRoutes.qnotification.notifications', params)
          .then( response => {
            this.notifications.data = response.data
            this.notifications.pagination.total = response.meta.page.total
            this.loading = false
          })
          .catch( error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.formInvalid'), pos: 'bottom'})
          })
      },
      updateNotification(notification){
        notification.isReas = true
        this.loading = true
        let params = {params: {}}
        this.$crud.update('apiRoutes.qnotification.notifications', notification.id, notification, params)
          .then( response => {
            // Update notification in Local data
            this.notifications.pagination.total --
            this.loading = false
          })
          .catch( error => {
            console.warn(error)
            this.$alert.error({message: this.$tr('ui.message.formInvalid'), pos: 'bottom'})
            this.loading = false
          })
      },
      initPusher(){
        this.echo = new Echo({
          broadcaster: env('BROADCAST_DRIVER', 'pusher'),
          key: env('PUSHER_APP_KEY'),
          cluster: env('PUSHER_APP_CLUSTER'),
          encrypted: env('PUSHER_APP_ENCRYPTED'),
        })
        this.echo.channel('global')
          .listen(`.notification.new`, data => {
            this.notifications.data.unshift(data)
            this.notifications.pagination.total ++
          })
          .listen(`.notification.new.${this.$store.state.quserAuth.userData.id}`, data => {
            this.notifications.data.unshift(data)
            this.notifications.pagination.total ++
          })
      },
    }
  }
</script>
