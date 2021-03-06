import { deepCopy } from "@/common/helper";
import { articleMutationTypes } from "./mutation-types";
import { getArticles, getArticleTypes } from "@/services/api/articles";
import { deleteFiles } from "@/services/api/files";

const state = {
  articles: [],
  articleTypes: [],
  filesToDelete: []
};

const mutations = {
  [articleMutationTypes.SET_ARTICLES]: (state, articles) => {
    state.articles.splice(0);
    state.articles.push(...articles);
  },
  [articleMutationTypes.SET_ARTICLE_TYPES]: (state, articleTypes) => {
    state.articleTypes = articleTypes;
  },
  [articleMutationTypes.SET_FILES_TO_DELETE]: (state, files) => {
    state.filesToDelete = files;
  }
};

const actions = {
  getArticles: async ({ commit }, query) => {
    try {
      const res = await getArticles(query);
      commit(articleMutationTypes.SET_ARTICLES, res.data.data);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  getArticleTypes: async ({ commit }) => {
    try {
      const res = await getArticleTypes();
      commit(articleMutationTypes.SET_ARTICLE_TYPES, res.data);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  addFileToDelete: ({ commit, state }, file) => {
    const filesToDelete = deepCopy(state.filesToDelete);
    filesToDelete.push(file);
    commit(articleMutationTypes.SET_FILES_TO_DELETE, filesToDelete);
  },
  clearFilesToDelete: ({ commit }) => {
    commit(articleMutationTypes.SET_FILES_TO_DELETE, []);
  },
  deleteFilesUnused: async ({ dispatch, state }) => {
    if (state.filesToDelete.length > 0) {
      try {
        await deleteFiles(state.filesToDelete);
        dispatch("clearFilesToDelete");
        return true;
      } catch (err) {
        throw err;
      }
    }
  }
  // updateArticle: async ({ dispatch }, { article_id, data }) => {
  //   try {
  //     await updateArticle(article_id, data);
  //     // const articles = deepCopy(state.articles);
  //     // articles.forEach(article => {
  //     //   if (article.article_id === article_id) {
  //     //     article = Object.assign({}, article, data);
  //     //   }
  //     // });
  //     // commit(articleMutationTypes.SET_ARTICLES, articles);

  //     // return articles;
  //     return true;
  //   } catch (err) {
  //     throw err;
  //   }
  // },
  // updateArticleBatch: async ({ dispatch }, articlesToUpdate) => {
  //   await updateArticleBatch(articlesToUpdate);
  //   // const articles = deepCopy(state.articles);
  //   // articles.forEach(article => {
  //   //   const target = articlesToUpdate.find(
  //   //     item => item.article_id === article.article_id
  //   //   );

  //   //   article = Object.assign({}, article, target);
  //   // });
  //   // commit(articleMutationTypes.SET_ARTICLES, articles);

  //   // return articles;
  //   return true;
  // }
};

export default { namespaced: true, state, mutations, actions };
