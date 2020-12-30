export default {
  plugins: [
    '@uvue/core/plugins/asyncData',
    '@uvue/core/plugins/prefetch',
    [
      '@uvue/core/plugins/vuex',
      {
        onHttpRequest: true,
        fetch: true,
      },
    ],
    '@uvue/core/plugins/middlewares',
    '@uvue/core/plugins/errorHandler',
    '@/plugins/http-client',
  ],
  imports: [
    {
      src: '@/libs/vue-modal',
      ssr: false,
    },
    {
      src: '@/libs/v-transfer',
      ssr: false,
    },
    {
      src: '@/libs/v-tooltip',
      ssr: false,
    },
  ],
};
