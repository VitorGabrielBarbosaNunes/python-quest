export const STORAGE_KEY = 'python-quest:v1';
export const defaultSettings = {
  volume: 0.35,
  sound: true,
  reducedMotion: false,
  largeText: false,
};
export const freshProgress = () => ({
  version: 1,
  completed: {},
  drafts: {},
  settings: { ...defaultSettings },
});

export function sanitize(raw) {
  const clean = freshProgress();
  if (raw?.version !== 1) return clean;
  // Só aceitamos uma sequência concluída: dados corrompidos não abrem atalhos.
  for (let id = 1; id <= 25; id++) {
    const record = raw.completed?.[id];
    if (!record || !Number.isInteger(record.stars) || record.stars < 1 || record.stars > 3) break;
    clean.completed[id] = { stars: record.stars };
  }
  for (const [id, draft] of Object.entries(raw.drafts ?? {})) {
    if (/^(?:[1-9]|1\d|2[0-5])$/.test(id) && typeof draft?.code === 'string') {
      clean.drafts[id] = {
        code: draft.code.slice(0, 20000),
        hints: Math.min(3, Math.max(0, Number(draft.hints) || 0)),
      };
    }
  }
  for (const key of ['sound', 'reducedMotion', 'largeText']) {
    if (typeof raw.settings?.[key] === 'boolean') clean.settings[key] = raw.settings[key];
  }
  if (Number.isFinite(raw.settings?.volume))
    clean.settings.volume = Math.min(1, Math.max(0, raw.settings.volume));
  return clean;
}

export class ProgressStore {
  constructor(storage, onWarning = () => {}) {
    this.storage = storage;
    this.onWarning = onWarning;
    this.data = freshProgress();
    try {
      const saved = storage?.getItem(STORAGE_KEY);
      if (saved) this.data = sanitize(JSON.parse(saved));
      if (!storage) throw new Error('Armazenamento indisponível');
    } catch {
      onWarning(
        'Não foi possível carregar o progresso. Você pode jogar, mas o salvamento pode estar indisponível.',
      );
    }
  }
  save() {
    try {
      if (!this.storage) throw new Error('Armazenamento indisponível');
      this.storage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      return true;
    } catch {
      this.onWarning(
        'O navegador não conseguiu salvar. Seu progresso permanece nesta aba; evite fechá-la.',
      );
      return false;
    }
  }
  get xp() {
    return Object.keys(this.data.completed).length * 100;
  }
  get stars() {
    return Object.values(this.data.completed).reduce((sum, item) => sum + item.stars, 0);
  }
  get current() {
    return Math.min(25, Object.keys(this.data.completed).length + 1);
  }
  isUnlocked(id) {
    return (
      Number.isInteger(id) &&
      id >= 1 &&
      id <= 25 &&
      (id === 1 || Boolean(this.data.completed[id - 1]))
    );
  }
  worldProgress(world) {
    return (
      Array.from({ length: 5 }, (_, index) => (world - 1) * 5 + index + 1).filter(
        (id) => this.data.completed[id],
      ).length * 20
    );
  }
  complete(id, hints = 0) {
    if (!this.isUnlocked(id)) throw new Error('Conclua o nível anterior primeiro.');
    const stars = hints === 0 ? 3 : hints <= 2 ? 2 : 1;
    const previous = this.data.completed[id];
    this.data.completed[id] = { stars: Math.max(previous?.stars ?? 0, stars) };
    delete this.data.drafts[id];
    this.save();
    return { xp: previous ? 0 : 100, stars, best: this.data.completed[id].stars };
  }
  draft(id, code, hints) {
    this.data.drafts[id] = { code: code.slice(0, 20000), hints };
    this.save();
  }
  settings(settings) {
    this.data.settings = sanitize({
      ...this.data,
      settings: { ...this.data.settings, ...settings },
    }).settings;
    this.save();
  }
  reset() {
    const settings = this.data.settings;
    this.data = freshProgress();
    this.data.settings = settings;
    this.save();
  }
  achievements() {
    return [
      {
        icon: '✦',
        title: 'Primeiro passo',
        description: 'Conclua sua primeira missão.',
        earned: this.xp >= 100,
      },
      {
        icon: '⌂',
        title: 'Explorador da vila',
        description: 'Conclua o primeiro mundo.',
        earned: this.worldProgress(1) === 100,
      },
      {
        icon: '★',
        title: 'Olhar de estrela',
        description: 'Conquiste 15 estrelas.',
        earned: this.stars >= 15,
      },
      {
        icon: '♜',
        title: 'Guardião do código',
        description: 'Conclua as 25 missões.',
        earned: this.xp === 2500,
      },
    ];
  }
}
