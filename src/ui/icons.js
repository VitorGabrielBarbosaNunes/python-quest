const paths = {
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
  star: '<path d="m12 3 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3L12 17.4l-5.6 3 1.1-6.3L3 9.6l6.2-.9L12 3Z"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>',
  trophy:
    '<path d="M8 3h8v7a4 4 0 0 1-8 0V3ZM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4M12 14v5m-4 2h8"/>',
  settings:
    '<path d="m9 3-1 3-3 1-2 5 2 5 3 1 1 3h6l1-3 3-1 2-5-2-5-3-1-1-3H9Z"/><circle cx="12" cy="12" r="3"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
  play: '<path d="m8 4 12 8-12 8V4Z"/>',
  book: '<path d="M12 5c-3-3-7-2-9-1v15c3-1 6-2 9 1 3-3 6-2 9-1V4c-3-1-6-2-9 1Zm0 0v15"/>',
  code: '<path d="m7 6-5 6 5 6m10-12 5 6-5 6M14 3l-4 18"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  bulb: '<path d="M8 16c0-3-3-3-3-7a7 7 0 0 1 14 0c0 4-3 4-3 7M8 16h8m-7 4h6"/>',
  sprout: '<path d="M12 21V10M12 14C4 14 3 9 3 5c7 0 9 4 9 9ZM12 10c0-5 3-8 9-8 0 6-3 8-9 8Z"/>',
  house: '<path d="m2 11 10-8 10 8M5 9v12h14V9M10 21v-7h4v7"/>',
  tree: '<path d="m12 2-7 9h4l-6 7h18l-6-7h4L12 2Zm0 16v4"/>',
  mountain: '<path d="m2 21 8-17 5 10 3-6 5 13H2ZM7 10l3 2 3-2"/>',
  castle: '<path d="M3 21V6h4V3h3v6h4V3h3v3h4v15H3Zm7 0v-7h4v7"/>',
  reset: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
};
export const icon = (name, cls = '') =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? paths.star}</svg>`;
export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );
