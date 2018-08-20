<template>
  <li class="task-list-item" v-bind:class="{ done: task.done, started: started }">
    {{task.title}}
    <button class="mark-done" @click='markDone'>Done</button>
    <button v-if="!started" class="start" @click='start'>Start</button>
    <button v-else class="stop" @click='stop'>Stop</button>
  </li>
</template>

<script>
export default {
  name: 'TaskListItem',
  data: function () {
    return {
      started: false
    }
  },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  methods: {
    markDone: function () {
      this.$store.dispatch('tasks/updateTask', {
        id: this.task.id,
        updatedAttributes: { done: true }
      })
    },
    start: function () { this.started = true },
    stop: function () { this.started = false }
  }
}
</script>

<style scoped>
  .done {
    text-decoration: line-through;
  }
  .started {
    color: orange;
  }
</style>
