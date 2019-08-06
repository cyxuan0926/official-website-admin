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

const errorHandlers = {
  400: res => {
    tip(res.data.message);
  },
  401: res => {
    tip(res.data.message);
    store.dispatch("user/logout");
    router.push({ name: store.state.global.routesNameMap.LOGIN });
  },
  403: res => {
    tip(res.data.msg);
  },
  404: res => {
    tip(res.data.msg);
  },
  // 参数校验异常
  422: res => {
    tip(res.data.message);
  },
  500: () => tip("服务器内部错误")
};

// const successHandler = res => {
//   // TODO
//   console.log("successHandler", res);
// };

const success = status => /^2/.test(status);

export default res => {
  if (success(res.status)) {
    // successHandler(res);
  } else {
    const handler = errorHandlers[res.status];
    handler && handler(res);
  }
};
