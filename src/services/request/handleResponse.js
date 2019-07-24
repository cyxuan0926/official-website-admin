import { Message } from "element-ui";
import store from "@/store";
import router from "@/router";

const tip = (message = "操作失败！", type = "error") => {
  Message({ type, message, duration: 3000, showClose: true });
};

/**
 * egg.js 异常状态码
 * 422: egg-validate 校验异常
 */

const responseHandlers = {
  // 200: res => {
  //   const type = res.data.code === 0 ? "success" : "error";
  //   tip(res.data.msg, type);
  // },
  // 201: res => {},
  // 204: res => {},
  400: res => {
    tip(res.data.message);
  },
  // 参数校验异常
  422: res => {
    tip(res.data.message);
  },
  401: res => {
    tip(res.data.message);
    store.dispatch("user/logout");
    router.push({ name: store.state.routesNameMap.LOGIN });
  },
  403: res => {
    tip(res.data.msg);
  },
  404: res => {
    tip(res.data.msg);
  },
  500: () => tip("服务器内部错误")
};

export default res => {
  console.log("res", res);
  const handler = responseHandlers[res.status];
  handler && handler(res);
  // const type = res.data.code === 0 ? "success" : "error";
  // tip(res.data.msg, type);
};
