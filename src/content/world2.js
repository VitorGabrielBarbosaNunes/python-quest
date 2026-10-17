import { level, quiz as q } from './helpers.js';
export const world2 = [
  level(
    6,
    'Contas na mochila',
    'Calcular usando os operadores matemáticos.',
    [
      'Python também calcula! Use + para somar, - para subtrair, * para multiplicar e / para dividir. A divisão com / produz um número decimal, mesmo quando não há resto.',
      'Multiplicação e divisão são resolvidas antes da soma e da subtração. Use parênteses para escolher outra ordem: (2 + 3) * 4 vale 20.',
      'Para explorar depois: // faz a divisão inteira, % calcula o resto e ** calcula uma potência. Experimente 7 // 2, 7 % 2 e 2 ** 3 no editor.',
    ],
    'print(6 + 2)\nprint(6 * 2)\nprint(6 / 2)',
    '8\n12\n3.0',
    [
      q('Qual expressão calcula três pacotes de quatro moedas?', ['3 + 4', '3 * 4', '3 / 4'], 1, [
        'Somar junta 3 e 4; queremos repetir um grupo de 4 três vezes.',
        'Certo! A multiplicação calcula três grupos de quatro.',
        'A divisão reparte uma quantidade, em vez de multiplicá-la.',
      ]),
      q('Quanto vale (2 + 3) * 4?', ['14', '20'], 1, [
        '14 seria o resultado sem os parênteses: 2 + 3 * 4.',
        'Isso! Primeiro 2 + 3, depois 5 * 4.',
      ]),
    ],
    {
      mode: 'complete',
      prompt:
        'A mochila tem 3 bolsas com 4 moedas cada. Calcule o total com multiplicação e mostre 12. Complete o operador.',
      starter: 'print(3 ___ 4)',
      hints: [
        'Precisamos de três grupos com quatro moedas.',
        'Em Python, multiplicação usa um asterisco.',
        'Substitua ___ pelo operador * e execute.',
      ],
      summary: 'Você usou um operador matemático para transformar uma situação em cálculo.',
    },
  ),
  level(
    7,
    'O portão das comparações',
    'Comparar valores e interpretar True e False.',
    [
      'Comparações são perguntas que o programa consegue responder. 5 > 3 pergunta se 5 é maior que 3. A resposta é True, que significa verdadeiro.',
      'Use <, >, <= e >= para comparar tamanhos. Use == para perguntar se os valores são iguais e != para perguntar se são diferentes.',
      'Atenção: = guarda um valor; == compara dois valores. O resultado de uma comparação é um bool: True ou False.',
    ],
    'print(5 > 3)\nprint(5 == 3)\nprint(5 != 3)',
    'True\nFalse\nTrue',
    [
      q('Como perguntar se moedas é igual a 10?', ['moedas = 10', 'moedas == 10'], 1, [
        'Um só = atribui o valor 10 à variável.',
        'Exato! Dois sinais de igual fazem uma comparação.',
      ]),
      q('Qual é o resultado de 4 >= 4?', ['True', 'False'], 0, [
        'Isso! >= aceita valores maiores ou iguais.',
        'Como os valores são iguais, a comparação é verdadeira.',
      ]),
    ],
    {
      prompt:
        'Crie moedas = 8. Compare se moedas é maior ou igual a 5 e mostre o resultado. A saída deve ser True. Use a variável na comparação.',
      starter: 'moedas = 8\n# Compare moedas com 5\n',
      hints: [
        'O portão exige pelo menos cinco moedas.',
        'Maior ou igual é escrito como >=.',
        'Você pode colocar uma comparação diretamente dentro de print().',
      ],
      summary: 'Você transformou uma pergunta em uma comparação que produz um valor booleano.',
    },
  ),
  level(
    8,
    'A vila quer conhecer você',
    'Ler um texto com input() e usar a resposta.',
    [
      'input() lê uma resposta do usuário e a devolve como texto. Você pode guardar a resposta em uma variável: nome = input("Seu nome: ").',
      'Neste jogo, preencha o campo Entradas antes de executar. Cada linha é usada por um input(), na ordem. Os textos das perguntas não aparecem na saída avaliada.',
      'Para juntar uma saudação com o nome, use + entre textos. Lembre-se do espaço depois da vírgula. A avaliação experimentará nomes diferentes.',
    ],
    'nome = input("Seu nome: ")\nprint("Bem-vindo, " + nome)',
    'Bem-vindo, Lia',
    [
      q(
        'Qual tipo input() devolve?',
        ['Sempre um número.', 'Um texto, mesmo quando você digita números.'],
        1,
        [
          'Digitar 16 não o transforma em número automaticamente.',
          'Certo! Mais adiante vamos converter textos quando precisarmos calcular.',
        ],
      ),
      q(
        'Como usar a resposta de input() depois?',
        ['Guardar em uma variável.', 'Escrever a palavra input entre aspas.'],
        0,
        [
          'Isso! Uma variável permite usar a resposta em outras linhas.',
          'Entre aspas, "input" é apenas um texto.',
        ],
      ),
    ],
    {
      prompt:
        'Leia um nome usando input() e mostre Olá, seguido de um espaço e do nome. Para a entrada Lia, a saída deve ser Olá, Lia. Seu programa deve funcionar com qualquer nome.',
      inputs: ['Lia'],
      starter: 'nome = input("Qual é seu nome? ")\n# Mostre a saudação\n',
      hints: [
        'A resposta já está guardada em nome.',
        'Use + para juntar "Olá, " ao texto recebido.',
        'Dentro de print(), combine o texto da saudação com a variável nome, sem aspas em volta da variável.',
      ],
      summary: 'Seu programa agora recebe informações e responde a pessoas diferentes.',
    },
  ),
  level(
    9,
    'A oficina dos tipos',
    'Converter entradas com int(), float() e str().',
    [
      'Para calcular com uma resposta de input(), converta o texto. int("3") produz o inteiro 3. float("2.5") produz o decimal 2.5; use ponto no campo de entrada.',
      'str() faz o caminho de volta: str(12) produz o texto "12". Isso ajuda a juntar um resultado numérico com uma mensagem.',
      'Se o texto não representa um número, a conversão gera ValueError. Para este desafio, use quantidades inteiras e preços decimais válidos.',
    ],
    'quantidade = int("2")\npreco = float("3.5")\ntotal = quantidade * preco\nprint("Total: " + str(total))',
    'Total: 7.0',
    [
      q(
        'Qual conversão aceita o texto "2.5" como número decimal?',
        ['int("2.5")', 'float("2.5")'],
        1,
        [
          'int() espera a escrita de um inteiro, como "2".',
          'Certo! float() permite a parte decimal.',
        ],
      ),
      q(
        'Para juntar "Total: " com um número usando +, você pode…',
        ['Converter o número com str().', 'Usar o número sem conversão.'],
        0,
        [
          'Isso! Assim os dois lados do + serão textos.',
          'Texto + número gera TypeError. Converta o número em texto primeiro.',
        ],
      ),
    ],
    {
      prompt:
        'Leia duas entradas: quantidade inteira e preço decimal. Use int() e float(), multiplique e mostre Total: seguido de espaço e do resultado convertido com str(). Exemplo: entradas 3 e 2.5 → Total: 7.5.',
      inputs: ['3', '2.5'],
      starter:
        '# Leia e converta a quantidade\n\n# Leia e converta o preço\n\n# Calcule e mostre o total\n',
      hints: [
        'input() devolve texto; faça a conversão ao ler cada valor.',
        'Use int(input()) para a quantidade e float(input()) para o preço.',
        'Depois de multiplicar, junte "Total: " com str(total) em um print().',
      ],
      summary:
        'Você converteu textos em números para calcular e voltou ao texto para apresentar o resultado.',
    },
  ),
  level(
    10,
    'A calculadora da vila',
    'Combinar entrada, conversão e quatro operações.',
    [
      'A vila precisa de uma calculadora! Vamos ler dois números decimais e apresentar os resultados de soma, subtração, multiplicação e divisão.',
      'Planeje antes de escrever: primeiro as entradas, depois os cálculos e por fim a saída. Guarde os números em variáveis para reutilizá-los.',
      'Nesta missão o segundo número será diferente de zero. Dividir por zero causa ZeroDivisionError. No próximo mundo, você aprenderá a decidir o que fazer em situações diferentes.',
    ],
    'a = 8.0\nb = 2.0\nprint(a + b)\nprint(a / b)',
    '10.0\n4.0',
    [
      q(
        'Por que ler os dois números antes de calcular?',
        [
          'Para que as variáveis já tenham seus valores.',
          'Porque print() sempre precisa de input().',
        ],
        0,
        [
          'Isso! Não podemos usar um valor antes de recebê-lo.',
          'print() pode mostrar textos e valores sem input().',
        ],
      ),
      q('Qual operação exige cuidado quando o segundo número é zero?', ['Soma.', 'Divisão.'], 1, [
        'Somar zero é válido e mantém o primeiro valor.',
        'Certo! Não é possível dividir por zero.',
      ]),
    ],
    {
      prompt:
        'Leia dois números com float(input()). Mostre, nesta ordem e um por linha: soma, primeiro menos segundo, produto e primeiro dividido pelo segundo. Não escreva rótulos. Entradas 8 e 2 devem gerar 10.0, 6.0, 16.0 e 4.0 em quatro linhas. O segundo número nunca será zero nos testes.',
      inputs: ['8', '2'],
      starter: '# Receba os dois números\n\n# Mostre as quatro operações na ordem pedida\n',
      hints: [
        'Guarde as entradas em duas variáveis convertidas com float().',
        'Cada resultado pode ser mostrado com um print() separado.',
        'As operações são a + b, a - b, a * b e a / b. Confira a ordem das linhas.',
      ],
      summary: 'Você criou uma calculadora interativa que funciona com diferentes números.',
    },
  ),
];
world2[2].examples[0].inputs = ['Lia'];
