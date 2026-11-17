import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const CHAPTER_IMAGE_MAP: Record<string, { src: string; defaultCaption: string }> = {
  breakfast: {
    src: '/src/assets/images/plate_breakfast_brioche_1794902209046.jpg',
    defaultCaption: 'Chef’s Plate — Warm morning bistro service from the Maison Feuille kitchen.',
  },
  lunch: {
    src: '/src/assets/images/recipe_mushroom_galette_1794869454174.jpg',
    defaultCaption: 'Chef’s Plate — Midday market fare plated on warm stoneware.',
  },
  dinner: {
    src: '/src/assets/images/recipe_sea_bass_fennel_1794869454991.jpg',
    defaultCaption: 'Chef’s Plate — Evening bistro table service from the Maison Feuille test kitchen.',
  },
  'comfort-food': {
    src: '/src/assets/images/recipe_duck_confit_cassoulet_1794869454292.jpg',
    defaultCaption: 'Chef’s Plate — Warm hearth comfort food straight from cast iron.',
  },
  'quick-easy-meals': {
    src: '/src/assets/images/recipe_sea_bass_fennel_1794869454991.jpg',
    defaultCaption: 'Chef’s Plate — Brisk weeknight sauté plated warm from the skillet.',
  },
  vegetarian: {
    src: '/src/assets/images/recipe_mushroom_galette_1794869454174.jpg',
    defaultCaption: 'Chef’s Plate — Garden-forward vegetable harvest plated in season.',
  },
  'international-favorites': {
    src: '/src/assets/images/recipe_heirloom_bouillabaisse_1794869455337.jpg',
    defaultCaption: 'Chef’s Plate — Regional classic from our global bistro repertoire.',
  },
  'international-italian': {
    src: '/src/assets/images/recipe_heirloom_bouillabaisse_1794869455337.jpg',
    defaultCaption: 'Chef’s Plate — Italian trattoria classic finished with olive oil and herbs.',
  },
  'international-asian': {
    src: '/src/assets/images/plate_asian_ramen_1794902208492.jpg',
    defaultCaption: 'Chef’s Plate — Fragrant Asian aromatics and balanced umami glaze.',
  },
  'international-mediterranean': {
    src: '/src/assets/images/recipe_heirloom_bouillabaisse_1794869455337.jpg',
    defaultCaption: 'Chef’s Plate — Sun-drenched Mediterranean market catch and saffron broth.',
  },
  'international-mexican': {
    src: '/src/assets/images/plate_mexican_tacos_1794902208640.jpg',
    defaultCaption: 'Chef’s Plate — Vibrant Mexican chile, citrus, and roasted spice table.',
  },
  'baking-bread': {
    src: '/src/assets/images/plate_artisan_sourdough_1794902210602.jpg',
    defaultCaption: 'Chef’s Plate — Freshly baked crust and warm butter pastry from the oven.',
  },
  desserts: {
    src: '/src/assets/images/recipe_burnt_honey_millefeuille_1794869456539.jpg',
    defaultCaption: 'Chef’s Plate — Seasonal dessert plated for afternoon and evening service.',
  },
  drinks: {
    src: '/src/assets/images/plate_bistro_drinks_1794902211731.jpg',
    defaultCaption: 'Chef’s Plate — House-infused pour and cellar aperitif from the Maison Feuille bar.',
  },
};

const RECIPE_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    chapterId: {
      type: Type.STRING,
      description:
        'Chapter or subchapter slug identifier (e.g. breakfast, lunch, dinner, comfort-food, quick-easy-meals, vegetarian, international-italian, international-asian, international-mediterranean, international-mexican, baking-bread, desserts, drinks, or custom chapter slug)',
    },
    title: { type: Type.STRING },
    subtitle: { type: Type.STRING },
    region: { type: Type.STRING },
    season: { type: Type.STRING },
    prepMinutes: { type: Type.INTEGER },
    cookMinutes: { type: Type.INTEGER },
    baseServings: { type: Type.INTEGER },
    figureCaption: { type: Type.STRING },
    storyExcerpt: { type: Type.STRING },
    storyParagraphs: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    pullQuote: { type: Type.STRING },
    pairingNote: { type: Type.STRING },
    chefAuthor: { type: Type.STRING },
    customizationNote: { type: Type.STRING },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          metricAmount: { type: Type.NUMBER },
          metricUnit: { type: Type.STRING },
          imperialAmount: { type: Type.NUMBER },
          imperialUnit: { type: Type.STRING },
        },
        required: ['id', 'name', 'metricAmount', 'metricUnit', 'imperialAmount', 'imperialUnit'],
      },
    },
    techniques: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          durationSeconds: { type: Type.INTEGER },
          preset: {
            type: Type.STRING,
            description:
              'Must be one of: butter-basting, knife-julienne, emulsion-whisk, caramel-swirl, dough-fold, herb-searing',
          },
          stages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timeSeconds: { type: Type.INTEGER },
                title: { type: Type.STRING },
                cue: { type: Type.STRING },
                heatSetting: { type: Type.STRING },
              },
              required: ['timeSeconds', 'title', 'cue', 'heatSetting'],
            },
          },
        },
        required: ['id', 'title', 'subtitle', 'durationSeconds', 'preset', 'stages'],
      },
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          instruction: { type: Type.STRING },
          durationSeconds: { type: Type.INTEGER },
          timerLabel: { type: Type.STRING },
          tip: { type: Type.STRING },
          techniqueClipId: { type: Type.STRING },
        },
        required: ['stepNumber', 'title', 'instruction', 'durationSeconds', 'timerLabel'],
      },
    },
  },
  required: [
    'chapterId',
    'title',
    'subtitle',
    'region',
    'season',
    'prepMinutes',
    'cookMinutes',
    'baseServings',
    'figureCaption',
    'storyExcerpt',
    'storyParagraphs',
    'pullQuote',
    'pairingNote',
    'chefAuthor',
    'ingredients',
    'techniques',
    'steps',
  ],
};

function sanitizeChapterId(raw: unknown): string {
  if (typeof raw === 'string') {
    const cleaned = raw.trim().replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 60);
    if (cleaned.length > 0) return cleaned;
  }
  return 'dinner';
}

const VALID_PRESETS = new Set([
  'butter-basting',
  'knife-julienne',
  'emulsion-whisk',
  'caramel-swirl',
  'dough-fold',
  'herb-searing',
]);

function normalizeRecipePayload(parsed: Record<string, unknown>, fallbackImage?: string, preferredChapterId?: string) {
  const chapterId = sanitizeChapterId(preferredChapterId || parsed.chapterId);
  const chapterMeta = CHAPTER_IMAGE_MAP[chapterId] ?? CHAPTER_IMAGE_MAP.dinner;
  const heroImage =
    typeof fallbackImage === 'string' && fallbackImage.startsWith('/src/assets/images/')
      ? fallbackImage
      : chapterMeta.src;

  const rawIngredients = Array.isArray(parsed.ingredients) ? parsed.ingredients.slice(0, 30) : [];
  const ingredients = rawIngredients.map((ing: Record<string, unknown>, idx: number) => ({
    id: String(ing.id || `ing-${idx + 1}`).slice(0, 48),
    name: String(ing.name || 'Seasonal ingredient').slice(0, 120),
    metricAmount: Math.max(0.1, Number(ing.metricAmount) || 1),
    metricUnit: String(ing.metricUnit || 'g').slice(0, 24),
    imperialAmount: Math.max(0.1, Number(ing.imperialAmount) || 1),
    imperialUnit: String(ing.imperialUnit || 'cup').slice(0, 24),
  }));

  const rawTechniques = Array.isArray(parsed.techniques) ? parsed.techniques.slice(0, 3) : [];
  const techniques = rawTechniques.map((tech: Record<string, unknown>, idx: number) => {
    const presetStr = String(tech.preset || 'butter-basting');
    const duration = Math.min(30, Math.max(10, Math.round(Number(tech.durationSeconds) || 15)));
    const stagesRaw = Array.isArray(tech.stages) ? tech.stages.slice(0, 4) : [];
    const stages =
      stagesRaw.length > 0
        ? stagesRaw.map((st: Record<string, unknown>, sIdx: number) => ({
            timeSeconds: Math.min(
              duration - 1,
              Math.max(0, Math.round(Number(st.timeSeconds) ?? sIdx * 5))
            ),
            title: String(st.title || `Stage ${sIdx + 1}`).slice(0, 80),
            cue: String(st.cue || 'Control heat carefully and observe visual texture.').slice(
              0,
              220
            ),
            heatSetting: String(st.heatSetting || 'Medium Heat').slice(0, 40),
          }))
        : [
            {
              timeSeconds: 0,
              title: 'Initial Technique',
              cue: 'Bring pan to steady warmth before adding aromatics.',
              heatSetting: 'Medium',
            },
          ];

    return {
      id: String(tech.id || `tech-${idx + 1}`).slice(0, 48),
      title: String(tech.title || 'Bistro Preparation Technique').slice(0, 100),
      subtitle: String(tech.subtitle || 'Controlled culinary execution').slice(0, 180),
      durationSeconds: duration,
      preset: VALID_PRESETS.has(presetStr) ? presetStr : 'butter-basting',
      keyframeImage: heroImage,
      stages,
    };
  });

  const validTechIds = new Set(techniques.map((t) => t.id));
  const rawSteps = Array.isArray(parsed.steps) ? parsed.steps.slice(0, 15) : [];
  const steps = rawSteps.map((step: Record<string, unknown>, idx: number) => {
    const stepTechId =
      typeof step.techniqueClipId === 'string' && validTechIds.has(step.techniqueClipId)
        ? step.techniqueClipId
        : undefined;
    const durationSec = Math.max(30, Math.min(7200, Math.round(Number(step.durationSeconds) || 240)));
    return {
      stepNumber: idx + 1,
      title: String(step.title || `Preparation Step ${idx + 1}`).slice(0, 100),
      instruction: String(step.instruction || 'Continue preparation carefully.').slice(0, 600),
      durationSeconds: durationSec,
      timerLabel: String(step.timerLabel || step.title || `Step ${idx + 1}`).slice(0, 60),
      ...(step.tip ? { tip: String(step.tip).slice(0, 260) } : {}),
      ...(stepTechId ? { techniqueClipId: stepTechId } : {}),
    };
  });

  const storyRaw = Array.isArray(parsed.storyParagraphs)
    ? parsed.storyParagraphs.slice(0, 4).map((p) => String(p).slice(0, 1200))
    : [];

  return {
    chapterId,
    title: String(parsed.title || 'Seasonal Bistro Dish').slice(0, 140),
    subtitle: String(parsed.subtitle || 'Prepared fresh in the Maison Feuille kitchen').slice(
      0,
      240
    ),
    region: String(parsed.region || 'Seasonal Bistro').slice(0, 80),
    season: String(parsed.season || 'Autumn').slice(0, 40),
    prepMinutes: Math.max(5, Math.min(360, Math.round(Number(parsed.prepMinutes) || 20))),
    cookMinutes: Math.max(5, Math.min(480, Math.round(Number(parsed.cookMinutes) || 30))),
    baseServings: Math.max(1, Math.min(24, Math.round(Number(parsed.baseServings) || 4))),
    heroImage,
    figureCaption: String(parsed.figureCaption || chapterMeta.defaultCaption).slice(0, 260),
    storyExcerpt: String(
      parsed.storyExcerpt ||
        storyRaw[0] ||
        'Crafted to order in the warm editorial kitchen of Maison Feuille.'
    ).slice(0, 500),
    storyParagraphs:
      storyRaw.length > 0
        ? storyRaw
        : [
            'Crafted to order with seasonal market produce, balanced acidity, and patient bistro heat control.',
          ],
    pullQuote: String(
      parsed.pullQuote || '“Cook by aroma and gentle heat; let every layer settle before plating.”'
    ).slice(0, 360),
    pairingNote: String(
      parsed.pairingNote || 'Serve alongside crusty country sourdough and a crisp seasonal pour.'
    ).slice(0, 360),
    chefAuthor: String(parsed.chefAuthor || 'Maison Feuille Kitchen').slice(0, 100),
    ...(parsed.customizationNote
      ? { customizationNote: String(parsed.customizationNote).slice(0, 400) }
      : {}),
    ingredients:
      ingredients.length > 0
        ? ingredients
        : [
            {
              id: 'ing-1',
              name: 'Seasonal market produce',
              metricAmount: 400,
              metricUnit: 'g',
              imperialAmount: 14,
              imperialUnit: 'oz',
            },
          ],
    techniques,
    steps:
      steps.length > 0
        ? steps
        : [
            {
              stepNumber: 1,
              title: 'Prepare Mise en Place',
              instruction: 'Trim, season, and bring primary ingredients to room temperature.',
              durationSeconds: 300,
              timerLabel: 'Prep ingredients',
            },
          ],
  };
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  nl: 'Dutch (Nederlands)',
  fr: 'French (Français)',
  es: 'Spanish (Español)',
  de: 'German (Deutsch)',
  it: 'Italian (Italiano)',
};

function resolveTargetLanguage(raw: unknown): { code: string; name: string } {
  const code = typeof raw === 'string' && raw in LANGUAGE_NAMES ? raw : 'en';
  return { code, name: LANGUAGE_NAMES[code] };
}

function toHumanReadableServerAiError(err: unknown): {
  httpStatus: number;
  errorCode: string;
  error: string;
} {
  let rawMsg = err instanceof Error ? err.message : String(err ?? '');
  let extractedStatus =
    typeof (err as { status?: unknown })?.status === 'number'
      ? Number((err as { status?: number }).status)
      : 0;
  let extractedCodeText = '';

  // Google GenAI errors often embed serialized JSON inside err.message
  const jsonStart = rawMsg.indexOf('{');
  if (jsonStart !== -1) {
    try {
      const parsed = JSON.parse(rawMsg.slice(jsonStart)) as {
        error?: { code?: number; status?: string; message?: string };
      };
      if (parsed?.error) {
        if (typeof parsed.error.code === 'number') extractedStatus = parsed.error.code;
        if (typeof parsed.error.status === 'string') extractedCodeText = parsed.error.status;
        if (typeof parsed.error.message === 'string') rawMsg = parsed.error.message;
      }
    } catch {
      // Ignore JSON parsing failure on error message
    }
  }

  const hay = `${extractedStatus} ${extractedCodeText} ${rawMsg}`.toLowerCase();

  if (
    extractedStatus === 429 ||
    hay.includes('resource_exhausted') ||
    hay.includes('quota') ||
    hay.includes('rate limit')
  ) {
    return {
      httpStatus: 429,
      errorCode: 'AI_RATE_LIMIT',
      error: 'Too many recipe requests were made at once. Please wait a moment and try again.',
    };
  }

  if (
    extractedStatus === 503 ||
    hay.includes('unavailable') ||
    hay.includes('overloaded') ||
    hay.includes('high demand')
  ) {
    return {
      httpStatus: 503,
      errorCode: 'AI_UNAVAILABLE',
      error: 'The culinary AI service is temporarily busy or unavailable. Please try again shortly.',
    };
  }

  if (
    extractedStatus === 401 ||
    extractedStatus === 403 ||
    hay.includes('permission_denied') ||
    hay.includes('api_key') ||
    hay.includes('api key')
  ) {
    return {
      httpStatus: 503,
      errorCode: 'AI_CONFIG',
      error: 'The culinary AI service is temporarily unavailable due to a server configuration issue.',
    };
  }

  if (
    extractedStatus === 504 ||
    hay.includes('deadline_exceeded') ||
    hay.includes('timeout') ||
    hay.includes('etimedout')
  ) {
    return {
      httpStatus: 504,
      errorCode: 'AI_TIMEOUT',
      error: 'The recipe request took too long to respond. Please try again.',
    };
  }

  if (
    hay.includes('fetch failed') ||
    hay.includes('econnrefused') ||
    hay.includes('enotfound') ||
    hay.includes('network')
  ) {
    return {
      httpStatus: 502,
      errorCode: 'AI_NETWORK',
      error: 'Could not reach the culinary AI service right now. Please try again in a moment.',
    };
  }

  if (extractedStatus === 404 || hay.includes('not_found')) {
    return {
      httpStatus: 502,
      errorCode: 'AI_UNAVAILABLE',
      error: 'The culinary AI model is temporarily unavailable. Please try again in a moment.',
    };
  }

  return {
    httpStatus: 502,
    errorCode: 'AI_TECH_ERROR',
    error: 'A technical error occurred while generating the recipe. Please try again in a moment.',
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/recipes/generate', async (req, res) => {
    try {
      const { prompt, chapterId, chapterTitle, persons, language } = req.body ?? {};
      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: 'Please describe the dish you would like to cook.' });
      }
      if (!process.env.GEMINI_API_KEY) {
        return res
          .status(500)
          .json({ error: 'Gemini API key is not configured on the server.' });
      }

      const targetPersons = Math.max(1, Math.min(24, Number(persons) || 4));
      const targetChapter = sanitizeChapterId(chapterId);
      const targetChapterLabel =
        typeof chapterTitle === 'string' && chapterTitle.trim()
          ? `${chapterTitle.trim()} (${targetChapter})`
          : targetChapter;
      const targetLang = resolveTargetLanguage(language);

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Create a complete, authentic bistro cookbook recipe for Maison Feuille based on this request: "${prompt.trim()}".
Target language: ${targetLang.name} (code: "${targetLang.code}").
Target servings (baseServings): ${targetPersons}.
Preferred chapter: ${targetChapterLabel}.
Requirements:
- Write EVERY prose and label field (title, subtitle, region, season, figureCaption, storyExcerpt, storyParagraphs, pullQuote, pairingNote, ingredients[].name, ingredients[].metricUnit, ingredients[].imperialUnit, techniques[].title/subtitle/stages, steps[].title/instruction/timerLabel/tip) naturally in ${targetLang.name}.
- Keep chapterId set to "${targetChapter}" and techniques[].preset must be one of [butter-basting, knife-julienne, emulsion-whisk, caramel-swirl, dough-fold, herb-searing].
- Write 2 warm editorial storyParagraphs in bistro cookbook prose, plus an evocative pullQuote in quotation marks and a concise pairingNote.
- Provide 6 to 10 realistic ingredients with both exact metricAmount/metricUnit and imperialAmount/imperialUnit scaled for ${targetPersons} persons.
- Include 1 to 2 interactive technique clips and 4 to 6 numbered cooking steps, each with a realistic durationSeconds (in seconds) and concise timerLabel for interactive step-by-step timers, linking techniqueClipId where relevant.`,
        config: {
          systemInstruction: `You are the head chef and culinary editor of Maison Feuille, a warm seasonal bistro monograph. Produce accurate, delicious recipes written in ${targetLang.name} with crisp measurements, sensory cues, and realistic cooking times.`,
          responseMimeType: 'application/json',
          responseSchema: RECIPE_RESPONSE_SCHEMA,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        return res.status(502).json({
          errorCode: 'AI_INVALID_JSON',
          error: 'The culinary model returned an empty recipe. Please try again.',
        });
      }

      let parsed: Record<string, unknown>;
      try {
        const candidate = JSON.parse(rawText) as unknown;
        if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
          throw new Error('Model response was not a JSON object');
        }
        parsed = candidate as Record<string, unknown>;
      } catch (parseErr) {
        console.error('Invalid JSON from /api/recipes/generate:', parseErr);
        return res.status(502).json({
          errorCode: 'AI_INVALID_JSON',
          error: 'The chef assistant returned an unreadable recipe format. Please try asking again.',
        });
      }

      const normalized = normalizeRecipePayload(parsed, undefined, targetChapter);
      return res.json({ recipe: normalized });
    } catch (err: unknown) {
      console.error('Error generating recipe:', err);
      const mapped = toHumanReadableServerAiError(err);
      return res.status(mapped.httpStatus).json({
        errorCode: mapped.errorCode,
        error: mapped.error,
      });
    }
  });

  app.post('/api/recipes/customize', async (req, res) => {
    try {
      const { recipe, instruction, language } = req.body ?? {};
      if (!recipe || typeof recipe !== 'object') {
        return res.status(400).json({ error: 'Missing source recipe to customize.' });
      }
      if (!instruction || typeof instruction !== 'string' || !instruction.trim()) {
        return res.status(400).json({ error: 'Please describe how you want to customize this recipe.' });
      }
      if (!process.env.GEMINI_API_KEY) {
        return res
          .status(500)
          .json({ error: 'Gemini API key is not configured on the server.' });
      }

      const targetLang = resolveTargetLanguage(language);

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Customize the following Maison Feuille recipe according to this user request: "${instruction.trim()}".
Target output language: ${targetLang.name} (code: "${targetLang.code}").

Current Recipe JSON:
${JSON.stringify(recipe)}

Requirements:
- Write ALL text fields (title, subtitle, region, season, figureCaption, storyExcerpt, storyParagraphs, pullQuote, pairingNote, customizationNote, ingredients, techniques, steps) naturally in ${targetLang.name}.
- Preserve the dish's editorial cookbook voice, baseServings (${Number(recipe.baseServings) || 4}), and chapterId (${String(recipe.chapterId || 'dinner')}) unless the customization changes them.
- Accurately modify title/subtitle if the main flavor or dietary profile changed, update ingredients (both metric and imperial amounts), adjust steps and durationSeconds timers accordingly, and explain the culinary adaptation clearly in customizationNote and storyParagraphs.
- Keep chapterId as "${sanitizeChapterId(recipe.chapterId)}" and 1 to 2 technique clips using presets from [butter-basting, knife-julienne, emulsion-whisk, caramel-swirl, dough-fold, herb-searing].`,
        config: {
          systemInstruction: `You are the head chef of Maison Feuille adapting an existing bistro recipe to a guest’s dietary preference, flavor request, or time constraint in ${targetLang.name}, keeping measurements precise and timers accurate.`,
          responseMimeType: 'application/json',
          responseSchema: RECIPE_RESPONSE_SCHEMA,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        return res.status(502).json({
          errorCode: 'AI_INVALID_JSON',
          error: 'The culinary model returned an empty adaptation. Please try again.',
        });
      }

      let parsed: Record<string, unknown>;
      try {
        const candidate = JSON.parse(rawText) as unknown;
        if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
          throw new Error('Model response was not a JSON object');
        }
        parsed = candidate as Record<string, unknown>;
      } catch (parseErr) {
        console.error('Invalid JSON from /api/recipes/customize:', parseErr);
        return res.status(502).json({
          errorCode: 'AI_INVALID_JSON',
          error: 'The chef assistant returned an unreadable recipe format. Please try again.',
        });
      }

      const normalized = normalizeRecipePayload(parsed, recipe.heroImage, sanitizeChapterId(recipe.chapterId));
      normalized.customizationNote =
        normalized.customizationNote || `Adapted: ${instruction.trim()}`;
      return res.json({ recipe: normalized });
    } catch (err: unknown) {
      console.error('Error customizing recipe:', err);
      const mapped = toHumanReadableServerAiError(err);
      return res.status(mapped.httpStatus).json({
        errorCode: mapped.errorCode,
        error: mapped.error,
      });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Maison Feuille server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
