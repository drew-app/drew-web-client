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

<style scoped>
</style>
