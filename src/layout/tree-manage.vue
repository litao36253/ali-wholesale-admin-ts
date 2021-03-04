<template>
  <div class="tree-manage-wrap">
    <div class="tree-manage-side">
      <div class="tree-manage-side-title">系统菜单</div>
      <div class="tree-manage-side-content">
        
      </div>
    </div>
    <div class="form-wrap">
      <div class="form-title" v-html="formTitle"></div>
      <div class="form">
        
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>
  .tree-manage-wrap {
    overflow: hidden;
    background: $--color-white;
    border-radius: 3px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    .tree-manage-side {
      height: 100%;
      width: 320px;
      flex: none;
      background-color: #FAFAFA;
      border-right: 1px solid #E8E8E8;
      display: flex;
      flex-direction: column;
      .tree-manage-side-title {
        height: 46px;
        border-bottom: 1px solid #E8E8E8;
        padding-left: 20px;
        line-height: 46px;
        color: #3A3C3E;
        font-size: 14px;
        font-weight: bold;
        flex: none;
      }
      .tree-manage-side-content {
        flex: 1;
        overflow: auto;
        padding: 20px 12px;
      }
    }
    .form-wrap {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      padding-left: 60px;
      .form-title {
        height: 46px;
        border-bottom: 1px solid #E8E8E8;
        line-height: 46px;
        color: #3A3C3E;
        font-size: 14px;
        font-weight: bold;
        flex: none;
      }
      .form {
        flex: 1;
        padding-top: 20px;
        width: 500px;
      }
    }
  }
</style>
