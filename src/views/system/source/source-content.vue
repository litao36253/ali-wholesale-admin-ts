<template>
  <div v-loading="loading" class="source-content">
    <el-form :model="queryModel" size="small" class="source-query" inline>
      <el-form-item prop="file_type">
        <el-radio-group v-model="queryModel.file_type" dict="file_type" auto-create-button @change="refresh"></el-radio-group>
      </el-form-item>
      <el-form-item prop="file_name">
        <el-input v-model="queryModel.file_name" suffix-icon="el-icon-search" placeholder="输入文件名搜索" clearable @keydown.native.13="refresh" @clear="refresh"></el-input>
      </el-form-item>
      <el-form-item class="operation">
        <el-checkbox v-model="checkedAll" :indeterminate="indeterminate" :disabled="!data.length" label="全选" class="margin-right"></el-checkbox>
        <el-button type="danger" :disabled="!checked.length" class="margin-right" @click="handleDelete(checked)">批量删除</el-button>
        <el-popover v-model="moveVisible" :disabled="!checked.length" placement="bottom" width="240" trigger="click">
          <el-button slot="reference" type="primary" :disabled="!checked.length">移动至<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-tree
            v-if="moveVisible"
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
            @current-change="handleMove"
          ></el-tree>
        </el-popover>
      </el-form-item>
    </el-form>
    <div class="content-body">
      <div class="content-item upload-wrap">
        <div class="content-upload" @click="handleChooseFiles">
          <i class="el-icon-upload"></i>
        </div>
      </div>
      <div v-for="item in data" :key="item._id" class="content-item" :class="{checked: checked.includes(item._id)}" @click="handleChecked(item)">
        <img :src="item.url" class="item-content"/>
        <div class="title">
          <el-tooltip :content="item.file_name" placement="top">
            <span>{{ item.file_name }}</span>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="content-foot">
      <div class="content-page-info">
          <span>共 {{ total }} 条 / 耗时 {{ duration }}s</span>
          <span class="content-page-size">
            <span>每页</span>
            <el-select v-model="pagination.pageSize" size="mini" :clearable="false" class="pagination-select" @change="handlePageSizeChange">
              <el-option v-for="item in pageSizes" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <span>条</span>
        </span>
      </div>
      <el-pagination :total="total" :current-page.sync="pagination.currentPage" :page-size="pagination.pageSize" background="background" layout="prev, pager, next, jumper" @current-change="handleCurrentChange"></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { CategoriesNodeDate } from './source-categories-tree.vue'

@Component({
  name: 'source-content'
})
export default class SourceContent extends Vue {
  @Prop({ type: Array, default: () => [10, 20, 30, 50] })
  protected pageSizes: number[]

  @Prop({ type: Object, required: true })
  protected categories: CategoriesNodeDate

  protected loading = false

  protected data = []

  protected checked = [] // 选中的素材集合

  protected moveVisible = false // “移动至”下拉框的可见性

  protected queryModel = {
    file_type: 'picture',
    file_name: ''
  }

  protected total = 0

  protected duration = 0

  protected pagination = {
    pageSize: 20,
    currentPage: 1
  }

  // 是否半选
  protected get indeterminate () {
    return this.checked.length > 0 && this.checked.length < this.data.length
  }

  protected get checkedAll () {
    if (this.data.length) {
      return this.checked.length === this.data.length
    }
    return false
  }

  protected set checkedAll (value) {
    if (value) {
      this.checked = this.data.map(item => item._id)
    } else {
      this.checked = []
    }
  }

  protected created () {
    this.refresh()
  }

  protected async refresh () {
    this.loading = true
    this.moveVisible = false
    const res = await this.$jql.system.source.querySource({
      ...this.queryModel,
      categories: this.categories._id
    }, this.pagination).finally(() => {
      this.loading = false
    })
    if (!res.code) {
      this.total = res.total
      this.duration = res.duration
      this.data = res.data
      this.checked = []
    }
  }

  protected handleCurrentChange (val) {
    this.$nextTick(() => {
      this.refresh()
    })
    this.$emit('current-page-change', val)
  }

  protected handlePageSizeChange () {
    this.pagination.currentPage = 1
    this.handleCurrentChange(this.pagination.currentPage)
  }

  protected handleChooseFiles () {
    uni.chooseImage({
      success: res => {
        if (typeof res.tempFilePaths !== 'string') {
          this.loading = true
          const uploadResult = {
            success: [],
            fail: [],
            completed: 0,
            total: res.tempFilePaths.length
          }
          res.tempFilePaths.forEach((path, index) => {
            uniCloud.uploadFile({
              filePath: path,
              cloudPath: res.tempFiles[index].name,
              onUploadProgress: (progress) => {
                console.log('onUploadProgress', progress.loaded / progress.total * 100)
              },
              success: (result) => {
                uploadResult.success.push({
                  file_name: res.tempFiles[index].name,
                  file_type: this.queryModel.file_type,
                  categories: [this.categories._id].concat(this.categories.parent_ids),
                  url: result.fileID
                })
                uploadResult.completed++
                this.createSource(uploadResult)
              },
              fail: (error) => {
                uploadResult.fail.push(error)
                uploadResult.completed++
                this.createSource(uploadResult)
              }
            })
          })
        }
      }
    })
  }

  protected async createSource (uploadResult) {
    if (uploadResult.completed === uploadResult.total) {
      const res = await this.$jql.system.source.createSource(uploadResult.success).finally(() => {
        this.loading = false
      })
      if (!res.code) {
        if (uploadResult.success.length === uploadResult.total) {
          this.$message.success('上传素材成功！')
        } else {
          this.$message.error(`共上传 ${uploadResult.total} 个素材，其中 ${uploadResult.success.length} 个成功，${uploadResult.total - uploadResult.success.length} 个失败！`)
        }
        this.refresh()
      }
    }
  }

  protected handleChecked (source) {
    if (this.checked.includes(source._id)) {
      this.checked = this.checked.filter(item => item !== source._id)
    } else {
      this.checked.push(source._id)
    }
  }

  protected handleDelete (checked: string | string[]) {
    this.$confirm(typeof checked === 'string' ? '你确定要删除该素材吗？' : '你确定要删除选中素材吗？', '提示', {
      type: 'warning'
    }).then(async () => {
      this.loading = true
      const res = await this.$jql.system.source.deleteSource(checked).finally(() => {
        this.loading = false
      })
      if (!res.code) {
        this.$message.success('删除素材成功')
        this.refresh()
      }
    }).catch(e => {
      if (e === 'cancel') {
        this.$message.info('取消删除')
      } else {
        throw e
      }
    })
  }

  protected async handleMove (categories: CategoriesNodeDate) {
    this.loading = true
    this.moveVisible = false
    const res = await this.$jql.system.source.moveSources(this.checked, categories._id).finally(() => {
      this.loading = false
    })
    if (!res.code) {
      this.$message.success('已成功将选中素材移动到指定分组')
      this.refresh()
    }
  }

  @Watch('categories')
  protected handleCategoriesChange () {
    this.refresh()
  }
}
</script>

<style lang="scss" scoped>
.source-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-right: 20px;
  .source-query {
    flex: none;
    border-bottom: 1px solid #E8E8E8;
    .operation {
      float: right;
      .margin-right {
        margin-right: 12px;
      }
    }
  }

  .content-body {
    flex-grow: 1;
    height: 0;
    padding: 5px 0;
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #E8E8E8;
    overflow-y: auto;
    .content-upload {
      box-sizing: content-box;
      width: 140px;
      height: 140px;
      border: 1px dashed $--color-text-secondary;
      text-align: center;
      line-height: 130px;
      font-size: 36px;
      color: $--color-text-secondary;
      &:hover {
        color: $--color-primary;
        border-color: $--color-primary;
        cursor: pointer;
      }
    }
    .content-item {
      padding: 9px;
      margin: 5px;
      border: 1px solid $--border-color-base;
      border-radius: 4px;
      width: 140px;
      height: 160px;
      .item-content {
        width: 140px;
        height: 140px;
      }
      .title {
        line-height: 20px;
        color: $--color-text-primary;
        font-size: 12px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &.checked {
        border: 1px solid $--color-primary;
        background-color: $--color-primary-light-9;
      }
      &.upload-wrap {
        border: none;
      }
    }
  }

  .content-foot {
    flex: none;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    color: #606266;
    font-size: 14px;
    .content-page-info {
      .content-page-size {
        padding-left: 6px;
        >span {
          padding: 0 6px;
        }
        .pagination-select {
          width: 68px;
          display: inline-block;
        }
      }
    }
  }
}
</style>
