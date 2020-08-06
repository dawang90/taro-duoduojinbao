module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://api-gw.haojingke.com/index.php',
          changeOrigin: true,
          pathRewrite: {'^/api' : ''}
        }
      }
    }
  }
}
