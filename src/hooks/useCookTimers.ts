import { useCallback, useEffect, useRef, useState } from 'react';
import { ActiveTimer } from '../types/cookbook';
import { playTimerChime } from '../utils/formatters';

const STORAGE_KEY = 'maison_feuille_timers_v1';

export function useCookTimers() {
  const [timers, setTimers] = useState<ActiveTimer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed: ActiveTimer[] = JSON.parse(saved);
      const now = Date.now();
      return parsed.map((t) => {
        if (t.status === 'running' && t.endTimestamp) {
          const left = Math.max(0, Math.ceil((t.endTimestamp - now) / 1000));
          return {
            ...t,
            remainingSeconds: left,
            status: left === 0 ? 'completed' : 'running',
            endTimestamp: left === 0 ? null : t.endTimestamp,
          };
        }
        return t;
      });
    } catch {
      return [];
    }
  });

  const [muted, setMuted] = useState(false);
  const [recentCompletedLabel, setRecentCompletedLabel] = useState<string | null>(null);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
    } catch {
      // Ignore storage quota errors
    }
  }, [timers]);

  useEffect(() => {
    const hasRunning = timers.some((t) => t.status === 'running');
    if (!hasRunning) return;

    const interval = window.setInterval(() => {
      const now = Date.now();
      let completedLabel: string | null = null;

      setTimers((prev) => {
        let changed = false;
        const next = prev.map((t) => {
          if (t.status !== 'running' || !t.endTimestamp) return t;
          const remaining = Math.max(0, Math.ceil((t.endTimestamp - now) / 1000));
          if (remaining !== t.remainingSeconds) {
            changed = true;
          }
          if (remaining === 0) {
            changed = true;
            completedLabel = `${t.recipeTitle} · Step ${t.stepNumber}`;
            return {
              ...t,
              remainingSeconds: 0,
              endTimestamp: null,
              status: 'completed' as const,
            };
          }
          return { ...t, remainingSeconds: remaining };
        });
        return changed ? next : prev;
      });

      if (completedLabel) {
        setRecentCompletedLabel(completedLabel);
        if (!mutedRef.current) {
          playTimerChime();
        }
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [timers]);

  const startOrResumeTimer = useCallback(
    (payload: {
      recipeId: string;
      recipeTitle: string;
      stepNumber: number;
      label: string;
      durationSeconds: number;
    }) => {
      const id = `${payload.recipeId}:${payload.stepNumber}`;
      const now = Date.now();
      setTimers((prev) => {
        const existing = prev.find((t) => t.id === id);
        if (existing) {
          const baseRemaining =
            existing.status === 'completed' || existing.remainingSeconds <= 0
              ? payload.durationSeconds
              : existing.remainingSeconds;
          return prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  remainingSeconds: baseRemaining,
                  endTimestamp: now + baseRemaining * 1000,
                  status: 'running',
                }
              : t
          );
        }
        return [
          ...prev,
          {
            id,
            recipeId: payload.recipeId,
            recipeTitle: payload.recipeTitle,
            stepNumber: payload.stepNumber,
            label: payload.label,
            totalSeconds: payload.durationSeconds,
            remainingSeconds: payload.durationSeconds,
            endTimestamp: now + payload.durationSeconds * 1000,
            status: 'running',
          },
        ];
      });
    },
    []
  );

  const pauseTimer = useCallback((id: string) => {
    const now = Date.now();
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id !== id || t.status !== 'running') return t;
        const left = t.endTimestamp
          ? Math.max(0, Math.ceil((t.endTimestamp - now) / 1000))
          : t.remainingSeconds;
        return {
          ...t,
          remainingSeconds: left,
          endTimestamp: null,
          status: 'paused',
        };
      })
    );
  }, []);

  const resetTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              remainingSeconds: t.totalSeconds,
              endTimestamp: null,
              status: 'paused',
            }
          : t
      )
    );
  }, []);

  const addMinute = useCallback((id: string) => {
    const now = Date.now();
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const currentRemaining =
          t.status === 'running' && t.endTimestamp
            ? Math.max(0, Math.ceil((t.endTimestamp - now) / 1000))
            : t.remainingSeconds;
        const nextRemaining = currentRemaining + 60;
        const nextTotal = Math.max(t.totalSeconds, nextRemaining);
        return {
          ...t,
          totalSeconds: nextTotal,
          remainingSeconds: nextRemaining,
          endTimestamp: t.status === 'running' ? now + nextRemaining * 1000 : null,
          status: t.status === 'completed' ? 'paused' : t.status,
        };
      })
    );
  }, []);

  const dismissTimer = useCallback((id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompletedNotice = useCallback(() => {
    setRecentCompletedLabel(null);
  }, []);

  return {
    timers,
    muted,
    setMuted,
    recentCompletedLabel,
    clearCompletedNotice,
    startOrResumeTimer,
    pauseTimer,
    resetTimer,
    addMinute,
    dismissTimer,
  };
}
