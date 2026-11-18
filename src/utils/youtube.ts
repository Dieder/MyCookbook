import { Recipe, RecipeStep, TechniqueClip } from '../types/cookbook';

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Extracts an 11-character YouTube video ID from standard watch, share, shorts, or embed URLs.
 */
export function extractYouTubeId(rawUrl?: string | null): string | null {
  const trimmed = (rawUrl ?? '').trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0] ?? '';
      return YOUTUBE_ID_PATTERN.test(id) ? id : null;
    }

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'music.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      const vParam = url.searchParams.get('v');
      if (vParam && YOUTUBE_ID_PATTERN.test(vParam)) {
        return vParam;
      }
      const segments = url.pathname.split('/').filter(Boolean);
      if (
        segments.length >= 2 &&
        (segments[0] === 'embed' ||
          segments[0] === 'shorts' ||
          segments[0] === 'live' ||
          segments[0] === 'v')
      ) {
        const candidate = segments[1];
        return YOUTUBE_ID_PATTERN.test(candidate) ? candidate : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Converts a YouTube URL into a safe embed URL, preserving any start timestamp if present.
 */
export function toYouTubeEmbedUrl(rawUrl?: string | null): string | null {
  const id = extractYouTubeId(rawUrl);
  if (!id) return null;

  const trimmed = (rawUrl ?? '').trim();
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let startSeconds = 0;
  try {
    const url = new URL(withProtocol);
    const tParam = url.searchParams.get('t') ?? url.searchParams.get('start');
    if (tParam) {
      const numeric = parseInt(tParam.replace(/s$/i, ''), 10);
      if (Number.isFinite(numeric) && numeric > 0) {
        startSeconds = numeric;
      }
    }
  } catch {
    // Ignore optional start parsing failure
  }

  return startSeconds > 0
    ? `https://www.youtube.com/embed/${id}?rel=0&start=${startSeconds}`
    : `https://www.youtube.com/embed/${id}?rel=0`;
}

/**
 * Validates an optional YouTube URL input (empty string is valid).
 */
export function isValidOptionalYouTubeUrl(rawUrl: string): boolean {
  const trimmed = rawUrl.trim();
  if (!trimmed) return true;
  return extractYouTubeId(trimmed) !== null;
}

/**
 * Normalizes a non-empty YouTube URL for clean persistence.
 */
export function normalizeOptionalYouTubeUrl(rawUrl?: string | null): string | undefined {
  const trimmed = (rawUrl ?? '').trim();
  if (!trimmed) return undefined;
  if (!extractYouTubeId(trimmed)) return undefined;
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  return withProtocol.slice(0, 300);
}

/**
 * Resolves the playable clip for a single recipe step ONLY if a real video URL exists
 * (either on the step itself or on its linked technique clip). Returns undefined if no real URL is present.
 */
export function resolveStepClip(
  step: RecipeStep,
  recipe: Recipe
): TechniqueClip | undefined {
  const linkedClip = step.techniqueClipId
    ? recipe.techniques.find((clip) => clip.id === step.techniqueClipId)
    : undefined;

  const validStepVideo = toYouTubeEmbedUrl(step.videoUrl)
    ? step.videoUrl?.trim()
    : undefined;

  if (validStepVideo) {
    if (linkedClip) {
      return {
        ...linkedClip,
        videoUrl: validStepVideo,
      };
    }
    return {
      id: `step-video-${step.stepNumber}`,
      title: step.title,
      subtitle: recipe.title,
      durationSeconds: step.durationSeconds || 60,
      preset: 'herb-searing',
      keyframeImage: recipe.heroImage,
      stages: [],
      videoUrl: validStepVideo,
    };
  }

  const validLinkedVideo =
    linkedClip && toYouTubeEmbedUrl(linkedClip.videoUrl)
      ? linkedClip.videoUrl?.trim()
      : undefined;

  if (linkedClip && validLinkedVideo) {
    return {
      ...linkedClip,
      videoUrl: validLinkedVideo,
    };
  }

  return undefined;
}

/**
 * Collects all playable clips for a recipe that contain a real video URL.
 */
export function resolveRecipeClips(recipe: Recipe): TechniqueClip[] {
  const clips: TechniqueClip[] = [];
  const seenIds = new Set<string>();

  for (const tech of recipe.techniques) {
    const matchingStep = recipe.steps.find(
      (s) => s.techniqueClipId === tech.id && toYouTubeEmbedUrl(s.videoUrl)
    );
    const realUrl = matchingStep?.videoUrl?.trim() || (toYouTubeEmbedUrl(tech.videoUrl) ? tech.videoUrl?.trim() : undefined);
    if (!realUrl) continue;

    clips.push({ ...tech, videoUrl: realUrl });
    seenIds.add(tech.id);
  }

  for (const step of recipe.steps) {
    if (!toYouTubeEmbedUrl(step.videoUrl)) continue;
    if (step.techniqueClipId && seenIds.has(step.techniqueClipId)) continue;
    const stepClip = resolveStepClip(step, recipe);
    if (stepClip && !seenIds.has(stepClip.id)) {
      clips.push(stepClip);
      seenIds.add(stepClip.id);
    }
  }

  return clips;
}
