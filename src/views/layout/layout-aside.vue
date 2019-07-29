<template>
  <el-menu
    :default-active="$route.path"
    text-color="#b8c7ce"
    background-color="#222d32"
    active-text-color="#fff"
    class="layout-aside"
    :router="true"
    :collapse="$store.state.global.menuVisible"
  >
    <menu-item v-for="(item, index) in menus" :key="index" :menu="item" />
  </el-menu>
</template>

<script>
import { deepCopy } from "@/common/helper";
import routes from "@/router/routes";
import menuItem from "./menu-item";

const filterRoutes = routes => {
  const _routes = routes.filter(route => route.meta.isMenu);

  routes.splice(0);
  routes.push(..._routes);

  routes.forEach(route => {
    if (route.children && route.children.length > 0) {
      filterRoutes(route.children);
    }
  });
};

const _routes = deepCopy(routes);

filterRoutes(_routes);

export default {
  components: { menuItem },
  data() {
    return { menus: _routes };
  }
};
</script>
