<template lang="pug">
  .container-wrap.home-wrap
    .box-body
      .box-home-service(style="padding: 20px;")
        div(style='padding-bottom: 20px;')
          njs-radio-group(v-model='labelPosition', size='small')
            njs-radio-button( label="left") 左对齐
            njs-radio-button( label="right") 右对齐
            njs-radio-button( label="top") 顶部对齐

        njs-form(:label-position='labelPosition', label-width='190px', :model='formLabelAlign' service="U15154545" submitText="提交一个" resetText="reset" @submit-before="submitBefore" ref="myForm" @submit-fail="submitFail" size="small" :rules="rules")
          njs-row
            njs-col(:span="12")
              njs-form-item( :label="$t('名称')" prop="name" required :error="$t('请填写名称')")
                njs-input(v-model='formLabelAlign.name')
            njs-col(:span="12")
              njs-form-item( :label="$t('密码')" prop="pass")
                njs-input(type="password" v-model='formLabelAlign.pass')

          njs-form-item( :label="$t('确认密码')" prop="password2")
            njs-input(type="password" v-model='formLabelAlign.password2')

          njs-form-item( :label="$t('邮箱')" prop="email")
            njs-input(v-model='formLabelAlign.email')

          njs-form-item( :label="$t('计数器')" prop="jishuqi")
            njs-input-number( v-model="formLabelAlign.jishuqi" :precision="2" :step="0.1")

          njs-form-item( :label="$t('滑块')" prop="huakuai")
            njs-slider( v-model.number="formLabelAlign.huakuai")

          njs-form-item( :label="$t('评分')" prop="pingfen")
            njs-rate(v-model="formLabelAlign.pingfen")

          njs-form-item( :label="$t('活动时间')" )
            njs-col(:span='11')
              njs-form-item(prop='date1')
                njs-date-picker(type='date', placeholder='选择日期', value-format="yyyy:MM:dd" v-model='formLabelAlign.date1', style='width: 100%;')
            njs-col.line(:span='2') -
            njs-col(:span='11')
              njs-form-item(prop='date2')
                njs-time-select(placeholder='选择时间', value-format="HH:mm:ss" v-model='formLabelAlign.date2', style='width: 100%;' :picker-options="{start: '08:30',step: '00:15',end: '18:30'}" )

          njs-form-item( :label="$t('活动形式')" prop="type")
            njs-input(v-model='formLabelAlign.type')

          njs-form-item( :label="$t('复选框')" prop="xingzhi")
            njs-checkbox-group(v-model="formLabelAlign.xingzhi" dict="AGENT_STATUS")

          njs-form-item( :label="$t('示忙原因')" prop="yuanyin")
            njs-combobox(v-model="formLabelAlign.yuanyin" dict="AGENT_STATUS")

          njs-form-item( :label="$t('放大镜示例')" prop="fangdajing")
            njs-combogrid(
            v-model="formLabelAlign.fangdajing"
            hide-head
            datagrid-id="demo_1"
            ref="combogrid"
            title="datagrid组件示例"
            dialog-width="80%"
            subheading="这是一个 datagrid 组件的使用例子，仅供参考"
            service="U0101400"
            :default-query="{name: '测试默认名称',select: '1'}"
            :height="507"
            :duration="2"
            :page-sizes="[5,10]"
            :auto-loading="true"
            multiple
            :reserve-selection="true"
            top="40px"
            empty-text="没找到你要的结果"
            data-value="ROLE_CODE"
            data-label="ROLE_NAME,MODIFY_OPER"
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
                      njs-option( :label="$t('全部')" value='1')
                      njs-option( :label="$t('角色编号')"  value='2')
                      njs-option( :label="$t('角色名称')" value='3')
                    njs-button(slot='append' type="primary" icon='el-icon-search' @click="$refs.combogrid.refresh()")

              njs-column(prop="ROLE_CODE" :label="$t('角色编号')" width="180px" sortable)
              njs-column(prop="ROLE_NAME" :label="$t('角色名称')")
              njs-column(prop="ROLE_STAT" type="state" :label="$t('状态')" dict="APPEAL_STAT" :state-map="{'1': 'warning', '2': 'success', '3':'danger'}" hide)
              njs-column(prop="MODIFY_OPER" :label="$t('最后修改人')")
              njs-column(prop="MODIFY_TIME" :label="$t('最后修改时间')")
          njs-form-item(:label="$t('附件:')")
            njs-upload(ref='upload' dir='demo' :attaIds.sync="formLabelAlign.attaIds")
              njs-button(type="primary" slot="trigger") {{ $t('上传文件') }}
          njs-form-item(:label="$t('文本内容:')")
            editor(v-model="formLabelAlign.html"  height="400px" :id="editorId")
          template(slot="button")
            njs-button(@click="mySubmit") {{$t('自定义按钮1')}}
            njs-button(@click="getAttr") {{$t('自定义按钮2')}}

</template>

<script>
import { validateEmail } from '@/validator/common'
import editor from '@/components/c-editor/index'
export default {
  components:{
    editor
  },
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('请输入密码')))
      } else {
        if (this.formLabelAlign.password2 !== '') {
          this.$refs.myForm.validateField('password2')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('请再次输入密码')))
      } else if (value !== this.formLabelAlign.pass) {
        callback(new Error(this.$t('两次输入密码不一致!')))
      } else {
        callback()
      }
    }
    return {
      labelPosition: 'right',
      formLabelAlign: {
        name: '11212121',
        email: '',
        type: '',
        xingzhi: '1',
        yuanyin: '2',
        date1: '2019-12-15',
        date2: '02:45',
        fangdajing: '4,6',
        jishuqi: '66.2350',
        huakuai: 13,
        pingfen: 3,
        pass: '',
        password2: ''
      },
      editorId: 'tinymce' + new Date().getTime() ,
      tableData: [{ ROLE_CODE: '1', ROLE_NAME: '名字1', MODIFY_OPER: '修改人1' }, { ROLE_CODE: '2', ROLE_NAME: '名字2', MODIFY_OPER: '修改人2' }, { ROLE_CODE: '3', ROLE_NAME: '名字3', MODIFY_OPER: '修改人3' }],
      rules: {
        name: [
          { required: true, message: this.$t('请输入活动名称'), trigger: 'change' },
          { min: 3, max: 5, message: this.$t('长度在 3 到 5 个字符'), trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('请输入邮箱'), trigger: 'blur' },
          { validator: validateEmail, trigger: 'change' }
        ],
        pass: [
          { validator: validatePass, trigger: 'change' }
        ],
        password2: [
          { validator: validatePass2, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitBefore (req, callback) {
      req[0].sss = 454545
      console.log('req', req)
      callback(req)
    },
    mySubmit () {
      this.$refs.myForm.submit({ sldfkj: 8787 }).then((result) => {
        console.log('submit 返回一个Promise', result)
      })
    },
    getAttr () {
      console.log(this.$refs.combogrid.getAttr('pageCount'))
    },
    submitFail (err) {
      console.log('提交失败', err)
    }
  },
  mounted () {
    // setTimeout(()=>{
    //   this.formLabelAlign.fangdajing = '4,6'
    //   this.$refs.combogrid.loadText()
    // },3000)
  }
}
</script>

<style lang="stylus" scoped>
  @import "./index.styl";
  .line
    text-align center
</style>
