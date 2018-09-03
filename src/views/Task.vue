<template>
  <div id="task">
    <h2>{{task.title}}</h2>
    <div class="created-at">
      <label>Created At</label>
      <span>{{ createdAt }}</span>
    </div>
    <div class="description">
      <label>Description</label>
      <span v-if="task.description">{{task.description}}</span>
      <span v-else class="empty">No description</span>
    </div>
    <div class="data">
      <label>Data</label>
      <span>{{task}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Task',
  props: ['id'],
  computed: {
    task () {
      return this.$store.getters['tasks/find'](parseInt(this.id)) || {}
    },
    createdAt () {
      return new Date(this.task.created_at).toLocaleString()
    }
  },
  created () {
    this.$store.dispatch('tasks/loadTask', this.id)
  }
}
</script>

<style lang="stylus" scoped>
  @require '~@/assets/stylesheets/includes'

  #task
    background-color: white
    box-sizing: border-box

    padding: long-space

    & > div
      margin-bottom: medium-space

    label
      color: dark-color

    .empty
      color: rgba(black, 0.7)

    .created-at
      display: flex
      justify-content: space-between

    .description span, .data span
      display: block
</style>
