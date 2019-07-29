const globalMutationTypes = {
  SET_MENU_COLLAPSE: "SET_MENU_COLLAPSE"
};

const userMutationTypes = {
  SET_USER_INFO: "SET_USER_INFO"
};

const articleMutationTypes = {
  SET_ARTICLES: "SET_ARTICLES",
  SET_ARTICLE_TYPES: "SET_ARTICLE_TYPES"
};

const contactsMutationTypes = {
  SET_CONTACTS: "SET_CONTACTS"
};

export {
  globalMutationTypes,
  userMutationTypes,
  articleMutationTypes,
  contactsMutationTypes
};

export default {
  ...globalMutationTypes,
  ...userMutationTypes,
  ...articleMutationTypes,
  ...contactsMutationTypes
};
