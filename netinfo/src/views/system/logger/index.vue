<template lang="pug">
  .logger-container-wrap.home-wrap
    .box-menu
      .menu-title {{ $t('服务器列表') }}
      .menu-con
        njs-menu()
          njs-menu-item()
    njs-tabs.box-body()
      njs-tab-pane(:label="$t('服务器日志')")
        njs-datagrid(
          datagrid-id="server_logs_P0110402"
          ref="serverLogs"
          service="P0110402"
          hide-head
          height="100%"
          :pagination="false"
        )
          njs-column(prop="logName" :label="$t('日志名称')" show-overflow-tooltip sortable min-width="160")
          njs-column(prop="logSize" :label="$t('日志大小')" show-overflow-tooltip sortable min-width="160")
          njs-column(prop="createDate" :label="$t('创建日期')" show-overflow-tooltip sortable min-width="160")
          njs-column(:label="$t('操作')" min-width="150" fixed="right")
            template(slot-scope="{row, column}")
              njs-button(type="text" @click.stop="download(row)") {{ $t('下载') }}
      njs-tab-pane(:label="$t('项目日志')")
        njs-datagrid(
          datagrid-id="project_log_P0110403"
          ref="projectLog"
          service="P0110403"
          hide-head
          height="100%"
          :pagination="false"
        )
          njs-column(prop="logName" :label="$t('日志名称')" show-overflow-tooltip sortable min-width="160")
          njs-column(prop="logSize" :label="$t('日志大小')" show-overflow-tooltip sortable min-width="160")
          njs-column(prop="createDate" :label="$t('创建日期')" show-overflow-tooltip sortable min-width="160")
          njs-column(:label="$t('操作')" min-width="150" fixed="right")
            template(slot-scope="{row, column}")
              njs-button(type="text" @click.stop="download(row)") {{ $t('下载') }}
</template>

<script>
export default {
  name: 'system.logger', // 页面级别组件一定要用路由名称命名！！！
  data () {
    return {
      serviceList: []// 服务器列表
    }
  },
  methods: {
    download (row) {

    }
  },
  created () {

  }
}
</script>

<style lang="stylus">
  @import "index.styl"
</style>
