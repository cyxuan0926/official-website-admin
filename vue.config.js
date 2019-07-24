module.exports = {
  configureWebpack: {
    externals: {
      Quill: "Quill"
    }
  },
  devServer: {
    proxy: "http://localhost:7001"
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:7001",
    //     bypass: function(req) {
    //       console.log("bypass2", req.url, req.method);
    //     }
    //   },
    //   "/public": {
    //     target: "http://localhost:7001",
    //     bypass: function(req) {
    //       console.log("bypass3", req.url, req.method);
    //     }
    //   }
    // }
  }
};
