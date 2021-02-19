<template lang="pug">
  njs-dialog(:title="$t('导入国际化词条')" :visible.sync="dialogvisible" width="40%")
    template
      njs-row(:gutter="20")
        njs-col(:span="16")
          njs-upload(
            :file-list.sync="fileList"
            dir="import"
            :multiple="false"
            :onSuccess="uploadsuccess"
            accept=".xlsx"
            :beforeUpload="beforeAvatarUpload"
            :on-change="handleChange"
            ref="upLoad")
            njs-button(type="primary" slot="trigger") {{ $t('上传文件') }}
            div(slot="tip" class="el-upload__tip") {{ $t('只能上传 .xlsx 文件，且内容格式要与导入模板一致。') }}
        njs-col(:span="8")
          njs-button(type="text" @click="download") {{ $t('下载词条导入模版') }}
      template(v-if="showMsg && fileList.length")
        p(style="padding-top: 28px;") {{ $t('文件扫描结果：') + $t('共包含') + ' ' }}
          span(style="color: red;") {{ checkInAll }}
          | {{  ' ' + $t('条数据，校验通过') + ' ' }}
          span(style="color: red;") {{ checkInData.SUCCESS_COUNT }}
          | {{ ' ' + $t('条，未通过') + ' ' }}
          span(style="color: red;") {{ checkInData.FAIL_COUNT }}
          | {{ ' ' + $t('条') }}
        div(style="padding: 12px 0;")
          njs-button(type="primary" @click="continueUpdata" :disabled="successUp || checkInData.SUCCESS_COUNT == 0") {{ $t('导入校验通过的数据') }}
          njs-button(type="primary" @click="continueDown" plain v-if="checkInData.FAIL_COUNT != 0") {{ $t('查看错误数据') }}
        p(v-if="successUp" style="padding-top: 12px;") {{ $t('成功导入') + ' ' }}
          span(style="color: red;") {{ successUpData.SUCCESS_COUNT }}
          | {{ ' ' + $t('条数据，失败') + ' ' }}
          span( style="color: red;") {{ successUpData.FAIL_COUNT }}
          | {{ ' ' + $t('条数据') }}
        div(style="padding-top: 12px;" v-if="successUp")
          njs-button(type="primary" @click="isOk") {{ $t('完成') }}
          njs-button(type="primary" @click="errorDown"  plain v-if="successUpData.FAIL_COUNT != 0 && successUpData.FAIL_COUNT != 'underfind'") {{ $t('下载错误的数据') }}
</template>

<script>
// 获取接口根路径
import { API as configApi } from '@/conf/'
const isProd = process.env.NODE_ENV === 'production'
const BASE_PATH = isProd ? configApi.production : configApi.development
export default {
  name: 'c-import-i18n',
  props: {
    visible: Boolean
  },
  data () {
    return {
      fileList: [], // 已上传的文件列表
      checkInAll: '', // 总校验条数
      showMsg: false, // 显示上传状态框
      checkInData: [], // 校验返回值
      successUp: false, // 成功上传显示
      successUpData: [] // 成功返回值
    }
  },
  methods: {
    // 上传成功调用
    async uploadsuccess (res) {
      let file = res[0].data
      this.fileName = file[0].FILECON
      this.$request({
        apiType: 'UCC',
        url: '/njdf_import?FILENAME=' + this.fileName + '&SERVICE=P0111505&IMPORTTYPE=1&encoderType=none',
        data: {},
        mask: true
      }).then((result) => {
        this.showMsg = true
        console.log(result)
        this.checkInData = result.data[0]
        this.failRedisKey = result.data[0].FAIL_REDIS_KEY
        this.checkInAll = parseInt(this.checkInData.FAIL_COUNT) + parseInt(this.checkInData.SUCCESS_COUNT)
        if (this.checkInAll === 0) {
          this.$message({
            message: this.$t('上传文件的数据为空，请重新上传！'),
            type: 'warning'
          })
        }
      })
    },
    // 上传之前调用，用于检测文件是否符合需求
    beforeAvatarUpload (file) {
      let cnaNameLength = file.name.length <= 128
      const isLt2M = file.size / 1024 / 1024 <= 100

      if (!isLt2M) {
        this.$message({
          message: this.$t('上传文件大小不能超过 100MB!'),
          type: 'warning'
        })
      }
      if (!cnaNameLength) {
        this.$message({
          message: this.$t('上传文件名的长度不能超过128(含扩展名)！'),
          type: 'warning'
        })
      }
      let verification = isLt2M && cnaNameLength
      return verification
    },
    handleChange (file, fileList) {
      this.fileList = fileList.slice(-1)
      this.checkInAll = '' // 总校验条数
      this.showMsg = false // 显示上传状态框
      this.checkInData = [] // 校验返回值
      this.successUp = false // 成功上传显示
      this.successUpData = [] // 成功返回值
    },
    // 导入功能下载模板方法
    download () {
      let url = BASE_PATH.UCC + '/I18NImport.xlsx'
      window.open(url, '_blank')
    },
    // 继续导入调用
    continueUpdata () {
      this.continue()
    },
    // 下载未通过的数据
    continueDown () {
      let url = BASE_PATH.UCC + '/I18NExportTXT?FAIL_REDIS_KEY=' + this.failRedisKey + '&FILE_NAME=' + this.$t('检查未通过的数据')
      window.open(url, '_blank')
    },
    // 点击成功之后关闭弹框，并初始化数据
    isOk () {
      this.$emit('update:visible', false)
    },
    // 下载错误数据
    errorDown () {
      let url = BASE_PATH.UCC + '/I18NExportTXT?FAIL_REDIS_KEY=' + this.errorRedisKey + '&FILE_NAME=' + this.$t('导入失败的数据')
      window.open(url, '_blank')
    },
    // 导入成功之后的数据，可以获取成功和失败的数据
    async continue () {
      let vm = this
      this.$ajaxRequest([{
        service: 'P0111506',
        SUCCESS_REDIS_KEY: vm.checkInData.SUCCESS_REDIS_KEY
      }]).then((result) => {
        if (result.code === '0') {
          vm.$message.success(result.msg)
          vm.successUpData = result.data[0]
          vm.successUp = true
          vm.errorRedisKey = result.data[0].FAIL_REDIS_KEY
          this.$emit('import')
        } else {
          vm.$message.error(result.msg)
        }
      }).catch((err) => {
        console.log(err)
      })

      // let vm = this
      // let req = [{
      //   service: 'P0111506',
      //   SUCCESS_REDIS_KEY: vm.checkInData.SUCCESS_REDIS_KEY
      // }]
      // let result = await httpAsync.njdfAjax(req)
      // if (result.code === '0') {
      //   vm.$message.success(result.msg)
      //   vm.successUpData = result.data[0]
      //   vm.successUp = true
      //   vm.errorRedisKey = result.data[0].FAIL_REDIS_KEY
      // } else {
      //   vm.$message.error(result.msg)
      // }
    }
  },
  computed: {
    dialogvisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  }
}
</script>

<style scoped>

</style>
