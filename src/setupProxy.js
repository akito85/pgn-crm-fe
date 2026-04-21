const { createProxyMiddleware } = require("http-proxy-middleware");

const isApiRequest = (req) => {
  const accept = req.headers.accept || "";
  const fetchDest = req.headers["sec-fetch-dest"] || "";
  return !accept.includes("text/html") && fetchDest !== "document";
};

module.exports = function (app) {
  console.log("=== Setting up proxy middleware ===");

  // Proxy untuk /rbi ke backend lokal (hapus prefix /rbi)
  app.use(
    "/rbi",
    createProxyMiddleware({
      target: "https://macbooks-macbook-pro.tail0d919a.ts.net/",
      changeOrigin: true,
      secure: false,
      logLevel: "debug",
      pathRewrite: {
        "^/rbi": "", // /rbi/v1/... -> /v1/...
      },
    })
  );

  // Proxy untuk service lain ke dev-energy
  app.use(
    ["/mst", "/acc", "/inv", "/payment", "/rpt", "/ntf", "/service"],
    createProxyMiddleware({
      target: "https://dev-energy.pgn.co.id",
      changeOrigin: true,
      secure: false,
      logLevel: "debug",
      bypass: (req) => {
        if (!isApiRequest(req)) {
          return req.url;
        }
        return null;
      },
      headers: {
        Connection: "keep-alive",
      },
      onProxyReq: (proxyReq, req) => {
        // Forward original host
        proxyReq.setHeader("X-Forwarded-Host", req.headers.host);
      },
    })
  );

  app.use(
    ["/um"],
    createProxyMiddleware({
      target: "http://10.129.2.197",
      changeOrigin: true,
      secure: false,
      logLevel: "debug",
      headers: {
        Connection: "keep-alive",
      },
      onProxyReq: (proxyReq, req) => {
        // Forward original host
        proxyReq.setHeader("X-Forwarded-Host", req.headers.host);
      },
    })
  );

  console.log("=== Proxy middleware configured! ===");
};