import axios from "axios";
import Cookies from "js-cookie";
import store from "@/store";
import config from "./config";
import handleResponse from "./handleResponse";

const instance = axios.create(config);

instance.interceptors.request.use(
  config => {
    config.headers["x-csrf-token"] = Cookies.get("csrfToken");
    config.headers["Authorization"] =
      "Bearer " + localStorage.getItem(store.state.global.TOKEN_KEY);
    return config;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  response => {
    handleResponse(response);
    return response;
  },
  error => {
    error.response && handleResponse(error.response);
    return Promise.reject(error);
  }
);

export function get(url = "", params = {}) {
  return instance.request({ url, method: "GET", params });
}

export function post(url = "", data = {}) {
  return instance.request({ url, method: "POST", data });
}

export function put(url = "", data = {}) {
  return instance.request({ url, method: "PUT", data });
}

export function _delete(url = "", data = {}) {
  return instance.request({ url, method: "DELETE", data });
}

export function postFile(url = "", file) {
  const formData = new FormData();

  formData.append("file", file);

  return instance.request({
    url,
    method: "POST",
    data: formData,
    headers: { "content-type": "multipart/form-data" }
  });
}
