import Vue from "vue";
import ElementUI from "element-ui";
import App from "./app";
import router from "./router";
import store from "./store";
import * as filters from "@/common/filters";

import "element-ui/lib/theme-chalk/index.css";
import "./styles/index.scss";
import "nprogress/nprogress.css";

Vue.use(ElementUI);
Vue.config.productionTip = false;

// 全局过滤器
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
