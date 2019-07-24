<template>
  <el-submenu
    v-if="menu.children"
    :index="menu.path"
    :show-timeout="100"
    :hide-timeout="100"
  >
    <template slot="title">
      <i :class="menu.meta.icon"></i>
      <span>{{ menu.meta.title }}</span>
    </template>
    <menu-item
      v-for="(child, index) in menu.children"
      :key="index"
      :index="child.path"
      :menu="child"
    >
      {{ child.meta.title }}
      <template v-if="child.children">
        <menu-item v-for="(el, i) in child.children" :key="i" :menu="el" />
      </template>
    </menu-item>
  </el-submenu>
  <el-menu-item v-else :index="menu.path">
    <i :class="menu.meta.icon"></i>
    <span slot="title">{{ menu.meta.title }}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: "MenuItem",
  props: {
    menu: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
