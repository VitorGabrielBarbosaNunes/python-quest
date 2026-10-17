import { beforeAll, it, expect } from 'vitest';
import { loadPyodide } from 'pyodide';
import { harness } from '../src/python/harness.js';
import { checks } from '../src/python/checks.js';
let py;
beforeAll(async () => {
  py = await loadPyodide();
});
async function run(code, spec, inputs = []) {
  py.globals.set('_payload_json', JSON.stringify({ code, spec, inputs }));
  await py.runPythonAsync(harness);
  return JSON.parse(py.globals.get('_result_json'));
}
it('executa Python real e aceita soluções diferentes no primeiro nível', async () => {
  for (const code of [
    'print("Olá, Python!")',
    'mensagem = "Olá, Python!"\nprint(mensagem)',
    'print("Olá,", "Python!")',
  ])
    expect((await run(code, checks[1])).passed).toBe(true);
  expect((await run('print("oi")', checks[1])).passed).toBe(false);
});
it('lê entradas controladas e testa funções em várias situações', async () => {
  const spec = {
    cases: [
      { inputs: ['3', '5'], output: '8' },
      { inputs: ['-2', '1'], output: '-1' },
    ],
  };
  expect(
    (await run('a = int(input("Número: "))\nb = int(input())\nprint(a + b)', spec)).passed,
  ).toBe(true);
  const functions = {
    cases: [
      { call: { name: 'dobro', args: [4], expected: 8 } },
      { call: { name: 'dobro', args: [-1], expected: -2 } },
    ],
  };
  expect((await run('def dobro(n):\n    return n * 2', functions)).passed).toBe(true);
});
it('isola variáveis e captura erros e saída excessiva', async () => {
  await run('segredo = 9');
  expect((await run('print(segredo)')).error.type).toBe('NameError');
  for (const [code, type] of [
    ['print(', 'SyntaxError'],
    ['if True:\nprint(1)', 'IndentationError'],
    ['print("x" + 1)', 'TypeError'],
    ['input()', 'EOFError'],
    ['print("a" * 17000)', '_OutputLimit'],
  ])
    expect((await run(code)).error.type).toBe(type);
});
it('avalia construção específica e valores, além da saída', async () => {
  expect((await run('print("8")', checks[4])).passed).toBe(false);
  expect((await run('moedas = 8\nprint(moedas)', checks[4])).passed).toBe(true);
  expect(
    (
      await run(
        'nome="Lia"\nidade=16\nhabilidade="Explorar"\nprint(nome)\nprint(idade)\nprint(habilidade)',
        checks[5],
      )
    ).passed,
  ).toBe(true);
});

import { solutions } from './solutions.js';
import { levels } from '../src/content/catalog.js';
it.each(levels.map((l) => [l.id, l.title]))(
  'nível %i — %s: solução aprovada e resposta vazia rejeitada',
  async (id) => {
    const result = await run(solutions[id], checks[id]);
    expect(result, JSON.stringify(result)).toMatchObject({ passed: true, error: null });
    expect((await run('', checks[id])).passed).toBe(false);
  },
);
it.each(levels.map((l) => [l.id, l.examples[0]]))(
  'exemplo didático %i produz a saída anunciada',
  async (id, example) => {
    const result = await run(example.code, undefined, example.inputs ?? []);
    expect(result.error).toBe(null);
    expect(result.output.trim()).toBe(example.output);
  },
);
it('rejeita resposta fixa e detecta acerto parcial nas condições de fronteira', async () => {
  expect((await run('input()\nprint("Olá, Lia")', checks[8])).passed).toBe(false);
  const boundary = await run('n = int(input())\nif n > 5:\n    print("Portal aberto")', checks[11]);
  expect(boundary.passed).toBe(false);
  expect(boundary.passedCount).toBe(3);
  expect(boundary.total).toBe(4);
});
it('funções não podem apenas imprimir em vez de retornar', async () => {
  expect((await run('def dobro(n):\n    print(n*2)', checks[22])).passed).toBe(false);
  expect((await run('def saudar():\n    pass\nprint("Olá, viajante!")', checks[21])).passed).toBe(
    false,
  );
});
it('o jogo de adivinhação aceita uma implementação equivalente com while', async () => {
  const code =
    'tentativa = 0\nacertou = False\nwhile tentativa < 3:\n    palpite = int(input())\n    tentativa += 1\n    if palpite == 7:\n        print("Acertou!")\n        acertou = True\n        break\n    print("Tente de novo")\nif not acertou:\n    print("Fim das tentativas")';
  expect((await run(code, checks[20])).passed).toBe(true);
});
it('bloqueia importações desnecessárias e não passa dados do app ao Python', async () => {
  expect((await run('import js')).error.type).toBe('ImportError');
  expect((await run('open("/tmp/a", "w")')).error.type).toBe('PermissionError');
  expect((await run('print(_payload_json)')).error.type).toBe('NameError');
});
