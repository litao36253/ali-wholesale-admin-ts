<template lang="pug">
.bar-bom-history
  .ul-wrap#historyWrap
    ul(v-if="bomHistory.length > 0", :style="{ left: historyContentLeft + 'px' }")
      template(v-for="(item, index) in bomHistory")
        li(:class="{active: currentRouter.name === item.name, disabled: item.meta.eventDeleteDisabled}", :id="'HistoryItem-' + index", @click="handleGoPage(index, item.fullPath)")
          | {{ $i18n.t('router')[item.meta.title] }}
          div.close(v-if="!item.meta.eventDeleteDisabled" @click.stop="handleRemove(currentRouter.name === item.name, index)")
            i.el-icon-close
  .actions
    njs-dropdown(@command="handleActionDropdown")
        i.el-icon-more
        njs-dropdown-menu(slot="dropdown")
          njs-dropdown-item(command="clearAll") {{$t('清除全部')}}
</template>

<script>
import { mapState } from 'vuex'
import * as TYPES from '@/stores/common/types'

export default {
  name: 'PageHistory',
  computed: {
    ...mapState({
      bomHistory: state => state.common.bomHistory,
      bomHistoryActiveIndex: state => state.common.bomHistoryActiveIndex,
      currentRouter: state => state.route
    })
  },
  data () {
    return {
      historyWrapWidth: 930, // 历史标签外围容器宽度（固定）
      historyContentWidth: 79, // 历史标签容器宽度（随内容变化）
      historyContentLeft: 0 // 当前区域
    }
  },
  watch: {
    // 监听当前标签数组索引
    bomHistoryActiveIndex (val, oldVal) {
      this.$nextTick(() => {
        this.resizeLeft(val)
      })
    }
  },
  created () { },
  mounted () {
    let vm = this
    // dom渲染完毕
    vm.$nextTick(() => {
      vm.getElementWidth()
    })
    // 浏览器窗口变化
    window.onresize = () => {
      vm.getElementWidth()
    }
  },
  methods: {
    // 跳转不添加到历史记录中去
    handleGoPage (_key, _path) {
      this.$router.replace(_path)
    },
    // 移除标签
    handleRemove (_isCurrent, _index) {
      this.$store.commit(TYPES.M_BOM_HISTORY_DELETE, {
        isCurrent: _isCurrent,
        index: _index,
        callback: (_fullPath) => {
          this.$router.replace(_fullPath)
        }
      })
    },
    // 清空所有
    handleClearAll () {
      this.$store.commit(TYPES.M_BOM_HISTORY_DELETE, {
        callback: (_fullPath) => {
          this.$router.replace(_fullPath)
        }
      })
    },
    // 获取相关元素信息
    getElementWidth () {
      this.historyWrapWidth = document.querySelector('#historyWrap').offsetWidth
      this.historyContentWidth = document.querySelector('#historyWrap ul').offsetWidth
    },
    resizeLeft (val) {
      let vm = this
      let _left = 0
      vm.$nextTick(() => {
        vm.getElementWidth()
        const _thisOffsetLeft = document.querySelector('#HistoryItem-' + val).offsetLeft
        const _thisWidth = document.querySelector('#HistoryItem-' + val).clientWidth + 200
        if (vm.historyWrapWidth > vm.historyContentWidth || (_thisOffsetLeft + _thisWidth) <= vm.historyWrapWidth) {
          _left = 0
        } else if ((_thisOffsetLeft + _thisWidth) > vm.historyWrapWidth && vm.historyWrapWidth < vm.historyContentWidth) {
          _left = vm.historyWrapWidth - vm.historyContentWidth
        }
        vm.historyContentLeft = _left
      })
    },
    handleActionDropdown (command) {
      switch (command) {
        case 'clearAll':
          this.handleClearAll()
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="stylus">
@import './index.styl'
</style>
