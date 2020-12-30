<template>
  <div :class="[$options.name, { 'column-view': column }]">
    <div :class="[code, { bordered }]" class="incident-status-type" v-text="title" />
    <div v-if="timeToLeave !== 0" :class="{ 'red': diff <= 0 }" class="incident-status-time">
      {{ this.hours | oncePad }}:{{ this.minutes | oncePad }}
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'incident-status',
  props: {
    code: String,
    title: String,
    createdAt: Number,
    timeToLeave: Number,
    bordered: Boolean,
    column: Boolean,
  },
  data: () => ({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    diff: null,
  }),
  watch: {
    timeToLeave(value) {
      if (value === 0) {
        if (this.timer) {
          clearInterval(this.timer);
          return;
        }
      }

      this.reinitialize();
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  created() {
    if (this.timeToLeave <= 0) return;

    this.initialize();
  },
  methods: {
    initialize() {
      if (!this.createdAt) return;
      const summary = Math.floor((this.createdAt + this.timeToLeave) * 1000);
      // moment.now() + (this.ttl * 1000);
      const self = this;

      const timerFunction = () => {
        const now = moment.now();
        const diff = summary - now;
        self.diff = diff;
        self.days = Math.abs(
          Math.floor((diff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 60)),
        );
        self.hours = Math.abs(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        self.minutes = Math.abs(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
        // self.seconds = Math.abs(Math.floor((diff % (1000 * 60)) / 1000));

        if (diff < 0) {
          self.hours -= 1;
          self.minutes -= 1;
          // self.seconds -= 1;
        }
      };

      timerFunction();
      this.timer = setInterval(timerFunction, 60000);
    },
    reinitialize() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.initialize();
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
