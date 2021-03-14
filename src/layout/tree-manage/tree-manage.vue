<template>
  <div class="tree-manage-wrap">
    <div class="tree-manage-side">
      <div class="tree-manage-side-title">{{ sideTitle }}</div>
      <div class="tree-manage-side-content">
        <slot name="side-content"></slot>
      </div>
    </div>
    <div class="tree-manage-body">
      <div class="tree-manage-body-title">{{ bodyTitle }}</div>
      <div class="tree-manage-body-content">
        <slot name="body-content"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'tree-manage'
})
export default class TreeManage extends Vue {
  @Prop(String)
  protected sideTitle: string // 侧标题

  @Prop(String)
  protected bodyTitle: string // 主体标题
}
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
      // background-color: #FAFAFA;
      border-right: 1px solid #E8E8E8;
      display: flex;
      flex-direction: column;
      .tree-manage-side-title {
        height: 46px;
        border-bottom: 1px solid #E8E8E8;
        padding-left: 20px;
        line-height: 46px;
        color: #3A3C3E;
        font-size: 16px;
        font-weight: bold;
        flex: none;
      }
      .tree-manage-side-content {
        flex: 1;
        overflow: auto;
        padding: 20px 12px;
      }
    }
    .tree-manage-body {
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      padding-left: 20px;
      .tree-manage-body-title {
        height: 46px;
        border-bottom: 1px solid #E8E8E8;
        line-height: 46px;
        color: #3A3C3E;
        font-size: 16px;
        font-weight: bold;
        flex: none;
      }
      .tree-manage-body-content {
        flex: 1;
        padding-top: 20px;
      }
    }
  }
</style>
