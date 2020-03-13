<template>
   <div class="q-inline-block widget-notification">
      <q-btn-dropdown class="" v-model="opened">
         <template v-slot:label>
            <div class="row items-center no-wrap">
               <q-icon left name="fas fa-bell"></q-icon>
            </div>
            <q-badge color="orange" floating v-if="notifications">{{notifications}}</q-badge>
         </template>
         <q-list class="bg-light">
            <!--  :to="{name: 'user.profile.me'}" -->
            <div v-if="notifications">
               <q-item clickable v-ripple v-for="item in notificationData" :key="item.id" :to="item.link">
                  <q-item-section avatar>
                     <q-avatar color="red" text-color="white" :icon="item.icon"/>
                  </q-item-section>
                  <q-item-section class="q-py-md">
                     <div class="row"><span class="text-primary text-bold ">{{item.title}}</span></div>
                     <div class="row">{{item.timeAgo}}</div>
                  </q-item-section>
                  <q-item-section side>
                     <q-btn v-if="!item.isRead" dense round icon="fas fa-eye" class="q-mr-sm q-pa-xs"
                            size="10px" color="primary" @click="updateNotification(item.id)"/>
                  </q-item-section>
                  <q-separator/>
               </q-item>
               <div class="text-center q-py-md">
                  <q-btn class="rounded-sm  font-family-secondary" no-caps color="primary" :to="{name:'qmarketplace.admin.notifications.index'}">Ir a Notificaciones</q-btn>
               </div>

            </div>
            <div v-else>
               <q-item v-ripple>
                  <q-item-section avatar>
                     <q-avatar color="red" text-color="white" icon="far fa-times-circle"/>
                  </q-item-section>
                  <q-item-section class="q-py-md">
                     <span class="text-primary text-bold ">No tiene Notificaciones</span>
                  </q-item-section>
               </q-item>
            </div>


         </q-list>
      </q-btn-dropdown>
   </div>
</template>


<script>
   import Echo from "laravel-echo";
   export default {
      props: {},
      components: {},
      watch: {},
      computed:{
         focusWindow(){
            window.onfocus = function() {
               this.focused = true;
               console.log(this.focused)
            };
            window.onblur = function() {
               this.focused = false;
               console.log(this.focused)
            };
            return this.focused
         }
      },
      mounted() {
         this.$nextTick(function () {
            this.getNotifications()
            this.initPusher();
            this.checkPermissionForNotification()
         })
      },
      data() {
         return {
            notificationData: false,
            opened: false,
            notifications: 0,
            focused: true,
            token:null,
         }
      },
      methods: {
         getNotifications() {
            let params = {
               remember: false,
               params: {
                  include: '',
                  filter: {
                     me: true,
                     read: false,
                  },
                  take: 5,
                  page: 1
               }
            };//params
            this.loading = true
            this.$crud.index("apiRoutes.qnotification.notifications", params).then(response => {
               this.notifications = response.meta.page.total
               if (this.notifications > 99) {
                  this.notifications = 99
               }
               this.notificationData = response.data

            }).catch(error => {
               console.error('GET NOTIFICATIONS', error)
               //this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
               this.loading = false
            })
         },
         updateNotification(key) {
            this.loading = true
            let data = {
               isRead: true
            }
            this.$crud.update('apiRoutes.qnotification.notifications', key, data).then(response => {
            /*   this.$q.dialog({
                  title: 'Notificacion marcada como Leida!',
                  color: 'positive',
               }).onOk(() => {
                  this.getNotifications()
                  this.loading = false
               })*/
               this.getNotifications()
               this.loading = false
            }).catch(error => {
               this.loading = false
               this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
            })
         },
         initPusher() {
            this.echo = new Echo({
               broadcaster: env('BROADCAST_DRIVER', 'pusher'),
               key: env('PUSHER_APP_KEY'),
               cluster: env('PUSHER_APP_CLUSTER'),
               encrypted: env('PUSHER_APP_ENCRYPTED'),
            })
            this.echo.channel('imagina.notifications')
                .listen(`.notification.new.${this.$store.state.quserAuth.userData.id}`, response => {
                   this.getNotifications()
                   this.showPushNotitication(response)
                })
            FCMPlugin.getToken().then(token => {
             alert(token);
            });
            FCMPlugin.subscribeToTopic(`notification.new.${this.$store.state.quserAuth.userData.id}`);
         },
         redirect(url) {
            let base = this.$route
            let uri = window.location.href + '/#' + url
         },
         checkPermissionForNotification(){
            window.Notification.requestPermission().then( response => {
               if (response === 'granted'){
                  this.permissionForNotification = true
               }
            })
         },


         showPushNotitication(data){
            if (this.permissionForNotification && this.focused){
               navigator.serviceWorker.ready.then( registration => {
                  registration.showNotification(data.title, {
                     body: data.message,
                     icon: this.$store.getters['qsiteSettings/getSettingMediaByName']('isite::logo1').path,
                     click_action: ''
                  })
               }).catch(error => {
                  console.error(error)
               })
            }
         },

      }
   }
</script>
<style lang="stylus">
   .widget-notification
      .q-btn-dropdown__arrow
         display none !important
         margin-left 0

      .q-btn__wrapper
         padding-left: 0;

         &:before
            box-shadow none
</style>
