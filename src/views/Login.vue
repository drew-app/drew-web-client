<template>
  <div id="login">
    <h1>Drew-App</h1>
    <a href="#" @click="login">Log in</a>
    <a href="#">Sign up</a>
  </div>
</template>

<script>
export default {
  name: 'Login',
  methods: {
    login () {
      this.$auth.login()
    }
  }
}
</script>

<style lang='stylus' scoped>
  @require '~@/assets/stylesheets/includes'

  #login
    display flex
    flex-direction column
    justify-content center
    align-items center

    height 100vh
    width 100vw

    h1
      margin-bottom: long-space

    a
      display block
      text-decoration underline
</style>
