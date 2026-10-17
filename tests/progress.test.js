import { describe, it, expect, vi } from 'vitest';
import { ProgressStore, STORAGE_KEY, sanitize } from '../src/progress/store.js';
const memory = () => {
  const data = new Map();
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
};
describe('Progresso', () => {
  it('desbloqueia em sequência e não permite concluir níveis bloqueados', () => {
    const store = new ProgressStore(memory());
    expect(store.isUnlocked(1)).toBe(true);
    expect(store.isUnlocked(2)).toBe(false);
    expect(() => store.complete(2)).toThrow();
    store.complete(1);
    expect(store.isUnlocked(2)).toBe(true);
    expect(store.isUnlocked(3)).toBe(false);
  });
  it('concede XP uma vez, melhora estrelas e não reduz o recorde', () => {
    const store = new ProgressStore(memory());
    expect(store.complete(1, 3)).toEqual({ xp: 100, stars: 1, best: 1 });
    expect(store.complete(1, 1)).toEqual({ xp: 0, stars: 2, best: 2 });
    expect(store.complete(1, 0).best).toBe(3);
    expect(store.complete(1, 3).best).toBe(3);
    expect(store.xp).toBe(100);
    expect(store.stars).toBe(3);
    expect(store.worldProgress(1)).toBe(20);
  });
  it('persiste progresso, preferências e rascunhos com dicas', () => {
    const storage = memory();
    const store = new ProgressStore(storage);
    store.complete(1);
    store.draft(2, 'print("Oi")', 2);
    store.settings({ volume: 0.5, reducedMotion: true });
    const restored = new ProgressStore(storage);
    expect(restored.xp).toBe(100);
    expect(restored.data.drafts[2].hints).toBe(2);
    expect(restored.data.settings.volume).toBe(0.5);
    restored.reset();
    expect(restored.xp).toBe(0);
    expect(restored.data.settings.reducedMotion).toBe(true);
  });
  it('tolera corrupção, versões desconhecidas e armazenamento bloqueado', () => {
    const warning = vi.fn(),
      storage = memory();
    storage.setItem(STORAGE_KEY, '{broken');
    expect(new ProgressStore(storage, warning).xp).toBe(0);
    expect(warning).toHaveBeenCalled();
    const denied = new ProgressStore(
      {
        getItem: () => {
          throw Error();
        },
        setItem: () => {
          throw Error();
        },
      },
      warning,
    );
    denied.complete(1);
    expect(denied.xp).toBe(100);
    expect(denied.save()).toBe(false);
    expect(sanitize({ version: 2 }).completed).toEqual({});
    expect(sanitize({ version: 1, completed: { 2: { stars: 3 } } }).completed).toEqual({});
  });
  it('conclui os cinco mundos e libera as conquistas', () => {
    const store = new ProgressStore(memory());
    for (let i = 1; i <= 25; i++) store.complete(i);
    expect(store.xp).toBe(2500);
    expect(store.stars).toBe(75);
    expect(store.current).toBe(25);
    expect(store.achievements().every((item) => item.earned)).toBe(true);
  });
});
