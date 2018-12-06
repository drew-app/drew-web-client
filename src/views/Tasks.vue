<template>
  <div id="tasks">
    <h1>Tasks</h1>
    <div class="filters">
      <label><input id="tasks__show-done" type='checkbox' v-model="showDone"/> Show done</label>
      <label><input id="tasks__focus-started" type="checkbox" v-model="focusStarted"/> Focus started</label>
      <button v-if="showClearTagFilter" class="clear-tag-filter" @click="clearTagFilter">Clear Tag Filter</button>
    </div>
    <task-list :tasks="tasks"/>
    <add-task/>
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
import { mapGetters } from 'vuex'

export default {
  name: 'tasks',
  components: { AddTask, TaskList },
  computed: {
    ...mapGetters({ tasks: 'tasks/search' }),
    _taskSearchObject () { return this.$store.state.tasks.search },
    showDone: {
      get () { return this._taskSearchObject.includeDone },
      set () { this.$store.commit('tasks/filterDone') }
    },
    focusStarted: {
      get () { return this._taskSearchObject.started },
      set () { this.$store.commit('tasks/filterStarted') }
    },
    showClearTagFilter () { return !!this._taskSearchObject.tagName },
    showDetails () { return this.$route.matched.length > 2 }
  },
  created () {
    this.$store.dispatch('tasks/loadAll')
  },
  methods: {
    clearTagFilter () { this.$store.commit('tasks/filterTagName') }
  }
}
</script>

<style lang="stylus" scoped>
  @require '~@/assets/stylesheets/includes'
  @require '~@/assets/stylesheets/modules/button'

  button.clear-tag-filter
    outlined-button()

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
