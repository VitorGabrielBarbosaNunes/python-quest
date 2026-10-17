import { test, expect } from '@playwright/test';
import { levels } from '../src/content/catalog.js';
async function practice(page) {
  await page.locator('[data-action="level"][data-id="1"]').click();
  await page.getByRole('button', { name: 'Entendi, vamos praticar' }).click();
  for (const question of levels[0].questions) {
    await page.locator(`[data-action="answer"][data-id="${question.correct}"]`).click();
    await page.locator('#quiz-next').click();
  }
}
test('repetição melhora estrelas sem XP extra; reset exige confirmação', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('python-quest:v1'))
      localStorage.setItem(
        'python-quest:v1',
        JSON.stringify({ version: 1, completed: { 1: { stars: 1 } }, drafts: {}, settings: {} }),
      );
  });
  await page.goto('./');
  await practice(page);
  await page.getByLabel('Seu código Python').fill('print("Olá, Python!")');
  await page.locator('#verify-button').click();
  await expect(page.locator('#finish-button')).toBeVisible({ timeout: 60000 });
  await page.locator('#finish-button').click();
  await expect(page.getByText('+0 XP')).toBeVisible();
  await expect(page.getByLabel('3 de 3 estrelas')).toBeVisible();
  await page.getByRole('button', { name: 'Configurações', exact: true }).first().click();
  await page.getByRole('button', { name: 'Reiniciar progresso', exact: true }).click();
  await expect(page.locator('.xp')).toContainText('100');
  await page.getByRole('button', { name: 'Manter progresso' }).click();
  await page.getByRole('button', { name: 'Reiniciar progresso', exact: true }).click();
  await page.getByRole('button', { name: 'Sim, apagar meu progresso' }).click();
  await expect(page.locator('.xp')).toContainText('0');
  await expect(page.locator('[data-action="level"][data-id="2"]')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Jogar · começar aventura' })).toBeVisible();
});
test('rascunho e dicas sobrevivem a recarga e a restauração de código', async ({ page }) => {
  await page.goto('./');
  await practice(page);
  await page.getByLabel('Seu código Python').fill('print("Rascunho")');
  await page.locator('#hint-button').click();
  await page.reload();
  await practice(page);
  await expect(page.getByLabel('Seu código Python')).toHaveValue('print("Rascunho")');
  await expect(page.locator('#hint-button')).toContainText('1/3');
  await page.getByRole('button', { name: 'Restaurar código inicial' }).click();
  await expect(page.getByLabel('Seu código Python')).toHaveValue('print("___")');
  await expect(page.locator('#hint-button')).toContainText('1/3');
});
test('armazenamento bloqueado permite jogar com aviso', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Bloqueado');
      },
    }),
  );
  await page.goto('./');
  await expect(page.locator('#storage-warning')).toBeVisible();
  await practice(page);
  await page.getByLabel('Seu código Python').fill('print("Oi")');
  await expect(page.locator('#storage-warning')).toContainText('não conseguiu salvar');
});
test('falha no runtime é informada e uma nova tentativa se recupera', async ({ page }) => {
  await page.route('**/pyodide/pyodide.mjs', (route) => route.abort());
  await page.goto('./');
  await practice(page);
  await page.getByLabel('Seu código Python').fill('print("Olá, Python!")');
  await page.locator('#run-button').click();
  await expect(page.getByText('Não conseguimos preparar o Python.', { exact: false })).toBeVisible({
    timeout: 60000,
  });
  await page.unroute('**/pyodide/pyodide.mjs');
  await page.locator('#verify-button').click();
  await page.getByLabel('Seu código Python').fill('print("Código alterado")');
  await expect(page.getByText('O código mudou durante a execução.', { exact: false })).toBeVisible({
    timeout: 60000,
  });
  await expect(page.locator('#finish-button')).toBeHidden();
  await page.getByLabel('Seu código Python').fill('print("Olá, Python!")');
  await page.locator('#verify-button').click();
  await expect(page.locator('#finish-button')).toBeVisible({ timeout: 60000 });
});
test('editor aceita indentação e permite sair usando o teclado', async ({ page }) => {
  await page.goto('./');
  await practice(page);
  const editor = page.getByLabel('Seu código Python');
  await editor.fill('if True:');
  await editor.press('End');
  await editor.press('Enter');
  await expect(editor).toHaveValue('if True:\n    ');
  await editor.press('Tab');
  await expect(editor).toHaveValue('if True:\n        ');
  await editor.press('Escape');
  await editor.press('Tab');
  await expect(page.locator('#run-button')).toBeFocused();
});
test('layout utilizável em 320, 768 e 1440 pixels, sem erros no console', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('./');
    await expect(page.locator('canvas')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await practice(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width === 1440)
      await page.screenshot({ path: 'artifacts/editor-desktop.png', fullPage: true });
    if (width === 320)
      await page.screenshot({ path: 'artifacts/editor-mobile.png', fullPage: true });
  }
  await page.goto('./');
  await page.screenshot({ path: 'artifacts/home-desktop.png', fullPage: true });
  expect(errors).toEqual([]);
});
