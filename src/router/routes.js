import { dynamicImport } from "./helper";
import routesNameMap from "./routesNameMap";

export default [
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
        meta: { title: "登录", hideLayout: true }
      },
      {
        name: routesNameMap.PASSWORD,
        path: "/account/password",
        component: dynamicImport("account/account-password-edit"),
        meta: { title: "修改密码" }
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
        meta: { title: "全部文章" }
      },
      {
        name: routesNameMap.ARTICLE_CREATE,
        path: "/article/create",
        component: dynamicImport("article/article-create"),
        meta: { title: "添加文章" }
      }
    ]
  },
  {
    name: routesNameMap.CONTACTS,
    path: "/contacts",
    component: dynamicImport("contacts/contacts-all"),
    meta: { title: "联系方式管理", icon: "el-icon-mobile-phone", isMenu: true }
  }
];
