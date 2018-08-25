<template>
  <li class="task-list-item" v-bind:class="{ done: task.done, started: task.started }">
    <div class="title">
      {{task.title}}
    </div>
    <div v-if="!task.done" class="actions">
      <button class="mark-done" @click='markDone'>Done</button>
      <button v-if="!task.started" class="start" @click='start'>Start</button>
      <button v-else class="stop" @click='stop'>Stop</button>
    </div>
  </li>
</template>

<script>
export default {
  name: 'TaskListItem',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  methods: {
    _updateTask: function (updateAttrs) {
      this.$store.dispatch('tasks/updateTask', {
        id: this.task.id,
        updatedAttributes: updateAttrs
      })
    },
    markDone: function () { this._updateTask({ done: true }) },
    start: function () { this._updateTask({ started: true }) },
    stop: function () { this._updateTask({ started: false }) }
  }
}
</script>

<style lang="stylus" scoped>
  @require '~@/assets/stylesheets/modules/button'

  li.task-list-item
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: -(short-space);
    padding: short-space;

    .title {
      font-size: 1.2rem;
      flex: 1 1 32rem;
    }
    .actions {
      text-align: right;
      white-space: nowrap;
      flex: 1 1 auto;
      margin-top: short-space;
    }

    button.start,
    button.stop,
    button.mark-done
      margin-left: 0.25rem;
      &:first-child { margin-left: 0 }

    button.start,
    button.stop
      outlined-button()
      width: 5.25rem;

    button.mark-done
      contained-button()

    &.done { text-decoration: line-through; }
    &.started {
      background-color: rgba(orange, 0.2);
    }

</style>
