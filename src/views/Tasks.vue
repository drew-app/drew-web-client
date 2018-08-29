<template>
  <div id="tasks">
    <div id="tasks__main">
      <h1>Tasks</h1>
      <div class="filters">
        <label>Show done <input id="show-done" type='checkbox' v-model="showDone"/></label>
      </div>
      <task-list v-bind:tasks="tasks"/>
      <add-task/>
    </div>
    <router-view/>
  </div>
</template>

<script>
import AddTask from '@/components/AddTask'
import TaskList from '@/components/TaskList'

export default {
  name: 'tasks',
  components: {AddTask, TaskList},
  data: function () {
    return {
      showDone: false
    }
  },
  computed: {
    tasks () {
      if (this.$data.showDone) {
        return this.$store.getters['tasks/all']
      } else {
        return this.$store.getters['tasks/todo']
      }
    }
  },
  created () {
    this.$store.dispatch('tasks/loadAll')
  }
}
</script>

<style lang="stylus" scoped>
  @require '~@/assets/stylesheets/includes'

  #tasks
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;

    & > * {
      grid-row: 1;
      grid-column: 1;
    }

    #tasks__main { padding: long-space; }
    .filters { margin: long-space 0; }
</style>
