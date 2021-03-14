<template>
  <div class="source-content">
    <el-form :model="queryModel" size="small" class="source-query" inline>
      <el-form-item prop="type">
        <el-radio-group v-model="queryModel.type" dict="file_type" auto-create-button></el-radio-group>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="queryModel.name" suffix-icon="el-icon-search" placeholder="输入文件名搜索" clearable></el-input>
      </el-form-item>
      <el-form-item class="operation">
        <el-checkbox label="全选" class="margin-right"></el-checkbox>
        <el-button type="danger" class="margin-right">批量删除</el-button>
        <el-popover placement="bottom" width="240" trigger="click">
          <el-button slot="reference" type="primary">移动至<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-tree
            ref="tree"
            node-key="_id"
            :data="[{ _id: '0', name: '全部素材' }]"
            :service="$jql.system.source.querySourceCategories"
            label="name"
            data-type="list"
            parent-id="parent_ids.0"
            show-search
            search-field="name"
            default-expand-all
            :expand-on-click-node="false"
            check-on-click-node
            highlight-current
            size="small"
          >
          </el-tree>
        </el-popover>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'source-content'
})
export default class SourceContent extends Vue {
  protected loading = false

  protected queryModel = {
    type: 'picture'
  }

  protected onProgress (event, file, fileList) {
    console.log(event, file, fileList)
  }

  protected choose () {
    uni.chooseImage({
      count: 1,
      success: res => {
        console.log(res)
        if (typeof res.tempFilePaths === 'string') {
          uniCloud.uploadFile({
            filePath: res.tempFilePaths,
            cloudPath: res.tempFiles,
            fileType: 'image',
            onUploadProgress: (progress) => {
              console.log('onUploadProgress', progress.loaded / progress.total * 100)
            },
            success: (result) => {
              console.log('success', result)
            },
            fail: (error) => {
              console.log('fail', error)
            }
          })
        } else {
          res.tempFilePaths.forEach((path, index) => {
            uniCloud.uploadFile({
              filePath: path,
              cloudPath: res.tempFiles[index].name,
              fileType: 'image',
              onUploadProgress: (progress) => {
                console.log('onUploadProgress', progress.loaded / progress.total * 100)
              },
              success: (result) => {
                console.log('success', result)
              },
              fail: (error) => {
                console.log('fail', error)
              }
            })
          })
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.source-content {
  height: 100%;
  padding-right: 20px;
  .source-query {
    border-bottom: 1px solid #E8E8E8;
    .operation {
      float: right;
      .margin-right {
        margin-right: 12px;
      }
    }
  }
}
</style>
