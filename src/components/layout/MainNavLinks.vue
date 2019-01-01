<template>
  <ul id="main-nav-links">
    <li>
      <a href="/" @click.prevent="nav">
        <d-icon icon="tachometer-alt"></d-icon>
        Dashboard
      </a>
    </li>
    <li>
      <a href='/tasks' @click.prevent="nav">
        <d-icon icon="tasks"></d-icon>
        Tasks
      </a>
    </li>
    <li>
      <a href="/trackers" @click.prevent="nav">
        <d-icon icon="moon"></d-icon>
        Trackers
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'main-nav-links',
  methods: {
    nav (event) {
      this.$emit('navigation')
      this.$router.push(event.target.pathname)
    }
  }
}
</script>

<style lang='stylus' scoped>
  @require '~@/assets/stylesheets/includes'

   ul
    list-style: none;
    padding: 0;

</style>
