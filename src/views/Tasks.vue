<template>
  <div id="tasks">
    <div id="tasks__main-wrapper">
      <app-header/>
      <div id="tasks__main">
        <h1>Tasks</h1>
        <div class="filters">
          <label>Show done <input id="show-done" type='checkbox' v-model="showDone"/></label>
        </div>
        <task-list v-bind:tasks="tasks"/>
        <add-task/>
      </div>
    </div>
    <transition name="slide-in-from-right" mode="in-out">
      <div v-if="showDetails" id="tasks__details">
        <router-view/>
      </div>
    </transition>
  </div>
</template>

<script>
import AddTask from '@/components/AddTask'
import TaskList from '@/components/TaskList'
import AppHeader from '@/components/AppHeader'

export default {
  name: 'tasks',
  components: {AppHeader, AddTask, TaskList},
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
    },
    showDetails () {
      return this.$route.matched.length > 1
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
    display: grid
    grid-template-columns: 1fr
    grid-template-rows: 1fr

    #tasks__main-wrapper, #tasks__details
      grid-column: 1
      grid-row: 1

    #tasks__main
      padding: long-space

    #tasks__details
      elevation(8)

    .filters
      margin: long-space 0
</style>
