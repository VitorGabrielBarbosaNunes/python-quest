const messages = {
  SyntaxError: 'Python não entendeu a escrita. Confira aspas, parênteses e os dois-pontos.',
  NameError: 'Um nome ainda não foi criado. Confira a grafia e defina a variável antes de usá-la.',
  TypeError:
    'Os tipos não combinam com essa operação. Confira se precisa converter um texto em número.',
  IndentationError:
    'A indentação indica quais linhas pertencem a um bloco. Use quatro espaços dentro de if, loops e funções.',
  TabError: 'Há uma mistura de tabulações e espaços. Use quatro espaços em cada nível do bloco.',
  ValueError: 'Esse valor não pôde ser convertido. Para int(), por exemplo, use um texto como 12.',
  IndexError:
    'Essa posição não existe na sequência. A contagem começa em zero: o último índice é o tamanho menos um.',
  ZeroDivisionError: 'Não é possível dividir por zero. Confira o divisor antes de calcular.',
  EOFError: 'Faltam entradas. Preencha uma linha no campo de entradas para cada input().',
  TimeoutError:
    'O tempo acabou. Seu loop pode não estar terminando. Confira se a condição muda a cada repetição.',
  _OutputLimit: 'A saída ficou grande demais. Confira se um loop está imprimindo sem parar.',
  RuntimeLoadError:
    'Não conseguimos preparar o Python. Tente executar novamente. Se o problema continuar, recarregue a página e consulte a ajuda do projeto.',
  CancelledError: 'Execução cancelada. Seu código continua no editor.',
  ImportError:
    'Esta atividade permite apenas os módulos math, random e string. Confira se a importação é necessária.',
  PermissionError:
    'Esta atividade não precisa acessar arquivos. Trabalhe com os valores do programa e as entradas fornecidas.',
  AttributeError: 'Essa operação não existe para esse valor. Confira o tipo e a grafia do método.',
  RecursionError:
    'Uma função chamou a si mesma muitas vezes. Confira se existe uma condição para parar.',
  CodeLimit: 'O código ultrapassou 20.000 caracteres. Reduza o programa e tente novamente.',
};
export function explainResult(result, verify = false) {
  if (result.error) {
    const { type, message, line } = result.error;
    return {
      kind: 'error',
      title: type === 'CancelledError' ? 'Execução interrompida' : 'Vamos ajustar o código',
      text: `${verify && result.passedCount > 0 ? `${result.passedCount} de ${result.total} situações funcionaram. ` : ''}${messages[type] ?? 'O programa encontrou um problema. Confira a linha indicada e abra o detalhe do Python para investigar.'}${line ? ` Veja a linha ${line}.` : ''}`,
      detail: `${type}: ${message}`,
    };
  }
  if (!verify)
    return {
      kind: 'info',
      title: 'Programa executado',
      text: 'Observe a saída. Quando estiver pronto, use Verificar resposta para concluir a missão.',
    };
  if (result.passed)
    return {
      kind: 'success',
      title: 'Missão cumprida!',
      text: 'Seu programa passou por todas as verificações. Vamos celebrar essa conquista?',
    };
  const partial = result.passedCount > 0 && result.passedCount < result.total;
  return {
    kind: 'error',
    title: partial ? 'Você está no caminho!' : 'Mais uma pequena mudança',
    text: `${partial ? `${result.passedCount} de ${result.total} situações funcionaram. ` : ''}${result.feedback ?? 'Confira a saída pedida e tente novamente.'}`,
  };
}
