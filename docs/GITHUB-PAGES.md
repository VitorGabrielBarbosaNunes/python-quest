# Publicar no GitHub e no GitHub Pages

O GitHub guarda os arquivos do projeto. O GitHub Pages entrega o jogo pronto no navegador. O Python continua rodando no computador do jogador, dentro do Worker: não precisa de servidor Python.

## Primeira publicação

1. Crie um repositório no GitHub, por exemplo `python-quest`. Para seguir o fluxo gratuito comum do Pages, use um repositório público.
2. Envie os arquivos deste projeto para a branch `main`, incluindo a pasta oculta `.github`, `package.json`, `package-lock.json`, `src`, `public`, `scripts`, `config` e os testes. Respeite o `.gitignore`: não envie `node_modules`, `dist` nem `public/pyodide`. O workflow gera esses arquivos automaticamente.
3. No repositório, abra **Settings → Pages → Build and deployment → Source** e selecione **GitHub Actions**.
4. Abra **Actions → Publicar Python Quest no GitHub Pages → Run workflow** e selecione `main`. Isso também permite repetir a primeira tentativa se ela ocorreu antes de habilitar Pages.
5. Aguarde os trabalhos `build` e `deploy` terminarem. O endereço publicado aparece no ambiente `github-pages` e em Settings → Pages.

Depois da configuração inicial, cada envio para `main` inicia uma nova publicação. O workflow só publica quando a instalação, os testes e o build passam. Se sua branch principal tiver outro nome, altere tanto `branches: [main]` quanto a condição `refs/heads/main` no workflow.

## Enviar por Git

Este diretório começou sem um repositório Git utilizável. Para criar o repositório local e enviar a um repositório **vazio** que você criou no GitHub, substitua `SEU_USUARIO` e `SEU_REPOSITORIO` nos comandos:

```bash
cd /home/lightpower/PythonLearning
git init -b main
git add .
git commit -m "Cria o jogo Python Quest"
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

A autenticação será feita pelo Git/GitHub. Nunca coloque tokens ou senhas em arquivos do projeto. Se o repositório remoto já tiver commits, sincronize seu histórico antes de enviar; esses comandos pressupõem um remoto vazio e não usam envio forçado.

## Endereço e caminhos

- Um repositório comum, como `python-quest`, normalmente fica em `https://SEU_USUARIO.github.io/python-quest/`.
- O repositório especial `SEU_USUARIO.github.io` fica na raiz: `https://SEU_USUARIO.github.io/`.

O workflow consulta o caminho real com `actions/configure-pages` e passa o resultado em `PAGES_BASE_PATH`. O Vite usa essa informação para montar caminhos de JavaScript, estilos, ícones e Worker. O executor já usa a mesma base para buscar os arquivos do Pyodide. Não é preciso colocar seu nome de usuário no código.

A opção `base` significa **o prefixo do endereço do site**. Por exemplo, `/python-quest/` garante que o Python seja buscado em `/python-quest/pyodide/`, e não no endereço errado `/pyodide/`.

## Testar antes de publicar

```bash
npm test
npm run test:pages
```

`test:pages` gera o build com `/python-quest/` e testa a aplicação nesse subdiretório, incluindo os arquivos WASM/ZIP, o ícone, a execução real de Python, a conclusão do nível 1, persistência, timeout, cancelamento e a tela móvel.

O teste deixa `dist` configurado para esse caminho de simulação. Para voltar a um build local na raiz, rode `npm run build`. `npm run dev` continua funcionando na raiz sem configuração extra.

No Linux/macOS, para experimentar manualmente outro caminho:

```bash
PAGES_BASE_PATH=/nome-do-repositorio/ npm run build
PAGES_BASE_PATH=/nome-do-repositorio/ npm run preview
```

Abra o endereço com `/nome-do-repositorio/` no final. O workflow configura essa variável automaticamente no GitHub.

## O que foi preparado

- `.github/workflows/pages.yml`: instalação, testes, build e publicação automática em `main`.
- `config/site-base.js` e `vite.config.js`: suporte a raiz e subdiretório.
- `index.html` e `src/ui/shell.js`: ícones usando o caminho correto.
- `playwright.config.js` e `e2e/`: testes que respeitam o endereço de publicação.
- `scripts/test-pages.mjs`: simulação local de um site de projeto no Pages.

O artefato publicado contém apenas `dist`, incluindo o runtime local do Python. Arquivos de teste e soluções de referência não entram no build. O processo usa o token automático do GitHub Actions, com permissões separadas para preparação e publicação; não é necessário cadastrar um token pessoal.

## Se algo falhar

**Configure Pages falhou:** confira se Pages está habilitado com a origem GitHub Actions. Depois execute o workflow novamente.

**Arquivos retornam 404:** não publique os arquivos-fonte diretamente por uma branch. Use o workflow, que gera `dist` com o caminho correto. Não altere `base` manualmente para um nome diferente do repositório.

**Python falhou no site:** procure `pyodide.asm.wasm` e `python_stdlib.zip` na aba Rede do navegador. O workflow executa o script de preparação durante `npm ci` e inclui esses arquivos no artefato.

**Progresso do localhost não apareceu no site:** cada origem tem seu próprio armazenamento. Isso é esperado; o salvamento local não é transferido para o endereço do GitHub Pages.

**Deploy aguarda aprovação:** confira as regras do ambiente `github-pages` nas configurações do repositório.

## Referências

- [Vite: publicação no GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
- [GitHub: workflows personalizados para Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Configuração da origem de publicação](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
