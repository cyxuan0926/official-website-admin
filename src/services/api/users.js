import { post, put } from "../request";

export function login(data) {
  return post("/oauth/token", data);
}

export function updatePassword(username, data) {
  return put(`/users/${username}/password`, data);
}
