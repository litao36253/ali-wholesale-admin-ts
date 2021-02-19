import Vue from 'vue'
import { Tabs } from 'element-ui'

Tabs.name = 'njsTabs'

// 重写 tabs 组件的 calcPaneInstances 方法
Tabs.methods.calcPaneInstances = function (isForceUpdate = false) {
  if (this.$slots.default) {
    const paneSlots = this.$slots.default.filter(vnode => vnode.tag &&
      vnode.componentOptions && vnode.componentOptions.Ctor.options.name === 'njsTabPane')
    // update indeed
    const panes = paneSlots.map(({ componentInstance }) => componentInstance)
    const panesChanged = !(panes.length === this.panes.length && panes.every((pane, index) => pane === this.panes[index]))
    if (isForceUpdate || panesChanged) {
      this.panes = panes
    }
  } else if (this.panes.length !== 0) {
    this.panes = []
  }
}

Vue.use(Tabs)
