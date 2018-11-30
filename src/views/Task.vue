<template>
  <div id="task">
    <header>
      <a id="task__back" @click.once="$router.go(-1)">◀</a>
      <div class="actions">
        <a id="task__edit" @click="startEdit">
          <d-icon icon="edit"></d-icon>
        </a>
      </div>
    </header>
    <div id="task__main">
      <div v-if="!task" id="task__loading-indicator">
        Loading...
      </div>
      <form v-else-if="editing" id="task__edit-form" @submit.prevent="updateTask">
        <div class="field">
          <label>Title</label>
          <input name="title" v-model="formData.title" v-focus>
        </div>
        <div class="actions">
          <button>Save</button>
        </div>
      </form>
      <div v-else id="task__details">
        <h2>{{task.title}}</h2>
        <div class="created-at">
          <label>Created At</label>
          <span>{{ task.created_at | date-format }}</span>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'Task',
  props: {
    id: Number
  },
  data () {
    return {
      editing: false,
      formData: {}
    }
  },
  computed: {
    task () { return this.$store.getters['tasks/find'](this.id) }
  },
  created () {
    this.$store.dispatch('tasks/loadTask', this.id)
  },
  directives: {
    focus: {
      inserted (el) { el.focus() }
    }
  },
  methods: {
    startEdit () {
      this.editing = true
      this.formData = {
        title: this.task.title
      }
    },
    updateTask () {
      this.$store.dispatch('tasks/updateTask', {id: this.task.id, updatedAttributes: this.formData})
      this.editing = false
    }
  }
}
</script>

<style lang="stylus" scoped>
  @require '~@/assets/stylesheets/includes'
  @require '~@/assets/stylesheets/modules/app-bar'
  @require '~@/assets/stylesheets/modules/button'

  #task
    min-height: 100vh;
    background-color: white
    box-sizing: border-box

    header
      app-bar('simple')
      display: flex;
      justify-content: space-between;

      .actions
        text-align: right;
  #task__main
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

    #task__edit-form
      .field
        label, input
          display: block;
          width: 100%;

      .actions
        margin-top: long-space;
        button
          contained-button()
</style>
