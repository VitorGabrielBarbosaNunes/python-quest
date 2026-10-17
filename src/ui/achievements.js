export function achievementsView(store) {
  return `<section class="page-heading"><div><div class="eyebrow">SUA MOCHILA DE DESCOBERTAS</div><h1>Cada passo merece ser celebrado.</h1><p>${store.xp} XP acumulados · ${store.stars} de 75 estrelas conquistadas.</p></div></section><div class="achievement-grid">${store
    .achievements()
    .map(
      (a) =>
        `<article class="panel achievement ${a.earned ? 'earned' : ''}"><div class="achievement-icon">${a.icon}</div><h2>${a.title}</h2><p>${a.description}</p><span class="pill">${a.earned ? '✓ Conquistada' : 'Ainda por descobrir'}</span></article>`,
    )
    .join('')}</div>`;
}
