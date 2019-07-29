import jwtDecode from "jwt-decode";
import { userMutationTypes } from "./mutation-types";
import { login, updatePassword } from "@/services/api/users";
import router from "@/router";
import global from "./global";

const TOKEN_KEY = global.state.TOKEN_KEY;
const token = localStorage.getItem(TOKEN_KEY);

const state = {
  userInfo: token ? jwtDecode(token).user : {}
};

const mutations = {
  [userMutationTypes.SET_USER_INFO]: (state, userInfo) => {
    state.userInfo = userInfo;
  }
};

const actions = {
  login: async ({ commit, rootState }, account) => {
    try {
      const res = await login(account);
      const token = res.data.token;

      commit(userMutationTypes.SET_USER_INFO, jwtDecode(token).user);
      localStorage.setItem(rootState.global.TOKEN_KEY, token);

      return res.data;
    } catch (err) {
      throw err;
    }
  },
  logout: ({ commit, rootState }) => {
    // TODO: 退出登录接口
    commit(userMutationTypes.SET_USER_INFO, {});
    localStorage.removeItem(rootState.global.TOKEN_KEY);
  },
  updatePassword: async ({ dispatch, rootState }, { username, data }) => {
    try {
      const res = await updatePassword(username, data);
      localStorage.removeItem(rootState.global.ACCOUNT_KEY);
      dispatch("logout");
      router.push({ name: rootState.global.routesNameMap.LOGIN });

      return res.data;
    } catch (err) {
      throw err;
    }
  }
};

export default { namespaced: true, state, mutations, actions };
