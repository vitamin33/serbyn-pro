import { defineConfig, devices } from '@playwright/test';

// E2E harness for the consulting refactor (tests/refactor/*). Runs against a
// PRODUCTION build (`next build && next start`) so server-rendered HTML and the
// JS-disabled assertions (T2) reflect what ships. Port 3100 to avoid a dev
// server on 3000.
const PORT = 3100;

export default defineConfig({
  testDir: './tests/refactor',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 30_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: { NODE_OPTIONS: '--max-old-space-size=4096' },
  },
});
