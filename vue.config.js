module.exports = {
  publicPath: "/public",
  configureWebpack: {
    externals: {
      Quill: "Quill"
    }
  },
  devServer: {
    proxy: "http://localhost:8002"
  }
};
