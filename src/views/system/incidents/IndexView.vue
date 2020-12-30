<template>
  <div :class="$options.name">
    <router-view />
    <router-view name="side-view" />
  </div>
</template>

<script>
export default {
  name: 'incidents-index-view',
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/partials/params";
  @import "~@/styles/partials/mixins";

.incidents-index-view {
  width: 100%;
}
</style>
