<template>
  <modal
    :name="modalName"
    :class="modalName"
    :click-to-close="false"
    adaptive
    width="100%"
    height="100%"
    @before-open="beforeOpen"
  >
    <div class="icon-close close-modal" @click="$modal.hide(modalName)" />
    <div class="modal-content">
      modal-content
    </div>
  </modal>
</template>

<script>
import moment from 'moment';

export default {
  name: 'confirmation-modal',
  data: () => ({
    params: {},
  }),
  props: {
    name: {
      type: String,
    },
  },
  computed: {
    date() {
      return (date) => moment(date * 1000).format('DD.MM.YYYY HH:mm');
    },
    modalName() {
      return this.name || this.$options.name;
    },
  },
  methods: {
    beforeOpen({ params }) {
      this.params = params;
      window.onkeydown = ({ key }) => {
        if (key === 'Escape') {
          window.onkeydown = null;
          this.$modal.hide(this.modalName);
        }
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
