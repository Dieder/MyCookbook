import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Shield,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  getLocalizedSeasonLabel,
  SEASON_OPTIONS,
  UI_STRINGS,
} from '../i18n/translations';
import {
  Chapter,
  Ingredient,
  LanguageCode,
  Recipe,
  RecipeStatus,
  RecipeStep,
  UnitSystem,
} from '../types/cookbook';
import {
  compressDishPhoto,
  convertImperialToMetric,
  convertMetricToImperial,
  getLocalizedUnitLabel,
  IMPERIAL_UNIT_OPTIONS,
  METRIC_UNIT_OPTIONS,
} from '../utils/units';
import {
  isValidOptionalYouTubeUrl,
  normalizeOptionalYouTubeUrl,
} from '../utils/youtube';
import { EditorialPlateImage } from './EditorialPlateImage';

const PLATE_IMAGE_OPTIONS = [
  {
    path: '/src/assets/images/recipe_duck_confit_cassoulet_1794869454292.jpg',
    label: 'Cast-Iron Hearth Plate',
  },
  {
    path: '/src/assets/images/recipe_mushroom_galette_1794869454174.jpg',
    label: 'Savory Tart & Galette',
  },
  {
    path: '/src/assets/images/recipe_sea_bass_fennel_1794869454991.jpg',
    label: 'Seared Fillet & Fennel',
  },
  {
    path: '/src/assets/images/recipe_heirloom_bouillabaisse_1794869455337.jpg',
    label: 'Coastal Broth & Seafood',
  },
  {
    path: '/src/assets/images/plate_breakfast_brioche_1794902209046.jpg',
    label: 'Morning Brioche & Café',
  },
  {
    path: '/src/assets/images/plate_artisan_sourdough_1794902210602.jpg',
    label: 'Artisan Levain Bread',
  },
  {
    path: '/src/assets/images/plate_asian_ramen_1794902208492.jpg',
    label: 'Aromatic Noodle Bowl',
  },
  {
    path: '/src/assets/images/plate_mexican_tacos_1794902208640.jpg',
    label: 'Comal & Lime Tacos',
  },
  {
    path: '/src/assets/images/recipe_burnt_honey_millefeuille_1794869456539.jpg',
    label: 'Layered Patisserie',
  },
  {
    path: '/src/assets/images/recipe_poached_pear_tart_1794869456644.jpg',
    label: 'Orchard Fruit Tart',
  },
  {
    path: '/src/assets/images/plate_bistro_drinks_1794902211731.jpg',
    label: 'Cellar Infusion & Bar',
  },
  {
    path: '/src/assets/images/bistro_cover_still_life_1794869453098.jpg',
    label: 'Bistro Table Still Life',
  },
];

interface DraftIngredientRow {
  id: string;
  name: string;
  metricAmount: number;
  metricUnit: string;
  imperialAmount: number;
  imperialUnit: string;
}

interface DraftStepRow {
  title: string;
  instruction: string;
  timerMinutes: number;
  timerLabel: string;
  tip: string;
  videoUrl: string;
  techniqueClipId?: string;
}

interface RecipeEditorPageProps {
  canContribute: boolean;
  recipe: Recipe | null;
  chapters: Chapter[];
  defaultChefAuthor: string;
  unitSystem: UnitSystem;
  onSaveRecipe: (
    payload: Omit<Recipe, 'id' | 'plateNumber'>,
    status: RecipeStatus,
    existingRecipe: Recipe | null
  ) => Promise<void>;
  onBack: () => void;
  onGoToSettings: () => void;
  lang: LanguageCode;
}

function makeEmptyIngredient(idx: number): DraftIngredientRow {
  return {
    id: `ing-${Date.now().toString(36)}-${idx}`,
    name: '',
    metricAmount: 100,
    metricUnit: 'g',
    imperialAmount: 3.5,
    imperialUnit: 'oz',
  };
}

function makeEmptyStep(): DraftStepRow {
  return {
    title: '',
    instruction: '',
    timerMinutes: 5,
    timerLabel: '',
    tip: '',
    videoUrl: '',
  };
}

export function RecipeEditorPage({
  canContribute,
  recipe,
  chapters,
  defaultChefAuthor,
  unitSystem,
  onSaveRecipe,
  onBack,
  onGoToSettings,
  lang,
}: RecipeEditorPageProps) {
  const t = UI_STRINGS[lang];
  const isEditing = Boolean(recipe);
  const topChapters = chapters.filter((c) => !c.parentChapterId);
  const topIds = new Set(topChapters.map((c) => c.id));
  const orphanedSubchapters = chapters.filter(
    (c) => c.parentChapterId && !topIds.has(c.parentChapterId)
  );

  const [title, setTitle] = useState(recipe?.title ?? '');
  const [subtitle, setSubtitle] = useState(recipe?.subtitle ?? '');
  const [chapterId, setChapterId] = useState(
    recipe?.chapterId ?? chapters[0]?.id ?? 'dinner'
  );
  const [region, setRegion] = useState(recipe?.region ?? 'Paris');
  const [season, setSeason] = useState(recipe?.season ?? 'All Seasons');
  const [prepMinutes, setPrepMinutes] = useState<number>(
    recipe?.prepMinutes ?? 15
  );
  const [cookMinutes, setCookMinutes] = useState<number>(
    recipe?.cookMinutes ?? 25
  );
  const [baseServings, setBaseServings] = useState<number>(
    recipe?.baseServings ?? 4
  );
  const [heroImage, setHeroImage] = useState(
    recipe?.heroImage ?? PLATE_IMAGE_OPTIONS[0].path
  );
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [figureCaption, setFigureCaption] = useState(
    recipe?.figureCaption ?? ''
  );
  const [storyExcerpt, setStoryExcerpt] = useState(recipe?.storyExcerpt ?? '');
  const [storyText, setStoryText] = useState(
    recipe?.storyParagraphs?.join('\n\n') ?? ''
  );
  const [pullQuote, setPullQuote] = useState(recipe?.pullQuote ?? '');
  const [pairingNote, setPairingNote] = useState(recipe?.pairingNote ?? '');
  const [ingredients, setIngredients] = useState<DraftIngredientRow[]>(() =>
    recipe?.ingredients?.length
      ? recipe.ingredients.map((ing) => ({
          id: ing.id,
          name: ing.name,
          metricAmount: ing.metricAmount,
          metricUnit: ing.metricUnit,
          imperialAmount: ing.imperialAmount,
          imperialUnit: ing.imperialUnit,
        }))
      : [makeEmptyIngredient(1), makeEmptyIngredient(2)]
  );
  const [steps, setSteps] = useState<DraftStepRow[]>(() =>
    recipe?.steps?.length
      ? recipe.steps.map((st) => ({
          title: st.title,
          instruction: st.instruction,
          timerMinutes: st.durationSeconds
            ? Math.max(0, Math.round(st.durationSeconds / 60))
            : 0,
          timerLabel: st.timerLabel ?? '',
          tip: st.tip ?? '',
          videoUrl: st.videoUrl ?? '',
          techniqueClipId: st.techniqueClipId,
        }))
      : [makeEmptyStep()]
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(recipe?.title ?? '');
    setSubtitle(recipe?.subtitle ?? '');
    setChapterId(recipe?.chapterId ?? chapters[0]?.id ?? 'dinner');
    setRegion(recipe?.region ?? 'Paris');
    setSeason(recipe?.season ?? 'All Seasons');
    setPrepMinutes(recipe?.prepMinutes ?? 15);
    setCookMinutes(recipe?.cookMinutes ?? 25);
    setBaseServings(recipe?.baseServings ?? 4);
    setHeroImage(recipe?.heroImage ?? PLATE_IMAGE_OPTIONS[0].path);
    setPhotoError(null);
    setFigureCaption(recipe?.figureCaption ?? '');
    setStoryExcerpt(recipe?.storyExcerpt ?? '');
    setStoryText(recipe?.storyParagraphs?.join('\n\n') ?? '');
    setPullQuote(recipe?.pullQuote ?? '');
    setPairingNote(recipe?.pairingNote ?? '');
    setIngredients(
      recipe?.ingredients?.length
        ? recipe.ingredients.map((ing) => ({
            id: ing.id,
            name: ing.name,
            metricAmount: ing.metricAmount,
            metricUnit: ing.metricUnit,
            imperialAmount: ing.imperialAmount,
            imperialUnit: ing.imperialUnit,
          }))
        : [makeEmptyIngredient(1), makeEmptyIngredient(2)]
    );
    setSteps(
      recipe?.steps?.length
        ? recipe.steps.map((st) => ({
            title: st.title,
            instruction: st.instruction,
            timerMinutes: st.durationSeconds
              ? Math.max(0, Math.round(st.durationSeconds / 60))
              : 0,
            timerLabel: st.timerLabel ?? '',
            tip: st.tip ?? '',
            videoUrl: st.videoUrl ?? '',
            techniqueClipId: st.techniqueClipId,
          }))
        : [makeEmptyStep()]
    );
    setError(null);
  }, [recipe, chapters]);

  if (!canContribute) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-16">
        <div className="max-w-lg mx-auto border border-[var(--border-line)] bg-[var(--bg-surface)] p-8 text-center space-y-4">
          <Shield className="w-7 h-7 mx-auto text-[var(--accent-secondary)]" />
          <h1 className="font-display text-2xl text-[var(--text-ink)]">
            {t.myRecipesTitle}
          </h1>
          <p className="font-serif text-sm text-[var(--text-muted)]">
            {t.myRecipesAccessDenied}
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

  const handleSave = async (targetStatus: RecipeStatus) => {
    const cleanTitle = title.trim();
    const cleanSubtitle = subtitle.trim() || cleanTitle;
    if (!cleanTitle) {
      setError('Please enter a dish title.');
      return;
    }

    const validIngredients: Ingredient[] = ingredients
      .filter((row) => row.name.trim().length > 0)
      .slice(0, 30)
      .map((row, index) => {
        if (unitSystem === 'metric') {
          const metricAmt = Math.max(0.1, Number(row.metricAmount) || 1);
          const metricUnit = row.metricUnit.trim().slice(0, 24) || 'g';
          const converted = convertMetricToImperial(metricAmt, metricUnit);
          return {
            id: row.id || `ing-${index + 1}`,
            name: row.name.trim().slice(0, 140),
            metricAmount: metricAmt,
            metricUnit,
            imperialAmount: Math.max(0.1, converted.amount),
            imperialUnit: converted.unit.slice(0, 24) || 'oz',
          };
        }
        const imperialAmt = Math.max(0.1, Number(row.imperialAmount) || 1);
        const imperialUnit = row.imperialUnit.trim().slice(0, 24) || 'oz';
        const converted = convertImperialToMetric(imperialAmt, imperialUnit);
        return {
          id: row.id || `ing-${index + 1}`,
          name: row.name.trim().slice(0, 140),
          metricAmount: Math.max(0.1, converted.amount),
          metricUnit: converted.unit.slice(0, 24) || 'g',
          imperialAmount: imperialAmt,
          imperialUnit,
        };
      });

    if (validIngredients.length === 0) {
      setError('Please add at least one ingredient.');
      return;
    }

    const filteredStepRows = steps
      .filter((st) => st.title.trim().length > 0 || st.instruction.trim().length > 0)
      .slice(0, 15);

    for (let idx = 0; idx < filteredStepRows.length; idx++) {
      if (!isValidOptionalYouTubeUrl(filteredStepRows[idx].videoUrl)) {
        setError(t.invalidYouTubeUrlError(idx + 1));
        return;
      }
    }

    const validSteps: RecipeStep[] = filteredStepRows.map((st, idx) => {
      const mins = Math.max(0, Math.min(360, Number(st.timerMinutes) || 0));
      const stepObj: RecipeStep = {
        stepNumber: idx + 1,
        title: (st.title.trim() || `Step ${idx + 1}`).slice(0, 120),
        instruction: (st.instruction.trim() || st.title.trim()).slice(0, 800),
      };
      if (mins > 0) {
        stepObj.durationSeconds = Math.round(mins * 60);
        stepObj.timerLabel = (st.timerLabel.trim() || stepObj.title).slice(0, 80);
      }
      if (st.tip.trim()) {
        stepObj.tip = st.tip.trim().slice(0, 260);
      }
      if (st.techniqueClipId) {
        stepObj.techniqueClipId = st.techniqueClipId;
      }
      const normalizedVideoUrl = normalizeOptionalYouTubeUrl(st.videoUrl);
      if (normalizedVideoUrl) {
        stepObj.videoUrl = normalizedVideoUrl;
      }
      return stepObj;
    });

    if (validSteps.length === 0) {
      setError('Please add at least one preparation step.');
      return;
    }

    const paragraphs = storyText
      .split(/\n\s*\n/)
      .map((p) => p.trim().slice(0, 1500))
      .filter(Boolean)
      .slice(0, 4);

    const safeExcerpt = (storyExcerpt.trim() || cleanSubtitle).slice(0, 500);
    if (paragraphs.length === 0) {
      paragraphs.push(safeExcerpt);
    }

    setError(null);
    setSaving(true);
    try {
      await onSaveRecipe(
        {
          chapterId: chapterId || chapters[0]?.id || 'dinner',
          title: cleanTitle.slice(0, 140),
          subtitle: cleanSubtitle.slice(0, 240),
          region: (region.trim() || 'Paris').slice(0, 80),
          season: (season.trim() || 'All Seasons').slice(0, 40),
          prepMinutes: Math.max(0, Math.min(1440, Math.round(Number(prepMinutes) || 0))),
          cookMinutes: Math.max(0, Math.min(1440, Math.round(Number(cookMinutes) || 0))),
          baseServings: Math.max(1, Math.min(48, Math.round(Number(baseServings) || 4))),
          heroImage,
          figureCaption: (figureCaption.trim() || cleanTitle).slice(0, 260),
          storyExcerpt: safeExcerpt,
          storyParagraphs: paragraphs,
          pullQuote: (pullQuote.trim() || `“${cleanTitle}.”`).slice(0, 360),
          pairingNote: (
            pairingNote.trim() || 'Serve warm at the table with seasonal accompaniments.'
          ).slice(0, 360),
          chefAuthor: (defaultChefAuthor.trim() || 'Maison Feuille Contributor').slice(0, 100),
          ingredients: validIngredients,
          techniques: recipe?.techniques ?? [],
          steps: validSteps,
          sourceType: recipe?.sourceType ?? 'contributor',
          status: targetStatus,
          ...(recipe?.parentRecipeId ? { parentRecipeId: recipe.parentRecipeId } : {}),
          ...(recipe?.customizationNote
            ? { customizationNote: recipe.customizationNote }
            : {}),
        },
        targetStatus,
        recipe
      );
      onBack();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Unable to save recipe right now.'
      );
    } finally {
      setSaving(false);
    }
  };

  const currentStatus: RecipeStatus =
    recipe?.status === 'draft' ? 'draft' : 'published';

  return (
    <div className="max-w-[980px] mx-auto px-6 sm:px-10 py-8 sm:py-10 space-y-8">
      {/* Top Back Strip */}
      <div className="border-b border-[var(--border-line)] pb-5 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-2 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center gap-2 hover:bg-[var(--bg-elevated)] cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t.backToMyRecipes}
        </button>

        {isEditing && (
          <span
            className={`text-xs font-mono uppercase tracking-[0.12em] ${
              currentStatus === 'draft'
                ? 'text-[var(--accent-secondary)]'
                : 'text-[var(--accent-primary)]'
            }`}
          >
            {currentStatus === 'draft' ? t.statusDraft : t.statusPublished}
          </span>
        )}
      </div>

      {/* Masthead */}
      <div className="space-y-1">
        <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--accent-secondary)]">
          {t.recipeEditorEyebrow}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-[var(--text-ink)]">
          {isEditing ? t.editRecipeTitle : t.createRecipeTitle}
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSave(isEditing ? currentStatus : 'published');
        }}
        className="space-y-8"
      >
        {/* Identity & Chapter */}
        <section className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label
                htmlFor="rec-title"
                className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
              >
                {t.recipeTitleField}
              </label>
              <input
                id="rec-title"
                type="text"
                required
                maxLength={140}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[var(--bg-paper)] border border-[var(--border-line)] text-base font-display text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="rec-chapter"
                className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
              >
                {t.dishCourseField}
              </label>
              <select
                id="rec-chapter"
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
                className="w-full px-3 py-2.5 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              >
                {topChapters.map((parent) => {
                  const subs = chapters.filter((c) => c.parentChapterId === parent.id);
                  return [
                    <option key={parent.id} value={parent.id}>
                      {parent.title}
                    </option>,
                    ...subs.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {'\u00A0\u00A0'}— {sub.title}
                      </option>
                    )),
                  ];
                })}
                {orphanedSubchapters.map((orphan) => (
                  <option key={orphan.id} value={orphan.id}>
                    — {orphan.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="rec-subtitle"
              className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
            >
              {t.recipeSubtitleField}
            </label>
            <input
              id="rec-subtitle"
              type="text"
              required
              maxLength={240}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <label
                htmlFor="rec-region"
                className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
              >
                {t.recipeRegionField}
              </label>
              <input
                id="rec-region"
                type="text"
                maxLength={80}
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="col-span-1">
              <label
                htmlFor="rec-season"
                className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
              >
                {t.recipeSeasonField}
              </label>
              <select
                id="rec-season"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              >
                {(SEASON_OPTIONS as readonly string[]).includes(season)
                  ? SEASON_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {getLocalizedSeasonLabel(opt, lang)}
                      </option>
                    ))
                  : [season, ...SEASON_OPTIONS].filter(Boolean).map((opt) => (
                      <option key={opt} value={opt}>
                        {getLocalizedSeasonLabel(opt, lang)}
                      </option>
                    ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="rec-prep"
                className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
              >
                {t.recipePrepMinutesField}
              </label>
              <input
                id="rec-prep"
                type="number"
                min={0}
                max={1440}
                value={prepMinutes}
                onChange={(e) => setPrepMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-mono tabular-nums text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label
                htmlFor="rec-cook"
                className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
              >
                {t.recipeCookMinutesField}
              </label>
              <input
                id="rec-cook"
                type="number"
                min={0}
                max={1440}
                value={cookMinutes}
                onChange={(e) => setCookMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-mono tabular-nums text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label
                htmlFor="rec-servings"
                className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
              >
                {t.recipeBaseServingsField}
              </label>
              <input
                id="rec-servings"
                type="number"
                min={1}
                max={48}
                value={baseServings}
                onChange={(e) => setBaseServings(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-mono tabular-nums text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label
                htmlFor="rec-author"
                className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)]"
              >
                {t.recipeChefAuthorField}
              </label>
              <span className="text-[11px] font-mono text-[var(--accent-secondary)]">
                {t.chefLoggedInHint}
              </span>
            </div>
            <input
              id="rec-author"
              type="text"
              readOnly
              value={defaultChefAuthor}
              className="w-full px-3.5 py-2 bg-[var(--bg-elevated)]/60 border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] cursor-default focus:outline-none"
            />
          </div>
        </section>

        {/* Plate Photography & Photo Upload */}
        <section className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-5">
          <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--accent-secondary)]">
            {t.recipePlateImageField}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-5">
              <EditorialPlateImage
                src={heroImage}
                alt={title.trim() || t.recipePlateImageField}
                aspectClass="aspect-[4/3]"
              />
            </div>

            <div className="md:col-span-7 space-y-3">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={async (e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (!file) return;
                  setPhotoError(null);
                  setUploadingPhoto(true);
                  try {
                    const compressed = await compressDishPhoto(file);
                    setHeroImage(compressed);
                  } catch (err: unknown) {
                    setPhotoError(
                      err instanceof Error ? err.message : 'Unable to process photo.'
                    );
                  } finally {
                    setUploadingPhoto(false);
                  }
                }}
                className="border border-dashed border-[var(--border-line)] bg-[var(--bg-paper)] p-5 space-y-3"
              >
                <p className="font-serif text-sm text-[var(--text-muted)] leading-relaxed">
                  {t.uploadPhotoHint}
                </p>

                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    setPhotoError(null);
                    setUploadingPhoto(true);
                    try {
                      const compressed = await compressDishPhoto(file);
                      setHeroImage(compressed);
                    } catch (err: unknown) {
                      setPhotoError(
                        err instanceof Error ? err.message : 'Unable to process photo.'
                      );
                    } finally {
                      setUploadingPhoto(false);
                    }
                  }}
                />

                <button
                  type="button"
                  disabled={uploadingPhoto}
                  onClick={() => photoInputRef.current?.click()}
                  className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-2 hover:opacity-90 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                >
                  {uploadingPhoto ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      {t.processingPhotoLabel}
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      {t.uploadPhotoBtn}
                    </>
                  )}
                </button>

                {photoError && (
                  <p className="text-xs font-serif text-[var(--accent-secondary)]">
                    {photoError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-[var(--border-subtle)]">
            <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)]">
              {t.presetPlatesLabel}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {PLATE_IMAGE_OPTIONS.map((imgOpt) => {
                const selected = heroImage === imgOpt.path;
                return (
                  <button
                    key={imgOpt.path}
                    type="button"
                    onClick={() => {
                      setPhotoError(null);
                      setHeroImage(imgOpt.path);
                    }}
                    title={imgOpt.label}
                    className={`border overflow-hidden text-left cursor-pointer transition-all ${
                      selected
                        ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]'
                        : 'border-[var(--border-line)] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="aspect-[4/3] bg-[var(--bg-elevated)]">
                      <img
                        src={imgOpt.path}
                        alt={imgOpt.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="rec-caption"
              className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
            >
              {t.recipeFigureCaptionField}
            </label>
            <input
              id="rec-caption"
              type="text"
              maxLength={260}
              value={figureCaption}
              onChange={(e) => setFigureCaption(e.target.value)}
              className="w-full px-3.5 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>
        </section>

        {/* Editorial Story & Pairing */}
        <section className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-4">
          <div>
            <label
              htmlFor="rec-excerpt"
              className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
            >
              {t.recipeExcerptField}
            </label>
            <input
              id="rec-excerpt"
              type="text"
              maxLength={500}
              value={storyExcerpt}
              onChange={(e) => setStoryExcerpt(e.target.value)}
              className="w-full px-3.5 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div>
            <label
              htmlFor="rec-story"
              className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
            >
              {t.recipeStoryField}
            </label>
            <textarea
              id="rec-story"
              rows={4}
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              className="w-full p-3.5 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] leading-relaxed focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="rec-quote"
                className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
              >
                {t.recipePullQuoteField}
              </label>
              <input
                id="rec-quote"
                type="text"
                maxLength={360}
                value={pullQuote}
                onChange={(e) => setPullQuote(e.target.value)}
                className="w-full px-3.5 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>

            <div>
              <label
                htmlFor="rec-pairing"
                className="block text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5"
              >
                {t.recipePairingField}
              </label>
              <input
                id="rec-pairing"
                type="text"
                maxLength={360}
                value={pairingNote}
                onChange={(e) => setPairingNote(e.target.value)}
                className="w-full px-3.5 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>
        </section>

        {/* Ingredients List — shows only active unit preference & auto-converts */}
        <section className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-3">
            <div className="space-y-0.5">
              <h2 className="font-display text-2xl text-[var(--text-ink)]">
                {t.recipeIngredientsSection}
              </h2>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                {unitSystem === 'metric' ? t.metricFull : t.usCustomaryFull}
                {' · '}
                {t.autoConvertNote(
                  unitSystem === 'metric' ? t.usShort : t.metricShort
                )}
              </p>
            </div>
            <button
              type="button"
              disabled={ingredients.length >= 30}
              onClick={() =>
                setIngredients((prev) => [
                  ...prev,
                  makeEmptyIngredient(prev.length + 1),
                ])
              }
              className="px-3 py-1.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] cursor-pointer disabled:opacity-40 whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              {t.addIngredientBtn}
            </button>
          </div>

          <div className="space-y-3">
            {ingredients.map((row, idx) => {
              const isMetricMode = unitSystem === 'metric';
              const activeAmount = isMetricMode
                ? row.metricAmount
                : row.imperialAmount;
              const activeUnit = isMetricMode
                ? row.metricUnit
                : row.imperialUnit;

              const baseOptions = isMetricMode
                ? METRIC_UNIT_OPTIONS
                : IMPERIAL_UNIT_OPTIONS;
              const unitOptions = baseOptions.includes(activeUnit)
                ? baseOptions
                : [activeUnit, ...baseOptions].filter(Boolean);

              const updateRowWithAutoConversion = (
                nextAmount: number,
                nextUnit: string
              ) => {
                setIngredients((prev) =>
                  prev.map((item, i) => {
                    if (i !== idx) return item;
                    if (isMetricMode) {
                      const converted = convertMetricToImperial(
                        nextAmount,
                        nextUnit
                      );
                      return {
                        ...item,
                        metricAmount: nextAmount,
                        metricUnit: nextUnit,
                        imperialAmount: converted.amount,
                        imperialUnit: converted.unit,
                      };
                    }
                    const converted = convertImperialToMetric(
                      nextAmount,
                      nextUnit
                    );
                    return {
                      ...item,
                      imperialAmount: nextAmount,
                      imperialUnit: nextUnit,
                      metricAmount: converted.amount,
                      metricUnit: converted.unit,
                    };
                  })
                );
              };

              return (
                <div
                  key={row.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end p-3 bg-[var(--bg-paper)] border border-[var(--border-subtle)]"
                >
                  <div className="sm:col-span-6">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      {t.recipeIngredientsSection} #{idx + 1}
                    </label>
                    <input
                      type="text"
                      required
                      value={row.name}
                      placeholder={t.ingredientNamePlaceholder}
                      onChange={(e) =>
                        setIngredients((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, name: e.target.value } : item
                          )
                        )
                      }
                      className="w-full px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      {isMetricMode ? t.metricAmountLabel : t.imperialAmountLabel}
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0.1"
                      value={activeAmount}
                      onChange={(e) =>
                        updateRowWithAutoConversion(
                          Number(e.target.value),
                          activeUnit
                        )
                      }
                      className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-line)] text-xs font-mono tabular-nums text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      {isMetricMode ? t.metricUnitLabel : t.imperialUnitLabel}
                    </label>
                    <select
                      value={activeUnit}
                      onChange={(e) =>
                        updateRowWithAutoConversion(activeAmount, e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-line)] text-xs font-mono text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
                    >
                      {unitOptions.map((unitOpt) => (
                        <option key={unitOpt} value={unitOpt}>
                          {getLocalizedUnitLabel(unitOpt, lang)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      disabled={ingredients.length <= 1}
                      onClick={() =>
                        setIngredients((prev) =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                      aria-label={t.deleteBtn}
                      className="p-2 border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--accent-secondary)] disabled:opacity-35 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Preparation Steps */}
        <section className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-3">
            <h2 className="font-display text-2xl text-[var(--text-ink)]">
              {t.recipeStepsSection}
            </h2>
            <button
              type="button"
              disabled={steps.length >= 15}
              onClick={() => setSteps((prev) => [...prev, makeEmptyStep()])}
              className="px-3 py-1.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] cursor-pointer disabled:opacity-40 whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              {t.addStepBtn}
            </button>
          </div>

          <div className="space-y-4">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="p-4 bg-[var(--bg-paper)] border border-[var(--border-subtle)] space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-[var(--accent-secondary)] tabular-nums">
                    {t.stepLabel(idx + 1)}
                  </span>
                  <button
                    type="button"
                    disabled={steps.length <= 1}
                    onClick={() =>
                      setSteps((prev) => prev.filter((_, i) => i !== idx))
                    }
                    aria-label={t.deleteBtn}
                    className="p-1.5 border border-[var(--border-line)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--accent-secondary)] disabled:opacity-35 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      {t.stepTitleLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={st.title}
                      onChange={(e) =>
                        setSteps((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, title: e.target.value } : item
                          )
                        )
                      }
                      className="w-full px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-line)] text-sm font-display text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      {t.stepTimerMinutesLabel}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={360}
                      value={st.timerMinutes}
                      onChange={(e) =>
                        setSteps((prev) =>
                          prev.map((item, i) =>
                            i === idx
                              ? { ...item, timerMinutes: Number(e.target.value) }
                              : item
                          )
                        )
                      }
                      className="w-full px-2.5 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-line)] text-xs font-mono tabular-nums text-[var(--text-ink)]"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      {t.stepTimerLabelField}
                    </label>
                    <input
                      type="text"
                      value={st.timerLabel}
                      onChange={(e) =>
                        setSteps((prev) =>
                          prev.map((item, i) =>
                            i === idx
                              ? { ...item, timerLabel: e.target.value }
                              : item
                          )
                        )
                      }
                      className="w-full px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-line)] text-xs font-serif text-[var(--text-ink)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    {t.stepInstructionLabel}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={st.instruction}
                    onChange={(e) =>
                      setSteps((prev) =>
                        prev.map((item, i) =>
                          i === idx
                            ? { ...item, instruction: e.target.value }
                            : item
                        )
                      )
                    }
                    className="w-full p-2.5 bg-[var(--bg-surface)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      {t.stepTipLabel}
                    </label>
                    <input
                      type="text"
                      value={st.tip}
                      onChange={(e) =>
                        setSteps((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, tip: e.target.value } : item
                          )
                        )
                      }
                      className="w-full px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-line)] text-xs font-serif italic text-[var(--text-ink)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      {t.stepVideoUrlLabel}
                    </label>
                    <input
                      type="url"
                      value={st.videoUrl}
                      placeholder={t.stepVideoUrlPlaceholder}
                      onChange={(e) =>
                        setSteps((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, videoUrl: e.target.value } : item
                          )
                        )
                      }
                      className="w-full px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-line)] text-xs font-mono text-[var(--text-ink)] focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                    {st.videoUrl.trim() && !isValidOptionalYouTubeUrl(st.videoUrl) && (
                      <p className="mt-1 text-[11px] font-serif text-[var(--accent-secondary)]">
                        {t.invalidYouTubeUrlError(idx + 1)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {error && (
          <p className="p-3.5 border border-[var(--accent-secondary)] bg-[var(--accent-soft)] text-xs font-serif text-[var(--accent-secondary)]">
            {error}
          </p>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[var(--border-line)] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t.backToMyRecipes}
          </button>

          <div className="flex flex-wrap items-center gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    void handleSave(
                      currentStatus === 'draft' ? 'published' : 'draft'
                    )
                  }
                  className="px-4 py-2.5 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  {currentStatus === 'draft' ? (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      {t.saveAndPublishBtn}
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      {t.saveDraftBtn}
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-2 hover:opacity-90 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                  {t.saveRecipeChangesBtn}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleSave('draft')}
                  className="px-4 py-2.5 border border-[var(--border-line)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  {t.saveDraftBtn}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleSave('published')}
                  className="px-5 py-2.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-2 hover:opacity-90 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {t.saveAndPublishBtn}
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
