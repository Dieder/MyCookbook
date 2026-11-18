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
import { db } from './firebase';
import {
  OperationType,
  handleFirestoreError,
  sanitizeDocId,
} from './firestoreRecipes';
import { MealCalendarEntry, MealSlot } from '../types/cookbook';

const CALENDAR_COLLECTION = 'mealCalendar';

export const MEAL_SLOT_ORDER: Record<MealSlot, number> = {
  breakfast: 0,
  lunch: 1,
  dinner: 2,
  snack: 3,
};

export function normalizeMealSlot(raw: unknown): MealSlot {
  if (raw === 'breakfast' || raw === 'lunch' || raw === 'dinner' || raw === 'snack') {
    return raw;
  }
  return 'dinner';
}

export function formatCalendarDocId(
  uid: string,
  dateKey: string,
  mealSlot: MealSlot,
  recipeId: string
): string {
  const safeUid = sanitizeDocId(uid).slice(0, 32);
  const safeDate = dateKey.replace(/[^0-9-]/g, '').slice(0, 10);
  const safeSlot = normalizeMealSlot(mealSlot);
  const safeRecipe = sanitizeDocId(recipeId).slice(0, 52);
  return `${safeUid}_${safeDate}_${safeSlot}_${safeRecipe}`.slice(0, 120);
}

export function subscribeUserCalendar(
  uid: string,
  onData: (entries: MealCalendarEntry[]) => void,
  onError: (err: unknown) => void
): () => void {
  const q = query(
    collection(db, CALENDAR_COLLECTION),
    where('ownerId', '==', uid)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const items: MealCalendarEntry[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data() as Record<string, unknown>;
        const updatedAt = d.updatedAt as { toMillis?: () => number } | undefined;
        const rawServings = Number(d.servings);
        const servings =
          Number.isInteger(rawServings) && rawServings >= 1 && rawServings <= 48
            ? rawServings
            : undefined;
        return {
          id: docSnap.id,
          ownerId: String(d.ownerId || ''),
          date: String(d.date || ''),
          recipeId: String(d.recipeId || ''),
          recipeTitle: String(d.recipeTitle || 'Untitled Recipe'),
          courseId: String(d.courseId || 'dinner'),
          mealSlot: normalizeMealSlot(d.mealSlot),
          ...(servings ? { servings } : {}),
          updatedAtMs: updatedAt?.toMillis?.() ?? 0,
        };
      });
      items.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        const slotDiff = MEAL_SLOT_ORDER[a.mealSlot] - MEAL_SLOT_ORDER[b.mealSlot];
        if (slotDiff !== 0) return slotDiff;
        return (a.updatedAtMs ?? 0) - (b.updatedAtMs ?? 0);
      });
      onData(items);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.LIST, CALENDAR_COLLECTION);
      } catch (wrapped) {
        onError(wrapped);
      }
    }
  );
}

export async function upsertCalendarEntryInFirestore(
  uid: string,
  payload: {
    date: string;
    recipeId: string;
    recipeTitle: string;
    courseId: string;
    mealSlot: MealSlot;
    servings?: number;
  },
  existingDocId?: string
): Promise<string> {
  const safeRecipeId = sanitizeDocId(payload.recipeId);
  const safeSlot = normalizeMealSlot(payload.mealSlot);
  const docId = existingDocId
    ? sanitizeDocId(existingDocId)
    : formatCalendarDocId(uid, payload.date, safeSlot, safeRecipeId);
  const docRef = doc(db, CALENDAR_COLLECTION, docId);
  const safeTitle = payload.recipeTitle.trim().slice(0, 140) || 'Untitled Recipe';
  const safeCourseId = sanitizeDocId(payload.courseId || 'dinner').slice(0, 60);
  const validServings =
    typeof payload.servings === 'number' &&
    Number.isInteger(payload.servings) &&
    payload.servings >= 1 &&
    payload.servings <= 48
      ? payload.servings
      : undefined;

  try {
    if (existingDocId) {
      await updateDoc(docRef, {
        recipeId: safeRecipeId,
        recipeTitle: safeTitle,
        courseId: safeCourseId,
        mealSlot: safeSlot,
        ...(validServings ? { servings: validServings } : {}),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        ownerId: uid,
        date: payload.date,
        recipeId: safeRecipeId,
        recipeTitle: safeTitle,
        courseId: safeCourseId,
        mealSlot: safeSlot,
        ...(validServings ? { servings: validServings } : {}),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return docId;
  } catch (err) {
    handleFirestoreError(
      err,
      existingDocId ? OperationType.UPDATE : OperationType.CREATE,
      `${CALENDAR_COLLECTION}/${docId}`
    );
  }
}

export async function swapCalendarEntryInFirestore(
  entryId: string,
  payload: {
    recipeId: string;
    recipeTitle: string;
    courseId: string;
    mealSlot: MealSlot;
    servings?: number;
  }
): Promise<void> {
  const safeId = sanitizeDocId(entryId);
  const safeRecipeId = sanitizeDocId(payload.recipeId);
  const safeTitle = payload.recipeTitle.trim().slice(0, 140) || 'Untitled Recipe';
  const safeCourseId = sanitizeDocId(payload.courseId || 'dinner').slice(0, 60);
  const safeSlot = normalizeMealSlot(payload.mealSlot);
  const validServings =
    typeof payload.servings === 'number' &&
    Number.isInteger(payload.servings) &&
    payload.servings >= 1 &&
    payload.servings <= 48
      ? payload.servings
      : undefined;

  try {
    await updateDoc(doc(db, CALENDAR_COLLECTION, safeId), {
      recipeId: safeRecipeId,
      recipeTitle: safeTitle,
      courseId: safeCourseId,
      mealSlot: safeSlot,
      ...(validServings ? { servings: validServings } : {}),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.UPDATE,
      `${CALENDAR_COLLECTION}/${safeId}`
    );
  }
}

export async function deleteCalendarEntryFromFirestore(
  entryId: string
): Promise<void> {
  const safeId = sanitizeDocId(entryId);
  try {
    await deleteDoc(doc(db, CALENDAR_COLLECTION, safeId));
  } catch (err) {
    handleFirestoreError(
      err,
      OperationType.DELETE,
      `${CALENDAR_COLLECTION}/${safeId}`
    );
  }
}
