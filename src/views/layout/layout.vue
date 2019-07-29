<template>
  <div id="app" class="layout">
    <el-container>
      <el-header v-show="layoutVisible" height="50px">
        <layout-header />
      </el-header>
      <el-container>
        <el-aside v-show="layoutVisible" width="230px">
          <layout-aside />
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import layoutHeader from "./layout-header";
import layoutAside from "./layout-aside";

export default {
  components: { layoutHeader, layoutAside },
  data() {
    return {
      layoutVisible: false
    };
  },
  watch: {
    "$route.meta.layoutVisible": {
      immediate: true,
      handler() {
        this.layoutVisible = this.$route.meta.layoutVisible !== false;
      }
    }
  }
};
</script>
