export class LevelSession {
  constructor(level, draft) {
    this.level = level;
    this.stage = 'learn';
    this.question = 0;
    this.correct = false;
    this.hints = draft?.hints ?? 0;
    this.code = draft?.code ?? level.exercise.starter;
    this.passed = false;
  }
  learn() {
    if (this.stage === 'learn') this.stage = 'quiz';
  }
  answer(index) {
    const question = this.level.questions[this.question];
    if (this.stage !== 'quiz' || !Number.isInteger(index) || !question.options[index]) return null;
    this.correct = index === question.correct;
    return { correct: this.correct, feedback: question.feedback[index] };
  }
  nextQuestion() {
    if (this.stage !== 'quiz' || !this.correct) return false;
    if (this.question + 1 < this.level.questions.length) this.question++;
    else this.stage = 'practice';
    this.correct = false;
    return true;
  }
  hint() {
    this.hints = Math.min(this.level.exercise.hints.length, this.hints + 1);
  }
  verify(result) {
    this.passed = this.stage === 'practice' && result?.passed === true;
    return this.passed;
  }
  finish() {
    if (!this.passed || this.stage !== 'practice') return false;
    this.stage = 'done';
    return true;
  }
}
