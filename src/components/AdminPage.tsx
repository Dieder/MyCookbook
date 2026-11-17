import { useState } from 'react';
import {
  BookOpen,
  Check,
  Edit3,
  Plus,
  RotateCcw,
  Shield,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { UI_STRINGS } from '../i18n/translations';
import {
  Chapter,
  ContributorRequestStatus,
  LanguageCode,
  UserProfile,
  UserRole,
} from '../types/cookbook';

interface AdminPageProps {
  isAdmin: boolean;
  users: UserProfile[];
  chapters: Chapter[];
  onUpdateUserRole: (
    uid: string,
    role: UserRole,
    status: ContributorRequestStatus
  ) => Promise<void>;
  onAddChapter: () => void;
  onAddSubchapter: (parentChapterId?: string) => void;
  onEditChapter: (chapter: Chapter) => void;
  onDeleteChapter: (chapterId: string) => Promise<void>;
  onRestoreDefaultChapters: () => Promise<void>;
  onGoToSettings: () => void;
  lang: LanguageCode;
}

const ROLE_ORDER: UserRole[] = ['admin', 'contributor', 'reader'];

export function AdminPage({
  isAdmin,
  users,
  chapters,
  onUpdateUserRole,
  onAddChapter,
  onAddSubchapter,
  onEditChapter,
  onDeleteChapter,
  onRestoreDefaultChapters,
  onGoToSettings,
  lang,
}: AdminPageProps) {
  const t = UI_STRINGS[lang];
  const [userFilter, setUserFilter] = useState<'all' | 'pending' | UserRole>('all');
  const [busyUid, setBusyUid] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isAdmin) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-16">
        <div className="max-w-lg mx-auto border border-[var(--border-line)] bg-[var(--bg-surface)] p-8 text-center space-y-4">
          <Shield className="w-7 h-7 mx-auto text-[var(--accent-secondary)]" />
          <h1 className="font-display text-2xl text-[var(--text-ink)]">
            {t.adminTitle}
          </h1>
          <p className="font-serif text-sm text-[var(--text-muted)]">
            {t.adminAccessDenied}
          </p>
          <button
            type="button"
            onClick={onGoToSettings}
            className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono cursor-pointer whitespace-nowrap"
          >
            {t.goToSettings}
          </button>
        </div>
      </div>
    );
  }

  const pendingCount = users.filter(
    (u) => u.contributorRequestStatus === 'pending'
  ).length;

  const roleCounts: Record<UserRole, number> = {
    admin: users.filter((u) => u.role === 'admin').length,
    contributor: users.filter((u) => u.role === 'contributor').length,
    reader: users.filter((u) => u.role === 'reader').length,
  };

  const roleMeta: Record<UserRole, { label: string; desc: string }> = {
    admin: { label: t.roleAdmin, desc: t.roleAdminDesc },
    contributor: { label: t.roleContributor, desc: t.roleContributorDesc },
    reader: { label: t.roleReader, desc: t.roleReaderDesc },
  };

  const visibleUsers =
    userFilter === 'all'
      ? users
      : userFilter === 'pending'
      ? users.filter((u) => u.contributorRequestStatus === 'pending')
      : users.filter((u) => u.role === userFilter);

  const handleRoleChange = async (
    targetUser: UserProfile,
    nextRole: UserRole
  ) => {
    if (targetUser.role === nextRole) return;
    setBusyUid(targetUser.uid);
    try {
      const nextStatus: ContributorRequestStatus =
        nextRole === 'contributor' || nextRole === 'admin'
          ? 'approved'
          : targetUser.contributorRequestStatus === 'pending'
          ? 'rejected'
          : targetUser.contributorRequestStatus;
      await onUpdateUserRole(targetUser.uid, nextRole, nextStatus);
    } finally {
      setBusyUid(null);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-8 sm:py-10 space-y-12">
      {/* Masthead */}
      <div className="border-b border-[var(--border-line)] pb-6">
        <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--accent-secondary)]">
          {t.adminEyebrow}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-[var(--text-ink)] mt-1">
          {t.adminTitle}
        </h1>
      </div>

      {/* Section 1: Users & Three-Role Directory */}
      <section className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-[var(--accent-secondary)]" />
            <h2 className="font-display text-2xl text-[var(--text-ink)]">
              {t.adminUsersTitle}
            </h2>
          </div>

          <div className="inline-flex flex-wrap border border-[var(--border-line)] bg-[var(--bg-paper)]">
            <button
              type="button"
              onClick={() => setUserFilter('all')}
              className={`px-3 py-1.5 text-xs font-mono cursor-pointer whitespace-nowrap ${
                userFilter === 'all'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
              }`}
            >
              {t.allUsersFilter} ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setUserFilter('pending')}
              className={`px-3 py-1.5 text-xs font-mono cursor-pointer whitespace-nowrap ${
                userFilter === 'pending'
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
              }`}
            >
              {t.pendingRequestsFilter} ({pendingCount})
            </button>
          </div>
        </div>

        {/* Explicit List of Three Roles: Admin, Contributor, Reader */}
        <div className="space-y-2.5">
          <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--text-muted)]">
            {t.rolesDirectoryTitle}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ROLE_ORDER.map((roleKey) => {
              const isSelected = userFilter === roleKey;
              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() =>
                    setUserFilter(isSelected ? 'all' : roleKey)
                  }
                  className={`text-left p-4 border transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-soft)]'
                      : 'border-[var(--border-line)] bg-[var(--bg-paper)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-lg text-[var(--text-ink)]">
                      {roleMeta[roleKey].label}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-[var(--accent-secondary)]">
                      {roleCounts[roleKey]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-serif text-[var(--text-muted)] leading-relaxed">
                    {roleMeta[roleKey].desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Registered Users & Per-User Role List */}
        {visibleUsers.length === 0 ? (
          <p className="text-sm font-serif text-[var(--text-muted)] py-4">
            {t.noUsersFound}
          </p>
        ) : (
          <div className="divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
            {visibleUsers.map((u) => {
              const isPrimaryAdmin =
                u.email.toLowerCase() === 'dieder.timmerman@gmail.com';
              const isPending = u.contributorRequestStatus === 'pending';

              return (
                <div
                  key={u.uid}
                  className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-lg text-[var(--text-ink)]">
                        {u.displayName}
                      </span>
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        {u.email}
                      </span>
                      {isPending && (
                        <span className="font-mono text-[11px] text-[var(--accent-secondary)] uppercase tracking-wider">
                          · {t.pendingRequestsFilter}
                        </span>
                      )}
                    </div>
                    {u.contributorRequestNote && (
                      <p className="text-xs font-serif italic text-[var(--text-muted)]">
                        “{u.contributorRequestNote}”
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    {isPending && u.role === 'reader' && (
                      <button
                        type="button"
                        disabled={busyUid === u.uid}
                        onClick={() =>
                          void handleRoleChange(u, 'contributor')
                        }
                        className="px-3 py-1.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {t.approveContributor}
                      </button>
                    )}

                    <div
                      role="group"
                      aria-label={`${t.roleLabel}: ${u.email}`}
                      className="inline-flex border border-[var(--border-line)] bg-[var(--bg-paper)]"
                    >
                      {ROLE_ORDER.map((roleOption) => {
                        const active = u.role === roleOption;
                        const locked = isPrimaryAdmin && roleOption !== 'admin';
                        return (
                          <button
                            key={roleOption}
                            type="button"
                            disabled={busyUid === u.uid || locked}
                            onClick={() => void handleRoleChange(u, roleOption)}
                            className={`px-3 py-1.5 text-xs font-mono transition-colors whitespace-nowrap ${
                              active
                                ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-ink)]'
                            } ${
                              busyUid === u.uid || locked
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer'
                            }`}
                          >
                            {roleMeta[roleOption].label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 2: Cookbook Chapters */}
      <section className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-[var(--accent-secondary)]" />
            <h2 className="font-display text-2xl text-[var(--text-ink)]">
              {t.adminChaptersTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {chapters.length === 0 && (
              <button
                type="button"
                onClick={() => void onRestoreDefaultChapters()}
                className="px-3.5 py-2 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.restoreDefaultChaptersBtn}
              </button>
            )}

            <button
              type="button"
              onClick={onAddChapter}
              className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              {t.addChapterTitle}
            </button>

            {chapters.some((ch) => !ch.parentChapterId) && (
              <button
                type="button"
                onClick={() => onAddSubchapter()}
                className="px-4 py-2 border border-[var(--accent-primary)] bg-[var(--bg-paper)] text-[var(--accent-primary)] text-xs font-mono inline-flex items-center gap-1.5 hover:bg-[var(--accent-primary)] hover:text-[var(--accent-primary-fg)] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.addSubchapterBtn}
              </button>
            )}
          </div>
        </div>

        {chapters.length > 0 && (() => {
          const topChapters = chapters.filter((ch) => !ch.parentChapterId);
          const topIds = new Set(topChapters.map((c) => c.id));
          const orphanedSubchapters = chapters.filter(
            (ch) => ch.parentChapterId && !topIds.has(ch.parentChapterId)
          );

          const renderChapterRow = (
            ch: Chapter,
            isSubchapter = false,
            subCount = 0
          ) => (
            <div
              key={ch.id}
              className={`py-4 space-y-2 ${
                isSubchapter
                  ? 'pl-6 sm:pl-8 border-t border-[var(--border-subtle)] bg-[var(--bg-paper)]/50'
                  : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-mono text-[var(--accent-secondary)] tabular-nums">
                    {isSubchapter
                      ? `${t.subchaptersLabel} · ${ch.id}`
                      : subCount > 0
                      ? `${ch.id} · ${t.subchaptersCountLabel(subCount)}`
                      : ch.id}
                  </p>
                  <h3
                    className={`font-display text-[var(--text-ink)] mt-0.5 ${
                      isSubchapter ? 'text-xl' : 'text-2xl'
                    }`}
                  >
                    {isSubchapter ? `— ${ch.title}` : ch.title}
                  </h3>
                  <p className="text-xs font-serif italic text-[var(--text-muted)]">
                    {ch.seasonNote}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {!isSubchapter && (
                    <button
                      type="button"
                      onClick={() => onAddSubchapter(ch.id)}
                      className="px-3 py-1.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--accent-primary)] inline-flex items-center gap-1.5 hover:border-[var(--accent-primary)] cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {t.addSubchapterBtn}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onEditChapter(ch)}
                    className="px-3 py-1.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center gap-1.5 hover:bg-[var(--bg-elevated)] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    {t.editBtn}
                  </button>

                  {confirmDeleteId === ch.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={deletingId === ch.id}
                        onClick={async () => {
                          setDeletingId(ch.id);
                          try {
                            await onDeleteChapter(ch.id);
                            setConfirmDeleteId(null);
                          } finally {
                            setDeletingId(null);
                          }
                        }}
                        className="px-3 py-1.5 bg-[var(--accent-secondary)] text-[var(--accent-primary-fg)] text-xs font-mono cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
                      >
                        {t.confirmDeleteBtn}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="p-1.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-[var(--text-muted)] cursor-pointer"
                        aria-label={t.cancel}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(ch.id)}
                      className="px-3 py-1.5 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-secondary)] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {t.deleteBtn}
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm font-serif text-[var(--text-ink)]/85 leading-relaxed max-w-3xl">
                {ch.epigraph}
              </p>
            </div>
          );

          return (
            <div className="divide-y divide-[var(--border-subtle)]">
              {topChapters.map((parent) => {
                const subchapters = chapters.filter(
                  (c) => c.parentChapterId === parent.id
                );
                return (
                  <div key={parent.id}>
                    {renderChapterRow(parent, false, subchapters.length)}
                    {subchapters.map((sub) => renderChapterRow(sub, true, 0))}
                  </div>
                );
              })}
              {orphanedSubchapters.map((orphan) => renderChapterRow(orphan, true, 0))}
            </div>
          );
        })()}
      </section>
    </div>
  );
}
