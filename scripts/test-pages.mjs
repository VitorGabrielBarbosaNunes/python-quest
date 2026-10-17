import { spawnSync } from 'node:child_process';
const env = { ...process.env, PAGES_BASE_PATH: '/python-quest/', CI: 'true' };
for (const args of [
  ['node_modules/vite/bin/vite.js', 'build'],
  ['node_modules/@playwright/test/cli.js', 'test', 'e2e/journey.spec.js', 'e2e/pages.spec.js'],
]) {
  const result = spawnSync(process.execPath, args, { env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
