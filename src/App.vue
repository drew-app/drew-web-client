<template>
  <div id="app">
    <div id="main">
      <transition name='fade' mode='out-in'>
        <router-view/>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  name: 'drew-app'
}
</script>

<style lang="stylus">
</style>
