// Casos de avaliação não são renderizados no enunciado. Em uma aplicação sem
// servidor, estes dados continuam inspecionáveis nas ferramentas do navegador.
export const checks = {
  1: { cases: [{ output: 'Olá, Python!' }] },
  2: { cases: [{ output: 'Portal aberto\nVamos aprender!' }] },
  3: { structure: ['Add'], cases: [{ output: '12' }] },
  4: { reads: ['moedas'], cases: [{ output: '8', values: { moedas: 8 } }] },
  5: {
    reads: ['nome', 'idade', 'habilidade'],
    cases: [
      { output: 'Lia\n16\nExplorar', values: { nome: 'Lia', idade: 16, habilidade: 'Explorar' } },
    ],
  },
};

Object.assign(checks, {
  6: { structure: ['Mult'], cases: [{ output: '12' }] },
  7: {
    structure: ['Compare'],
    reads: ['moedas'],
    cases: [{ output: 'True', values: { moedas: 8 } }],
  },
  8: {
    cases: ['Lia', 'Ravi', 'Ana Clara'].map((name) => ({
      inputs: [name],
      output: `Olá, ${name}`,
      minInputs: 1,
    })),
  },
  9: {
    calls: ['int', 'float', 'str'],
    cases: [
      { inputs: ['3', '2.5'], output: 'Total: 7.5', minInputs: 2 },
      { inputs: ['0', '7.0'], output: 'Total: 0.0', minInputs: 2 },
      { inputs: ['4', '1.25'], output: 'Total: 5.0', minInputs: 2 },
    ],
  },
  10: {
    calls: ['float'],
    cases: [
      { inputs: ['8', '2'], output: '10.0\n6.0\n16.0\n4.0', minInputs: 2 },
      { inputs: ['-6', '3'], output: '-3.0\n-9.0\n-18.0\n-2.0', minInputs: 2 },
      { inputs: ['1.5', '0.5'], output: '2.0\n1.0\n0.75\n3.0', minInputs: 2 },
    ],
  },
  11: {
    structure: ['If'],
    cases: [4, 5, 9, 0].map((n) => ({
      inputs: [String(n)],
      output: n >= 5 ? 'Portal aberto' : '',
      minInputs: 1,
    })),
  },
  12: {
    structure: ['If'],
    hasElse: true,
    cases: [11, 12, 16, 0].map((n) => ({
      inputs: [String(n)],
      output: n >= 12 ? 'Pode entrar' : 'Volte depois',
      minInputs: 1,
    })),
  },
  13: {
    structure: ['If'],
    hasElif: true,
    cases: [49, 50, 79, 80, 100, 0].map((n) => ({
      inputs: [String(n)],
      output: n >= 80 ? 'Ouro' : n >= 50 ? 'Prata' : 'Bronze',
      minInputs: 1,
    })),
  },
  14: {
    structure: ['And'],
    cases: [
      { inputs: ['3', 'sim'], output: 'Pode passar', minInputs: 2 },
      { inputs: ['0', 'sim'], output: 'Acesso negado', minInputs: 2 },
      { inputs: ['5', 'nao'], output: 'Acesso negado', minInputs: 2 },
      { inputs: ['-1', 'nao'], output: 'Acesso negado', minInputs: 2 },
    ],
  },
  15: {
    structure: ['If'],
    cases: [
      { inputs: ['floresta', 'tocha'], output: 'Tesouro encontrado', minInputs: 2 },
      { inputs: ['floresta', 'corda'], output: 'Muito escuro', minInputs: 2 },
      { inputs: ['rio', 'corda'], output: 'Travessia segura', minInputs: 2 },
      { inputs: ['rio', 'tocha'], output: 'Ponte quebrada', minInputs: 2 },
    ],
  },
  16: { structure: ['While'], cases: [{ output: '1\n2\n3' }] },
  17: { structure: ['For'], cases: [{ output: 'S\nO\nL' }] },
  18: {
    structure: ['For'],
    calls: ['range'],
    cases: [1, 3, 5, 8].map((n) => ({
      inputs: [String(n)],
      output: Array.from({ length: n }, (_, i) => i + 1).join('\n'),
      minInputs: 1,
    })),
  },
  19: {
    structure: ['List', 'For', 'Subscript'],
    calls: ['len'],
    reads: ['inventario'],
    cases: [
      { output: 'mapa\n3\nmapa\ncorda\ntocha', values: { inventario: ['mapa', 'corda', 'tocha'] } },
    ],
  },
  20: {
    anyLoop: true,
    structure: ['Break'],
    cases: [
      { inputs: ['7'], output: 'Acertou!', minInputs: 1 },
      { inputs: ['3', '7'], output: 'Tente de novo\nAcertou!', minInputs: 2 },
      { inputs: ['1', '2', '7'], output: 'Tente de novo\nTente de novo\nAcertou!', minInputs: 3 },
      {
        inputs: ['1', '2', '3'],
        output: 'Tente de novo\nTente de novo\nTente de novo\nFim das tentativas',
        minInputs: 3,
      },
    ],
  },
  21: {
    functions: [{ name: 'saudar' }],
    cases: [
      {
        output: 'Olá, viajante!',
        call: { name: 'saudar', args: [], expected: null, output: 'Olá, viajante!' },
      },
    ],
  },
  22: {
    functions: [{ name: 'dobro', structure: ['Return'] }],
    cases: [0, 4, -3, 9, 2.5].map((n) => ({ call: { name: 'dobro', args: [n], expected: n * 2 } })),
  },
  23: {
    functions: [{ name: 'preparar_nome', structure: ['Return'] }],
    cases: ['  lia  ', 'Ravi', '  ana clara ', '', ' ágata '].map((text) => ({
      call: { name: 'preparar_nome', args: [text], expected: text.trim().toUpperCase() },
    })),
  },
  24: {
    functions: [{ name: 'somar', structure: ['Return'] }],
    cases: [
      [3, 2],
      [-4, 2],
      [0, 0],
      [1.5, 2.5],
    ].map(([a, b]) => ({ call: { name: 'somar', args: [a, b], expected: a + b } })),
  },
  25: {
    functions: [{ name: 'jogar', structure: ['If', 'Return'], anyLoop: true }],
    cases: [
      ['explorar', 'descansar', 'explorar'],
      ['descansar', 'descansar', 'descansar'],
      ['explorar', 'explorar', 'explorar'],
      ['descansar', 'explorar', 'descansar'],
    ].map((inputs) => {
      const total = inputs.filter((action) => action === 'explorar').length * 2;
      return {
        inputs,
        minInputs: 3,
        output: `Moedas: ${total}\n${total >= 4 ? 'Vitória!' : 'Continue explorando'}`,
        call: { name: 'jogar', args: [], inputs, expected: total, output: '' },
      };
    }),
  },
});
