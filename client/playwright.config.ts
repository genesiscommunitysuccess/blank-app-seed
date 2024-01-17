export default {
  projects: [
    {
      name: 'Chrome Stable',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        ignoreHTTPSErrors: true,
      },
    },
  ],
  testMatch: '**/*.e2e.ts',
  timeout: 60000,
  webServer: {
    command: 'npm run dev:no-open',
    url: `http://localhost:${process.env.PORT}`,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: `http://localhost:${process.env.PORT}`,
  },
};
