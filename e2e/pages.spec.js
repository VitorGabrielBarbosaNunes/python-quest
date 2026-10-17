import { test, expect } from '@playwright/test';

test('arquivos e Python carregam dentro do caminho de publicação', async ({ page, baseURL }) => {
  const basePath = new URL(baseURL).pathname;
  const wrongPaths = [],
    failed = [],
    errors = [],
    loaded = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    const url = new URL(response.url());
    if (url.origin !== new URL(baseURL).origin) return;
    loaded.push(url.pathname);
    if (!url.pathname.startsWith(basePath)) wrongPaths.push(url.pathname);
    if (response.status() >= 400) failed.push(`${response.status()} ${url.pathname}`);
  });
  await page.goto('./');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('.brand img')).toHaveJSProperty('complete', true);
  expect(await page.locator('.brand img').evaluate((img) => img.naturalWidth)).toBeGreaterThan(0);
  const favicon = await page.locator('link[rel="icon"]').getAttribute('href');
  expect(new URL(favicon, baseURL).pathname).toBe(`${basePath}favicon.svg`);
  expect((await page.request.get(favicon)).status()).toBe(200);
  await page.getByRole('button', { name: 'Jogar · começar aventura' }).click();
  await page.getByRole('button', { name: 'Executar exemplo' }).click();
  await expect(page.locator('#example-output')).toHaveText(
    'Olá, explorador!\nSua aventura começou.\n',
    { timeout: 60000 },
  );
  expect(loaded.some((path) => path.endsWith('/pyodide/pyodide.asm.wasm'))).toBe(true);
  expect(loaded.some((path) => path.endsWith('/pyodide/python_stdlib.zip'))).toBe(true);
  expect(wrongPaths).toEqual([]);
  expect(failed).toEqual([]);
  expect(errors).toEqual([]);
});
