# Como as partes trabalham juntas

Um **módulo** é um arquivo que exporta funções ou dados para outros arquivos. Módulos ES usam `import` e `export`. Cada área do projeto tem uma responsabilidade: assim, mudar uma pergunta não exige mexer no salvamento ou no mapa.

```text
Conteúdo → sessão da missão → telas HTML
                            ↓
                      executor JavaScript
                            ↓ postMessage
                      Web Worker novo
                            ↓
                      Pyodide → Python real
                            ↓
                      avaliação dos casos
                            ↓ resultado
                      conclusão → progresso → localStorage
```

## Conteúdo declarativo

Em vez de escrever um componente para cada missão, cadastramos dados. A função `level()` de `content/helpers.js` preenche metadados comuns. A função `quiz()` organiza enunciado, alternativas, índice correto e justificativas.

```js
q('Qual instrução mostra uma mensagem?', ['print("Olá")', 'Print("Olá")'], 0, [
  'Isso! print tem p minúsculo.',
  'Python diferencia maiúsculas e minúsculas.',
]);
```

`0` indica a primeira alternativa porque os índices de arrays JavaScript começam em zero. O motor lê esses dados e renderiza a mesma interface para todas as perguntas.

O catálogo contém os testes visíveis de exemplos, enquanto os testes adicionais de avaliação ficam em `python/checks.js`. Essa separação evita colocar respostas e critérios dentro do HTML do exercício. Ela não impede inspeção do código distribuído ao navegador.

## Fluxo da missão

`LevelSession` guarda a **tentativa atual**: etapa, pergunta, dicas, código e aprovação prática. É uma pequena máquina de estados: só permite movimentos válidos.

- `learn()` sai da leitura para o quiz.
- `answer()` avalia a alternativa e devolve sua explicação.
- `nextQuestion()` recusa avançar quando a resposta está incorreta.
- `verify()` guarda uma aprovação prática apenas na etapa de prática.
- `finish()` só funciona depois dessa aprovação.

A interface invalida a aprovação quando o código muda. Uma execução simples nunca autoriza concluir. O método de progresso é chamado apenas após `finish()` retornar verdadeiro.

Ao recarregar, a missão recomeça na leitura, mas o código e o uso de dicas da tentativa prática são recuperados. Não persistimos uma aprovação do código ou um quiz parcialmente respondido. Ao repetir um nível concluído, começa uma nova tentativa para melhorar as estrelas.

## Execução de Python

`PythonRunner` é o controlador na página. Ele cria um Worker, envia apenas código, modo, nível e entradas, e aguarda mensagens. Ele tem dois relógios separados: carregamento e execução. O tempo gasto no download/inicialização do runtime não consome os três segundos do exercício.

`worker.js` importa o runtime local. Depois de carregar, manda `ready`, executa o avaliador e devolve um resultado serializável. Ao terminar, o controlador encerra o Worker. Cada nova execução começa limpa.

`harness.js` contém o programa Python do avaliador. Os dados chegam como JSON, não por interpolação em comandos de código. Para cada caso:

1. Analisa a sintaxe com `ast`.
2. Cria um novo espaço de nomes com `__builtins__` limitado.
3. Substitui `input()` por uma função que consome entradas predefinidas.
4. Redireciona stdout e stderr para capturas limitadas.
5. Executa o programa compilado.
6. Compara saída, valores ou retorno de função, conforme o exercício.
7. Retorna uma mensagem resumida, sem expor entradas ocultas na interface.

AST é uma representação da estrutura do código. Usamos essa análise apenas quando o objetivo exige uma construção: por exemplo, o nível 16 precisa realmente praticar `while`. Nos demais aspectos, avaliamos resultados, sem comparar o texto do programa com uma resposta pronta.

Casos de um mesmo exercício usam espaços de nomes diferentes dentro do mesmo Worker. Uma nova submissão usa um Worker novo. Isso protege contra interferência acidental entre atividades, mas não promete segurança contra código Python hostil ou introspecção avançada.

A comparação de saída ignora espaços finais de linha e espaços nas pontas de toda a saída. Respeita mensagens, ordem das linhas e espaços internos. Retornos numéricos equivalentes, como `5` e `5.0`, são aceitos quando o exercício não exige um tipo específico. Valores das variáveis em exercícios sobre tipos são comparados também pelo tipo.

## Progresso e armazenamento

`ProgressStore` recebe um objeto de armazenamento: no navegador é `localStorage`; nos testes é um objeto em memória. Essa técnica se chama **injeção de dependência**: fornecer a ferramenta em vez de prendê-la diretamente ao código facilita testar falhas.

A chave `python-quest:v1` guarda:

```json
{
  "version": 1,
  "completed": { "1": { "stars": 3 } },
  "drafts": { "2": { "code": "print(\"Oi\")", "hints": 1 } },
  "settings": { "volume": 0.35, "sound": true, "reducedMotion": false, "largeText": false }
}
```

XP é calculado a partir das conclusões, evitando contadores divergentes. Estrelas são atualizadas com o maior resultado. Dados carregados são validados: valores fora dos limites, versões desconhecidas e conclusões fora da sequência são descartados. Não é um sistema antifraude; a pessoa controla o próprio navegador.

Falhas ao ler ou escrever não impedem o jogo. O estado continua em memória com aviso visível. Reiniciar pede confirmação e mantém as preferências de acessibilidade.

## Interface e Phaser

`QuestApp` coordena eventos e mostra as telas. Os dados do aluno passam por escape antes de entrar em HTML; o código no editor e as saídas são lidos/escritos como texto.

`MapScene` é uma cena Phaser: um conjunto de objetos e comportamentos visuais. Seu método `create()` desenha árvores, rio, castelo, caminho e pontos. `Phaser.Scale.FIT` mantém a proporção dentro do contêiner responsivo. Os desenhos são locais e o canvas é decorativo em relação aos botões de nível equivalentes no HTML.

As animações respeitam a preferência do sistema e a opção de redução. Efeitos sonoros são opcionais, gerados em resposta às ações da pessoa. Diálogos nativos mantêm o foco dentro das configurações e permitem fechar por Escape.

## Acrescentar conteúdo

Para modificar um dos 25 níveis: edite conteúdo, avaliador e solução de teste. A UI continua a mesma.

Para ampliar além de 25 níveis:

1. Acrescente os mundos e arquivos de conteúdo ao catálogo.
2. Substitua os limites de 25 e o tamanho de mundo 5 em `ProgressStore`, `worldProgress`, `sanitize`, conclusão e telas por metadados do catálogo.
3. Crie uma migração de armazenamento para manter salvamentos existentes; não apenas troque a versão.
4. Atualize o teste que exige exatamente 25 níveis e os totais exibidos.
5. Execute os testes unitários e o percurso completo.

A primeira versão mantém explicitamente os limites pedidos. Essa mudança de escala fica concentrada no catálogo, no progresso e nas contagens da UI, sem reescrever o editor ou o executor.

## Referências consultadas

- [Pyodide: uso em aplicações web](https://pyodide.org/en/stable/usage/index.html)
- [Pyodide: entrada e saída padrão](https://pyodide.org/en/0.27.7/usage/streams.html)
- [Phaser 3.90: ScaleManager](https://docs.phaser.io/api-documentation/3.90.0/class/scale-scalemanager)
