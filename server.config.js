export default {
  plugins: [
    '@uvue/server/plugins/gzip',
    '@uvue/server/plugins/serverError',
    '@uvue/server/plugins/static',
    '@uvue/server/plugins/modernBuild',
    [
      '@uvue/server/plugins/cookie',
      {
        secret: 'c29tZWNvb2tpZW1jaHNpbmNpZGVudHNlY3JldGtleQ==',
      },
    ],
  ],
};
