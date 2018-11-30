<template>
  <font-awesome-icon v-on="$listeners" :icon="['fal', icon]"></font-awesome-icon>
</template>

<script>
export default {
  name: 'DIcon',
  props: ['icon']
}
</script>

<style lang='stylus' scoped>
  @require '~@/assets/stylesheets/includes'

</style>
