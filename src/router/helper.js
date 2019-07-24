/**
 * 动态加载组件
 * @param {String} path 组件相对于@/views目录的路径
 */
export const dynamicImport = path => () => import(`@/views/${path}`);
