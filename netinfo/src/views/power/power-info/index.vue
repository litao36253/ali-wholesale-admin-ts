<template lang="pug">
  .container-wrap-aside
    .box-body
      .menu
        .menu-title {{ $t('权限信息管理') }}
        .menu-con
          njs-tree(:data='data' node-key='POWER_ID' ref="tree" default-expand-all :expand-on-click-node='false' check-on-click-node highlight-current @current-change="handleCurrentChange" show-search search-field="POWER_NAME" :placeholder="$t('输入权限名称搜索权限')")
            span.custom-tree-node(slot-scope='{ node, data }' v-if="data.showState === 'show'" @mouseenter="mouseIn = data.POWER_ID" @mouseleave="mouseIn = ''")
              span {{ data.POWER_NAME }}
              span(v-show="mouseIn === data.POWER_ID")
                njs-button(type='text', icon='el-icon-plus', @click.stop='append(node, data)')
                njs-button(type='text', icon="el-icon-edit" :disabled="data.MAINTAIN_FLAG === '2' || data.MAINTAIN_FLAG === '3'" @click="data.showState = 'edit'" v-if="data.POWER_ID !== '0'")
                njs-button(type='text', icon="el-icon-delete" :disabled="data.MAINTAIN_FLAG === '1' || data.MAINTAIN_FLAG === '3'" @click='delNode(node, data)' v-if="data.POWER_ID !== '0'")
            span.custom-tree-node(slot-scope='{ node, data }' v-else)
              njs-form(:model="data" :ref="`form${data.POWER_ID}`" :rules="addEditRules" :style="{flex:1, marginRight: '4px'}" size="mini" @submit.native.prevent @click.stop)
                njs-form-item(prop="editName" :style="{marginBottom: '0'}")
                  njs-input(v-model="data.editName" :ref="`input${data.POWER_ID}`" @keydown.native.13="doEdit(node, data)")
              njs-button(type="text" icon="el-icon-check" @click="doEdit(node, data)")
              njs-button(type="text" icon="el-icon-close" @click="cancelEdit(node, data)")
      .form-wrap
        .form-title(v-html="formTitle")
        .form
          njs-form(:model="formData" ref="addEditForm" :service="currentNodeData.showState==='add' ? 'P0501101' : 'P0501302'" :rules="addEditRules" @before-submit="handleSubmitHandle" @submit-success="handleSuccessHandle" size="default" v-if="formShow" :disabled="!currentNodeData.POWER_ID || currentNodeData.POWER_ID === '0' || currentNodeData.MAINTAIN_FLAG === '2' || currentNodeData.MAINTAIN_FLAG === '3'")
            njs-form-item(prop="POWER_STAT" :label="$t('权限状态')" :disabled="true")
              njs-switch(v-model="formData.POWER_STAT" active-color="#13ce66" active-value="1" inactive-value="0" inactive-color="#ff4949" :active-text="$t('启用')" inactive-text="禁用" :disabled="true")
            njs-form-item(prop="POWER_TYPE" :label="$t('权限类型')" )
              njs-combobox(v-model="formData.POWER_TYPE" dict="POWER_TYPE" clearable :disabled="currentNodeData.showState !== 'add'")
            njs-form-item(prop="MAINTAIN_FLAG" :label="$t('维护标识')")
              njs-radio-group(v-model="formData.MAINTAIN_FLAG" dict="MAINTAIN_FLAG" :disabled="currentNodeData.showState !== 'add'")
            njs-form-item(prop="REMARK" :label="$t('备注')")
              njs-input(v-model="formData.REMARK" type="textarea")

</template>

<script>
import { listTransTree } from '@/utils/utils'
const search = (tree, target) => {
  if (tree.POWER_ID === target) {
    return tree
  }
  for (const children of tree.children || []) {
    const res = search(children, target)
    if (res) {
      return res
    }
  }
}
export default {
  name: 'power.power-info', // 页面级别组件一定要用路由名称命名！！！
  data () {
    return {
      data: [{
        POWER_ID: '0',
        POWER_NAME: this.$t('所有权限'),
        showState: 'show',
        POWER_STAT: '1',
        MAINTAIN_FLAG: '3',
        children: []
      }],
      formData: { // 新增修改表单数据
        POWER_NAME: '',
        PAR_POWER: '',
        POWER_TYPE: '',
        POWER_STAT: '1',
        MAINTAIN_FLAG: '0'
      },
      formShow: true, // 用于重新渲染表单
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
      mouseIn: '' // 记录当前鼠标指针在哪个几点里
    }
  },

  methods: {
    append (node, data) {
      console.log('node', node)
      console.log('data', data)
      const newChild = {
        POWER_ID: 'timeStamp' + new Date().getTime(),
        POWER_NAME: '',
        editName: '',
        showState: 'add',
        POWER_TYPE: '',
        POWER_STAT: '1',
        PAR_POWER: data.POWER_ID,
        MAINTAIN_FLAG: '0',
        children: []
      }
      if (data.children) {
        data.children.push(newChild)
      } else {
        this.$set(data, 'children', [newChild])
      }
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(newChild.POWER_ID)
        this.handleCurrentChange(newChild)
        this.$refs[`input${newChild.POWER_ID}`].focus()
      })
    },
    // 删除前端节点（没调接口）
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.POWER_ID === data.POWER_ID)
      children.splice(index, 1)
    },
    // 取消编辑
    cancelEdit (node, data) {
      if (data.showState === 'edit') {
        data.editName = data.POWER_NAME // 编辑状态下的菜单名称恢复
        data.showState = 'show'
      } else if (data.showState === 'add') {
        this.$confirm(this.$t('你确定要放弃本次新增吗？'), this.$t('提示'), {
          type: 'warning'
        }).then(() => {
          this.remove(node, data)
          this.currentNodeData = {}
          this.formShow = false
          this.$nextTick(() => {
            this.formShow = true
          })
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    // 确定修改名称
    doEdit (node, data) {
      if (data.showState === 'add') { // 新增
        this.$refs.addEditForm.validate((result) => {
          if (result) {
            this.$refs.addEditForm.submit()
          } else {
            this.$message.error(this.$t('请先完善权限信息'))
          }
        })
      } else {
        this.$ajaxRequest([{
          service: 'P0501302',
          POWER_ID: data.POWER_ID,
          POWER_NAME: data.editName,
          MAINTAIN_FLAG: data.MAINTAIN_FLAG,
          POWER_STAT: data.POWER_STAT,
          PAR_POWER: data.PAR_POWER,
          REMARK: data.REMARK
        }]).then((reult) => {
          if (reult.code === '0') {
            data.showState = 'show'
            data.POWER_NAME = data.editName
            // let addNodeData = search(this.data[0], data.MENU_ID)
            // this.currentNodeData = { ...this.currentNodeData, ...this.formData }
            // for (let attr in this.currentNodeData) {
            //   this.$set(addNodeData, attr, this.currentNodeData[attr])
            // }
            this.$message({
              type: 'success',
              message: this.$t('修改权限名称成功')
            })
          }
        })
      }
    },
    // 表单提交之前事件
    handleSubmitHandle (req, back) {
      if (this.currentNodeData.showState === 'add') { // 新增
        this.$refs[`form${this.currentNodeData.POWER_ID}`].validate((result) => {
          if (result) {
            this.formData.POWER_NAME = this.currentNodeData.editName
            req[0].POWER_NAME = this.currentNodeData.editName
            back(req)
          } else {
            if (this.currentNodeData.editName) {
              this.$message.error(this.$t('权限名称长度不能超过 64！'))
            } else {
              this.$message.error(this.$t('请输入权限名称！'))
            }
            back(false)
          }
        })
      } else { // 修改
        this.formData.POWER_NAME = this.currentNodeData.POWER_NAME
        req[0].POWER_NAME = this.currentNodeData.POWER_NAME
        req[0].POWER_ID = this.currentNodeData.POWER_ID
        back(req)
      }
    },
    // 表单提交成功
    handleSuccessHandle (result) {
      let message
      if (this.currentNodeData.showState === 'add') {
        message = this.$t('新增权限成功')
        this.currentNodeData.showState = 'show'
        let addNodeData = search(this.data[0], this.currentNodeData.POWER_ID)
        this.currentNodeData.POWER_ID = result.data[0].POWER_ID // 新增得到的节点 ID
        this.currentNodeData = { ...this.currentNodeData, ...this.formData }
        for (let attr in this.currentNodeData) {
          this.$set(addNodeData, attr, this.currentNodeData[attr])
        }
      } else {
        message = this.$t('修改权限内容成功')
        let addNodeData = search(this.data[0], this.currentNodeData.POWER_ID)
        this.currentNodeData = { ...this.currentNodeData, ...this.formData }
        for (let attr in this.currentNodeData) {
          this.$set(addNodeData, attr, this.currentNodeData[attr])
        }
      }
      this.handleCurrentChange(this.currentNodeData, true)
      this.$message({
        type: 'success',
        message
      })
    },
    // 当前选中节点发生变化时
    handleCurrentChange (data, isEdit) {
      if (data.POWER_ID === this.currentNodeData.POWER_ID && isEdit !== true) {
        return
      }
      this.currentNodeData = data
      this.formData = {
        POWER_NAME: data.POWER_NAME,
        PAR_POWER: data.PAR_POWER,
        POWER_TYPE: data.POWER_TYPE,
        POWER_STAT: data.POWER_STAT,
        MAINTAIN_FLAG: data.MAINTAIN_FLAG,
        REMARK: data.REMARK
      }
      this.formShow = false
      this.$nextTick(() => {
        this.formShow = true
      })
    },
    // 删除节点
    delNode (node, data) {
      this.$confirm(this.$t('你确定要删除') + data.POWER_NAME + this.$t('权限及其所有子权限吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          POWER_ID: data.POWER_ID,
          service: 'P0501203'
        }]).then((result) => {
          if (result.code === '0') {
            this.remove(node, data)
            this.currentNodeData = {}
            this.formShow = false
            this.$nextTick(() => {
              this.formShow = true
            })
            this.$message({
              type: 'success',
              message: this.$t('删除') + data.POWER_NAME + this.$t('权限及其所有子权限成功')
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('已取消删除')
        })
      })
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
        return this.currentNodeData.editName || ("<span style='color: #ff4949'>" + this.$t('未输入权限名称') + '</span>')
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
