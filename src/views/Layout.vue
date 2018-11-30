<template>
  <div id="main-layout__wrapper">
    <div id="main-layout__main-nav">
      <transition name="slide-in-from-left-with-underlay" mode="in-out" duration="500">
        <main-nav v-if="open"  @closeMenu="toggleMenu"></main-nav>
      </transition>
    </div>
    <div id="main-layout">
      <slot name="app-bar">
        <header id="main-layout__app-header">
          <mq-layout :mq="['mobile', 'tablet']" style="display: inline-block;">
            <d-icon id="main-layout__main-nav-launch" @click.prevent="toggleMenu" icon="bars"></d-icon>
          </mq-layout>
          <router-link to="/" id="main-layout__app-header-logo">Drew-App</router-link>
        </header>
      </slot>
      <div id="main-layout__main-content-wrapper" :class="$mq | mq({desktop: 'grid'})">
        <mq-layout mq="desktop+">
          <nav id="main-layout__desktop-nav">
            <user-nav></user-nav>
            <div id="main-layout__desktop-nav-section-nav">
              <main-nav-links></main-nav-links>
            </div>
          </nav>
        </mq-layout>
        <div id="main-layout__main-content">
          <transition name='fade' mode='out-in'>
            <router-view></router-view>
          </transition>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import MainNav from '@/components/layout/MainNav'
import UserNav from '@/components/layout/UserNav'
import MainNavLinks from '@/components/layout/MainNavLinks'

export default {
  name: 'Layout',
  components: { MainNavLinks, UserNav, MainNav },
  data () { return { open: false } },
  methods: {
    toggleMenu () {
      this.$data.open = !this.$data.open
    }
  }
}
</script>

<style lang='stylus' scoped>
  @require '~@/assets/stylesheets/includes'
  @require '~@/assets/stylesheets/modules/app-bar'

  #main-layout
    min-height: 100vh
    display: grid
    grid-auto-rows: 83px 1fr

  #main-layout__app-header
    app-bar()

    #main-layout__app-header-logo
      font-size: 2rem

    #main-layout__main-nav-launch
      font-size: 2rem
      margin-right: long-space

  #main-layout__main-content-wrapper
    &.grid {
      display: grid
      grid-template-columns: 20rem 1fr
    }

  #main-layout__desktop-nav
    padding: long-space
    padding-right: 0
    border-right: 1px solid gray
    margin-right: long-space
    height: 100%

  #main-layout__desktop-nav-section-nav
    border-top: 1px solid gray
    margin-top: long-space
    padding-top: long-space

  #main-layout__main-content
    padding: long-space
</style>
