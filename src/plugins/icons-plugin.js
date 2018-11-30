import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faBars, faTasks, faSignOut, faTachometerAlt } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEdit, faBars, faTasks, faSignOut, faTachometerAlt)

export default {
  install: function (Vue, options) {
    Vue.component('font-awesome-icon', FontAwesomeIcon)
  }
}
