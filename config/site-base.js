// GitHub Pages pode servir na raiz ou dentro do nome do repositório.
export function siteBase(path = '') {
  const segment = path.replace(/^\/+|\/+$/g, '');
  return segment ? `/${segment}/` : '/';
}
