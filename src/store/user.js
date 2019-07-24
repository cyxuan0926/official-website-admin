import jwtDecode from "jwt-decode";
import { Base64 } from "js-base64";
import { userMutationTypes } from "./mutation-types";
import { login } from "@/services/api/users";

const TOKEN_KEY = Base64.encode("token");
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
      localStorage.setItem(rootState.TOKEN_KEY, token);

      return res.data;
    } catch (err) {
      throw err;
    }
  },
  logout: ({ commit, rootState }) => {
    // TODO: 退出登录接口
    commit(userMutationTypes.SET_USER_INFO, {});
    localStorage.removeItem(rootState.TOKEN_KEY);
  }
};

export default { namespaced: true, state, mutations, actions };
