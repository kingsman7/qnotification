<template>
  <div>
    <q-btn
      flat
      dense
      @click="showNotifications = !showNotifications"
      icon="notifications"/>
    <div v-if="showNotifications">
      <q-list
        highlight>
        <q-item
          link
          :to="{name: notificaction.link}"
          v-for="(notificaction, index) in notificactions.data"
          :key="index">
          <q-item-side
            :icon="notificaction.icon_class" />
          <q-item-main
            :label="notificaction.title"
            :sublabel="notificaction.message"/>
          <q-item-side
            right
            :stamp="notificaction.timeAgo" />
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        showNotifications: true,
        notificactions: {
          data: []
        }
      }
    },
    created() {
      this.getNotifications()
    },
    methods: {
      getNotifications(){
        this.loading = true
        let params ={
          params: {
            filter: {
              me: true
            }
          }
        }
        this.$crud.index('apiRoutes.qnotification.notifications', params)
          .then( response => {
            this.notificactions.data = response.data
            this.loading = false
          })
          .catch( error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.formInvalid'), pos: 'bottom'})
          })
      }
    }
  }
</script>

<style scoped>

</style>
