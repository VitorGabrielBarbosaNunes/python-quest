import { world1 } from './world1.js';
import { world2 } from './world2.js';
import { world3 } from './world3.js';
import { world4 } from './world4.js';
import { world5 } from './world5.js';
export const levels = [...world1, ...world2, ...world3, ...world4, ...world5];
export const getLevel = (id) => levels.find((level) => level.id === Number(id));
export function validateCatalog(catalog) {
  const errors = [];
  const ids = new Set();
  for (const level of catalog) {
    if (ids.has(level.id)) errors.push(`ID repetido: ${level.id}`);
    ids.add(level.id);
    if (level.world !== Math.ceil(level.id / 5)) errors.push(`Mundo inválido: ${level.id}`);
    if (!level.title || !level.objective || !level.explanation.length || !level.examples.length)
      errors.push(`Aula incompleta: ${level.id}`);
    if (level.questions.length < 2 || level.questions.length > 3)
      errors.push(`Quantidade de perguntas: ${level.id}`);
    for (const question of level.questions) {
      if (
        question.options.length < 2 ||
        question.options.length > 4 ||
        !question.options[question.correct] ||
        question.feedback.length !== question.options.length
      )
        errors.push(`Quiz inválido: ${level.id}`);
    }
    if (!level.exercise?.prompt || !level.exercise?.starter || level.exercise.hints.length !== 3)
      errors.push(`Exercício incompleto: ${level.id}`);
  }
  return errors;
}
