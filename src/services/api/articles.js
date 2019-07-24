import { post } from "../request";

export function createArticle(data) {
  return post("/articles", data);
}
