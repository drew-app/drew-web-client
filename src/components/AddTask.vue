<template>
  <form id="add-task" @submit.prevent="addTask" @click="focusNewTask">
    <input v-model="task.title" ref="task_title" name="task_title" placeholder="New task">
    <div class='actions'>
      <button type="submit">Save</button>
    </div>
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
      this.$data.task = { title: '' }
    },
    focusNewTask () {
      this.$refs['task_title'].focus()
    }
  }
}
</script>

<style lang="stylus" scoped>
  @require '~@/assets/stylesheets/includes'
  @require '~@/assets/stylesheets/modules/button'

  #add-task
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: -(short-space);
    padding: short-space;
    max-width: 64rem;
    box-sizing: border-box;
    border-bottom: 1px dashed #ccc;

    input
      font-size: 1.2rem;
      flex: 1 1 600px;
      border: none;
      margin-left: -5px;

    .actions
      text-align: right;
      white-space: nowrap;
      flex: 1 1 180px;
      margin-top: short-space;

      button
        contained-button()

</style>
