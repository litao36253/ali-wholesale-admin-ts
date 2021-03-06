<template>
  <el-scrollbar class="side-bar-container" :class="{ 'is-collapse': collapse }">
    <!-- <vab-logo /> -->
    <el-menu
      background-color="rgb(40, 44, 52)"
      text-color="#fff"
      active-text-color="#fff"
      :default-active="activeMenu"
      :collapse="collapse"
      @select="handleSelect"
    >
      <template v-for="item in menuData">
        <SubMenu
          v-if="item.children"
          :menu-info="item"
          :key="item.path"
        />
        <MenuItem
          v-else
          :key="item.path"
          :menu-info="item"
        />
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import SubMenu from './components/sub-menu.vue'
import MenuItem from './components/menu-item.vue'

export default {
  name: 'side-bar',
  components: { SubMenu, MenuItem },
  data () {
    return {
      collapse: false,
      menuData: []
    }
  },
  created () {
    this.menuData = this.getMenuData(this.$router.options.routes)
  },
  computed: {
    activeMenu () {
      const { path } = this.$route
      if (path === '/index') {
        return '/'
      }
      return path
    }
  },
  methods: {
    getMenuData (routes) {
      const menuData = []
      routes.forEach(item => {
        if (!item.meta?.hideInMenu) {
          const newItem = { ...item }
          delete newItem.children
          if (item.children) {
            newItem.children = this.getMenuData(item.children)
            if (!newItem.children.length) {
              delete newItem.children
            }
          }
          newItem.meta = newItem.meta || {}
          menuData.push(newItem)
        }
      })
      return menuData
    },
    handleSelect (index, indexPath) {
      const isActive = this.$route.matched.some(item => item.regex.test(index))
      !isActive && this.$router.push(index)
    }
  }
}
</script>
<style lang="scss" scoped>
  @mixin active {
    &:hover {
      color: $--color-white;
      background-color: mix($--color-white, $--color-primary, 30%) !important;
    }

    &.is-active {
      color: $--color-white;
      background-color: $--color-primary !important;
    }
  }

  .side-bar-container {
    width: 256px;
    height: 100%;
    overflow: hidden;
    background: $--menu-background;
    box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    transition: width 0.3s;

    &.is-collapse {
      width: 65px;
      border-right: 0;
      ::v-deep {
        .el-menu {
          transition: width 0.3s;
        }
        .el-menu--collapse {
          border-right: 0;
          .el-submenu__icon-arrow {
            right: 10px;
            margin-top: -3px;
          }
        }
      }
    }

    ::v-deep {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .el-menu {
        border: 0;
      }

      .el-menu-item,
      .el-submenu__title {
        @include active;
        overflow: hidden;
        line-height: 52px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: sub;
        height: auto;
        i {
          color: $--color-white;
        }
      }

      .el-menu-item {
        @include active;
      }
    }
  }
</style>
