<template>
  <div id="pageCreateNotification"
       class="q-layout-page row layout-padding">

    <div class="text_title text-blue-9 col-xs-12 q-title text-right">
      <span>NOTIFICATIONS</span>
    </div>

    <div class="q-py-md q-title col-xs-12 text-negative">
      • CREATE
    </div>

    <div id="formNotification" class="col-12 relative-position">
      <div class="form-title">
        Form Notification
      </div>

      <div class="full-width row q-py-md">
        <!--Platforms-->
        <div class="fields col-12 text-center">
          <span class="q-ma-none text-grey-6 q-subheading">
            <q-icon name="fas fa-sitemap" color="grey-7"></q-icon>
            Platforms*
          </span>

          <q-option-group
            inline class="q-mt-xs"
            type="toggle"
            color="secondary"
            v-model="form.platforms"
            :options="platforms"
          />
        </div>
        <!--Message-->
        <div class="fields col-12 col-md-6 q-mt-md">
          <q-input v-model="form.message"
                   color="white"
                   inverted-light
                   class="no-shadow textarea"
                   rows="4"
                   type="textarea"
                   placeholder="Message*">
          </q-input>
        </div>
        <!--Other Fields-->
        <div class="col-12 col-md-6">
          <!--Summary-->
          <div class="fields col-12 col-md-6">
            <q-input v-model="form.options.summary"
                     :before="[{icon: 'fas fa-comment-alt'}]"
                     float-label="Summary">
            </q-input>
          </div>
          <!--URL-->
          <div class="fields col-12 col-md-6">
            <q-input v-model="form.options.url"
                     :before="[{icon: 'fas fa-globe'}]"
                     float-label="URL">
            </q-input>
          </div>
        </div>

        <!--== Select User to send notification ==-->
        <q-collapsible class="full-width" v-model="filterUsersContent"
                       header-style="display: none">
          <filter-users></filter-users>
        </q-collapsible>

        <!--== Buttons ==-->
        <div class="fields col-12">
          <q-toggle v-model="toAllUsers"
                    @input="filterUsersContent = !filterUsersContent"
                    class="q-py-sm"
                    left-label
                    label="To all users" />

          <q-btn :loading="btnLoading" color="primary"
                 @click="sendNotification()"
                 class="float-right"
                 label="Send" icon="fas fa-location-arrow">
            <span slot="loading">
              Sending...
            </span>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  /*Services*/
  import platformServices from '@imagina/qnotification/_services/platforms'
  import notificationService from '@imagina/qnotification/_services/notifications'

  /*Components*/
  import filterUsers from 'src/components/users/filterUsers'

  export default {
    props: {},
    components: {filterUsers},
    watch: {},
    mounted() {
      this.$nextTick(function () {
        this.getPlatforms()
      })
    },
    data() {
      return {
        form: this.initForm(),
        platforms: [],
        btnLoading: false,
        toAllUsers: false,
        filterUsersContent : true
      }
    },
    methods: {
      //Return init form
      initForm() {
        return {
          platforms: [],
          options: {
            summary: '',
            url: ''
          },
          message: '',
        }
      },
      //Get platforms avaliables
      getPlatforms() {
        platformServices.index().then(response => {
          let data = response.data

          if (data.length) {
            data.forEach(item => {
              this.platforms.push({
                label: item.platform,
                value: item.id
              })
            })
          }
        })
      },
      //Send notification
      sendNotification() {
        this.btnLoading = true
        notificationService.create(this.form).then(response => {
          this.btnLoading = false
          this.form = this.initForm()
        })
      }
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
  #formNotification
    border 1px solid $grey-4
    .fields
      padding 5px 15px
    .q-collapsible-sub-item
      padding 8px 0
</style>
