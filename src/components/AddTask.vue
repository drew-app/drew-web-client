<template>
  <form id="add-task" @submit.prevent="addTask" @click="focusNewTask">
    <input v-model="taskInput" ref="task-input" name="task-input" placeholder="New task">
    <div class='actions'>
      <button type="submit">Save</button>
    </div>
  </form>
</template>

<script>
import { excludeHashTags, getHashTags } from '@/lib/hashtag'

export default {
  name: 'AddTask',
  props: {
    newTaskContext: { type: Object, default: () => ({}) }
  },
  data: function () {
    return {
      taskInput: ''
    }
  },
  methods: {
    addTask: function () {
      const input = this.$data.taskInput
      const newTaskContext = this.$props.newTaskContext

      let task = {
        title: excludeHashTags(input),
        focused: !!newTaskContext.focused
      }

      let tags = getHashTags(input)
      if (newTaskContext.tag && !tags.includes(newTaskContext.tag)) {
        tags.push(newTaskContext.tag)
      }

      this.$store.dispatch('tasks/addTask', { task, tags })
      this.$data.taskInput = ''
    },
    focusNewTask () {
      this.$refs['task-input'].focus()
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
