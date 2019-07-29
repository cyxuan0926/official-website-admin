import { Base64 } from "js-base64";
import routesNameMap from "@/router/routesNameMap";
import mutationTypes, { globalMutationTypes } from "./mutation-types";

const state = {
  TOKEN_KEY: Base64.encode("TOKEN"),
  ACCOUNT_KEY: Base64.encode("ACCOUNT"),
  routesNameMap,
  mutationTypes,
  menuVisible: false // 是否收起菜单
};

const mutations = {
  [globalMutationTypes.SET_MENU_COLLAPSE]: (state, menuVisible) => {
    state.menuVisible = menuVisible;
  }
};

const actions = {};

export default { namespaced: true, state, mutations, actions };
