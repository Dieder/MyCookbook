const FRACTION_MAP: Array<{ decimal: number; glyph: string }> = [
  { decimal: 0.125, glyph: '⅛' },
  { decimal: 0.25, glyph: '¼' },
  { decimal: 0.333, glyph: '⅓' },
  { decimal: 0.375, glyph: '⅜' },
  { decimal: 0.5, glyph: '½' },
  { decimal: 0.625, glyph: '⅝' },
  { decimal: 0.667, glyph: '⅔' },
  { decimal: 0.75, glyph: '¾' },
  { decimal: 0.875, glyph: '⅞' },
];

export function formatCulinaryQuantity(value: number, unit: string): string {
  if (value <= 0) return 'To taste';

  // Keep metric grams/ml cleanly rounded
  if (unit === 'g' || unit === 'ml') {
    const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
    return `${rounded}`;
  }

  const whole = Math.floor(value + 0.001);
  const remainder = value - whole;

  if (remainder < 0.06) {
    return whole === 0 ? '¼' : `${whole}`;
  }
  if (remainder > 0.94) {
    return `${whole + 1}`;
  }

  let closest = FRACTION_MAP[0];
  let minDiff = Math.abs(remainder - closest.decimal);
  for (const item of FRACTION_MAP) {
    const diff = Math.abs(remainder - item.decimal);
    if (diff < minDiff) {
      minDiff = diff;
      closest = item;
    }
  }

  if (minDiff < 0.07) {
    return whole > 0 ? `${whole} ${closest.glyph}` : closest.glyph;
  }

  const roundedDecimal = Math.round(value * 10) / 10;
  return `${roundedDecimal}`;
}

export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function formatMinutesLabel(seconds: number): string {
  if (seconds < 60) return `${seconds} sec`;
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
}

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

export function playTimerChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [587.33, 880.0, 1174.66]; // Warm brass harmonic triad (D5, A5, D6)

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.14);

    gain.gain.setValueAtTime(0.0001, now + idx * 0.14);
    gain.gain.exponentialRampToValueAtTime(0.14, now + idx * 0.14 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 1.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.14);
    osc.stop(now + idx * 0.14 + 1.4);
  });
}

export function playSubtleClick(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(420, now);
  gain.gain.setValueAtTime(0.03, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.05);
}
