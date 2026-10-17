export const quiz = (prompt, options, correct, feedback) => ({
  prompt,
  options,
  correct,
  feedback,
});
export function level(id, title, objective, paragraphs, code, output, questions, exercise) {
  return {
    id,
    world: Math.ceil(id / 5),
    number: id,
    title,
    objective,
    prerequisites: id === 1 ? [] : [id - 1],
    special: id % 5 === 0,
    explanation: paragraphs,
    examples: [{ code, output }],
    questions,
    exercise: { mode: 'write', inputs: [], ...exercise },
    completion: ['learn', 'quiz', 'practice'],
    rewards: { xp: 100, maxStars: 3 },
  };
}
