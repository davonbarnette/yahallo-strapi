module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '05f4233d7cf4e4a71867ee8781ced0c8'),
  },
  watchIgnoreFiles: [
    "**/card-borders/**",
    "**/print-assets/**"
  ]
});
