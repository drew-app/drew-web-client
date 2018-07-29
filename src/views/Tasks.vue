<template>
  <div id="tasks">
    <ol id="tasks--list">
      <li v-for="task in tasks" :key="task.id">
        {{task.title}}
      </li>
    </ol>
    <add-task/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AddTask from '../components/AddTask'

export default {
  name: 'tasks',
  components: {AddTask},
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
