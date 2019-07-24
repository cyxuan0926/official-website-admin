<template>
  <div class="layout-header">
    <h1>国科股份</h1>
    <div class="user">
      <h2>{{ $store.state.user.userInfo.username }}</h2>
      <i class="el-icon-switch-button" @click="onLogout" />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions(["user/logout"]),
    async onLogout() {
      try {
        await this.$confirm("确定退出登录吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        await this.$store.dispatch("user/logout");
        this.$router.push({ name: this.$store.state.routesNameMap.LOGIN });
      } catch (err) {
        console.log("cancel logout", err);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  color: #fff;
  background-color: #3c8dbc;

  h1 {
    width: 230px;
    text-align: center;
    font-size: 20px;
  }

  .user {
    display: flex;
    height: 100%;
    line-height: 50px;

    h2 {
      height: 100%;
      padding: 0 10px;
      cursor: pointer;

      &:hover {
        background-color: #367fa9;
      }
    }

    i {
      width: 50px;
      height: 100%;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
      cursor: pointer;

      &:hover {
        background-color: #367fa9;
      }
    }
  }
}
</style>
