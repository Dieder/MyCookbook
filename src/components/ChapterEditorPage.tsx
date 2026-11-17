import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Plus, Shield } from 'lucide-react';
import { UI_STRINGS } from '../i18n/translations';
import { Chapter, LanguageCode } from '../types/cookbook';

interface ChapterEditorPageProps {
  isAdmin: boolean;
  chapter: Chapter | null;
  defaultParentChapterId?: string;
  isSubchapterMode?: boolean;
  existingChapters: Chapter[];
  onCreateChapter: (chapter: Chapter) => Promise<void>;
  onUpdateChapter: (chapter: Chapter) => Promise<void>;
  onBack: () => void;
  onGoToSettings: () => void;
  lang: LanguageCode;
}

function slugifyChapterId(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function ChapterEditorPage({
  isAdmin,
  chapter,
  defaultParentChapterId,
  isSubchapterMode = false,
  existingChapters,
  onCreateChapter,
  onUpdateChapter,
  onBack,
  onGoToSettings,
  lang,
}: ChapterEditorPageProps) {
  const t = UI_STRINGS[lang];
  const isEditing = Boolean(chapter);

  const hasSubchapters = Boolean(
    chapter && existingChapters.some((c) => c.parentChapterId === chapter.id)
  );
  const eligibleParentChapters = existingChapters.filter(
    (c) => !c.parentChapterId && c.id !== chapter?.id
  );

  const resolvedInitialParentId = chapter
    ? chapter.parentChapterId ?? ''
    : defaultParentChapterId ??
      (isSubchapterMode ? eligibleParentChapters[0]?.id ?? '' : '');

  const [parentChapterId, setParentChapterId] = useState(
    resolvedInitialParentId
  );
  const [chapterSlug, setChapterSlug] = useState(chapter?.id ?? '');
  const [sortOrder, setSortOrder] = useState<number>(
    chapter?.sortOrder ?? existingChapters.length
  );
  const [title, setTitle] = useState(chapter?.title ?? '');
  const [seasonNote, setSeasonNote] = useState(chapter?.seasonNote ?? '');
  const [epigraph, setEpigraph] = useState(chapter?.epigraph ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const topParents = existingChapters.filter(
      (c) => !c.parentChapterId && c.id !== chapter?.id
    );
    const nextParentId = chapter
      ? chapter.parentChapterId ?? ''
      : defaultParentChapterId ??
        (isSubchapterMode ? topParents[0]?.id ?? '' : '');

    setParentChapterId(nextParentId);
    setChapterSlug(chapter?.id ?? '');
    setSortOrder(chapter?.sortOrder ?? existingChapters.length);
    setTitle(chapter?.title ?? '');
    setSeasonNote(chapter?.seasonNote ?? '');
    setEpigraph(chapter?.epigraph ?? '');
    setError(null);
  }, [chapter, defaultParentChapterId, isSubchapterMode, existingChapters]);

  if (!isAdmin) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-16">
        <div className="max-w-lg mx-auto border border-[var(--border-line)] bg-[var(--bg-surface)] p-8 text-center space-y-4">
          <Shield className="w-7 h-7 mx-auto text-[var(--accent-secondary)]" />
          <h1 className="font-display text-2xl text-[var(--text-ink)]">
            {t.adminTitle}
          </h1>
          <p className="font-serif text-sm text-[var(--text-muted)]">
            {t.adminAccessDenied}
          </p>
          <button
            type="button"
            onClick={onGoToSettings}
            className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono cursor-pointer"
          >
            {t.goToSettings}
          </button>
        </div>
      </div>
    );
  }

  const effectiveIsSubchapter = Boolean(
    hasSubchapters ? false : parentChapterId.trim() || isSubchapterMode
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !seasonNote.trim() || !epigraph.trim() || saving) {
      return;
    }

    const normalizedParentId = hasSubchapters ? '' : parentChapterId.trim();
    if (!isEditing && isSubchapterMode && !normalizedParentId) {
      setError(t.selectParentChapterHint);
      return;
    }

    setError(null);
    setSaving(true);
    try {
      const clampedOrder = Math.max(
        0,
        Math.min(1000, Math.round(Number(sortOrder) || 0))
      );

      if (chapter) {
        await onUpdateChapter({
          id: chapter.id,
          title: title.trim(),
          seasonNote: seasonNote.trim(),
          epigraph: epigraph.trim(),
          parentChapterId: normalizedParentId || undefined,
          sortOrder: clampedOrder,
        });
      } else {
        const baseSlug = slugifyChapterId(chapterSlug || title);
        const prefixedSlug =
          normalizedParentId && !chapterSlug.trim()
            ? slugifyChapterId(`${normalizedParentId}-${baseSlug}`)
            : baseSlug;
        const finalId =
          prefixedSlug || `chapter-${Date.now().toString(36)}`;
        if (existingChapters.some((c) => c.id === finalId)) {
          setError(`Chapter ID "${finalId}" already exists.`);
          setSaving(false);
          return;
        }
        await onCreateChapter({
          id: finalId,
          title: title.trim(),
          seasonNote: seasonNote.trim(),
          epigraph: epigraph.trim(),
          parentChapterId: normalizedParentId || undefined,
          sortOrder: clampedOrder,
        });
      }
      onBack();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Unable to save chapter.'
      );
    } finally {
      setSaving(false);
    }
  };

  const headingTitle = isEditing
    ? chapter?.parentChapterId
      ? t.editSubchapterTitle
      : t.editChapterTitle
    : effectiveIsSubchapter
    ? t.addSubchapterTitle
    : t.addChapterTitle;

  return (
    <div className="max-w-[920px] mx-auto px-6 sm:px-10 py-8 sm:py-10 space-y-8">
      {/* Top Back Navigation Strip */}
      <div className="border-b border-[var(--border-line)] pb-5 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center gap-2 hover:bg-[var(--bg-elevated)] cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t.backToAdmin}
        </button>
      </div>

      {/* Masthead */}
      <div className="space-y-1">
        <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--accent-secondary)]">
          {t.chapterEditorEyebrow}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-[var(--text-ink)]">
          {headingTitle}
        </h1>
      </div>

      {/* Chapter / Subchapter Form */}
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <label
              htmlFor="editor-chap-slug"
              className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
            >
              {t.chapterSlugLabel}
            </label>
            <input
              id="editor-chap-slug"
              type="text"
              disabled={isEditing}
              maxLength={60}
              value={chapterSlug}
              onChange={(e) => setChapterSlug(e.target.value)}
              placeholder={
                effectiveIsSubchapter ? 'french-bistro' : 'spring-garden'
              }
              className="w-full px-3 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-mono text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)] disabled:opacity-60"
            />
          </div>

          <div className="sm:col-span-5">
            <label
              htmlFor="editor-chap-parent"
              className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
            >
              {t.parentChapterLabel}
            </label>
            <select
              id="editor-chap-parent"
              disabled={hasSubchapters}
              required={isSubchapterMode && !isEditing}
              value={hasSubchapters ? '' : parentChapterId}
              onChange={(e) => setParentChapterId(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)] disabled:opacity-60"
            >
              {(!isSubchapterMode || isEditing) && (
                <option value="">{t.noParentChapterOption}</option>
              )}
              {eligibleParentChapters.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.title}
                </option>
              ))}
            </select>
            {effectiveIsSubchapter && (
              <p className="mt-1 text-[11px] font-serif italic text-[var(--text-muted)]">
                {t.selectParentChapterHint}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="editor-chap-order"
              className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
            >
              {t.chapterSortOrderLabel}
            </label>
            <input
              id="editor-chap-order"
              type="number"
              min={0}
              max={1000}
              required
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-mono text-[var(--text-ink)] tabular-nums focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="editor-chap-title"
            className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
          >
            {t.chapterTitleLabel}
          </label>
          <input
            id="editor-chap-title"
            type="text"
            required
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[var(--bg-paper)] border border-[var(--border-line)] text-base font-display text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
          />
        </div>

        <div>
          <label
            htmlFor="editor-chap-season"
            className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
          >
            {t.chapterSeasonLabel}
          </label>
          <input
            id="editor-chap-season"
            type="text"
            required
            maxLength={160}
            value={seasonNote}
            onChange={(e) => setSeasonNote(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
          />
        </div>

        <div>
          <label
            htmlFor="editor-chap-epigraph"
            className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
          >
            {t.chapterEpigraphLabel}
          </label>
          <textarea
            id="editor-chap-epigraph"
            rows={4}
            required
            maxLength={500}
            value={epigraph}
            onChange={(e) => setEpigraph(e.target.value)}
            className="w-full p-3.5 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] leading-relaxed focus:outline-none focus:border-[var(--accent-primary)]"
          />
        </div>

        {error && (
          <p className="p-3 border border-[var(--accent-secondary)] bg-[var(--accent-soft)] text-xs font-serif text-[var(--accent-secondary)]">
            {error}
          </p>
        )}

        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t.backToAdmin}
          </button>

          <button
            type="submit"
            disabled={saving || !title.trim()}
            className="px-5 py-2.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-2 hover:opacity-90 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                {t.saveChapterBtn}
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                {effectiveIsSubchapter
                  ? t.createSubchapterBtn
                  : t.createChapterBtn}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
