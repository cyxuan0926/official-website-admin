import Vue from "vue";
import Router from "vue-router";
import NProgress from "nprogress";
import routes from "./routes";
import store from "@/store";

Vue.use(Router);
NProgress.configure({ showSpinner: false });

const router = new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  routes
});

const whiteList = ["/account", "/account/login"];

// 登陆校验
router.beforeEach((to, from, next) => {
  NProgress.start();

  if (!whiteList.includes(to.path)) {
    if (localStorage.getItem(store.state.global.TOKEN_KEY)) {
      next();
    } else {
      next({ name: store.state.global.routesNameMap.LOGIN });
    }
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
