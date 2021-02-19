<template lang="pug">
.container-wrap
  .title {{$t('附件上传示例')}}
  njs-row(style="padding:10px")
    njs-col( :span=8 )
      njs-upload(
        ref="upLoad"
        dir="demo"
        :file-list.sync="fileList"
        :attaIds.sync="attaIds"
        :deleteRemoteAtta="true"
        :onSuccess="uploadsuccess"
        :beforeUpload="beforeAvatarUpload"
        
        :limit="limit"  :on-exceed="onExceed"
        :list-type="listType"
        :multiple="multiple"
        :disabled="disabled"
        :show-file-list="showFileList"
        :drag="drag"
      )
        njs-button(type="primary" slot="trigger") {{ $t('上传文件') }}
    njs-col( :span=8 )
      njs-button(@click="disabled=disabled?false:true") {{!disabled?'禁用':'启用'}}
      .line
      njs-button(@click="showFileList=showFileList?false:true") {{showFileList?'隐藏文件列表':'显示文件列表'}}
      .line
      njs-button(@click="multiple=multiple?false:true") {{!multiple?'文件多选':'文件单选'}}
      .line
      njs-button(@click="drag=drag?false:true") {{!drag?'可拖拽上传':'不可拖拽上传'}}
      .line
      njs-button(@click="limit=limit==0?1:0") {{!limit==0?'不限制附件数量':'只上传一个附件'}}
      .line
      njs-button(@click="listType='text'" v-if="listType=='picture-card'") 文件列表-文本
      njs-button(@click="listType='picture'" v-if="listType=='text'") 文件列表-图片list
      njs-button(@click="listType='picture-card'" v-if="listType=='picture'") 文件列表-图片Card
      .line
      njs-button(type="primary" @click="saveData") {{$t('提交保存')}}
</template>

<script>
export default {
  name: 'upload-demo',
  data () {
    return {
      disabled:false,  //是否禁用
      multiple:true,  //是否支持多附件上传
      limit:0,        //文件上传数量限制
      showFileList:true,  //是否显示文件列表
      drag:false,   //是否支持拖拽文件上传
      listType:'text', //上传的文件列表类型 text/picture/picture-card
      fileList: [],
      attaIds: '13'
    }
  },
  methods: {
    saveData(){
      this.$message.success(this.$t('附件编号:')+this.attaIds);
    },
    uploadsuccess () {

    },
    beforeAvatarUpload () {

    },
    onExceed (file,fileList) {
      this.$message.warning(this.$t('最多只能上传')+this.limit+this.$t('文件'))
    }
  }
}
</script>

<style lang="stylus" scoped>
.line
  padding-top 5px;
</style>
