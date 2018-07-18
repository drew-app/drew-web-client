<template>
  <div id="tasks">
    <ol>
      <li v-for="task in tasks" :key="task.id">
        {{task.title}}
      </li>
    </ol>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'tasks',
  computed: mapState({
    tasks: state => state.tasks.all
  }),
  created () {
    this.$store.dispatch('tasks/loadAll')
  }
}
</script>

<style scoped>

</style>
