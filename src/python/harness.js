// A mesma rotina Python é exercitada pelos testes Node e pelo Worker do navegador.
export const harness = String.raw`
import ast as _ast
import builtins as _builtins
import contextlib as _contextlib
import io as _io
import json as _json
import traceback as _traceback

class _OutputLimit(Exception):
    pass

class _Capture(_io.StringIO):
    def write(self, text):
        if self.tell() + len(text) > 16000:
            raise _OutputLimit("A saída ultrapassou 16.000 caracteres.")
        return super().write(text)

def _normalize(text):
    return "\n".join(line.rstrip() for line in text.strip().splitlines())

def _evaluate(payload):
    code = payload["code"]
    spec = payload.get("spec")
    cases = spec.get("cases", []) if spec else [{"inputs": payload.get("inputs", [])}]
    results = []
    try:
        tree = _ast.parse(code, filename="seu_programa.py")
        compiled = compile(tree, "seu_programa.py", "exec")
    except Exception as error:
        return {"passed": False, "output": "", "error": {"type": type(error).__name__, "message": str(error), "line": getattr(error, "lineno", None)}}
    structure_error = None
    if spec:
        found = {type(node).__name__ for node in _ast.walk(tree)}
        missing = [name for name in spec.get("structure", []) if name not in found]
        calls = {node.func.id for node in _ast.walk(tree) if isinstance(node, _ast.Call) and isinstance(node.func, _ast.Name)}
        missing += [name for name in spec.get("calls", []) if name not in calls]
        if spec.get("anyLoop") and not found.intersection({"For", "While"}):
            missing.append("loop")
        for rule in spec.get("functions", []):
            function_node = next((node for node in tree.body if isinstance(node, _ast.FunctionDef) and node.name == rule["name"]), None)
            if function_node is None:
                missing.append(rule["name"])
            else:
                inside = {type(node).__name__ for node in _ast.walk(function_node)}
                missing += [name for name in rule.get("structure", []) if name not in inside]
                if rule.get("anyLoop") and not inside.intersection({"For", "While"}):
                    missing.append("loop dentro da função")
        reads = {node.id for node in _ast.walk(tree) if isinstance(node, _ast.Name) and isinstance(node.ctx, _ast.Load)}
        if spec.get("hasElse") and not any(isinstance(node, _ast.If) and node.orelse for node in _ast.walk(tree)):
            missing.append("else")
        if spec.get("hasElif") and not any(isinstance(node, _ast.If) and node.orelse and isinstance(node.orelse[0], _ast.If) for node in _ast.walk(tree)):
            missing.append("elif")
        if missing or any(name not in reads for name in spec.get("reads", [])):
            structure_error = spec.get("structureFeedback", "A saída pode estar certa, mas pratique a construção pedida no enunciado e use as variáveis criadas.")
    for case in cases:
        stdout = _Capture()
        stderr = _Capture()
        inputs = iter(case.get("inputs", []))
        input_count = 0
        def controlled_input(prompt=""):
            nonlocal input_count
            # O prompt não entra na saída avaliada; a UI explica os campos de entrada.
            input_count += 1
            try:
                return str(next(inputs))
            except StopIteration:
                raise EOFError("Faltam entradas. Preencha uma linha para cada input() e execute novamente.")
        allowed = dict(vars(_builtins))
        allowed["input"] = controlled_input
        original_import = _builtins.__import__
        def limited_import(name, *args, **kwargs):
            if name.split('.')[0] not in {"math", "random", "string"}:
                raise ImportError("Nesta aventura, só estão disponíveis os módulos math, random e string.")
            return original_import(name, *args, **kwargs)
        allowed["__import__"] = limited_import
        allowed["open"] = lambda *args, **kwargs: (_ for _ in ()).throw(PermissionError("Arquivos não são necessários nesta atividade."))
        namespace = {"__builtins__": allowed, "__name__": "__main__"}
        error_info = None
        ok = True
        reasons = []
        try:
            with _contextlib.redirect_stdout(stdout), _contextlib.redirect_stderr(stderr):
                exec(compiled, namespace, namespace)
                if "call" in case:
                    call = case["call"]
                    function = namespace.get(call["name"])
                    if not callable(function):
                        ok = False
                        reasons.append("Crie a função pedida com o nome indicado.")
                    else:
                        if "inputs" in call:
                            inputs = iter(call["inputs"])
                        function_output = _Capture()
                        with _contextlib.redirect_stdout(function_output):
                            value = function(*call.get("args", []))
                        if "output" in call and _normalize(function_output.getvalue()) != _normalize(call["output"]):
                            ok = False
                            reasons.append("Confira a saída produzida dentro da função pedida.")
                        if value != call["expected"] or isinstance(value, bool) != isinstance(call["expected"], bool):
                            ok = False
                            reasons.append("A função não retornou o valor esperado em uma das situações. Confira o return.")
            if "output" in case and _normalize(stdout.getvalue()) != _normalize(case["output"]):
                ok = False
                reasons.append("A saída está diferente da esperada. Confira os textos, a ordem e os cálculos.")
            for name, expected in case.get("values", {}).items():
                actual = namespace.get(name)
                if actual != expected or type(actual) is not type(expected):
                    ok = False
                    reasons.append("Confira os valores e os tipos das variáveis pedidas.")
            if input_count < case.get("minInputs", 0):
                ok = False
                reasons.append("Use input() para ler as entradas; não deixe a resposta fixa no código.")
        except BaseException as error:
            ok = False
            frames = _traceback.extract_tb(error.__traceback__)
            line = next((frame.lineno for frame in reversed(frames) if frame.filename == "seu_programa.py"), None)
            error_info = {"type": type(error).__name__, "message": str(error), "line": line}
        results.append({"ok": ok, "output": stdout.getvalue(), "stderr": stderr.getvalue(), "error": error_info, "reasons": reasons})
    passed_count = sum(1 for result in results if result["ok"])
    first = results[0] if results else {"output": "", "stderr": ""}
    failure = next((result for result in results if not result["ok"]), None)
    return {
        "passed": bool(spec) and passed_count == len(cases) and not structure_error,
        "output": first["output"], "stderr": first["stderr"],
        "error": failure.get("error") if failure else None,
        "passedCount": passed_count, "total": len(cases),
        "feedback": structure_error or ((failure.get("reasons") or [None])[0] if failure else None)
    }

_result_json = _json.dumps(_evaluate(_json.loads(_payload_json)), ensure_ascii=False)
`;
