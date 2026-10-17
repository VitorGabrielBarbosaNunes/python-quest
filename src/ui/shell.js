import { icon } from './icons.js';
import { button } from './primitives.js';
export function shell(store, screen, body) {
  const xp = store.xp;
  return `<aside class="sidebar" aria-label="Navegação principal">
    <button class="brand" data-action="home" aria-label="Python Quest — início"><img src="${import.meta.env.BASE_URL}favicon.svg" alt=""/><span>python<span class="brand-quest">quest<span class="brand-dot">.</span></span></span></button>
    <div class="nav-caption">SUA AVENTURA</div>
    <nav>${[
      ['home', 'map', 'Minha jornada'],
      ['worlds', 'sprout', 'Explorar mundos'],
      ['achievements', 'trophy', 'Conquistas'],
    ]
      .map(([action, glyph, text]) =>
        button(
          action,
          `${icon(glyph)}<span>${text}</span>`,
          `nav-item ${screen === action ? 'active' : ''}`,
        ),
      )
      .join('')}</nav>
    <div class="sidebar-note">${icon('code')}<strong>Uma linha de cada vez.</strong><p>Pequenos passos também levam a grandes descobertas.</p></div>
    <div class="sidebar-bottom">${button('settings', `${icon('settings')}<span>Configurações</span>`, 'nav-item')}${button('credits', `${icon('info')}<span>Sobre o projeto</span>`, 'nav-item')}<div class="profile"><span class="avatar">E</span><div><strong>Explorador</strong><small>Aprendiz de Python</small></div><span class="online-dot"></span></div></div>
  </aside>
  <div class="workspace"><header class="topbar"><span class="breadcrumb">Sua aventura <span>/</span> <strong>${screen === 'level' ? 'Missão em andamento' : screen === 'achievements' ? 'Conquistas' : 'Mapa da jornada'}</strong></span><div class="stats"><span class="xp">${icon('bolt')} <strong>${xp}</strong> XP</span><span class="star-stat">${icon('star')} <strong>${store.stars}</strong><span class="stat-label"> estrelas</span></span>${button('settings', icon('settings'), 'icon-button mobile-settings', 'aria-label="Configurações"')}</div></header>
  <div id="storage-warning" role="status" class="storage-warning" hidden></div><main id="main" tabindex="-1">${body}</main><footer>Feito para aprender. Livre para explorar. <span>Python Quest · 25 missões, infinitas possibilidades</span></footer></div><div id="modal-root"></div>`;
}
