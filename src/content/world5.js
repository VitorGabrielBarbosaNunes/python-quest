import { level, quiz as q } from './helpers.js';
export const world5 = [
  level(
    21,
    'Feitiços reutilizáveis',
    'Definir uma função com def e chamá-la pelo nome.',
    [
      'Uma função guarda instruções sob um nome, permitindo reutilizá-las. Para criar uma, use def, o nome, parênteses e dois-pontos.',
      'As instruções da função recebem quatro espaços. Definir uma função não executa seu bloco: para executá-lo, chame o nome com parênteses.',
      'Dê nomes que indiquem a tarefa. Uma função chamada saudar deixa a intenção do programa mais clara do que um nome como x.',
    ],
    'def abrir_portal():\n    print("Portal aberto")\n\nabrir_portal()\nabrir_portal()',
    'Portal aberto\nPortal aberto',
    [
      q(
        'O que acontece ao definir uma função com def?',
        [
          'As instruções são guardadas para uma chamada futura.',
          'O bloco sempre executa naquele momento.',
        ],
        0,
        [
          'Isso! Depois você escolhe quando chamar a função.',
          'Definir e chamar são etapas diferentes. O bloco executa quando a função é chamada.',
        ],
      ),
      q('Como chamar uma função chamada saudar?', ['saudar', 'saudar()'], 1, [
        'O nome sozinho se refere à função, mas não a executa.',
        'Certo! Os parênteses indicam a chamada.',
      ]),
    ],
    {
      prompt:
        'Crie uma função chamada saudar, sem parâmetros, que mostre Olá, viajante!. Depois chame saudar() uma vez. A saída deve ter uma única saudação.',
      starter: '# Defina a função saudar\n\n# Chame a função\n',
      hints: [
        'Comece com def saudar():.',
        'O print pertence ao bloco da função e precisa de quatro espaços.',
        'Fora do bloco, na margem esquerda, chame saudar().',
      ],
      summary: 'Você agrupou instruções em uma função e escolheu quando executá-las.',
    },
  ),
  level(
    22,
    'Um feitiço para cada viajante',
    'Receber parâmetros e devolver resultados com return.',
    [
      'Parâmetros são nomes que recebem valores quando a função é chamada. Em def dobro(numero):, numero recebe o argumento fornecido na chamada.',
      'return devolve um resultado e encerra a função. Diferentemente de print(), ele não mostra nada sozinho. O código que chamou a função pode guardar ou usar esse resultado.',
      'Uma função que retorna valores é fácil de reutilizar e testar com entradas diferentes. Nesta missão, os testes chamarão sua função automaticamente.',
    ],
    'def dobro(numero):\n    return numero * 2\n\nresultado = dobro(4)\nprint(resultado)',
    '8',
    [
      q(
        'O que return faz?',
        ['Mostra um texto obrigatoriamente.', 'Devolve um valor para quem chamou a função.'],
        1,
        [
          'Mostrar é a função de print(). return devolve o valor.',
          'Isso! Quem chamou pode guardar, mostrar ou transformar o resultado.',
        ],
      ),
      q('Se dobro(4) retorna 8, o que dobro(7) deve retornar?', ['14', '8'], 0, [
        'Certo! O parâmetro recebe um novo valor a cada chamada.',
        'O resultado depende do argumento; não deve ficar fixo em 8.',
      ]),
    ],
    {
      prompt:
        'Crie a função dobro(numero), que retorna o argumento multiplicado por 2. Use return. Você não precisa ler input() nem imprimir: os testes chamarão a função com diferentes números.',
      starter: 'def dobro(numero):\n    # Devolva o dobro do parâmetro\n    pass',
      hints: [
        'O nome numero representa o argumento recebido.',
        'A expressão numero * 2 calcula o resultado.',
        'Substitua pass por uma instrução return com a expressão calculada.',
      ],
      summary: 'Você criou uma função que recebe dados e devolve resultados reutilizáveis.',
    },
  ),
  level(
    23,
    'Palavras que se transformam',
    'Limpar e transformar strings com métodos.',
    [
      'Strings são textos. Elas oferecem ações chamadas métodos, escritas depois de um ponto. texto.strip() remove espaços do início e do fim.',
      'texto.upper() devolve uma versão em letras maiúsculas, e texto.lower() em minúsculas. Esses métodos produzem novos textos; o original não muda sozinho.',
      'Você pode encadear métodos: texto.strip().upper(). Também pode usar len(texto) para contar caracteres e texto[0] para acessar o primeiro, quando o texto não estiver vazio.',
    ],
    'nome = "  Lia  "\nlimpo = nome.strip().upper()\nprint(limpo)\nprint(len(limpo))',
    'LIA\n3',
    [
      q('O que "  oi  ".strip() produz?', ['"oi"', '"  OI  "'], 0, [
        'Certo! strip() remove espaços nas pontas.',
        'strip() não muda maiúsculas; para isso, use upper().',
      ]),
      q(
        'Se texto = "oi", chamar texto.upper() sem guardar o resultado altera texto?',
        ['Sim, passa a guardar "OI".', 'Não, o método devolve um novo texto.'],
        1,
        [
          'Para guardar a mudança, atribua o resultado a uma variável.',
          'Isso! Você pode escrever texto = texto.upper() para guardar a nova versão.',
        ],
      ),
    ],
    {
      prompt:
        'Crie a função preparar_nome(texto). Ela deve remover espaços das pontas e retornar o resultado em maiúsculas. Exemplo: preparar_nome("  lia  ") retorna "LIA". Não use input(); os testes chamarão sua função.',
      starter: 'def preparar_nome(texto):\n    # Limpe e transforme o texto\n    pass',
      hints: [
        'O método strip() cuida dos espaços das pontas.',
        'Depois aplique upper() ao texto já limpo.',
        'Você pode devolver texto.strip().upper() com return.',
      ],
      summary: 'Você transformou strings e reutilizou a transformação dentro de uma função.',
    },
  ),
  level(
    24,
    'A oficina dos erros',
    'Ler mensagens de erro e corrigir um programa passo a passo.',
    [
      'Erros são pistas. SyntaxError aponta uma escrita que Python não entende; IndentationError indica um problema nos recuos dos blocos.',
      'NameError indica um nome que não existe. TypeError costuma indicar operações incompatíveis, como juntar texto e número com + sem conversão.',
      'Leia a mensagem e a linha indicada, resolva um problema e execute novamente. O código desta missão tem um erro de sintaxe e um erro no cálculo: depois de fazê-lo rodar, confira o resultado.',
    ],
    'def triplo(n):\n    return n * 3\n\nprint(triplo(4))',
    '12',
    [
      q(
        'O programa acusa NameError: name "ponto" is not defined. O que conferir?',
        ['A grafia e a criação da variável ponto.', 'A cor do botão Executar.'],
        0,
        [
          'Isso! Verifique se o nome foi definido e escrito da mesma forma.',
          'A mensagem trata do nome no programa, não da interface.',
        ],
      ),
      q(
        'Um programa que executa sem erro está necessariamente correto?',
        [
          'Sim, executar garante que a lógica está certa.',
          'Não; ainda é preciso conferir os resultados.',
        ],
        1,
        [
          'O programa pode rodar e calcular um resultado errado.',
          'Exatamente! Testar entradas e resultados também encontra erros de lógica.',
        ],
      ),
    ],
    {
      mode: 'fix',
      prompt:
        'Corrija a função somar(a, b). Falta uma parte da sintaxe e o cálculo está incorreto. Ela deve retornar a soma dos dois parâmetros. Os testes chamarão a função com pares diferentes.',
      starter: 'def somar(a, b)\n    return a - b',
      hints: [
        'A linha que começa com def precisa terminar com dois-pontos.',
        'Depois de corrigir a sintaxe, confira o operador do cálculo.',
        'Somar exige o operador +, não o operador -. Mantenha return e os dois parâmetros.',
      ],
      summary: 'Você usou uma mensagem de erro como pista e também corrigiu um erro de lógica.',
    },
  ),
  level(
    25,
    'Você é o guardião do código',
    'Criar um jogo textual reunindo funções, variáveis, condições e loops.',
    [
      'Sua missão final é criar a Jornada das moedas. O jogador começa com zero moedas e recebe três comandos. Cada comando explorar acrescenta duas moedas; descansar não acrescenta nada.',
      'Separe a regra em uma função chamada jogar(), sem parâmetros. Dentro dela, use uma variável para as moedas, um loop de três repetições, input() e uma condição para cada comando.',
      'A função deve retornar o total. Fora dela, chame jogar() e mostre Moedas: seguido do total. Depois, mostre Vitória! se o total for pelo menos 4, ou Continue explorando se for menor. Os comandos serão explorar ou descansar.',
    ],
    'def recompensa(acao):\n    if acao == "explorar":\n        return 2\n    return 0\n\nprint(recompensa("explorar"))',
    '2',
    [
      q(
        'Qual parte do jogo pode mudar a cada repetição?',
        [
          'O comando recebido e a quantidade de moedas.',
          'A necessidade de escrever o programa em JavaScript.',
        ],
        0,
        [
          'Isso! Variáveis e entradas permitem que a aventura evolua.',
          'O código do jogador continua sendo Python de verdade.',
        ],
      ),
      q(
        'Por que separar regras em funções?',
        [
          'Para organizar, reutilizar e testar partes do programa.',
          'Para impedir que o programa receba entradas.',
        ],
        0,
        [
          'Certo! Isso facilita entender e expandir o jogo.',
          'Funções podem ler entradas e receber parâmetros normalmente.',
        ],
      ),
    ],
    {
      prompt:
        'Crie jogar(), sem parâmetros. Ela começa com 0 moedas, lê exatamente 3 comandos e soma 2 a cada explorar (descansar não soma). Use um loop e uma condição dentro da função; retorne as moedas. Fora dela, chame jogar(), mostre Moedas: N (substitua N pelo total) e, em outra linha, Vitória! se N >= 4 ou Continue explorando caso contrário. Não imprima outras mensagens. Exemplo: explorar, descansar, explorar → Moedas: 4 e Vitória! em duas linhas.',
      inputs: ['explorar', 'descansar', 'explorar'],
      starter:
        '# Crie a função jogar e as regras da aventura\n\n# Chame a função e apresente o resultado\n',
      hints: [
        'Dentro de jogar(), comece com moedas = 0 e percorra range(3) para ler os comandos.',
        'Se input() devolver "explorar", some 2 às moedas. Depois do loop, retorne o total.',
        'Fora da função, guarde jogar() em total. Use str(total) na primeira mensagem e uma condição total >= 4 para escolher a segunda.',
      ],
      summary:
        'Você criou um jogo textual completo com estado, escolhas, repetições e uma função. Agora experimente novos comandos, recompensas e histórias!',
    },
  ),
];
