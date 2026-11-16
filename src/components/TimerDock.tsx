import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  Plus,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { UI_STRINGS } from '../i18n/translations';
import { ActiveTimer, LanguageCode } from '../types/cookbook';
import { formatCountdown, playTimerChime } from '../utils/formatters';

interface TimerDockProps {
  timers: ActiveTimer[];
  muted: boolean;
  onToggleMute: () => void;
  recentCompletedLabel: string | null;
  onClearCompletedNotice: () => void;
  onPauseTimer: (id: string) => void;
  onResumeTimer: (timer: ActiveTimer) => void;
  onAddMinute: (id: string) => void;
  onDismissTimer: (id: string) => void;
  onJumpToRecipe: (recipeId: string) => void;
  lang: LanguageCode;
}

export function TimerDock({
  timers,
  muted,
  onToggleMute,
  recentCompletedLabel,
  onClearCompletedNotice,
  onPauseTimer,
  onResumeTimer,
  onAddMinute,
  onDismissTimer,
  onJumpToRecipe,
  lang,
}: TimerDockProps) {
  const [expanded, setExpanded] = useState(true);
  const t = UI_STRINGS[lang];

  if (timers.length === 0 && !recentCompletedLabel) return null;

  const primaryTimer =
    timers.find((timer) => timer.status === 'completed') ??
    timers.find((timer) => timer.status === 'running') ??
    timers[0];

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 space-y-2">
      {recentCompletedLabel && (
        <div className="bg-[var(--accent-secondary)] text-[var(--accent-primary-fg)] px-4 py-2.5 border border-[#1C1917] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-mono uppercase tracking-wider">{t.timerReady}</p>
            <p className="text-xs font-serif truncate">{recentCompletedLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClearCompletedNotice}
            aria-label={t.closeModalAria}
            className="p-1 hover:bg-white/10 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {timers.length > 0 && (
        <div className="bg-[#1C1917] text-[#FBF9F5] border border-[#57534E]">
          {/* Compact header bar */}
          <div className="px-4 py-2.5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="flex items-center gap-2 text-left min-w-0 cursor-pointer"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4 text-[#D6CEBE] shrink-0" />
              ) : (
                <ChevronUp className="w-4 h-4 text-[#D6CEBE] shrink-0" />
              )}
              <span className="text-xs font-mono truncate">
                {timers.length === 1 && primaryTimer
                  ? `${primaryTimer.label} · ${formatCountdown(primaryTimer.remainingSeconds)}`
                  : t.kitchenTimersCount(timers.length)}
              </span>
            </button>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  onToggleMute();
                  if (muted) playTimerChime();
                }}
                aria-label={muted ? t.unmuteChimes : t.muteChimes}
                title={muted ? t.unmuteChimes : t.muteChimes}
                className="p-1.5 text-[#D6CEBE] hover:text-[#FBF9F5] cursor-pointer"
              >
                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {expanded && (
            <ul className="divide-y divide-[#292524] max-h-60 overflow-y-auto border-t border-[#292524]">
              {timers.map((timer) => (
                <li key={timer.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onJumpToRecipe(timer.recipeId)}
                    className="text-left min-w-0 flex-1 cursor-pointer"
                  >
                    <p className="text-[11px] font-mono text-[#D6CEBE] truncate">
                      {timer.recipeTitle} · {t.stepShort(timer.stepNumber)}
                    </p>
                    <p className="text-xs font-serif text-[#FBF9F5] truncate mt-0.5">
                      {timer.label}
                    </p>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`font-mono text-sm tabular-nums mr-1 ${
                        timer.status === 'completed'
                          ? 'text-[#FDE68A] font-medium'
                          : 'text-[#FBF9F5]'
                      }`}
                    >
                      {timer.status === 'completed'
                        ? '00:00'
                        : formatCountdown(timer.remainingSeconds)}
                    </span>

                    {timer.status === 'running' ? (
                      <button
                        type="button"
                        onClick={() => onPauseTimer(timer.id)}
                        aria-label={t.pause}
                        className="p-1.5 bg-[#292524] hover:bg-[#44403C] cursor-pointer"
                      >
                        <Pause className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onResumeTimer(timer)}
                        aria-label={t.resume}
                        className="p-1.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] hover:opacity-90 cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onAddMinute(timer.id)}
                      aria-label="+1m"
                      className="px-1.5 py-1 bg-[#292524] hover:bg-[#44403C] text-[11px] font-mono inline-flex items-center cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />1
                    </button>

                    <button
                      type="button"
                      onClick={() => onDismissTimer(timer.id)}
                      aria-label={t.closeModalAria}
                      className="p-1 text-[#A8A29E] hover:text-[#FBF9F5] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
