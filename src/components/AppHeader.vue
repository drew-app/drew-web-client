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
  name: 'MainNav'
}
</script>

<style scoped lang="stylus">
  @require '~@/assets/stylesheets/includes'

  #app-header
    display: flex;
    justify-content: space-between

    align-items: baseline;

    padding: long-space;
    background-color: main-color;

    #app-header__logo { font-size: 2rem }

    a { color: text-on-main-color }
</style>
