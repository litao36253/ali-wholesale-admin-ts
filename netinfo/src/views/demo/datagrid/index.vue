<template lang="pug">
  .container-wrap.home-wrap
    .box-body
      .box-home-service
        njs-datagrid(
          datagrid-id="demo_1"
          ref="datagrid"
          :title="$t('datagrid组件示例2')"
          :subheading="$t('这是一个 datagrid 组件的使用例子，仅供参考')"
          :button-list="btnList"
          service="U0101400"
          :default-query="{name:$t('测试默认名称'),select:'1'}"
          :duration="1000"
          :auto-loading="true"
          :selectable="selectable"
          multiple
          row-key="ROLE_CODE"
          sort-by=""
          @before-load="beforeLoad"
          @load-success="loadSuccess"
        )
          <!-- 右侧卡片的插槽 ------------------------------------------ start ---- litao ---------------------------------------------------------------------------- 20190513 -->
          template(slot="fixed-card" slot-scope="{ formData }")
            njs-datagrid-card(:title="$t('测试')" :visible.sync="showCard" @open="$alert($t('njs-datagrid-card 的 open 事件'))" @close="$alert($t('njs-datagrid-card 的 close 事件'))")
              njs-form(:model="formData")
                njs-form-item(:label="$t('测试条件1')" prop="name2")
                  njs-input(v-model="formData.name2")
              njs-button(slot="footer" size="medium" type="primary") {{$t('确定')}}
            njs-datagrid-card(:title="$t('查看详情')" :visible.sync="showDetails" :close-text="$t('确定')")
              njs-timeline
                njs-timeline-item(timestamp='2018/4/12', placement='top')
                  njs-card
                    h4 更新 Github 模板
                    p 王小虎 提交于 2018/4/12 20:46
                njs-timeline-item(timestamp='2018/4/3', placement='top')
                  njs-card
                    h4 更新 Github 模板
                    p 王小虎 提交于 2018/4/3 20:46
                njs-timeline-item(timestamp='2018/4/2', placement='top')
                  njs-card
                    h4 更新 Github 模板
                    p 王小虎 提交于 2018/4/2 20:46
          <!-- 右侧卡片的插槽 ------------------------------------------ end ---- litao ------------------------------------------------------------------------------------------------>

          njs-column(prop="ROLE_CODE" :label="$t('角色编号')" sortable show-overflow-tooltip)
            <!--template(slot-scope="scope")-->
            <!--njs-button(size="mini") {{scope.row.ROLE_CODE}}-->
          njs-column(prop="ROLE_NAME" :label="$t('角色名称')")
          njs-column(prop="ROLE_STAT" type="state" :label="$t('状态')" dict="APPEAL_STAT" :state-map="{'1': 'warning', '2': 'success', '3':'danger'}")
          njs-column(prop="MODIFY_OPER" :label="$t('最后修改人')")
            template(slot-scope="{ row, column, $index }")
              div(style="color: red;") {{ `${row.ROLE_NAME}.....` }}
          njs-column(prop="MODIFY_TIME" :label="$t('最后修改时间')")
          njs-column(prop="ROLE_CODE" :label="$t('操作')" fixed="right")
            template(slot-scope="{ row, column, $index }")
              njs-button(type="text" @click="handlerShowDetails(row, column, $index)") 详情
          <!--njs-column(prop="name" :label="$t('姓名" )-->
          <!--template(slot-scope="scope")-->
          <!--njs-button(@click="lala(scope)") {{scope.row['name']}}-->
          <!--njs-column(prop="address" :label="$t('地址11" show-overflow-tooltip)-->
          <!--njs-column(prop="date" :label="$t('日期')")-->
          <!--njs-column(prop="lvl" :label="$t('坐席等级')" dict="AGENT_LVL" :formatter="formatter")-->
          template(slot="more-query" slot-scope="{formData}")
            njs-row(:gutter="20")
              njs-col(:span='12')
                njs-form-item( :label="$t('测试条件1')" prop="name2")
                  njs-input(v-model="formData.name2")
              njs-col(:span='12')
                njs-form-item( :label="$t('测试条件2')" prop="name3")
                  njs-input(v-model="formData.name3")
            div(style="border-bottom: 1px dashed rgba(232,232,232,1); margin-bottom:20px;")
            njs-form-item( :label="$t('测试条件5')" prop="create6")
              njs-input(v-model="formData.create6")
          template(slot="more-used-query" slot-scope="{formData}")
            njs-form-item(prop="name0")
              njs-combobox(
                dict="AGENT_STATUS"
                v-model="formData.name0"
                no-match-text="meiyou"
              )
            njs-form-item(prop="name")
              njs-input.input-with-select(:placeholder="$t('请输入内容')", v-model='formData.name' clearable)
                njs-select(v-model='formData.select', slot='prepend', :placeholder="$t('请选择')" :style="{width:'100px'}")
                  njs-option( :label="$t('全部')", value='1')
                  njs-option( :label="$t('角色编号')", value='2')
                  njs-option( :label="$t('角色名称')", value='3')
                njs-button(slot='append' type="primary" icon='el-icon-search' @click="$refs.datagrid.refresh()")
</template>

<script>
export default {
  data () {
    return {
      btnList: [
        {
          text: this.$t('右侧弹框'), // 按钮上的文字，默认为“新增”
          handler: () => {
            this.showCard = true
          } // 必填，点击此自定义按钮时调用的方法
        },
        {
          type: 'delete', // 按钮类型为删除
          disabled: false, // 是否禁用，默认false
          service: 'U223234', // 必填，新增数据的接口号
          key: 'ROLE_CODE', // 必填，指定以哪个字段拼串告诉后台要删除的数据
          icon: this.$t('图标'), // 按钮图标，默认无图标
          text: this.$t('批量删除'), // 按钮上的文字，默认为“新增”
          unchecked: this.$t('请勾选要删除的数据！'), // 未勾选数据时的提示文字，默认为“请勾选要删除的数据！”
          confirm: this.$t('你确定要删除这些数据吗？') // 二次确认提示文字，默认为“你确定要删除这些数据吗？”
        },
        {
          type: 'custom', // 按钮类型为自定义，默认为自定义
          handler: () => {
            console.log(this.btnList)
            this.$alert(this.$t('我是个自定义按钮'))
            console.log(this.$refs.datagrid.getAttr('currentRow'))
          }, // 必填，点击此自定义按钮时调用的方法
          icon: 'el-icon-share', // 按钮图标，默认无图标
          text: this.$t('自定义按钮1') // 按钮上的文字，默认为“自定义按钮”
        },
        {
          type: 'custom', // 按钮类型为自定义，默认为自定义
          disabled: true,
          handler: () => {
            console.log(this.btnList)
            this.$alert(this.$t('我是个自定义按钮'))
          }, // 必填，点击此自定义按钮时调用的方法
          text: this.$t('自定义按钮2') // 按钮上的文字，默认为“自定义按钮”
        }
      ],
      data: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        lvl: '0'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        lvl: '0'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路 1518 弄',
        lvl: '1'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        lvl: '2'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        lvl: '0'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        lvl: '0'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        lvl: '0'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        lvl: '0'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        lvl: '0'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        lvl: '0'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        lvl: '0'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        lvl: '0'
      }],
      showCard: false,
      showDetails: true
      // data:[]
    }
  },
  methods: {
    selectable (row, index) {
      return index % 2 === 0
    },
    beforeLoad (req, callBack) {
      req[0].ROLE_TYPE = '1'
      callBack(req)
    },
    loadSuccess (data, callback) {
      console.log('刷新成功', data)
      data[0]['ROLE_NAME'] = '李涛'
      data[0]['ROLE_CODE'] = '李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛李涛'
      // setTimeout(()=>{
      callback(data)
      // },1000)
    },
    lala (lala) {
      console.log(lala)
    },
    formatter (row, column, cellValue, index) {
      return cellValue
    },
    handlerShowDetails (row, column, $index) {
      this.showDetails = true
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>

<style lang="stylus" scoped>
  @import "index.styl";
</style>
