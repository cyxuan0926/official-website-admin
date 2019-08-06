import { Base64 } from "js-base64";
import routesNameMap from "@/router/routesNameMap";
import { globalMutationTypes } from "./mutation-types";

const state = {
  TOKEN_KEY: Base64.encode("TOKEN"),
  ACCOUNT_KEY: Base64.encode("ACCOUNT"),
  menuVisible: false, // 是否收起菜单
  routesNameMap
};

const mutations = {
  [globalMutationTypes.SET_MENU_COLLAPSE]: (state, menuVisible) => {
    state.menuVisible = menuVisible;
  }
};

const actions = {
  toggleMenuVisible: ({ commit, state }) => {
    commit(globalMutationTypes.SET_MENU_COLLAPSE, !state.menuVisible);
  }
};

export default { namespaced: true, state, mutations, actions };
