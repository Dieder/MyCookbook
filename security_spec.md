# Firestore Security Specification (`Maison Feuille`)

## 1. Data Invariants
1. **Strict Ownership**: Every document in `/recipes/{recipeId}` and `/bookmarks/{bookmarkId}` must contain an `ownerId` string matching `request.auth.uid`, and the authenticated user must have a verified email (`request.auth.token.email_verified == true`).
2. **Path Hardening**: Every single-document ID (`recipeId`, `bookmarkId`) must match `^[a-zA-Z0-9_\\-]+$` and have length $\le 128$.
3. **Anti-Update-Gap & Strict Keys**: Every `create` verifies exact required keys and `keys().hasOnly(...)` allowed keys. Every `update` invokes `isValidRecipe()` / `isValidBookmark()` plus `affectedKeys().hasOnly(...)` action partitioning.
4. **Immutable Ownership & Temporal Integrity**: `ownerId` and `createdAt` are immutable after creation; `createdAt == request.time` on create and `updatedAt == request.time` on update.
5. **Bounded Arrays & Strings**: `storyParagraphs.size() <= 4`, `ingredients.size() >= 1 && <= 30`, `techniques.size() <= 4`, `steps.size() >= 1 && <= 15`. Every string enforces explicit `.size()` upper bounds.
6. **Secure List Queries**: `allow list` strictly evaluates `isSignedIn() && resource.data.ownerId == request.auth.uid` with zero `get()`/`exists()` calls.

## 2. Adversarial Payloads ("Dirty Dozen")
1. Unauthenticated read/list on `/recipes`. -> `PERMISSION_DENIED`
2. Unauthenticated write on `/recipes/r1`. -> `PERMISSION_DENIED`
3. Unverified email (`email_verified: false`) attempting create on `/recipes/r2`. -> `PERMISSION_DENIED`
4. Identity spoofing (`ownerId: "victim-uid"`) on create. -> `PERMISSION_DENIED`
5. Shadow field injection (`isAdmin: true` ghost key) on create. -> `PERMISSION_DENIED`
6. Shadow field injection (`ghostField: "abc"`) on update. -> `PERMISSION_DENIED`
7. Poisoned document ID (`../../etc/passwd` or 300-char ID) on `/recipes/{recipeId}`. -> `PERMISSION_DENIED`
8. Unbounded array (`ingredients` with 35 entries) on create. -> `PERMISSION_DENIED`
9. Client-forged `createdAt` timestamp (`new Date(0)`) instead of `request.time`. -> `PERMISSION_DENIED`
10. Cross-owner read/update/delete on another user's `/recipes/{recipeId}` or `/bookmarks/{bookmarkId}`. -> `PERMISSION_DENIED`
11. Mutating immutable `ownerId` or `createdAt` during an update. -> `PERMISSION_DENIED`
12. Blanket `list` query on `/recipes` or `/bookmarks` without filtering by `ownerId == request.auth.uid`. -> `PERMISSION_DENIED`
