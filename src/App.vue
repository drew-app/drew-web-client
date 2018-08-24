<template>
  <div id="app">
    <app-header/>
    <div id="main">
      <router-view/>
    </div>
  </div>
</template>
<script>
import AppHeader from '@/components/AppHeader.vue'

export default {
  name: 'drew-app',
  components: {
    AppHeader
  }
}
</script>

<style lang="stylus">
  @require '~@/assets/stylesheets/includes'

  #app
    #main { padding: long-space; }

</style>
