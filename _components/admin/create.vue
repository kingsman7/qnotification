<template>
   <div>
      <div class="q-pa-md q-gutter-sm">
         <q-btn label="Crear Notificaciòn" color="primary" @click="CreateNotification = !CreateNotification"></q-btn>
      </div>
      <q-dialog v-model="CreateNotification">
         <q-card>
            <q-toolbar>
               <q-avatar icon="far fa-envelope-open" class="text-primary">
               </q-avatar>
               <q-toolbar-title class="text-primary"><span class="text-weight-bold">Crear </span> Notificaciòn
               </q-toolbar-title>
               <q-btn flat round dense icon="close" v-close-popup></q-btn>
            </q-toolbar>
            <div class="relative-position q-mb-lg backend-page">
               <q-form autocorrect="off" autocomplete="off" ref="formContent" class="box q-mx-md"
                       @submit="createItem()"
                       @validation-error="$alert.error($tr('ui.message.formInvalid'))">
                  <div class="row q-col-gutter-x-md" v-if="success">
                     <!--Language-->
                     <q-card-section>
                        <q-input v-model="form.title" outlined dense
                                 :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                                 label="titulo"/>
                        <q-field v-model="form.message" borderless
                                 :rules="[val => !!val || $tr('ui.message.fieldRequired')]">
                           <q-editor v-model="form.message" class="full-width"
                                     :toolbar="editorText.toolbar" content-class="text-grey-9"
                                     toolbar-text-color="grey-9"/>
                        </q-field>
                        <q-select
                                outlined
                                v-model="form.icon"
                                :options="optionsEntity"
                                label="Tipo de Notificacion"
                                option-label="label"
                                dense
                                emit-value
                                map-options
                        />
                        <div class="col">
                           Enviar Notificaciòn a
                        </div>
                        <div class="col">
                           <q-toggle
                                   :false-value="true"
                                   label="A todos los segidores"
                                   :true-value="false"
                                   color="red"
                                   v-model="followers"
                           />
                           <div v-if="followers">
                              <q-select
                                      filled
                                      v-model="person"
                                      multiple
                                      :options="optionsFollowers"
                                      use-chips
                                      dense
                                      emit-value
                                      map-options
                                      option-label="label"
                                      label="Usuarios"
                              ></q-select>
                           </div>
                        </div>


                        <q-toggle
                                label="Agregar Enlace"
                                color="primary"
                                v-model="link"
                        />
                        <div v-if="link">
                           <q-input v-model="form.link" outlined dense
                                    label="Enlace interno o Externo"/>
                        </div>
                        <div class="text-right">
                           <!--Update button-->
                           <q-btn
                                   color="positive" :loading="loading"
                                   icon="fas fa-plus" :label="$tr('ui.label.update')" type="submit"
                           />
                        </div>

                        <!--Loading-->
                        <inner-loading :visible="loading"/>
                     </q-card-section>
                  </div>
               </q-form>
            </div>
         </q-card>
      </q-dialog>
   </div>
</template>

<script>
   export default {
      name: 'create-notification',
      data() {
         return {
            loading: false,
            CreateNotification: false,
            success: true,
            editorText: {
               toolbar: [
                  ['bold', 'italic', 'strike', 'underline', 'removeFormat'],
                  ['link'],
                  [
                     {
                        label: 'Font Size',
                        icon: 'format_size',
                        fixedLabel: true,
                        fixedIcon: true,
                        list: 'no-icons',
                        options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
                     }
                  ],
                  ['quote', 'unordered', 'ordered'],
                  ['fullscreen']
               ]
            },
            followers: true,
            link: false,
            form: {
               title: null,
               message: '',
               icon: null,
               link: '#',
               userId: null,
            },
            person: [],
            optionsEntity: [
               {label: 'Notification', value: 'far fa-bell'},
               {label: 'Noticia', value: 'far fa-newspaper'},
               {label: 'Promociòn', value: 'fas fa-percent'},
               {label: 'Cupon de descuento', value: 'fas fa-tag'}
            ],
            optionsFollowers: []
         }
      },
      mounted() {
         this.$nextTick(function () {
            this.init()
         })
      },
      methods: {
         async init() {
            await this.getFollowers()
         },
         createItem() {
            this.loading = true
            let data = this.$clone(this.form);
            if (!this.followers) {
               this.person = this.optionsFollowers.map(i => i.id)
            }
            if (this.person.length) {
               this.person.forEach(function (item) {
                  data.userId = item;
               })
               this.$crud.create("apiRoutes.qnotification.notifications", data)
                   .then(response => {
                      this.$q.dialog({
                         title: 'Notificaciòn enviada ',
                         color: 'positive',
                      }).onOk(() => {
                         this.form = {
                            title: null,
                            message: '',
                            icon: null,
                            link: '#',
                            userId: null,
                         }
                         this.CreateNotification = false
                         this.loading = false
                      })
                   }).catch(error => {
                  this.loading = false
                  this.$q.dialog({
                     title: 'Notificaciòn no enviada, verifique su conexion',
                     color: 'negative',
                  }).onOk(() => {
                     this.loading = false
                  })
               })
            } else {
               this.$q.dialog({
                  title: 'no se a selécionado usuarios',
                  color: 'negative',
               }).onOk(() => {
                  this.loading = false
               })
            }

         },
         clearForm() {
            this.form.comment = ''
            this.form.status = null
         },
         getFollowers() {
            //Params
            let params = {
               refresh: true,
               params: {
                  include: 'user',
                  filter: {storeId: this.storeId},
                  take: 10
               }
            }

            this.$crud.index("apiRoutes.qmarketplace.favoriteStore", params).then(response => {
               let data = []
               response.data.map(item => {
                  let user = this.$clone(data)
                  if (!user.filter(i => (i.id == item.userId)).length) {
                     data.push({fullName: item.user.fullName, id: item.user.id})
                  }
               })
               this.optionsFollowers = this.$array.select(data, {label: 'fullName', id: 'id'})
            }).catch(error => {
               console.error("ERROR - GET USERS FROM FAVORITE STORES", error)
               this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})

            })
         }
      }
   }
</script>
