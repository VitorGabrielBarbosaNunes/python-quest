# Implementação e validação por fase

Os resultados abaixo registram testes realmente executados neste ambiente. Não representam garantia de compatibilidade com todos os navegadores, dispositivos ou entradas hostis.

## Fase 1 — Fundação

**Implementado:** projeto Vite com módulos ES, Phaser 3, Pyodide servido localmente, controlador de Worker, limite de tempo, cancelamento, armazenamento validado, navegação principal e identidade visual original.

**Arquivos principais:** `package.json`, `vite.config.js`, `scripts/copy-pyodide.mjs`, `src/main.js`, `src/game/map.js`, `src/python/runner.js`, `src/python/worker.js`, `src/progress/store.js`.

**Validação inicial:** 16 testes Vitest passaram, cobrindo o catálogo inicial, etapas, progresso, persistência, erros, execução de Python e controlador do Worker. O primeiro build de produção passou.

**Como executar:** `npm install` e `npm run dev`.

**Limites preservados:** Phaser gera um aviso de tamanho de pacote; Pyodide exige WebAssembly e um download local inicial do runtime. O aviso não impede o build.

## Fase 2 — Primeiro nível completo

**Implementado:** explicação, exemplo executável, duas perguntas com feedback individual, editor, execução, avaliação, dicas, conclusão, XP e salvamento.

**Arquivos principais:** `src/content/world1.js`, `src/engine/session.js`, `src/ui/app.js`, `src/ui/lesson.js`, `src/python/harness.js`, `src/python/checks.js`, `src/python/feedback.js`.

**Validação inicial:** três testes Playwright passaram. O navegador executou código Python real, rejeitou uma resposta incorreta, aprovou a correta, concedeu 100 XP e recuperou o progresso após recarregar. Também foram exercitados cancelamento, timeout, recuperação do Worker, preferências e layout móvel.

**Como executar:** `npm run dev`; abrir o endereço Local e clicar em Jogar.

**Limite preservado:** execução comum não conclui missões. O jogador precisa verificar e depois confirmar a conclusão.

## Fase 3 — Primeiro mundo

**Implementado:** níveis 1 a 5 com conteúdos distintos, tipos, variáveis, organização de linhas, previsão/correção e cartão de apresentação.

**Arquivos principais:** `src/content/world1.js`, `src/python/checks.js`, `tests/solutions.js`, `e2e/worlds.spec.js`.

**Validação:** percurso sequencial dos cinco níveis passou no navegador, com código Python real, XP acumulado e desbloqueio da missão seguinte.

**Como executar:** continuar os níveis desbloqueados na mesma instalação.

**Limite preservado:** os valores exigidos em missões introdutórias são fixos e explicitados no enunciado; o botão Executar permite experimentar outras mensagens e valores.

## Fase 4 — Sistemas gerais

**Implementado:** cinco regiões visuais, caminho com níveis, conquistas, recorde de estrelas, repetição, rascunhos, volume, efeitos sonoros, redução de movimento, textos maiores, confirmação de reset e interface responsiva.

**Arquivos principais:** `src/ui/dashboard.js`, `src/ui/shell.js`, `src/ui/dialogs.js`, `src/ui/achievements.js`, `src/styles/`, `src/game/sound.js`, `src/progress/store.js`.

**Validação:** os testes de interface confirmaram melhora de estrelas sem XP extra, confirmação antes de apagar, persistência de dicas e código, funcionamento com localStorage bloqueado, recuperação após falha do runtime, descarte da aprovação se o código muda durante a execução, Tab/Enter/Escape no editor e ausência de transbordamento horizontal em 320, 768 e 1440 pixels. Também foi testada a largura de 390 pixels com preferências de acessibilidade.

**Como executar:** `npm run dev`; os controles ficam na navegação e nas Configurações.

**Limite preservado:** armazenamento somente no navegador atual, sem sincronização de conta.

## Fase 5 — Demais mundos

**Implementado:** níveis 6 a 25. O catálogo final contém 25 níveis, 50 perguntas, 75 dicas graduais e 68 casos de avaliação. As missões especiais são cartão, calculadora, aventura, adivinhação e jogo final.

**Arquivos principais:** `src/content/world2.js` até `world5.js`, `src/content/catalog.js`, `src/python/checks.js`, `tests/solutions.js`, `tests/python.test.js`.

**Validação:** testes executaram todos os 25 exemplos e confirmaram suas saídas. As soluções de referência de todos os 25 desafios foram aprovadas; respostas vazias foram rejeitadas. Houve verificação de fronteiras, funções, alternativas válidas e resultados parciais.

**Correção encontrada pelos testes:** o avaliador inicialmente diferenciava rigidamente retornos numéricos equivalentes, como 5 e 5.0. A comparação foi corrigida para aceitar equivalência numérica onde não se exige um tipo específico. Os exercícios de tipos continuam validando os tipos das variáveis.

**Como executar:** seguir a jornada; use `npm test` para revalidar alterações no conteúdo.

**Limites preservados:** testes adicionais não são renderizados no enunciado, mas são inspecionáveis no cliente. Não há segredo garantido sem servidor.

## Fase 6 — Revisão final

**Resultado final:** 71 testes Vitest passaram. A suíte completa de 10 testes Playwright passou na versão de produção, incluindo a jornada sequencial de todos os 25 níveis com Python real, 2.500 XP, desbloqueios, salvamento e todas as conquistas. O percurso utilizou uma dica no nível 2, terminando com 74 estrelas, como esperado.

Após pequenos ajustes no feedback de erros e na acessibilidade, os nove testes de interface afetados foram executados novamente e passaram. O avaliador dos 25 níveis não mudou nessa revisão. Uma checagem adicional em 390 pixels confirmou retorno do foco ao botão visível de configurações e fonte de 17px tanto no editor quanto na numeração com Textos maiores ativo.

**Outras verificações:** build de produção aprovado; `npm audit` sem vulnerabilidades conhecidas no momento da consulta; respostas HTTP locais confirmadas; capturas de início, editor desktop, editor móvel e castelo final inspecionadas visualmente. Nenhum erro de página foi registrado nos percursos que monitoram o console.

**Arquivos finais:** código organizado por responsabilidade, conteúdo separado por mundo, folhas de estilo separadas por área e documentação em `README.md`, `docs/ARQUITETURA.md` e `docs/GUIA-DE-APRENDIZAGEM.md`.

**Como executar:** `npm run dev` para jogar; `npm run check` para repetir a validação automatizada. Dependências e navegador de teste foram preparados neste ambiente.

**Limitações conhecidas:** verificação de navegador feita em Chromium, sem testes em dispositivos físicos, Safari/Firefox ou leitores de tela. Não foi realizada auditoria formal de acessibilidade. Pyodide não oferece isolamento absoluto contra código hostil, nem limite rígido de memória; a primeira versão não inclui contas, sincronização ou PWA. Há um aviso não bloqueante sobre o tamanho do pacote Phaser. Os casos ocultos são separação de interface, não proteção criptográfica.

## Artefatos visuais

Os testes gravam capturas em `artifacts/`, diretório ignorado pelo Git:

- `home-desktop.png`: início e mapa.
- `editor-desktop.png`: prática no computador.
- `editor-mobile.png`: prática em tela de 320 pixels.
- `castle-completed.png`: último mundo concluído.

As capturas foram abertas para inspeção visual. A avaliação automática de largura complementa essa inspeção, mas não substitui testes em dispositivos físicos ou com leitores de tela.

## Adaptação para GitHub Pages — 17/10/2026

**Implementado:** workflow de publicação em `main`, prefixo de URL obtido do Pages, ícones compatíveis com subdiretórios e testes parametrizados pelo endereço de publicação. Instruções em `docs/GITHUB-PAGES.md`.

**Validado localmente:** 77 testes Vitest aprovados; três cenários de jornada no caminho `/python-quest/` aprovados; teste específico de recursos, favicon e execução de Python aprovado nesse subdiretório e também na raiz. A inspeção confirmou carregamento do WASM e da biblioteca padrão ZIP sem erros HTTP. O novo teste de ícone inicialmente presumiu uma dimensão intrínseca fixa do SVG; ele foi corrigido para verificar carregamento e dimensão positiva, e passou na reexecução. Os builds dos dois caminhos passaram, mantendo apenas o aviso já conhecido de tamanho do Phaser.

**Limite da validação:** não houve envio a um repositório remoto nem execução do workflow na conta do usuário. A publicação real depende de enviar os arquivos e selecionar GitHub Actions como origem em Settings → Pages. O build local final foi restaurado para a raiz.
