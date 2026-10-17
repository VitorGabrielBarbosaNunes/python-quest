import { test, expect } from '@playwright/test';
import { levels } from '../src/content/catalog.js';
import { solutions } from '../tests/solutions.js';

test('percurso sequencial de todos os níveis com Python real', async ({ page }) => {
  test.setTimeout(600000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await page.getByRole('button', { name: 'Jogar · começar aventura' }).click();
  for (const level of levels) {
    await expect(page.locator('.lesson-heading h1')).toHaveText(level.title);
    await page.getByRole('button', { name: 'Entendi, vamos praticar' }).click();
    for (const question of level.questions) {
      await page.locator(`[data-action="answer"][data-id="${question.correct}"]`).click();
      await page.locator('#quiz-next').click();
    }
    await page.getByLabel('Seu código Python').fill(solutions[level.id]);
    if (level.id === 2) await page.locator('#hint-button').click();
    await page.locator('#verify-button').click();
    await expect(page.locator('#finish-button')).toBeVisible({ timeout: 60000 });
    await page.locator('#finish-button').click();
    await expect(page.getByText('+100 XP')).toBeVisible();
    await expect(page.locator('.xp')).toContainText(String(level.id * 100));
    console.log(`Nível ${level.id}: verificado, concluído e salvo.`);
    if (level.id < levels.length) await page.getByRole('button', { name: 'Próximo nível' }).click();
  }
  await page.reload();
  await expect(page.locator('.xp')).toContainText(String(levels.length * 100));
  await page.getByRole('button', { name: 'Explorar mundos' }).click();
  await page.locator('[data-action="world"][data-id="5"]').click();
  await expect(page.locator('canvas')).toBeVisible();
  await page.screenshot({ path: 'artifacts/castle-completed.png', fullPage: true });
  await page.getByRole('button', { name: 'Conquistas', exact: true }).click();
  await expect(page.locator('.achievement.earned')).toHaveCount(4);
  expect(errors).toEqual([]);
});
