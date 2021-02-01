<template>
  <el-menu-item
    :index="menuInfo.path"
  >
    <i v-if="menuInfo.meta.icon" :class="menuInfo.meta.icon"></i>
    <span>{{ menuInfo.meta.title }}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: 'menu-item',
  props: {
    menuInfo: {
      type: Object,
      required: true
    }
  }
}
</script>
