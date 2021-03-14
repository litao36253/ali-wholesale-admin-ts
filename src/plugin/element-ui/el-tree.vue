<template>
  <div class="njs-tree">
    <el-input v-if="showSearch" v-model="keyWord" clearable :placeholder="placeholder" @keydown.native.13="$refs.tree.filter(keyWord)" :size="size" class="search-input" >
      <el-button slot='append' icon='el-icon-search' @click="$refs.tree.filter(keyWord)"></el-button>
    </el-input>
    <NativeElTree
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
    >
      <template v-slot="{ node, data }" v-if="$scopedSlots['default'] || label">
        <slot :node="node" :data="data" v-if="$scopedSlots['default']"/>
        <span v-else v-text="computedLabel(data, label)"></span>
      </template>
    </NativeElTree>
  </div>
</template>

<script>
import ElTree from 'element-ui/packages/tree/src/tree'
import { listTransTree } from '@/utils/utils'

export default {
  name: 'el-tree',
  components: {
    NativeElTree: ElTree
  },
  props: {
    service: Function,
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
    parentId: {
      type: String,
      default: 'parentId'
    },
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
        return '输入关键字搜索节点'
      }
    },
    searchField: {
      type: String,
      default: ''
    },
    emptyText: {
      type: String,
      default () {
        return '暂无数据'
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
    iconClass: String,
    size: String
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
        this.loading = true
        this.service({
          ...this.query
        }, {
          pageSize: 500,
          currentPage: 1
        }).then((result) => {
          this.loading = false
          if (result.code) {
            this.resultText = '加载失败'
            this.$emit('load-error', result)
          } else {
            this.resultText = ''
            this.resultData = result.data
          }
        }).catch((err) => {
          this.loading = false
          this.resultText = '加载失败'
          this.$emit('load-error', err)
          console.error(err)
        })
      }
    },
    // 计算出 label 文字
    computedLabel (item, serviceDataLabel) {
      const label = []
      const lables = serviceDataLabel ? serviceDataLabel.split(',') : []
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
          const lables = this.label ? this.label.split(',') : []
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
      return this.$refs.tree.setCurrentNode(node)
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
      } else {
        return listTransTree(this.service ? this.resultData.concat(this.data) : this.data, this.nodeKey, this.parentId, this.props.children)
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

<style lang="scss" scoped>
  .search-input {
    margin-bottom: 8px;
  }
</style>
