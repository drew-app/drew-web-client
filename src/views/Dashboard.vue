<template>
  <div id="dashboard">
    <h1>Dashboard</h1>
    <h2>Focused Tasks</h2>
    <task-list v-if='tasks.length' :tasks="tasks"></task-list>
    <p class="empty" v-else>No active tasks</p>
  </div>
</template>

<script>
import TaskList from '@/components/TaskList'

export default {
  name: 'dashboard',
  components: { TaskList },
  computed: {
    tasks () { return this.$store.getters['tasks/focused'] }
  },
  created () {
    this.$store.dispatch('tasks/loadAll')
  }
}
</script>

<style lang="stylus" scoped>
  @require '~@/assets/stylesheets/includes'
</style>
