import { ProgressStore } from '../progress/store.js';
import { LevelSession } from '../engine/session.js';
import { getLevel } from '../content/catalog.js';
import { PythonRunner } from '../python/runner.js';
import { explainResult } from '../python/feedback.js';
import { Sounds } from '../game/sound.js';
import { createMap } from '../game/map.js';
import {
  shell,
  homeView,
  levelView,
  achievementsView,
  settingsView,
  creditsView,
} from './views.js';
import { escapeHtml as e } from './icons.js';

export class QuestApp {
  constructor(root) {
    this.root = root;
    this.warning = '';
    let storage;
    try {
      storage = window.localStorage;
    } catch {
      /* O modo privado pode bloquear o armazenamento. */
    }
    this.store = new ProgressStore(storage, (message) => {
      this.warning = message;
      this.showWarning();
    });
    this.runner = new PythonRunner();
    this.sounds = new Sounds();
    this.screen = 'home';
    this.world = Math.ceil(this.store.current / 5);
    this.session = null;
    this.renderVersion = 0;
    this.root.addEventListener('click', (event) => {
      const target = event.target.closest('[data-action]');
      if (target && !target.disabled)
        void this.action(target.dataset.action, Number(target.dataset.id), target);
    });
    this.render();
  }
  showWarning() {
    const warning = this.root?.querySelector('#storage-warning');
    if (warning) {
      warning.textContent = this.warning;
      warning.hidden = !this.warning;
    }
  }
  saveDraft() {
    if (this.session?.stage === 'practice')
      this.store.draft(this.session.level.id, this.session.code, this.session.hints);
  }
  render(focus = false) {
    this.runner.cancel();
    this.renderVersion++;
    this.map?.destroy(true);
    this.map = null;
    document.documentElement.classList.toggle('large-text', this.store.data.settings.largeText);
    document.documentElement.classList.toggle(
      'reduced-motion',
      this.store.data.settings.reducedMotion,
    );
    let body;
    if (this.screen === 'level') body = levelView(this.session, this.reward);
    else if (this.screen === 'achievements') body = achievementsView(this.store);
    else body = homeView(this.store, this.world, this.screen === 'worlds');
    this.root.innerHTML = shell(this.store, this.screen, body);
    this.showWarning();
    const mapParent = this.root.querySelector('#adventure-map');
    if (mapParent)
      this.map = createMap(mapParent, {
        world: this.world,
        completed: this.store.data.completed,
        current: this.store.current,
        reducedMotion:
          this.store.data.settings.reducedMotion ||
          matchMedia('(prefers-reduced-motion: reduce)').matches,
        onSelect: (id) => this.openLevel(id),
      });
    if (this.session?.stage === 'practice' && this.screen === 'level') this.bindEditor();
    if (focus) {
      this.root.querySelector('#main').focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
  openLevel(id) {
    if (!this.store.isUnlocked(id)) return;
    const level = getLevel(id);
    if (!level) return;
    this.saveDraft();
    this.session = new LevelSession(level, this.store.data.drafts[id]);
    this.reward = null;
    this.screen = 'level';
    this.world = level.world;
    this.render(true);
  }
  navigate(screen) {
    this.saveDraft();
    this.screen = screen;
    this.render(true);
  }
  async action(action, id, target) {
    if (action === 'home' || action === 'worlds' || action === 'achievements')
      return this.navigate(action);
    if (action === 'world') {
      this.world = id;
      return this.render();
    }
    if (action === 'level') return this.openLevel(id);
    if (action === 'continue') return this.openLevel(this.store.current);
    if (action === 'settings') return this.openModal(settingsView(this.store.data.settings));
    if (action === 'credits') return this.openModal(creditsView());
    if (action === 'close-modal') return this.closeModal();
    if (action === 'ask-reset') {
      this.root.querySelector('#reset-confirm').hidden = false;
      return;
    }
    if (action === 'cancel-reset') {
      this.root.querySelector('#reset-confirm').hidden = true;
      return;
    }
    if (action === 'reset') {
      this.runner.cancel();
      this.store.reset();
      this.session = null;
      this.world = 1;
      this.screen = 'home';
      return this.render(true);
    }
    const session = this.session;
    if (!session) return;
    if (action === 'learn-next') {
      session.learn();
      return this.render(true);
    }
    if (action === 'run-example') {
      const version = this.renderVersion;
      target.disabled = true;
      const result = await this.runner.execute(
        {
          mode: 'run',
          code: session.level.examples[0].code,
          inputs: session.level.examples[0].inputs ?? [],
        },
        (text) => {
          const status = this.root.querySelector('#example-status');
          if (status) status.textContent = text;
        },
      );
      if (version !== this.renderVersion) return;
      target.disabled = false;
      const output = this.root.querySelector('#example-output');
      output.hidden = false;
      output.textContent = result.error ? explainResult(result).text : result.output;
      this.root.querySelector('#example-status').textContent = result.error
        ? 'Não foi possível executar.'
        : 'Exemplo executado com Python real.';
      return;
    }
    if (action === 'answer') {
      const response = session.answer(id);
      if (!response) return;
      this.root.querySelectorAll('.quiz-option').forEach((option) => {
        option.classList.remove('correct', 'incorrect');
        option.setAttribute('aria-pressed', 'false');
      });
      target.classList.add(response.correct ? 'correct' : 'incorrect');
      target.setAttribute('aria-pressed', 'true');
      this.root.querySelector('#quiz-feedback').innerHTML =
        `<div class="feedback ${response.correct ? 'success' : 'error'}"><strong>${response.correct ? '✓ Boa descoberta!' : 'Vamos pensar mais um pouco.'}</strong><p>${e(response.feedback)}</p></div>`;
      this.root.querySelector('#quiz-next').disabled = !response.correct;
      this.sounds.play(this.store.data.settings, response.correct);
      return;
    }
    if (action === 'quiz-next') {
      if (session.nextQuestion()) this.render(true);
      return;
    }
    if (action === 'predict') {
      const correct = id === session.level.exercise.predictionCorrect;
      this.root.querySelector('#prediction-feedback').textContent = correct
        ? 'Isso! Os textos são unidos. Agora transforme o programa em uma soma numérica.'
        : 'Observe as aspas: os valores são textos, então + junta as duas partes. Tente novamente.';
      return;
    }
    if (action === 'hint') {
      session.hint();
      this.saveDraft();
      this.root.querySelector('#hints').innerHTML = session.level.exercise.hints
        .slice(0, session.hints)
        .map((hint, index) => `<p class="hint"><strong>${index + 1}.</strong> ${e(hint)}</p>`)
        .join('');
      target.textContent = `Mostrar dica (${session.hints}/3)`;
      target.disabled = session.hints >= 3;
      return;
    }
    if (action === 'restore') {
      this.setCode(session.level.exercise.starter);
      return;
    }
    if (action === 'swap-lines') {
      this.setCode(session.code.split('\n').reverse().join('\n'));
      return;
    }
    if (action === 'cancel') {
      this.runner.cancel();
      return;
    }
    if (action === 'run' || action === 'verify') return this.runCode(action === 'verify');
    if (action === 'finish') {
      if (!session.finish()) return;
      this.reward = this.store.complete(session.level.id, session.hints);
      this.sounds.play(this.store.data.settings);
      return this.render(true);
    }
    if (action === 'repeat') {
      delete this.store.data.drafts[session.level.id];
      this.store.save();
      return this.openLevel(session.level.id);
    }
    if (action === 'next-level') return this.openLevel(session.level.id + 1);
  }
  bindEditor() {
    const editor = this.root.querySelector('#code-editor');
    let tabNavigation = false;
    editor.addEventListener('input', () => {
      this.session.code = editor.value;
      this.session.passed = false;
      this.root.querySelector('#finish-button').hidden = true;
      this.root.querySelector('#run-feedback').innerHTML = '';
      this.updateLines();
      this.saveDraft();
    });
    editor.addEventListener('scroll', () => {
      this.root.querySelector('#line-numbers').scrollTop = editor.scrollTop;
    });
    editor.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        tabNavigation = true;
        return;
      }
      if (event.key === 'Tab' && tabNavigation) {
        tabNavigation = false;
        return;
      }
      if (event.key === 'Tab' && !event.shiftKey) {
        event.preventDefault();
        editor.setRangeText('    ', editor.selectionStart, editor.selectionEnd, 'end');
        editor.dispatchEvent(new Event('input'));
      }
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        if (!this.runner.job) void this.runCode(false);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const line = editor.value.slice(0, editor.selectionStart).split('\n').at(-1);
        const indent = line.match(/^ */)[0] + (line.trimEnd().endsWith(':') ? '    ' : '');
        editor.setRangeText('\n' + indent, editor.selectionStart, editor.selectionEnd, 'end');
        editor.dispatchEvent(new Event('input'));
      }
    });
    this.updateLines();
  }
  updateLines() {
    const editor = this.root.querySelector('#code-editor');
    this.root.querySelector('#line-numbers').textContent = Array.from(
      { length: editor.value.split('\n').length },
      (_, i) => i + 1,
    ).join('\n');
  }
  setCode(code) {
    if (this.runner.job) this.runner.cancel();
    const editor = this.root.querySelector('#code-editor');
    editor.value = code;
    editor.dispatchEvent(new Event('input'));
    editor.focus();
  }
  async runCode(verify) {
    if (this.runner.job || this.session.stage !== 'practice') return;
    const version = this.renderVersion,
      session = this.session,
      code = session.code;
    session.passed = false;
    this.root.querySelector('#finish-button').hidden = true;
    const run = this.root.querySelector('#run-button'),
      check = this.root.querySelector('#verify-button'),
      cancel = this.root.querySelector('#cancel-button');
    run.disabled = true;
    check.disabled = true;
    cancel.hidden = false;
    this.root.querySelector('#run-feedback').innerHTML = '';
    const rawInput = this.root.querySelector('#program-input').value;
    const result = await this.runner.execute(
      {
        mode: verify ? 'verify' : 'run',
        levelId: session.level.id,
        code,
        inputs: rawInput === '' ? [] : rawInput.split('\n'),
      },
      (text) => {
        const status = this.root.querySelector('#execution-status');
        if (status) status.textContent = text;
      },
    );
    if (version !== this.renderVersion) return;
    run.disabled = false;
    check.disabled = false;
    cancel.hidden = true;
    this.root.querySelector('#execution-status').textContent = result.error
      ? 'Execução encerrada'
      : 'Execução concluída';
    this.root.querySelector('#program-output').textContent =
      (result.output || '(Sem saída)') +
      (result.stderr ? '\nErros do programa:\n' + result.stderr : '');
    if (code !== session.code) {
      this.root.querySelector('#run-feedback').textContent =
        'O código mudou durante a execução. Verifique novamente a versão atual.';
      return;
    }
    const feedback = explainResult(result, verify);
    this.root.querySelector('#run-feedback').innerHTML =
      `<div class="feedback ${feedback.kind}"><strong>${e(feedback.title)}</strong><p>${e(feedback.text)}</p>${feedback.detail ? `<details><summary>Ver detalhe do Python</summary><pre>${e(feedback.detail)}</pre></details>` : ''}</div>`;
    if (verify && session.verify(result)) {
      this.root.querySelector('#finish-button').hidden = false;
      this.sounds.play(this.store.data.settings);
    }
  }
  openModal(html) {
    this.modalTriggerAction = document.activeElement?.closest('[data-action]')?.dataset.action;
    this.root.querySelector('#modal-root').innerHTML = html;
    const dialog = this.root.querySelector('dialog');
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.closeModal();
    });
    dialog.showModal();
    const fields = {
      'sound-setting': ['sound', 'checked'],
      'volume-setting': ['volume', 'value'],
      'motion-setting': ['reducedMotion', 'checked'],
      'text-setting': ['largeText', 'checked'],
    };
    for (const [id, [key, field]] of Object.entries(fields)) {
      this.root.querySelector(`#${id}`)?.addEventListener('input', (event) => {
        this.store.settings({
          [key]: key === 'volume' ? Number(event.target[field]) : event.target[field],
        });
        document.documentElement.classList.toggle('large-text', this.store.data.settings.largeText);
        document.documentElement.classList.toggle(
          'reduced-motion',
          this.store.data.settings.reducedMotion,
        );
        if (key === 'reducedMotion') {
          this.map?.destroy(true);
          this.map = null;
        }
      });
    }
  }
  closeModal() {
    this.root.querySelector('dialog')?.close();
    this.render();
    const trigger = [
      ...this.root.querySelectorAll(`[data-action="${this.modalTriggerAction ?? 'settings'}"]`),
    ].find((element) => element.getClientRects().length > 0);
    trigger?.focus();
  }
}
