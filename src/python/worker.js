import { harness } from './harness.js';
import { checks } from './checks.js';
self.onmessage = async ({ data }) => {
  try {
    const indexURL = new URL(`${import.meta.env.BASE_URL}pyodide/`, self.location.origin).href;
    const { loadPyodide } = await import(/* @vite-ignore */ `${indexURL}pyodide.mjs`);
    const pyodide = await loadPyodide({ indexURL });
    self.postMessage({ type: 'ready' });
    if (data.mode === 'verify' && !checks[data.levelId])
      throw new Error('Este exercício não tem avaliador.');
    pyodide.globals.set(
      '_payload_json',
      JSON.stringify({
        code: data.code,
        inputs: data.inputs,
        spec: data.mode === 'verify' ? checks[data.levelId] : undefined,
      }),
    );
    await pyodide.runPythonAsync(harness);
    self.postMessage({ type: 'result', result: JSON.parse(pyodide.globals.get('_result_json')) });
  } catch (error) {
    self.postMessage({
      type: 'result',
      result: {
        passed: false,
        output: '',
        error: { type: 'RuntimeLoadError', message: String(error) },
      },
    });
  }
};
