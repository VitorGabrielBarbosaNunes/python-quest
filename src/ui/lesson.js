import { icon, escapeHtml as e } from './icons.js';
import { button, stars } from './primitives.js';
import { worlds } from '../content/worlds.js';
export function levelView(session, reward) {
  const l = session.level;
  return `<div class="lesson-top">${button('home', `${icon('back')} Voltar ao mapa`, 'text-button')}<span>MUNDO ${l.world} <span class="dot-separator">/</span> NÍVEL ${String(l.id).padStart(2, '0')}${l.special ? ' · MISSÃO ESPECIAL' : ''}</span></div><section class="lesson-heading"><div class="eyebrow">${e(worlds[l.world - 1].name)}</div><h1>${e(l.title)}</h1><p>${e(l.objective)}</p></section><ol class="stepper" aria-label="Etapas da missão">${[
    ['learn', 'Aprender', 'book'],
    ['quiz', 'Quiz', 'bulb'],
    ['practice', 'Praticar', 'code'],
    ['done', 'Conquistar', 'trophy'],
  ]
    .map(
      ([key, label, glyph], index) =>
        `<li class="${key === session.stage ? 'active' : ''}" ${key === session.stage ? 'aria-current="step"' : ''}><span>${icon(glyph)}</span><strong>${index + 1}. ${label}</strong></li>`,
    )
    .join(
      '',
    )}</ol>${session.stage === 'learn' ? learnView(l) : session.stage === 'quiz' ? quizView(session) : session.stage === 'practice' ? practiceView(session) : doneView(l, reward)}`;
}
function learnView(level) {
  const example = level.examples[0];
  return `<section class="learn-grid"><article class="panel lesson-reading"><span class="tag">UMA NOVA DESCOBERTA</span><h2>${level.id === 1 ? 'Você dá as instruções.<br>O computador segue a aventura.' : 'Vamos entender juntos.'}</h2>${level.explanation.map((p) => `<p>${e(p)}</p>`).join('')}<div class="learning-note">${icon('bulb')}<span>Leia, experimente e observe. Você pode executar o exemplo quantas vezes quiser.</span></div>${button('learn-next', `Entendi, vamos praticar ${icon('arrow')}`)}</article><aside class="example-card"><div class="code-toolbar"><span><span class="code-dot"></span> exemplo.py</span><span>PYTHON</span></div><pre class="example-code"><code>${e(example.code)}</code></pre><div class="expected-output"><small>SAÍDA ESPERADA</small><pre>${e(example.output)}</pre></div>${button('run-example', `${icon('play')} Executar exemplo`, 'button secondary')}<div id="example-status" role="status"></div><pre id="example-output" class="example-result" hidden></pre><div class="example-note">${icon('code')} Código de verdade. Descobertas de verdade.</div></aside></section>`;
}
function quizView(session) {
  const question = session.level.questions[session.question];
  return `<section class="panel quiz-panel"><span class="tag">PERGUNTA ${session.question + 1} DE ${session.level.questions.length}</span><h2>${e(question.prompt)}</h2><p>Escolha uma resposta. Se precisar, tente outra vez.</p><div class="quiz-options">${question.options.map((option, index) => button('answer', `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${e(option)}</span>`, 'quiz-option', `data-id="${index}"`)).join('')}</div><div id="quiz-feedback" role="status" aria-live="polite"></div>${button('quiz-next', `Continuar ${icon('arrow')}`, 'button primary', 'id="quiz-next" disabled')}</section>`;
}
function practiceView(session) {
  const exercise = session.level.exercise;
  return `<section class="practice-grid"><article class="panel mission-brief"><span class="tag">${session.level.special ? 'MISSÃO ESPECIAL' : 'AGORA É COM VOCÊ'}</span><h2>${session.level.special ? 'Junte suas descobertas.' : 'Transforme a ideia em código.'}</h2><p>${e(exercise.prompt)}</p>${exercise.prediction ? `<div class="prediction"><strong>${e(exercise.prediction)}</strong>${exercise.predictionOptions.map((option, index) => button('predict', e(option), 'button secondary', `data-id="${index}"`)).join('')}<p id="prediction-feedback" role="status"></p></div>` : ''}<div class="mission-checklist"><span>${icon('check')} Leia o objetivo com atenção.</span><span>${icon('play')} Execute para experimentar.</span><span>${icon('trophy')} Verifique para conquistar suas estrelas.</span></div><div class="hint-box"><h3>${icon('bulb')} Uma luz no caminho</h3><p>Dicas ajudam a aprender. Pedir ajuda também faz parte!</p><div id="hints">${exercise.hints
    .slice(0, session.hints)
    .map((hint, index) => `<p class="hint"><strong>${index + 1}.</strong> ${e(hint)}</p>`)
    .join(
      '',
    )}</div>${button('hint', `Mostrar dica (${session.hints}/3)`, 'button secondary', `id="hint-button" ${session.hints >= 3 ? 'disabled' : ''}`)}<small>0 dicas: 3 estrelas · 1–2: 2 estrelas · 3: 1 estrela</small></div></article><div class="editor-column"><div class="editor-card"><div class="code-toolbar"><span><span class="code-dot"></span> missao_${String(session.level.id).padStart(2, '0')}.py</span><span>PYTHON 3</span></div>${exercise.mode === 'order' ? `<div class="order-controls"><span>Organizar duas linhas:</span>${button('swap-lines', '↕ Trocar ordem', 'text-button')}</div>` : ''}<label for="code-editor" class="sr-only">Seu código Python</label><div class="editor-wrap"><pre id="line-numbers" aria-hidden="true">1</pre><textarea id="code-editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" maxlength="20000" aria-describedby="editor-help">${e(session.code)}</textarea></div><div class="editor-help" id="editor-help">Tab insere 4 espaços · Esc libera Tab para navegar · Ctrl+Enter executa</div><div class="editor-actions">${button('run', `${icon('play')} Executar`, 'button secondary', 'id="run-button"')}${button('verify', `${icon('check')} Verificar resposta`, 'button primary', 'id="verify-button"')}${button('cancel', 'Cancelar', 'button subtle', 'id="cancel-button" hidden')}${button('restore', icon('reset'), 'icon-button', 'aria-label="Restaurar código inicial" title="Restaurar código inicial"')}</div></div><div class="input-panel"><label for="program-input">Entradas do programa <small>Uma linha para cada input()</small></label><textarea id="program-input" rows="2" placeholder="Exemplo: Lia&#10;16">${e(exercise.inputs.join('\n'))}</textarea><small>Os textos de pergunta do input() não são adicionados à saída. A verificação usa entradas próprias.</small></div><div class="output-panel"><div class="output-heading"><h3>${icon('code')} Saída do programa</h3><span id="execution-status" role="status">Pronto para executar</span></div><pre id="program-output" tabindex="0">Sua próxima descoberta aparece aqui.</pre></div><div id="run-feedback" role="status" aria-live="polite"></div>${button('finish', `Concluir missão ${icon('arrow')}`, 'button primary finish-button', 'id="finish-button" hidden')}</div></section>`;
}
function doneView(level, reward) {
  return `<section class="panel completion"><div class="completion-medal">${icon('trophy')}</div><span class="tag">${level.id === 25 ? 'AVENTURA CONCLUÍDA' : 'MAIS UMA DESCOBERTA NA MOCHILA'}</span><h2>${level.id === 25 ? 'Você criou seu próprio jogo!' : 'Missão cumprida, explorador!'}</h2>${stars(reward?.stars ?? 1)}<p>${e(level.exercise.summary)}</p><div class="reward-row"><span>${icon('bolt')} <strong>+${reward?.xp ?? 0} XP</strong><small>${reward?.xp ? 'Nova missão concluída' : 'XP já recebido nesta missão'}</small></span><span>${icon('star')} <strong>${reward?.best ?? 1}/3 estrelas</strong><small>Seu melhor resultado</small></span></div><div class="completion-actions">${button('repeat', 'Repetir nível', 'button secondary')}${button(level.id < 25 ? 'next-level' : 'home', `${level.id < 25 ? 'Próximo nível' : 'Voltar ao mapa'} ${icon('arrow')}`)}</div><p class="completion-tip">${level.id === 25 ? 'Experimente acrescentar novos caminhos e personagens ao seu jogo.' : 'Você pode voltar a qualquer missão concluída para experimentar e melhorar suas estrelas.'}</p></section>`;
}
