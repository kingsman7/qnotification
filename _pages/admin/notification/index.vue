<template>
  <!--Content notifications-->
  <div id="notificationsPage" class="q-container">
    <!--Top Content-->
    <!--Title-->
    <div class="text-subtitle1 row item items-center bg-white q-pa-md q-mb-sm">
      <div class="relative-position">
        <div class="row items-center q-pl-sm">
          <q-icon name="fas fa-bell" color="primary" size="20px" class="icon-item bg-white"/>
          <div class="q-pl-xl">{{ $trp('ui.label.notification', {capitalize: true}) }}</div>
        </div>
      </div>
    </div>
    <!--line separator-->
    <q-separator class="q-my-sm"/>
    <!--Items-->
    <div v-for="item in items" :key="item.id" class="item q-pa-md q-mb-sm">
      <!--Content item-->
      <div class="relative-position q-pl-xl">
        <div class="row items-center q-pl-md">
          <q-icon color="green" class="icon-item" name="fas fa-bell"/>
          <div class="text-item row items-center">
            <!--Title-->
            <div class="ellipsis-3-lines q-pr-xs text-grey-8">
              <b>{{ item.title }} </b>
              <!--Description-->
              {{ item.description }}
              <q-tooltip>{{ item.title }}</q-tooltip>
            </div>
            <!--Date-->
            <div class="col-12 text-grey-6 text-caption">
              {{ $date.getHumanCalendar(item.createdAt) }}
            </div>
          </div>
        </div>
        <!--Button action-->
        <div v-if="items.actions" v-for="(actions, actionskey) in items.actions" class="row q-mt-sm justify-end">
          <q-btn size="11px" text-color="black" rounded unelevated :label="`${actions.label}`"
                 :class="`q-px-xs text-grey-8 bg-${actions.color}`" :to="`${actions.toVueRoute.name}`"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  beforeDestroy() {
    this.$root.$off('page.data.refresh')
    this.$eventBus.$off(`notification.new.${this.$store.state.quserAuth.userId}`)
  },
  props: {},
  components: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      loading: false,
      items: false,
      recomendations: false,
      //Style Scroll
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '$custom-accent-color',
        width: '5px',
        opacity: 0.1
      },
      showItem: true,
    }
  },
  computed: {},
  methods: {
    init() {
      this.listenEvents()
      this.getData()
    },
    //Listen pusher message
    listenEvents() {
      //Refresh page
      this.$root.$on('page.data.refresh', () => {
        this.getData(true)
      })
      //Appintment completed
      /*this.$eventBus.$on('iappointment.appoinment.was.changed', (response) => {
        console.warn('Pusher', response)
        this.getData(true)
      })*/
    },
    // Get data
    getData() {
      return new ((resolve, reject) => {
        this.loading = true
        //Request Params
        let requestParams = {
          refresh: true,
          params: {
            filter: {
              me: true,
              type: 'broadcast'
            }
          }
        }
        //get notifications
        this.$crud.index('apiRoutes.qnotification.notifications', requestParams).then(response => {
          this.loading = false
          this.items = response.data
          resolve(response.data)
        }).catch(error => this.loading = false)
      })
    },
  }
}
</script>
<style lang="stylus">
#notificationsPage
  padding 16px 10px
  height 100%

  .item
    border-radius 5px
    background-color white

    &:hover
      background-color #f7f6f6

    .icon-item
      font-size 23px
      width 50px
      height 50px
      background-color #eaeaea73
      position absolute
      left 0
      border-radius 50%
</style>
