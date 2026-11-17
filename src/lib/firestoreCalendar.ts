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
import { MealCalendarEntry } from '../types/cookbook';

const CALENDAR_COLLECTION = 'mealCalendar';

export function formatCalendarDocId(
  uid: string,
  dateKey: string,
  recipeId: string
): string {
  const safeUid = sanitizeDocId(uid).slice(0, 44);
  const safeDate = dateKey.replace(/[^0-9-]/g, '').slice(0, 10);
  const safeRecipe = sanitizeDocId(recipeId).slice(0, 60);
  return `${safeUid}_${safeDate}_${safeRecipe}`.slice(0, 120);
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
        return {
          id: docSnap.id,
          ownerId: String(d.ownerId || ''),
          date: String(d.date || ''),
          recipeId: String(d.recipeId || ''),
          recipeTitle: String(d.recipeTitle || 'Untitled Recipe'),
          courseId: String(d.courseId || 'dinner'),
          updatedAtMs: updatedAt?.toMillis?.() ?? 0,
        };
      });
      items.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
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
  },
  existsInCloud = false
): Promise<string> {
  const safeRecipeId = sanitizeDocId(payload.recipeId);
  const docId = formatCalendarDocId(uid, payload.date, safeRecipeId);
  const docRef = doc(db, CALENDAR_COLLECTION, docId);
  const safeTitle = payload.recipeTitle.trim().slice(0, 140) || 'Untitled Recipe';
  const safeCourseId = sanitizeDocId(payload.courseId || 'dinner').slice(0, 60);

  try {
    if (existsInCloud) {
      await updateDoc(docRef, {
        recipeTitle: safeTitle,
        courseId: safeCourseId,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        ownerId: uid,
        date: payload.date,
        recipeId: safeRecipeId,
        recipeTitle: safeTitle,
        courseId: safeCourseId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return docId;
  } catch (err) {
    handleFirestoreError(
      err,
      existsInCloud ? OperationType.UPDATE : OperationType.CREATE,
      `${CALENDAR_COLLECTION}/${docId}`
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
