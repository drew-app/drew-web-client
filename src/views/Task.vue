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
      <div v-if="!loaded" id="task__loading-indicator">
        Loading...
      </div>
      <form v-else-if="editing" id="task__edit-form" @submit.prevent="updateTask">
        <div class="field">
          <label>Title</label>
          <input name="title" v-model="formData.title" v-focus>
        </div>
        <div class="field">
          <label>Description</label>
          <textarea name="description" v-model="formData.description"></textarea>
        </div>
        <div class="field">
          <label>Tags</label>
          <vue-multiselect
            name="tags"
            v-model="formData.tags"
            track-by="name"
            label="name"
            :options="tags"
            :multiple="true"
            :close-on-select="false"
            :taggable="true"
            @tag="addTag"
            @open="multiSelectOpen = true"
            @close="multiSelectOpen = false"
          ></vue-multiselect>
        </div>
        <div class="actions">
          <button>Save</button>
        </div>
      </form>
      <div v-else id="task__details">
        <h2>{{task.title}}</h2>
        <div class="tags">
          <div class="tags">
            <span class="tag"
                  v-for="tag in task.tags"
                  :data-tag-name="tag.name"
                  :key="tag.name">
              {{ tag.name }}
            </span>
          </div>
        </div>
        <div class="created-at">
          <label>Created At</label>
          <span>{{ task.created_at | date-format }}</span>
        </div>
        <div class="description">
          <label>Description</label>
          <div v-if="task.description">
            <vue-markdown :source="task.description"></vue-markdown>
          </div>
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
import VueMarkdown from 'vue-markdown'
import VueMultiselect from 'vue-multiselect'
import { newTag } from '@/store/tags'
import { omit } from 'lodash'
import TaskList from '../components/TaskList'

export default {
  name: 'Task',
  props: {
    id: Number
  },
  components: {
    TaskList,
    VueMultiselect,
    VueMarkdown
  },
  data () {
    return {
      editing: false,
      formData: {},
      multiSelectOpen: false
    }
  },
  computed: {
    task () { return this.$store.getters['tasks/find'](this.id) },
    tags () { return [...this.$store.getters['tags/all']] },
    loaded () { return !!this.task && !!this.tags }
  },
  created () {
    this.$store.dispatch('tasks/loadTask', this.id)
    this.$store.dispatch('tags/loadAll')
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
        title: this.task.title,
        description: this.task.description,
        tags: this.task.tags
      }
    },
    updateTask () {
      const tags = this.formData['tags']
      const updatedAttributes = omit(this.formData, 'tags')
      this.$store.dispatch('tasks/updateTask', { id: this.task.id, updatedAttributes, tags })
      this.editing = false
    },
    addTag (tagName) {
      const newTagObj = newTag({ name: tagName })
      this.formData.tags.push(newTagObj)
      this.tags.push(newTagObj)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @require '~@/assets/stylesheets/includes'
  @require '~@/assets/stylesheets/modules/app-bar'
  @require '~@/assets/stylesheets/modules/form'

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

    .tags
      margin-bottom: long-space

    .tag
      display: inline
      background-color: #ddd
      color: #222
      padding: 0.25rem 0.5rem
      font-size: 0.8rem
      border-radius: 0.75rem
      margin-right: short-space

    #task__edit-form
      base-form()

      .multiselect:focus-within
        elevation(3)
</style>
