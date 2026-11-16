import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, Repeat, X } from 'lucide-react';
import { UI_STRINGS } from '../i18n/translations';
import { LanguageCode, TechniqueClip, TechniquePreset } from '../types/cookbook';
import { formatCountdown } from '../utils/formatters';

interface TechniquePlayerModalProps {
  clip: TechniqueClip | null;
  recipeTitle: string;
  onClose: () => void;
  lang: LanguageCode;
}

function drawTechniqueFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  preset: TechniquePreset,
  isPlaying: boolean
) {
  ctx.clearRect(0, 0, width, height);

  // Warm bistro dark slate studio backdrop for contrast
  const bgGrad = ctx.createRadialGradient(
    width * 0.5,
    height * 0.45,
    width * 0.08,
    width * 0.5,
    height * 0.5,
    width * 0.72
  );
  bgGrad.addColorStop(0, '#2C2621');
  bgGrad.addColorStop(1, '#161311');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  const cx = width * 0.5;
  const cy = height * 0.5;
  const r = Math.min(width, height) * 0.33;
  const t = progress * Math.PI * 2;

  ctx.strokeStyle = 'rgba(214, 206, 190, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.18, 0, Math.PI * 2);
  ctx.stroke();

  if (preset === 'butter-basting' || preset === 'herb-searing') {
    ctx.fillStyle = '#1E1B18';
    ctx.strokeStyle = '#57534E';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#44403C';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + r * 0.94, cy);
    ctx.lineTo(cx + r * 1.5, cy);
    ctx.stroke();

    const butterGrad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 0.88);
    butterGrad.addColorStop(0, 'rgba(217, 155, 38, 0.42)');
    butterGrad.addColorStop(0.7, 'rgba(180, 108, 22, 0.28)');
    butterGrad.addColorStop(1, 'rgba(120, 53, 15, 0.08)');
    ctx.fillStyle = butterGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.88, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 24; i++) {
      const seed = i * 1.73;
      const angle = seed + (isPlaying ? progress * 1.5 : 0);
      const dist = ((i % 7) * 0.11 + 0.15) * r;
      const bx = cx + Math.cos(angle * 2.1) * dist;
      const by = cy + Math.sin(angle * 1.7) * dist;
      const pulse = 0.5 + 0.5 * Math.sin(t * 3 + seed * 4);
      const rad = 2 + pulse * 4.5;
      ctx.fillStyle = `rgba(253, 230, 138, ${0.22 + pulse * 0.45})`;
      ctx.beginPath();
      ctx.arc(bx, by, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(cx - r * 0.08, cy + r * 0.04);
    ctx.rotate(-0.2);
    ctx.fillStyle = '#92400E';
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.45, r * 0.27, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(254, 243, 199, 0.45)';
    ctx.lineWidth = 1.5;
    for (let s = -2; s <= 2; s++) {
      ctx.beginPath();
      ctx.moveTo(s * 16 - 10, -r * 0.18);
      ctx.lineTo(s * 16 + 10, r * 0.18);
      ctx.stroke();
    }
    ctx.restore();

    const spoonPhase = Math.sin(t * 2);
    const sx = cx + spoonPhase * r * 0.35;
    const sy = cy - r * 0.38 + Math.cos(t * 2) * r * 0.16;
    ctx.strokeStyle = '#D6CEBE';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sx + 65, sy - 42);
    ctx.lineTo(sx, sy);
    ctx.stroke();
    ctx.fillStyle = 'rgba(253, 224, 71, 0.75)';
    ctx.beginPath();
    ctx.ellipse(sx, sy, 13, 8, -0.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (preset === 'emulsion-whisk') {
    ctx.fillStyle = '#29221C';
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.95, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    for (let ring = 0; ring < 5; ring++) {
      const rr = r * (0.2 + ring * 0.14);
      const offset = t * (ring % 2 === 0 ? 2 : -1.5) + ring;
      ctx.strokeStyle = `rgba(245, 194, 66, ${0.72 - ring * 0.1})`;
      ctx.lineWidth = 5 - ring * 0.6;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, offset, offset + Math.PI * 1.45);
      ctx.stroke();
    }

    for (let c = 0; c < 3; c++) {
      const a = t * 1.5 + (c * Math.PI * 2) / 3;
      const dist = r * (0.48 - 0.18 * ((progress + c * 0.3) % 1));
      const bx = cx + Math.cos(a) * dist;
      const by = cy + Math.sin(a) * dist;
      const size = 10 * (1 - ((progress + c * 0.3) % 1) * 0.5);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
      ctx.fillRect(bx - size / 2, by - size / 2, size, size);
    }

    const wx = cx + Math.sin(t * 2) * r * 0.35;
    const wy = cy + Math.sin(t * 4) * r * 0.18;
    ctx.strokeStyle = '#FBF9F5';
    ctx.lineWidth = 2;
    for (let w = 0; w < 4; w++) {
      ctx.beginPath();
      ctx.ellipse(wx, wy, 14, 7 + w * 2, w * 0.4, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (preset === 'caramel-swirl') {
    ctx.fillStyle = '#332E2A';
    ctx.strokeStyle = '#A8A29E';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.94, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const stageMix = Math.min(1, progress);
    const red = Math.round(234 - stageMix * 114);
    const green = Math.round(179 - stageMix * 126);
    const blue = Math.round(68 - stageMix * 53);

    const syrupGrad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 0.86);
    syrupGrad.addColorStop(0, `rgba(${red + 20}, ${green + 20}, ${blue + 10}, 0.92)`);
    syrupGrad.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0.88)`);
    ctx.fillStyle = syrupGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.84, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 16; i++) {
      const a = i * 2.1 + t * 0.4;
      const dist = ((i % 5) * 0.15 + 0.12) * r;
      const bx = cx + Math.cos(a) * dist;
      const by = cy + Math.sin(a) * dist;
      const br = 3 + Math.sin(t * 2 + i) * 3.5;
      ctx.strokeStyle = 'rgba(255, 248, 220, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(bx, by, Math.max(1.5, br), 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (preset === 'dough-fold') {
    ctx.fillStyle = '#292524';
    ctx.strokeStyle = '#78716C';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const foldCount = 8;
    const activeFolds = Math.floor(progress * foldCount) + 1;
    ctx.fillStyle = 'rgba(245, 232, 199, 0.22)';
    ctx.strokeStyle = '#E7DEC8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.72, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    for (let f = 0; f < foldCount; f++) {
      const angle = (f / foldCount) * Math.PI * 2;
      const isFolded = f < activeFolds;
      const innerR = isFolded ? r * 0.48 : r * 0.72;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.fillStyle = isFolded ? 'rgba(235, 214, 167, 0.65)' : 'rgba(235, 214, 167, 0.2)';
      ctx.strokeStyle = isFolded ? '#FBF9F5' : 'rgba(251, 249, 245, 0.35)';
      ctx.beginPath();
      ctx.moveTo(innerR, -22);
      ctx.lineTo(r * 0.78, -28);
      ctx.lineTo(r * 0.78, 28);
      ctx.lineTo(innerR, 22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  } else {
    ctx.fillStyle = '#3B2B20';
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 2;
    ctx.fillRect(cx - r * 1.15, cy - r * 0.68, r * 2.3, r * 1.36);
    ctx.strokeRect(cx - r * 1.15, cy - r * 0.68, r * 2.3, r * 1.36);

    const sliceCount = 12;
    const cutProgress = Math.floor(progress * sliceCount);
    for (let i = 0; i < sliceCount; i++) {
      const x = cx - r * 0.75 + i * (r * 0.13);
      const separated = i <= cutProgress ? 8 : 0;
      ctx.fillStyle = i <= cutProgress ? 'rgba(217, 155, 67, 0.8)' : 'rgba(217, 155, 67, 0.42)';
      ctx.fillRect(x - separated * 0.3, cy - r * 0.25, r * 0.09, r * 0.5);
    }

    const bladeX = cx - r * 0.75 + progress * (r * 1.5);
    const rock = Math.sin(t * 6) * 0.14;
    ctx.save();
    ctx.translate(bladeX, cy);
    ctx.rotate(rock);
    ctx.strokeStyle = '#FBF9F5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.45);
    ctx.lineTo(0, r * 0.45);
    ctx.stroke();
    ctx.restore();
  }
}

export function TechniquePlayerModal({
  clip,
  recipeTitle,
  onClose,
  lang,
}: TechniquePlayerModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState<0.5 | 1 | 1.5>(1);
  const [loop, setLoop] = useState(true);
  const t = UI_STRINGS[lang];

  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(true);
    setSpeed(1);
  }, [clip?.id]);

  useEffect(() => {
    if (!clip) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [clip, onClose]);

  useEffect(() => {
    if (!clip || !isPlaying) return;
    let last = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setCurrentTime((prev) => {
        const next = prev + dt * speed;
        if (next >= clip.durationSeconds) {
          if (loop) return 0;
          setIsPlaying(false);
          return clip.durationSeconds;
        }
        return next;
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [clip, isPlaying, speed, loop]);

  useEffect(() => {
    if (!clip || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const progress = clip.durationSeconds > 0 ? currentTime / clip.durationSeconds : 0;
    drawTechniqueFrame(ctx, canvas.width, canvas.height, progress, clip.preset, isPlaying);
  }, [clip, currentTime, isPlaying]);

  const activeStage = useMemo(() => {
    if (!clip) return null;
    let current = clip.stages[0];
    for (const stage of clip.stages) {
      if (currentTime >= stage.timeSeconds) {
        current = stage;
      }
    }
    return current;
  }, [clip, currentTime]);

  if (!clip) return null;

  const progressPct = Math.min(100, (currentTime / clip.durationSeconds) * 100);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1C1917]/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${t.preparationClipPrefix}: ${clip.title}`}
    >
      <div
        className="w-full max-w-4xl bg-[var(--bg-paper)] border border-[var(--border-line)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-[var(--border-line)] flex items-center justify-between gap-4 bg-[var(--bg-surface)]">
          <div className="min-w-0">
            <p className="text-xs font-mono text-[var(--accent-secondary)] truncate">
              {t.preparationClipPrefix} · {recipeTitle}
            </p>
            <h3 className="font-display text-xl text-[var(--text-ink)] truncate">
              {clip.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeClipAria}
            className="w-10 h-10 flex items-center justify-center border border-[var(--border-line)] text-[var(--text-ink)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual stage: Canvas motion sequence + Dish keyframe inset */}
        <div className="relative aspect-[16/9] bg-[#161311]">
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            className="w-full h-full block"
          />

          {activeStage && (
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-4 pointer-events-none">
              <div className="bg-[#1C1917]/85 border border-[#D6CEBE]/25 px-4 py-2.5 max-w-md">
                <p className="text-[11px] font-mono text-[#FDE68A]">
                  {activeStage.heatSetting}
                </p>
                <p className="font-display text-base text-[#FBF9F5] mt-0.5">
                  {activeStage.title}
                </p>
                <p className="text-xs font-serif text-[#EBE6DF] mt-1 leading-relaxed">
                  {activeStage.cue}
                </p>
              </div>

              <div className="hidden sm:block w-36 border border-[#D6CEBE]/40 bg-[#1C1917] p-1">
                <img
                  src={clip.keyframeImage}
                  alt={clip.title}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover"
                />
                <p className="text-[10px] font-mono text-[#D6CEBE] mt-1 px-1 truncate">
                  {t.targetPlate}
                </p>
              </div>
            </div>
          )}

          {/* Stage timeline markers on bottom scrim */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-5 pt-10 pb-4">
            <div className="relative h-2 bg-white/20 cursor-pointer mb-3">
              <div
                className="h-full bg-[#D97706]"
                style={{ width: `${progressPct}%` }}
              />
              {clip.stages.map((st) => {
                const leftPct = (st.timeSeconds / clip.durationSeconds) * 100;
                return (
                  <button
                    key={st.title}
                    type="button"
                    onClick={() => setCurrentTime(st.timeSeconds)}
                    title={`${st.title} (${formatCountdown(st.timeSeconds)})`}
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#FBF9F5] border border-[#1C1917] cursor-pointer hover:scale-125 transition-transform"
                    style={{ left: `${leftPct}%` }}
                  />
                );
              })}
              <input
                type="range"
                min={0}
                max={clip.durationSeconds}
                step={0.1}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                aria-label="Scrub preparation clip timeline"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 text-[#FBF9F5]">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="px-3.5 py-1.5 bg-[#FBF9F5] text-[#1C1917] text-xs font-mono flex items-center gap-1.5 cursor-pointer hover:bg-[#EBE6DF] whitespace-nowrap shrink-0"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? t.pause : t.play}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  aria-label={t.restart}
                  className="p-1.5 border border-white/25 hover:bg-white/10 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono tabular-nums text-[#EBE6DF]">
                  {formatCountdown(currentTime)} / {formatCountdown(clip.durationSeconds)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {([0.5, 1, 1.5] as const).map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setSpeed(rate)}
                    className={`px-2.5 py-1 text-xs font-mono border cursor-pointer whitespace-nowrap shrink-0 ${
                      speed === rate
                        ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                        : 'border-white/25 text-[#EBE6DF] hover:bg-white/10'
                    }`}
                  >
                    {rate}×
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setLoop((l) => !l)}
                  aria-label={t.loop}
                  className={`px-2.5 py-1 text-xs font-mono border flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
                    loop
                      ? 'bg-white/15 border-white/40 text-[#FBF9F5]'
                      : 'border-white/20 text-white/60'
                  }`}
                >
                  <Repeat className="w-3 h-3" />
                  {t.loop}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Clickable technique stage breakdown */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-[var(--bg-paper)]">
          {clip.stages.map((st, idx) => {
            const isCurrent = activeStage?.title === st.title;
            return (
              <button
                key={st.title}
                type="button"
                onClick={() => setCurrentTime(st.timeSeconds)}
                className={`text-left p-4 border transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[var(--bg-surface)] border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-paper)] border-[var(--border-line)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs font-mono text-[var(--accent-secondary)]">
                  <span>{t.stagePrefix(idx + 1)}</span>
                  <span>{formatCountdown(st.timeSeconds)}</span>
                </div>
                <p className="font-display text-base text-[var(--text-ink)] mt-1">{st.title}</p>
                <p className="text-xs font-serif text-[var(--text-muted)] mt-1.5 leading-relaxed">
                  {st.cue}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
