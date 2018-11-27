<template>
  <div id="notificationList" class="full-height" view="hHh Lpr lFf">
    <q-layout container style="height: 100%;">
      <q-layout-header class="no-shadow text-center q-py-md bg-white">
        <h1 class="q-title text-primary q-ma-none">
          <q-icon name="fas fa-bell"></q-icon>
          Notifications
        </h1>
        <q-toggle v-model="filter.unread"
                  class="q-mt-md"
                  label="Only Unread" />
      </q-layout-header>

      <q-page-container>
        <!--Notifications-->
        <q-item multiline :key="key" :class="!notification.viewedDate ? 'bg-grey-3' : ''"
                v-if="!notification.viewedDate || (notification.viewedDate && !filter.unread)"
                v-for="(notification,key) in this.$store.state.notification.notifications">
          <!--img user-->
          <q-item-side>
            <q-item-tile avatar>
              <img :src="notification.user.mainimage" :alt="notification.user.fullName"
                   width="32px" style="border-radius: 100%">
            </q-item-tile>
          </q-item-side>
          <!--Content Notification-->
          <q-item-main
            :label="notification.user.fullName"
            label-lines="1"
            :sublabel="notification.options.summary ? notification.options.summary : notification.message"
            sublabel-lines="2"
          />
          <!-- Date notification -->
          <q-item-side right>
            <q-item-tile stamp>
              {{$d($moment(notification.date, 'YYYY-MM-DD HH:mm').toDate(), 'short', $q.i18n.lang)}}
              <br>
              {{$d($moment(notification.date, 'YYYY-MM-DD HH:mm').toDate(), 'time', $q.i18n.lang)}}
            </q-item-tile>
          </q-item-side>
        </q-item>
      </q-page-container>

      <q-layout-footer id="footer" class="no-shadow bg-white">
        <q-btn flat color="primary" :to="{name : 'notifications'}">
          show all
        </q-btn>
        <q-btn flat class="float-right"
               :to="{name : 'notifications.create'}"
               color="primary">
          <q-icon class="q-mr-sm" name="fas fa-location-arrow"></q-icon>
          Send
        </q-btn>
      </q-layout-footer>
    </q-layout>
  </div>
</template>
<script>
  import {helper} from '@imagina/qhelper/_plugins/helper';
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
        filter:{
          unread : false
        }
      }
    },
    methods: {}

  }
</script>
<style lang="stylus">
  @import "~variables";
  #notificationList
    //test
</style>
