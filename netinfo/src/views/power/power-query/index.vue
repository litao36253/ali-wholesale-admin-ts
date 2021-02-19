<template lang="pug">
  .container-wrap-aside
    .box-body
      .menu
        .menu-title {{ $t('功能权限') }}
        .menu-con
          njs-tree(:data='data' node-key='POWER_ID' ref="tree" default-expand-all :expand-on-click-node='false' check-on-click-node highlight-current @current-change="handleCurrentChange" show-search search-field="POWER_NAME" :placeholder="$t('输入权限名称搜索权限')")
            span.custom-tree-node(slot-scope='{ node, data }' v-if="data.showState === 'show'")
              span {{ data.POWER_NAME }}
      njs-datagrid(
        datagrid-id="employee_power-query_P0502401"
        ref="datagrid"
        :title="$t('功能授权查询')"
        :subheading="$t('查询左侧选中功能权限的授权情况。')"
        service="P0502401"
        single-select
        @before-load="handleBeforeLoad"
        :class="['main-datagrid']"
      )
        <!-----------     列配置  start ---------------------------------------------------------- -->
        njs-column(prop="USER_CODE" :label="$t('员工编号')" sortable min-width="80")
        njs-column(prop="USER_ACCOUNT" :label="$t('员工账号')" min-width="120")
        njs-column(prop="USER_NAME" :label="$t('员工名称')" show-overflow-tooltip min-width="100")
        njs-column(prop="ROLE_NAME_STR" :label="$t('员工角色')" min-width="100")
        njs-column(prop="ORG_NAME" :label="$t('机构名称')" min-width="100")
        njs-column(prop="OBJ_TYPE" :label="$t('权限来源')" min-width="100" :formatter="getDictName")
        <!-----------     列配置  end ---------------------------------------------------------- -->

        <!-----------     常用查询条件  start ---------------------------------------------------------- -->
        template(slot="more-used-query" slot-scope="{ formData }")
          njs-form-item(prop="USER_CODE")
            njs-input(v-model="formData.USER_CODE" :placeholder="$t('请选择员工标识')" clearable @keydown.13.native="$refs.datagrid.refresh()" @change="$refs.datagrid.refresh()")
          njs-form-item(prop="ROLE_CODE")
            njs-combobox(v-model="formData.ROLE_CODE" :placeholder="$t('请选择角色名称')"  service="P0403404" service-data-value="ROLE_CODE" service-data-label="ROLE_NAME" clearable @keydown.native.13="$refs.datagrid.refresh()" @change="$refs.datagrid.refresh()")
          njs-form-item(prop="ORG_NAME")
            njs-combobox(v-model="formData.ORG_ID" :placeholder="$t('请选择组织机构')"  service="P0401404" service-data-value="ORG_ID" service-data-label="ORG_NAME" clearable @keydown.native.13="$refs.datagrid.refresh()" @change="$refs.datagrid.refresh()")
          njs-form-item
            njs-button(@click="$refs.datagrid.refresh()" type="primary") {{$t('查询')}}
        <!-----------     常用查询条件  start ---------------------------------------------------------- -->

</template>

<script>
import { listTransTree } from '@/utils/utils'
const search = (tree, target) => {
  if (tree.POWER_ID === target) {
    return tree
  }
  for (const children of tree.children) {
    const res = search(children, target)
    if (res) {
      return res
    }
  }
}
export default {
  name: 'power.power-query', // 页面级别组件一定要用路由名称命名！！！
  data () {
    return {
      data: [{
        POWER_ID: '0',
        POWER_NAME: this.$t('所有权限'),
        showState: 'show',
        children: []
      }],
      addEdit: 'edit', // 新增修改标识
      addEditRules: { // 新增修改表单校验规则
        POWER_NAME: [
          { required: true, message: this.$t('名称最大长度不能超过64'), trigger: ['blur', 'change'] },
          { max: 64, message: ' ', trigger: 'change' }
        ],
        editName: [
          { required: true, message: ' ', trigger: ['blur', 'change'] },
          { max: 64, message: ' ', trigger: 'change' }
        ],
        REMARK: { max: 500, message: this.$t('备注最大长度不能超过500'), trigger: 'change' }
      },
      currentNodeData: {}, // 当前选中节点的数据
      powerId: ''
    }
  },

  methods: {
    // 当前选中节点发生变化时
    handleCurrentChange (data, isEdit) {
      if (data.POWER_ID === this.currentNodeData.POWER_ID && isEdit !== true) {
        return
      }
      this.powerId = data.POWER_ID
      this.$refs.datagrid.refresh()
    },
    // 查询前传入业务分组编号
    handleBeforeLoad (req, callback) {
      req[0].POWER_ID = this.powerId
      callback(req)
    },
    getDictName (row) {
      var dictDictArr = row.OBJ_TYPE.split(',')
      var dictDictStr = ''
      for (var i = 0; i < dictDictArr.length; i++) {
        dictDictStr += this.$store.getters.getDict('POWER_OBJ_TYPE', dictDictArr[i])
        if (i < dictDictArr.length - 1) {
          dictDictStr += ','
        }
      }
      return dictDictStr
    }
  },
  created () {
    this.$ajaxRequest([{
      service: 'P0501404'
    }]).then((result) => {
      if (result.code === '0') {
        result.data.forEach((item) => {
          item.showState = 'show' // 规定该节点的展示状态。 show：展示， add：新增，edit：修改
          item.editName = item.POWER_NAME // 编辑状态下的菜单名称
        })
        this.$set(this.data[0], 'children', listTransTree(result.data, 'POWER_ID', 'PAR_POWER'))
      }
    })
  },
  computed: {
    formTitle () {
      if (this.currentNodeData.POWER_ID) {
        if (this.currentNodeData.POWER_ID === '0') {
          return "<span style='color: #ff4949'>" + this.$t('根权限不可编辑') + '</span>'
        }
        return this.currentNodeData.editName || ("<span style='color: #ff4949'>"+ this.$t('未输入权限名称') + '</span>')
      } else {
        return "<span style='color: #ff4949'>" + this.$t('未选中权限') + '</span>'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "index.styl"
</style>
