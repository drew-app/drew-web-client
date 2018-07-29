<template>
  <form id="tasks--add-task" @submit.prevent="addTask">
    <label for="tasks--add-task-task-title">Add Task</label>
    <input id="tasks--add-task-task-title" v-model="task.title" name="task_title">
    <button type="submit">Save</button>
  </form>
</template>

<script>
export default {
  name: 'AddTask',
  data: function () {
    return {
      task: {
        title: ''
      }
    }
  },
  methods: {
    addTask () {
      this.$store.dispatch('tasks/addTask', {...this.$data.task})
    }
  }
}
</script>

<style scoped>

</style>
