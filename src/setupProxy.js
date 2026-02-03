const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  
  // Proxy untuk module PAYMENT → LOCAL
  app.use(
    '/payment',
    createProxyMiddleware({
      target: 'http://localhost:8905',
      changeOrigin: true,
      pathRewrite: {
        "^/payment": "", // hapus prefix /payment di FE
      },
      secure: false,
    })
  );

  // Proxy untuk module lainnya → SERVER 10.129.2.197
  app.use(
    '/um',
    createProxyMiddleware({
      target: 'https://dev-energy.pgn.co.id',
      changeOrigin: true,
    })
  );
};
