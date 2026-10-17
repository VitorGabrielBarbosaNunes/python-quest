import { level, quiz as q } from './helpers.js';
export const world1 = [
  level(
    1,
    'Uma aventura começa',
    'Entender que um programa é uma sequência de instruções.',
    [
      'Python é uma linguagem de programação: uma maneira de escrever instruções que o computador consegue executar. Um programa é uma sequência dessas instruções.',
      'O computador segue as instruções na ordem em que aparecem, de cima para baixo. Neste primeiro encontro, print() mostra uma mensagem na tela. O texto fica entre aspas.',
      'Você não precisa decorar nada agora. Observe as duas instruções, execute o exemplo e descubra como uma pequena mudança transforma o resultado.',
    ],
    'print("Olá, explorador!")\nprint("Sua aventura começou.")',
    'Olá, explorador!\nSua aventura começou.',
    [
      q(
        'O que é um programa?',
        [
          'Uma sequência de instruções para o computador.',
          'Uma imagem que o computador adivinha.',
          'Uma linguagem usada apenas para cálculos.',
        ],
        0,
        [
          'Isso! Você escreve instruções para dizer o que deve acontecer.',
          'O computador não adivinha: ele segue instruções que escrevemos.',
          'Um programa pode trabalhar com textos, jogos, números e muito mais.',
        ],
      ),
      q(
        'No exemplo, qual mensagem aparece primeiro?',
        ['Sua aventura começou.', 'Olá, explorador!'],
        1,
        [
          'Essa instrução vem na segunda linha. Python começa pela primeira.',
          'Exatamente! A primeira instrução é executada antes da segunda.',
        ],
      ),
    ],
    {
      mode: 'complete',
      prompt:
        'Acenda o portal da aventura! Complete o texto entre aspas para mostrar exatamente Olá, Python! na saída.',
      starter: 'print("___")',
      hints: [
        'print() mostra na tela o que está entre parênteses.',
        'Mantenha as aspas: elas indicam que o conteúdo é um texto.',
        'Troque apenas ___ por Olá, Python! e mantenha o ponto de exclamação.',
      ],
      summary:
        'Você executou seu primeiro programa e descobriu que o computador segue instruções em ordem.',
    },
  ),
  level(
    2,
    'Uma voz para o seu código',
    'Usar print() para exibir mensagens em sequência.',
    [
      'print() é uma função: uma instrução com um nome que realiza uma tarefa. Aqui, a tarefa é exibir algo na saída.',
      'Escreva o texto entre aspas e coloque tudo entre parênteses. Cada print() começa uma nova linha. Aspas simples e duplas funcionam, desde que você feche com o mesmo tipo.',
    ],
    'print("Olá!")\nprint("Vamos explorar.")',
    'Olá!\nVamos explorar.',
    [
      q(
        'Qual instrução mostra a palavra Portal?',
        ['print(Portal)', 'print("Portal")', 'Print("Portal")'],
        1,
        [
          'Sem aspas, Python procura um nome chamado Portal. Ainda não criamos esse nome.',
          'Certo! O texto está entre aspas e dentro dos parênteses.',
          'Os nomes diferenciam maiúsculas e minúsculas: use print com p minúsculo.',
        ],
      ),
      q(
        'Duas instruções print(), uma depois da outra, normalmente produzem…',
        ['Duas linhas de saída.', 'Nenhuma saída.'],
        0,
        [
          'Isso! Cada print() termina sua mensagem com uma quebra de linha.',
          'Cada print() mostra uma mensagem; aqui teremos duas linhas.',
        ],
      ),
    ],
    {
      mode: 'order',
      prompt:
        'Organize as instruções: primeiro mostre Portal aberto, depois mostre Vamos aprender!. Use os botões para mover as linhas ou edite o código.',
      starter: 'print("Vamos aprender!")\nprint("Portal aberto")',
      hints: [
        'O computador lê as instruções de cima para baixo.',
        'A mensagem Portal aberto deve estar na primeira linha.',
        'Mova a instrução com Vamos aprender! para depois da outra.',
      ],
      summary: 'Você usou print() e organizou instruções para controlar a saída.',
    },
  ),
  level(
    3,
    'O que cabe no inventário?',
    'Distinguir textos, números inteiros, decimais e booleanos.',
    [
      'Um texto é chamado de str e fica entre aspas: "poção". Um número inteiro, como 3, é do tipo int. Um número decimal, como 2.5, é do tipo float; em Python usamos ponto, não vírgula.',
      'Também existe bool: os valores True e False representam verdadeiro e falso. Letras maiúsculas no início são necessárias.',
      'Números sem aspas podem participar de cálculos. "3" é um texto; 3 é um número. A função type() permite investigar o tipo de um valor.',
    ],
    'print(3 + 2)\nprint("3" + "2")\nprint(True)',
    '5\n32\nTrue',
    [
      q('Qual valor é um número decimal em Python?', ['"2.5"', '2.5', '2,5'], 1, [
        'Entre aspas, esse valor é texto.',
        'Isso! O ponto separa a parte inteira da decimal.',
        'Uma vírgula não forma um número decimal em Python. Use ponto.',
      ]),
      q('Qual é o resultado de "3" + "2"?', ['5', '32'], 1, [
        'Somar textos junta suas partes. Para somar números, retire as aspas.',
        'Isso! O operador + une esses dois textos.',
      ]),
    ],
    {
      mode: 'predict',
      prompt:
        'Primeiro preveja: o código deveria calcular 7 + 5. Corrija-o para que a saída seja o número 12, usando uma soma entre números.',
      starter: 'print("7" + "5")',
      prediction: 'Qual será a saída antes da correção?',
      predictionOptions: ['12', '75'],
      predictionCorrect: 1,
      hints: [
        'Textos são unidos; números são somados.',
        'Aspas transformam os valores em texto.',
        'Mantenha o sinal + e remova as aspas em volta dos dois números.',
      ],
      summary: 'Você diferenciou dados e usou números em uma expressão.',
    },
  ),
  level(
    4,
    'Nomes que guardam histórias',
    'Criar variáveis e reutilizar seus valores.',
    [
      'Uma variável associa um nome a um valor. Em nome = "Lia", o sinal = guarda o texto "Lia" no nome escolhido. Não é uma pergunta de igualdade.',
      'Para usar o valor depois, escreva o nome sem aspas. print(nome) mostra Lia, enquanto print("nome") mostra a palavra nome.',
      'Escolha nomes claros. Use letras, números e _; não comece com número nem use espaços. A variável pode receber um novo valor durante o programa.',
    ],
    'moedas = 3\nmoedas = moedas + 2\nprint(moedas)',
    '5',
    [
      q(
        'O que faz nome = "Lia"?',
        ['Exibe Lia imediatamente.', 'Associa o texto Lia à variável nome.'],
        1,
        [
          'Para exibir, precisamos chamar print().',
          'Certo! Depois podemos reutilizar esse valor pelo nome.',
        ],
      ),
      q(
        'Depois de pontos = 8, como mostrar seu valor?',
        ['print("pontos")', 'print(pontos)', 'print(Pontos)'],
        1,
        [
          'Com aspas, a saída seria a palavra pontos.',
          'Isso! Sem aspas, Python busca o valor da variável.',
          'Pontos e pontos são nomes diferentes. Use a mesma grafia.',
        ],
      ),
    ],
    {
      mode: 'fix',
      prompt:
        'Você encontrou um erro no inventário. Crie a variável moedas com o valor 8 e mostre seu valor. Corrija o nome usado no print().',
      starter: 'moedas = 8\nprint(moeda)',
      hints: [
        'Leia o nome da variável em cada linha, letra por letra.',
        'Python só conhece os nomes que você já criou.',
        'O nome definido na primeira linha termina com s.',
      ],
      summary: 'Você criou uma variável e corrigiu um nome que não existia.',
    },
  ),
  level(
    5,
    'Sua identidade de explorador',
    'Combinar variáveis, números e saída em um cartão de apresentação.',
    [
      'Chegou a primeira missão especial! Um programa pode guardar várias informações e apresentá-las na ordem que você escolher.',
      'Vamos criar um cartão. Guarde cada informação em uma variável com um nome claro. Depois use print() para mostrar o conteúdo, uma informação por linha.',
      'Os valores desta missão são combinados com o teste. Depois de concluir, experimente personalizar seu cartão com outros valores usando Executar.',
    ],
    'nome = "Bia"\nidade = 18\nprint(nome)\nprint(idade)',
    'Bia\n18',
    [
      q(
        'Qual é a vantagem de guardar o nome em uma variável?',
        ['Reutilizar e alterar o valor em um lugar.', 'Impedir que o valor seja exibido.'],
        0,
        [
          'Exatamente! Um nome claro facilita usar a informação novamente.',
          'Variáveis podem ser exibidas com print().',
        ],
      ),
      q('Qual variável guarda um número inteiro?', ['idade = "16"', 'idade = 16'], 1, [
        'Entre aspas, 16 é texto.',
        'Certo! Sem aspas, 16 é um número inteiro.',
      ]),
    ],
    {
      prompt:
        'Crie nome = "Lia", idade = 16 e habilidade = "Explorar". Mostre os três valores, nessa ordem, um por linha. Use as variáveis nos prints.',
      starter: '# Crie as três variáveis\n\n# Mostre seu cartão\n',
      hints: [
        'Cada informação precisa de um nome e um valor.',
        'Textos precisam de aspas; idade deve guardar um número.',
        'Depois de criar nome, a instrução print(nome) mostra seu valor. Faça o mesmo com as outras informações.',
      ],
      summary: 'Você combinou tipos, variáveis e instruções para criar um cartão de apresentação.',
    },
  ),
];
