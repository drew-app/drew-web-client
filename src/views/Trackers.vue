<template>
  <div id="trackers">
    <h1>Trackers</h1>
    <div class="actions">
      <router-link to="/trackers/new" id="trackers__new-tracker">New Tracker</router-link>
    </div>
    <ol>
      <li v-for="tracker in trackers"
          :key="tracker.id"
          class="tracker-list-item"
          @click="$router.push(`/trackers/${tracker.id}`)"
          :data-id="tracker.id"
      >
        <div class="title">
          {{tracker.title}}
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Trackers',
  computed: {
    ...mapGetters({ trackers: 'trackers/all' })
  },
  created () {
    this.$store.dispatch('trackers/loadAll')
  }
}
</script>

<style lang='stylus' scoped>
  @require '~@/assets/stylesheets/includes'
  @require '~@/assets/stylesheets/modules/button'

  #trackers__new-tracker
    contained-button()

  .actions
    margin-top: long-space

  ol
    list-style: none
    margin: 0;
    margin-top: medium-space
    padding: 0;
    max-width: 64rem

    li
      padding-top: medium-space
      padding-bottom: short-space
      border-bottom: 1px solid #ccc
      cursor: pointer;

      &:hover
        background-color: rgba(main-color, 0.05)
</style>
