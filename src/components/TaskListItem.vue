<template>
  <li class="task-list-item"
      v-bind:class="{ done: task.done, started: task.started, tagged: !!task.tags }"
      @click='openDetails'
  >
    <div class="title">
      {{task.title}}
    </div>
    <div class="tags">
      <span class="tag"
            v-for="tag in task.tags"
            :data-tag-name="tag.name"
            :key="tag.name"
            @click.stop="filterTag(tag)">
        {{ tag.name }}
      </span>
    </div>
    <div v-if="!task.done" class="actions">
      <button class="mark-done" @click.stop='markDone'>Done</button>
      <button v-if="!task.started" class="start" @click.stop='start'>Start</button>
      <button v-else class="stop" @click.stop='stop'>Stop</button>
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
    _updateTask (updateAttrs) {
      this.$store.dispatch('tasks/updateTask', {
        id: this.task.id,
        updatedAttributes: updateAttrs
      })
    },
    markDone () { this._updateTask({ done: true }) },
    start () { this._updateTask({ started: true }) },
    stop () { this._updateTask({ started: false }) },
    openDetails () { this.$router.push({ path: `/tasks/${this.task.id}` }) },
    filterTag (tag) { this.$store.commit('tasks/filterTagName', tag.name) }
  }
}
</script>

<style lang="stylus" scoped>
  @require '~@/assets/stylesheets/modules/button'

  li.task-list-item
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: short-space;
    cursor: pointer;

    &:hover {
      background-color: rgba(main-color, 0.05)
    }

    .tag {
      display: inline
      background-color: #ddd
      color: #222
      padding: 0.25rem 0.5rem
      font-size: 0.8rem
      border-radius: 0.75rem
      margin-right: short-space
    }

    .title {
      font-size: 1.2rem;
      flex: 1 1 100%;
    }
    .tags {
      align-self: flex-end;
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
      &:first-child {
        margin-left: 0
      }

    button.start,
    button.stop
      outlined-button()
      width: 5.25rem;

    button.mark-done
      contained-button()

    &.done {
      text-decoration: line-through;
    }
    &.started {
      background-color: rgba(orange, 0.2);
    }

</style>
