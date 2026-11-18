import { useState } from 'react';
import {
  Check,
  Globe,
  LogIn,
  LogOut,
  Palette,
  Scale,
  Send,
  Shield,
  Smartphone,
  UserCheck,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { User } from 'firebase/auth';
import {
  LANGUAGES,
  THEME_OPTIONS,
  UI_STRINGS,
} from '../i18n/translations';
import {
  LanguageCode,
  ThemeId,
  UnitSystem,
  UserProfile,
  UserRole,
} from '../types/cookbook';

interface SettingsPageProps {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onRequestContributor: (note: string) => Promise<void>;
  onOpenAdmin: () => void;
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  theme: ThemeId;
  onChangeTheme: (theme: ThemeId) => void;
  unitSystem: UnitSystem;
  onChangeUnitSystem: (unit: UnitSystem) => void;
}

const THEME_PREVIEW_SWATCHES: Record<
  ThemeId,
  { paper: string; surface: string; ink: string; primary: string; secondary: string }
> = {
  classic: {
    paper: '#FBF9F5',
    surface: '#F7F4EE',
    ink: '#1C1917',
    primary: '#14532D',
    secondary: '#78350F',
  },
  whitepaper: {
    paper: '#FFFFFF',
    surface: '#FAFAFA',
    ink: '#111827',
    primary: '#111827',
    secondary: '#1E40AF',
  },
  modern: {
    paper: '#F8FAFC',
    surface: '#FFFFFF',
    ink: '#0F172A',
    primary: '#0F172A',
    secondary: '#1D4ED8',
  },
  colorful: {
    paper: '#FFFBF2',
    surface: '#FFF3DA',
    ink: '#1F2421',
    primary: '#B91C1C',
    secondary: '#047857',
  },
};

export function SettingsPage({
  user,
  userProfile,
  isAdmin,
  onSignIn,
  onSignOut,
  onRequestContributor,
  onOpenAdmin,
  language,
  onChangeLanguage,
  theme,
  onChangeTheme,
  unitSystem,
  onChangeUnitSystem,
}: SettingsPageProps) {
  const t = UI_STRINGS[language];
  const [requestNote, setRequestNote] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const effectiveRole: UserRole = isAdmin
    ? 'admin'
    : userProfile?.role ?? 'reader';

  const getRoleLabel = (role: UserRole) => {
    if (role === 'admin') return t.roleAdmin;
    if (role === 'contributor') return t.roleContributor;
    return t.roleReader;
  };

  const getRoleDescription = (role: UserRole) => {
    if (role === 'admin') return t.roleAdminDesc;
    if (role === 'contributor') return t.roleContributorDesc;
    return t.roleReaderDesc;
  };

  const getThemeLabel = (id: ThemeId) => {
    if (id === 'classic') return t.themeClassic;
    if (id === 'whitepaper') return t.themeWhitepaper;
    if (id === 'modern') return t.themeModern;
    return t.themeColorful;
  };

  const handleSubmitContributorRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRequest) return;
    setSubmittingRequest(true);
    try {
      await onRequestContributor(requestNote);
      setRequestNote('');
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 py-8 sm:py-10 space-y-10">
      {/* Masthead */}
      <div className="border-b border-[var(--border-line)] pb-6">
        <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--accent-secondary)]">
          {t.settingsEyebrow}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-[var(--text-ink)] mt-1">
          {t.settingsTitle}
        </h1>
        <p className="font-serif text-base text-[var(--text-muted)] mt-2 max-w-2xl leading-relaxed">
          {t.settingsSubtitle}
        </p>
      </div>

      {/* Section 1: Account, Login & Contributor Rights */}
      <section className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-4 h-4 text-[var(--accent-secondary)]" />
            <h2 className="font-display text-2xl text-[var(--text-ink)]">
              {t.accountSectionTitle}
            </h2>
          </div>

          {user && (
            <button
              type="button"
              onClick={() => void onSignOut()}
              aria-label={t.signOut}
              title={t.signOut}
              className="p-2 md:px-3.5 md:py-2 border border-[var(--border-line)] bg-[var(--bg-paper)] text-xs font-mono text-[var(--text-ink)] inline-flex items-center justify-center gap-1.5 hover:bg-[var(--bg-elevated)] cursor-pointer whitespace-nowrap shrink-0"
            >
              <LogOut className="w-4 h-4 md:w-3.5 md:h-3.5" />
              <span className="hidden md:inline">{t.signOut}</span>
            </button>
          )}
        </div>

        {!user ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 py-2">
            <div className="space-y-1.5 max-w-xl">
              <p className="font-serif text-sm text-[var(--text-ink)] leading-relaxed">
                {t.signInPrompt}
              </p>
              <p className="font-serif text-xs text-[var(--text-muted)] leading-relaxed">
                {t.roleReaderDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void onSignIn()}
              className="px-5 py-2.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-2 hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
            >
              <LogIn className="w-4 h-4" />
              {t.signInGoogle}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[var(--bg-paper)] border border-[var(--border-line)]">
              <div className="flex items-center gap-4 min-w-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover border border-[var(--border-line)] shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-[var(--bg-elevated)] border border-[var(--border-line)] flex items-center justify-center font-display text-lg text-[var(--text-ink)] shrink-0">
                    {(user.displayName || user.email || 'M').slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-display text-lg text-[var(--text-ink)] truncate">
                    {userProfile?.displayName || user.displayName || 'Bistro Reader'}
                  </p>
                  <p className="font-mono text-xs text-[var(--text-muted)] truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="sm:text-right space-y-1">
                <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  {t.roleLabel}
                </p>
                <p className="font-mono text-sm font-semibold text-[var(--accent-primary)]">
                  {getRoleLabel(effectiveRole)}
                </p>
              </div>
            </div>

            <p className="text-sm font-serif text-[var(--text-muted)] leading-relaxed">
              {getRoleDescription(effectiveRole)}
            </p>

            {effectiveRole === 'admin' && (
              <div>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="px-4 py-2.5 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center gap-2 hover:opacity-90 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  {t.navAdmin}
                </button>
              </div>
            )}

            {effectiveRole === 'reader' && (
              <div className="pt-4 border-t border-[var(--border-subtle)] space-y-4">
                {userProfile?.contributorRequestStatus === 'pending' ? (
                  <div className="p-4 bg-[var(--bg-paper)] border border-[var(--border-line)] space-y-1.5">
                    <p className="text-xs font-mono text-[var(--accent-secondary)]">
                      {t.requestContributorPending}
                    </p>
                    {userProfile.contributorRequestNote && (
                      <p className="text-sm font-serif italic text-[var(--text-muted)]">
                        “{userProfile.contributorRequestNote}”
                      </p>
                    )}
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => void handleSubmitContributorRequest(e)}
                    className="space-y-3"
                  >
                    {userProfile?.contributorRequestStatus === 'rejected' && (
                      <p className="text-xs font-mono text-[var(--accent-secondary)]">
                        {t.requestContributorRejected}
                      </p>
                    )}
                    <label
                      htmlFor="contributor-request-note"
                      className="block text-xs font-mono uppercase tracking-[0.12em] text-[var(--text-muted)]"
                    >
                      {t.requestContributorNoteLabel}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        id="contributor-request-note"
                        type="text"
                        maxLength={200}
                        value={requestNote}
                        onChange={(e) =>
                          setRequestNote(e.target.value.replace(/[\r\n]+/g, ' '))
                        }
                        placeholder={t.requestContributorNotePlaceholder}
                        className="flex-1 px-3.5 py-2 bg-[var(--bg-paper)] border border-[var(--border-line)] text-sm font-serif text-[var(--text-ink)] placeholder:text-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                      <button
                        type="submit"
                        disabled={submittingRequest}
                        className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--accent-primary-fg)] text-xs font-mono inline-flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {t.requestContributorBtn}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Section 2: Language (Taal) & Section 3: Theme (Thema) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Language Selection */}
        <section className="lg:col-span-5 border border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-7 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-[var(--border-subtle)] pb-4">
            <Globe className="w-4 h-4 text-[var(--accent-secondary)]" />
            <h2 className="font-display text-2xl text-[var(--text-ink)]">
              {t.languageSectionTitle}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map((opt) => {
              const selected = language === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => onChangeLanguage(opt.code)}
                  className={`p-3.5 border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                    selected
                      ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                      : 'bg-[var(--bg-paper)] border-[var(--border-line)] text-[var(--text-ink)] hover:border-[var(--accent-primary)]'
                  }`}
                >
                  <div>
                    <p className="font-mono text-[11px] opacity-80">
                      {opt.shortLabel}
                    </p>
                    <p className="font-serif text-sm font-medium mt-0.5">
                      {opt.name}
                    </p>
                  </div>
                  {selected && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* 4-Theme Selection */}
        <section className="lg:col-span-7 border border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-7 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-[var(--border-subtle)] pb-4">
            <Palette className="w-4 h-4 text-[var(--accent-secondary)]" />
            <h2 className="font-display text-2xl text-[var(--text-ink)]">
              {t.themeSectionTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {THEME_OPTIONS.map((themeOption) => {
              const selected = theme === themeOption;
              const sw = THEME_PREVIEW_SWATCHES[themeOption];
              return (
                <button
                  key={themeOption}
                  type="button"
                  onClick={() => onChangeTheme(themeOption)}
                  className={`p-4 border text-left transition-colors cursor-pointer space-y-3 ${
                    selected
                      ? 'border-[var(--accent-primary)] bg-[var(--bg-paper)] ring-1 ring-[var(--accent-primary)]'
                      : 'border-[var(--border-line)] bg-[var(--bg-paper)] hover:border-[var(--accent-primary)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-lg text-[var(--text-ink)]">
                      {getThemeLabel(themeOption)}
                    </span>
                    {selected && (
                      <Check className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                    )}
                  </div>

                  {/* Editorial Color Palette Strip */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-6 flex-1 border border-black/15"
                      style={{ backgroundColor: sw.paper }}
                      title={sw.paper}
                    />
                    <span
                      className="h-6 flex-1 border border-black/15"
                      style={{ backgroundColor: sw.surface }}
                      title={sw.surface}
                    />
                    <span
                      className="h-6 w-8 border border-black/15"
                      style={{ backgroundColor: sw.primary }}
                      title={sw.primary}
                    />
                    <span
                      className="h-6 w-8 border border-black/15"
                      style={{ backgroundColor: sw.secondary }}
                      title={sw.secondary}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Section 4: Measurement Units (Metric vs US Customary) */}
      <section className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-7 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-[var(--border-subtle)] pb-4">
          <Scale className="w-4 h-4 text-[var(--accent-secondary)]" />
          <h2 className="font-display text-2xl text-[var(--text-ink)]">
            {t.unitSectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {(
            [
              { id: 'metric' as const, label: t.metricFull, short: t.metricShort },
              { id: 'imperial' as const, label: t.usCustomaryFull, short: t.usShort },
            ]
          ).map((opt) => {
            const selected = unitSystem === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeUnitSystem(opt.id)}
                className={`p-4 border text-left transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                  selected
                    ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[var(--accent-primary-fg)]'
                    : 'bg-[var(--bg-paper)] border-[var(--border-line)] text-[var(--text-ink)] hover:border-[var(--accent-primary)]'
                }`}
              >
                <div>
                  <p className="font-mono text-[11px] opacity-80">{opt.short}</p>
                  <p className="font-serif text-sm font-medium mt-0.5">{opt.label}</p>
                </div>
                {selected && <Check className="w-4 h-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 5: Offline Access & Home-Screen Install (PWA) */}
      <section className="border border-[var(--border-line)] bg-[var(--bg-surface)] p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-[var(--border-subtle)] pb-4">
          <Smartphone className="w-4 h-4 text-[var(--accent-secondary)]" />
          <h2 className="font-display text-2xl text-[var(--text-ink)]">
            {t.pwaSectionTitle}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <p className="font-serif text-sm text-[var(--text-ink)] leading-relaxed">
              {t.pwaSectionDesc}
            </p>
            <p className="font-mono text-xs text-[var(--text-muted)]">
              {t.pwaAvailableHint}
            </p>
          </div>

          <PWAInstallButton lang={language} variant="settings" />
        </div>
      </section>
    </div>
  );
}
