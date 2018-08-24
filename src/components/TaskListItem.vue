<template>
  <li class="task-list-item" v-bind:class="{ done: task.done, started: started }">
    <div class="title">
      {{task.title}}
    </div>
    <div v-if="!task.done" class="actions">
      <button class="mark-done" @click='markDone'>Done</button>
      <button v-if="!started" class="start" @click='start'>Start</button>
      <button v-else class="stop" @click='stop'>Stop</button>
    </div>
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

<style lang="stylus" scoped>
  @require '~@/assets/stylesheets/modules/button'

  li.task-list-item
    .title { font-size: 1.2rem; }
    .actions { text-align: right; }

    button.start,
    button.stop,
    button.mark-done
      margin-left: 0.25rem;
      &:first-child { margin-left: 0 }

    button.start,
    button.stop
      outlined-button()

    button.mark-done
      contained-button()

    &.done { text-decoration: line-through; }
    &.started { color: orange; }

</style>
