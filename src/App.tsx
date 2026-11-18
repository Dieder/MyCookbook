import { useCallback, useEffect, useMemo, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { BookOpen, CalendarDays, Home, LayoutGrid, ShoppingBasket } from 'lucide-react';
import { AdminPage } from './components/AdminPage';
import { AskRecipeModal } from './components/AskRecipeModal';
import { BookCoverFrontispiece } from './components/BookCoverFrontispiece';
import { BookSpreadView } from './components/BookSpreadView';
import { CalendarPage } from './components/CalendarPage';
import { ChapterEditorPage } from './components/ChapterEditorPage';
import { ChaptersGallery } from './components/ChaptersGallery';
import { CookModeOverlay } from './components/CookModeOverlay';
import { CustomizeRecipeModal } from './components/CustomizeRecipeModal';
import { MyRecipesPage } from './components/MyRecipesPage';
import { OfflineIndicator } from './components/OfflineIndicator';
import { RecipeCardsIndex } from './components/RecipeCardsIndex';
import { RecipeEditorPage } from './components/RecipeEditorPage';
import { SettingsPage } from './components/SettingsPage';
import { ShoppingListPage } from './components/ShoppingListPage';
import { TechniquePlayerModal } from './components/TechniquePlayerModal';
import { TimerDock } from './components/TimerDock';
import { TopNavBar } from './components/TopNavBar';
import { RECIPES as CURATED_RECIPES } from './data/cookbookData';
import { useCookTimers } from './hooks/useCookTimers';
import { localizeRecipe } from './i18n/curatedRecipesI18n';
import {
  CHAPTERS_I18N,
  THEME_OPTIONS,
  UI_STRINGS,
  getLocalizedChapters,
} from './i18n/translations';
import { auth, googleProvider } from './lib/firebase';
import {
  deleteCalendarEntryFromFirestore,
  formatCalendarDocId,
  subscribeUserCalendar,
  swapCalendarEntryInFirestore,
  upsertCalendarEntryInFirestore,
} from './lib/firestoreCalendar';
import {
  adminUpdateUserRole,
  createChapterInFirestore,
  deleteChapterFromFirestore,
  deleteRecipeRating,
  isBootstrappedAdminEmail,
  migrateLegacyChaptersInFirestore,
  requestContributorRights,
  seedDefaultChaptersInFirestore,
  subscribeAllUsers,
  subscribeChapters,
  subscribeCurrentUserProfile,
  subscribeRecipeRatings,
  updateChapterInFirestore,
  upsertRecipeRating,
  upsertUserOnLogin,
} from './lib/firestoreCommunity';
import {
  BookmarkDoc,
  deleteRecipeFromFirestore,
  sanitizeDocId,
  saveRecipeToFirestore,
  subscribePublishedRecipes,
  subscribeUserBookmarks,
  subscribeUserRecipes,
  updateRecipeInFirestore,
  updateRecipeStatusInFirestore,
  upsertBookmarkInFirestore,
} from './lib/firestoreRecipes';
import {
  BookView,
  Chapter,
  ContributorRequestStatus,
  LanguageCode,
  MealCalendarEntry,
  MealSlot,
  Recipe,
  RecipeStatus,
  RecipeRating,
  ShoppingDateWindow,
  TechniqueClip,
  ThemeId,
  UnitSystem,
  UserProfile,
  UserRole,
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
  chaptersTaxonomySeeded: 'maison_feuille_chapters_taxonomy_v2',
  shoppingChecked: 'maison_feuille_shopping_checked_v1',
  shoppingWindow: 'maison_feuille_shopping_window_v1',
};

const LEGACY_CHAPTER_IDS = ['hearth-harvest', 'coastal-market', 'orchard-patisserie'];

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

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  const [language, setLanguage] = useState<LanguageCode>(() => {
    const stored = readStorage<LanguageCode>(STORAGE_KEYS.language, 'en');
    return stored in UI_STRINGS ? stored : 'en';
  });
  const [theme, setTheme] = useState<ThemeId>(() => {
    const stored = readStorage<ThemeId>(STORAGE_KEYS.theme, 'classic');
    return THEME_OPTIONS.includes(stored) ? stored : 'classic';
  });

  const t = UI_STRINGS[language];

  const [activeView, setActiveView] = useState<BookView>('cover');
  const [galleryChapterId, setGalleryChapterId] = useState<string>('all');
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapterEditorParentId, setChapterEditorParentId] = useState<string | undefined>(undefined);
  const [chapterEditorSubMode, setChapterEditorSubMode] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [activeRecipeId, setActiveRecipeId] = useState<string>(CURATED_RECIPES[0].id);
  const [cookModeRecipeId, setCookModeRecipeId] = useState<string | null>(null);
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [customizeModalOpen, setCustomizeModalOpen] = useState(false);
  const [clipModal, setClipModal] = useState<{
    clip: TechniqueClip;
    recipeTitle: string;
  } | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const [cloudChapters, setCloudChapters] = useState<Chapter[] | null>(null);
  const [publishedCloudRecipes, setPublishedCloudRecipes] = useState<Recipe[]>([]);
  const [cloudRecipes, setCloudRecipes] = useState<Recipe[]>([]);
  const [cloudBookmarks, setCloudBookmarks] = useState<BookmarkDoc[]>([]);
  const [calendarEntries, setCalendarEntries] = useState<MealCalendarEntry[]>([]);
  const [activeRecipeRatings, setActiveRecipeRatings] = useState<RecipeRating[]>([]);
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
  const [shoppingCheckedKeys, setShoppingCheckedKeys] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.shoppingChecked, [])
  );
  const [shoppingWindow, setShoppingWindow] = useState<ShoppingDateWindow>(() => {
    const stored = readStorage<ShoppingDateWindow>(STORAGE_KEYS.shoppingWindow, '7d');
    return stored === '7d' || stored === '14d' || stored === 'month' ? stored : '7d';
  });

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

  const isAdmin = useMemo(() => {
    return (
      isBootstrappedAdminEmail(user?.email) || userProfile?.role === 'admin'
    );
  }, [user?.email, userProfile?.role]);

  const canContribute = useMemo(() => {
    return isAdmin || userProfile?.role === 'contributor';
  }, [isAdmin, userProfile?.role]);

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
      if (firebaseUser) {
        void upsertUserOnLogin(firebaseUser).catch((err) => {
          console.error('Failed storing user login record:', err);
        });
      } else {
        setUserProfile(null);
        setAllUsers([]);
      }
    });
    return () => unsub();
  }, []);

  // Subscribe to public chapters & published community/contributor recipes
  useEffect(() => {
    const unsubChapters = subscribeChapters(
      (items) => setCloudChapters(items),
      (err) => console.error('Chapters sync error:', err)
    );
    const unsubPublished = subscribePublishedRecipes(
      (items) => setPublishedCloudRecipes(items),
      (err) => console.error('Published recipes sync error:', err)
    );
    return () => {
      unsubChapters();
      unsubPublished();
    };
  }, []);

  // Migrate legacy 3-chapter docs or seed new chapters + subchapters once for admin
  useEffect(() => {
    if (!isAdmin || cloudChapters === null) return;
    if (readStorage<boolean>(STORAGE_KEYS.chaptersTaxonomySeeded, false)) return;

    const onlyLegacyOrEmpty =
      cloudChapters.length === 0 ||
      cloudChapters.every((ch) => LEGACY_CHAPTER_IDS.includes(ch.id));
    if (!onlyLegacyOrEmpty) {
      try {
        localStorage.setItem(
          STORAGE_KEYS.chaptersTaxonomySeeded,
          JSON.stringify(true)
        );
      } catch {
        // Ignore storage errors
      }
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEYS.chaptersTaxonomySeeded,
        JSON.stringify(true)
      );
    } catch {
      // Ignore storage errors
    }

    const legacyToRemove = cloudChapters
      .map((c) => c.id)
      .filter((id) => LEGACY_CHAPTER_IDS.includes(id));

    void migrateLegacyChaptersInFirestore(
      CHAPTERS_I18N.en,
      legacyToRemove
    ).catch((err) => {
      console.error('Failed migrating chapters & subchapters:', err);
    });
  }, [isAdmin, cloudChapters]);

  // Subscribe to signed-in user's profile, recipes, bookmarks, and meal calendar
  useEffect(() => {
    if (!authReady || !user) {
      setCloudRecipes([]);
      setCloudBookmarks([]);
      setCalendarEntries([]);
      return;
    }

    const unsubProfile = subscribeCurrentUserProfile(
      user.uid,
      (profile) => setUserProfile(profile),
      (err) => console.error('User profile sync error:', err)
    );

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

    const unsubCalendar = subscribeUserCalendar(
      user.uid,
      (items) => setCalendarEntries(items),
      (err) => console.error('Calendar sync error:', err)
    );

    return () => {
      unsubProfile();
      unsubRecipes();
      unsubBookmarks();
      unsubCalendar();
    };
  }, [authReady, user]);

  // Subscribe to all users for admin desk
  useEffect(() => {
    if (!authReady || !user || !isAdmin) {
      setAllUsers([]);
      return;
    }
    const unsub = subscribeAllUsers(
      (usersList) => setAllUsers(usersList),
      (err) => console.error('Admin users sync error:', err)
    );
    return () => unsub();
  }, [authReady, user, isAdmin]);

  // Auto-upload any locally created drafts once the user has contributor/admin rights
  useEffect(() => {
    if (!user || !canContribute || localDraftRecipes.length === 0) return;
    let cancelled = false;
    (async () => {
      for (const draft of localDraftRecipes) {
        if (cancelled) return;
        try {
          const sourceType =
            draft.sourceType === 'ai-customized'
              ? 'ai-customized'
              : draft.sourceType === 'contributor'
              ? 'contributor'
              : 'ai-generated';
          await saveRecipeToFirestore(
            user.uid,
            draft,
            sourceType,
            draft.status === 'draft' ? 'draft' : 'published'
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
  }, [user, canContribute, localDraftRecipes, showToast, t.toastMigratedCloud]);

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

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.shoppingChecked,
        JSON.stringify(shoppingCheckedKeys)
      );
    } catch {
      // Ignore storage errors
    }
  }, [shoppingCheckedKeys]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.shoppingWindow,
        JSON.stringify(shoppingWindow)
      );
    } catch {
      // Ignore storage errors
    }
  }, [shoppingWindow]);

  // Resolve effective chapters (Firestore chapters when seeded/managed, localized if untouched defaults)
  const activeChapters = useMemo(() => {
    const localizedDefaults = getLocalizedChapters(language);
    if (!cloudChapters || cloudChapters.length === 0) {
      if (
        cloudChapters !== null &&
        readStorage<boolean>(STORAGE_KEYS.chaptersTaxonomySeeded, false)
      ) {
        return [];
      }
      return localizedDefaults;
    }

    const onlyLegacyDocs =
      cloudChapters.every((c) => LEGACY_CHAPTER_IDS.includes(c.id)) &&
      !readStorage<boolean>(STORAGE_KEYS.chaptersTaxonomySeeded, false);
    if (onlyLegacyDocs) {
      return localizedDefaults;
    }

    return cloudChapters.map((ch) => {
      const enDefault = CHAPTERS_I18N.en.find((d) => d.id === ch.id);
      const locDefault = localizedDefaults.find((d) => d.id === ch.id);
      if (
        enDefault &&
        locDefault &&
        ch.title === enDefault.title &&
        ch.seasonNote === enDefault.seasonNote &&
        ch.epigraph === enDefault.epigraph
      ) {
        return {
          ...locDefault,
          parentChapterId: ch.parentChapterId,
          sortOrder: ch.sortOrder,
        };
      }
      return ch;
    });
  }, [cloudChapters, language]);

  // Merge curated plates (localized to active language) with published community recipes
  // plus the signed-in user's own recipes (including unpublished drafts, never visible to others)
  const allRecipes = useMemo(() => {
    const customPoolMap = new Map<string, Recipe>();
    for (const r of publishedCloudRecipes) {
      customPoolMap.set(r.id, r);
    }
    if (user) {
      for (const r of cloudRecipes) {
        customPoolMap.set(r.id, r);
      }
    }
    for (const r of localDraftRecipes) {
      if (!customPoolMap.has(r.id)) {
        customPoolMap.set(r.id, r);
      }
    }
    const customPool = Array.from(customPoolMap.values());
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
  }, [publishedCloudRecipes, cloudRecipes, user, localDraftRecipes, language]);

  const myManagedRecipes = useMemo(() => {
    if (!user) return localDraftRecipes;
    const map = new Map<string, Recipe>();
    for (const r of cloudRecipes) {
      map.set(r.id, r);
    }
    for (const r of localDraftRecipes) {
      if (!map.has(r.id)) {
        map.set(r.id, r);
      }
    }
    return Array.from(map.values());
  }, [user, cloudRecipes, localDraftRecipes]);

  const activeRecipe =
    allRecipes.find((r) => r.id === activeRecipeId) ??
    myManagedRecipes.find((r) => r.id === activeRecipeId) ??
    allRecipes[0];

  // Subscribe to ratings & quoted one-liner notes for the active recipe
  useEffect(() => {
    if (!activeRecipe?.id) {
      setActiveRecipeRatings([]);
      return;
    }
    const unsub = subscribeRecipeRatings(
      activeRecipe.id,
      (items) => setActiveRecipeRatings(items),
      (err) => console.error('Recipe ratings sync error:', err)
    );
    return () => unsub();
  }, [activeRecipe?.id]);

  const handleSignIn = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      if (cred.user) {
        await upsertUserOnLogin(cred.user);
      }
      showToast(t.toastSignedIn);
    } catch (err) {
      console.error('Sign in failed:', err);
      showToast(t.toastSignInFailed);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      if (activeRecipe?.status === 'draft') {
        setActiveRecipeId(CURATED_RECIPES[0].id);
      }
      if (
        activeView === 'admin' ||
        activeView === 'chapter-editor' ||
        activeView === 'my-recipes' ||
        activeView === 'recipe-editor' ||
        (activeView === 'spread' && activeRecipe?.status === 'draft')
      ) {
        setEditingChapter(null);
        setEditingRecipe(null);
        setActiveView('cover');
      }
      showToast(t.toastSignedOut);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const handleRequestContributor = async (note: string) => {
    if (!user) return;
    await requestContributorRights(user.uid, note);
    showToast(t.toastContributorRequested);
  };

  const handleAdminUpdateUserRole = async (
    uid: string,
    role: UserRole,
    status: ContributorRequestStatus
  ) => {
    await adminUpdateUserRole(uid, role, status);
    showToast(t.roleUpdatedToast);
  };

  const markChaptersSeeded = () => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.chaptersTaxonomySeeded,
        JSON.stringify(true)
      );
    } catch {
      // Ignore storage errors
    }
  };

  const ensureParentChapterInFirestore = async (parentId?: string) => {
    if (!cloudChapters || cloudChapters.length === 0) {
      await seedDefaultChaptersInFirestore(CHAPTERS_I18N.en);
      return;
    }
    if (parentId && !cloudChapters.some((c) => c.id === parentId)) {
      const parentSource =
        activeChapters.find((c) => c.id === parentId) ??
        CHAPTERS_I18N.en.find((c) => c.id === parentId);
      if (parentSource) {
        await createChapterInFirestore({
          ...parentSource,
          parentChapterId: undefined,
        });
      }
    }
  };

  const handleCreateChapter = async (chapter: Chapter) => {
    markChaptersSeeded();
    await ensureParentChapterInFirestore(chapter.parentChapterId);
    await createChapterInFirestore(chapter);
    showToast(t.chapterCreatedToast);
  };

  const handleUpdateChapter = async (chapter: Chapter) => {
    markChaptersSeeded();
    await ensureParentChapterInFirestore(chapter.parentChapterId);
    await updateChapterInFirestore(chapter);
    showToast(t.chapterUpdatedToast);
  };

  const handleDeleteChapter = async (chapterId: string) => {
    markChaptersSeeded();
    // Promote any child subchapters to top-level so they are never orphaned
    const childSubchapters = activeChapters.filter(
      (c) => c.parentChapterId === chapterId
    );
    for (const child of childSubchapters) {
      await updateChapterInFirestore({
        ...child,
        parentChapterId: undefined,
      });
    }
    await deleteChapterFromFirestore(chapterId);
    showToast(t.chapterDeletedToast);
  };

  const handleRestoreDefaultChapters = async () => {
    markChaptersSeeded();
    await seedDefaultChaptersInFirestore(CHAPTERS_I18N.en);
    showToast(t.chapterCreatedToast);
  };

  const navigateView = (view: BookView) => {
    if (view === 'chapters') {
      setGalleryChapterId('all');
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openChaptersAt = (chapterId: string) => {
    setGalleryChapterId(chapterId);
    setActiveView('chapters');
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

  const handleSaveRecipeRating = async (
    rating: number,
    note: string,
    existingId?: string
  ) => {
    if (!user) return;
    const authorName =
      userProfile?.displayName ||
      user.displayName ||
      user.email?.split('@')[0] ||
      'Bistro Reader';
    await upsertRecipeRating(
      user.uid,
      authorName,
      activeRecipe.id,
      rating,
      note,
      Boolean(existingId)
    );
    showToast(t.ratingSavedToast);
  };

  const handleDeleteRecipeRating = async (ratingId: string) => {
    await deleteRecipeRating(ratingId);
    showToast(t.ratingDeletedToast);
  };

  const handleAddRecipeToCalendar = async (
    recipe: Recipe,
    dateKey: string,
    mealSlot: MealSlot = 'dinner',
    servings?: number
  ) => {
    if (!user) return;
    const safeRecipeId = sanitizeDocId(recipe.id);
    const baseDocId = formatCalendarDocId(user.uid, dateKey, mealSlot, safeRecipeId);
    const existingExact = calendarEntries.find(
      (entry) =>
        entry.id === baseDocId ||
        (entry.date === dateKey &&
          entry.mealSlot === mealSlot &&
          entry.recipeId === safeRecipeId)
    );
    await upsertCalendarEntryInFirestore(
      user.uid,
      {
        date: dateKey,
        recipeId: safeRecipeId,
        recipeTitle: recipe.title,
        courseId: recipe.chapterId,
        mealSlot,
        servings: servings ?? servingsMap[recipe.id] ?? recipe.baseServings,
      },
      existingExact?.id
    );
    showToast(t.calendarAddedToast);
  };

  const handleSwapCalendarEntry = async (
    entryId: string,
    recipe: Recipe,
    mealSlot: MealSlot,
    servings: number
  ) => {
    if (!user) return;
    const safeRecipeId = sanitizeDocId(recipe.id);
    await swapCalendarEntryInFirestore(entryId, {
      recipeId: safeRecipeId,
      recipeTitle: recipe.title,
      courseId: recipe.chapterId,
      mealSlot,
      servings,
    });
    showToast(t.calendarSwappedToast);
  };

  const handleRemoveCalendarEntry = async (entryId: string) => {
    await deleteCalendarEntryFromFirestore(entryId);
    showToast(t.calendarRemovedToast);
  };

  const toggleShoppingItemChecked = (key: string) => {
    setShoppingCheckedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleUncheckAllShopping = () => {
    setShoppingCheckedKeys([]);
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
      status: 'published',
    };

    if (user && canContribute) {
      await saveRecipeToFirestore(user.uid, newRecipe, 'ai-generated', 'published');
      showToast(t.toastSavedCloud);
    } else {
      setLocalDraftRecipes((prev) => [...prev, newRecipe]);
      showToast(user ? t.contributorRequiredNotice : t.toastSavedLocal);
    }

    setServingsMap((prev) => ({ ...prev, [newId]: newRecipe.baseServings }));
    setActiveRecipeId(newId);
    return newRecipe;
  };

  const handleSaveContributorRecipe = async (
    payload: Omit<Recipe, 'id' | 'plateNumber'>,
    status: RecipeStatus,
    existingRecipe: Recipe | null
  ) => {
    if (!user || !canContribute) return;

    if (existingRecipe) {
      const sourceType =
        existingRecipe.sourceType === 'ai-customized'
          ? 'ai-customized'
          : existingRecipe.sourceType === 'ai-generated'
          ? 'ai-generated'
          : 'contributor';
      const updatedRecipe: Recipe = {
        ...payload,
        id: existingRecipe.id,
        plateNumber: existingRecipe.plateNumber,
        ownerId: existingRecipe.ownerId ?? user.uid,
        sourceType,
        status,
      };
      await updateRecipeInFirestore(user.uid, updatedRecipe, sourceType, status);
      if (existingRecipe.status !== status) {
        showToast(
          status === 'published' ? t.recipePublishedToast : t.recipeUnpublishedToast
        );
      } else {
        showToast(t.recipeUpdatedToast);
      }
      setServingsMap((prev) => ({
        ...prev,
        [updatedRecipe.id]: updatedRecipe.baseServings,
      }));
    } else {
      const newId = sanitizeDocId(
        `recipe-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      );
      const newRecipe: Recipe = {
        ...payload,
        id: newId,
        plateNumber: toPlateNumber(allRecipes.length),
        ownerId: user.uid,
        sourceType: 'contributor',
        status,
      };
      await saveRecipeToFirestore(user.uid, newRecipe, 'contributor', status);
      setServingsMap((prev) => ({ ...prev, [newId]: newRecipe.baseServings }));
      showToast(
        status === 'published' ? t.recipePublishedToast : t.recipeCreatedDraftToast
      );
    }
  };

  const handleToggleRecipePublish = async (
    recipe: Recipe,
    nextStatus: RecipeStatus
  ) => {
    const isCloudRecord = cloudRecipes.some((r) => r.id === recipe.id);
    if (isCloudRecord) {
      await updateRecipeStatusInFirestore(recipe.id, nextStatus);
    } else {
      setLocalDraftRecipes((prev) =>
        prev.map((r) => (r.id === recipe.id ? { ...r, status: nextStatus } : r))
      );
    }
    showToast(
      nextStatus === 'published' ? t.recipePublishedToast : t.recipeUnpublishedToast
    );
  };

  const handleDeleteUnpublishedRecipe = async (recipe: Recipe) => {
    if (recipe.status !== 'draft') return;
    const isCloudRecord = cloudRecipes.some((r) => r.id === recipe.id);
    if (user && canContribute && isCloudRecord) {
      await deleteRecipeFromFirestore(recipe.id);
    } else {
      setLocalDraftRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
    }
    if (activeRecipeId === recipe.id) {
      setActiveRecipeId(CURATED_RECIPES[0].id);
    }
    showToast(t.toastDeleted);
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
        status: 'published',
        parentRecipeId: current.id,
      };
      if (user && canContribute) {
        const existsInCloud = cloudRecipes.some((r) => r.id === customId);
        if (existsInCloud) {
          await updateRecipeInFirestore(
            user.uid,
            customizedRecipe,
            'ai-customized',
            'published'
          );
        } else {
          await saveRecipeToFirestore(
            user.uid,
            customizedRecipe,
            'ai-customized',
            'published'
          );
        }
        showToast(t.toastCustomizedCloud);
      } else {
        setLocalDraftRecipes((prev) => [
          ...prev.filter((r) => r.id !== customId),
          customizedRecipe,
        ]);
        showToast(user ? t.contributorRequiredNotice : t.toastCustomizedLocal);
      }
      setActiveRecipeId(customId);
    } else {
      const nextStatus: RecipeStatus =
        current.status === 'draft' ? 'draft' : 'published';
      const nextSource = current.parentRecipeId
        ? 'ai-customized'
        : current.sourceType === 'contributor'
        ? 'contributor'
        : 'ai-generated';
      const updatedRecipe: Recipe = {
        ...updated,
        id: current.id,
        plateNumber: current.plateNumber,
        sourceType: nextSource,
        status: nextStatus,
        ...(current.parentRecipeId ? { parentRecipeId: current.parentRecipeId } : {}),
      };
      const isCloudRecord = cloudRecipes.some((r) => r.id === current.id);
      if (user && canContribute && isCloudRecord) {
        await updateRecipeInFirestore(
          user.uid,
          updatedRecipe,
          nextSource,
          nextStatus
        );
        showToast(t.toastCustomUpdated);
      } else {
        setLocalDraftRecipes((prev) => [
          ...prev.filter((r) => r.id !== current.id),
          updatedRecipe,
        ]);
        showToast(t.toastCustomizedLocal);
      }
    }
  };

  const handleDeleteOrRevertRecipe = async (recipe: Recipe) => {
    if (!recipe.parentRecipeId && recipe.status !== 'draft') {
      showToast(t.unpublishToDeleteHint);
      return;
    }

    const isCloudRecord = cloudRecipes.some((r) => r.id === recipe.id);
    if (user && canContribute && isCloudRecord) {
      if (recipe.parentRecipeId && recipe.status !== 'draft') {
        await updateRecipeStatusInFirestore(recipe.id, 'draft');
      }
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

  const cookModeRecipe = cookModeRecipeId
    ? allRecipes.find((r) => r.id === cookModeRecipeId) ?? activeRecipe
    : null;

  const runningTimerCount = timers.filter((timer) => timer.status === 'running').length;

  const isLocalDraft = localDraftRecipes.some((r) => r.id === activeRecipe.id);
  const canModifyActiveCloud =
    Boolean(user) &&
    canContribute &&
    (isAdmin || activeRecipe.ownerId === user?.uid);
  const canModifyActive = isLocalDraft || canModifyActiveCloud;

  const canDeleteActive =
    canModifyActive &&
    !activeRecipe.parentRecipeId &&
    activeRecipe.status === 'draft';
  const canRevertActive = canModifyActive && Boolean(activeRecipe.parentRecipeId);

  return (
    <div className="min-h-screen paper-folio flex flex-col">
      <OfflineIndicator lang={language} />

      <TopNavBar
        activeView={activeView}
        onNavigate={navigateView}
        savedCount={favoriteIds.length}
        runningTimerCount={runningTimerCount}
        onOpenCookMode={() => setCookModeRecipeId(activeRecipe.id)}
        canContribute={canContribute}
        isAdmin={isAdmin}
        lang={language}
      />

      {toastNotice && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] px-4 py-2.5 text-xs font-mono border border-[var(--text-ink)]">
          {toastNotice}
        </div>
      )}

      <main className="flex-1">
        {activeView === 'cover' && (
          <BookCoverFrontispiece
            recipes={allRecipes}
            chapters={activeChapters}
            onSelectRecipe={openRecipeSpread}
            onBrowseChapters={() => navigateView('chapters')}
            onSelectChapter={openChaptersAt}
            onOpenAskRecipe={() => setAskModalOpen(true)}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            lang={language}
          />
        )}

        {activeView === 'chapters' && (
          <ChaptersGallery
            recipes={allRecipes}
            chapters={activeChapters}
            initialChapterId={galleryChapterId}
            onSelectRecipe={openRecipeSpread}
            onOpenClip={(clip, recipeTitle) => setClipModal({ clip, recipeTitle })}
            onOpenAskRecipe={() => setAskModalOpen(true)}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            lang={language}
          />
        )}

        {activeView === 'saved' && (
          <ChaptersGallery
            recipes={allRecipes}
            chapters={activeChapters}
            savedOnly
            onSelectRecipe={openRecipeSpread}
            onOpenClip={(clip, recipeTitle) => setClipModal({ clip, recipeTitle })}
            onOpenAskRecipe={() => setAskModalOpen(true)}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onBrowseAll={() => navigateView('chapters')}
            lang={language}
          />
        )}

        {activeView === 'cards' && (
          <RecipeCardsIndex
            recipes={allRecipes}
            chapters={activeChapters}
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
            servingsMap={servingsMap}
            onChangeServings={updateServings}
            lang={language}
          />
        )}

        {activeView === 'spread' && (
          <BookSpreadView
            recipe={activeRecipe}
            allRecipes={allRecipes}
            chapters={activeChapters}
            onSelectRecipe={openRecipeSpread}
            onBackToChapters={() => navigateView('chapters')}
            onSelectChapter={openChaptersAt}
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
            ratings={activeRecipeRatings}
            currentUserUid={user?.uid ?? null}
            onSaveRating={handleSaveRecipeRating}
            onDeleteRating={handleDeleteRecipeRating}
            onAddToCalendar={(dateKey, mealSlot) =>
              handleAddRecipeToCalendar(
                activeRecipe,
                dateKey,
                mealSlot,
                servingsMap[activeRecipe.id] ?? activeRecipe.baseServings
              )
            }
            scheduledEntries={calendarEntries.filter(
              (entry) => entry.recipeId === sanitizeDocId(activeRecipe.id)
            )}
            onRemoveCalendarEntry={handleRemoveCalendarEntry}
            onOpenCalendar={() => navigateView('calendar')}
            onGoToSettings={() => navigateView('settings')}
            lang={language}
          />
        )}

        {activeView === 'calendar' && (
          <CalendarPage
            isSignedIn={Boolean(user)}
            entries={calendarEntries}
            recipes={allRecipes}
            chapters={activeChapters}
            servingsMap={servingsMap}
            onSelectRecipe={openRecipeSpread}
            onSelectChapter={openChaptersAt}
            onAddMealEntry={handleAddRecipeToCalendar}
            onSwapMealEntry={handleSwapCalendarEntry}
            onRemoveEntry={handleRemoveCalendarEntry}
            onOpenShopping={() => navigateView('shopping')}
            onSignIn={() => void handleSignIn()}
            onGoToSettings={() => navigateView('settings')}
            lang={language}
          />
        )}

        {activeView === 'shopping' && (
          <ShoppingListPage
            isSignedIn={Boolean(user)}
            entries={calendarEntries}
            recipes={allRecipes}
            servingsMap={servingsMap}
            unitSystem={unitSystem}
            windowType={shoppingWindow}
            onChangeWindow={setShoppingWindow}
            checkedKeys={shoppingCheckedKeys}
            onToggleChecked={toggleShoppingItemChecked}
            onUncheckAll={handleUncheckAllShopping}
            onOpenCalendar={() => navigateView('calendar')}
            onSelectRecipe={openRecipeSpread}
            onSignIn={() => void handleSignIn()}
            lang={language}
          />
        )}

        {activeView === 'my-recipes' && (
          <MyRecipesPage
            canContribute={canContribute}
            recipes={myManagedRecipes}
            chapters={activeChapters}
            onCreateNew={() => {
              setEditingRecipe(null);
              navigateView('recipe-editor');
            }}
            onOpenAskRecipe={() => setAskModalOpen(true)}
            onEditRecipe={(recipe) => {
              setEditingRecipe(recipe);
              navigateView('recipe-editor');
            }}
            onOpenSpread={openRecipeSpread}
            onTogglePublish={handleToggleRecipePublish}
            onDeleteRecipe={handleDeleteUnpublishedRecipe}
            onGoToSettings={() => navigateView('settings')}
            lang={language}
          />
        )}

        {activeView === 'recipe-editor' && (
          <RecipeEditorPage
            canContribute={canContribute}
            recipe={editingRecipe}
            chapters={activeChapters}
            defaultChefAuthor={
              userProfile?.displayName ||
              user?.displayName ||
              user?.email?.split('@')[0] ||
              'Maison Feuille Contributor'
            }
            unitSystem={unitSystem}
            onSaveRecipe={handleSaveContributorRecipe}
            onBack={() => {
              setEditingRecipe(null);
              navigateView('my-recipes');
            }}
            onGoToSettings={() => navigateView('settings')}
            lang={language}
          />
        )}

        {activeView === 'settings' && (
          <SettingsPage
            user={user}
            userProfile={userProfile}
            isAdmin={isAdmin}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
            onRequestContributor={handleRequestContributor}
            onOpenAdmin={() => navigateView('admin')}
            language={language}
            onChangeLanguage={setLanguage}
            theme={theme}
            onChangeTheme={setTheme}
            unitSystem={unitSystem}
            onChangeUnitSystem={setUnitSystem}
          />
        )}

        {activeView === 'admin' && (
          <AdminPage
            isAdmin={isAdmin}
            users={allUsers}
            chapters={activeChapters}
            onUpdateUserRole={handleAdminUpdateUserRole}
            onAddChapter={() => {
              setEditingChapter(null);
              setChapterEditorParentId(undefined);
              setChapterEditorSubMode(false);
              navigateView('chapter-editor');
            }}
            onAddSubchapter={(parentId) => {
              setEditingChapter(null);
              setChapterEditorParentId(parentId);
              setChapterEditorSubMode(true);
              navigateView('chapter-editor');
            }}
            onEditChapter={(ch) => {
              setEditingChapter(ch);
              setChapterEditorParentId(ch.parentChapterId);
              setChapterEditorSubMode(Boolean(ch.parentChapterId));
              navigateView('chapter-editor');
            }}
            onDeleteChapter={handleDeleteChapter}
            onRestoreDefaultChapters={handleRestoreDefaultChapters}
            onGoToSettings={() => navigateView('settings')}
            lang={language}
          />
        )}

        {activeView === 'chapter-editor' && (
          <ChapterEditorPage
            isAdmin={isAdmin}
            chapter={editingChapter}
            defaultParentChapterId={chapterEditorParentId}
            isSubchapterMode={chapterEditorSubMode}
            existingChapters={activeChapters}
            onCreateChapter={handleCreateChapter}
            onUpdateChapter={handleUpdateChapter}
            onBack={() => {
              setEditingChapter(null);
              setChapterEditorParentId(undefined);
              setChapterEditorSubMode(false);
              navigateView('admin');
            }}
            onGoToSettings={() => navigateView('settings')}
            lang={language}
          />
        )}
      </main>

      <footer className="md:hidden border-t border-[var(--border-line)] bg-[var(--bg-surface)]/90 mt-16">
        <div className="max-w-[1280px] mx-auto px-4 py-3 text-xs text-[var(--text-muted)]">
          {/* Mobile Footer: Borderless pro icons with soft active highlight */}
          <nav
            aria-label="Footer navigation"
            className="flex items-center justify-around gap-1"
          >
            {[
              { id: 'cover' as const, label: t.navCover, Icon: Home },
              { id: 'chapters' as const, label: t.navChapters, Icon: BookOpen },
              { id: 'cards' as const, label: t.navCards, Icon: LayoutGrid },
              { id: 'calendar' as const, label: t.navCalendar, Icon: CalendarDays },
              { id: 'shopping' as const, label: t.navShopping, Icon: ShoppingBasket },
            ].map(({ id, label, Icon }) => {
              const isActive =
                activeView === id || (activeView === 'spread' && id === 'chapters');
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => navigateView(id)}
                  aria-label={label}
                  title={label}
                  className="flex-1 min-h-[44px] inline-flex items-center justify-center cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
                >
                  <span
                    className={`px-4 py-1.5 rounded-full inline-flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]'
                        : 'text-[var(--text-muted)] group-hover:bg-[var(--bg-elevated)] group-hover:text-[var(--text-ink)]'
                    }`}
                  >
                    <Icon
                      className="w-5 h-5"
                      strokeWidth={isActive ? 2.2 : 1.75}
                    />
                  </span>
                </button>
              );
            })}
          </nav>
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
        chapters={activeChapters}
        isSignedIn={Boolean(user)}
        canContribute={canContribute}
        onOpenSettings={() => navigateView('settings')}
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
