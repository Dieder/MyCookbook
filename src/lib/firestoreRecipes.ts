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
import { Recipe } from '../types/cookbook';

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

export function sanitizeDocId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120) || 'item';
}

function buildRecipePayload(
  uid: string,
  recipe: Omit<Recipe, 'id'> & { id?: string },
  sourceType: 'ai-generated' | 'ai-customized',
  isUpdate: boolean
) {
  const payload: Record<string, unknown> = {
    ownerId: uid,
    chapterId: recipe.chapterId,
    plateNumber: recipe.plateNumber.slice(0, 32),
    title: recipe.title.slice(0, 140),
    subtitle: recipe.subtitle.slice(0, 240),
    region: recipe.region.slice(0, 80),
    season: recipe.season.slice(0, 40),
    prepMinutes: Math.max(0, Math.min(1440, Math.round(recipe.prepMinutes))),
    cookMinutes: Math.max(0, Math.min(1440, Math.round(recipe.cookMinutes))),
    baseServings: Math.max(1, Math.min(48, Math.round(recipe.baseServings))),
    heroImage: recipe.heroImage.slice(0, 300),
    figureCaption: recipe.figureCaption.slice(0, 260),
    storyExcerpt: recipe.storyExcerpt.slice(0, 500),
    storyParagraphs: recipe.storyParagraphs.slice(0, 4).map((p) => p.slice(0, 1500)),
    pullQuote: recipe.pullQuote.slice(0, 360),
    pairingNote: recipe.pairingNote.slice(0, 360),
    chefAuthor: recipe.chefAuthor.slice(0, 100),
    ingredients: recipe.ingredients.slice(0, 30),
    techniques: recipe.techniques.slice(0, 4),
    steps: recipe.steps.slice(0, 15),
    sourceType,
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

export function subscribeUserRecipes(
  uid: string,
  onData: (recipes: Recipe[]) => void,
  onError: (err: Error) => void
) {
  const q = query(collection(db, 'recipes'), where('ownerId', '==', uid));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Recipe[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ownerId: String(data.ownerId || uid),
          chapterId: data.chapterId,
          plateNumber: data.plateNumber,
          title: data.title,
          subtitle: data.subtitle,
          region: data.region,
          season: data.season,
          prepMinutes: data.prepMinutes,
          cookMinutes: data.cookMinutes,
          baseServings: data.baseServings,
          heroImage: data.heroImage,
          figureCaption: data.figureCaption,
          storyExcerpt: data.storyExcerpt,
          storyParagraphs: data.storyParagraphs || [],
          pullQuote: data.pullQuote,
          pairingNote: data.pairingNote,
          chefAuthor: data.chefAuthor,
          ingredients: data.ingredients || [],
          techniques: data.techniques || [],
          steps: data.steps || [],
          sourceType: data.sourceType,
          parentRecipeId: data.parentRecipeId,
          customizationNote: data.customizationNote,
        };
      });
      onData(items);
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
  sourceType: 'ai-generated' | 'ai-customized'
): Promise<void> {
  const safeId = sanitizeDocId(recipe.id);
  const path = `recipes/${safeId}`;
  try {
    const payload = buildRecipePayload(uid, recipe, sourceType, false);
    await setDoc(doc(db, 'recipes', safeId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateRecipeInFirestore(
  uid: string,
  recipe: Recipe,
  sourceType: 'ai-generated' | 'ai-customized'
): Promise<void> {
  const safeId = sanitizeDocId(recipe.id);
  const path = `recipes/${safeId}`;
  try {
    const payload = buildRecipePayload(uid, recipe, sourceType, true);
    delete payload.ownerId;
    delete payload.parentRecipeId;
    await updateDoc(doc(db, 'recipes', safeId), payload);
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
