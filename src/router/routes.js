import { dynamicImport } from "./helper";
import routesNameMap from "./routesNameMap";

export default [
  {
    path: "/",
    redirect: { name: routesNameMap.ARTICLE_ALL },
    meta: { isMenu: false }
  },
  {
    name: routesNameMap.ACCOUNT,
    path: "/account",
    redirect: { name: routesNameMap.LOGIN },
    component: dynamicImport("account/account"),
    meta: { title: "账户", isMenu: false },
    children: [
      {
        name: routesNameMap.LOGIN,
        path: "/account/login",
        component: dynamicImport("account/account-login"),
        meta: { title: "登录", layoutVisible: false }
      }
    ]
  },
  {
    name: routesNameMap.ARTICLE,
    path: "/article",
    redirect: { name: routesNameMap.ARTICLE_ALL },
    component: dynamicImport("article/article"),
    meta: { title: "文章管理", icon: "el-icon-document", isMenu: true },
    children: [
      {
        name: routesNameMap.ARTICLE_ALL,
        path: "/article/all",
        component: dynamicImport("article/article-all"),
        meta: { title: "全部文章", isMenu: true }
      },
      {
        name: routesNameMap.ARTICLE_CREATE,
        path: "/article/create",
        props: { operate: "CREATE" },
        component: dynamicImport("article/article-detail"),
        meta: { title: "添加文章", isMenu: true }
      },
      {
        name: routesNameMap.ARTICLE_UPDATE,
        path: "/article/:article_id",
        props: { operate: "UPDATE" },
        component: dynamicImport("article/article-detail"),
        meta: { title: "修改文章", isMenu: false }
      }
    ]
  },
  {
    name: routesNameMap.CONTACTS,
    path: "/contacts",
    component: dynamicImport("contacts/contacts-all"),
    meta: { title: "联系方式管理", icon: "el-icon-mobile-phone", isMenu: true }
  }
  // {
  //   path: "*",
  //   redirect: { name: routesNameMap.ARTICLE_ALL },
  //   meta: { isMenu: false }
  // }
];
