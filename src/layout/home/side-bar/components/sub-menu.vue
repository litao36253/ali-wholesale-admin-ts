<template>
  <el-submenu :index="menuInfo.path">
    <template v-slot:title>
      <span>
        <i v-if="menuInfo.meta.icon" :class="menuInfo.meta.icon"></i>
        <span>{{ menuInfo.meta.title }}</span>
      </span>
    </template>

    <template v-for="item in menuInfo.children">
      <MenuItem v-if="!item.children"
        :key="item.path"
        :menu-info="item"
      />
      <sub-menu v-else
        :key="item.path"
        :index="item.path"
        :menu-info="item"
      />
    </template>
  </el-submenu>
</template>

<script>
import MenuItem from './menu-item.vue'
export default {
  name: 'sub-menu',
  components: { MenuItem },
  props: {
    menuInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>
