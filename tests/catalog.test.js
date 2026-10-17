import { it, expect } from 'vitest';
import { levels, validateCatalog } from '../src/content/catalog.js';
import { checks } from '../src/python/checks.js';
import { LevelSession } from '../src/engine/session.js';
it('catálogo tem aulas completas, identificadores contínuos e avaliadores', () => {
  expect(levels).toHaveLength(25);
  expect(levels.filter((level) => level.special).map((level) => level.id)).toEqual([
    5, 10, 15, 20, 25,
  ]);
  expect(validateCatalog(levels)).toEqual([]);
  expect(levels.map((l) => l.id)).toEqual(Array.from({ length: levels.length }, (_, i) => i + 1));
  for (const l of levels) {
    expect(checks[l.id].cases.length).toBeGreaterThan(0);
    expect(l.prerequisites).toEqual(l.id === 1 ? [] : [l.id - 1]);
  }
});
it('bloqueia avanço com erro no quiz e conclusão sem prática aprovada', () => {
  const session = new LevelSession(levels[0]);
  expect(session.finish()).toBe(false);
  session.learn();
  expect(session.answer(2).correct).toBe(false);
  expect(session.nextQuestion()).toBe(false);
  for (const question of levels[0].questions) {
    expect(session.answer(question.correct).correct).toBe(true);
    expect(session.nextQuestion()).toBe(true);
  }
  expect(session.stage).toBe('practice');
  expect(session.verify({ passed: false })).toBe(false);
  expect(session.finish()).toBe(false);
  expect(session.verify({ passed: true })).toBe(true);
  expect(session.finish()).toBe(true);
  expect(session.finish()).toBe(false);
});
it('todas as alternativas têm explicação e todos os acertos funcionam', () => {
  for (const l of levels) {
    const session = new LevelSession(l);
    session.learn();
    for (const question of l.questions) {
      for (let i = 0; i < question.options.length; i++) {
        const result = session.answer(i);
        expect(result.correct).toBe(i === question.correct);
        expect(result.feedback.length).toBeGreaterThan(10);
      }
      session.answer(question.correct);
      session.nextQuestion();
    }
    expect(session.stage).toBe('practice');
  }
});
