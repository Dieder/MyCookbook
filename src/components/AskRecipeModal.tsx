import { useState } from 'react';
import { ArrowRight, Check, Clock, Loader2, Sparkles, X } from 'lucide-react';
import {
  formatPersonLabel,
  getLocalizedChapters,
  UI_STRINGS,
} from '../i18n/translations';
import { LanguageCode, Recipe } from '../types/cookbook';
import { formatMinutesLabel } from '../utils/formatters';

interface AskRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipeCreated: (recipe: Omit<Recipe, 'id' | 'plateNumber'>) => Promise<Recipe>;
  onOpenSpread: (recipeId: string) => void;
  isSignedIn: boolean;
  onSignIn: () => Promise<void>;
  lang: LanguageCode;
}

export function AskRecipeModal({
  isOpen,
  onClose,
  onRecipeCreated,
  onOpenSpread,
  isSignedIn,
  onSignIn,
  lang,
}: AskRecipeModalProps) {
  const [prompt, setPrompt] = useState('');
  const [chapterId, setChapterId] = useState('hearth-harvest');
  const [persons, setPersons] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultRecipe, setResultRecipe] = useState<Recipe | null>(null);

  if (!isOpen) return null;

  const t = UI_STRINGS[lang];
  const chapters = getLocalizedChapters(lang);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const handleReset = () => {
    setResultRecipe(null);
    setPrompt('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setError(null);
    setIsGenerating(true);
    try {
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          chapterId,
          persons,
          language: lang,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.recipe) {
        throw new Error(data.error || 'Could not compose this recipe right now.');
      }
      const saved = await onRecipeCreated(data.recipe);
      setResultRecipe(saved);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to generate recipe.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#1C1917]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={t.askChefForRecipe}
    >
      <div
        className="w-full max-w-2xl bg-[var(--bg-paper)] border border-[var(--border-line)] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-[var(--bg-surface)] border-b border-[var(--border-line)] flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--accent-secondary)]">
              {t.newBookEntry}
            </p>
            <h2 className="font-display text-2xl text-[var(--text-ink)] mt-0.5">
              {t.askChefForRecipe}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t.closeModalAria}
            className="w-9 h-9 border border-[var(--border-line)] bg-[var(--bg-paper)] flex items-center justify-center hover:bg-[var(--bg-elevated)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {resultRecipe ? (
          <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent-primary)]">
                <Check className="w-4 h-4" />
                {t.savedToCookbook} · {t.plateLabel(resultRecipe.plateNumber)}
              </span>
              <span className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
                {t.prepWord} {resultRecipe.prepMinutes}m · {t.cookWord} {resultRecipe.cookMinutes}m ·{' '}
                {t.forPersons(
                  resultRecipe.baseServings,
                  formatPersonLabel(resultRecipe.baseServings, lang)
                )}
              </span>
            </div>

            <div>
              <h3 className="font-display text-2xl sm:text-3xl text-[var(--text-ink)] leading-tight">
                {resultRecipe.title}
              </h3>
              <p className="font-serif italic text-base text-[var(--text-muted)] mt-1">
                {resultRecipe.subtitle}
              </p>
              <p className="font-serif text-sm text-[var(--text-ink)]/90 leading-relaxed mt-3">
                {resultRecipe.storyParagraphs[0] || resultRecipe.storyExcerpt}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-4">
                <p className="text-xs font-mono uppercase tracking-[0.12em] text-[var(--accent-secondary)] pb-2 border-b border-[var(--border-line)]">
                  {t.ingredientsCountHeader(
                    resultRecipe.baseServings,
                    formatPersonLabel(resultRecipe.baseServings, lang)
                  )}
                </p>
                <ul className="divide-y divide-[var(--border-subtle)] mt-2">
                  {resultRecipe.ingredients.map((ing) => (
                    <li
                      key={ing.id}
                      className="py-1.5 flex items-baseline justify-between gap-2 text-xs font-serif"
                    >
                      <span className="text-[var(--text-ink)]">{ing.name}</span>
                      <span className="font-mono text-[var(--accent-secondary)] tabular-nums shrink-0">
                        {ing.metricAmount} {ing.metricUnit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-4">
                <p className="text-xs font-mono uppercase tracking-[0.12em] text-[var(--accent-secondary)] pb-2 border-b border-[var(--border-line)]">
                  {t.timedStepsHeader(resultRecipe.steps.length)}
                </p>
                <ol className="space-y-2.5 mt-2">
                  {resultRecipe.steps.map((step) => (
                    <li key={step.stepNumber} className="text-xs font-serif">
                      <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-[var(--text-muted)]">
                        <span className="text-[var(--text-ink)] font-medium">
                          0{step.stepNumber}. {step.title}
                        </span>
                        {step.durationSeconds && (
                          <span className="inline-flex items-center gap-1 shrink-0">
                            <Clock className="w-3 h-3" />
                            {formatMinutesLabel(step.durationSeconds)}
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--text-muted)] mt-0.5 leading-relaxed">
                        {step.instruction}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-ink)] hover:bg-[var(--bg-elevated)] cursor-pointer"
              >
                {t.askAnotherRecipe}
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetId = resultRecipe.id;
                  handleReset();
                  onClose();
                  onOpenSpread(targetId);
                }}
                className="px-5 py-2.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-2 hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
              >
                {t.openFullSpreadTimers}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {!isSignedIn && (
              <div className="p-3.5 bg-[var(--bg-surface)] border border-[var(--border-line)] flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-serif text-[var(--text-muted)]">
                  {t.signInPrompt}
                </p>
                <button
                  type="button"
                  onClick={() => void onSignIn()}
                  className="px-3 py-1.5 border border-[var(--accent-primary)] text-[var(--accent-primary)] text-xs font-mono hover:bg-[var(--accent-primary)] hover:text-[var(--accent-primary-fg)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {t.signInGoogle}
                </button>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="ask-recipe-prompt"
                className="block text-xs font-mono uppercase tracking-[0.12em] text-[var(--text-muted)]"
              >
                {t.whatRecipePrompt}
              </label>
              <textarea
                id="ask-recipe-prompt"
                rows={4}
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.askPlaceholder}
                className="w-full p-3.5 bg-[var(--bg-surface)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] placeholder:text-[var(--text-muted)]/65 focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label
                  htmlFor="ask-recipe-chapter"
                  className="block text-xs font-mono uppercase tracking-[0.12em] text-[var(--text-muted)] mb-1.5"
                >
                  {t.bookChapterField}
                </label>
                <select
                  id="ask-recipe-chapter"
                  value={chapterId}
                  onChange={(e) => setChapterId(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
                >
                  {chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.romanIndex}. {ch.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="ask-recipe-persons"
                  className="block text-xs font-mono uppercase tracking-[0.12em] text-[var(--text-muted)] mb-1.5"
                >
                  {t.personCountLabel}
                </label>
                <select
                  id="ask-recipe-persons"
                  value={persons}
                  onChange={(e) => setPersons(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-line)] text-sm font-mono text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
                >
                  {[1, 2, 3, 4, 6, 8, 10, 12].map((count) => (
                    <option key={count} value={count}>
                      {count} {formatPersonLabel(count, lang)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <p className="p-3 border border-[var(--accent-secondary)] bg-[var(--accent-soft)] text-xs font-serif text-[var(--accent-secondary)]">
                {error}
              </p>
            )}

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-ink)] hover:bg-[var(--bg-elevated)] cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="px-5 py-2.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-2 hover:opacity-90 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {t.generatingRecipe}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    {t.postGetRecipe}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
