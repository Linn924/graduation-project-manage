module.exports = {
    publicPath: './',
    chainWebpack: config => {
        config.set('externals', {
          'vue': 'Vue',
          'vue-router': 'VueRouter',
          'vuex': 'Vuex',
          'axios': 'axios',
          'element-ui': 'ELEMENT',
          'echarts':'echarts'
        })
    },
    // devServer: {
    //   proxy: {
    //     '/api': {
    //       target: 'https://aip.baidubce.com',
    //       changeOrigin: true
    //     }
    //   }
    // },
}