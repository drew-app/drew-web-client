<template>
  <li class="task-list-item"
      v-bind:class="{ done: task.done, focused: task.focused, tagged: !!task.tags }"
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
      <button class="mark-done" @click.stop='markDone'><d-icon icon="check" icon-style='fas' size="lg"></d-icon></button>
      <button v-if="!task.focused" class="focus" @click.stop='markFocused'><d-icon icon="star" size="lg"></d-icon></button>
      <button v-else class='unfocus' @click.stop='markUnfocused'><d-icon icon='star' icon-style='fas' size="lg"></d-icon></button>
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
    markFocused () { this._updateTask({ focused: true }) },
    markUnfocused () { this._updateTask({ focused: false }) },
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

    button.focus,
    button.unfocus,
    button.mark-done
      margin-left: 0.25rem;
      &:first-child {
        margin-left: 0
      }

    button.focus,
    button.unfocus
      flat-icon-button()

    button.mark-done
      contained-icon-button()

    &.done {
      text-decoration: line-through;
    }
    &.focused {
      background-color: rgba(orange, 0.2);
    }

</style>
