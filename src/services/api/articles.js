import { get, post, put } from "../request";

export function getArticle(article_id) {
  return get(`/articles/${article_id}`);
}

export function getArticles(query) {
  const defaultParams = {
    article_title: "",
    article_type_id: "",
    article_status: "",
    start_time: "",
    end_time: "",
    page_num: 1,
    page_size: 10
  };

  return get("/articles", Object.assign({}, defaultParams, query));
}

export function getArticleTypes() {
  return get("/article_types");
}

export function createArticle(article) {
  return post("/articles", article);
}

export function updateArticle(article_id, article) {
  return put(`/articles/${article_id}`, article);
}

export function updateArticleBatch(articles) {
  return put(`/articles`, articles);
}
