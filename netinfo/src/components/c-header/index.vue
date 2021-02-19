<template lang="pug">
.bar-header
  //- 左侧菜单切换开关
  .menu-switch(@click="menuSwitch")
    i.iconfont.icon-menu-collapse(v-if="!isMenuCollapse")
    i.iconfont.icon-menu-uncollapse(v-else)
  //- 状态组件：普通用户的状态组件、话务条状态组件
  .bar-user-status
  //- 用户信息及常用操作区域
  .bar-user-info
    //- 切换角色
    .user-role-change
      njs-dropdown
        .el-dropdown-link.popover-parent
          | {{ $t('切换角色') }}
          i.el-icon-arrow-down.el-icon--right
        njs-dropdown-menu(slot="dropdown")
          njs-dropdown-item {{ $t('超级管理员') }}
          njs-dropdown-item {{ $t('普通坐席') }}
          njs-dropdown-item {{ $t('坐席班长') }}
          njs-dropdown-item(disabled) {{ $t('外呼坐席') }}
          njs-dropdown-item(divided) {{ $t('坐席主管') }}
    //- 切换语言
    .system-language
      njs-dropdown(@command="changeLanguage")
        .el-dropdown-link.popover-parent
          i.iconfont.icon-language
        njs-dropdown-menu(slot="dropdown")
          template(languageConfig.package && v-for="item in languageConfig.package")
            njs-dropdown-item(:command="item", :disabled="language === item") {{languageConfig.alias[item]}}
    //- 推送的提醒或者待办事项
    .system-notify
      njs-popover(
        popper-class='popper-notify'
        placement="top",
        :visible-arrow="false",
        width="350",
        trigger="hover")
        njs-tabs(v-model="activeName", type="border-card")
          njs-tab-pane(:label="$t('通知公告')", name="first")
            ul(class="note-wrap")
              li(v-for="note in notice" class="note-item")
                div(class="note-title")
                  njs-checkbox(v-model="note.selected")
                  a {{note.NOTE_TITLE}}
                div(class="note-time") {{moment(note.ISSUE_TIME).format('MM/DD  h:mm:ss')}}
            div(class="note-footer")
              njs-checkbox(@change="switchChecked()" v-model="checkedAll") {{ $t('全选') }}
              a(@click="setNoteReaded()") {{ $t('设为已读') }}
              a(class="note-more" @click="goNoteDetail()") {{ $t('更多') }}>>
          njs-tab-pane(:label="$t('系统消息')", name="second") {{ $t('系统消息') }}
        .popover-parent(slot="reference")
          njs-badge(:value="notelength")
            i.iconfont.icon-notify-fill
    //- 个人信息及快捷登出常用操作
    .user-info-ellipsis
      njs-popover(
        placement="top",
        trigger="hover")
        .popover-content-user
          .avatar-info
            .img
              img(:src="userBaseInfo.USER_ICON || '~@res/logo.png'")
            .text
              p {{ $store.getters.g_user.USER_NAME }}
              p {{ $store.getters.g_user.ORG_NAME }}
          .item-text
            | {{ $t('员工编号：') }}{{ $store.getters.g_user.USER_CODE }}
          .item-text
            | {{ $t('员工账号：') }}{{ $store.getters.g_user.USER_ACCOUNT }}
          .item-line
          .item-action(@click="editperflieVisible = true")
            i.iconfont.icon-setting-fill
            | {{$t('资料修改')}}
          .item-action(@click="editItemVisible = true")
            i.iconfont.icon-password-fill
            | {{$t('密码修改')}}
          .item-action(@click="logout")
            i.iconfont.icon-signout-fill
            | {{$t('退出登录')}}
        .popover-parent(slot="reference")
          img(:src="userBaseInfo.USER_ICON || '~@res/logo.png'")

  <!---------------    资料修改 弹出框    start  --------------------------------------------------------->
  UpdateInfo(:visible.sync="editperflieVisible")
  <!---------------    资料修改 弹出框    end  --------------------------------------------------------->

  <!---------------    密码修改 弹出框    start  --------------------------------------------------------->
  UpdatePassword(:visible.sync="editItemVisible")
  <!---------------    密码修改 弹出框    end  --------------------------------------------------------->
</template>

<script>
import MxLanguage from '@/mixins/language'
import moment from 'moment'
import { API as configApi } from '@/conf/'
import { mapState } from 'vuex'
import UpdatePassword from './components/c-update-password'
import UpdateInfo from './components/c-update-info'

export default {
  name: 'Header',
  components: {
    UpdatePassword, // 修改密码
    UpdateInfo // 修改资料
  },
  mixins: [MxLanguage],
  props: {
    isMenuCollapse: {
      type: [Boolean, String],
      default: true
    }
  },
  computed: {
    ...mapState({
      userBaseInfo (state) {
        return state.common.userBaseInfo
      }
    })
  },
  data () {
    return {
      notice: [],
      moment: moment,
      checkedAll: false,
      notelength: 0,
      websocket: null,
      activeName: 'first',
      editItemVisible: false,
      editperflieVisible: false
    }
  },
  created () { },
  mounted () {
    this.initWebsocket()
    this.getNewNote()
  },
  methods: {
    initWebsocket () {
      // 获取接口根路径
      const usercode = this.userBaseInfo.USER_CODE
      const isProd = process.env.NODE_ENV === 'production'
      const BASE_PATH = isProd ? configApi.production : configApi.development
      const baseurl = BASE_PATH['UCC']
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss'
      this.websocket = new WebSocket(`${protocol}://${location.host}${baseurl}/njdf_websocket?USER_CODE=${usercode}&SOCKET_TYPE=1`)
      const self = this
      this.websocket.onopen = function () {
        console.log('系统websocket连接成功')
      }
      this.websocket.onmessage = function (event) {
        const { type } = JSON.parse(event.data)
        // 系统公告
        if (type === '2') {
          self.getNewNote(true)
        }
      }
      this.websocket.onclose = function () {
        self.websocket = null
        console.log('websocket连接中断5s后重新连接')
        setTimeout(() => {
          self.initWebsocket()
        }, 5000)
      }
    },
    getNewNote (isRecive) {
      this.$ajaxRequest([
        {
          USER_CODE: this.userBaseInfo.USER_CODE,
          service: 'P0113405',
          page: 1,
          IS_READ: 0,
          pagecount: 20
        }
      ]).then((note) => {
        const { data } = note
        this.notice = data.slice(0, 4)
        this.notelength = data.length
        data.length > 0 && isRecive && this.$notify({
          title: data[0]['NOTE_TITLE'],
          message: data[0]['NOTE_CONT']
        })
      })
    },
    setNoteReaded () {
      let noteids = []
      this.notice.map((item) => {
        item.selected && noteids.push(item.NOTE_ID)
      })
      if (!noteids.length) {
        return
      }
      noteids = noteids.join(',')
      this.$ajaxRequest([
        {
          NOTEIDS: noteids,
          USER_CODE: this.userBaseInfo.USER_CODE,
          service: 'P0113306'
        }
      ]).then(() => {
        this.checkedAll = false
        this.getNewNote()
      })
    },
    goNoteDetail () {
      this.$router.push({ name: 'system.notice' })
    },
    switchChecked () {
      if (this.checkedAll) {
        this.notice.map((item) => {
          item.selected = true
        })
      } else {
        this.notice.map((item) => {
          item.selected = false
        })
      }
    },
    menuSwitch () {
      this.$emit('switch-menu', this.isMenuCollapse)
    },
    // 退出登录
    logout () {
      this.$confirm(this.$t('你确定要退出登录吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.exit()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('已取消退出')
        })
      })
    },
    exit () {
      this.$request({
        apiType: 'UCC',
        url: '/njdf_logout'
      }).then((result) => {
        if (result.code === '0') {
          this.$router.replace({
            name: 'login',
            query: {
              redirect: window.app.$route.fullPath
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus">
@import './index.styl'
</style>
