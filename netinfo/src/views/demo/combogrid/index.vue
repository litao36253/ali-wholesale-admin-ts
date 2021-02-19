<template lang="pug">
  .container-wrap.home-wrap
    .box-body
      .box-home-service(style="padding: 20px;")
        h5 多选基础用法
        .demo-con
          njs-combogrid(
            datagrid-id="demo_combogrid_U0101400_1"
            v-model="value1"
            ref="combogrid1"
            service="U0101400"
            hide-head
            multiple
            fullscreen
            height="100%"
            top="40px"
            data-value="ROLE_CODE"
            data-label="ROLE_CODE,ROLE_NAME"
          )
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
                njs-input(v-model="formData.name0" placeholder='请输入角色编号')
              njs-form-item(prop="name")
                njs-input.input-with-select(placeholder='请输入内容', v-model='formData.name' clearable)
                  njs-select(v-model='formData.select', slot='prepend', placeholder='请选择' :style="{width: '100px'}")
                    njs-option( :label="$t('全部')", value='1')
                    njs-option( :label="$t('角色编号')", value='2')
                    njs-option( :label="$t('角色名称')", value='3')
                  njs-button(slot='append' type="primary" icon='el-icon-search' @click="$refs.combogrid1.refresh()")

            njs-column(prop="ROLE_CODE" :label="$t('角色编号')" width="180px" sortable)
              template(slot-scope="scope")
                njs-button(size="mini") {{scope.row.ROLE_CODE}} 
            njs-column(prop="ROLE_NAME" :label="$t('角色名称')" )
            njs-column(prop="ROLE_STAT" type="state" :label="$t('状态')" dict="APPEAL_STAT" :state-map="{'1': 'warning', '2': 'success', '3':'danger'}")
            njs-column(prop="MODIFY_OPER" :label="$t('最后修改人')" hide)
            njs-column(prop="MODIFY_TIME" :label="$t('最后修改时间')")
          | 选中值为： {{ value1 }}

        h5 多选且赋初始值
        .demo-con
          njs-combogrid(
            datagrid-id="demo_combogrid_U0101400_2"
            v-model="value2"
            ref="combogrid2"
            service="U0101400"
            hide-head
            multiple
            data-value="ROLE_CODE"
            data-label="ROLE_CODE,ROLE_NAME"
          )
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
                njs-input(v-model="formData.name0" placeholder='请输入角色编号')
              njs-form-item(prop="name")
                njs-input.input-with-select(placeholder='请输入内容', v-model='formData.name' clearable)
                  njs-select(v-model='formData.select', slot='prepend', placeholder='请选择' :style="{width: '100px'}")
                    njs-option( :label="$t('全部')", value='1')
                    njs-option( :label="$t('角色编号')", value='2')
                    njs-option( :label="$t('角色名称')", value='3')
                  njs-button(slot='append' type="primary" icon='el-icon-search' @click="$refs.combogrid2.refresh()")

            njs-column(prop="ROLE_CODE" :label="$t('角色编号')" width="180px" sortable)
              template(slot-scope="scope")
                njs-button(size="mini") {{scope.row.ROLE_CODE}}
            njs-column(prop="ROLE_NAME" :label="$t('角色名称')" )
            njs-column(prop="ROLE_STAT" type="state" :label="$t('状态')" dict="APPEAL_STAT" :state-map="{'1': 'warning', '2': 'success', '3':'danger'}")
            njs-column(prop="MODIFY_OPER" :label="$t('最后修改人')" hide)
            njs-column(prop="MODIFY_TIME" :label="$t('最后修改时间')" )
          | 选中值为： {{ value2 }}

        h5 多选，模拟请求接口后给 combogrid 回写值
          njs-button(@click="mookRequre") 点击模拟
        .demo-con
          njs-combogrid(
            datagrid-id="demo_combogrid_U0101400_3"
            v-model="value3"
            ref="combogrid3"
            service="U0101400"
            hide-head
            multiple
            data-value="ROLE_CODE"
            data-label="ROLE_CODE,ROLE_NAME"
          )
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
                njs-input(v-model="formData.name0" placeholder='请输入角色编号')
              njs-form-item(prop="name")
                njs-input.input-with-select(placeholder='请输入内容', v-model='formData.name' clearable)
                  njs-select(v-model='formData.select', slot='prepend', placeholder='请选择' :style="{width: '100px'}")
                    njs-option( :label="$t('全部')", value='1')
                    njs-option( :label="$t('角色编号')", value='2')
                    njs-option( :label="$t('角色名称')", value='3')
                  njs-button(slot='append' type="primary" icon='el-icon-search' @click="$refs.combogrid3.refresh()")

            njs-column(prop="ROLE_CODE" :label="$t('角色编号')" width="180px" sortable)
              template(slot-scope="scope")
                njs-button(size="mini") {{scope.row.ROLE_CODE}}
            njs-column(prop="ROLE_NAME" :label="$t('角色名称')")
            njs-column(prop="ROLE_STAT" type="state" :label="$t('状态')" dict="APPEAL_STAT" :state-map="{'1': 'warning', '2': 'success', '3':'danger'}")
            njs-column(prop="MODIFY_OPER" :label="$t('最后修改人')" hide)
            njs-column(prop="MODIFY_TIME" :label="$t('最后修改时间')")
          | 选中值为： {{ value3 }}

        h5 单选，监听 change 事件
            .demo-con
              njs-combogrid(
                datagrid-id="demo_combogrid_U0101400_4"
                v-model="value4"
                ref="combogrid4"
                service="U0101400"
                hide-head
                single-select
                data-value="ROLE_CODE"
                data-label="ROLE_CODE,ROLE_NAME"
                @change="change4"
              )
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
                    njs-input(v-model="formData.name0" placeholder='请输入角色编号')
                  njs-form-item(prop="name")
                    njs-input.input-with-select(placeholder='请输入内容', v-model='formData.name' clearable)
                      njs-select(v-model='formData.select', slot='prepend', placeholder='请选择' :style="{width: '100px'}")
                        njs-option( :label="$t('全部')", value='1')
                        njs-option( :label="$t('角色编号')", value='2')
                        njs-option( :label="$t('角色名称')", value='3')
                      njs-button(slot='append' type="primary" icon='el-icon-search' @click="$refs.combogrid4.refresh()")

                njs-column(prop="ROLE_CODE" :label="$t('角色编号')" width="180px" sortable)
                  template(slot-scope="scope")
                    njs-button(size="mini") {{scope.row.ROLE_CODE}}
                njs-column(prop="ROLE_NAME" :label="$t('角色名称')")
                njs-column(prop="ROLE_STAT" type="state" :label="$t('状态')" dict="APPEAL_STAT" :state-map="{'1': 'warning', '2': 'success', '3':'danger'}")
                njs-column(prop="MODIFY_OPER" :label="$t('最后修改人')" hide)
                njs-column(prop="MODIFY_TIME" :label="$t('最后修改时间')")
              | 选中值为： {{ value4 }}
</template>

<script>
export default {
  name:'demo.datagrid',
  data () {
    return {
      value1: '',
      value2: '3.000000000000000000000000000000,2.000000000000000000000000000000',
      value3: '',
      value4: '',
      activeName: 'first'
    }
  },
  methods: {
    change4 (val) {
      // this.$alert(`combogrid4 触发change事件，当前选中 ${val}`)
      this.$nextTick(() => {
        this.$alert(this.$refs.combogrid4.getAttr('text'))
      })
    },
    mookRequre () {
      this.$ajaxRequest([{
        service: 'U0101400',
        page: 1,
        pagecount: 1000,
        pageoffset: 1,
        rows: 1000
      }]).then((result) => {
        if (result.code === '0') {
          this.value3 = '1,2,3'
          this.$nextTick(() => {
            this.$refs.combogrid3.loadText()
          })
        }
      })
    }
  },
  mounted () {

  }
}
</script>

<style lang="stylus" scoped>
  @import "../form/index.styl";
</style>
