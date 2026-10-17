export class PythonRunner {
  constructor({
    workerFactory = () => new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }),
    loadTimeout = 60000,
    runTimeout = 3000,
  } = {}) {
    this.workerFactory = workerFactory;
    this.loadTimeout = loadTimeout;
    this.runTimeout = runTimeout;
    this.job = null;
  }
  execute(payload, onStatus = () => {}) {
    this.cancel();
    if (payload.code.length > 20000)
      return Promise.resolve({
        passed: false,
        output: '',
        error: { type: 'CodeLimit', message: 'Use até 20.000 caracteres.' },
      });
    return new Promise((resolve) => {
      let worker;
      try {
        worker = this.workerFactory();
      } catch (error) {
        resolve({
          passed: false,
          output: '',
          error: { type: 'RuntimeLoadError', message: String(error) },
        });
        return;
      }
      const job = { worker, resolve, timer: null };
      this.job = job;
      const finish = (result) => {
        if (this.job !== job) return;
        clearTimeout(job.timer);
        worker.terminate();
        this.job = null;
        resolve(result);
      };
      job.finish = finish;
      job.timer = setTimeout(
        () =>
          finish({
            passed: false,
            output: '',
            error: {
              type: 'RuntimeLoadError',
              message: 'O carregamento levou tempo demais. Tente novamente.',
            },
          }),
        this.loadTimeout,
      );
      worker.onmessage = ({ data }) => {
        if (this.job !== job) return;
        if (data.type === 'ready') {
          clearTimeout(job.timer);
          onStatus('Executando seu programa…');
          job.timer = setTimeout(
            () =>
              finish({
                passed: false,
                output: '',
                error: {
                  type: 'TimeoutError',
                  message: 'O programa ultrapassou 3 segundos. Verifique a condição dos loops.',
                },
              }),
            this.runTimeout,
          );
        }
        if (data.type === 'result') finish(data.result);
      };
      worker.onerror = () =>
        finish({
          passed: false,
          output: '',
          error: { type: 'RuntimeLoadError', message: 'Não foi possível iniciar o Python local.' },
        });
      onStatus('Preparando o Python… Na primeira vez, isso pode levar alguns segundos.');
      worker.postMessage(payload);
    });
  }
  cancel() {
    this.job?.finish({
      passed: false,
      output: '',
      error: {
        type: 'CancelledError',
        message: 'Execução cancelada. Você pode ajustar o código e tentar de novo.',
      },
    });
  }
}
