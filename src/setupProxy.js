// const { createProxyMiddleware } = require("http-proxy-middleware");

// module.exports = function (app) {
//   console.log("=== Setting up proxy middleware ===");

//   // Proxy untuk /rbi ke backend lokal (hapus prefix /rbi)
//   app.use(
//     "/rbi",
//     createProxyMiddleware({
//       target: "http://localhost:8906",
//       changeOrigin: true,
//       secure: false,
//       logLevel: "debug",
//       pathRewrite: {
//         "^/rbi": "", // /rbi/v1/... -> /v1/...
//       },
//     })
//   );

//   // Proxy untuk service lain ke dev-energy
//   app.use(
//     ["/um", "/mst", "/acc", "/invoice", "/payment", "/rpt", "/ntf", "/service"],
//     createProxyMiddleware({
//       target: "https://dev-energy.pgn.co.id",
//       changeOrigin: true,
//       secure: false,
//       logLevel: "debug",
//       headers: {
//         Connection: "keep-alive",
//       },
//       onProxyReq: (proxyReq, req) => {
//         // Forward original host
//         proxyReq.setHeader("X-Forwarded-Host", req.headers.host);
//       },
//     })
//   );

//   console.log("=== Proxy middleware configured! ===");
// };
