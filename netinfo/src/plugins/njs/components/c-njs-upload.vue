<template>
  <Upload
      ref="upload"
     :action="realAction"
     :headers="headers"
     :multiple="multiple"
     :data="data"
     :name="name"
     :withCredentials="withCredentials"
     :showFileList="showFileList"
     :drag="drag"
     :accept="accept"
     :onPreview="onPreview"
     :onRemove="handleRemove"
     :onSuccess="handleSuccess"
     :onError="onError"
     :onProgress="onProgress"
     :onChange="onChange"
     :beforeUpload="beforeUpload"
     :beforeRemove="beforeRemove"
     :listType="listType"
     :autoUpload="autoUpload"
     :fileList="fileList"
     :httpRequest="httpRequest"
     :disabled="disabled"
     :limit="limit"
     :onExceed="onExceed"
      v-loading="loading"
      :element-loading-text="$t('请稍候')"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
  >
    <slot name="default" slot="default"></slot>
    <slot name="trigger" slot="trigger"></slot>
    <slot name="tip" slot="tip"></slot>
  </Upload>
</template>

<script>
import { Upload } from 'element-ui'
import { API as configApi } from '@/conf/'
// 获取接口根路径
const isProd = process.env.NODE_ENV === 'production'
const BASE_PATH = isProd ? configApi.production : configApi.development
export default {
  name: 'njs-upload',
  components: {
    Upload
  },
  props: {
    attaChnl: { // 来自老UCC，附件上传渠道。如果有传上传渠道则使用附件表记录上传记录，否则不记录到附件表中
      type: String,
      default: '1'
    },
    attaIds: { // 附件编号串
      type: String,
      default: ''
    },
    deleteRemoteAtta: { // 点击删除附件时要不要删除文件服务器里对应的文件及附件表里对应的数据
      type: Boolean,
      default: false
    },
    dir: { // 来自老UCC
      type: String,
      default: 'ATTA'
    }, // 来自老UCC
    fielDir: String,
    fileType: String, // 来自老UCC
    readfile: String, // 来自老UCC
    rename: { // 来自老UCC，上传成功后是否重命名
      type: Boolean,
      default: true
    },
    action: String, // 不适用老UCC上传地址时，自定义上传地址
    headers: Object, // 设置上传的请求头部
    multiple: Boolean, // 是否支持多选文件
    data: Object, // 上传时附带的额外参数
    name: { // 上传的文件字段名
      type: String,
      default: 'file'
    },
    withCredentials: { // 支持发送 cookie 凭证信息
      type: Boolean,
      default: false
    },
    showFileList: { // 是否显示已上传文件列表
      type: Boolean,
      default: true
    },
    drag: { // 是否启用拖拽上传
      type: Boolean,
      default: false
    },
    accept: String, // 接受上传的文件类型（thumbnail-mode 模式下此参数无效
    onPreview: Function, // 点击文件列表中已上传的文件时的钩子
    onRemove: Function, // 文件列表移除文件时的钩子
    onSuccess: Function, // 文件上传成功时的钩子
    onError: Function, // 文件上传失败时的钩子
    onProgress: Function, // 文件上传时的钩子
    onChange: Function, // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    beforeUpload: Function, // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeRemove: Function, // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。
    listType: String, // 文件列表的类型
    autoUpload: { // 是否在选取文件后立即进行上传
      type: Boolean,
      default: true
    },
    fileList: { // 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      type: Array,
      default () {
        return []
      }
    },
    httpRequest: Function, // 覆盖默认的上传行为，可以自定义上传的实现
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    limit: Number, // 最大允许上传个数
    onExceed: Function // 文件超出个数限制时的钩子
  },
  data () {
    return {
      loading: false // 组件加载中
    }
  },
  created () {
    if (this.attaIds) { // 回写附件列表
      this.loading = true
      this.$ajaxRequest([{
        service: 'P0302403',
        ATTA_IDS: this.attaIds
      }]).then((result) => {
        console.log(result)
        this.loading = false
        if (result.code === '0') {
          result.data.forEach((atta) => {
            atta.name = atta.ATTA_NAME
            atta.FILENAME = atta.ATTA_NAME
            atta.FILEPATH = atta.ATTA_URL
            atta.FILEVIEWURL = atta.FILEVIEWURL
            atta.FILECON = atta.ATTA_RENAME
            this.fileList.push(atta)
          })
        }
      })
    }
  },
  computed: {
    realAction () {
      if (this.action) { // 配置了上传地址则采用自定义的上传地址
        return this.action
      } else {
        let uploadUrl = BASE_PATH['UCC']
        uploadUrl += '/njdf_upload?DIR=' + (this.dir || 'ATTA')
        if (this.fielDir) {
          uploadUrl += '&FILEDIR=' + this.fielDir
        }
        if (this.fileType) {
          uploadUrl += '&FILETYPE=' + this.fileType
        }
        if (this.readfile) {
          uploadUrl += '&READFILE=' + this.readfile
        } else {
          uploadUrl += '&READFILE=false'
        }
        // 上传的路径
        uploadUrl += '&UN_RENAME=' + (this.rename ? 'false' : 'true')// 控制参数  不需要重命名
        return uploadUrl
      }
    }
  },
  methods: {
    clearFiles () {
      this.$refs.upload.clearFiles()
    },
    abort () {
      this.$refs.upload.abort()
    },
    submit () {
      this.$refs.upload.submit()
    },
    handleSuccess (response, file, fileList) {
      if (this.action) { // 如果自定义了上传路径，则自己处理上传成功逻辑
        this.onSuccess && this.onSuccess(response, file, fileList)
        return
      }
      try {
        if (response[0].flag === 'true') { // 上传给老UCC成功
          let fileData = response[0].data[0]
          if (this.attaChnl) { // 来自老UCC，如果有传上传渠道则使用附件表记录上传记录,否则不记录到附件表中
            this.loading = true
            this.$ajaxRequest([{
              service: 'P0302101',
              ATTA_CHNL: this.attaChnl,
              ATTA_NAME: fileData.FILENAME,
              ATTA_RENAME: fileData.FILECON,
              ATTA_URL: fileData.FILEPATH,
              ATTA_SIZE: fileData.FILESIZE
            }]).then((result) => {
              console.log(result)
              this.loading = false
              if (result.code === '0') {
                file.ATTA_ID = result.data[0]['ID']
                file.FILENAME = fileData.FILENAME
                file.FILEPATH = fileData.FILEPATH
                file.FILEVIEWURL = fileData.FILEVIEWURL
                file.FILECON = fileData.FILECON
                this.$emit('update:fileList', fileList)
                this.onSuccess && this.onSuccess(response, file, fileList)
              } else {
                this.onError && this.onError(result, file, fileList)
              }
            })
          }
        } else {
          this.onError && this.onError(response, file, fileList)
        }
      } catch (e) {
        this.onError && this.onError(response, file, fileList)
      }
    },
    handleRemove (file, fileList) {
      if (this.action) { // 如果自定义了上传路径，则自己处理删除逻辑
        this.onRemove && this.onRemove(file, fileList)
        return
      }
      if (this.deleteRemoteAtta) {
        this.loading = true
        this.$request({ // 删除已上传的附件
          apiType: 'UCC',
          method: 'get',
          url: '/njdf_delete',
          params: {
            DIR: this.dir || 'ATTA',
            FILENAME: file.FILENAME,
            FILECON: file.FILECON,
            ATT_ID: file.ATTA_ID,
            service: 'P0302202',
            TABLENAME: 'ATTACH_FILE',
            COLNAME: 'ATT_CON'
          }
        }).then((result) => {
          this.loading = false
          if (result.code === '0') { // 删除成功
            this.$emit('update:fileList', fileList)
            this.onRemove && this.onRemove(file, fileList)
          } else {
            this.$emit('update:fileList', JSON.parse(JSON.stringify(this.fileList))) // 删除失败要恢复文件列表
          }
        })
      } else {
        this.$emit('update:fileList', fileList)
        this.onRemove && this.onRemove(file, fileList)
      }
    }
  },
  watch: {
    fileList: {
      deep: true,
      handler (fileList) {
        let attaIds = []
        fileList.forEach((atta) => {
          atta.ATTA_ID && attaIds.push(atta.ATTA_ID)
          this.$emit('update:attaIds', attaIds.join(','))
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
