export class Sounds {
  play(settings, success = true) {
    if (!settings.sound || settings.volume === 0) return;
    try {
      this.context ??= new (window.AudioContext || window.webkitAudioContext)();
      void this.context.resume();
      const now = this.context.currentTime;
      for (const [index, frequency] of (success ? [523, 659, 784] : [330, 294]).entries()) {
        const oscillator = this.context.createOscillator(),
          gain = this.context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(settings.volume * 0.13, now + index * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.09 + 0.18);
        oscillator.connect(gain);
        gain.connect(this.context.destination);
        oscillator.start(now + index * 0.09);
        oscillator.stop(now + index * 0.09 + 0.2);
      }
    } catch {
      /* O áudio opcional nunca impede uma atividade. */
    }
  }
}
