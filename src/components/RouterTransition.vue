<template>
  <transition
    :name="transitionName"
    :mode="transitionMode">
    <slot/>
  </transition>
</template>

<script>
const DEFAULT_TRANSITION_NAME = 'fade'
const DEFAULT_TRANSITION_MODE = 'out-in'

export default {
  name: 'RouterTransition',
  data () {
    return {
      transitionName: DEFAULT_TRANSITION_NAME,
      transitionMode: DEFAULT_TRANSITION_MODE
    }
  },
  created () {
    this.$router.beforeEach((to, from, next) => {
      let transitionMode = DEFAULT_TRANSITION_MODE
      let transitionName = DEFAULT_TRANSITION_NAME

      if (to.meta.detailView) {
        transitionMode = 'in-out'
        transitionName = 'slide-in-from-right'
      }

      if (from.meta.detailView) {
        transitionMode = 'in-out'
        transitionName = 'slide-out-to-right'
      }

      this.transitionName = transitionName
      this.transitionMode = transitionMode

      next()
    })
  }
}
</script>

<style lang='stylus' scoped>
  @require '~@/assets/stylesheets/includes'

</style>
