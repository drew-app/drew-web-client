<template>
  <header id="back-header">
    <a @click.once="$router.go(-1)">◀</a>
  </header>
</template>

<script>
export default {
  name: 'BackHeader'
}
</script>

<style lang="stylus" scoped>
  @require '~@/assets/stylesheets/includes'
  @require '~@/assets/stylesheets/modules/app-bar'

  #back-header
    app-bar()

    a
      font-size: 2rem
      color: text-on-main-color

</style>
