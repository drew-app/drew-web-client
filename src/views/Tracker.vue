<template>
  <div id="tracker">
    <h1> Tracker </h1>
    <div v-if="loading" id="tracker__loading-indicator">
      Loading...
    </div>
    <div v-else>
      <div id="tracker__details">
        <h2>{{ tracker.title }}</h2>
      </div>
      <div id="tracker__actions">
        <button id="tracker__actions-add-record" @click="addRecord">Add Record</button>
      </div>
      <ul>
        <li v-for="trackerRecord in tracker.tracker_records"
            :key="trackerRecord.id"
            class="tracker-record-list-item"
        >
          Recorded at <span class="record-time">{{ trackerRecord.created_at | date-format }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tracker',
  props: {
    id: Number
  },
  computed: {
    tracker () { return this.$store.getters['trackers/find'](this.id) },
    loading () { return !this.tracker }
  },
  created () {
    this.$store.dispatch('trackers/loadTracker', this.id)
  },
  methods: {
    addRecord () { this.$store.dispatch('trackers/addTrackerRecord', this.id) }
  }
}
</script>

<style lang='stylus' scoped>
  @require '~@/assets/stylesheets/includes'
  @require '~@/assets/stylesheets/modules/button'

  button#tracker__actions-add-record
    contained-button()

  ul
    list-style: none
    margin: 0;
    margin-top: medium-space
    padding: 0;
    max-width: 64rem

    li
      padding-top: medium-space
      padding-bottom: short-space
      border-bottom: 1px solid #ccc

      &:hover
        background-color: rgba(main-color, 0.05)

</style>
