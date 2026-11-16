import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Pause,
  Play,
  PlayCircle,
  Plus,
  RotateCcw,
  X,
} from 'lucide-react';
import { formatPersonLabel, UI_STRINGS } from '../i18n/translations';
import {
  ActiveTimer,
  LanguageCode,
  Recipe,
  TechniqueClip,
  UnitSystem,
} from '../types/cookbook';
import {
  formatCountdown,
  formatCulinaryQuantity,
  playSubtleClick,
} from '../utils/formatters';

interface CookModeOverlayProps {
  recipe: Recipe;
  servings: number;
  unitSystem: UnitSystem;
  completedSteps: number[];
  onToggleStepComplete: (stepNumber: number) => void;
  timers: ActiveTimer[];
  onStartTimer: (payload: {
    recipeId: string;
    recipeTitle: string;
    stepNumber: number;
    label: string;
    durationSeconds: number;
  }) => void;
  onPauseTimer: (id: string) => void;
  onResetTimer: (id: string) => void;
  onAddMinute: (id: string) => void;
  onOpenClip: (clip: TechniqueClip, recipeTitle: string) => void;
  onClose: () => void;
  lang: LanguageCode;
}

export function CookModeOverlay({
  recipe,
  servings,
  unitSystem,
  completedSteps,
  onToggleStepComplete,
  timers,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onAddMinute,
  onOpenClip,
  onClose,
  lang,
}: CookModeOverlayProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const t = UI_STRINGS[lang];

  const step = recipe.steps[stepIdx] ?? recipe.steps[0];
  const multiplier = servings / recipe.baseServings;
  const linkedClip = step.techniqueClipId
    ? recipe.techniques.find((tech) => tech.id === step.techniqueClipId)
    : undefined;

  const timerId = `${recipe.id}:${step.stepNumber}`;
  const activeTimer = timers.find((timer) => timer.id === timerId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setStepIdx((i) => Math.min(recipe.steps.length - 1, i + 1));
      }
      if (e.key === 'ArrowLeft') {
        setStepIdx((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, recipe.steps.length]);

  const isDone = completedSteps.includes(step.stepNumber);
  const personWord = formatPersonLabel(servings, lang);

  return (
    <div
      className="fixed inset-0 z-40 bg-[var(--bg-paper)] flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={`${t.cookModePrefix}: ${recipe.title}`}
    >
      {/* Cook Mode Top Strip */}
      <header className="px-6 sm:px-10 h-16 border-b border-[var(--border-line)] bg-[var(--bg-surface)] flex items-center justify-between gap-4 shrink-0">
        <div className="min-w-0">
          <p className="text-xs font-mono text-[var(--accent-secondary)] truncate">
            {t.cookModePrefix} · {t.plateLabel(recipe.plateNumber)} ·{' '}
            {t.forPersons(servings, personWord)}
          </p>
          <h2 className="font-display text-lg sm:text-xl text-[var(--text-ink)] truncate">
            {recipe.title}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-2 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] cursor-pointer shrink-0"
        >
          <X className="w-3.5 h-3.5" />
          {t.exitCookMode}
        </button>
      </header>

      {/* Main Split Workspace */}
      <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12">
        {/* Left/Main Active Step Focus */}
        <div className="lg:col-span-8 p-6 sm:p-10 lg:p-14 flex flex-col justify-between">
          <div className="space-y-8 max-w-2xl">
            {/* Step progress tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {recipe.steps.map((s, idx) => {
                const done = completedSteps.includes(s.stepNumber);
                const current = idx === stepIdx;
                return (
                  <button
                    key={s.stepNumber}
                    type="button"
                    onClick={() => setStepIdx(idx)}
                    className={`px-3 py-1.5 text-xs font-mono border cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                      current
                        ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                        : done
                          ? 'bg-[var(--bg-elevated)] border-[var(--border-line)] text-[var(--accent-primary)]'
                          : 'bg-[var(--bg-surface)] border-[var(--border-line)] text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                    }`}
                  >
                    {t.stepLabel(s.stepNumber)}
                  </button>
                );
              })}
            </div>

            <div className="space-y-4">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--accent-secondary)]">
                {t.stepOfTotal(step.stepNumber, recipe.steps.length)}
              </p>
              <h3 className="font-display text-3xl sm:text-4xl text-[var(--text-ink)] leading-tight">
                {step.title}
              </h3>
              <p className="font-serif text-lg sm:text-xl leading-[1.75] text-[var(--text-ink)]/90">
                {step.instruction}
              </p>
              {step.tip && (
                <p className="pt-4 border-t border-[var(--border-subtle)] text-sm font-serif italic text-[var(--text-muted)]">
                  {t.chefsNotePrefix} {step.tip}
                </p>
              )}
            </div>

            {/* Large Countertop Timer & Technique Controls */}
            <div className="p-6 border border-[var(--border-line)] bg-[var(--bg-surface)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    {step.timerLabel || t.stepTimerDefault}
                  </p>
                  <p className="font-mono text-4xl font-medium text-[var(--text-ink)] tabular-nums mt-1">
                    {activeTimer
                      ? formatCountdown(activeTimer.remainingSeconds)
                      : step.durationSeconds
                        ? formatCountdown(step.durationSeconds)
                        : t.untimed}
                  </p>
                </div>

                {step.durationSeconds && (
                  <div className="flex flex-wrap items-center gap-2.5">
                    {activeTimer?.status === 'running' ? (
                      <button
                        type="button"
                        onClick={() => onPauseTimer(activeTimer.id)}
                        className="px-4 py-2.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] cursor-pointer"
                      >
                        <Pause className="w-4 h-4" />
                        {t.pause}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onStartTimer({
                            recipeId: recipe.id,
                            recipeTitle: recipe.title,
                            stepNumber: step.stepNumber,
                            label: step.timerLabel || step.title,
                            durationSeconds: step.durationSeconds!,
                          })
                        }
                        className="px-4 py-2.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
                      >
                        {activeTimer ? (
                          <>
                            <Play className="w-4 h-4" />
                            {activeTimer.status === 'completed' ? t.restart : t.resume}
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4" />
                            {t.startTimer}
                          </>
                        )}
                      </button>
                    )}

                    {activeTimer && (
                      <>
                        <button
                          type="button"
                          onClick={() => onAddMinute(activeTimer.id)}
                          className="px-3 py-2.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono inline-flex items-center gap-1 hover:bg-[var(--bg-elevated)] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          1m
                        </button>
                        <button
                          type="button"
                          onClick={() => onResetTimer(activeTimer.id)}
                          aria-label={t.restart}
                          className="p-2.5 border border-[var(--border-line)] bg-[var(--bg-paper)] hover:bg-[var(--bg-elevated)] cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {linkedClip && (
                <div className="pt-3 border-t border-[var(--border-line)] flex items-center justify-between gap-4">
                  <span className="text-xs font-serif text-[var(--text-muted)]">
                    {t.techniqueRefPrefix(linkedClip.title)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenClip(linkedClip, recipe.title)}
                    className="text-xs font-mono text-[var(--accent-secondary)] hover:text-[var(--text-ink)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <PlayCircle className="w-4 h-4" />
                    {t.watchClip}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Step Navigation Footer */}
          <div className="pt-8 mt-8 border-t border-[var(--border-line)] flex flex-wrap items-center justify-between gap-4 max-w-2xl">
            <button
              type="button"
              onClick={() => {
                playSubtleClick();
                onToggleStepComplete(step.stepNumber);
              }}
              className={`px-4 py-2.5 border text-xs font-mono inline-flex items-center gap-2 cursor-pointer ${
                isDone
                  ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                  : 'bg-[var(--bg-surface)] border-[var(--border-line)] text-[var(--text-ink)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <Check className="w-4 h-4" />
              {isDone ? t.stepCompleted : t.markStepDone}
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={stepIdx === 0}
                onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
                className="px-4 py-2.5 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono inline-flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t.previous}
              </button>
              <button
                type="button"
                disabled={stepIdx >= recipe.steps.length - 1}
                onClick={() =>
                  setStepIdx((i) => Math.min(recipe.steps.length - 1, i + 1))
                }
                className="px-4 py-2.5 bg-[var(--text-ink)] text-[var(--bg-paper)] text-xs font-mono inline-flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
              >
                {t.nextStep}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Reference Sidebar: Scaled Ingredients */}
        <aside className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-5">
          <div className="border-b border-[var(--border-line)] pb-3">
            <p className="text-xs font-mono uppercase tracking-[0.12em] text-[var(--accent-secondary)]">
              {t.miseEnPlaceEyebrow}
            </p>
            <h4 className="font-display text-xl text-[var(--text-ink)] mt-0.5">
              {t.scaledForPersons(servings, personWord)}
            </h4>
          </div>

          <ul className="divide-y divide-[var(--border-subtle)]">
            {recipe.ingredients.map((ing) => {
              const amt =
                unitSystem === 'metric' ? ing.metricAmount : ing.imperialAmount;
              const unit = unitSystem === 'metric' ? ing.metricUnit : ing.imperialUnit;
              return (
                <li
                  key={ing.id}
                  className="py-2.5 flex items-baseline justify-between gap-3 text-sm font-serif"
                >
                  <span className="text-[var(--text-ink)]">{ing.name}</span>
                  <span className="font-mono text-xs text-[var(--accent-secondary)] tabular-nums whitespace-nowrap shrink-0">
                    {formatCulinaryQuantity(amt * multiplier, unit)} {unit}
                  </span>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
