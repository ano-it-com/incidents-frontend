<template>
  <section
    v-show="isActive"
    :aria-hidden="!isActive"
    :class="$options.name"
    role="tabpanel"
  >
    <slot />
  </section>
</template>

<script>
export default {
  name: 'tab-item-component',
  props: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    count: Number,
  },
  data: () => ({
    isActive: false,
  }),
};
</script>
