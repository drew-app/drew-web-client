<template>
  <div id="user-nav">
    <div id="user-nav__header">
      <img class="avatar" :src="avatarUrl">
      <span class="nickname">{{ name }}</span>
    </div>
    <div id="user-nav__actions">
      <a href='#' @click.prevent="$auth.logout"><d-icon icon="sign-out"></d-icon> Log Out</a>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'UserNav',
  computed: {
    ...mapState({
      name: state => state.user.name,
      avatarUrl: state => state.user.avatarUrl
    })
  }
}
</script>

<style lang='stylus' scoped>
  @require '~@/assets/stylesheets/includes'

  #user-nav__header
    display: flex;

    .avatar
      max-height: 2rem
      max-width: 2rem
      margin-right: medium-space

    .nickname
      font-size: 1.5rem;

  #user-nav__actions
    margin-top: medium-space
</style>
