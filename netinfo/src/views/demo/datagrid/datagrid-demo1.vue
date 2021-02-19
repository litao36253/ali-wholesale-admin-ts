<template lang="pug">
  njs-datagrid(
  datagrid-id="demo_1"
  ref="datagrid"
  title="datagrid组件示例"
  subheading="这是一个 datagrid 组件的使用例子，仅供参考"
  :button-list="btnList"
  service="U0101400"
  :default-query="{name:'测试默认名称',select:'1'}"
  :height="620"
  :duration="2"
  :page-sizes="[5,10]"
  :auto-loading="true"
  multiple
  :selectable="selectable"
  :reserve-selection="true"
  row-key="ROLE_CODE"
  empty-text="没找到你要的结果"
  @before-load="beforeLoad"
  @load-success="loadSuccess"
  )
    njs-column(prop="ROLE_CODE" label="角色编号" width="180px" sortable)
      <!--template(slot-scope="scope")-->
        <!--njs-button(size="mini") {{scope.row.ROLE_CODE}}-->
    njs-column(prop="ROLE_NAME" label="角色名称" :hide="true")
    njs-column(prop="ROLE_STAT" type="state" label="状态" dict="APPEAL_STAT" :state-map="{'1': 'warning', '2': 'success', '3':'danger'}")
    njs-column(prop="MODIFY_OPER" label="最后修改人" :hide="true")
    njs-column(prop="MODIFY_TIME" label="最后修改时间")
    <!--njs-column(prop="name" label="姓名" )-->
      <!--template(slot-scope="scope")-->
        <!--njs-button(@click="lala(scope)") {{scope.row['name']}}-->
    <!--njs-column(prop="address" label="地址11" show-overflow-tooltip)-->
    <!--njs-column(prop="date" label="日期")-->
    <!--njs-column(prop="lvl" label="坐席等级" dict="AGENT_LVL" :formatter="formatter")-->
    template(slot="more-query" slot-scope="{formData}")
      njs-row(:gutter="20")
        njs-col(:span='12')
          njs-form-item(label="测试条件1" prop="name2")
            njs-input(v-model="formData.name2")
        njs-col(:span='12')
          njs-form-item(label="测试条件2" prop="name3")
            njs-input(v-model="formData.name3")
      div(style="border-bottom: 1px dashed rgba(232,232,232,1); margin-bottom:20px;")
      njs-form-item(label="测试条件5" prop="create6")
        njs-input(v-model="formData.create6")
    template(slot="more-used-query" slot-scope="{formData}")
      njs-form-item(prop="name0")
        njs-input(v-model="formData.name0" placeholder='请输入角色编号')
      njs-form-item(prop="name")
        njs-input.input-with-select(placeholder='请输入内容', v-model='formData.name' clearable)
          njs-select(v-model='formData.select', slot='prepend', placeholder='请选择' :style="{width:'100px'}")
            njs-option(label='全部', value='1')
            njs-option(label='角色编号', value='2')
            njs-option(label='角色名称', value='3')
          njs-button(slot='append' type="primary" icon='el-icon-search' @click="$refs.datagrid.refresh()")
</template>
<script>
export default {
  data () {
    return {
      btnList: [
        {
          type: 'dialog', // 按钮类型为弹框
          icon: '图标', // 按钮图标，默认无图标
          text: '新增', // 按钮上的文字，默认为“新增”
          dialogTitle: '新增弹框的标题', // 新增弹框的标题，默认为“新增”
          width: '200px'
        },
        {
          type: 'delete', // 按钮类型为删除
          disabled: false, // 是否禁用，默认false
          service: '接口号', // 必填，新增数据的接口号
          key: '字段名', // 必填，指定以哪个字段拼串告诉后台要删除的数据
          icon: '图标', // 按钮图标，默认无图标
          text: '批量删除', // 按钮上的文字，默认为“新增”
          unchecked: '请勾选要删除的数据！', // 未勾选数据时的提示文字，默认为“请勾选要删除的数据！”
          confirm: '你确定要删除这些数据吗？' // 二次确认提示文字，默认为“你确定要删除这些数据吗？”
        },
        {
          type: 'custom', // 按钮类型为自定义，默认为自定义
          handler: () => {
            console.log(this.btnList)
            this.$alert('我是个自定义按钮')
          }, // 必填，点击此自定义按钮时调用的方法
          icon: 'el-icon-share', // 按钮图标，默认无图标
          text: '自定义按钮1' // 按钮上的文字，默认为“自定义按钮”
        },
        {
          type: 'custom', // 按钮类型为自定义，默认为自定义
          disabled: true,
          handler: () => {
            console.log(this.btnList)
            this.$alert('我是个自定义按钮')
          }, // 必填，点击此自定义按钮时调用的方法
          text: '自定义按钮2' // 按钮上的文字，默认为“自定义按钮”
        }
      ],
      // data: [{
      //   date: '2016-05-03',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   lvl: '0'
      // }, {
      //   date: '2016-05-02',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   lvl: '0'
      // }, {
      //   date: '2016-05-04',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路上海市普陀区金沙江路 1518 弄',
      //   lvl: '1'
      // }, {
      //   date: '2016-05-01',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   lvl: '2'
      // }, {
      //   date: '2016-05-08',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   lvl: '0'
      // }, {
      //   date: '2016-05-06',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   lvl: '0'
      // }, {
      //   date: '2016-05-07',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   lvl: '0'
      // }, {
      //   date: '2016-05-07',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   lvl: '0'
      // }, {
      //   date: '2016-05-07',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   lvl: '0'
      // }, {
      //   date: '2016-05-07',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   lvl: '0'
      // }, {
      //   date: '2016-05-07',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   lvl: '0'
      // }, {
      //   date: '2016-05-07',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄',
      //   lvl: '0'
      // }],

    }
  },
  methods: {
    selectable (row, index) {
      return index % 2 === 0
    },
    beforeLoad (req, callBack) {
      req[0].aa = 'sfasfd'
      callBack(req)
    },
    loadSuccess (data, callback) {
      console.log('刷新成功', data)
      data[0]['ROLE_NAME'] = '李涛'
      callback(data)
    },
    lala (lala) {
      console.log(lala)
    },
    formatter (row, column, cellValue, index) {
      return cellValue
    },
    data(){
      return []
    }
  },
  created () {

  }
}
</script>
<style>

</style>
