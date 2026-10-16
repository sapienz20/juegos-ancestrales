// Sonidos sintetizados mientras se graban los audios reales con la comunidad.
// Sonido 3 imita el zumbido del zumbambico al girar con el viento.

let ctx: AudioContext | null = null;
let current: { stop: () => void } | null = null;

function ac() {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function noise(c: AudioContext, secs: number) {
  const b = c.createBuffer(1, c.sampleRate * secs, c.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource();
  s.buffer = b;
  return s;
}

export function stopSound() {
  current?.stop();
  current = null;
}

export function playSound(i: number, onEnd?: () => void): number {
  stopSound();
  const c = ac();
  const t = c.currentTime;
  const out = c.createGain();
  out.connect(c.destination);
  const nodes: AudioScheduledSourceNode[] = [];
  let dur = 2.4;

  if (i === 0) {
    // tambor
    dur = 2.2;
    for (let k = 0; k < 4; k++) {
      const o = c.createOscillator();
      const g = c.createGain();
      o.frequency.setValueAtTime(140, t + k * 0.5);
      o.frequency.exponentialRampToValueAtTime(45, t + k * 0.5 + 0.35);
      g.gain.setValueAtTime(0.0001, t + k * 0.5);
      g.gain.exponentialRampToValueAtTime(0.9, t + k * 0.5 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + k * 0.5 + 0.4);
      o.connect(g).connect(out);
      o.start(t + k * 0.5);
      o.stop(t + k * 0.5 + 0.45);
      nodes.push(o);
    }
  } else if (i === 1) {
    // pájaro
    dur = 2.0;
    for (let k = 0; k < 5; k++) {
      const st = t + k * 0.38;
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(2600, st);
      o.frequency.exponentialRampToValueAtTime(4200, st + 0.08);
      o.frequency.exponentialRampToValueAtTime(2900, st + 0.16);
      g.gain.setValueAtTime(0.0001, st);
      g.gain.exponentialRampToValueAtTime(0.25, st + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, st + 0.18);
      o.connect(g).connect(out);
      o.start(st);
      o.stop(st + 0.2);
      nodes.push(o);
    }
  } else if (i === 2) {
    // zumbambico: zumbido que sube y baja al girar
    dur = 3.2;
    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(90, t);
    o.frequency.linearRampToValueAtTime(170, t + 1.2);
    o.frequency.linearRampToValueAtTime(120, t + 2.2);
    o.frequency.linearRampToValueAtTime(160, t + 3.1);
    const f = c.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 600;
    f.Q.value = 1.2;
    const g = c.createGain();
    g.gain.value = 0.35;
    const lfo = c.createOscillator();
    lfo.frequency.setValueAtTime(5, t);
    lfo.frequency.linearRampToValueAtTime(9, t + 1.5);
    const lg = c.createGain();
    lg.gain.value = 0.25;
    lfo.connect(lg).connect(g.gain);
    const env = c.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(1, t + 0.4);
    env.gain.setValueAtTime(1, t + 2.7);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
    o.connect(f).connect(g).connect(env).connect(out);
    o.start(t);
    lfo.start(t);
    o.stop(t + 3.2);
    lfo.stop(t + 3.2);
    nodes.push(o, lfo);
  } else {
    // agua / lluvia
    dur = 2.6;
    const n = noise(c, dur);
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 900;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.4);
    g.gain.setValueAtTime(0.5, t + 2.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
    n.connect(f).connect(g).connect(out);
    n.start(t);
    nodes.push(n);
  }

  const timer = window.setTimeout(() => {
    current = null;
    onEnd?.();
  }, dur * 1000);
  current = {
    stop: () => {
      window.clearTimeout(timer);
      nodes.forEach((x) => {
        try {
          x.stop();
        } catch {
          /* ya terminó */
        }
      });
      out.disconnect();
      onEnd?.();
    },
  };
  return dur;
}

export function chime(ok: boolean) {
  try {
    const c = ac();
    const t = c.currentTime;
    const notes = ok ? [523, 659, 784] : [330, 262];
    notes.forEach((fq, k) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'triangle';
      o.frequency.value = fq;
      g.gain.setValueAtTime(0.0001, t + k * 0.12);
      g.gain.exponentialRampToValueAtTime(0.25, t + k * 0.12 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + k * 0.12 + 0.35);
      o.connect(g).connect(c.destination);
      o.start(t + k * 0.12);
      o.stop(t + k * 0.12 + 0.4);
    });
  } catch {
    /* sin audio */
  }
}
