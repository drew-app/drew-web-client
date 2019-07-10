<template>
  <font-awesome-icon v-on="$listeners" :icon="[iconStyle, icon]" :size="size"></font-awesome-icon>
</template>

<script>
export default {
  name: 'DIcon',
  props: {
    icon: { type: String },
    iconStyle: { type: String, default: 'fal' },
    size: { type: String }
  }
}
</script>

<style lang='stylus' scoped>
  @require '~@/assets/stylesheets/includes'

</style>
