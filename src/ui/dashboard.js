import { icon, escapeHtml as e } from './icons.js';
import { button, stars } from './primitives.js';
import { worlds } from '../content/worlds.js';
import { levels } from '../content/catalog.js';
const mascot = `<svg class="mascot" viewBox="0 0 160 180" aria-hidden="true"><ellipse cx="80" cy="166" rx="49" ry="9" fill="#103f35" opacity=".15"/><path d="m43 140-8 22h24l8-22m27 0 8 22h24l-8-22" fill="#f3ca67"/><rect x="36" y="38" width="89" height="111" rx="35" fill="#c3e2ad"/><path d="M41 65Q20 46 28 28q25 3 35 29M97 52q6-32 31-32 10 25-13 47" fill="#83b78d"/><rect x="39" y="61" width="82" height="67" rx="29" fill="#e6f2d4"/><circle cx="60" cy="88" r="6" fill="#254f43"/><circle cx="102" cy="88" r="6" fill="#254f43"/><path d="M72 105q9 9 18-1" stroke="#254f43" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="52" cy="103" rx="8" ry="4" fill="#edb098"/><ellipse cx="111" cy="103" rx="8" ry="4" fill="#edb098"/><path d="m38 123 85 1-8 18-37-6-34 7Z" fill="#efc65e"/><path d="m91 135 8 23 17-10-10-17" fill="#e8b54c"/><path d="M32 118 17 94m111 28 17-21" stroke="#b2d699" stroke-width="12" stroke-linecap="round"/><path d="m10 79 11-10m-9-5 8 15" stroke="#f5d875" stroke-width="3"/></svg>`;

export function homeView(store, worldId = 1, worldScreen = false) {
  const world = worlds[worldId - 1],
    level = levels.find((item) => item.id === store.current) ?? levels[0];
  const allDone = store.xp === 2500;
  return `<section class="page-heading"><div><div class="eyebrow">APRENDA. EXPLORE. CRIE.</div><h1>${worldScreen ? 'Cinco mundos. Uma grande aventura.' : allDone ? 'O código agora é seu.' : 'Sua próxima descoberta começa aqui.'}</h1><p>${worldScreen ? 'Cada região traz novas habilidades para sua mochila.' : 'Aprenda Python no seu ritmo e transforme curiosidade em código.'}</p></div><span class="journey-badge">${icon('sprout')} Jornada de iniciante</span></section>
  ${!worldScreen ? `<section class="hero"><div class="hero-copy"><span class="hero-label"><span class="tiny-star">✦</span> ${allDone ? 'AVENTURA CONCLUÍDA' : 'SEU FUTURO COMEÇA COM UM OLÁ'}</span><h2>${allDone ? '25 missões.<br>Um novo começo.' : 'Pequenas linhas.<br>Grandes aventuras.'}</h2><p>${allDone ? 'Revisite seus desafios, melhore suas estrelas e continue criando.' : 'Conheça Pip, seu companheiro de jornada.<br>Vamos descobrir o que você é capaz de criar?'}</p>${button('continue', `${icon('play')} ${store.xp ? 'Continuar aventura' : 'Jogar · começar aventura'} ${icon('arrow')}`, 'button golden')}<span class="hero-footnote">Sem cadastro. Sem pressa. Do seu jeito.</span></div><div class="hero-art"><span class="floating-code code-one">print("Olá, mundo!")</span><span class="hero-spark s1">✧</span><span class="hero-spark s2">+</span><span class="hero-spark s3">✦</span><div class="mascot-disc">${mascot}</div><span class="floating-code code-two">&lt; sua jornada começa /&gt;</span><span class="pip-label">Pip, seu guia de descobertas</span></div></section>` : ''}
  <section class="world-section" aria-labelledby="world-title"><div class="section-heading"><h2 id="world-title">Os mundos da sua jornada</h2><span>${Object.keys(store.data.completed).length} de 25 missões concluídas</span></div><div class="world-grid">${worlds
    .map((w) => {
      const unlocked = store.isUnlocked((w.id - 1) * 5 + 1),
        percent = store.worldProgress(w.id);
      return `<button class="world-card ${w.theme} ${worldId === w.id ? 'selected' : ''} ${!unlocked ? 'locked' : ''}" data-action="world" data-id="${w.id}" aria-pressed="${worldId === w.id}" aria-label="Mundo ${w.id}: ${e(w.name)}. ${unlocked ? `${percent}% concluído` : 'Bloqueado'}"><div class="world-card-top"><span class="world-icon">${icon(w.icon)}</span>${!unlocked ? icon('lock') : percent === 100 ? icon('check') : '<span class="world-number">0' + w.id + '</span>'}</div><small>MUNDO ${w.id}</small><h3>${w.short}</h3><div class="progress-track"><span style="width:${percent}%"></span></div><span class="progress-text">${unlocked ? `${percent}% explorado` : `Conclua o mundo ${w.id - 1}`}</span></button>`;
    })
    .join('')}</div></section>
  <section class="map-section" aria-labelledby="map-heading"><div class="section-heading"><div><div class="eyebrow">MUNDO ${world.id} <span class="dot-separator">·</span> ${e(world.landscape)}</div><h2 id="map-heading">${e(world.name)}</h2></div><span class="pill">${store.worldProgress(world.id) / 20}/5 missões</span></div><div class="map-frame"><div id="adventure-map" role="img" aria-label="Caminho ilustrado com cinco missões. Os mesmos níveis estão disponíveis nos botões logo abaixo."></div><span class="map-caption">${icon(world.icon)} ${e(world.description)}</span></div><div class="level-strip">${Array.from(
    { length: 5 },
    (_, index) => {
      const id = (world.id - 1) * 5 + index + 1,
        item = levels.find((l) => l.id === id),
        unlocked = store.isUnlocked(id) && Boolean(item),
        done = store.data.completed[id];
      return `<button class="level-card ${id === store.current ? 'current' : ''}" data-action="level" data-id="${id}" ${unlocked ? '' : 'disabled'}><span class="level-card-number">${done ? icon('check') : unlocked ? String(id).padStart(2, '0') : icon('lock')}</span><strong>${item ? e(item.title) : 'Em preparação'}</strong>${done ? stars(done.stars) : `<small>${index === 4 ? 'Missão especial' : unlocked ? 'Pronto para explorar' : 'Bloqueado'}</small>`}</button>`;
    },
  ).join('')}</div></section>
  <section class="bottom-grid"><div class="next-mission"><span class="square-icon">${icon('book')}</span><div><small>${allDone ? 'REVISITE UMA MISSÃO' : 'SEU PRÓXIMO PASSO'}</small><h3>${e(level.title)}</h3><p>${e(level.objective)}</p></div>${button('continue', icon('arrow'), 'round-button', 'aria-label="Abrir próxima missão"')}</div><div class="guide-tip">${icon('bulb')}<div><strong>Errar faz parte da aventura.</strong><p>Experimente, observe e tente de novo.<br>Aqui, cada tentativa ensina algo.</p></div></div></section>`;
}
