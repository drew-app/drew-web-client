import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faEdit as falEdit,
  faBars as falBars,
  faTasks as falTasks,
  faSignOut as falSignOut,
  faTachometerAlt as falTachometerAlt,
  faMoon as falMoon,
  faStar as falStar
} from '@fortawesome/pro-light-svg-icons'

import {
  faStar as fasStar,
  faCheck as fasCheck
} from '@fortawesome/pro-solid-svg-icons'

library.add(falEdit, falBars, falTasks, falSignOut, falTachometerAlt, falMoon, falStar, fasStar, fasCheck)

export default {
  install: function (Vue, options) {
    Vue.component('font-awesome-icon', FontAwesomeIcon)
  }
}
