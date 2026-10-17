# Aprenda enquanto desenvolve Python Quest

## O que já foi implementado

O projeto entregue contém o conteúdo das 25 missões, o mapa, as telas, o executor Python, os avaliadores, as recompensas, o salvamento, as configurações e os testes. Você não precisa resolver os desafios abaixo para jogar. Eles são práticas opcionais para aprender a modificar o próprio projeto.

Comece com `npm run dev`, mantenha o navegador aberto e edite um arquivo por vez. O Vite atualiza a página quando você salva. Antes de mudanças maiores, faça uma cópia ou use um repositório Git. Este ambiente começou sem um repositório Git utilizável; não foi criado um commit automaticamente.

## 1. Dados e interface: mude uma mensagem

**Arquivos:** `src/content/world1.js`, `src/content/helpers.js`.

Cada chamada de `level(...)` descreve uma aula. Os componentes visuais leem os dados e exibem o resultado. Isso se chama conteúdo declarativo: dizemos **o que** deve aparecer, em vez de escrever novos botões e telas para cada aula.

```js
export const world1 = [level(/* dados da primeira missão */), level(/* dados da segunda missão */)];
```

`const` cria uma referência com nome; `[]` cria uma lista (array) de JavaScript; `export` permite importar essa lista em outro arquivo.

**Sua prática:** mude uma frase da explicação do primeiro nível. Depois mude a mensagem de seu exemplo e a saída esperada correspondente. Execute `npm test`. O teste do exemplo deve continuar passando.

**Se falhar:** procure no resultado o nome do teste e os valores esperado/recebido. Talvez você tenha alterado o `print()` e esquecido de atualizar a saída. Corrija a causa, sem apagar o teste.

## 2. CSS: personalize uma parte da identidade

**Arquivo:** `src/style.css` e folhas de estilo importadas, se houver.

CSS descreve a aparência dos elementos. Uma variável CSS, como `--green`, pode ser usada em vários lugares.

```css
:root {
  --green: #1c7054;
}
.primary {
  background: var(--green);
}
```

**Sua prática:** altere a cor principal e observe os botões. Mantenha o texto legível. Reduza a janela para aproximadamente 390 pixels e verifique se o editor e os comandos continuam acessíveis.

**Depuração:** abra as ferramentas do navegador e selecione um botão. A área de estilos mostra qual regra está valendo e quais foram sobrescritas. Evite acrescentar `!important` sem entender o conflito.

## 3. Funções JavaScript: entenda as estrelas

**Arquivo:** `src/progress/store.js`.

```js
const stars = hints === 0 ? 3 : hints <= 2 ? 2 : 1;
```

`===` compara sem conversão automática. A expressão `condição ? valorSeSim : valorSeNão` é um operador condicional. Aqui: nenhuma dica vale três estrelas; até duas dicas valem duas; três dicas valem uma.

```js
Math.max(previous?.stars ?? 0, stars);
```

`Math.max` escolhe o maior resultado. `?.` permite consultar um campo quando o registro talvez não exista. `?? 0` usa zero apenas quando não há um valor. Assim, uma repetição pior não apaga um recorde anterior.

**Sua prática:** acrescente uma conquista por concluir o segundo mundo. Use `worldProgress(2) === 100` como condição e acrescente um teste que confirme que ela só aparece após o nível 10.

## 4. Estado: por que não podemos pular etapas?

**Arquivo:** `src/engine/session.js`.

A palavra **estado** significa os valores que descrevem a situação atual. A sessão guarda a etapa e se a prática foi aprovada.

```js
finish() {
  if (!this.passed || this.stage !== 'practice') return false;
  this.stage = 'done';
  return true;
}
```

`!` significa “não”, `||` significa “ou”. O código recusa concluir se não houver aprovação ou se a pessoa não estiver na etapa correta. O método devolve `true` apenas quando a mudança é válida.

**Sua prática:** acrescente um contador de tentativas do quiz à sessão e mostre-o como uma informação amigável, sem retirar XP. Teste que respostas erradas aumentam o contador e que uma sessão nova começa zerada.

## 5. Phaser: acrescente vida ao mapa

**Arquivo:** `src/game/map.js`.

Uma cena organiza objetos do jogo. No `create()`, o desenho é construído usando formas.

```js
const node = this.add.circle(x, y, 28, 0xffce62);
node.setInteractive({ useHandCursor: true });
node.on('pointerdown', () => onSelect(id));
```

`x` e `y` são coordenadas. `28` é o raio. A cor usa um número hexadecimal. O evento `pointerdown` funciona com mouse ou toque. A função `() => ...` é uma função curta, chamada quando a interação acontece.

**Sua prática:** desenhe uma pequena fogueira ou flor usando círculos, triângulos e linhas. Deixe o novo elemento decorativo, sem cobrir os botões. Se adicionar movimento, respeite `reducedMotion`.

## 6. Python: compare retorno e impressão

**Arquivos:** `src/content/world5.js`, `src/python/checks.js`.

```python
def dobro(numero):
    return numero * 2

resultado = dobro(4)
print(resultado)
```

`def` cria uma função. `numero` é um parâmetro: o nome que recebe o valor 4 na chamada. `return` devolve 8 para quem chamou. `print` apenas mostra o valor. Uma função que só imprime não entrega o resultado para um cálculo seguinte.

**Sua prática:** no editor do jogo, crie `triplo(numero)` e experimente com 0, um número positivo e um negativo. Depois adapte temporariamente um desafio de teste para essa função. Altere enunciado, critérios e solução de referência juntos.

## 7. Worker e programação assíncrona

**Arquivos:** `src/python/runner.js`, `src/python/worker.js`.

Uma tarefa **assíncrona** pode terminar depois, sem travar a interface. `Promise` representa um resultado futuro. `await` espera esse resultado dentro de uma função assíncrona, permitindo que a página continue respondendo.

O Worker executa Python fora da tarefa principal da interface. `postMessage` envia dados; `onmessage` recebe a resposta. Cancelar chama `terminate()`, que encerra o Worker, inclusive quando um `while True` não termina.

**Sua prática:** acrescente um indicador simples de duração da última execução na saída. Meça com `performance.now()` no controlador. Diferencie carregamento do runtime e execução do programa. Escreva um teste usando um Worker falso para evitar depender de medições lentas e imprecisas.

## 8. Um avaliador justo

**Arquivos:** `src/python/harness.js`, `src/python/checks.js`, `tests/python.test.js`.

Um teste compara o resultado observado com o esperado. Para uma função, não precisamos saber os nomes das variáveis internas nem os espaços usados: interessa o valor devolvido. Para uma aula de `while`, também queremos confirmar que essa construção foi praticada.

**Sua prática:** adicione um novo caso para a função `preparar_nome`, incluindo espaços e letras acentuadas. Acrescente uma solução alternativa válida ao teste e uma incorreta. Ambas devem ser avaliadas corretamente.

**Boa prática:** ao encontrar um bug, primeiro escreva um teste pequeno que o demonstre. Corrija o código e execute os testes relacionados. Rode a suíte completa antes de entregar uma mudança que afete outros níveis.

## Checklist pessoal antes de terminar uma alteração

- Consigo explicar o objetivo da mudança em uma frase?
- Alterei o arquivo responsável por essa função?
- Mensagens continuam claras para uma pessoa iniciante?
- A mudança funciona com teclado e tela pequena?
- O teste verifica um comportamento real, sem apenas copiar a implementação?
- Documentei alguma nova limitação ou comando necessário?

Você pode enviar a mudança que tentou e o erro que apareceu. O próximo passo é localizar a causa juntos, lendo o fluxo e a evidência do teste.
