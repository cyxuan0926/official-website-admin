import Vue from "vue";
import Vuex from "vuex";
import { Base64 } from "js-base64";
import user from "./user";
import routesNameMap from "@/router/routesNameMap";

Vue.use(Vuex);

// 全局状态
const state = {
  routesNameMap,
  TOKEN_KEY: Base64.encode("token")
};

export default new Vuex.Store({
  state,
  modules: { user }
});
