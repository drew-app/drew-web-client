<template>
  <div id="dashboard">
    <app-header/>
    <div id="dashboard__main">
      <h1>Dashboard</h1>
    </div>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader'

export default {
  name: 'dashboard',
  components: {AppHeader}
}
</script>

<style lang="stylus" scoped>
  @require '~@/assets/stylesheets/includes'

  #dashboard__main
    padding: long-space;
</style>
