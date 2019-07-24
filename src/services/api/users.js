import { post } from "../request";

export function login(data) {
  return post("/oauth/token", data);
}
