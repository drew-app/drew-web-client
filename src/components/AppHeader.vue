<template>
  <header id="app-header">
    <router-link to="/" id="app-header__logo">Drew-App</router-link>
    <nav>
      <router-link to="/tasks">Tasks</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped lang="stylus">
  @require '~@/assets/stylesheets/includes'
  @require '~@/assets/stylesheets/modules/app-bar'

  #app-header
    app-bar()

    display: flex;
    justify-content: space-between

    align-items: baseline;

    #app-header__logo { font-size: 2rem }

    a { color: text-on-main-color }
</style>
