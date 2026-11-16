import { useCallback, useEffect, useMemo, useState } from 'react';
import { Globe, Palette } from 'lucide-react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { AskRecipeModal } from './components/AskRecipeModal';
import { BookCoverFrontispiece } from './components/BookCoverFrontispiece';
import { BookSpreadView } from './components/BookSpreadView';
import { ChaptersGallery } from './components/ChaptersGallery';
import { CookModeOverlay } from './components/CookModeOverlay';
import { CustomizeRecipeModal } from './components/CustomizeRecipeModal';
import { RecipeCardsIndex } from './components/RecipeCardsIndex';
import { TechniquePlayerModal } from './components/TechniquePlayerModal';
import { TimerDock } from './components/TimerDock';
import { TopNavBar } from './components/TopNavBar';
import { RECIPES as CURATED_RECIPES } from './data/cookbookData';
import { useCookTimers } from './hooks/useCookTimers';
import { localizeRecipe } from './i18n/curatedRecipesI18n';
import {
  LANGUAGES,
  THEME_OPTIONS,
  UI_STRINGS,
} from './i18n/translations';
import { auth, googleProvider } from './lib/firebase';
import {
  BookmarkDoc,
  deleteRecipeFromFirestore,
  sanitizeDocId,
  saveRecipeToFirestore,
  subscribeUserBookmarks,
  subscribeUserRecipes,
  updateRecipeInFirestore,
  upsertBookmarkInFirestore,
} from './lib/firestoreRecipes';
import {
  BookView,
  LanguageCode,
  Recipe,
  TechniqueClip,
  ThemeId,
  UnitSystem,
} from './types/cookbook';

const STORAGE_KEYS = {
  favorites: 'maison_feuille_favorites_v1',
  servings: 'maison_feuille_servings_v1',
  unit: 'maison_feuille_unit_v1',
  ingredients: 'maison_feuille_checked_ingredients_v1',
  steps: 'maison_feuille_completed_steps_v1',
  notes: 'maison_feuille_notes_v1',
  localRecipes: 'maison_feuille_local_recipes_v1',
  language: 'maison_feuille_language_v1',
  theme: 'maison_feuille_theme_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const ROMAN_NUMERALS = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
  'XIV',
  'XV',
];

function toPlateNumber(index: number): string {
  return `Plate ${ROMAN_NUMERALS[index] || String(index + 1)}`;
}

const THEME_SWATCHES: Record<ThemeId, { paper: string; accent: string }> = {
  whitepaper: { paper: '#FBF9F5', accent: '#14532D' },
  modern: { paper: '#F8FAFC', accent: '#0F172A' },
  colorful: { paper: '#FFF3DA', accent: '#B91C1C' },
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [language, setLanguage] = useState<LanguageCode>(() => {
    const stored = readStorage<LanguageCode>(STORAGE_KEYS.language, 'en');
    return stored in UI_STRINGS ? stored : 'en';
  });
  const [theme, setTheme] = useState<ThemeId>(() => {
    const stored = readStorage<ThemeId>(STORAGE_KEYS.theme, 'whitepaper');
    return THEME_OPTIONS.includes(stored) ? stored : 'whitepaper';
  });

  const t = UI_STRINGS[language];

  const [activeView, setActiveView] = useState<BookView>('cover');
  const [activeRecipeId, setActiveRecipeId] = useState<string>(CURATED_RECIPES[0].id);
  const [cookModeRecipeId, setCookModeRecipeId] = useState<string | null>(null);
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
  const [clipModal, setClipModal] = useState<{
    clip: TechniqueClip;
    recipeTitle: string;
  } | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const [cloudRecipes, setCloudRecipes] = useState<Recipe[]>([]);
  const [cloudBookmarks, setCloudBookmarks] = useState<BookmarkDoc[]>([]);
  const [localDraftRecipes, setLocalDraftRecipes] = useState<Recipe[]>(() =>
    readStorage<Recipe[]>(STORAGE_KEYS.localRecipes, [])
  );

  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.favorites, [
      'duck-confit-cassoulet',
      'poached-pear-frangipane-tart',
    ])
  );
  const [servingsMap, setServingsMap] = useState<Record<string, number>>(() =>
    readStorage<Record<string, number>>(STORAGE_KEYS.servings, {})
  );
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() =>
    readStorage<UnitSystem>(STORAGE_KEYS.unit, 'metric')
  );
  const [checkedIngredientsMap, setCheckedIngredientsMap] = useState<
    Record<string, string[]>
  >(() => readStorage<Record<string, string[]>>(STORAGE_KEYS.ingredients, {}));
  const [completedStepsMap, setCompletedStepsMap] = useState<Record<string, number[]>>(
    () => readStorage<Record<string, number[]>>(STORAGE_KEYS.steps, {})
  );
  const [kitchenNotesMap, setKitchenNotesMap] = useState<Record<string, string>>(() =>
    readStorage<Record<string, string>>(STORAGE_KEYS.notes, {})
  );

  const showToast = useCallback((msg: string) => {
    setToastNotice(msg);
    window.setTimeout(() => setToastNotice(null), 3200);
  }, []);

  const {
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
  } = useCookTimers();

  // Apply theme attribute & document language cleanly
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme));
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_KEYS.language, JSON.stringify(language));
    } catch {
      // Ignore storage errors
    }
  }, [language]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!authReady || !user) {
      setCloudRecipes([]);
      setCloudBookmarks([]);
      return;
    }

    const unsubRecipes = subscribeUserRecipes(
      user.uid,
      (items) => setCloudRecipes(items),
      (err) => console.error('Cloud recipes sync error:', err)
    );
    const unsubBookmarks = subscribeUserBookmarks(
      user.uid,
      (items) => {
        setCloudBookmarks(items);
        const cloudFavs = items.filter((b) => b.isFavorite).map((b) => b.recipeId);
        if (items.length > 0) {
          setFavoriteIds((prev) => Array.from(new Set([...prev, ...cloudFavs])));
          setServingsMap((prev) => {
            const merged = { ...prev };
            for (const b of items) {
              merged[b.recipeId] = b.servings;
            }
            return merged;
          });
          setKitchenNotesMap((prev) => {
            const merged = { ...prev };
            for (const b of items) {
              if (b.kitchenNote) merged[b.recipeId] = b.kitchenNote;
            }
            return merged;
          });
        }
      },
      (err) => console.error('Cloud bookmarks sync error:', err)
    );

    return () => {
      unsubRecipes();
      unsubBookmarks();
    };
  }, [authReady, user]);

  // Auto-upload any locally created drafts once the user signs in
  useEffect(() => {
    if (!user || localDraftRecipes.length === 0) return;
    let cancelled = false;
    (async () => {
      for (const draft of localDraftRecipes) {
        if (cancelled) return;
        try {
          await saveRecipeToFirestore(
            user.uid,
            draft,
            draft.sourceType === 'ai-customized' ? 'ai-customized' : 'ai-generated'
          );
        } catch (err) {
          console.error('Failed migrating draft recipe to cloud:', err);
        }
      }
      if (!cancelled) {
        setLocalDraftRecipes([]);
        localStorage.removeItem(STORAGE_KEYS.localRecipes);
        showToast(t.toastMigratedCloud);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, localDraftRecipes, showToast, t.toastMigratedCloud]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favoriteIds));
    } catch {
      // Ignore storage errors
    }
  }, [favoriteIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.servings, JSON.stringify(servingsMap));
    } catch {
      // Ignore storage errors
    }
  }, [servingsMap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.unit, JSON.stringify(unitSystem));
    } catch {
      // Ignore storage errors
    }
  }, [unitSystem]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.ingredients,
        JSON.stringify(checkedIngredientsMap)
      );
    } catch {
      // Ignore storage errors
    }
  }, [checkedIngredientsMap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.steps, JSON.stringify(completedStepsMap));
    } catch {
      // Ignore storage errors
    }
  }, [completedStepsMap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(kitchenNotesMap));
    } catch {
      // Ignore storage errors
    }
  }, [kitchenNotesMap]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.localRecipes,
        JSON.stringify(localDraftRecipes)
      );
    } catch {
      // Ignore storage errors
    }
  }, [localDraftRecipes]);

  // Merge curated plates (localized to active language) with Firestore + local draft recipes
  const allRecipes = useMemo(() => {
    const customPool = user ? cloudRecipes : localDraftRecipes;
    const customizedByParent = new Map<string, Recipe>();
    const standaloneUserRecipes: Recipe[] = [];

    for (const r of customPool) {
      if (r.parentRecipeId) {
        customizedByParent.set(r.parentRecipeId, r);
      } else {
        standaloneUserRecipes.push(r);
      }
    }

    const baseMerged = CURATED_RECIPES.map((curated) => {
      const override = customizedByParent.get(curated.id);
      if (override) {
        return {
          ...override,
          plateNumber: curated.plateNumber,
        };
      }
      return localizeRecipe({ ...curated, sourceType: 'curated' as const }, language);
    });

    const extras = standaloneUserRecipes.map((r, idx) => ({
      ...r,
      plateNumber: toPlateNumber(baseMerged.length + idx),
    }));

    return [...baseMerged, ...extras];
  }, [user, cloudRecipes, localDraftRecipes, language]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast(t.toastSignedIn);
    } catch (err) {
      console.error('Sign in failed:', err);
      showToast(t.toastSignInFailed);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      showToast(t.toastSignedOut);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const navigateView = (view: BookView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openRecipeSpread = (recipeId: string) => {
    setActiveRecipeId(recipeId);
    setActiveView('spread');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const syncBookmarkToCloud = useCallback(
    async (
      recipeId: string,
      patch: { isFavorite?: boolean; servings?: number; kitchenNote?: string }
    ) => {
      if (!user) return;
      const safeId = sanitizeDocId(recipeId);
      const existing = cloudBookmarks.find((b) => b.recipeId === safeId);
      const targetRecipe = allRecipes.find((r) => r.id === recipeId);
      const nextFav = patch.isFavorite ?? favoriteIds.includes(recipeId);
      const nextServings =
        patch.servings ?? servingsMap[recipeId] ?? targetRecipe?.baseServings ?? 4;
      const nextNote = patch.kitchenNote ?? kitchenNotesMap[recipeId] ?? '';
      try {
        await upsertBookmarkInFirestore(
          user.uid,
          safeId,
          { isFavorite: nextFav, servings: nextServings, kitchenNote: nextNote },
          Boolean(existing)
        );
      } catch (err) {
        console.error('Failed syncing bookmark:', err);
      }
    },
    [user, cloudBookmarks, allRecipes, favoriteIds, servingsMap, kitchenNotesMap]
  );

  const toggleFavorite = (recipeId: string) => {
    const currentlyFav = favoriteIds.includes(recipeId);
    setFavoriteIds((prev) =>
      currentlyFav ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
    void syncBookmarkToCloud(recipeId, { isFavorite: !currentlyFav });
  };

  const updateServings = (recipeId: string, servings: number) => {
    setServingsMap((prev) => ({ ...prev, [recipeId]: servings }));
    void syncBookmarkToCloud(recipeId, { servings });
  };

  const toggleIngredient = (recipeId: string, ingredientId: string) => {
    setCheckedIngredientsMap((prev) => {
      const current = prev[recipeId] ?? [];
      const next = current.includes(ingredientId)
        ? current.filter((id) => id !== ingredientId)
        : [...current, ingredientId];
      return { ...prev, [recipeId]: next };
    });
  };

  const toggleStepComplete = (recipeId: string, stepNumber: number) => {
    setCompletedStepsMap((prev) => {
      const current = prev[recipeId] ?? [];
      const next = current.includes(stepNumber)
        ? current.filter((n) => n !== stepNumber)
        : [...current, stepNumber];
      return { ...prev, [recipeId]: next };
    });
  };

  const saveKitchenNote = (recipeId: string, note: string) => {
    setKitchenNotesMap((prev) => ({ ...prev, [recipeId]: note }));
    void syncBookmarkToCloud(recipeId, { kitchenNote: note });
  };

  const handleCreateRecipe = async (
    generated: Omit<Recipe, 'id' | 'plateNumber'>
  ): Promise<Recipe> => {
    const newId = sanitizeDocId(
      `recipe-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    );
    const newRecipe: Recipe = {
      ...generated,
      id: newId,
      plateNumber: toPlateNumber(allRecipes.length),
      sourceType: 'ai-generated',
    };

    if (user) {
      await saveRecipeToFirestore(user.uid, newRecipe, 'ai-generated');
      showToast(t.toastSavedCloud);
    } else {
      setLocalDraftRecipes((prev) => [...prev, newRecipe]);
      showToast(t.toastSavedLocal);
    }

    setServingsMap((prev) => ({ ...prev, [newId]: newRecipe.baseServings }));
    setActiveRecipeId(newId);
    return newRecipe;
  };

  const handleCustomizeActiveRecipe = async (
    updated: Omit<Recipe, 'id' | 'plateNumber'>
  ) => {
    const current = activeRecipe;
    const isCuratedOriginal = CURATED_RECIPES.some((c) => c.id === current.id);

    if (isCuratedOriginal) {
      const customId = sanitizeDocId(`custom-${current.id}`);
      const customizedRecipe: Recipe = {
        ...updated,
        id: customId,
        plateNumber: current.plateNumber,
        sourceType: 'ai-customized',
        parentRecipeId: current.id,
      };
      if (user) {
        const existsInCloud = cloudRecipes.some((r) => r.id === customId);
        if (existsInCloud) {
          await updateRecipeInFirestore(user.uid, customizedRecipe, 'ai-customized');
        } else {
          await saveRecipeToFirestore(user.uid, customizedRecipe, 'ai-customized');
        }
        showToast(t.toastCustomizedCloud);
      } else {
        setLocalDraftRecipes((prev) => [
          ...prev.filter((r) => r.id !== customId),
          customizedRecipe,
        ]);
        showToast(t.toastCustomizedLocal);
      }
      setActiveRecipeId(customId);
    } else {
      const updatedRecipe: Recipe = {
        ...updated,
        id: current.id,
        plateNumber: current.plateNumber,
        sourceType: current.parentRecipeId ? 'ai-customized' : 'ai-generated',
        ...(current.parentRecipeId ? { parentRecipeId: current.parentRecipeId } : {}),
      };
      if (user) {
        await updateRecipeInFirestore(
          user.uid,
          updatedRecipe,
          updatedRecipe.sourceType === 'ai-customized' ? 'ai-customized' : 'ai-generated'
        );
        showToast(t.toastCustomUpdated);
      } else {
        setLocalDraftRecipes((prev) =>
          prev.map((r) => (r.id === current.id ? updatedRecipe : r))
        );
        showToast(t.toastCustomizedLocal);
      }
    }
  };

  const handleDeleteOrRevertRecipe = async (recipe: Recipe) => {
    if (user) {
      await deleteRecipeFromFirestore(recipe.id);
    } else {
      setLocalDraftRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
    }

    if (recipe.parentRecipeId) {
      setActiveRecipeId(recipe.parentRecipeId);
      showToast(t.toastReverted);
    } else {
      setActiveRecipeId(CURATED_RECIPES[0].id);
      setActiveView('chapters');
      showToast(t.toastDeleted);
    }
  };

  const activeRecipe =
    allRecipes.find((r) => r.id === activeRecipeId) ?? allRecipes[0];

  const cookModeRecipe = cookModeRecipeId
    ? allRecipes.find((r) => r.id === cookModeRecipeId) ?? activeRecipe
    : null;

  const runningTimerCount = timers.filter((timer) => timer.status === 'running').length;

  const canDeleteActive =
    activeRecipe.sourceType === 'ai-generated' && !activeRecipe.parentRecipeId;
  const canRevertActive = Boolean(activeRecipe.parentRecipeId);

  const getThemeLabel = (id: ThemeId) => {
    if (id === 'modern') return t.themeModern;
    if (id === 'colorful') return t.themeColorful;
    return t.themeWhitepaper;
  };

  return (
    <div className="min-h-screen paper-folio flex flex-col">
      <TopNavBar
        activeView={activeView}
        onNavigate={navigateView}
        savedCount={favoriteIds.length}
        runningTimerCount={runningTimerCount}
        onOpenCookMode={() => setCookModeRecipeId(activeRecipe.id)}
        lang={language}
      />

      {/* Non-sticky Edition Preferences Bar: Language & Theme Selection */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/75">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-2.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--text-muted)] mr-1">
              <Globe className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
              {t.languageLabel}
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              aria-label={t.languageLabel}
              className="px-2.5 py-1 text-xs font-mono bg-[var(--bg-paper)] border border-[var(--border-line)] text-[var(--text-ink)] cursor-pointer focus:outline-none focus:border-[var(--accent-primary)]"
            >
              {LANGUAGES.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.shortLabel} · {opt.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--text-muted)] mr-1">
              <Palette className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
              {t.themeLabel}
            </span>
            <div className="inline-flex border border-[var(--border-line)] bg-[var(--bg-paper)]">
              {THEME_OPTIONS.map((themeOption) => {
                const isSelected = theme === themeOption;
                const swatch = THEME_SWATCHES[themeOption];
                return (
                  <button
                    key={themeOption}
                    type="button"
                    onClick={() => setTheme(themeOption)}
                    className={`px-3 py-1 text-xs font-mono inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 border border-black/20 shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${swatch.paper} 50%, ${swatch.accent} 50%)`,
                      }}
                      aria-hidden="true"
                    />
                    {getThemeLabel(themeOption)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {toastNotice && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] px-4 py-2.5 text-xs font-mono border border-[var(--text-ink)]">
          {toastNotice}
        </div>
      )}

      <main className="flex-1">
        {activeView === 'cover' && (
          <BookCoverFrontispiece
            recipes={allRecipes}
            onSelectRecipe={openRecipeSpread}
            onBrowseChapters={() => navigateView('chapters')}
            onOpenAskRecipe={() => setAskModalOpen(true)}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            lang={language}
          />
        )}

        {activeView === 'chapters' && (
          <ChaptersGallery
            recipes={allRecipes}
            onSelectRecipe={openRecipeSpread}
            onOpenClip={(clip, recipeTitle) => setClipModal({ clip, recipeTitle })}
            onOpenAskRecipe={() => setAskModalOpen(true)}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            userEmail={user?.email ?? null}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
            lang={language}
          />
        )}

        {activeView === 'saved' && (
          <ChaptersGallery
            recipes={allRecipes}
            savedOnly
            onSelectRecipe={openRecipeSpread}
            onOpenClip={(clip, recipeTitle) => setClipModal({ clip, recipeTitle })}
            onOpenAskRecipe={() => setAskModalOpen(true)}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onBrowseAll={() => navigateView('chapters')}
            userEmail={user?.email ?? null}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
            lang={language}
          />
        )}

        {activeView === 'cards' && (
          <RecipeCardsIndex
            recipes={allRecipes}
            onSelectRecipe={openRecipeSpread}
            onEnterCookMode={(recipeId) => {
              setActiveRecipeId(recipeId);
              setCookModeRecipeId(recipeId);
            }}
            onOpenClip={(clip, recipeTitle) => setClipModal({ clip, recipeTitle })}
            onOpenAskRecipe={() => setAskModalOpen(true)}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            unitSystem={unitSystem}
            onChangeUnitSystem={setUnitSystem}
            servingsMap={servingsMap}
            onChangeServings={updateServings}
            lang={language}
          />
        )}

        {activeView === 'spread' && (
          <BookSpreadView
            recipe={activeRecipe}
            allRecipes={allRecipes}
            onSelectRecipe={openRecipeSpread}
            onBackToChapters={() => navigateView('chapters')}
            onEnterCookMode={() => setCookModeRecipeId(activeRecipe.id)}
            onOpenClip={(clip, recipeTitle) => setClipModal({ clip, recipeTitle })}
            onOpenCustomize={() => setCustomizeModalOpen(true)}
            onDeleteRecipe={
              canDeleteActive ? () => void handleDeleteOrRevertRecipe(activeRecipe) : undefined
            }
            onRevertCustomization={
              canRevertActive ? () => void handleDeleteOrRevertRecipe(activeRecipe) : undefined
            }
            isFavorite={favoriteIds.includes(activeRecipe.id)}
            onToggleFavorite={() => toggleFavorite(activeRecipe.id)}
            servings={servingsMap[activeRecipe.id] ?? activeRecipe.baseServings}
            onChangeServings={(s) => updateServings(activeRecipe.id, s)}
            unitSystem={unitSystem}
            onChangeUnitSystem={setUnitSystem}
            checkedIngredients={checkedIngredientsMap[activeRecipe.id] ?? []}
            onToggleIngredient={(ingId) => toggleIngredient(activeRecipe.id, ingId)}
            completedSteps={completedStepsMap[activeRecipe.id] ?? []}
            onToggleStepComplete={(stepNum) =>
              toggleStepComplete(activeRecipe.id, stepNum)
            }
            kitchenNote={kitchenNotesMap[activeRecipe.id] ?? ''}
            onSaveKitchenNote={(note) => saveKitchenNote(activeRecipe.id, note)}
            timers={timers}
            onStartTimer={startOrResumeTimer}
            onPauseTimer={pauseTimer}
            onResetTimer={resetTimer}
            onAddMinute={addMinute}
            lang={language}
          />
        )}
      </main>

      <footer className="border-t border-[var(--border-line)] bg-[var(--bg-surface)]/80 mt-16">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-serif text-[var(--text-muted)]">
          <p>{t.footerColophon}</p>
          <div className="flex items-center gap-6 font-mono">
            <button
              type="button"
              onClick={() => navigateView('cover')}
              className="hover:text-[var(--text-ink)] cursor-pointer"
            >
              {t.navCover}
            </button>
            <button
              type="button"
              onClick={() => navigateView('chapters')}
              className="hover:text-[var(--text-ink)] cursor-pointer"
            >
              {t.navChapters}
            </button>
            <button
              type="button"
              onClick={() => navigateView('cards')}
              className="hover:text-[var(--text-ink)] cursor-pointer"
            >
              {t.navCards}
            </button>
          </div>
        </div>
      </footer>

      {cookModeRecipe && (
        <CookModeOverlay
          recipe={cookModeRecipe}
          servings={servingsMap[cookModeRecipe.id] ?? cookModeRecipe.baseServings}
          unitSystem={unitSystem}
          completedSteps={completedStepsMap[cookModeRecipe.id] ?? []}
          onToggleStepComplete={(stepNum) =>
            toggleStepComplete(cookModeRecipe.id, stepNum)
          }
          timers={timers}
          onStartTimer={startOrResumeTimer}
          onPauseTimer={pauseTimer}
          onResetTimer={resetTimer}
          onAddMinute={addMinute}
          onOpenClip={(clip, recipeTitle) => setClipModal({ clip, recipeTitle })}
          onClose={() => setCookModeRecipeId(null)}
          lang={language}
        />
      )}

      <AskRecipeModal
        isOpen={askModalOpen}
        onClose={() => setAskModalOpen(false)}
        onRecipeCreated={handleCreateRecipe}
        onOpenSpread={openRecipeSpread}
        isSignedIn={Boolean(user)}
        onSignIn={handleSignIn}
        lang={language}
      />

      <CustomizeRecipeModal
        recipe={customizeModalOpen ? activeRecipe : null}
        onClose={() => setCustomizeModalOpen(false)}
        onCustomized={handleCustomizeActiveRecipe}
        lang={language}
      />

      <TechniquePlayerModal
        clip={clipModal?.clip ?? null}
        recipeTitle={clipModal?.recipeTitle ?? ''}
        onClose={() => setClipModal(null)}
        lang={language}
      />

      <TimerDock
        timers={timers}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        recentCompletedLabel={recentCompletedLabel}
        onClearCompletedNotice={clearCompletedNotice}
        onPauseTimer={pauseTimer}
        onResumeTimer={(timer) =>
          startOrResumeTimer({
            recipeId: timer.recipeId,
            recipeTitle: timer.recipeTitle,
            stepNumber: timer.stepNumber,
            label: timer.label,
            durationSeconds: timer.totalSeconds,
          })
        }
        onAddMinute={addMinute}
        onDismissTimer={dismissTimer}
        onJumpToRecipe={(recipeId) => {
          setCookModeRecipeId(null);
          openRecipeSpread(recipeId);
        }}
        lang={language}
      />
    </div>
  );
}
