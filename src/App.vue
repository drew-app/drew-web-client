<template>
  <div id="app">
    <div id="header-wrapper">
      <transition name="fade" mode="out-in">
        <router-view name="header"/>
      </transition>
    </div>
    <div id="main">
      <router-transition>
        <router-view name="main"/>
      </router-transition>
    </div>
  </div>
</template>
<script>
import RouterTransition from '@/components/RouterTransition'

export default {
  name: 'drew-app',
  components: {
    RouterTransition
  }
}
</script>

<style lang="stylus">
  @require '~@/assets/stylesheets/includes'

  #app
    #main, #header-wrapper
      position: relative;
      display: grid;

      & > *
        grid-row: 1
        grid-column: 1

    #header-wrapper
      background-color: main-color;
      elevation(4)
</style>
