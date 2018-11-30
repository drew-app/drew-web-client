<template>
  <div id="main-nav">
    <div class="underlay">
      <nav class="content">
        <d-icon id="main-nav__close" @click.prevent="closeMenu" icon="bars"></d-icon>
        <div id="main-nav__user-nav">
          <user-nav></user-nav>
        </div>
        <hr/>
        <div id="main-nav__section-nav">
          <main-nav-links @navigation="closeMenu"/>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import UserNav from '@/components/layout/UserNav'
import MainNavLinks from '@/components/layout/MainNavLinks'

export default {
  name: 'MainNav',
  components: { MainNavLinks, UserNav },
  methods: {
    closeMenu () {
      this.$emit('closeMenu')
    }
  }
}
</script>

<style lang='stylus' scoped>
  @require '~@/assets/stylesheets/includes'

  #main-nav__close
    font-size: 2rem;

  #main-nav__user-nav
    margin-top: long-space

  .underlay
    height: 100vh
    width: 100vw
    top: 0
    left: 0
    elevation 8

    position: fixed
    background-color: rgba(1, 1, 1, 0.8)

  .content
    background: white
    height: 100vh
    width: 80vw
    top: 0
    left: 0
    padding: long-space
    box-sizing: border-box

    hr
      clear: both

  #main-nav__section-nav ul
    list-style: none;
    padding: 0;

</style>
