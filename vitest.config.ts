import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    workspace: [
      {
        test: {
          browser: {
            enabled: true,
            provider: 'playwright',
            instances: [
              { browser: 'chromium', headless: true },
              { browser: 'firefox', headless: true },
              { browser: 'webkit', headless: true },
            ],
          },
        },
      },
    ],
  },
})
