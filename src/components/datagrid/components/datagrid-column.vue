<template>
  <el-table-column v-if="showColum" :type="type" :prop="prop" :index="index" :column-key="columnKey" :width="width" :min-width="minWidth" :fixed="fixed" :render-header="renderHeader" :sortable="sortable" :sort-method="sortMethod" :sort-by="sortBy" :sort-orders="sortOrders" :resizable="resizable" :formatter="realFormatter" :show-overflow-tooltip="showOverflowTooltip" :align="align" :header-align="headerAlign" :class-name="className" :label-class-name="labelClassName" :selectable="selectable" :reserve-selection="reserveSelection" :filters="filters" :filter-placement="filterPlacement" :filter-multiple="filterMultiple" :filter-method="filterMethod" :filtered-value="filteredValue">
    <template v-slot="{ row, column, $index }">
      <template v-if="type==='state'">
        <el-tag :type="stateMap[row[prop]]" size="medium">{{realFormatter(row,column,row[prop],$index)}}</el-tag>
      </template>
      <template v-else-if="type==='stateColor'">
        <el-tag :color="row[prop]" size="medium" v-if="row[prop]">{{realFormatter(row,column,row[prop],$index)}}</el-tag>
      </template>
      <slot v-else-if="$scopedSlots['default']" :row="row" :column="column" :$index="$index"></slot>
      <template v-else>{{ realFormatter(row,column,row[prop],$index) }}</template>
    </template>
    <template v-slot:header="{ column, $index }">
      <slot v-if="$scopedSlots['header']" name="header" :column="column" :$index="$index"></slot>
      <template v-else>{{ label }}</template>
    </template>
  </el-table-column>
</template>

<script>
// import { mapGetters } from 'vuex'
export default {
  name: 'datagrid-column',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    label: String,
    className: String,
    labelClassName: String,
    property: String,
    prop: String,
    width: {},
    minWidth: {},
    renderHeader: Function,
    sortable: {
      type: [String, Boolean],
      default: false
    },
    sortMethod: Function,
    sortBy: [String, Function, Array],
    resizable: {
      type: Boolean,
      default: true
    },
    context: {},
    columnKey: String,
    align: String,
    headerAlign: String,
    showTooltipWhenOverflow: Boolean,
    showOverflowTooltip: Boolean,
    fixed: [Boolean, String],
    formatter: Function,
    selectable: Function,
    reserveSelection: Boolean,
    filterMethod: Function,
    filteredValue: Array,
    filters: Array,
    filterPlacement: String,
    filterMultiple: {
      type: Boolean,
      default: true
    },
    index: [Number, Function],
    sortOrders: {
      type: Array,
      default () {
        return ['ascending', 'descending', null]
      },
      validator (val) {
        return val.every(order => ['ascending', 'descending', null].indexOf(order) > -1)
      }
    },
    stateMap: { // 若type的值为state则需要指定几种状态对应的值。系统中目前提供了五种状态。
      type: Object,
      default () {
        return {}
      }
    },
    dict: String, // ucc中的数据字典
    hide: { // 初始状态是否隐藏该列
      type: Boolean,
      default: false
    }
  },
  methods: {
    realFormatter (row, column, cellValue, index) {
      if (this.formatter) {
        if (this.dict) {
          return this.formatter(row, column, this.getDict(this.dict, cellValue), index)
        } else {
          return this.formatter(row, column, cellValue, index)
        }
      } else {
        if (this.dict) {
          let dicts
          if (cellValue) {
            dicts = cellValue.split(',')
          } else {
            dicts = ['']
          }
          let val = ''
          dicts.forEach((item, index) => {
            if (index === 0) {
              val += this.getDict(this.dict, item)
            } else {
              val += ',' + this.getDict(this.dict, item)
            }
          })
          return val
        } else {
          return cellValue
        }
      }
    },
    // 获取数据字典
    getDict () {
      return ''
    }
  },
  computed: {
    showColum () { // 计算此列是否显示
      if (this.prop) {
        return this.$parent.$parent.showColumns.some((item) => {
          return item === this.prop
        })
      } else {
        return true
      }
    }
  }
}
</script>

<style scoped>
</style>
