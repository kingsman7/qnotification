<template>
   <div id="pageNotifications"
        class=" q-py-xl q-container">

      <div class="row">
         <div class="col-12">
            <div class="text-h5 text-primary q-mb-md font-family-secondary">Notificaciones</div>
         </div>
         <div class="col-12">
            <q-card class="rounded-md bg-white q-mb-xl">
               <q-card-section>
                  <div class="row">
                     <div class="col-xs-12 col-sm-4 q-px-sm filters">
                        <q-select
                                outlined
                                v-model="filter.entity"
                                :options="$auth.hasAccess('marketplace.stores.mystore')?optionsEntity:optionsEntityUser"
                                stack-label
                                clearable
                                @input="getNotifications()"
                        >
                           <template v-slot:selected>
                              <span class="text-primary text-bold">Notificaciones de: </span>
                              <div
                                      v-if="filter.entity"
                                      class="q-my-none q-ml-xs q-mr-none"
                              >
                                 {{filter.entity.label}}
                              </div>
                              <div v-else> Todas</div>
                           </template>
                        </q-select>
                     </div>
                     <div class="col-xs-12 col-sm-4 q-px-sm filters">
                        <q-select
                                outlined
                                v-model="filter.read"
                                :options="optionsRead"
                                stack-label
                                clearable
                                @input="getNotifications()"
                        >
                           <template v-slot:selected>
                              <span class="text-primary text-bold">Notificaciones: </span>
                              <div
                                      v-if="filter.read"
                                      class="q-my-none q-ml-xs q-mr-none"
                              >
                                 {{filter.read.label}}
                              </div>
                              <div v-else> Todas</div>
                           </template>
                        </q-select>
                     </div>
                     <div class="col-xs-12 col-sm-4 q-px-sm filters" v-if="$auth.hasAccess('notification.notifications.create')">
                        <create-notification/>
                     </div>
                     <div class="col-sm-4 text-right q-pt-md q-px-sm" v-if="false">
                        <q-btn dense round icon="fas fa-eye" class="q-mr-sm q-pa-xs" size="10px" color="primary"
                               @click="updateAllNotification()"/>
                        <q-btn dense round icon="fas fa-trash-alt" class="q-mr-sm q-pa-xs" size="10px"
                               color="primary" v-if="$auth.hasAccess('notification.notifications.destroy')"
                               @click="deleteAllNotification()"/>
                     </div>
                  </div>
               </q-card-section>
               <q-card-section class="q-pa-lg">
                  <ul>
                     <li v-for="(item,i) in notifications" :key="item.id">
                        <div class="row q-col-gutter-md items-center">
                           <div class="col text-truncate">
                              <router-link :to="item.link" class="text-secondary">
                                 <div class="row">
                                    <div class="col-xs-12 col-md-2 col-xl-1 text-truncate">
                                       <q-avatar color="red" text-color="white" :icon="item.icon"></q-avatar>
                                    </div>
                                    <div class="col-xs-12 col-md-10 col-xl-11 ">
                                       <div class="row"><span class="text-primary text-bold ">{{item.title}}</span></div>
                                       <div class="row">{{item.message}}</div>
                                       <div class="row">{{item.timeAgo}}</div>
                                    </div>
                                 </div>
                              </router-link>

                           </div>
                           <div class="col-auto">
                              <q-btn v-if="!item.isRead" dense round icon="fas fa-eye" class="q-mr-sm q-pa-xs"
                                     size="10px" color="primary" @click="updateNotification(item.id)"/>
                              <q-btn dense round icon="fas fa-trash-alt" class="q-mr-sm q-pa-xs" size="10px"
                                     color="primary" v-if="$auth.hasAccess('notification.notifications.destroy')"
                                     @click="deleteNotification(item.id)"/>
                           </div>
                        </div>
                     </li>
                  </ul>
                  <div class="q-pa-lg flex flex-center" v-if="page">
                     <q-pagination
                             v-model="page"
                             :max="pages.lastPage"
                             :direction-links="true"
                             @input="getNotifications()"
                     >
                     </q-pagination>
                  </div>
                  <div class="q-pa-lg flex flex-center" v-else><span class="text-primary text-h6 text-bold ">Notificaciones no encontradas</span>
                  </div>
               </q-card-section>
               <inner-loading :visible="loading"/>
            </q-card>
         </div>
      </div>


   </div>
</template>
<script>
   import http from "axios"
   import createNotification from "@imagina/qnotification/_components/admin/create"
   import Echo from "laravel-echo";

   export default {
      props: {},
      watch: {},
      mounted() {
         this.$nextTick(function () {
            this.init()
         })
      },
      components:{
         createNotification
      },
      data() {
         return {
            page: 1,
            pages: {lastPage: 0},
            loading: false,
            notifications: [],
            notificationsRead: [],
            filter: {
               entity: null,
               read: {label: 'No Leídas', value: false}
            },
            optionsEntity: [
               {label: 'Notificación', value: 'far fa-bell'},
               {label: 'Chat', value: 'far fa-comments'},
               {label: 'Tienda', value: 'fas fa-store'},
               {label: 'Noticias', value: 'far fa-newspaper'},
               {label: 'Promoción', value: 'fas fa-percent'},
               {label: 'Cupón de descuento', value: 'fas fa-tag'},
               {label: 'Suscriptores', value: 'fas fa-users'}
            ],
            optionsEntityUser:[
               {label: 'Notificación', value: 'far fa-bell'},
               {label: 'Chat', value: 'far fa-comments'},
               {label: 'Noticias', value: 'far fa-newspaper'},
               {label: 'Promoción', value: 'fas fa-percent'},
               {label: 'Cupón de descuento', value: 'fas fa-tag'},
            ],
            optionsRead: [
               {label: 'Leidas', value: true},
               {label: 'No Leidas', value: false},
            ]
         }
      },
      methods: {
         async init() {
            await this.getNotifications()
            await this.initPusher()
         },
         //Get users with infinite scroll
         getNotifications() {
            let icon = this.filter.entity ? this.filter.entity.value : null
            let read = this.filter.read ? this.filter.read.value : null
            let params = {
               remember: false,
               params: {
                  include: '',
                  filter: {
                     me: true,
                     read: read,
                     icon: icon
                  },
                  take: 12,
                  page: this.page ? this.page : 1
               }
            };//params
            this.loading = true
            this.$crud.index("apiRoutes.qnotification.notifications", params).then(response => {
               this.notifications = response.data
               this.pages = response.meta.page
               if (!this.notifications.length) this.page = null;
               this.loading = false
            }).catch(error => {
               console.error(error)
               this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
               this.loading = false
            })
         },
         //Redirec to URL from notification
         goToNotificationURL(url) {
            return true
         },
         //Update viewed at from notification
         updateNotification(key) {
            this.loading = true
            let data = {
               isRead: true
            }
            this.$crud.update('apiRoutes.qnotification.notifications', key, data).then(response => {
               this.$q.dialog({
                  title: 'Notificacion marcada como Leida!',
                  color: 'positive',
               }).onOk(() => {
                  this.getNotifications()
                  this.loading = false
               })

            }).catch(error => {
               this.loading = false
               this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
            })
         },
         deleteNotification(key) {
            this.loading = true
            this.$q.dialog({
               title: 'Esta  seguro de eliminar esta Notificación!',
               color: 'negative',
               ok: 'Eliminar',
               cancel: 'Cancelar'
            }).onOk(() => {
               this.$crud.delete('apiRoutes.qnotification.notifications', key).then(response => {
                  this.$q.dialog({
                     title: 'Notificación marcada como Leída!',
                     color: 'negative',
                  }).onOk(() => {
                     this.getNotifications()
                     this.loading = false
                  })
               }).catch(error => {
                  this.loading = false
                  this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
               })
            }).onCancel(() => {
               this.loading = false
            })
         },
         updateAllNotification() {
            this.loading = true
            let data = {
               attributes: {
                  is_read: true
               },
            }
            let params = {
               filter: {
                  me: true,
                  read: false,
               },
            }

            this.$q.dialog({
               title: 'Esta  seguro de Marcar todas las Notificaciones como Leidas!',
               color: 'negative',
               ok: 'Aceptar',
               cancel: 'Cancelar'
            }).onOk(() => {
               http.post(`${config('apiRoutes.qnotification.updateAllNotification')}`, {params: params, data: data})
                   .then(response => {
                      this.$q.dialog({
                         title: 'Notificaciones marcadas como Leidas!',
                         color: 'positive',
                      }).onOk(() => {
                         this.getNotifications()
                         this.loading = false
                      })
                   })
                   .catch(error => {
                      this.loading = false
                      this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
                   });
            }).onCancel(() => {
               this.loading = false
            })
         },
         deleteAllNotification(key) {
            this.loading = true
            this.$q.dialog({
               title: 'Esta  seguro de eliminar esta Notificación!',
               color: 'negative',
               ok: 'Eliminar',
               cancel: 'Cancelar'
            }).onOk(() => {
               this.$crud.delete('apiRoutes.qnotification.notifications', key).then(response => {
                  this.$q.dialog({
                     title: 'Notificación marcada como Leída!',
                     color: 'negative',
                  }).onOk(() => {
                     this.getNotifications()
                     this.loading = false
                  })
               }).catch(error => {
                  this.loading = false
                  this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
               })
            }).onCancel(() => {
               this.loading = false
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
                })
         },
      }
   }
</script>
<style lang="stylus">
   #pageNotifications
      .q-list
         padding 0

      .q-collapsible-sub-item
         background white
         padding 8px 0 8px 35px

         .mesageNotification
            padding 15px

      ul
         list-style none
         padding-left 0

         li
            border 1px solid $primary
            padding 20px
            border-radius 10px
            margin-bottom 20px

      .filters
         font-size 12px
      @media screen and (max-width: $breakpoint-xs)
         ul
            li
               .q-avatar
                  font-size 12px
</style>
