<template lang="pug">
  .njs-tree
    njs-input(v-model="keyWord" clearable :placeholder="placeholder"  @keydown.native.13="$refs.tree.filter(keyWord)" style="margin-bottom: 12px;" size="medium" v-if="showSearch")
      njs-button(slot='append' icon='el-icon-search' @click="$refs.tree.filter(keyWord)")
    ElTree(
      ref="tree"
      v-loading="loading"
      :data="realData"
      :empty-text="realEmptyText"
      :node-key="nodeKey"
      :props="props"
      :render-after-expand="renderAfterExpand"
      :load="load"
      :render-content="renderContent"
      :highlight-current="highlightCurrent"
      :default-expand-all="defaultExpandAll"
      :expand-on-click-node="expandOnClickNode"
      :check-on-click-node="checkOnClickNode"
      :auto-expand-parent="autoExpandParent"
      :default-expanded-keys="defaultExpandedKeys"
      :show-checkbox="showCheckbox"
      :check-strictly="checkStrictly"
      :default-checked-keys="defaultCheckedKeys"
      :current-node-key="currentNodeKey"
      :filter-node-method="doSearch"
      :accordion="accordion"
      :indent="indent"
      :icon-class="iconClass"
      :lazy="lazy"
      :draggable="draggable"
      :allow-drag="allowDrag"
      :allow-drop="allowDrop"
      @node-click="handleNodeClick"
      @node-contextmenu="handleNodeContextmenu"
      @check="handleCheck"
      @current-change="handleCurrentChange"
      @node-expand="handleNodeExpand"
      @node-collapse="handleNodeCollapse"
      @node-drag-start="handleNodeDragStart"
      @node-drag-enter="handleNodeDragEnter"
      @node-drag-leave="handleNodeDragLeave"
      @node-drag-over="handleNodeDragOver"
      @node-drag-end="handleNodeDragEnd"
      @node-drop="handleNodeDrop"
    )
      template(slot-scope="{ node, data }" v-if="$scopedSlots['default'] || label")
        slot(:node="node" :data="data" v-if="$scopedSlots['default']")
        span(v-else v-html="computedLabel(data, label)")
</template>

<script>
import ElTree from 'element-ui/packages/tree/src/tree'
import { listTransTree } from '@/utils/utils'
export default {
  name: 'njs-tree',
  components: {
    ElTree
  },
  props: {
    service: { // 接口号
      type: String
    },
    query: { // 配置了接口号时，可通过此属性配置一些入参
      type: Object,
      default () {
        return {}
      }
    },
    data: {
      type: Array
    },
    dataType: { // 指定传入 data 的数据结构类型为 list 或 children
      type: String,
      default: 'children'
    },
    nodeKey: { // 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
      type: String,
      required: true
    },
    pid: String,
    label: String, // 指定展示的字段名
    separator: { // 多字段作为label时的分隔符
      type: String,
      default: '-'
    },
    showSearch: { // 是否显示搜索框
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default () {
        return this.$t('输入关键字搜索节点')
      }
    },
    searchField: {
      type: String,
      default: ''
    },
    emptyText: {
      type: String,
      default () {
        return this.$t('暂无数据')
      }
    },
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    checkStrictly: Boolean,
    defaultExpandAll: Boolean,
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    checkOnClickNode: Boolean,
    checkDescendants: {
      type: Boolean,
      default: false
    },
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    defaultCheckedKeys: Array,
    defaultExpandedKeys: Array,
    currentNodeKey: [String, Number],
    renderContent: Function,
    showCheckbox: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    allowDrag: Function,
    allowDrop: Function,
    props: {
      default () {
        return {
          children: 'children',
          label: 'label',
          disabled: 'disabled'
        }
      }
    },
    lazy: {
      type: Boolean,
      default: false
    },
    highlightCurrent: Boolean,
    load: Function,
    filterNodeMethod: Function,
    accordion: Boolean,
    indent: {
      type: Number,
      default: 18
    },
    iconClass: String
  },
  data () {
    return {
      loading: false, // 配置了借口号时，正在请求数据的状态
      resultData: [], // 配置了接口号时，请求得到的数据
      resultText: '', // 配置了接口号时，若请求失败用 resultText 作为 emptyText
      keyWord: '' // 搜索关键字
    }
  },
  created () {
    this.refresh()
  },
  methods: {
    // 配置了接口号时，请求数据
    refresh () {
      if (this.service) {
        let submitBeforeCallback
        let req = [{
          service: this.service,
          ...this.query
        }]
        this.$emit('before-load', JSON.parse(JSON.stringify(req)), (val) => {
          submitBeforeCallback = val
        })
        if (submitBeforeCallback === false) {
          return
        }
        if (submitBeforeCallback !== undefined) {
          req = submitBeforeCallback
        }
        this.loading = true
        this.$ajaxRequest(req).then((result) => {
          if (result.code === '0') {
            this.resultText = ''
            let callbackData
            this.$emit('load-success', JSON.parse(JSON.stringify(result.data)), (val) => {
              callbackData = val
            })
            if (callbackData === undefined || callbackData === false) {
              this.resultData = result.data
            } else {
              this.resultData = callbackData
            }
          } else {
            this.resultText = this.$t('加载失败')
          }
          this.loading = false
        }).catch((err) => {
          this.resultText = this.$t('加载失败')
          this.loading = false
          this.$emit('load-error', err)
          console.error(err)
        })
      }
    },
    // 计算出 label 文字
    computedLabel (item, serviceDataLabel) {
      let label = []
      let lables = serviceDataLabel ? serviceDataLabel.split(',') : []
      lables.forEach((lableItem) => {
        label.push(item[lableItem])
      })
      return label.join(this.separator)
    },
    doSearch (value, data) {
      if (this.filterNodeMethod) {
        return this.filterNodeMethod(value, data)
      } else {
        if (!value) return true
        if (this.searchField) { // 如果传入了 searchField
          return this.searchField.split(',').some((item) => {
            return data[item].indexOf(value) !== -1
          })
        } else { // 如果未传入 searchField ，则直接搜索 label
          let lables = this.label ? this.label.split(',') : []
          return lables.some((item) => {
            return data[item].indexOf(value) !== -1
          })
        }
      }
    },
    filter (filter) {
      this.$refs.tree.filter(filter)
    },
    updateKeyChildren (key, data) {
      this.$refs.tree.updateKeyChildren(key, data)
    },
    getCheckedNodes (leafOnly, includeHalfChecked) {
      return this.$refs.tree.getCheckedNodes(leafOnly, includeHalfChecked)
    },
    setCheckedNodes (nodes) {
      this.$refs.tree.setCheckedNodes(nodes)
    },
    getCheckedKeys (leafOnly) {
      return this.$refs.tree.getCheckedKeys(leafOnly)
    },
    setCheckedKeys (keys, leafOnly) {
      this.$refs.tree.setCheckedKeys(keys, leafOnly)
    },
    setChecked (data, checked, deep) {
      this.$refs.tree.setChecked(data, checked, deep)
    },
    getHalfCheckedNodes () {
      return this.$refs.tree.getHalfCheckedNodes()
    },
    getHalfCheckedKeys () {
      return this.$refs.tree.getHalfCheckedKeys()
    },
    getCurrentKey () {
      return this.$refs.tree.getCurrentKey()
    },
    getCurrentNode () {
      return this.$refs.tree.getCurrentNode()
    },
    setCurrentKey (key) {
      this.$refs.tree.setCurrentKey(key)
    },
    setCurrentNode (node) {
      this.$refs.tree.setCurrentNode(node)
    },
    getNode (data) {
      return this.$refs.tree.getNode(data)
    },
    remove (data) {
      this.$refs.tree.remove(data)
    },
    append (data, parentNode) {
      this.$refs.tree.append(data, parentNode)
    },
    insertBefore (data, refNode) {
      this.$refs.tree.insertBefore(data, refNode)
    },
    insertAfter (data, refNode) {
      this.$refs.tree.insertAfter(data, refNode)
    },
    handleNodeClick (data, Node, node) {
      this.$emit('node-click', data, Node, node)
    },
    handleNodeContextmenu (event, data, Node, node) {
      this.$emit('node-contextmenu', event, data, Node, node)
    },
    handleCheck (data, state) {
      this.$emit('check', data, state)
    },
    handleCurrentChange (data, node) {
      this.$emit('current-change', data, node)
    },
    handleNodeExpand (data, Node, node) {
      this.$emit('node-expand', data, Node, node)
    },
    handleNodeCollapse (data, Node, node) {
      this.$emit('node-collapse', data, Node, node)
    },
    handleNodeDragStart (Node, event) {
      this.$emit('node-drag-start', Node, event)
    },
    handleNodeDragEnter (dragNode, targetNode, event) {
      this.$emit('node-drag-enter', dragNode, targetNode, event)
    },
    handleNodeDragLeave (dragNode, targetNode, event) {
      this.$emit('node-drag-leave', dragNode, targetNode, event)
    },
    handleNodeDragOver (dragNode, targetNode, event) {
      this.$emit('node-drag-over', dragNode, targetNode, event)
    },
    handleNodeDragEnd (dragNode, targetNode, position, event) {
      this.$emit('node-drag-end', dragNode, targetNode, position, event)
    },
    handleNodeDrop (dragNode, targetNode, position, event) {
      this.$emit('node-drop', dragNode, targetNode, position, event)
    }
  },
  computed: {
    // 计算真实的 dataType
    realDataType () {
      if (this.service) { // 配置了接口号则 realDataType 为 list
        return 'list'
      } else {
        return this.dataType
      }
    },
    // realEmptyText
    realEmptyText () {
      if (this.service) {
        if (this.resultText) {
          return this.resultText
        } else {
          return this.emptyText
        }
      } else {
        return this.emptyText
      }
    },
    // 计算真实的树数据
    realData () {
      if (this.realDataType === 'children') {
        return this.data
      } else if (this.realDataType === 'list') {
        if (this.pid) {
          return listTransTree(this.service ? this.resultData : this.data, this.nodeKey, this.pid, this.props.children)
        } else {
          console.error(this.$t('dataType 为 list 或 配置了接口号时，必须指定 pid！'))
          return []
        }
      }
    }
  },
  watch: {
    keyWord (val) {
      if (val === '') {
        this.$refs.tree.filter(val)
      }
    }
  }
}
</script>

<style scoped>

</style>
