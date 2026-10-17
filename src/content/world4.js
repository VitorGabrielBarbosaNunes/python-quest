import { level, quiz as q } from './helpers.js';
export const world4 = [
  level(
    16,
    'Passos que se repetem',
    'Repetir um bloco com while e criar uma condição de parada.',
    [
      'while significa "enquanto". O bloco se repete enquanto a condição for verdadeira. Antes de cada repetição, Python verifica a condição novamente.',
      'Você precisa permitir que a condição se torne falsa. Um contador pode aumentar a cada passo, até alcançar o limite.',
      'Se esquecer de atualizar o contador, o loop pode continuar sem parar. Neste jogo, o limite de tempo interrompe o programa para você poder corrigir.',
    ],
    'passo = 1\nwhile passo <= 3:\n    print(passo)\n    passo = passo + 1',
    '1\n2\n3',
    [
      q(
        'O que evita que esse while se repita para sempre?',
        ['O contador aumenta dentro do bloco.', 'A palavra print encerra o loop.'],
        0,
        [
          'Exato! Em algum momento, passo fica maior que 3.',
          'print() apenas mostra algo. O contador precisa mudar para encerrar esse loop.',
        ],
      ),
      q(
        'Se a condição já for False antes da primeira repetição…',
        ['O bloco não será executado.', 'O bloco será executado uma vez.'],
        0,
        [
          'Isso! while verifica a condição antes de entrar.',
          'A condição é verificada antes da primeira execução também.',
        ],
      ),
    ],
    {
      mode: 'fix',
      prompt:
        'Corrija o contador para mostrar 1, 2 e 3, um por linha, usando while. O código inicial não avança; adicione a atualização dentro do bloco.',
      starter: 'passo = 1\nwhile passo <= 3:\n    print(passo)\n    # Atualize o contador aqui',
      hints: [
        'A condição depende da variável passo.',
        'A cada repetição, aumente passo em uma unidade.',
        'Dentro do bloco, depois do print, use uma atribuição que some 1 ao valor atual.',
      ],
      summary: 'Você criou uma repetição com parada e corrigiu a causa de um loop infinito.',
    },
  ),
  level(
    17,
    'Uma letra por vez',
    'Percorrer uma sequência com for.',
    [
      'for percorre os elementos de uma sequência. Um texto é uma sequência de caracteres: letras, números, espaços e símbolos.',
      'Em for letra in "SOL":, a variável letra recebe S, depois O e depois L. O bloco é executado uma vez para cada caractere.',
      'O for avança automaticamente. Diferentemente do exemplo de while, você não precisa atualizar um contador para percorrer o texto.',
    ],
    'for letra in "LUA":\n    print(letra)',
    'L\nU\nA',
    [
      q('Quantas vezes for letra in "SOL" executa seu bloco?', ['Uma.', 'Três.', 'Infinitas.'], 1, [
        'O texto inteiro não é passado de uma vez; cada caractere recebe uma vez.',
        'Isso! Uma vez para S, outra para O e outra para L.',
        'O for termina quando acaba a sequência.',
      ]),
      q(
        'O que a variável letra representa em cada repetição?',
        ['Um caractere da sequência.', 'Sempre a palavra inteira.'],
        0,
        ['Certo! O valor muda a cada passo do for.', 'O for percorre um caractere por vez.'],
      ),
    ],
    {
      prompt:
        'Use um for para percorrer o texto SOL e mostrar uma letra por linha. A saída deve ser S, O e L em três linhas.',
      starter: '# Percorra as letras de SOL\n',
      hints: [
        'Use for, um nome de variável, in e o texto entre aspas.',
        'Termine a linha do for com dois-pontos.',
        'No bloco com quatro espaços, use print() com a variável que representa cada letra.',
      ],
      summary: 'Você percorreu uma sequência automaticamente com for.',
    },
  ),
  level(
    18,
    'A escadaria do range',
    'Gerar sequências de números com range().',
    [
      'range() produz uma sequência de inteiros. range(3) representa 0, 1 e 2. O limite final não entra na sequência.',
      'Com dois valores, você escolhe o início: range(1, 4) representa 1, 2 e 3. Para incluir um número final n, use n + 1 como limite.',
      'É comum combinar for e range() para contar passos. Um terceiro valor controla o salto: range(0, 6, 2) passa por 0, 2 e 4.',
    ],
    'for degrau in range(1, 4):\n    print(degrau)',
    '1\n2\n3',
    [
      q('Quais valores aparecem em range(3)?', ['1, 2, 3', '0, 1, 2'], 1, [
        'Sem informar o início, range começa em 0 e exclui o limite final.',
        'Correto! Começa em 0 e para antes de 3.',
      ]),
      q('Para contar de 1 até 5, incluindo 5, use…', ['range(1, 5)', 'range(1, 6)'], 1, [
        'O 5 seria excluído. O último valor seria 4.',
        'Isso! O limite 6 é excluído e o 5 aparece.',
      ]),
    ],
    {
      prompt:
        'Leia um inteiro n, entre 1 e 8. Use for e range() para mostrar os números de 1 até n, incluindo n, um por linha.',
      inputs: ['3'],
      starter: 'n = int(input())\n# Conte de 1 até n\n',
      hints: [
        'A sequência começa em 1.',
        'O limite final de range() é excluído.',
        'Use n + 1 como limite para que o número n também seja mostrado.',
      ],
      summary: 'Você gerou uma sequência cujo tamanho depende da entrada.',
    },
  ),
  level(
    19,
    'Um inventário de descobertas',
    'Criar uma lista, acessar posições e percorrer seus itens.',
    [
      'Uma lista reúne vários valores em ordem. Use colchetes e separe os itens com vírgulas: itens = ["mapa", "corda"].',
      'As posições começam em zero. itens[0] acessa o primeiro item e itens[1] acessa o segundo. Uma posição que não existe provoca IndexError.',
      'len(itens) informa quantos itens existem. for item in itens percorre um por vez. Você também pode acrescentar algo com itens.append("tocha").',
    ],
    'itens = ["mapa", "corda"]\nprint(itens[0])\nprint(len(itens))\nfor item in itens:\n    print(item)',
    'mapa\n2\nmapa\ncorda',
    [
      q('Qual posição contém o primeiro item de uma lista?', ['0', '1'], 0, [
        'Isso! A contagem das posições começa em zero.',
        'A posição 1 contém o segundo item.',
      ]),
      q('O que len(["mapa", "corda", "tocha"]) devolve?', ['2', '3'], 1, [
        '2 é a posição do último item. A quantidade é 3.',
        'Certo! len() conta os itens, não a posição final.',
      ]),
    ],
    {
      prompt:
        'Crie inventario = ["mapa", "corda", "tocha"]. Primeiro mostre inventario[0], depois a quantidade usando len(). Por fim, percorra a lista com for e mostre cada item. A saída será mapa, 3, mapa, corda, tocha, uma informação por linha.',
      starter: '# Crie seu inventário\n\n# Acesse, conte e percorra os itens\n',
      hints: [
        'Guarde os três textos em uma lista chamada inventario.',
        'O primeiro item fica na posição 0 e len(inventario) conta os itens.',
        'Use for item in inventario: e mostre item dentro do bloco.',
      ],
      summary: 'Você reuniu dados em uma lista, acessou um item e percorreu todos eles.',
    },
  ),
  level(
    20,
    'O número escondido',
    'Criar um jogo de adivinhação com até três tentativas.',
    [
      'Vamos combinar repetições, entradas e decisões em um pequeno jogo. Para os testes serem reproduzíveis, o número secreto desta missão será sempre 7.',
      'O comando break encerra o loop imediatamente. Use-o quando a pessoa acertar. Você pode guardar em uma variável booleana se houve acerto.',
      'Depois do loop, essa variável ajuda a decidir se deve mostrar a mensagem de fim das tentativas. Leia um palpite por repetição e não peça mais entradas após um acerto.',
    ],
    'for numero in range(1, 4):\n    if numero == 2:\n        break\n    print(numero)',
    '1',
    [
      q(
        'O que break faz dentro de um loop?',
        ['Encerra o loop imediatamente.', 'Reinicia o programa.'],
        0,
        [
          'Certo! O programa segue na linha após o loop.',
          'break encerra apenas o loop mais próximo, sem reiniciar o programa.',
        ],
      ),
      q(
        'Por que usar um segredo fixo nos testes?',
        [
          'Para conseguir repetir e conferir os mesmos resultados.',
          'Porque Python não pode gerar números aleatórios.',
        ],
        0,
        [
          'Isso! Com entradas conhecidas, sabemos qual resultado esperar.',
          'Python pode gerar números aleatórios, mas um segredo fixo facilita verificar esta missão.',
        ],
      ),
    ],
    {
      prompt:
        'O segredo é 7. Leia no máximo três palpites inteiros. Para cada erro, mostre Tente de novo. Ao acertar, mostre Acertou! e encerre o loop com break. Se os três palpites estiverem errados, mostre também Fim das tentativas depois do último erro. Não leia entradas após o acerto.',
      inputs: ['3', '7'],
      starter:
        'segredo = 7\nacertou = False\n# Crie o loop de até três tentativas\n\n# Se não houve acerto, mostre a mensagem final\n',
      hints: [
        'Use for com range(3) ou um while com contador.',
        'Compare cada palpite com segredo. No acerto, mude acertou para True, mostre a mensagem e use break.',
        'Após o loop, if not acertou: permite mostrar Fim das tentativas apenas quando ninguém acertou.',
      ],
      summary:
        'Você criou um jogo que reage aos palpites, respeita um limite e termina no momento certo.',
    },
  ),
];
