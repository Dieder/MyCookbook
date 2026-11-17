# Firestore Security Specification (`Maison Feuille`)

## 1. Data Invariants
1. **Bootstrapped Admin & RBAC**: `dieder.timmerman@gmail.com` (`email_verified == true`) is bootstrapped as `admin`. Every verified user logging in receives read rights (`role: 'reader'`) and can request contributor rights (`contributorRequestStatus: 'pending'`), which only an `admin` may approve or modify.
2. **PII Isolation on `/users/{userId}`**: User documents contain email addresses and must only be readable by `userId == request.auth.uid` or an `admin`. List queries on `/users` are restricted to the bootstrapped admin or `resource.data.uid == request.auth.uid` (zero `get()`/`exists()` inside `allow list`).
3. **Anti-Privilege-Escalation**: Non-admin users cannot create a `/users/{uid}` document with `role != 'reader'`, nor modify `role` during profile updates. Only `isAdmin()` can mutate `role` and approve/reject `contributorRequestStatus` (while preserving `dieder.timmerman@gmail.com` as `admin`).
4. **Admin Chapter & Subchapter Management**: `/chapters/{chapterId}` documents are publicly readable book catalog entries (zero PII) supporting top-level chapters (`parentChapterId: ""`) and subchapters (`parentChapterId` referencing an existing parent chapter, never self-referential); `create`, `update`, and `delete` require `isAdmin()`.
5. **Contributor/Admin Recipe Publishing & Draft-Only Deletion**: Published `/recipes/{recipeId}` entries (`status == 'published'`) are readable across the catalog, while unpublished drafts (`status == 'draft'`) are isolated to their owner (or `admin`). Creating, updating, publishing, or unpublishing `/recipes/{recipeId}` requires `isContributorOrAdmin()` and ownership (or `isAdmin()`). Deletion is strictly permitted only when `status == 'draft'` (unpublished).
6. **Recipe Ratings & Single-Line Notes**: `/recipeRatings/{ratingId}` requires `isVerifiedUser()` on write, `ownerId == request.auth.uid`, integer `rating` between `1` and `5`, single-line `note` ($\le 140$ chars, no `\r` or `\n`), and zero PII (`authorName` only, no `email`).
7. **Path Hardening & Temporal Integrity**: Every document ID matches `^[a-zA-Z0-9_\\-]+$` ($\le 128$ chars). Every create validates exact keys and `createdAt == request.time`, and every update validates `affectedKeys().hasOnly(...)` + `updatedAt == request.time`.

## 2. Adversarial Payloads ("Dirty Dozen")
1. Unauthenticated read/list on `/users` or `/bookmarks`. -> `PERMISSION_DENIED`
2. Unverified email (`email_verified: false`) creating a `/users/{uid}`, `/recipes/{id}`, or `/recipeRatings/{id}`. -> `PERMISSION_DENIED`
3. Privilege escalation on signup (`role: "admin"` or `"contributor"` by a regular user on `/users/{uid}` create). -> `PERMISSION_DENIED`
4. Privilege escalation on self-update (`role: "admin"` or `"contributor"` modified by the user on `/users/{uid}` update). -> `PERMISSION_DENIED`
5. Reader (`role: "reader"`) attempting to create or overwrite `/recipes/{recipeId}`. -> `PERMISSION_DENIED`
6. Non-admin attempting to create, update, or delete `/chapters/{chapterId}`. -> `PERMISSION_DENIED`
7. Cross-owner update/delete on another user's `/bookmarks/{id}` or `/recipeRatings/{id}`. -> `PERMISSION_DENIED`
8. Shadow field injection (`ghostField: true`) on `/users`, `/chapters`, `/recipes`, `/bookmarks`, or `/recipeRatings`. -> `PERMISSION_DENIED`
9. Multi-line or oversized note (`rating: 6` or `note` containing `\n` or $>140$ chars) on `/recipeRatings/{id}`. -> `PERMISSION_DENIED`
10. Poisoned document ID (`../../etc/passwd`) on any collection. -> `PERMISSION_DENIED`
11. Client-forged `createdAt` timestamp (`new Date(0)`) instead of `request.time`. -> `PERMISSION_DENIED`
12. Blanket `list` query on `/users` by a non-admin user. -> `PERMISSION_DENIED`
