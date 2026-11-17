import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { Recipe, RecipeStatus } from '../types/cookbook';
import { normalizeOptionalYouTubeUrl } from '../utils/youtube';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface BookmarkDoc {
  id: string;
  ownerId: string;
  recipeId: string;
  isFavorite: boolean;
  servings: number;
  kitchenNote: string;
}

export type CloudRecipeSourceType = 'ai-generated' | 'ai-customized' | 'contributor';

export function sanitizeDocId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120) || 'item';
}

function clampNonEmpty(val: string | undefined, fallback: string, maxLen: number): string {
  const trimmed = (val ?? '').trim();
  return (trimmed || fallback).slice(0, maxLen);
}

function buildRecipePayload(
  uid: string,
  recipe: Omit<Recipe, 'id'> & { id?: string },
  sourceType: CloudRecipeSourceType,
  status: RecipeStatus,
  isUpdate: boolean
) {
  const safeTitle = clampNonEmpty(recipe.title, 'Untitled Bistro Plate', 140);
  const safeExcerpt = clampNonEmpty(
    recipe.storyExcerpt,
    recipe.subtitle || safeTitle,
    500
  );
  const cleanParagraphs = (recipe.storyParagraphs || [])
    .map((p) => p.trim().slice(0, 1500))
    .filter(Boolean)
    .slice(0, 4);
  if (cleanParagraphs.length === 0) {
    cleanParagraphs.push(safeExcerpt);
  }

  const payload: Record<string, unknown> = {
    ownerId: uid,
    chapterId: sanitizeDocId(recipe.chapterId || 'dinner').slice(0, 60),
    plateNumber: clampNonEmpty(recipe.plateNumber, 'Plate I', 32),
    title: safeTitle,
    subtitle: clampNonEmpty(recipe.subtitle, safeTitle, 240),
    region: clampNonEmpty(recipe.region, 'Paris', 80),
    season: clampNonEmpty(recipe.season, 'All Seasons', 40),
    prepMinutes: Math.max(0, Math.min(1440, Math.round(Number(recipe.prepMinutes) || 0))),
    cookMinutes: Math.max(0, Math.min(1440, Math.round(Number(recipe.cookMinutes) || 0))),
    baseServings: Math.max(1, Math.min(48, Math.round(Number(recipe.baseServings) || 4))),
    heroImage: (() => {
      const candidate = (recipe.heroImage ?? '').trim();
      const validPrefix =
        candidate.startsWith('/src/assets/images/') ||
        candidate.startsWith('data:image/') ||
        candidate.startsWith('https://');
      if (validPrefix && candidate.length >= 1 && candidate.length <= 250000) {
        return candidate;
      }
      return '/src/assets/images/recipe_duck_confit_cassoulet_1794869454292.jpg';
    })(),
    figureCaption: clampNonEmpty(recipe.figureCaption, safeTitle, 260),
    storyExcerpt: safeExcerpt,
    storyParagraphs: cleanParagraphs,
    pullQuote: clampNonEmpty(
      recipe.pullQuote,
      `“${safeTitle}, prepared with patience and care.”`,
      360
    ),
    pairingNote: clampNonEmpty(
      recipe.pairingNote,
      'Serve warm at the table with a seasonal pairing.',
      360
    ),
    chefAuthor: clampNonEmpty(recipe.chefAuthor, 'Maison Feuille Contributor', 100),
    ingredients: recipe.ingredients.slice(0, 30),
    techniques: (recipe.techniques || []).slice(0, 4),
    steps: recipe.steps.slice(0, 15).map((step, idx) => {
      const sanitizedStep: Record<string, unknown> = {
        stepNumber: Number(step.stepNumber) || idx + 1,
        title: clampNonEmpty(step.title, `Step ${idx + 1}`, 120),
        instruction: clampNonEmpty(step.instruction, step.title || `Step ${idx + 1}`, 800),
      };
      if (typeof step.durationSeconds === 'number' && step.durationSeconds > 0) {
        sanitizedStep.durationSeconds = Math.round(step.durationSeconds);
      }
      if (step.timerLabel && step.timerLabel.trim()) {
        sanitizedStep.timerLabel = step.timerLabel.trim().slice(0, 80);
      }
      if (step.tip && step.tip.trim()) {
        sanitizedStep.tip = step.tip.trim().slice(0, 260);
      }
      if (step.techniqueClipId && step.techniqueClipId.trim()) {
        sanitizedStep.techniqueClipId = step.techniqueClipId.trim().slice(0, 80);
      }
      const cleanVideoUrl = normalizeOptionalYouTubeUrl(step.videoUrl);
      if (cleanVideoUrl) {
        sanitizedStep.videoUrl = cleanVideoUrl;
      }
      return sanitizedStep;
    }),
    sourceType,
    status: status === 'draft' ? 'draft' : 'published',
    updatedAt: serverTimestamp(),
  };

  if (recipe.parentRecipeId) {
    payload.parentRecipeId = sanitizeDocId(recipe.parentRecipeId);
  }
  if (recipe.customizationNote) {
    payload.customizationNote = recipe.customizationNote.slice(0, 400);
  }
  if (!isUpdate) {
    payload.createdAt = serverTimestamp();
  }

  return payload;
}

function mapSnapshotDocToRecipe(d: { id: string; data: () => Record<string, unknown> }, fallbackUid?: string): Recipe {
  const data = d.data();
  return {
    id: d.id,
    ownerId: String(data.ownerId || fallbackUid || ''),
    chapterId: String(data.chapterId || 'dinner'),
    plateNumber: String(data.plateNumber || 'Plate I'),
    title: String(data.title || 'Untitled Recipe'),
    subtitle: String(data.subtitle || ''),
    region: String(data.region || 'Paris'),
    season: String(data.season || 'All Seasons'),
    prepMinutes: Number(data.prepMinutes ?? 15),
    cookMinutes: Number(data.cookMinutes ?? 20),
    baseServings: Number(data.baseServings ?? 4),
    heroImage: String(data.heroImage || '/src/assets/images/recipe_duck_confit_cassoulet_1794869454292.jpg'),
    figureCaption: String(data.figureCaption || ''),
    storyExcerpt: String(data.storyExcerpt || ''),
    storyParagraphs: Array.isArray(data.storyParagraphs)
      ? (data.storyParagraphs as string[])
      : [],
    pullQuote: String(data.pullQuote || ''),
    pairingNote: String(data.pairingNote || ''),
    chefAuthor: String(data.chefAuthor || 'Maison Feuille Contributor'),
    ingredients: Array.isArray(data.ingredients)
      ? (data.ingredients as Recipe['ingredients'])
      : [],
    techniques: Array.isArray(data.techniques)
      ? (data.techniques as Recipe['techniques'])
      : [],
    steps: Array.isArray(data.steps) ? (data.steps as Recipe['steps']) : [],
    sourceType: (data.sourceType as Recipe['sourceType']) || 'contributor',
    status: data.status === 'draft' ? 'draft' : 'published',
    parentRecipeId: data.parentRecipeId ? String(data.parentRecipeId) : undefined,
    customizationNote: data.customizationNote ? String(data.customizationNote) : undefined,
  };
}

export function subscribePublishedRecipes(
  onData: (recipes: Recipe[]) => void,
  onError: (err: Error) => void
) {
  const q = query(collection(db, 'recipes'), where('status', '==', 'published'));
  return onSnapshot(
    q,
    (snapshot) => {
      onData(snapshot.docs.map((d) => mapSnapshotDocToRecipe(d)));
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'recipes');
      } catch (wrapped) {
        onError(wrapped as Error);
      }
    }
  );
}

export function subscribeUserRecipes(
  uid: string,
  onData: (recipes: Recipe[]) => void,
  onError: (err: Error) => void
) {
  const q = query(collection(db, 'recipes'), where('ownerId', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      onData(snapshot.docs.map((d) => mapSnapshotDocToRecipe(d, uid)));
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'recipes');
      } catch (wrapped) {
        onError(wrapped as Error);
      }
    }
  );
}

export function subscribeUserBookmarks(
  uid: string,
  onData: (bookmarks: BookmarkDoc[]) => void,
  onError: (err: Error) => void
) {
  const q = query(collection(db, 'bookmarks'), where('ownerId', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: BookmarkDoc[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ownerId: String(data.ownerId || uid),
          recipeId: String(data.recipeId),
          isFavorite: Boolean(data.isFavorite),
          servings: Number(data.servings) || 4,
          kitchenNote: String(data.kitchenNote || ''),
        };
      });
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'bookmarks');
      } catch (wrapped) {
        onError(wrapped as Error);
      }
    }
  );
}

export async function saveRecipeToFirestore(
  uid: string,
  recipe: Recipe,
  sourceType: CloudRecipeSourceType,
  status: RecipeStatus = 'published'
): Promise<void> {
  const safeId = sanitizeDocId(recipe.id);
  const path = `recipes/${safeId}`;
  try {
    const payload = buildRecipePayload(uid, recipe, sourceType, status, false);
    await setDoc(doc(db, 'recipes', safeId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateRecipeInFirestore(
  uid: string,
  recipe: Recipe,
  sourceType: CloudRecipeSourceType,
  status: RecipeStatus = recipe.status ?? 'published'
): Promise<void> {
  const safeId = sanitizeDocId(recipe.id);
  const path = `recipes/${safeId}`;
  try {
    const payload = buildRecipePayload(uid, recipe, sourceType, status, true);
    delete payload.ownerId;
    delete payload.parentRecipeId;
    await updateDoc(doc(db, 'recipes', safeId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateRecipeStatusInFirestore(
  recipeId: string,
  status: RecipeStatus
): Promise<void> {
  const safeId = sanitizeDocId(recipeId);
  const path = `recipes/${safeId}`;
  try {
    await updateDoc(doc(db, 'recipes', safeId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteRecipeFromFirestore(recipeId: string): Promise<void> {
  const safeId = sanitizeDocId(recipeId);
  const path = `recipes/${safeId}`;
  try {
    await deleteDoc(doc(db, 'recipes', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function upsertBookmarkInFirestore(
  uid: string,
  recipeId: string,
  data: { isFavorite: boolean; servings: number; kitchenNote: string },
  existsInCloud: boolean
): Promise<void> {
  const safeRecipeId = sanitizeDocId(recipeId);
  const docId = sanitizeDocId(`${uid}_${safeRecipeId}`);
  const path = `bookmarks/${docId}`;
  const clampedServings = Math.max(1, Math.min(48, Math.round(data.servings)));
  const clampedNote = data.kitchenNote.slice(0, 1200);

  try {
    if (existsInCloud) {
      await updateDoc(doc(db, 'bookmarks', docId), {
        isFavorite: data.isFavorite,
        servings: clampedServings,
        kitchenNote: clampedNote,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(doc(db, 'bookmarks', docId), {
        ownerId: uid,
        recipeId: safeRecipeId,
        isFavorite: data.isFavorite,
        servings: clampedServings,
        kitchenNote: clampedNote,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, existsInCloud ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}
