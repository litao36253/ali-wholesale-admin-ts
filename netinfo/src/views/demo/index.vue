<template lang="pug">
.container-wrap
  .demo-box
    .title
      h1.f-info {{$t('demo.checkboxDemo')}}
    .content.f-clearfix
      njs-tree(service="P0104404" node-key="MENU_ID" pid="PAR_MENU" show-search label="MENU_ID,MENU_NAME")
  .demo-box
    <!--.title-->
      <!--h1.f-info {{$t('demo.datagridDemo1')}}-->
    .content.f-clearfix(style="padding: 0;")
      datagridDemo1
  .demo-box
    .title
      h1.f-info {{$t('demo.directives')}}
    .content
      h2 距离明天此时还有：
      span.countdown(v-countdown='overTime', formatter='HH小时mm分ss秒')
  .demo-box
    .title
      h1.f-info {{$t('demo.filters')}}
    .content
      p 当前日期：
        | {{formatTime}}
      p 格式化后：
        | {{formatTime, 'YYYY-MM-DD HH:mm' | dateFilter}}
  .demo-box
    .title
      <!-- 注释 及 -->
      h1.f-info {{$t('demo.utils')}}
    .content
      p 转换数据格式等工具类组件
  .demo-box
    .title
      h1.f-info {{$t('demo.http')}}
    .content
      njs-button.demo(type="success", @click="httpGet") 请求
      njs-button.demo(type="success", @click="httpGetMulti") 多接口请求
      p.address
        template(v-if='user') {{user.userName}}
        template(v-else) 未获取
      pre 详细用法请参考工程目录下README.md
  .demo-box
    .title
      h1.f-info {{$t('demo.componentsEvent')}}
    .content.f-clearfix
      njs-button.demo(type="info", @click="handelChangeComponent") 改变组件标题
      njs-button.demo(type="success", @click="handelComponent") 调用子组件事件
      DemoComponent(
        :title="component.title",
        :list="component.list",
        :status.sync="component.status",
        @handelParent="handelParent",
        ref='child')
  .demo-box
    .title
      h1.f-info {{$t('demo.componentsVuex')}}
    .content.f-clearfix
      njs-button.demo(type="info", @click="handelCommit") commit
      njs-button.demo(type="success", @click="handelAction") action
  .demo-box
    .title
      h1.f-info {{$t('demo.radioDemo')}}
    .content.f-clearfix
      radioDemo
  .demo-box
    .title
      h1.f-info {{$t('demo.checkboxDemo')}}
    .content.f-clearfix
      checkboxDemo
  .demo-box
    .title
      h1.f-info {{$t('demo.checkboxDemo')}}
    .content.f-clearfix
      comboboxDemo
  .demo-box
    .title
      h1.f-info {{$t('demo.checkboxDemo')}}
    .content.f-clearfix
      autoDemo
</template>

<script>
// 引入依赖
import moment from 'moment'
import storage from '@/commons/storage'
import { mapState } from 'vuex'
import * as TYPES from '../../stores/demo/types'
// import radioDemo from './components/c-form-demo/radio'
import checkboxDemo from './components/c-form-demo/checkbox'
import formDemo from './components/c-form-demo/form'
import comboboxDemo from './components/c-form-demo/combobox'
import autoDemo from './components/c-form-demo/auto-complete'
// import datagridDemo1 from './components/c-datagrid-demo/datagrid-demo1'
// 业务引用类
import http from './utils/http'

// 引入组件
import DemoComponent from './components/component/'

export default {
  data () {
    return {
      parent: '我是父组件的内容',
      overTime: moment('2018-09-10').diff('2018-09-09'),
      formatTime: moment(),
      component: {
        title: '我是一个组件',
        list: [1, 2, 3, 4],
        status: true
      }
    }
  },
  computed: mapState({
    user: state => state.demo.userBaseInfo,
    demoAddress: state => state.demo.address
  }),
  created () {
    // 调用ucc接口
    this.$ajaxRequest([{
      page: 1,
      pagecount: 10,
      pageoffset: 1,
      rows: 10,
      service: 'U0101400'
    }]).then((result) => {
      console.log(result)
    })
    // console.log(this.$i18n.t('demo'))
  },
  methods: {
    // 单接口请求
    async httpGet () {
      const result = await http.get()
      console.success(result)
    },
    // 单接口请求
    async httpGetMulti () {
      const result = await http.getMulti()
      console.success(result)
    },
    // 本地存储 - 设置
    changeLang (_lang) {
      storage.lang = _lang
      this.$i18n.locale = _lang
    },
    // 本地存储 - 获取
    clearLang () {
      storage.lang = null
      this.$message('本地存储lang已清除')
    },
    // 更改组件数据
    handelChangeComponent () {
      this.component.title = '更改后的组件'
    },
    // 调用子组件事件
    handelComponent () {
      this.$refs['child'].handelByParent('父主动调子！')
    },
    // 被子组件调用的事件
    handelParent (_data) {
      this.$message.warning(`${_data}`)
    },
    // vuex - commit
    handelCommit () {
      this.$store.commit(TYPES.M_DEMO_GET_ADDRESS, { address: '深圳市' })
    },
    // vuex - action
    handelAction () {
      this.$store.dispatch(TYPES.A_DEMO_GET_ADDRESS, {}).then((res) => {
        console.log(res)
      })
    }
  },
  components: {
    DemoComponent,
    // radioDemo,
    checkboxDemo,
    formDemo,
    comboboxDemo,
    autoDemo
  }
}
</script>

<style scoped lang="stylus">
@import './index.styl'
</style>
