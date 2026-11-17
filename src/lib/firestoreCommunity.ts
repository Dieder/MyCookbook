import { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  handleFirestoreError,
  OperationType,
  sanitizeDocId,
} from './firestoreRecipes';
import {
  Chapter,
  ContributorRequestStatus,
  RecipeRating,
  UserProfile,
  UserRole,
} from '../types/cookbook';

export const ADMIN_EMAIL = 'dieder.timmerman@gmail.com';

export function isBootstrappedAdminEmail(email: string | null | undefined): boolean {
  return (email || '').trim().toLowerCase() === ADMIN_EMAIL;
}

export async function upsertUserOnLogin(user: User): Promise<void> {
  const safeUid = sanitizeDocId(user.uid);
  const path = `users/${safeUid}`;
  const ref = doc(db, 'users', safeUid);
  const isAdminEmail = isBootstrappedAdminEmail(user.email);
  const displayName = (
    user.displayName ||
    user.email?.split('@')[0] ||
    'Bistro Reader'
  ).slice(0, 120);
  const photoURL = (user.photoURL || '').slice(0, 500);
  const email = (user.email || '').slice(0, 180);

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: safeUid,
        email,
        displayName,
        photoURL,
        role: isAdminEmail ? 'admin' : 'reader',
        contributorRequestStatus: isAdminEmail ? 'approved' : 'none',
        contributorRequestNote: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      const patch: Record<string, unknown> = {
        displayName,
        photoURL,
        updatedAt: serverTimestamp(),
      };
      if (isAdminEmail) {
        patch.role = 'admin';
        patch.contributorRequestStatus = 'approved';
      }
      await updateDoc(ref, patch);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeCurrentUserProfile(
  uid: string,
  onData: (profile: UserProfile | null) => void,
  onError: (err: Error) => void
) {
  const safeUid = sanitizeDocId(uid);
  const ref = doc(db, 'users', safeUid);
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      const d = snap.data();
      onData({
        uid: String(d.uid || safeUid),
        email: String(d.email || ''),
        displayName: String(d.displayName || 'Bistro Reader'),
        photoURL: String(d.photoURL || ''),
        role: (d.role as UserRole) || 'reader',
        contributorRequestStatus:
          (d.contributorRequestStatus as ContributorRequestStatus) || 'none',
        contributorRequestNote: String(d.contributorRequestNote || ''),
      });
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, `users/${safeUid}`);
      } catch (wrapped) {
        onError(wrapped as Error);
      }
    }
  );
}

export function subscribeAllUsers(
  onData: (users: UserProfile[]) => void,
  onError: (err: Error) => void
) {
  const q = query(collection(db, 'users'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: UserProfile[] = snapshot.docs.map((snap) => {
        const d = snap.data();
        return {
          uid: String(d.uid || snap.id),
          email: String(d.email || ''),
          displayName: String(d.displayName || 'Bistro Reader'),
          photoURL: String(d.photoURL || ''),
          role: (d.role as UserRole) || 'reader',
          contributorRequestStatus:
            (d.contributorRequestStatus as ContributorRequestStatus) || 'none',
          contributorRequestNote: String(d.contributorRequestNote || ''),
        };
      });
      items.sort((a, b) => {
        if (a.contributorRequestStatus === 'pending' && b.contributorRequestStatus !== 'pending') {
          return -1;
        }
        if (b.contributorRequestStatus === 'pending' && a.contributorRequestStatus !== 'pending') {
          return 1;
        }
        return a.email.localeCompare(b.email);
      });
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'users');
      } catch (wrapped) {
        onError(wrapped as Error);
      }
    }
  );
}

export async function requestContributorRights(uid: string, note: string): Promise<void> {
  const safeUid = sanitizeDocId(uid);
  const path = `users/${safeUid}`;
  const cleanNote = note.replace(/[\r\n]+/g, ' ').trim().slice(0, 240);
  try {
    await updateDoc(doc(db, 'users', safeUid), {
      contributorRequestStatus: 'pending',
      contributorRequestNote: cleanNote,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function adminUpdateUserRole(
  uid: string,
  role: UserRole,
  contributorRequestStatus: ContributorRequestStatus
): Promise<void> {
  const safeUid = sanitizeDocId(uid);
  const path = `users/${safeUid}`;
  try {
    await updateDoc(doc(db, 'users', safeUid), {
      role,
      contributorRequestStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

function normalizeParentChapterId(parentId: string | undefined, selfId: string): string {
  const trimmed = (parentId || '').trim();
  if (!trimmed) return '';
  const safeParent = sanitizeDocId(trimmed).slice(0, 60);
  return safeParent === selfId ? '' : safeParent;
}

export function subscribeChapters(
  onData: (chapters: Chapter[]) => void,
  onError: (err: Error) => void
) {
  const q = query(collection(db, 'chapters'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Chapter[] = snapshot.docs.map((snap) => {
        const d = snap.data();
        const rawParent = typeof d.parentChapterId === 'string' ? d.parentChapterId.trim() : '';
        return {
          id: snap.id,
          title: String(d.title || 'Chapter'),
          seasonNote: String(d.seasonNote || ''),
          epigraph: String(d.epigraph || ''),
          ...(rawParent ? { parentChapterId: rawParent } : {}),
          sortOrder: Number(d.sortOrder ?? 0),
        };
      });
      items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'chapters');
      } catch (wrapped) {
        onError(wrapped as Error);
      }
    }
  );
}

export async function createChapterInFirestore(chapter: Chapter): Promise<void> {
  const safeId = sanitizeDocId(chapter.id).slice(0, 60);
  const path = `chapters/${safeId}`;
  const parentChapterId = normalizeParentChapterId(chapter.parentChapterId, safeId);
  try {
    await setDoc(doc(db, 'chapters', safeId), {
      title: chapter.title.trim().slice(0, 100),
      seasonNote: chapter.seasonNote.trim().slice(0, 160),
      epigraph: chapter.epigraph.trim().slice(0, 500),
      parentChapterId,
      sortOrder: Math.max(0, Math.min(1000, Math.round(chapter.sortOrder ?? 0))),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateChapterInFirestore(chapter: Chapter): Promise<void> {
  const safeId = sanitizeDocId(chapter.id).slice(0, 60);
  const path = `chapters/${safeId}`;
  const parentChapterId = normalizeParentChapterId(chapter.parentChapterId, safeId);
  try {
    await updateDoc(doc(db, 'chapters', safeId), {
      romanIndex: deleteField(),
      title: chapter.title.trim().slice(0, 100),
      seasonNote: chapter.seasonNote.trim().slice(0, 160),
      epigraph: chapter.epigraph.trim().slice(0, 500),
      parentChapterId,
      sortOrder: Math.max(0, Math.min(1000, Math.round(chapter.sortOrder ?? 0))),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteChapterFromFirestore(chapterId: string): Promise<void> {
  const safeId = sanitizeDocId(chapterId).slice(0, 60);
  const path = `chapters/${safeId}`;
  try {
    await deleteDoc(doc(db, 'chapters', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function seedDefaultChaptersInFirestore(chapters: Chapter[]): Promise<void> {
  const ordered = [...chapters].sort((a, b) => {
    const aIsSub = Boolean(a.parentChapterId);
    const bIsSub = Boolean(b.parentChapterId);
    if (aIsSub !== bIsSub) return aIsSub ? 1 : -1;
    return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  });

  for (let i = 0; i < ordered.length; i += 1) {
    const ch = ordered[i];
    const safeId = sanitizeDocId(ch.id).slice(0, 60);
    const parentChapterId = normalizeParentChapterId(ch.parentChapterId, safeId);
    const ref = doc(db, 'chapters', safeId);
    try {
      const existing = await getDoc(ref);
      if (!existing.exists()) {
        await setDoc(ref, {
          title: ch.title.slice(0, 100),
          seasonNote: ch.seasonNote.slice(0, 160),
          epigraph: ch.epigraph.slice(0, 500),
          parentChapterId,
          sortOrder: ch.sortOrder ?? i,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `chapters/${safeId}`);
    }
  }
}

export async function migrateLegacyChaptersInFirestore(
  chapters: Chapter[],
  legacyIds: string[]
): Promise<void> {
  for (const legacyId of legacyIds) {
    const safeId = sanitizeDocId(legacyId).slice(0, 60);
    try {
      const snap = await getDoc(doc(db, 'chapters', safeId));
      if (snap.exists()) {
        await deleteDoc(doc(db, 'chapters', safeId));
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `chapters/${safeId}`);
    }
  }
  await seedDefaultChaptersInFirestore(chapters);
}

export function subscribeRecipeRatings(
  recipeId: string,
  onData: (ratings: RecipeRating[]) => void,
  onError: (err: Error) => void
) {
  const safeRecipeId = sanitizeDocId(recipeId);
  const q = query(
    collection(db, 'recipeRatings'),
    where('recipeId', '==', safeRecipeId)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const items: RecipeRating[] = snapshot.docs.map((snap) => {
        const d = snap.data();
        const ts = d.updatedAt instanceof Timestamp ? d.updatedAt.toMillis() : 0;
        return {
          id: snap.id,
          ownerId: String(d.ownerId || ''),
          authorName: String(d.authorName || 'Reader'),
          recipeId: String(d.recipeId || safeRecipeId),
          rating: Math.max(1, Math.min(5, Number(d.rating) || 5)),
          note: String(d.note || ''),
          updatedAtMs: ts,
        };
      });
      items.sort((a, b) => (b.updatedAtMs ?? 0) - (a.updatedAtMs ?? 0));
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'recipeRatings');
      } catch (wrapped) {
        onError(wrapped as Error);
      }
    }
  );
}

export async function upsertRecipeRating(
  uid: string,
  authorName: string,
  recipeId: string,
  rating: number,
  note: string,
  existsInCloud: boolean
): Promise<void> {
  const safeUid = sanitizeDocId(uid);
  const safeRecipeId = sanitizeDocId(recipeId).slice(0, 72);
  const docId = sanitizeDocId(`${safeUid}_${safeRecipeId}`);
  const path = `recipeRatings/${docId}`;
  const cleanNote = note.replace(/[\r\n]+/g, ' ').trim().slice(0, 140);
  const clampedRating = Math.max(1, Math.min(5, Math.round(rating)));
  const cleanAuthor = (authorName || 'Bistro Reader').trim().slice(0, 80) || 'Bistro Reader';

  try {
    if (existsInCloud) {
      await updateDoc(doc(db, 'recipeRatings', docId), {
        authorName: cleanAuthor,
        rating: clampedRating,
        note: cleanNote,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(doc(db, 'recipeRatings', docId), {
        ownerId: safeUid,
        authorName: cleanAuthor,
        recipeId: sanitizeDocId(recipeId),
        rating: clampedRating,
        note: cleanNote,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, existsInCloud ? OperationType.UPDATE : OperationType.CREATE, path);
  }
}

export async function deleteRecipeRating(ratingId: string): Promise<void> {
  const safeId = sanitizeDocId(ratingId);
  const path = `recipeRatings/${safeId}`;
  try {
    await deleteDoc(doc(db, 'recipeRatings', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
