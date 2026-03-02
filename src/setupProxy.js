const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/um",
    createProxyMiddleware({
      target: "http://10.129.2.197",
      changeOrigin: true,
    })
  );
};
