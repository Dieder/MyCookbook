import { useEffect, useRef, useState } from 'react';
import {
  Bold,
  Code2,
  Eye,
  Heading3,
  Italic,
  List,
  Quote,
  RemoveFormatting,
  Underline,
} from 'lucide-react';
import { UI_STRINGS } from '../i18n/translations';
import { LanguageCode } from '../types/cookbook';
import {
  htmlToStoryMarkup,
  splitStoryIntoParagraphs,
  storyMarkupToHtml,
} from '../utils/storyMarkup';

interface StoryWysiwygEditorProps {
  id?: string;
  value: string;
  onChange: (nextMarkup: string) => void;
  lang: LanguageCode;
  maxParagraphs?: number;
  placeholder?: string;
}

export function StoryWysiwygEditor({
  id = 'rec-story',
  value,
  onChange,
  lang,
  maxParagraphs = 4,
  placeholder,
}: StoryWysiwygEditorProps) {
  const t = UI_STRINGS[lang];
  const [mode, setMode] = useState<'visual' | 'markup'>('visual');
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    list: false,
    blockTag: 'p',
  });
  const editorRef = useRef<HTMLDivElement | null>(null);
  const lastSyncedValueRef = useRef<string>('');

  // Keep contentEditable DOM synced when external value changes (e.g. switching recipes or toggling from markup mode)
  useEffect(() => {
    if (mode !== 'visual') return;
    const el = editorRef.current;
    if (!el) return;
    if (value !== lastSyncedValueRef.current) {
      el.innerHTML = storyMarkupToHtml(value);
      lastSyncedValueRef.current = value;
    }
  }, [value, mode]);

  const syncFromEditor = () => {
    const el = editorRef.current;
    if (!el) return;
    const nextMarkup = htmlToStoryMarkup(el);
    lastSyncedValueRef.current = nextMarkup;
    onChange(nextMarkup);
    refreshActiveFormats();
  };

  const refreshActiveFormats = () => {
    if (mode !== 'visual') return;
    try {
      const bold = document.queryCommandState('bold');
      const italic = document.queryCommandState('italic');
      const underline = document.queryCommandState('underline');
      const list = document.queryCommandState('insertUnorderedList');
      const blockValue = String(document.queryCommandValue('formatBlock') || 'p')
        .replace(/[<>]/g, '')
        .toLowerCase();
      setActiveFormats({
        bold,
        italic,
        underline,
        list,
        blockTag: blockValue || 'p',
      });
    } catch {
      // Ignore selection state errors when editor is unfocused
    }
  };

  const applyVisualCommand = (
    command: string,
    commandValue?: string
  ) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    if (command === 'formatBlock') {
      const currentBlock = String(document.queryCommandValue('formatBlock') || '')
        .replace(/[<>]/g, '')
        .toLowerCase();
      const target =
        currentBlock === commandValue?.toLowerCase() ? 'p' : commandValue || 'p';
      document.execCommand('formatBlock', false, target);
    } else if (command === 'removeFormat') {
      document.execCommand('removeFormat', false);
      document.execCommand('formatBlock', false, 'p');
    } else {
      document.execCommand(command, false, commandValue);
    }
    syncFromEditor();
  };

  const handleToggleMode = (nextMode: 'visual' | 'markup') => {
    if (nextMode === mode) return;
    if (mode === 'visual') {
      syncFromEditor();
    } else {
      lastSyncedValueRef.current = '';
    }
    setMode(nextMode);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const plain = e.clipboardData.getData('text/plain');
    if (!plain) return;
    document.execCommand('insertText', false, plain);
    syncFromEditor();
  };

  const paragraphCount = splitStoryIntoParagraphs(value, maxParagraphs).length;

  return (
    <div className="border border-[var(--border-line)] bg-[var(--bg-paper)]">
      {/* Toolbar */}
      <div className="px-2.5 py-2 bg-[var(--bg-surface)] border-b border-[var(--border-line)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            disabled={mode !== 'visual'}
            onMouseDown={(e) => {
              e.preventDefault();
              applyVisualCommand('bold');
            }}
            aria-label={t.storyToolbarBold}
            title={t.storyToolbarBold}
            className={`w-8 h-8 border flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              mode === 'visual' && activeFormats.bold
                ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                : 'bg-[var(--bg-paper)] border-[var(--border-line)] text-[var(--text-ink)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            disabled={mode !== 'visual'}
            onMouseDown={(e) => {
              e.preventDefault();
              applyVisualCommand('italic');
            }}
            aria-label={t.storyToolbarItalic}
            title={t.storyToolbarItalic}
            className={`w-8 h-8 border flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              mode === 'visual' && activeFormats.italic
                ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                : 'bg-[var(--bg-paper)] border-[var(--border-line)] text-[var(--text-ink)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            disabled={mode !== 'visual'}
            onMouseDown={(e) => {
              e.preventDefault();
              applyVisualCommand('underline');
            }}
            aria-label={t.storyToolbarUnderline}
            title={t.storyToolbarUnderline}
            className={`w-8 h-8 border flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              mode === 'visual' && activeFormats.underline
                ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                : 'bg-[var(--bg-paper)] border-[var(--border-line)] text-[var(--text-ink)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-5 bg-[var(--border-line)] mx-1" aria-hidden="true" />

          <button
            type="button"
            disabled={mode !== 'visual'}
            onMouseDown={(e) => {
              e.preventDefault();
              applyVisualCommand('formatBlock', 'h3');
            }}
            aria-label={t.storyToolbarHeading}
            title={t.storyToolbarHeading}
            className={`w-8 h-8 border flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              mode === 'visual' && activeFormats.blockTag === 'h3'
                ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                : 'bg-[var(--bg-paper)] border-[var(--border-line)] text-[var(--text-ink)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            disabled={mode !== 'visual'}
            onMouseDown={(e) => {
              e.preventDefault();
              applyVisualCommand('insertUnorderedList');
            }}
            aria-label={t.storyToolbarBullet}
            title={t.storyToolbarBullet}
            className={`w-8 h-8 border flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              mode === 'visual' && activeFormats.list
                ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                : 'bg-[var(--bg-paper)] border-[var(--border-line)] text-[var(--text-ink)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            disabled={mode !== 'visual'}
            onMouseDown={(e) => {
              e.preventDefault();
              applyVisualCommand('formatBlock', 'blockquote');
            }}
            aria-label={t.storyToolbarQuote}
            title={t.storyToolbarQuote}
            className={`w-8 h-8 border flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              mode === 'visual' && activeFormats.blockTag === 'blockquote'
                ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                : 'bg-[var(--bg-paper)] border-[var(--border-line)] text-[var(--text-ink)] hover:bg-[var(--bg-elevated)]'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            disabled={mode !== 'visual'}
            onMouseDown={(e) => {
              e.preventDefault();
              applyVisualCommand('removeFormat');
            }}
            aria-label={t.storyToolbarClear}
            title={t.storyToolbarClear}
            className="w-8 h-8 border border-[var(--border-line)] bg-[var(--bg-paper)] text-[var(--text-muted)] hover:text-[var(--text-ink)] hover:bg-[var(--bg-elevated)] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="inline-flex border border-[var(--border-line)] bg-[var(--bg-paper)] shrink-0">
          <button
            type="button"
            onClick={() => handleToggleMode('visual')}
            className={`px-2.5 py-1 text-[11px] font-mono inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              mode === 'visual'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
            }`}
          >
            <Eye className="w-3 h-3" />
            {t.storyVisualMode}
          </button>
          <button
            type="button"
            onClick={() => handleToggleMode('markup')}
            className={`px-2.5 py-1 text-[11px] font-mono inline-flex items-center gap-1 cursor-pointer whitespace-nowrap border-l border-[var(--border-line)] ${
              mode === 'markup'
                ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
            }`}
          >
            <Code2 className="w-3 h-3" />
            {t.storyMarkupMode}
          </button>
        </div>
      </div>

      {/* Surface */}
      {mode === 'visual' ? (
        <div
          id={id}
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label={t.recipeStoryField}
          data-placeholder={placeholder}
          onInput={syncFromEditor}
          onBlur={syncFromEditor}
          onKeyUp={refreshActiveFormats}
          onMouseUp={refreshActiveFormats}
          onPaste={handlePaste}
          className="min-h-[160px] p-4 bg-[var(--bg-paper)] text-sm font-serif text-[var(--text-ink)] leading-relaxed focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[var(--accent-primary)] [&_p]:mb-2.5 [&_p:last-child]:mb-0 [&_h3]:font-display [&_h3]:text-lg [&_h3]:text-[var(--text-ink)] [&_h3]:mt-2 [&_h3]:mb-1.5 [&_blockquote]:py-2 [&_blockquote]:px-3.5 [&_blockquote]:my-2 [&_blockquote]:border-y [&_blockquote]:border-[var(--border-line)] [&_blockquote]:bg-[var(--bg-surface)] [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_li]:mb-1 [&_strong]:font-semibold [&_em]:italic [&_u]:underline [&_u]:decoration-[var(--accent-secondary)] [&_u]:underline-offset-4"
        />
      ) : (
        <textarea
          id={id}
          rows={6}
          value={value}
          onChange={(e) => {
            lastSyncedValueRef.current = '';
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full min-h-[160px] p-4 bg-[var(--bg-paper)] text-xs font-mono text-[var(--text-ink)] leading-relaxed focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[var(--accent-primary)]"
        />
      )}

      {/* Footer Hint */}
      <div className="px-3 py-1.5 bg-[var(--bg-surface)]/70 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[var(--text-muted)]">
        <span>{t.storyMarkupHint}</span>
        <span className="tabular-nums shrink-0">
          {t.storyParagraphsCount(paragraphCount, maxParagraphs)}
        </span>
      </div>
    </div>
  );
}
