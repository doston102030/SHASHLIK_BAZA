let audioCtx = null;

function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) audioCtx = new AudioContextClass();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playTone(ctx, freq, startTime, duration, peakGain) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Yoqimli, yumshoq ikki ohangli "pop" tovushi
  playTone(ctx, 987.77, now, 0.09, 0.22);
  playTone(ctx, 1318.51, now + 0.045, 0.12, 0.18);
}

export function playSuccessSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Zo'r, ko'tarinki uch ohangli "saqlandi" tovushi
  playTone(ctx, 783.99, now, 0.12, 0.3);
  playTone(ctx, 1046.5, now + 0.07, 0.14, 0.32);
  playTone(ctx, 1567.98, now + 0.14, 0.22, 0.34);
}
