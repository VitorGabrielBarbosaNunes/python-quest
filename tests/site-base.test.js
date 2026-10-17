import { it, expect } from 'vitest';
import { siteBase } from '../config/site-base.js';
it.each([
  [undefined, '/'],
  ['', '/'],
  ['/', '/'],
  ['/python-quest', '/python-quest/'],
  ['PythonLearning/', '/PythonLearning/'],
  ['/python-quest/', '/python-quest/'],
])('normaliza o caminho de publicação %s', (input, expected) => {
  expect(siteBase(input)).toBe(expected);
});
