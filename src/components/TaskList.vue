<template>
  <ol class="task-list">
    <li is="task-list-item"
        v-for="task in tasks"
        :key="task.id"
        v-bind:task="task"
    ></li>
  </ol>
</template>

<script>
import TaskListItem from '@/components/TaskListItem'

export default {
  name: 'TaskList',
  components: { TaskListItem },
  props: {
    tasks: Array
  }
}
</script>

<style lang="stylus" scoped>
  @require '~@/assets/stylesheets/includes'

  ol.task-list
    list-style: none;
    margin: 0;
    padding: 0;
    max-width: 64rem;

    li
      padding-top: medium-space;
      padding-bottom: short-space;
      border-bottom: 1px solid #ccc;
</style>
