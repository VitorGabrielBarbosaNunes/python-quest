# Python Quest

Jogo educacional em português brasileiro, sem cadastro e sem backend. São **5 mundos, 25 níveis e 50 perguntas**, com aulas, exemplos executáveis, quiz, exercícios de Python real e cinco missões especiais.

## Começar

Requisitos: Node.js **22.12 ou superior**, npm e um navegador moderno com WebAssembly e Web Workers.

```bash
npm install
npm run dev
```

Abra o endereço Local mostrado pelo Vite, normalmente `http://127.0.0.1:5173/`.

A instalação copia o runtime do Pyodide para `public/pyodide/`. O Python, os desenhos e os sons são servidos pelo próprio projeto: **o jogo não depende de CDN, API ou imagens externas**. A instalação inicial precisa de internet. Depois dela, o servidor local pode funcionar sem internet. Não é um PWA: abrir a página offline sem um servidor/cache preparado não está implementado.

Para gerar e experimentar a distribuição:

```bash
npm run build
npm run preview
```

O comando de preview mostra seu próprio endereço, normalmente na porta 4173. O runtime Python ocupa cerca de 14 MB antes de compressão. Para hospedar, publique `dist/`, incluindo `dist/pyodide/`. O projeto suporta tanto a raiz de um domínio quanto um subdiretório, configurado por `PAGES_BASE_PATH`. Para GitHub Pages, o workflow já configura esse caminho automaticamente. Não abra `index.html` por `file://`: módulos e Workers precisam de HTTP. Nenhum código do aluno é executado no servidor.

## Jogue no site

O projeto teve seu deploy, basta acessar https://VitorGabrielBarbosaNunes.github.io/python-quest/
## Como jogar

1. Clique em **Jogar · começar aventura**.
2. Leia a explicação e experimente o exemplo com Python real.
3. Responda às duas perguntas. Cada alternativa tem uma explicação; erros permitem tentar novamente.
4. Escreva ou complete o programa. **Executar** serve para experimentar; **Verificar resposta** usa os casos da missão.
5. Após aprovação, clique em **Concluir missão** para salvar a conquista e desbloquear o próximo nível.

Cada nível concede 100 XP apenas na primeira conclusão. Sem dicas: 3 estrelas; uma ou duas dicas: 2 estrelas; três dicas: 1 estrela. Repetir permite melhorar o recorde de estrelas sem multiplicar XP. Erros não retiram pontos. O progresso e os rascunhos ficam neste navegador; limpar seus dados apaga o salvamento.

**Entradas:** cada linha do campo Entradas do programa abastece um `input()`. A avaliação usa entradas próprias. O texto de pergunta passado a `input()` não entra na saída comparada. Um programa que pedir mais entradas que as fornecidas recebe uma orientação para corrigir isso.

**Editor:** Tab insere quatro espaços; Enter mantém o recuo e acrescenta um nível depois de `:`. Escape e depois Tab permite sair do editor pelo teclado. Ctrl+Enter (ou Cmd+Enter) executa. Cancelar encerra o Worker. Restaurar código inicial mantém o número de dicas já usadas.

## Testar

```bash
npm test                        # Regras e execução de Python real no Pyodide
npx playwright install chromium # Uma vez, para preparar o navegador de testes
npm run test:e2e                 # Percursos e comportamentos reais no Chromium
npm run check                   # Testes unitários, build e navegador
```

Os testes de navegador geram o build e iniciam seu próprio servidor de produção na porta 4173. Feche outro processo nessa porta se não for este projeto. O teste de percurso completo leva alguns minutos, pois executa os 25 desafios em Workers novos. Os testes não modificam o salvamento do navegador usado por você.

- `tests/catalog.test.js`: consistência do catálogo e quizzes, etapas e critérios de avanço.
- `tests/progress.test.js`: desbloqueios, estrelas, XP, conquistas, persistência e falhas de armazenamento.
- `tests/runner.test.js`: cancelamento, timeout, falha de carregamento, descarte de resultados antigos e feedback.
- `tests/python.test.js`: exemplos, soluções de todos os níveis, alternativas válidas, erros, entradas, funções, fronteiras e respostas incorretas.
- `e2e/`: fluxo da interface, Python no Worker, mapas, salvamento, repetição, preferências, reset e telas pequenas.
- `tests/solutions.js`: soluções de referência para manutenção. Este arquivo **não faz parte do aplicativo**.

## Organização

```text
src/
  main.js                Inicialização
  content/               Catálogo declarativo e cinco arquivos de conteúdo
  engine/session.js      Regras das etapas de cada tentativa
  progress/store.js      Salvamento, desbloqueios, XP, estrelas e conquistas
  python/
    runner.js            Ciclo de vida do Worker e limites
    worker.js            Carregamento local do Python
    harness.js           Execução, entrada, captura de saída e avaliação
    checks.js            Casos de teste e critérios dos desafios
    feedback.js          Mensagens pedagógicas para erros
  game/
    map.js               Cenário e caminho dos níveis em Phaser 3
    sound.js             Efeitos sonoros com Web Audio
  ui/                    Telas HTML, eventos, editor e ícones
  style.css              Importação das folhas de estilo
  styles/                Base visual, mapa, aulas e responsividade
scripts/copy-pyodide.mjs  Preparação dos arquivos locais de Python
public/                  Ícone e runtime preparado pelo postinstall
```

O desenho do mapa usa Phaser, mas todos os níveis também têm botões HTML navegáveis pelo teclado. Texto e editor ficam no HTML para permitir seleção, foco e leitura. Para padronizar a formatação dos arquivos, use `npm run format`. Veja [a arquitetura](docs/ARQUITETURA.md), [o guia de aprendizagem](docs/GUIA-DE-APRENDIZAGEM.md) e [o registro das fases](docs/VALIDACAO.md).

## Conteúdo e manutenção

Cada nível possui objetivo, pré-requisitos, explicações, exemplos com saída, perguntas com feedback por alternativa, exercício, código inicial, três dicas, critérios e recompensa. Para modificar uma aula, altere `src/content/worldN.js`. Não coloque perguntas nos componentes visuais.

Para mudar um desafio:

1. Atualize o enunciado, o código inicial e as dicas no arquivo de conteúdo.
2. Atualize os critérios em `src/python/checks.js`.
3. Atualize a solução de referência em `tests/solutions.js`.
4. Execute `npm test` e o percurso afetado no navegador.

Há cinco modalidades: completar, organizar linhas, prever e corrigir, depurar e escrever. O nível 2 permite reorganizar duas instruções com um botão acessível. As missões especiais são 5, 10, 15, 20 e 25. A última reúne variáveis, decisões, loops, entrada e funções.

Adicionar mundos exige também ajustar os limites do progresso e os testes de catálogo. A edição de conteúdo dentro dos 25 níveis não exige reescrever a interface. Veja o guia técnico antes de ampliar a quantidade.

## Limites e decisões conscientes

- O código usa um **Worker novo em cada execução**, e cada caso recebe um dicionário Python novo. Há 60 segundos para carregar o runtime e 3 segundos para executar após o carregamento. Cancelamento/timeout encerram o Worker; não é necessário SharedArrayBuffer.
- Há limites de 20.000 caracteres de código e 16.000 de saída por captura. Eles evitam erros comuns, mas **não constituem limite rígido de memória**.
- Pyodide **não é uma sandbox de segurança absoluta**. O Worker não recebe progresso, credenciais ou informações pessoais do aplicativo. Importações comuns ficam restritas a `math`, `random` e `string`, e a abertura de arquivos é bloqueada. Isso reduz acesso acidental; não oferece isolamento contra código deliberadamente hostil. Use o projeto para aprendizagem, não para executar código não confiável em uma origem com dados sensíveis.
- Os casos de avaliação são separados do enunciado e carregados no Worker. Por ser uma aplicação inteiramente no cliente, eles podem ser inspecionados nas ferramentas do navegador. Não são segredos criptográficos nem um mecanismo antifraude.
- A entrada é predefinida em um campo, e não um terminal que para para perguntar. O botão Executar não oferece instalação de pacotes externos.
- A compilação avisa sobre o tamanho do Phaser. O pacote fica em um arquivo separado, mas ainda é grande. O runtime Python também aumenta o download local inicial.
- O salvamento não sincroniza dispositivos. Se localStorage estiver indisponível, o jogo continua em memória e mostra um aviso.
- Verificação automatizada de navegador usa Chromium. Não há confirmação automatizada de Safari/Firefox ou avaliação com usuários reais/leitores de tela.

## Solução de problemas

**Python não carrega:** execute `npm install` novamente e confirme que `public/pyodide/` existe. O servidor precisa entregar `.wasm`, `.mjs`, `.zip` e `.json` sem transformar tudo em HTML. Verifique a aba Rede do navegador.

**Programa não termina:** use Cancelar e confira se a condição de um `while` muda. Uma mensagem de limite de tempo é uma pista para depuração, não uma punição.

**Mudança não aparece:** confirme que abriu a porta do Vite do projeto correto. Em `preview`, gere um novo build após editar arquivos.

**Progresso não persiste:** verifique o aviso de armazenamento e as permissões do navegador. Portas/origens diferentes têm salvamentos diferentes.

**Playwright não inicia no Linux:** execute `npx playwright install chromium`. Em distribuições suportadas, `npx playwright install-deps chromium` pode preparar bibliotecas do sistema e exigir privilégios administrativos.

## Créditos

Pip, mapas e identidade visual são originais, desenhados em SVG/CSS/Phaser. Sons são gerados com Web Audio. Phaser e Vite usam licença MIT; Pyodide usa MPL-2.0 e distribui Python e outras bibliotecas com suas próprias licenças. Consulte os arquivos de licença das dependências ao redistribuir o runtime.
