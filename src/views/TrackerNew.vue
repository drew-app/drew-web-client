<template>
  <div id="tracker-new">
    <h1>New Tracker</h1>
    <form @submit.prevent="addTracker">
      <div class="field">
        <label>Title</label>
        <input name="title" v-model="formData.title" v-focus>
      </div>
      <div class="actions">
        <button>Save</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'TrackersNew',
  data () {
    return {
      formData: { title: '' }
    }
  },
  directives: {
    focus: {
      inserted (el) { el.focus() }
    }
  },
  methods: {
    addTracker () {
      this.$store.dispatch('trackers/addTracker', this.formData).then(() =>
        this.$router.push({ path: '/trackers' })
      )
    }
  }
}
</script>

<style lang='stylus' scoped>
  @require '~@/assets/stylesheets/includes'
  @require '~@/assets/stylesheets/modules/form'

  form
    base-form()

</style>
