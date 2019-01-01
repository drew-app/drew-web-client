import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEdit, faBars, faTasks, faSignOut, faTachometerAlt, faMoon } from '@fortawesome/pro-light-svg-icons'

library.add(faEdit, faBars, faTasks, faSignOut, faTachometerAlt, faMoon)

export default {
  install: function (Vue, options) {
    Vue.component('font-awesome-icon', FontAwesomeIcon)
  }
}
