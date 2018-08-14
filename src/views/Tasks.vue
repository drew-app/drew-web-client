<template>
  <div id="tasks">
    <h1>Tasks</h1>
    <label>Show done <input type='checkbox' v-model="showDone"/></label>
    <ol id="tasks--list">
      <li v-for="task in tasks" :key="task.id" v-bind:class="{done: task.done}">
        {{task.title}}
        <button name='mark_done' @click='markDone(task.id)'>Done</button>
      </li>
    </ol>
    <add-task/>
  </div>
</template>

<script>
import AddTask from '../components/AddTask'

export default {
  name: 'tasks',
  components: {AddTask},
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
  methods: {
    markDone: function (id) {
      this.$store.dispatch('tasks/updateTask', {
        id: id,
        updatedAttributes: {done: true}
      })
    }
  },
  created () {
    this.$store.dispatch('tasks/loadAll')
  }
}
</script>

<style scoped>
  .done { text-decoration: line-through;}
</style>
