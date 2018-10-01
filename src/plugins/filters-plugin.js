export default {
  install: function (Vue, options) {
    let filterContext = require.context('@/filters', true, /-filter\.(js)/)
    filterContext.keys().forEach((key) => {
      let filterString = key.replace('./', '').replace('-filter.js', '')
      let filterFunc = require(`@/filters/${filterString}-filter.js`).default
      Vue.filter(filterString, filterFunc)
    })
  }
}
