<template>
  <nav id="main-nav">
    <ul>
      <li><a href="/">Dashboard</a></li>
      <li><a href="/tasks">Tasks</a></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'MainNav'
}
</script>

<style scoped>
  ul {
    display: flex;
    flex-direction: row;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ul li {
    margin: 0 1rem 0 0;
  }
</style>
