import { useState } from 'react';
import { Loader2, Wand2, X } from 'lucide-react';
import { UI_STRINGS } from '../i18n/translations';
import { LanguageCode, Recipe } from '../types/cookbook';

interface CustomizeRecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onCustomized: (updated: Omit<Recipe, 'id' | 'plateNumber'>) => Promise<void>;
  lang: LanguageCode;
}

export function CustomizeRecipeModal({
  recipe,
  onClose,
  onCustomized,
  lang,
}: CustomizeRecipeModalProps) {
  const [instruction, setInstruction] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!recipe) return null;

  const t = UI_STRINGS[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isUpdating) return;

    setError(null);
    setIsUpdating(true);
    try {
      const response = await fetch('/api/recipes/customize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipe,
          instruction: instruction.trim(),
          language: lang,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.recipe) {
        throw new Error(data.error || 'Could not customize this recipe right now.');
      }
      await onCustomized(data.recipe);
      setInstruction('');
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to customize recipe.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1C1917]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t.customizeDishTitle(recipe.title)}
    >
      <div
        className="w-full max-w-xl bg-[var(--bg-paper)] border border-[var(--border-line)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-[var(--bg-surface)] border-b border-[var(--border-line)] flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--accent-secondary)] truncate">
              {t.aiAdaptationEyebrow} · {t.plateLabel(recipe.plateNumber)}
            </p>
            <h2 className="font-display text-xl text-[var(--text-ink)] truncate mt-0.5">
              {t.customizeDishTitle(recipe.title)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeModalAria}
            className="w-9 h-9 border border-[var(--border-line)] bg-[var(--bg-paper)] flex items-center justify-center hover:bg-[var(--bg-elevated)] cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="customize-instruction"
              className="block text-xs font-mono uppercase tracking-[0.12em] text-[var(--text-muted)]"
            >
              {t.howToAdaptLabel}
            </label>
            <textarea
              id="customize-instruction"
              rows={4}
              required
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder={t.customizePlaceholder}
              className="w-full p-3.5 bg-[var(--bg-surface)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] placeholder:text-[var(--text-muted)]/65 focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          {error && (
            <p className="p-3 border border-[var(--accent-secondary)] bg-[var(--accent-soft)] text-xs font-serif text-[var(--accent-secondary)]">
              {error}
            </p>
          )}

          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-ink)] hover:bg-[var(--bg-elevated)] cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isUpdating || !instruction.trim()}
              className="px-5 py-2.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-2 hover:opacity-90 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {t.adaptingRecipe}
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  {t.applyAiCustomization}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
