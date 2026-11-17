import { Fragment, ReactNode } from 'react';

/**
 * Splits rich markup text into at most `maxParagraphs` Firestore-safe blocks
 * (each <= `maxChars` characters) without dropping content when there are > 4 blocks.
 */
export function splitStoryIntoParagraphs(
  rawMarkup: string,
  maxParagraphs = 4,
  maxChars = 1500
): string[] {
  const blocks = rawMarkup
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  if (blocks.length === 0) return [];
  if (blocks.length <= maxParagraphs) {
    return blocks.map((b) => b.slice(0, maxChars));
  }

  const head = blocks.slice(0, maxParagraphs - 1).map((b) => b.slice(0, maxChars));
  const tail = blocks.slice(maxParagraphs - 1).join('\n\n').slice(0, maxChars);
  return [...head, tail];
}

export function stripStoryMarkup(text: string): string {
  if (!text) return '';
  return text
    .replace(/^#{1,4}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*]\s+/gm, '• ')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/(^|[^*\w])\*([^*\n]+?)\*(?!\*)/g, '$1$2')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inlineMarkupToSafeHtml(line: string): string {
  let html = escapeHtml(line);
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<u>$1</u>');
  html = html.replace(/(^|[^*\w])\*([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>');
  return html;
}

export function storyMarkupToHtml(markup: string): string {
  const normalized = markup.replace(/\r\n/g, '\n').trim();
  if (!normalized) return '<p><br></p>';

  const blocks = normalized.split(/\n\s*\n/);
  const htmlParts: string[] = [];

  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trimEnd());
    const first = lines[0]?.trim() ?? '';

    if (/^#{1,3}\s+/.test(first) && lines.length === 1) {
      const headingText = first.replace(/^#{1,3}\s+/, '');
      htmlParts.push(`<h3>${inlineMarkupToSafeHtml(headingText)}</h3>`);
      continue;
    }

    if (lines.every((l) => l.trim().startsWith('>')) && lines.length > 0) {
      const quoteBody = lines
        .map((l) => inlineMarkupToSafeHtml(l.trim().replace(/^>\s?/, '')))
        .join('<br>');
      htmlParts.push(`<blockquote>${quoteBody}</blockquote>`);
      continue;
    }

    if (lines.every((l) => /^\s*[-*]\s+/.test(l)) && lines.length > 0) {
      const items = lines
        .map((l) => `<li>${inlineMarkupToSafeHtml(l.replace(/^\s*[-*]\s+/, ''))}</li>`)
        .join('');
      htmlParts.push(`<ul>${items}</ul>`);
      continue;
    }

    // Handle mixed lines inside a single block cleanly
    let i = 0;
    while (i < lines.length) {
      const cur = lines[i].trim();
      if (!cur) {
        i++;
        continue;
      }
      if (/^#{1,3}\s+/.test(cur)) {
        htmlParts.push(`<h3>${inlineMarkupToSafeHtml(cur.replace(/^#{1,3}\s+/, ''))}</h3>`);
        i++;
      } else if (cur.startsWith('>')) {
        const qLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          qLines.push(inlineMarkupToSafeHtml(lines[i].trim().replace(/^>\s?/, '')));
          i++;
        }
        htmlParts.push(`<blockquote>${qLines.join('<br>')}</blockquote>`);
      } else if (/^[-*]\s+/.test(cur)) {
        const liLines: string[] = [];
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
          liLines.push(`<li>${inlineMarkupToSafeHtml(lines[i].replace(/^\s*[-*]\s+/, ''))}</li>`);
          i++;
        }
        htmlParts.push(`<ul>${liLines.join('')}</ul>`);
      } else {
        const pLines: string[] = [];
        while (
          i < lines.length &&
          lines[i].trim() &&
          !/^#{1,3}\s+/.test(lines[i].trim()) &&
          !lines[i].trim().startsWith('>') &&
          !/^\s*[-*]\s+/.test(lines[i])
        ) {
          pLines.push(inlineMarkupToSafeHtml(lines[i].trim()));
          i++;
        }
        htmlParts.push(`<p>${pLines.join('<br>')}</p>`);
      }
    }
  }

  return htmlParts.join('') || '<p><br></p>';
}

function serializeInlineNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? '').replace(/\u00a0/g, ' ');
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return '';

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  if (tag === 'br') return '\n';

  const inner = Array.from(el.childNodes).map(serializeInlineNode).join('');
  if (!inner && tag !== 'br') return '';

  if (tag === 'strong' || tag === 'b') {
    const trimmed = inner.trim();
    if (!trimmed) return inner;
    const lead = inner.match(/^\s*/)?.[0] ?? '';
    const trail = inner.match(/\s*$/)?.[0] ?? '';
    return `${lead}**${trimmed}**${trail}`;
  }
  if (tag === 'em' || tag === 'i') {
    const trimmed = inner.trim();
    if (!trimmed) return inner;
    const lead = inner.match(/^\s*/)?.[0] ?? '';
    const trail = inner.match(/\s*$/)?.[0] ?? '';
    return `${lead}*${trimmed}*${trail}`;
  }
  if (tag === 'u') {
    const trimmed = inner.trim();
    if (!trimmed) return inner;
    const lead = inner.match(/^\s*/)?.[0] ?? '';
    const trail = inner.match(/\s*$/)?.[0] ?? '';
    return `${lead}__${trimmed}__${trail}`;
  }
  if (tag === 'a') {
    const href = el.getAttribute('href') || '';
    if (/^https?:\/\//i.test(href)) {
      return `[${inner.trim() || href}](${href})`;
    }
    return inner;
  }
  return inner;
}

export function htmlToStoryMarkup(root: HTMLElement): string {
  const blocks: string[] = [];

  const processChild = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const txt = (node.textContent ?? '').replace(/\u00a0/g, ' ').trim();
      if (txt) blocks.push(txt);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4') {
      const text = Array.from(el.childNodes).map(serializeInlineNode).join('').replace(/\n+/g, ' ').trim();
      if (text) blocks.push(`### ${text}`);
      return;
    }
    if (tag === 'blockquote') {
      const raw = Array.from(el.childNodes).map(serializeInlineNode).join('').trim();
      if (raw) {
        const lines = raw.split('\n').map((l) => `> ${l.trim()}`).filter((l) => l !== '>');
        if (lines.length > 0) blocks.push(lines.join('\n'));
      }
      return;
    }
    if (tag === 'ul' || tag === 'ol') {
      const items = Array.from(el.querySelectorAll(':scope > li'))
        .map((li) => Array.from(li.childNodes).map(serializeInlineNode).join('').replace(/\n+/g, ' ').trim())
        .filter(Boolean)
        .map((item) => `- ${item}`);
      if (items.length > 0) blocks.push(items.join('\n'));
      return;
    }
    if (tag === 'p' || tag === 'div') {
      // Check if this div wraps nested block elements
      const hasNestedBlocks = Array.from(el.children).some((c) =>
        ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'ul', 'ol'].includes(c.tagName.toLowerCase())
      );
      if (hasNestedBlocks) {
        Array.from(el.childNodes).forEach(processChild);
        return;
      }
      const raw = Array.from(el.childNodes).map(serializeInlineNode).join('');
      const cleaned = raw
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .join('\n');
      if (cleaned) blocks.push(cleaned);
      return;
    }

    const fallback = serializeInlineNode(el).trim();
    if (fallback) blocks.push(fallback);
  };

  Array.from(root.childNodes).forEach(processChild);
  return blocks.join('\n\n').trim();
}

function renderInlineMarkup(text: string, keyPrefix: string): ReactNode[] {
  const tokenRegex =
    /(\*\*[^*\n]+?\*\*|__[^_\n]+?__|(?<![*\w])\*[^*\n]+?\*(?!\*)|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    const key = `${keyPrefix}-${idx++}`;

    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={key} className="font-semibold text-[var(--text-ink)]">
          {renderInlineMarkup(token.slice(2, -2), `${key}-b`)}
        </strong>
      );
    } else if (token.startsWith('__') && token.endsWith('__')) {
      parts.push(
        <span key={key} className="underline decoration-[var(--accent-secondary)] underline-offset-4">
          {renderInlineMarkup(token.slice(2, -2), `${key}-u`)}
        </span>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={key} className="italic">
          {renderInlineMarkup(token.slice(1, -1), `${key}-i`)}
        </em>
      );
    } else if (token.startsWith('[')) {
      const linkMatch = token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
      if (linkMatch) {
        parts.push(
          <a
            key={key}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-primary)] underline underline-offset-2 hover:opacity-80"
          >
            {linkMatch[1]}
          </a>
        );
      } else {
        parts.push(token);
      }
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : [text];
}

interface StoryMarkupRendererProps {
  text: string;
  enableDropCap?: boolean;
  className?: string;
}

export function StoryMarkupRenderer({
  text,
  enableDropCap = false,
  className = '',
}: StoryMarkupRendererProps) {
  const normalized = (text || '').replace(/\r\n/g, '\n').trim();
  if (!normalized) return null;

  const lines = normalized.split('\n');
  const nodes: ReactNode[] = [];
  let i = 0;
  let usedDropCap = false;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed) {
      i++;
      continue;
    }

    if (/^#{1,3}\s+/.test(trimmed)) {
      const headingText = trimmed.replace(/^#{1,3}\s+/, '');
      nodes.push(
        <h3
          key={`h-${i}`}
          className="font-display text-xl text-[var(--text-ink)] pt-1"
        >
          {renderInlineMarkup(headingText, `h-${i}`)}
        </h3>
      );
      i++;
      continue;
    }

    if (trimmed.startsWith('>')) {
      const qLines: string[] = [];
      const start = i;
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        qLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      nodes.push(
        <blockquote
          key={`q-${start}`}
          className="py-2.5 px-4 border-y border-[var(--border-line)] bg-[var(--bg-surface)]/60 font-serif italic text-[15px] leading-relaxed text-[var(--text-ink)]"
        >
          {qLines.map((ql, idx) => (
            <Fragment key={idx}>
              {idx > 0 && <br />}
              {renderInlineMarkup(ql, `q-${start}-${idx}`)}
            </Fragment>
          ))}
        </blockquote>
      );
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      const start = i;
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      nodes.push(
        <ul
          key={`ul-${start}`}
          className="list-disc pl-5 space-y-1.5 font-serif text-[16px] leading-[1.75] text-[var(--text-ink)]/90"
        >
          {items.map((item, idx) => (
            <li key={idx}>{renderInlineMarkup(item, `li-${start}-${idx}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    const pLines: string[] = [];
    const start = i;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^#{1,3}\s+/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('>') &&
      !/^\s*[-*]\s+/.test(lines[i])
    ) {
      pLines.push(lines[i].trim());
      i++;
    }

    const applyDropCap = enableDropCap && !usedDropCap;
    if (applyDropCap) usedDropCap = true;

    nodes.push(
      <p
        key={`p-${start}`}
        className={`font-serif text-[16px] leading-[1.82] text-[var(--text-ink)]/90 ${
          applyDropCap
            ? 'first-letter:text-5xl first-letter:font-display first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.84] first-letter:text-[var(--accent-primary)]'
            : ''
        }`}
      >
        {pLines.map((pl, idx) => (
          <Fragment key={idx}>
            {idx > 0 && <br />}
            {renderInlineMarkup(pl, `p-${start}-${idx}`)}
          </Fragment>
        ))}
      </p>
    );
  }

  return <div className={`space-y-3 ${className}`}>{nodes}</div>;
}
