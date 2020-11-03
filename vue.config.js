const BASE_URL = process.env.NODE_ENV === 'production'
? '/whutp/'
: '/';
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath:BASE_URL,
  pwa: {
    name: '培养方案分析',
    themeColor: '#35a0da',
    msTileColor: '#35a0da',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: '#35a0da',
    // configure the workbox plugin
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern: new RegExp('whutp'),
          handler: 'NetworkFirst',
          options: {
            networkTimeoutSeconds: 20,
            cacheName: 'api-cache',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    }
}
}
