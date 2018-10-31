<template>
  <div id="tasks">
    <div id="tasks__main-wrapper">
      <app-header/>
      <div id="tasks__main">
        <h1>Tasks</h1>
        <div class="filters">
          <label><input id="tasks__show-done" type='checkbox' v-model="showDone"/> Show done</label>
          <label><input id="tasks__focus-started" type="checkbox" v-model="focusStarted"/> Focus started</label>
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
  components: { AppHeader, AddTask, TaskList },
  data: function () {
    return {
      showDone: false,
      focusStarted: false
    }
  },
  computed: {
    tasks () {
      const options = { includeDone: this.$data.showDone }
      if (this.$data.focusStarted) { options['started'] = true }

      return this.$store.getters['tasks/search'](options)
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
    #tasks__main
      padding: long-space

    #tasks__details
      elevation(8)

      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      overflow: scroll;

    .filters
      margin: long-space 0

      label
        margin-right: 1rem;
</style>
