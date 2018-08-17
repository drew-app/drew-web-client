<template>
  <li class="task-list-item" v-bind:class="{ done: task.done }">
    {{task.title}}
    <button class="mark-done" @click='markDone'>Done</button>
  </li>
</template>

<script>
export default {
  name: 'TaskListItem',
  props: {
    task: Object,
    required: true
  },
  methods: {
    markDone: function () {
      this.$store.dispatch('tasks/updateTask', {
        id: this.task.id,
        updatedAttributes: { done: true }
      })
    }
  }
}
</script>

<style scoped>
  .done {
    text-decoration: line-through;
  }
</style>
