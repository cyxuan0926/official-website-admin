import Vue from "vue";
import ElementUI from "element-ui";
import App from "./app.vue";
import router from "./router";
import store from "./store";

import "element-ui/lib/theme-chalk/index.css";
import "./styles/index.scss";

Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
