module.exports = {
  pluginOptions: {
    s3Deploy: {
      assetPath: 'dist',
      bucket: 'drew-app-webclient',
      region: 'us-east-2',
      pwa: false,
      enableCloudfront: true,
      uploadConcurrency: 5,
      cloudfrontId: 'E5NWXFQKDXAWE',
      cloudfrontMatchers: '/*',
      deployPath: '/'
    }
  }
}
