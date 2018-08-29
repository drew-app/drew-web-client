<template>
  <header id="app-header">
    <a id="app-header__logo" href="/">Drew-App</a>
    <nav>
      <a href="/tasks">Tasks</a>
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
