import { level, quiz as q } from './helpers.js';
export const world3 = [
  level(
    11,
    'Um caminho se abre',
    'Executar um bloco somente quando uma condição for verdadeira.',
    [
      'if significa "se". Escrevemos uma condição depois dessa palavra. Se ela for True, as linhas do bloco serão executadas. Se for False, o bloco será pulado.',
      'Coloque dois-pontos no fim da linha do if. Nas linhas do bloco, coloque quatro espaços à esquerda. Esse recuo se chama indentação e faz parte da linguagem.',
      'As linhas que voltam à margem esquerda ficam fora do bloco. Elas continuam sendo executadas depois da decisão.',
    ],
    'moedas = 8\nif moedas >= 5:\n    print("Pode passar!")\nprint("Até logo.")',
    'Pode passar!\nAté logo.',
    [
      q(
        'Quando o bloco de um if é executado?',
        ['Quando a condição é True.', 'Sempre, mesmo com False.'],
        0,
        [
          'Isso! A condição decide se o bloco será executado.',
          'Com False, Python pula o bloco do if.',
        ],
      ),
      q(
        'O que os quatro espaços antes do print indicam?',
        ['Que o print pertence ao bloco do if.', 'Que o print é um comentário.'],
        0,
        [
          'Certo! A indentação organiza os blocos do programa.',
          'Comentários começam com #. Espaços no início indicam o bloco.',
        ],
      ),
    ],
    {
      mode: 'complete',
      prompt:
        'Leia um inteiro com input(). Se ele for maior ou igual a 5, mostre Portal aberto. Se for menor, não mostre nada. Complete a condição e a mensagem.',
      inputs: ['5'],
      starter: 'moedas = int(input())\nif ___:\n    print("___")',
      hints: [
        'A condição precisa comparar moedas com 5.',
        'O portão aceita o valor 5 também, então use >=.',
        'O print deve continuar com quatro espaços e mostrar exatamente Portal aberto.',
      ],
      summary: 'Você fez um programa escolher quando executar uma instrução.',
    },
  ),
  level(
    12,
    'Dois caminhos possíveis',
    'Usar else para tratar a alternativa de uma condição.',
    [
      'else significa "senão". Ele acompanha um if e executa seu bloco quando a condição do if é falsa.',
      'if e else ficam alinhados à esquerda. Cada bloco recebe seus próprios quatro espaços. O else também termina com dois-pontos, mas não recebe uma condição.',
      'Assim o programa sempre escolhe um dos dois caminhos. Apenas um bloco será executado nessa decisão.',
    ],
    'energia = 0\nif energia > 0:\n    print("Vamos explorar!")\nelse:\n    print("Hora de descansar.")',
    'Hora de descansar.',
    [
      q(
        'Se a condição do if for falsa, o que acontece com o else?',
        ['Seu bloco é executado.', 'O programa sempre para com erro.'],
        0,
        [
          'Exatamente! O else oferece um caminho alternativo.',
          'False é um resultado normal. O else cuida dessa situação.',
        ],
      ),
      q('Como deve começar a linha da alternativa?', ['else energia == 0:', 'else:'], 1, [
        'else não precisa de condição: ele cobre os outros casos.',
        'Isso! Só else e os dois-pontos.',
      ]),
    ],
    {
      prompt:
        'Leia a idade como inteiro. Se a idade for pelo menos 12, mostre Pode entrar. Senão, mostre Volte depois. Use if e else.',
      inputs: ['12'],
      starter: 'idade = int(input())\n# Escolha uma das duas mensagens\n',
      hints: [
        'Pelo menos 12 inclui a própria idade 12.',
        'O if deve comparar idade >= 12.',
        'Alinhe else: com if e recue os dois prints em seus respectivos blocos.',
      ],
      summary: 'Você criou dois caminhos e deu uma resposta para cada situação.',
    },
  ),
  level(
    13,
    'A trilha das três medalhas',
    'Escolher entre vários caminhos com elif.',
    [
      'Quando existem mais de duas possibilidades, usamos elif, que significa "senão, se". Ele permite testar outra condição se as anteriores forem falsas.',
      'Python avalia de cima para baixo e executa apenas o primeiro bloco cuja condição for verdadeira. O else, quando existe, cobre o que sobrou.',
      'Para classificar pontuações, comece pelo limite mais alto. Uma pontuação 90 também é maior que 50; se testar 50 primeiro, a medalha pode ficar errada.',
    ],
    'pontos = 60\nif pontos >= 80:\n    print("Ouro")\nelif pontos >= 50:\n    print("Prata")\nelse:\n    print("Bronze")',
    'Prata',
    [
      q(
        'Qual condição deve vir primeiro para premiar corretamente?',
        ['pontos >= 50', 'pontos >= 80'],
        1,
        [
          'Se 50 vier primeiro, a pontuação 90 também entrará nesse bloco.',
          'Isso! Começar pelo maior limite evita capturar pontuações altas antes da hora.',
        ],
      ),
      q(
        'Quantos blocos dessa cadeia if/elif/else são executados?',
        ['Apenas um.', 'Todos que tenham condições verdadeiras.'],
        0,
        [
          'Certo! A primeira condição verdadeira escolhe o bloco.',
          'A cadeia para na primeira condição verdadeira. Outros if separados seriam diferentes.',
        ],
      ),
    ],
    {
      prompt:
        'Leia uma pontuação inteira. Mostre Ouro para 80 ou mais, Prata para 50 a 79 e Bronze para menos de 50. Use if, elif e else.',
      inputs: ['60'],
      starter: 'pontos = int(input())\n# Classifique a pontuação\n',
      hints: [
        'Comece pela maior faixa de pontuação.',
        'Depois do if, use elif para testar a segunda faixa.',
        'Após excluir os valores de 80 ou mais, pontos >= 50 já representa a faixa da Prata.',
      ],
      summary: 'Você organizou várias possibilidades em uma cadeia de decisões.',
    },
  ),
  level(
    14,
    'Duas chaves, um portal',
    'Combinar condições com and, or e not.',
    [
      'and significa "e": as duas condições precisam ser verdadeiras. or significa "ou": basta que pelo menos uma seja verdadeira.',
      'not significa "não" e inverte um booleano. not True resulta em False. É útil, por exemplo, para perguntar se uma porta não está trancada.',
      'Use parênteses quando combinar várias operações para deixar a intenção clara. Aqui o portal exige energia positiva e uma chave ao mesmo tempo.',
    ],
    'energia = 3\ntem_chave = True\nprint(energia > 0 and tem_chave)\nprint(False or True)\nprint(not tem_chave)',
    'True\nTrue\nFalse',
    [
      q('Para exigir energia E uma chave, qual operador usar?', ['or', 'and', 'not'], 1, [
        'or aceitaria apenas uma das condições. Precisamos das duas.',
        'Isso! and exige que as duas condições sejam verdadeiras.',
        'not inverte uma condição, sem unir duas exigências.',
      ]),
      q('Qual é o resultado de not False?', ['True', 'False'], 0, [
        'Correto! not inverte o valor.',
        'not transforma False em True.',
      ]),
    ],
    {
      prompt:
        'Leia a energia como inteiro e, em outra entrada, a resposta sobre a chave (sim ou nao). Com energia maior que 0 e chave igual a sim, mostre Pode passar. Caso contrário, mostre Acesso negado. Use and.',
      inputs: ['3', 'sim'],
      starter: 'energia = int(input())\nchave = input()\n# Combine as duas condições\n',
      hints: [
        'Você precisa de duas comparações na mesma condição.',
        'Compare energia > 0 e chave == "sim".',
        'Una as comparações com and e use else para o acesso negado.',
      ],
      summary: 'Você combinou exigências e conheceu os três operadores lógicos.',
    },
  ),
  level(
    15,
    'O segredo da floresta',
    'Criar uma aventura com escolhas e consequências.',
    [
      'Uma aventura textual é um programa que narra uma história e usa as escolhas da pessoa para decidir o próximo acontecimento.',
      'Planeje as combinações. Nesta missão, há dois caminhos e dois equipamentos. Você pode usar if dentro de outro if ou combinar condições com and.',
      'Leia as duas escolhas antes de decidir. Use mensagens claras e confira todas as combinações: uma aventura precisa funcionar em mais de um caminho.',
    ],
    'caminho = "ponte"\nitem = "corda"\nif caminho == "ponte" and item == "corda":\n    print("Travessia segura")\nelse:\n    print("Procure outra rota")',
    'Travessia segura',
    [
      q(
        'Por que testar escolhas diferentes em uma aventura?',
        [
          'Para conferir se cada caminho produz o resultado certo.',
          'Porque um único caminho sempre prova que todo o jogo funciona.',
        ],
        0,
        [
          'Isso! Um caminho correto não garante os outros.',
          'Outras escolhas podem revelar erros que o primeiro caminho não mostrou.',
        ],
      ),
      q(
        'Como combinar um caminho e um equipamento específicos?',
        ['Usar and entre as duas comparações.', 'Usar = entre as condições.'],
        0,
        [
          'Certo! As duas escolhas precisam corresponder à combinação.',
          'Um = atribui valor. Use comparações com == e una com and.',
        ],
      ),
    ],
    {
      prompt:
        'Leia duas entradas: caminho (floresta ou rio) e equipamento (tocha ou corda). Mostre uma única mensagem: floresta + tocha → Tesouro encontrado; floresta + corda → Muito escuro; rio + corda → Travessia segura; rio + tocha → Ponte quebrada. As entradas terão exatamente esses valores.',
      inputs: ['floresta', 'tocha'],
      starter: '# Leia o caminho e o equipamento\n\n# Conte o resultado de cada combinação\n',
      hints: [
        'São quatro combinações. Anote a mensagem de cada uma antes de escrever.',
        'Você pode decidir primeiro o caminho e depois o equipamento dentro de cada bloco.',
        'Também é possível usar if caminho == "floresta" and equipamento == "tocha":, seguido de elif para outras combinações.',
      ],
      summary:
        'Você criou uma aventura textual com quatro resultados e escolhas que fazem diferença.',
    },
  ),
];
