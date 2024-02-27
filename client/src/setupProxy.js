const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/user", // This is the api prefix you want to proxy to the backend
    createProxyMiddleware({
      target: process.env.REACT_APP_LOCAL_HOST_URL, // Use the environment variable
      changeOrigin: true,
    })
  );
};
