import { describe, it, expect, vi, afterEach } from 'vitest';
import { PythonRunner } from '../src/python/runner.js';
import { explainResult } from '../src/python/feedback.js';
afterEach(() => vi.useRealTimers());
function setup() {
  const workers = [];
  const runner = new PythonRunner({
    workerFactory: () => {
      const worker = { terminate: vi.fn(), postMessage: vi.fn() };
      workers.push(worker);
      return worker;
    },
    loadTimeout: 100,
    runTimeout: 50,
  });
  return { runner, workers };
}
describe('Worker', () => {
  it('só começa o limite de execução depois do carregamento', async () => {
    vi.useFakeTimers();
    const { runner, workers } = setup();
    const result = runner.execute({ code: 'while True: pass' });
    vi.advanceTimersByTime(80);
    expect(runner.job).not.toBe(null);
    workers[0].onmessage({ data: { type: 'ready' } });
    vi.advanceTimersByTime(51);
    expect((await result).error.type).toBe('TimeoutError');
    expect(workers[0].terminate).toHaveBeenCalledOnce();
  });
  it('cancela e permite executar em outro Worker sem aceitar resultado antigo', async () => {
    const { runner, workers } = setup();
    const first = runner.execute({ code: '1' });
    runner.cancel();
    expect((await first).error.type).toBe('CancelledError');
    const second = runner.execute({ code: '2' });
    workers[0].onmessage({ data: { type: 'result', result: { output: 'antigo' } } });
    workers[1].onmessage({ data: { type: 'result', result: { output: 'novo' } } });
    expect((await second).output).toBe('novo');
    expect(workers[1].terminate).toHaveBeenCalledOnce();
  });
  it('trata falha e demora no carregamento', async () => {
    vi.useFakeTimers();
    const { runner, workers } = setup();
    const first = runner.execute({ code: '1' });
    vi.advanceTimersByTime(101);
    expect((await first).error.type).toBe('RuntimeLoadError');
    const second = runner.execute({ code: '2' });
    workers[1].onerror();
    expect((await second).error.type).toBe('RuntimeLoadError');
  });
  it('traduz erros e identifica resultados parciais', () => {
    for (const type of [
      'SyntaxError',
      'NameError',
      'TypeError',
      'IndentationError',
      'TimeoutError',
      'EOFError',
    ])
      expect(explainResult({ error: { type, message: 'x', line: 3 } }).text).toContain('linha 3');
    expect(explainResult({ passed: false, passedCount: 1, total: 3 }, true).text).toContain(
      '1 de 3',
    );
  });
});

it('mantém orientação em português para erros inesperados e preserva o detalhe técnico', () => {
  const result = explainResult({
    error: { type: 'CustomError', message: 'Unexpected external message', line: 2 },
  });
  expect(result.text).toContain('O programa encontrou um problema');
  expect(result.detail).toContain('Unexpected external message');
  expect(
    explainResult({ passedCount: 2, total: 3, error: { type: 'ValueError', message: 'x' } }, true)
      .text,
  ).toContain('2 de 3');
});
