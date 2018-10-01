import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEdit)

export default {
  install: function (Vue, options) {
    Vue.component('font-awesome-icon', FontAwesomeIcon)
  }
}
