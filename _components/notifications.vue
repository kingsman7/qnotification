<template>
  <!--Content notifications-->
  <div id="notificationsComponent" class="">
    <!--Top Content-->
    <!--Title-->
    <div class="text-subtitle1 row items-center bg-white q-ma-xs q-mb-sm q-pl-md q-mr-md">
      <q-icon name="fas fa-bell" color="primary" size="23px" class="q-ml-xs q-mr-lg"/>
      <div>{{ $trp('ui.label.notification', {capitalize: true}) }}</div>
    </div>
    <!--line separator-->
    <q-separator class="q-my-sm q-mr-md q-ml-xs"/>
    <!--Items-->
    <q-scroll-area :thumb-style="thumbStyle" v-if="items.length"
                   :style="`height: calc(100vh - ${this.windowSize == 'mobile' ? '135' : '230'}px`">
      <div v-for="item in items" :key="item.id" class="item q-ma-xs q-mb-sm q-mr-md">
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
    </q-scroll-area>
    <!--Actions go notification-->
    <div class="text-center absolute-bottom q-my-md">
      <q-btn unelevated color="green" rounded no-caps :label="$trp('ui.label.notification')" icon="fas fa-bell"
             :to="{name : 'qnotification.main.notifications.index'}">
      </q-btn>
    </div>
  </div>
</template>

<script>
export default {
  beforeDestroy() {
    this.$eventBus.$off(`notification.new${this.$store.quserAuth.userId}`)
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
      date: false,
      recomendations: false,
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '$custom-accent-color',
        width: '5px',
        opacity: 0.1
      },
      windowWith: window.innerWidth,
      showItem: true,
    }
  },
  computed: {
    //size window
    windowSize() {
      return this.windowWith >= '992' ? 'desktop' : 'mobile'
    },
  },
  methods: {
    init() {
      this.getData()
    },

    getData() {
      return new ((resolve, reject) => {
        this.loading = true
        //Request Params
        let requestParams = {
          refresh: true,
          params: {
            take: 10,
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
#notificationsComponent
  padding 16px 0 16px 8px
  height 100%

  .item
    font-size 13px
    border-radius 5px
    padding 9px
    padding-left 7px

    &:hover
      background-color #f7f6f6

    .text-item
      min-height 60px
      line-height 1.2

    .icon-item
      font-size 23px
      width 50px
      height 50px
      background-color #EEEEEE
      position absolute
      left 0
      border-radius 50%
</style>
