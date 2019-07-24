import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";
import store from "@/store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

const whiteList = ["/account", "/account/login"];

// TODO: Nprogress

// 登陆校验
router.beforeEach((to, from, next) => {
  console.log("inWhiteList", !whiteList.includes(to.path));
  console.log("isLoged", localStorage.getItem(store.state.TOKEN_KEY));

  if (!whiteList.includes(to.path)) {
    if (localStorage.getItem(store.state.TOKEN_KEY)) {
      next();
    } else {
      next({ name: store.state.routesNameMap.LOGIN });
    }
  } else {
    next();
  }
});

export default router;
