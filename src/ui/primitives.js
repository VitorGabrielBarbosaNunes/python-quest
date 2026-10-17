export const button = (action, text, className = 'button primary', extra = '') =>
  `<button class="${className}" data-action="${action}" ${extra}>${text}</button>`;
export const stars = (count) =>
  `<span class="stars" aria-label="${count} de 3 estrelas">${[1, 2, 3].map((i) => `<span class="${i <= count ? 'earned' : ''}">★</span>`).join('')}</span>`;
