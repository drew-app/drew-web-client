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
        <button id="tracker__delete" @click="deleteTracker">Delete</button>
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
    <div v-if="showDeleteConfirmation" id="tracker_delete" class="underlay">
      <div id="tracker_delete__modal">
        Delete tracker with existing records?

        <div id="tracker_delete__actions">
          <button id="tracker_delete__cancel" @click="hideDeleteConfirmation">Cancel</button>
          <button id="tracker_delete__confirm" @click="reallyDeleteTracker">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tracker',
  props: {
    id: Number
  },
  data () {
    return {
      showDeleteConfirmation: false
    }
  },
  computed: {
    tracker () { return this.$store.getters['trackers/find'](this.id) },
    loading () { return !this.tracker }
  },
  created () {
    this.$store.dispatch('trackers/loadTracker', this.id)
  },
  methods: {
    addRecord () { this.$store.dispatch('trackers/addTrackerRecord', this.id) },
    deleteTracker () {
      if (this.tracker.tracker_records.length <= 0) {
        this.reallyDeleteTracker()
      } else {
        this.showDeleteConfirmation = true
      }
    },
    reallyDeleteTracker () {
      this.$store.dispatch('trackers/destroyTracker', this.id).then(() => { this.$router.push({ path: '/trackers' }) })
      this.showDeleteConfirmation = false
    },
    hideDeleteConfirmation () {
      this.showDeleteConfirmation = false
    }
  }
}
</script>

<style lang='stylus' scoped>
  @require '~@/assets/stylesheets/includes'
  @require '~@/assets/stylesheets/modules/button'

  button
    contained-button()

  #tracker__actions
    display: grid
    grid-auto-columns: max-content
    grid-gap: medium-space

    &>* { grid-row: 1 }

  .underlay
    height: 100vh
    width: 100vw
    top: 0
    left: 0
    elevation 8

    position: fixed
    background-color: rgba(1, 1, 1, 0.8)

    display flex
    align-items center
    justify-content center

  #tracker_delete__modal
    padding: 2rem
    background-color: white;
    height max-content
    width max-content

    #tracker_delete__actions
      display: grid
      grid-auto-columns: max-content
      grid-gap: medium-space
      justify-content end

      &>* { grid-row: 1 }

      margin-top long-space

      button#tracker_delete__confirm
        flat-button()

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
