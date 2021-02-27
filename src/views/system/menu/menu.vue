<template>
  <div class="container-wrap-aside">
    <div class="box-body">
      <div class="menu">
        <div class="menu-title">系统菜单</div>
        <div class="menu-con">
          <el-tree
            :data="data"
            node-key="MENU_ID"
            ref="tree"
            default-expand-all="default-expand-all"
            :expand-on-click-node="false"
            check-on-click-node="check-on-click-node"
            highlight-current="highlight-current"
            show-search="show-search"
            search-field="MENU_NAME"
            placeholder="输入菜单名称搜索菜单"
            @current-change="handleCurrentChange"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
              v-if="data.showState === 'show'"
              @mouseenter="mouseIn = data.MENU_ID"
              @mouseleave="mouseIn = ''"
            ><span>{{ data.MENU_NAME }}</span>
              <div v-show="mouseIn === data.MENU_ID">
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click.stop="append(node, data)"
                ></el-button>
                <el-button
                  type="text"
                  icon="el-icon-edit"
                  :disabled="data.IS_DEL === '2' || data.IS_DEL === '3'"
                  @click="data.showState = 'edit'"
                  v-if="data.MENU_ID !== '0'"
                ></el-button>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  :disabled="data.IS_DEL === '1' || data.IS_DEL === '3'"
                  @click="delNode(node, data)"
                  v-if="data.MENU_ID !== '0'"
                ></el-button>
              </div>
            </span>
            <span v-else slot-scope="{ node, data }" class="custom-tree-node">
              <el-form
                :model="data"
                :ref="`form${data.MENU_ID}`"
                :rules="addEditRules"
                :style="{ flex: 1, marginRight: '4px' }"
                size="mini"
                @submit.native.prevent
                @click.stop
              >
                <el-form-item prop="editName" :style="{ marginBottom: '0' }">
                  <el-input
                    v-model="data.editName"
                    :ref="`input${data.MENU_ID}`"
                    @keydown.native.13="doEdit(node, data)"
                  ></el-input>
                </el-form-item>
              </el-form>
              <el-button
                type="text"
                icon="el-icon-check"
                @click="doEdit(node, data)"
              ></el-button>
              <el-button
                type="text"
                icon="el-icon-close"
                @click="cancelEdit(node, data)"
              ></el-button>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="form-wrap">
        <div class="form-title" v-html="formTitle"></div>
        <div class="form">
          <el-form
            :model="formData"
            ref="addEditForm"
            :service="
              currentNodeData.showState === 'add' ? 'P0104101' : 'P0104302'
            "
            :rules="addEditRules"
            @before-submit="handleSubmitHandle"
            @submit-success="handleSuccessHandle"
            size="default"
            v-if="formShow"
            :disabled="
              !currentNodeData.MENU_ID ||
              currentNodeData.MENU_ID === '0' ||
              currentNodeData.IS_DEL === '2' ||
              currentNodeData.IS_DEL === '3'
            "
          >
            <el-form-item prop="MENU_LINK" label="菜单路径">
              <el-input v-model="formData.MENU_LINK"></el-input>
            </el-form-item>
            <el-form-item prop="MENU_ICO" label="菜单图标">
              <el-input v-model="formData.MENU_ICO"></el-input>
            </el-form-item>
            <el-form-item prop="IS_DEL" label="维护标识">
              <el-radio-group
                v-model="formData.IS_DEL"
                dict="MAINTAIN_FLAG"
                :disabled="currentNodeData.showState !== 'add' &amp;&amp; currentNodeData.IS_DEL !== '0'"
              ></el-radio-group>
            </el-form-item>
            <el-form-item prop="MENU_STAT" label="启用状态">
              <el-switch
                v-model="formData.MENU_STAT"
                active-color="#13ce66"
                active-value="1"
                inactive-value="0"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="禁用"
              ></el-switch>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { listTransTree } from '@/utils/utils'
const search = (tree, target) => {
  if (tree.MENU_ID === target) {
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
  name: 'system.menu', // 页面级别组件一定要用路由名称命名！！！
  data () {
    return {
      data: [
        {
          MENU_ID: '0',
          MENU_NAME: '全部菜单',
          showState: 'show',
          MENU_STAT: '1',
          IS_DEL: '3',
          children: []
        }
      ],
      formData: {
        // 新增修改表单数据
        MENU_NAME: '',
        PAR_MENU: '',
        MENU_LINK: '',
        MENU_STAT: '1',
        MENU_ICO: '',
        IS_DEL: '0'
      },
      formShow: true, // 用于重新渲染表单
      addEdit: 'edit', // 新增修改标识
      addEditRules: {
        // 新增修改表单校验规则
        MENU_NAME: [
          { required: true, message: ' ', trigger: ['blur', 'change'] },
          { max: 64, message: ' ', trigger: 'change' }
        ],
        editName: [
          { required: true, message: ' ', trigger: ['blur', 'change'] },
          { max: 64, message: ' ', trigger: 'change' }
        ],
        MENU_LINK: [
          // { required: true, message: '请输入菜单路径', trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback()
              } else {
                if (/^(\/[-A-Za-z\d]+)+$/.test(value)) {
                  callback()
                } else {
                  callback(
                    new Error('请输入正确路径，形如：/system/menu')
                  )
                }
              }
            },
            trigger: 'change'
          },
          { max: 64, message: '长度不能超过 64', trigger: 'change' }
        ],
        MENU_STAT: [],
        MENU_ICO: []
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
        MENU_ID: 'timeStamp' + new Date().getTime(),
        MENU_NAME: '',
        editName: '',
        showState: 'add',
        LSE_ID: '',
        MENU_DOTIME: '',
        MENU_ICO: '',
        MENU_LINK: '',
        MENU_STAT: '1',
        PAR_MENU: data.MENU_ID,
        IS_DEL: '0',
        children: []
      }
      if (data.children) {
        data.children.push(newChild)
      } else {
        this.$set(data, 'children', [newChild])
      }
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(newChild.MENU_ID)
        this.handleCurrentChange(newChild)
        this.$refs[`input${newChild.MENU_ID}`].focus()
      })
    },
    // 删除前端节点（没调接口）
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.MENU_ID === data.MENU_ID)
      children.splice(index, 1)
    },
    // 取消编辑
    cancelEdit (node, data) {
      if (data.showState === 'edit') {
        data.editName = data.MENU_NAME // 编辑状态下的菜单名称恢复
        data.showState = 'show'
      } else if (data.showState === 'add') {
        this.$confirm('你确定要放弃本次新增吗？', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.remove(node, data)
            this.currentNodeData = {}
            this.formShow = false
            this.$nextTick(() => {
              this.formShow = true
            })
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 确定修改名称
    doEdit (node, data) {
      if (data.showState === 'add') {
        // 新增
        this.$refs.addEditForm.validate(result => {
          if (result) {
            this.$refs.addEditForm.submit()
          } else {
            this.$message.error('请先完善菜单信息')
          }
        })
      } else {
        this.$ajaxRequest([
          {
            service: 'P0104302',
            MENU_ID: data.MENU_ID,
            MENU_NAME: data.editName,
            IS_DEL: data.IS_DEL,
            MENU_ICO: data.MENU_ICO,
            MENU_LINK: data.MENU_LINK,
            MENU_STAT: data.MENU_STAT,
            PAR_MENU: data.PAR_MENU
          }
        ]).then(reult => {
          if (reult.code === '0') {
            data.showState = 'show'
            data.MENU_NAME = data.editName
            // let addNodeData = search(this.data[0], data.MENU_ID)
            // this.currentNodeData = { ...this.currentNodeData, ...this.formData }
            // for (let attr in this.currentNodeData) {
            //   this.$set(addNodeData, attr, this.currentNodeData[attr])
            // }
            this.$message({
              type: 'success',
              message: '修改菜单名称成功'
            })
          }
        })
      }
    },
    // 表单提交之前事件
    handleSubmitHandle (req, back) {
      if (this.currentNodeData.showState === 'add') {
        // 新增
        this.$refs[`form${this.currentNodeData.MENU_ID}`].validate(result => {
          if (result) {
            this.formData.MENU_NAME = this.currentNodeData.editName
            req[0].MENU_NAME = this.currentNodeData.editName
            back(req)
          } else {
            if (this.currentNodeData.editName) {
              this.$message.error('菜单名称长度不能超过 64！')
            } else {
              this.$message.error('请输入菜单名称！')
            }
            back(false)
          }
        })
      } else {
        // 修改
        this.formData.MENU_NAME = this.currentNodeData.MENU_NAME
        req[0].MENU_NAME = this.currentNodeData.MENU_NAME
        req[0].MENU_ID = this.currentNodeData.MENU_ID
        back(req)
        // this.$refs[`form${this.currentNodeData.MENU_ID}`].validate((result) => {
        //   if (result) {
        //     req[0].MENU_NAME = this.currentNodeData.editName
        //     req[0].MENU_ID = this.currentNodeData.MENU_ID
        //     callback(req)
        //   } else {
        //     if (this.currentNodeData.editName) {
        //       this.$message.error('菜单名称长度不能超过 64！')
        //     } else {
        //       this.$message.error('请输入菜单名称！')
        //     }
        //     callback(false)
        //   }
        // })
      }
    },
    // 表单提交成功
    handleSuccessHandle (result) {
      let message
      if (this.currentNodeData.showState === 'add') {
        message = '新增菜单成功'
        this.currentNodeData.showState = 'show'
        console.log(this.data[0], this.currentNodeData.MENU_ID)
        const addNodeData = search(this.data[0], this.currentNodeData.MENU_ID)
        this.currentNodeData.MENU_ID = result.data[0].MENU_ID // 新增得到的节点 ID
        this.currentNodeData = { ...this.currentNodeData, ...this.formData }
        for (const attr in this.currentNodeData) {
          this.$set(addNodeData, attr, this.currentNodeData[attr])
        }
      } else {
        message = '修改菜单内容成功'
        const addNodeData = search(this.data[0], this.currentNodeData.MENU_ID)
        this.currentNodeData = { ...this.currentNodeData, ...this.formData }
        for (const attr in this.currentNodeData) {
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
      if (data.MENU_ID === this.currentNodeData.MENU_ID && isEdit !== true) {
        return
      }
      this.currentNodeData = data
      this.formData = {
        MENU_NAME: data.MENU_NAME,
        PAR_MENU: data.PAR_MENU,
        MENU_LINK: data.MENU_LINK,
        MENU_STAT: data.MENU_STAT,
        MENU_ICO: data.MENU_ICO,
        IS_DEL: data.IS_DEL
      }
      this.formShow = false
      this.$nextTick(() => {
        this.formShow = true
      })
    },
    // 删除节点
    delNode (node, data) {
      this.$confirm(
        '你确定要删除' +
          data.MENU_NAME +
          '菜单及其所有子菜单吗？',
        '提示',
        {
          type: 'warning'
        }
      )
        .then(() => {
          this.$ajaxRequest([
            {
              MENU_ID: data.MENU_ID,
              service: 'P0104203'
            }
          ]).then(result => {
            if (result.code === '0') {
              this.remove(node, data)
              this.currentNodeData = {}
              this.formShow = false
              this.$nextTick(() => {
                this.formShow = true
              })
              this.$message({
                type: 'success',
                message:
                  '删除' +
                  data.MENU_NAME +
                  '菜单及其所有子菜单成功'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created () {
    this.$ajaxRequest([
      {
        service: 'P0104404'
      }
    ]).then(result => {
      if (result.code === '0') {
        result.data.forEach(item => {
          item.showState = 'show' // 规定该节点的展示状态。 show：展示， add：新增，edit：修改
          item.editName = item.MENU_NAME // 编辑状态下的菜单名称
        })
        this.$set(
          this.data[0],
          'children',
          listTransTree(result.data, 'MENU_ID', 'PAR_MENU')
        )
      }
    })
  },
  computed: {
    formTitle () {
      if (this.currentNodeData.MENU_ID) {
        if (this.currentNodeData.MENU_ID === '0') {
          return (
            "<span style='color: #ff4949'>" +
            '根菜单不可编辑' +
            '</span>'
          )
        }
        return (
          this.currentNodeData.editName ||
          "<span style='color: #ff4949'>" +
            '未输入菜单名称' +
            '</span>'
        )
      } else {
        return (
          "<span style='color: #ff4949'>" + '未选中菜单' + '</span>'
        )
      }
    }
  }
}
</script>
