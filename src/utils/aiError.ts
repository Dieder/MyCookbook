import { UI_STRINGS } from '../i18n/translations';
import { LanguageCode } from '../types/cookbook';

export interface ParsedApiResponse<T = Record<string, unknown>> {
  ok: boolean;
  status: number;
  invalidJson: boolean;
  data: T | null;
}

export async function parseApiJsonSafe<T = Record<string, unknown>>(
  response: Response
): Promise<ParsedApiResponse<T>> {
  const rawText = await response.text().catch(() => '');
  const trimmed = rawText.trim();
  if (!trimmed) {
    return { ok: response.ok, status: response.status, invalidJson: true, data: null };
  }
  try {
    const parsed = JSON.parse(trimmed) as T;
    if (!parsed || typeof parsed !== 'object') {
      return { ok: response.ok, status: response.status, invalidJson: true, data: null };
    }
    return { ok: response.ok, status: response.status, invalidJson: false, data: parsed };
  } catch {
    return { ok: response.ok, status: response.status, invalidJson: true, data: null };
  }
}

function looksTechnicalOrJson(msg: string): boolean {
  const m = msg.trim();
  if (!m) return false;
  if (m.startsWith('{') || m.startsWith('[') || m.startsWith('<')) return true;
  if (
    /"error"\s*:|"status"\s*:|"code"\s*:|UNAVAILABLE|RESOURCE_EXHAUSTED|SyntaxError|Unexpected token|Unexpected end of JSON|Failed to fetch|NetworkError|ECONNREFUSED|PERMISSION_DENIED/i.test(
      m
    )
  ) {
    return true;
  }
  return false;
}

export function toHumanReadableAiError(
  opts: {
    status?: number;
    invalidJson?: boolean;
    errorCode?: string;
    serverMessage?: string;
    err?: unknown;
  },
  lang: LanguageCode
): string {
  const t = UI_STRINGS[lang];
  const errMsg =
    opts.err instanceof Error
      ? opts.err.message
      : typeof opts.err === 'string'
      ? opts.err
      : '';
  const combined = `${opts.errorCode || ''} ${opts.serverMessage || ''} ${errMsg}`;

  if (
    opts.errorCode === 'AI_RATE_LIMIT' ||
    opts.status === 429 ||
    /429|RESOURCE_EXHAUSTED|quota|rate.?limit/i.test(combined)
  ) {
    return t.aiErrRateLimit;
  }

  if (
    opts.errorCode === 'AI_UNAVAILABLE' ||
    opts.errorCode === 'AI_CONFIG' ||
    opts.status === 503 ||
    /503|UNAVAILABLE|overloaded|high demand|NOT_FOUND|API_KEY|PERMISSION_DENIED.*generativelanguage/i.test(
      combined
    )
  ) {
    return t.aiErrUnavailable;
  }

  if (
    opts.errorCode === 'AI_TIMEOUT' ||
    opts.status === 504 ||
    /504|DEADLINE_EXCEEDED|timeout|timed out/i.test(combined)
  ) {
    return t.aiErrTimeout;
  }

  if (
    opts.errorCode === 'AI_NETWORK' ||
    /Failed to fetch|NetworkError|ECONNREFUSED|ENOTFOUND|network|offline/i.test(combined)
  ) {
    return t.aiErrNetwork;
  }

  if (
    opts.invalidJson ||
    opts.errorCode === 'AI_INVALID_JSON' ||
    opts.status === 502 ||
    /SyntaxError|Unexpected token|Unexpected end of JSON|invalid json/i.test(combined)
  ) {
    return t.aiErrInvalidResponse;
  }

  // Firestore permission / validation errors thrown when saving the AI recipe
  if (/firestoreInfo|operationType|authInfo|Missing or insufficient permissions/i.test(combined)) {
    return t.aiErrSaveFailed;
  }

  const candidate = (opts.serverMessage || errMsg).trim();
  if (candidate && !looksTechnicalOrJson(candidate)) {
    return candidate;
  }

  return t.aiErrGeneric;
}
