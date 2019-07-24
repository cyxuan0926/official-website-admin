<template>
  <el-menu
    :default-active="$route.path"
    text-color="#b8c7ce"
    background-color="#222d32"
    active-text-color="#fff"
    class="layout-aside"
    :router="true"
  >
    <menu-item v-for="(item, index) in menus" :key="index" :menu="item" />
  </el-menu>
</template>

<script>
import routes from "@/router/routes";
import menuItem from "./menu-item";

export default {
  components: { menuItem },
  computed: {
    menus() {
      return routes.filter(route => route.meta.isMenu);
    }
  }
};
</script>

<style lang="scss" scoped></style>
