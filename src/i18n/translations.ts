import { Chapter, LanguageCode, ThemeId } from '../types/cookbook';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  shortLabel: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', shortLabel: 'EN' },
  { code: 'nl', name: 'Nederlands', shortLabel: 'NL' },
  { code: 'fr', name: 'Français', shortLabel: 'FR' },
  { code: 'es', name: 'Español', shortLabel: 'ES' },
  { code: 'de', name: 'Deutsch', shortLabel: 'DE' },
  { code: 'it', name: 'Italiano', shortLabel: 'IT' },
];

export const THEME_OPTIONS: ThemeId[] = ['classic', 'whitepaper', 'modern', 'colorful'];

export const SEASON_OPTIONS = [
  'All Seasons',
  'Spring',
  'Summer',
  'Autumn',
  'Late Autumn',
  'Winter',
] as const;

export interface UIStrings {
  // Navigation & Preferences
  navCover: string;
  navChapters: string;
  navCards: string;
  navSaved: string;
  navSettings: string;
  navAdmin: string;
  cookMode: string;
  cookModeActive: (count: number) => string;
  languageLabel: string;
  themeLabel: string;
  themeClassic: string;
  themeWhitepaper: string;
  themeModern: string;
  themeColorful: string;

  // Frontispiece / Cover
  openFirstPlate: string;
  askChefForRecipe: string;
  browsePlates: string;
  tableOfContents: string;
  chaptersIndexTitle: string;
  platesSummary: (plates: number, clips: number, timed: number) => string;
  subchaptersLabel: string;
  allInParentChapter: (title: string) => string;
  clipsUnit: string;
  minUnit: string;
  saveRecipeAria: string;
  removeBookmarkAria: string;

  // Chapters & Saved Gallery
  personalBookmarkShelf: string;
  seasonalBistroFolio: string;
  savedTitle: string;
  chaptersTitle: string;
  filterPlaceholder: string;
  filterAria: string;
  askChefShort: string;
  allChapters: string;
  signOut: string;
  signInSync: string;
  noBookmarksTitle: string;
  noMatchesTitle: string;
  noBookmarksHint: string;
  noMatchesHint: string;
  browseSeasonalChapters: string;
  servesCount: (count: number) => string;
  readStoryCard: string;
  timersCount: (count: number) => string;
  watchPrepClip: string;

  // Recipe Cards Index
  miseEnPlaceIndex: string;
  collectibleCardsTitle: string;
  metricFull: string;
  usCustomaryFull: string;
  filterByChapterAria: string;
  prepWord: string;
  cookWord: string;
  stepsWord: string;
  personsLabel: string;
  decreasePersonsAria: string;
  increasePersonsAria: string;
  openBookSpread: string;
  prepClipShort: string;
  cookAndTime: string;

  // Book Spread View
  customizedEdition: string;
  customizeWithAi: string;
  originalVersion: string;
  deleteRecipeAria: string;
  bookmarked: string;
  bookmark: string;
  startCookMode: string;
  preparationClips: string;
  visualStudiesCount: (count: number) => string;
  byAuthor: (author: string) => string;
  cellarPairing: string;
  recipeCardEyebrow: string;
  ingredientsAndScaling: string;
  metricShort: string;
  usShort: string;
  personCountLabel: string;
  quickScaleFromBase: (base: number, personWord: string) => string;
  kitchenMarginNotes: string;
  savedNotice: string;
  marginNotePlaceholder: string;
  stepByStepMethod: string;
  preparationTimersTitle: string;
  stepsProgress: (done: number, total: number) => string;
  markStepCompleteAria: (num: number) => string;
  chefsNotePrefix: string;
  doneLabel: string;
  pause: string;
  restart: string;
  resume: string;
  startTimerLabel: (time: string) => string;
  untimedPrepStep: string;
  watchClipPrefix: (title: string) => string;
  previousPlate: string;
  nextPlate: string;
  plateOfTotal: (idx: number, total: number) => string;
  plateLabel: (plateNumber: string) => string;

  // Cook Mode Overlay
  cookModePrefix: string;
  forPersons: (count: number, word: string) => string;
  exitCookMode: string;
  stepLabel: (num: number) => string;
  stepOfTotal: (num: number, total: number) => string;
  stepTimerDefault: string;
  untimed: string;
  startTimer: string;
  techniqueRefPrefix: (title: string) => string;
  watchClip: string;
  stepCompleted: string;
  markStepDone: string;
  previous: string;
  nextStep: string;
  miseEnPlaceEyebrow: string;
  scaledForPersons: (count: number, word: string) => string;

  // Technique Player Modal
  preparationClipPrefix: string;
  closeClipAria: string;
  targetPlate: string;
  play: string;
  loop: string;
  stagePrefix: (num: number) => string;

  // Timer Dock
  timerReady: string;
  kitchenTimersCount: (count: number) => string;
  stepShort: (num: number) => string;
  muteChimes: string;
  unmuteChimes: string;

  // Ask Recipe Modal
  newBookEntry: string;
  closeModalAria: string;
  savedToCookbook: string;
  ingredientsCountHeader: (count: number, word: string) => string;
  timedStepsHeader: (count: number) => string;
  askAnotherRecipe: string;
  openFullSpreadTimers: string;
  signInPrompt: string;
  signInGoogle: string;
  whatRecipePrompt: string;
  askPlaceholder: string;
  bookChapterField: string;
  cancel: string;
  generatingRecipe: string;
  postGetRecipe: string;

  // Customize Recipe Modal
  aiAdaptationEyebrow: string;
  customizeDishTitle: (title: string) => string;
  howToAdaptLabel: string;
  customizePlaceholder: string;
  adaptingRecipe: string;
  applyAiCustomization: string;

  // Footer & Toasts
  footerColophon: string;
  toastSavedCloud: string;
  toastSavedLocal: string;
  toastMigratedCloud: string;
  toastCustomizedCloud: string;
  toastCustomizedLocal: string;
  toastCustomUpdated: string;
  toastReverted: string;
  toastDeleted: string;
  toastSignedIn: string;
  toastSignInFailed: string;
  toastSignedOut: string;

  // Singular / Plural Person
  personSingular: string;
  personPlural: string;

  // Settings, Account & Roles
  settingsEyebrow: string;
  settingsTitle: string;
  settingsSubtitle: string;
  accountSectionTitle: string;
  languageSectionTitle: string;
  themeSectionTitle: string;
  roleLabel: string;
  roleReader: string;
  roleContributor: string;
  roleAdmin: string;
  roleReaderDesc: string;
  roleContributorDesc: string;
  roleAdminDesc: string;
  requestContributorBtn: string;
  requestContributorNoteLabel: string;
  requestContributorNotePlaceholder: string;
  requestContributorPending: string;
  requestContributorRejected: string;
  toastContributorRequested: string;
  goToSettings: string;
  contributorRequiredNotice: string;

  // Admin Page & Chapter Management
  adminEyebrow: string;
  adminTitle: string;
  adminAccessDenied: string;
  adminUsersTitle: string;
  rolesDirectoryTitle: string;
  adminChaptersTitle: string;
  pendingRequestsFilter: string;
  allUsersFilter: string;
  approveContributor: string;
  roleUpdatedToast: string;
  noUsersFound: string;
  addChapterTitle: string;
  editChapterTitle: string;
  chapterEditorEyebrow: string;
  backToAdmin: string;
  chapterSlugLabel: string;
  parentChapterLabel: string;
  noParentChapterOption: string;
  chapterSortOrderLabel: string;
  chapterTitleLabel: string;
  chapterSeasonLabel: string;
  chapterEpigraphLabel: string;
  createChapterBtn: string;
  saveChapterBtn: string;
  editBtn: string;
  deleteBtn: string;
  confirmDeleteBtn: string;
  restoreDefaultChaptersBtn: string;
  chapterCreatedToast: string;
  chapterUpdatedToast: string;
  chapterDeletedToast: string;
  addSubchapterTitle: string;
  editSubchapterTitle: string;
  addSubchapterBtn: string;
  createSubchapterBtn: string;
  subchaptersCountLabel: (count: number) => string;
  selectParentChapterHint: string;

  // Recipe Ratings & One-Liner Notes
  ratingsEyebrow: string;
  ratingsTitle: string;
  ratingsCountLabel: (count: number) => string;
  yourRatingLabel: string;
  oneLinerLabel: string;
  oneLinerPlaceholder: string;
  submitRatingBtn: string;
  updateRatingBtn: string;
  removeRatingBtn: string;
  signInToRatePrompt: string;
  noRatingsYet: string;
  ratingSavedToast: string;
  ratingDeletedToast: string;

  // Pagination & Catalog Counts
  viewAllPlatesCount: (count: number) => string;
  showingPlatesRange: (start: number, end: number, total: number) => string;
  pageOfTotal: (page: number, totalPages: number) => string;
  previousPage: string;
  nextPage: string;

  // My Recipes (Contributor Workspace)
  navMyRecipes: string;
  myRecipesEyebrow: string;
  myRecipesTitle: string;
  myRecipesSubtitle: string;
  myRecipesAccessDenied: string;
  createRecipeBtn: string;
  searchMyRecipesPlaceholder: string;
  statusAll: string;
  statusPublished: string;
  statusDraft: string;
  publishBtn: string;
  unpublishBtn: string;
  unpublishToDeleteHint: string;
  noMyRecipesTitle: string;
  noMyRecipesHint: string;
  openPlateBtn: string;
  backToMyRecipes: string;
  recipeEditorEyebrow: string;
  createRecipeTitle: string;
  editRecipeTitle: string;
  recipeTitleField: string;
  recipeSubtitleField: string;
  recipeRegionField: string;
  recipeSeasonField: string;
  recipePrepMinutesField: string;
  recipeCookMinutesField: string;
  recipeBaseServingsField: string;
  recipeChefAuthorField: string;
  recipePlateImageField: string;
  recipeFigureCaptionField: string;
  recipeExcerptField: string;
  recipeStoryField: string;
  recipePullQuoteField: string;
  recipePairingField: string;
  recipeIngredientsSection: string;
  addIngredientBtn: string;
  ingredientNamePlaceholder: string;
  metricAmountLabel: string;
  metricUnitLabel: string;
  imperialAmountLabel: string;
  imperialUnitLabel: string;
  recipeStepsSection: string;
  addStepBtn: string;
  stepTitleLabel: string;
  stepInstructionLabel: string;
  stepTimerMinutesLabel: string;
  stepTimerLabelField: string;
  stepTipLabel: string;
  saveDraftBtn: string;
  saveAndPublishBtn: string;
  saveRecipeChangesBtn: string;
  recipePublishedToast: string;
  recipeUnpublishedToast: string;
  recipeCreatedDraftToast: string;
  recipeUpdatedToast: string;
  dishCourseField: string;
  chefLoggedInHint: string;
  uploadPhotoBtn: string;
  uploadPhotoHint: string;
  processingPhotoLabel: string;
  presetPlatesLabel: string;
  unitSectionTitle: string;
  autoConvertNote: (otherSystem: string) => string;
  qtyLabel: string;
  unitLabel: string;
  seasonAllSeasons: string;
  seasonSpring: string;
  seasonSummer: string;
  seasonAutumn: string;
  seasonLateAutumn: string;
  seasonWinter: string;
  stepVideoUrlLabel: string;
  stepVideoUrlPlaceholder: string;
  invalidYouTubeUrlError: (stepNum: number) => string;
  youtubeClipHint: string;
  allCoursesLabel: string;
}

export const UI_STRINGS: Record<LanguageCode, UIStrings> = {
  en: {
    navCover: 'Home',
    navChapters: 'Recipes',
    navCards: 'Recipe Cards',
    navSaved: 'Saved',
    navSettings: 'Settings',
    navAdmin: 'Admin',
    cookMode: 'Cook Mode',
    cookModeActive: (c) => `Cook Mode · ${c} Active`,
    languageLabel: 'Language',
    themeLabel: 'Theme',
    themeClassic: 'Classic',
    themeWhitepaper: 'Whitepaper',
    themeModern: 'Modern',
    themeColorful: 'Colorful',

    openFirstPlate: 'Open Plate I',
    askChefForRecipe: 'Ask Chef for a Recipe',
    browsePlates: 'Browse Plates',
    tableOfContents: 'Table of Contents',
    chaptersIndexTitle: 'Our Kitchen Menu',
    platesSummary: (p, c, t) => `${p} Plates · ${c} Prep Clips · ${t} Timed Steps`,
    subchaptersLabel: 'Subchapters',
    allInParentChapter: (title) => `All ${title}`,
    clipsUnit: 'clips',
    minUnit: 'min',
    saveRecipeAria: 'Save recipe',
    removeBookmarkAria: 'Remove bookmark',

    personalBookmarkShelf: 'Personal Bookmark Shelf',
    seasonalBistroFolio: 'Seasonal Bistro Folio',
    savedTitle: 'Saved Recipes & Kitchen Bookmarks',
    chaptersTitle: 'Recipes',
    filterPlaceholder: 'Filter by dish or ingredient...',
    filterAria: 'Filter recipes',
    askChefShort: 'Ask Chef for Recipe',
    allChapters: 'All Recipes',
    signOut: 'Sign out',
    signInSync: 'Sign in to Sync Cookbook',
    noBookmarksTitle: 'No recipes bookmarked yet',
    noMatchesTitle: 'No matching plates found',
    noBookmarksHint: 'Use the bookmark ribbon on any dish to gather your seasonal menu in one place.',
    noMatchesHint: 'Try clearing your search term or switching back to all recipes.',
    browseSeasonalChapters: 'Browse Recipes',
    servesCount: (c) => `Serves ${c}`,
    readStoryCard: 'Read Story & Recipe Card →',
    timersCount: (c) => `${c} timers`,
    watchPrepClip: 'Watch Prep Clip',

    miseEnPlaceIndex: 'Bistro Mise en Place Index',
    collectibleCardsTitle: 'Collectible Recipe Cards',
    metricFull: 'Metric (g/ml)',
    usCustomaryFull: 'US Customary',
    filterByChapterAria: 'Filter recipe cards by course',
    prepWord: 'Prep',
    cookWord: 'Cook',
    stepsWord: 'steps',
    personsLabel: 'Persons',
    decreasePersonsAria: 'Decrease person count',
    increasePersonsAria: 'Increase person count',
    openBookSpread: 'Open Book Spread',
    prepClipShort: 'Prep Clip',
    cookAndTime: 'Cook & Time',

    customizedEdition: 'Customized Edition',
    customizeWithAi: 'Customize with AI',
    originalVersion: 'Original',
    deleteRecipeAria: 'Delete custom recipe',
    bookmarked: 'Bookmarked',
    bookmark: 'Bookmark',
    startCookMode: 'Start Cook Mode',
    preparationClips: 'Preparation Clips',
    visualStudiesCount: (c) => `${c} visual studies`,
    byAuthor: (a) => `By ${a}`,
    cellarPairing: 'Cellar & Table Pairing',
    recipeCardEyebrow: 'Recipe Card',
    ingredientsAndScaling: 'Ingredients & Scaling',
    metricShort: 'Metric',
    usShort: 'US',
    personCountLabel: 'Person Count',
    quickScaleFromBase: (b, w) => `Quick scale from base (${b} ${w})`,
    kitchenMarginNotes: 'Kitchen Margin Notes',
    savedNotice: 'Saved',
    marginNotePlaceholder: 'Jot down oven quirks, wine pairings, or seasoning adjustments...',
    stepByStepMethod: 'Step-by-Step Method',
    preparationTimersTitle: 'Preparation & Cooking Timers',
    stepsProgress: (d, t) => `${d} of ${t} steps complete`,
    markStepCompleteAria: (n) => `Mark step ${n} complete`,
    chefsNotePrefix: 'Chef’s note:',
    doneLabel: '00:00 · Done',
    pause: 'Pause',
    restart: 'Restart',
    resume: 'Resume',
    startTimerLabel: (time) => `Start ${time} Timer`,
    untimedPrepStep: 'Untimed prep step',
    watchClipPrefix: (t) => `Watch Clip: ${t}`,
    previousPlate: 'Previous Plate',
    nextPlate: 'Next Plate',
    plateOfTotal: (i, t) => `Plate ${i} of ${t}`,
    plateLabel: (p) => p,

    cookModePrefix: 'Cook Mode',
    forPersons: (c, w) => `For ${c} ${w}`,
    exitCookMode: 'Exit Cook Mode',
    stepLabel: (n) => `Step 0${n}`,
    stepOfTotal: (n, t) => `Step ${n} of ${t}`,
    stepTimerDefault: 'Step Timer',
    untimed: 'Untimed',
    startTimer: 'Start Timer',
    techniqueRefPrefix: (t) => `Technique reference: ${t}`,
    watchClip: 'Watch Clip',
    stepCompleted: 'Step Completed',
    markStepDone: 'Mark Step Done',
    previous: 'Previous',
    nextStep: 'Next Step',
    miseEnPlaceEyebrow: 'Mise en Place',
    scaledForPersons: (c, w) => `Scaled for ${c} ${w}`,

    preparationClipPrefix: 'Preparation Clip',
    closeClipAria: 'Close preparation clip',
    targetPlate: 'Target Plate',
    play: 'Play',
    loop: 'Loop',
    stagePrefix: (n) => `Stage 0${n}`,

    timerReady: 'Timer Ready',
    kitchenTimersCount: (c) => `Kitchen Timers (${c})`,
    stepShort: (n) => `Step ${n}`,
    muteChimes: 'Mute chimes',
    unmuteChimes: 'Unmute chimes',

    newBookEntry: 'New Book Entry',
    closeModalAria: 'Close modal',
    savedToCookbook: 'Saved to Cookbook',
    ingredientsCountHeader: (c, w) => `Ingredients (${c} ${w})`,
    timedStepsHeader: (c) => `Timed Steps (${c})`,
    askAnotherRecipe: 'Ask Another Recipe',
    openFullSpreadTimers: 'Open Full Book Spread & Timers',
    signInPrompt: 'Sign in with Google to save new recipes permanently to your Cookbook database.',
    signInGoogle: 'Sign in with Google',
    whatRecipePrompt: 'What recipe would you like?',
    askPlaceholder: 'Enter a dish name, seasonal ingredients you want to use, or dietary preferences...',
    bookChapterField: 'Book Chapter',
    cancel: 'Cancel',
    generatingRecipe: 'Generating Recipe...',
    postGetRecipe: 'Post & Get Recipe',

    aiAdaptationEyebrow: 'AI Recipe Adaptation',
    customizeDishTitle: (t) => `Customize “${t}”`,
    howToAdaptLabel: 'How should we adapt this dish?',
    customizePlaceholder: 'Describe the changes you want to make to ingredients, flavor profile, or cooking method...',
    adaptingRecipe: 'Adapting Recipe...',
    applyAiCustomization: 'Apply AI Customization',

    footerColophon: 'Maison Feuille · Seasonal Bistro Monograph · Rue des Martyrs Kitchen Notes',
    toastSavedCloud: 'New recipe saved to your Cookbook database.',
    toastSavedLocal: 'Recipe added! Sign in anytime to save it to the cloud database.',
    toastMigratedCloud: 'Your new recipes have been saved to your Cookbook database.',
    toastCustomizedCloud: 'Customized recipe saved to your Cookbook.',
    toastCustomizedLocal: 'Recipe customized!',
    toastCustomUpdated: 'Recipe customization updated in database.',
    toastReverted: 'Reverted to original curated recipe.',
    toastDeleted: 'Recipe removed from Cookbook.',
    toastSignedIn: 'Signed in — Cookbook synced.',
    toastSignInFailed: 'Could not complete Google sign-in.',
    toastSignedOut: 'Signed out.',

    personSingular: 'person',
    personPlural: 'persons',

    settingsEyebrow: 'Edition Preferences & Account',
    settingsTitle: 'Settings',
    settingsSubtitle: 'Manage your cookbook sign-in, contributor permissions, language, and visual paper theme.',
    accountSectionTitle: 'Account & Kitchen Rights',
    languageSectionTitle: 'Cookbook Language',
    themeSectionTitle: 'Editorial Paper Theme',
    roleLabel: 'Current Role',
    roleReader: 'Reader',
    roleContributor: 'Contributor',
    roleAdmin: 'Admin',
    roleReaderDesc: 'Full read access, personal bookmarks, step timers, and recipe ratings & notes.',
    roleContributorDesc: 'Read rights plus permission to create and customize AI recipes in the Cookbook.',
    roleAdminDesc: 'Full contributor rights plus user role management and cookbook chapter editing.',
    requestContributorBtn: 'Request Contributor Rights',
    requestContributorNoteLabel: 'Optional kitchen note for the admin',
    requestContributorNotePlaceholder: 'Share a brief note on the dishes you would like to contribute...',
    requestContributorPending: 'Contributor request pending admin review.',
    requestContributorRejected: 'Your previous contributor request was declined. You may submit a new request.',
    toastContributorRequested: 'Contributor request sent to admin.',
    goToSettings: 'Open Settings',
    contributorRequiredNotice: 'Your account currently has read rights. Request contributor rights in Settings to publish AI recipes to the database.',

    adminEyebrow: 'Editorial Administration',
    adminTitle: 'Admin Desk',
    adminAccessDenied: 'Administrator rights are required to view this page.',
    adminUsersTitle: 'Registered Users & Role Approvals',
    rolesDirectoryTitle: 'Roles',
    adminChaptersTitle: 'Cookbook Chapters',
    pendingRequestsFilter: 'Pending Requests',
    allUsersFilter: 'All Users',
    approveContributor: 'Approve Contributor',
    roleUpdatedToast: 'User role updated.',
    noUsersFound: 'No users match this filter.',
    addChapterTitle: 'Add New Chapter',
    editChapterTitle: 'Edit Chapter',
    chapterEditorEyebrow: 'Chapter Editorial Desk',
    backToAdmin: 'Back to Admin Desk',
    chapterSlugLabel: 'Chapter ID Slug',
    parentChapterLabel: 'Parent Chapter',
    noParentChapterOption: 'Top-Level Chapter',
    chapterSortOrderLabel: 'Display Order',
    chapterTitleLabel: 'Chapter Title',
    chapterSeasonLabel: 'Season & Pantry Note',
    chapterEpigraphLabel: 'Editorial Epigraph',
    createChapterBtn: 'Create Chapter',
    saveChapterBtn: 'Save Changes',
    editBtn: 'Edit',
    deleteBtn: 'Delete',
    confirmDeleteBtn: 'Confirm Delete',
    restoreDefaultChaptersBtn: 'Restore Default Chapters',
    chapterCreatedToast: 'Chapter created.',
    chapterUpdatedToast: 'Chapter updated.',
    chapterDeletedToast: 'Chapter deleted.',
    addSubchapterTitle: 'Add New Subchapter',
    editSubchapterTitle: 'Edit Subchapter',
    addSubchapterBtn: 'Add Subchapter',
    createSubchapterBtn: 'Create Subchapter',
    subchaptersCountLabel: (c) => `${c} ${c === 1 ? 'subchapter' : 'subchapters'}`,
    selectParentChapterHint: 'Select the parent chapter this subchapter belongs to.',

    ratingsEyebrow: 'Table Notes & Praise',
    ratingsTitle: 'Reader Ratings & Kitchen Notes',
    ratingsCountLabel: (c) => `${c} ${c === 1 ? 'review' : 'reviews'}`,
    yourRatingLabel: 'Your Rating',
    oneLinerLabel: 'Optional one-liner note',
    oneLinerPlaceholder: 'e.g. I love this, Delicious, Crispy skin perfection...',
    submitRatingBtn: 'Post Rating',
    updateRatingBtn: 'Update Rating',
    removeRatingBtn: 'Remove',
    signInToRatePrompt: 'Sign in on Settings to rate this dish and leave a one-liner note.',
    noRatingsYet: 'No reader ratings yet. Be the first to leave a note.',
    ratingSavedToast: 'Your rating and note have been saved.',
    ratingDeletedToast: 'Rating removed.',

    viewAllPlatesCount: (c) => `View all ${c} plates →`,
    showingPlatesRange: (s, e, total) => `Showing ${s}–${e} of ${total} plates`,
    pageOfTotal: (p, t) => `Page ${p} of ${t}`,
    previousPage: 'Previous',
    nextPage: 'Next',

    navMyRecipes: 'My Recipes',
    myRecipesEyebrow: 'Contributor Kitchen Desk',
    myRecipesTitle: 'My Recipes',
    myRecipesSubtitle: 'Search, create, update, and publish your original plates. Unpublish a recipe before deleting it.',
    myRecipesAccessDenied: 'Contributor or administrator rights are required to manage your own recipes.',
    createRecipeBtn: 'Create Recipe',
    searchMyRecipesPlaceholder: 'Search your recipes by title, chapter, or ingredient...',
    statusAll: 'All',
    statusPublished: 'Published',
    statusDraft: 'Unpublished',
    publishBtn: 'Publish',
    unpublishBtn: 'Unpublish',
    unpublishToDeleteHint: 'Unpublish first to enable deletion',
    noMyRecipesTitle: 'No recipes in your contributor desk yet',
    noMyRecipesHint: 'Create your first original recipe or ask the Chef to compose a new dish.',
    openPlateBtn: 'Open Plate',
    backToMyRecipes: 'Back to My Recipes',
    recipeEditorEyebrow: 'Contributor Recipe Folio',
    createRecipeTitle: 'Create New Recipe',
    editRecipeTitle: 'Update Recipe',
    recipeTitleField: 'Dish Title',
    recipeSubtitleField: 'Editorial Subtitle',
    recipeRegionField: 'Culinary Region',
    recipeSeasonField: 'Season',
    recipePrepMinutesField: 'Prep (min)',
    recipeCookMinutesField: 'Cook (min)',
    recipeBaseServingsField: 'Base Persons',
    recipeChefAuthorField: 'Chef / Author',
    recipePlateImageField: 'Editorial Plate Illustration',
    recipeFigureCaptionField: 'Plate Caption',
    recipeExcerptField: 'Short Story Excerpt',
    recipeStoryField: 'Kitchen Story Paragraphs',
    recipePullQuoteField: 'Pull Quote',
    recipePairingField: 'Cellar & Table Pairing',
    recipeIngredientsSection: 'Ingredients',
    addIngredientBtn: 'Add Ingredient',
    ingredientNamePlaceholder: 'Ingredient name & prep note...',
    metricAmountLabel: 'Metric Qty',
    metricUnitLabel: 'Metric Unit',
    imperialAmountLabel: 'US Qty',
    imperialUnitLabel: 'US Unit',
    recipeStepsSection: 'Preparation Steps',
    addStepBtn: 'Add Step',
    stepTitleLabel: 'Step Title',
    stepInstructionLabel: 'Instruction',
    stepTimerMinutesLabel: 'Timer (min)',
    stepTimerLabelField: 'Timer Label',
    stepTipLabel: 'Chef Tip (optional)',
    saveDraftBtn: 'Save as Unpublished',
    saveAndPublishBtn: 'Save & Publish',
    saveRecipeChangesBtn: 'Save Changes',
    recipePublishedToast: 'Recipe published to the cookbook.',
    recipeUnpublishedToast: 'Recipe unpublished and moved to drafts.',
    recipeCreatedDraftToast: 'Unpublished draft recipe saved.',
    recipeUpdatedToast: 'Recipe updated.',
    dishCourseField: 'Dish Course',
    chefLoggedInHint: 'Signed-in chef',
    uploadPhotoBtn: 'Upload Photo',
    uploadPhotoHint: 'Upload a JPG, PNG, or WebP dish photo, or choose a studio plate below.',
    processingPhotoLabel: 'Optimizing photo...',
    presetPlatesLabel: 'Or choose a curated plate',
    unitSectionTitle: 'Measurement Units',
    autoConvertNote: (other) => `Auto-converts to ${other}`,
    qtyLabel: 'Qty',
    unitLabel: 'Unit',
    seasonAllSeasons: 'All Seasons',
    seasonSpring: 'Spring',
    seasonSummer: 'Summer',
    seasonAutumn: 'Autumn',
    seasonLateAutumn: 'Late Autumn',
    seasonWinter: 'Winter',
    stepVideoUrlLabel: 'YouTube Video Link (Optional)',
    stepVideoUrlPlaceholder: 'https://www.youtube.com/watch?v=...',
    invalidYouTubeUrlError: (stepNum) =>
      `Step ${stepNum}: please enter a valid YouTube link or leave it blank.`,
    youtubeClipHint: 'YouTube Video',
    allCoursesLabel: 'All Courses',
  },

  nl: {
    navCover: 'Home',
    navChapters: 'Recepten',
    navCards: 'Receptkaarten',
    navSaved: 'Bewaard',
    navSettings: 'Instellingen',
    navAdmin: 'Beheer',
    cookMode: 'Kookmodus',
    cookModeActive: (c) => `Kookmodus · ${c} Actief`,
    languageLabel: 'Taal',
    themeLabel: 'Thema',
    themeClassic: 'Klassiek',
    themeWhitepaper: 'Wit papier',
    themeModern: 'Modern',
    themeColorful: 'Kleurrijk',

    openFirstPlate: 'Open Plaat I',
    askChefForRecipe: 'Vraag de Chef om een Recept',
    browsePlates: 'Bekijk Gerechten',
    tableOfContents: 'Inhoudsopgave',
    chaptersIndexTitle: 'Ons Keukenmenu',
    platesSummary: (p, c, t) => `${p} Gerechten · ${c} Techniekclips · ${t} Kooktimers`,
    subchaptersLabel: 'Subhoofdstukken',
    allInParentChapter: (title) => `Alle ${title}`,
    clipsUnit: 'clips',
    minUnit: 'min',
    saveRecipeAria: 'Recept bewaren',
    removeBookmarkAria: 'Bladwijzer verwijderen',

    personalBookmarkShelf: 'Persoonlijke Bladwijzers',
    seasonalBistroFolio: 'Seizoensbistro Folio',
    savedTitle: 'Bewaarde Recepten & Keukenbladwijzers',
    chaptersTitle: 'Recepten',
    filterPlaceholder: 'Filter op gerecht of ingrediënt...',
    filterAria: 'Recepten filteren',
    askChefShort: 'Vraag Recept aan Chef',
    allChapters: 'Alle recepten',
    signOut: 'Uitloggen',
    signInSync: 'Inloggen om Kookboek te Synchroniseren',
    noBookmarksTitle: 'Nog geen recepten bewaard',
    noMatchesTitle: 'Geen overeenkomende gerechten',
    noBookmarksHint: 'Gebruik het bladwijzerlint bij elk gerecht om je seizoensmenu te verzamelen.',
    noMatchesHint: 'Wis de zoekterm of ga terug naar alle recepten.',
    browseSeasonalChapters: 'Bekijk Recepten',
    servesCount: (c) => `Voor ${c}`,
    readStoryCard: 'Lees Verhaal & Receptkaart →',
    timersCount: (c) => `${c} timers`,
    watchPrepClip: 'Bekijk Bereidingsclip',

    miseEnPlaceIndex: 'Bistro Mise en Place Index',
    collectibleCardsTitle: 'Verzamelbare Receptkaarten',
    metricFull: 'Metriek (g/ml)',
    usCustomaryFull: 'VS Maten',
    filterByChapterAria: 'Filter receptkaarten op gang',
    prepWord: 'Voorb.',
    cookWord: 'Koken',
    stepsWord: 'stappen',
    personsLabel: 'Personen',
    decreasePersonsAria: 'Aantal personen verlagen',
    increasePersonsAria: 'Aantal personen verhogen',
    openBookSpread: 'Open Boekpagina',
    prepClipShort: 'Techniekclip',
    cookAndTime: 'Koken & Timer',

    customizedEdition: 'Aangepaste Editie',
    customizeWithAi: 'Aanpassen met AI',
    originalVersion: 'Origineel',
    deleteRecipeAria: 'Aangepast recept verwijderen',
    bookmarked: 'Bewaard',
    bookmark: 'Bewaren',
    startCookMode: 'Start Kookmodus',
    preparationClips: 'Bereidingsclips',
    visualStudiesCount: (c) => `${c} visuele studies`,
    byAuthor: (a) => `Door ${a}`,
    cellarPairing: 'Kelder & Tafelcombinatie',
    recipeCardEyebrow: 'Receptkaart',
    ingredientsAndScaling: 'Ingrediënten & Schalen',
    metricShort: 'Metriek',
    usShort: 'VS',
    personCountLabel: 'Aantal Personen',
    quickScaleFromBase: (b, w) => `Snel schalen vanaf basis (${b} ${w})`,
    kitchenMarginNotes: 'Keukennotities in de Marge',
    savedNotice: 'Opgeslagen',
    marginNotePlaceholder: 'Noteer oventemperaturen, wijnpairings of kruidenaanpassingen...',
    stepByStepMethod: 'Stap-voor-Stap Methode',
    preparationTimersTitle: 'Bereiding & Kooktimers',
    stepsProgress: (d, t) => `${d} van ${t} stappen voltooid`,
    markStepCompleteAria: (n) => `Markeer stap ${n} als voltooid`,
    chefsNotePrefix: 'Tip van de chef:',
    doneLabel: '00:00 · Klaar',
    pause: 'Pauze',
    restart: 'Herstart',
    resume: 'Hervat',
    startTimerLabel: (time) => `Start ${time} Timer`,
    untimedPrepStep: 'Voorbereidingsstap zonder timer',
    watchClipPrefix: (t) => `Bekijk Clip: ${t}`,
    previousPlate: 'Vorig Gerecht',
    nextPlate: 'Volgend Gerecht',
    plateOfTotal: (i, t) => `Plaat ${i} van ${t}`,
    plateLabel: (p) => p.replace('Plate ', 'Plaat '),

    cookModePrefix: 'Kookmodus',
    forPersons: (c, w) => `Voor ${c} ${w}`,
    exitCookMode: 'Sluit Kookmodus',
    stepLabel: (n) => `Stap 0${n}`,
    stepOfTotal: (n, t) => `Stap ${n} van ${t}`,
    stepTimerDefault: 'Staptimer',
    untimed: 'Zonder timer',
    startTimer: 'Start Timer',
    techniqueRefPrefix: (t) => `Techniekreferentie: ${t}`,
    watchClip: 'Bekijk Clip',
    stepCompleted: 'Stap Voltooid',
    markStepDone: 'Markeer Klaar',
    previous: 'Vorige',
    nextStep: 'Volgende Stap',
    miseEnPlaceEyebrow: 'Mise en Place',
    scaledForPersons: (c, w) => `Geschaald voor ${c} ${w}`,

    preparationClipPrefix: 'Bereidingsclip',
    closeClipAria: 'Sluit bereidingsclip',
    targetPlate: 'Doelgerecht',
    play: 'Afspelen',
    loop: 'Herhalen',
    stagePrefix: (n) => `Fase 0${n}`,

    timerReady: 'Timer Klaar',
    kitchenTimersCount: (c) => `Keukentimers (${c})`,
    stepShort: (n) => `Stap ${n}`,
    muteChimes: 'Geluid dempen',
    unmuteChimes: 'Geluid aanzetten',

    newBookEntry: 'Nieuw Boekrecept',
    closeModalAria: 'Venster sluiten',
    savedToCookbook: 'Opgeslagen in Kookboek',
    ingredientsCountHeader: (c, w) => `Ingrediënten (${c} ${w})`,
    timedStepsHeader: (c) => `Stappen met Timer (${c})`,
    askAnotherRecipe: 'Nog een Recept Vragen',
    openFullSpreadTimers: 'Open Volledig Recept & Timers',
    signInPrompt: 'Log in met Google om nieuwe recepten permanent op te slaan in je Kookboek-database.',
    signInGoogle: 'Inloggen met Google',
    whatRecipePrompt: 'Welk recept wil je maken?',
    askPlaceholder: 'Voer een gerechtnaam, seizoensingrediënten of dieetwensen in...',
    bookChapterField: 'Hoofdstuk',
    cancel: 'Annuleren',
    generatingRecipe: 'Recept wordt samengesteld...',
    postGetRecipe: 'Plaats & Haal Recept Op',

    aiAdaptationEyebrow: 'AI Receptaanpassing',
    customizeDishTitle: (t) => `Pas “${t}” aan`,
    howToAdaptLabel: 'Hoe wil je dit gerecht aanpassen?',
    customizePlaceholder: 'Beschrijf de wijzigingen voor ingrediënten, smaakprofiel of bereidingswijze...',
    adaptingRecipe: 'Recept aanpassen...',
    applyAiCustomization: 'AI-aanpassing Toepassen',

    footerColophon: 'Maison Feuille · Seizoensbistro Monografie · Rue des Martyrs Keukennotities',
    toastSavedCloud: 'Nieuw recept opgeslagen in je Kookboek-database.',
    toastSavedLocal: 'Recept toegevoegd! Log in om het in de cloud op te slaan.',
    toastMigratedCloud: 'Je nieuwe recepten zijn opgeslagen in je Kookboek-database.',
    toastCustomizedCloud: 'Aangepast recept opgeslagen in je Kookboek.',
    toastCustomizedLocal: 'Recept aangepast!',
    toastCustomUpdated: 'Receptaanpassing bijgewerkt in database.',
    toastReverted: 'Teruggezet naar het originele recept.',
    toastDeleted: 'Recept verwijderd uit het Kookboek.',
    toastSignedIn: 'Ingelogd — Kookboek gesynchroniseerd.',
    toastSignInFailed: 'Google-aanmelding kon niet worden voltooid.',
    toastSignedOut: 'Uitgelogd.',

    personSingular: 'persoon',
    personPlural: 'personen',

    settingsEyebrow: 'Editievoorkeuren & Account',
    settingsTitle: 'Instellingen',
    settingsSubtitle: 'Beheer je aanmelding, schrijversrechten, taal en visueel papierthema.',
    accountSectionTitle: 'Account & Keukenrechten',
    languageSectionTitle: 'Taal van het Kookboek',
    themeSectionTitle: 'Papierthema',
    roleLabel: 'Huidige rol',
    roleReader: 'Lezer',
    roleContributor: 'Bijdrager',
    roleAdmin: 'Beheerder',
    roleReaderDesc: 'Volledige leesrechten, bladwijzers, kooktimers en beoordelingen met korte notitie.',
    roleContributorDesc: 'Leesrechten plus rechten om AI-recepten te maken en aan te passen in het Kookboek.',
    roleAdminDesc: 'Alle bijdragersrechten plus gebruikersrollen beheren en hoofdstukken bewerken.',
    requestContributorBtn: 'Bijdragersrechten Aanvragen',
    requestContributorNoteLabel: 'Optionele toelichting voor de beheerder',
    requestContributorNotePlaceholder: 'Beschrijf kort welke gerechten je wilt toevoegen...',
    requestContributorPending: 'Aanvraag voor bijdragersrechten wacht op goedkeuring.',
    requestContributorRejected: 'Je eerdere aanvraag is afgewezen. Je kunt opnieuw een verzoek indienen.',
    toastContributorRequested: 'Aanvraag voor bijdragersrechten verzonden.',
    goToSettings: 'Open Instellingen',
    contributorRequiredNotice: 'Je account heeft momenteel leesrechten. Vraag bijdragersrechten aan bij Instellingen om AI-recepten op te slaan.',

    adminEyebrow: 'Redactie & Beheer',
    adminTitle: 'Beheerderspagina',
    adminAccessDenied: 'Beheerdersrechten zijn vereist om deze pagina te openen.',
    adminUsersTitle: 'Gebruikers & Rolgoedkeuringen',
    rolesDirectoryTitle: 'Rollen',
    adminChaptersTitle: 'Hoofdstukken',
    pendingRequestsFilter: 'Openstaande Aanvragen',
    allUsersFilter: 'Alle Gebruikers',
    approveContributor: 'Bijdrager Goedkeuren',
    roleUpdatedToast: 'Gebruikersrol bijgewerkt.',
    noUsersFound: 'Geen gebruikers gevonden.',
    addChapterTitle: 'Nieuw Hoofdstuk Toevoegen',
    editChapterTitle: 'Hoofdstuk Bewerken',
    chapterEditorEyebrow: 'Hoofdstuk Redactie',
    backToAdmin: 'Terug naar Beheer',
    chapterSlugLabel: 'Hoofdstuk-ID (slug)',
    parentChapterLabel: 'Bovenliggend Hoofdstuk',
    noParentChapterOption: 'Hoofdhoofdstuk',
    chapterSortOrderLabel: 'Volgorde',
    chapterTitleLabel: 'Titel van Hoofdstuk',
    chapterSeasonLabel: 'Seizoen- & Keukennotitie',
    chapterEpigraphLabel: 'Epigraaf / Omschrijving',
    createChapterBtn: 'Hoofdstuk Aanmaken',
    saveChapterBtn: 'Wijzigingen Opslaan',
    editBtn: 'Bewerken',
    deleteBtn: 'Verwijderen',
    confirmDeleteBtn: 'Bevestig Verwijderen',
    restoreDefaultChaptersBtn: 'Standaardhoofdstukken Herstellen',
    chapterCreatedToast: 'Hoofdstuk aangemaakt.',
    chapterUpdatedToast: 'Hoofdstuk bijgewerkt.',
    chapterDeletedToast: 'Hoofdstuk verwijderd.',
    addSubchapterTitle: 'Nieuw Subhoofdstuk Toevoegen',
    editSubchapterTitle: 'Subhoofdstuk Bewerken',
    addSubchapterBtn: 'Subhoofdstuk Toevoegen',
    createSubchapterBtn: 'Subhoofdstuk Aanmaken',
    subchaptersCountLabel: (c) => `${c} ${c === 1 ? 'subhoofdstuk' : 'subhoofdstukken'}`,
    selectParentChapterHint: 'Kies het hoofdhoofdstuk waaronder dit subhoofdstuk valt.',

    ratingsEyebrow: 'Tafelnotities & Waardering',
    ratingsTitle: 'Beoordelingen & Korte Notities',
    ratingsCountLabel: (c) => `${c} ${c === 1 ? 'beoordeling' : 'beoordelingen'}`,
    yourRatingLabel: 'Jouw Beoordeling',
    oneLinerLabel: 'Optionele oneliner',
    oneLinerPlaceholder: 'bijv. Ik hou hiervan, Heerlijk, Perfect gebakken...',
    submitRatingBtn: 'Beoordeling Plaatsen',
    updateRatingBtn: 'Beoordeling Bijwerken',
    removeRatingBtn: 'Verwijderen',
    signInToRatePrompt: 'Log in bij Instellingen om dit recept te beoordelen en een korte notitie te plaatsen.',
    noRatingsYet: 'Nog geen beoordelingen. Plaats als eerste een korte notitie.',
    ratingSavedToast: 'Je beoordeling en notitie zijn opgeslagen.',
    ratingDeletedToast: 'Beoordeling verwijderd.',

    viewAllPlatesCount: (c) => `Bekijk alle ${c} gerechten →`,
    showingPlatesRange: (s, e, total) => `${s}–${e} van ${total} gerechten`,
    pageOfTotal: (p, t) => `Pagina ${p} van ${t}`,
    previousPage: 'Vorige',
    nextPage: 'Volgende',

    navMyRecipes: 'Mijn Recepten',
    myRecipesEyebrow: 'Redactie voor Bijdragers',
    myRecipesTitle: 'Mijn Recepten',
    myRecipesSubtitle: 'Zoek, maak, werk bij en publiceer je eigen gerechten. Maak een recept eerst ongepubliceerd voordat je het verwijdert.',
    myRecipesAccessDenied: 'Bijdragers- of beheerdersrechten zijn vereist om eigen recepten te beheren.',
    createRecipeBtn: 'Recept Aanmaken',
    searchMyRecipesPlaceholder: 'Zoek in je recepten op titel, hoofdstuk of ingrediënt...',
    statusAll: 'Alle',
    statusPublished: 'Gepubliceerd',
    statusDraft: 'Ongepubliceerd',
    publishBtn: 'Publiceren',
    unpublishBtn: 'Publicatie intrekken',
    unpublishToDeleteHint: 'Maak eerst ongepubliceerd om te kunnen verwijderen',
    noMyRecipesTitle: 'Nog geen eigen recepten',
    noMyRecipesHint: 'Maak je eerste recept aan of vraag de Chef om een nieuw gerecht samen te stellen.',
    openPlateBtn: 'Open Plaat',
    backToMyRecipes: 'Terug naar Mijn Recepten',
    recipeEditorEyebrow: 'Receptenfolio van Bijdrager',
    createRecipeTitle: 'Nieuw Recept Aanmaken',
    editRecipeTitle: 'Recept Bijwerken',
    recipeTitleField: 'Gerechttitel',
    recipeSubtitleField: 'Ondertitel',
    recipeRegionField: 'Regio',
    recipeSeasonField: 'Seizoen',
    recipePrepMinutesField: 'Voorb. (min)',
    recipeCookMinutesField: 'Koken (min)',
    recipeBaseServingsField: 'Basispersonen',
    recipeChefAuthorField: 'Chef / Auteur',
    recipePlateImageField: 'Foto / Illustratie',
    recipeFigureCaptionField: 'Onderschrift',
    recipeExcerptField: 'Korte Samenvatting',
    recipeStoryField: 'Keukenverhaal',
    recipePullQuoteField: 'Citaat',
    recipePairingField: 'Wijn- & Tafelcombinatie',
    recipeIngredientsSection: 'Ingrediënten',
    addIngredientBtn: 'Ingrediënt Toevoegen',
    ingredientNamePlaceholder: 'Naam en snijwijze...',
    metricAmountLabel: 'Metriek Aantal',
    metricUnitLabel: 'Eenheid',
    imperialAmountLabel: 'VS Aantal',
    imperialUnitLabel: 'VS Eenheid',
    recipeStepsSection: 'Bereidingsstappen',
    addStepBtn: 'Stap Toevoegen',
    stepTitleLabel: 'Staptitel',
    stepInstructionLabel: 'Instructie',
    stepTimerMinutesLabel: 'Timer (min)',
    stepTimerLabelField: 'Timerlabel',
    stepTipLabel: 'Keukentip (optioneel)',
    saveDraftBtn: 'Opslaan als Ongepubliceerd',
    saveAndPublishBtn: 'Opslaan & Publiceren',
    saveRecipeChangesBtn: 'Wijzigingen Opslaan',
    recipePublishedToast: 'Recept gepubliceerd in het kookboek.',
    recipeUnpublishedToast: 'Publicatie ingetrokken; recept is nu een concept.',
    recipeCreatedDraftToast: 'Ongepubliceerd recept opgeslagen.',
    recipeUpdatedToast: 'Recept bijgewerkt.',
    dishCourseField: 'Gerechtsgang',
    chefLoggedInHint: 'Ingelogde chef',
    uploadPhotoBtn: 'Foto uploaden',
    uploadPhotoHint: 'Upload een foto van het gerecht (JPG, PNG, WebP) of kies hieronder een plaat.',
    processingPhotoLabel: 'Foto optimaliseren...',
    presetPlatesLabel: 'Of kies een samengestelde plaat',
    unitSectionTitle: 'Maateenheden',
    autoConvertNote: (other) => `Wordt automatisch omgerekend naar ${other}`,
    qtyLabel: 'Aantal',
    unitLabel: 'Eenheid',
    seasonAllSeasons: 'Alle seizoenen',
    seasonSpring: 'Lente',
    seasonSummer: 'Zomer',
    seasonAutumn: 'Herfst',
    seasonLateAutumn: 'Late herfst',
    seasonWinter: 'Winter',
    stepVideoUrlLabel: 'YouTube-videolink (optioneel)',
    stepVideoUrlPlaceholder: 'https://www.youtube.com/watch?v=...',
    invalidYouTubeUrlError: (stepNum) =>
      `Stap ${stepNum}: vul een geldige YouTube-link in of laat dit veld leeg.`,
    youtubeClipHint: 'YouTube-video',
    allCoursesLabel: 'Alle recepten',
  },

  fr: {
    navCover: 'Accueil',
    navChapters: 'Recettes',
    navCards: 'Fiches Recettes',
    navSaved: 'Favoris',
    navSettings: 'Paramètres',
    navAdmin: 'Admin',
    cookMode: 'Mode Cuisine',
    cookModeActive: (c) => `Mode Cuisine · ${c} Actif${c > 1 ? 's' : ''}`,
    languageLabel: 'Langue',
    themeLabel: 'Thème',
    themeClassic: 'Classique',
    themeWhitepaper: 'Papier blanc',
    themeModern: 'Moderne',
    themeColorful: 'Coloré',

    openFirstPlate: 'Ouvrir Planche I',
    askChefForRecipe: 'Demander une Recette au Chef',
    browsePlates: 'Parcourir les Plats',
    tableOfContents: 'Table des Matières',
    chaptersIndexTitle: 'La Carte de Notre Cuisine',
    platesSummary: (p, c, t) => `${p} Plats · ${c} Clips Techniques · ${t} Minuteurs`,
    subchaptersLabel: 'Sous-chapitres',
    allInParentChapter: (title) => `Tout · ${title}`,
    clipsUnit: 'clips',
    minUnit: 'min',
    saveRecipeAria: 'Enregistrer la recette',
    removeBookmarkAria: 'Retirer le signet',

    personalBookmarkShelf: 'Étagère de Signets',
    seasonalBistroFolio: 'Folio Bistrot de Saison',
    savedTitle: 'Recettes Enregistrées & Signets',
    chaptersTitle: 'Recettes',
    filterPlaceholder: 'Filtrer par plat ou ingrédient...',
    filterAria: 'Filtrer les recettes',
    askChefShort: 'Demander au Chef',
    allChapters: 'Toutes les Recettes',
    signOut: 'Déconnexion',
    signInSync: 'Se connecter pour Synchroniser',
    noBookmarksTitle: 'Aucune recette enregistrée',
    noMatchesTitle: 'Aucun plat correspondant',
    noBookmarksHint: 'Utilisez le ruban signet sur n’importe quel plat pour composer votre menu.',
    noMatchesHint: 'Effacez votre recherche ou revenez à toutes les recettes.',
    browseSeasonalChapters: 'Parcourir les Recettes',
    servesCount: (c) => `Pour ${c}`,
    readStoryCard: 'Lire le Récit & la Fiche →',
    timersCount: (c) => `${c} minuteurs`,
    watchPrepClip: 'Voir le Geste Technique',

    miseEnPlaceIndex: 'Index Mise en Place',
    collectibleCardsTitle: 'Fiches Recettes de Collection',
    metricFull: 'Métrique (g/ml)',
    usCustomaryFull: 'Mesures US',
    filterByChapterAria: 'Filtrer les fiches par service',
    prepWord: 'Prép.',
    cookWord: 'Cuisson',
    stepsWord: 'étapes',
    personsLabel: 'Personnes',
    decreasePersonsAria: 'Réduire le nombre de personnes',
    increasePersonsAria: 'Augmenter le nombre de personnes',
    openBookSpread: 'Ouvrir la Double Page',
    prepClipShort: 'Clip Geste',
    cookAndTime: 'Cuisiner & Chronos',

    customizedEdition: 'Édition Personnalisée',
    customizeWithAi: 'Personnaliser avec l’IA',
    originalVersion: 'Original',
    deleteRecipeAria: 'Supprimer la recette personnalisée',
    bookmarked: 'Enregistré',
    bookmark: 'Signet',
    startCookMode: 'Lancer Mode Cuisine',
    preparationClips: 'Clips de Préparation',
    visualStudiesCount: (c) => `${c} études visuelles`,
    byAuthor: (a) => `Par ${a}`,
    cellarPairing: 'Accord Cave & Table',
    recipeCardEyebrow: 'Fiche Recette',
    ingredientsAndScaling: 'Ingrédients & Proportions',
    metricShort: 'Métrique',
    usShort: 'US',
    personCountLabel: 'Nombre de Personnes',
    quickScaleFromBase: (b, w) => `Ajustement rapide depuis la base (${b} ${w})`,
    kitchenMarginNotes: 'Notes de Marge en Cuisine',
    savedNotice: 'Enregistré',
    marginNotePlaceholder: 'Notez les particularités du four, accords vins ou assaisonnements...',
    stepByStepMethod: 'Méthode Étape par Étape',
    preparationTimersTitle: 'Préparation & Minuteurs',
    stepsProgress: (d, t) => `${d} sur ${t} étapes terminées`,
    markStepCompleteAria: (n) => `Marquer l’étape ${n} comme terminée`,
    chefsNotePrefix: 'Note du chef :',
    doneLabel: '00:00 · Terminé',
    pause: 'Pause',
    restart: 'Relancer',
    resume: 'Reprendre',
    startTimerLabel: (time) => `Démarrer Chrono ${time}`,
    untimedPrepStep: 'Étape de préparation sans chrono',
    watchClipPrefix: (t) => `Voir le Clip : ${t}`,
    previousPlate: 'Planche Précédente',
    nextPlate: 'Planche Suivante',
    plateOfTotal: (i, t) => `Planche ${i} sur ${t}`,
    plateLabel: (p) => p.replace('Plate ', 'Planche '),

    cookModePrefix: 'Mode Cuisine',
    forPersons: (c, w) => `Pour ${c} ${w}`,
    exitCookMode: 'Quitter le Mode Cuisine',
    stepLabel: (n) => `Étape 0${n}`,
    stepOfTotal: (n, t) => `Étape ${n} sur ${t}`,
    stepTimerDefault: 'Minuteur d’étape',
    untimed: 'Libre',
    startTimer: 'Lancer Chrono',
    techniqueRefPrefix: (t) => `Référence technique : ${t}`,
    watchClip: 'Voir le Clip',
    stepCompleted: 'Étape Terminée',
    markStepDone: 'Marquer Fait',
    previous: 'Précédent',
    nextStep: 'Étape Suivante',
    miseEnPlaceEyebrow: 'Mise en Place',
    scaledForPersons: (c, w) => `Calculé pour ${c} ${w}`,

    preparationClipPrefix: 'Clip Technique',
    closeClipAria: 'Fermer le clip technique',
    targetPlate: 'Assiette Cible',
    play: 'Lire',
    loop: 'Boucle',
    stagePrefix: (n) => `Phase 0${n}`,

    timerReady: 'Minuteur Prêt',
    kitchenTimersCount: (c) => `Minuteurs Cuisine (${c})`,
    stepShort: (n) => `Étape ${n}`,
    muteChimes: 'Couper la sonnerie',
    unmuteChimes: 'Activer la sonnerie',

    newBookEntry: 'Nouvelle Entrée',
    closeModalAria: 'Fermer la fenêtre',
    savedToCookbook: 'Enregistré dans le Livre',
    ingredientsCountHeader: (c, w) => `Ingrédients (${c} ${w})`,
    timedStepsHeader: (c) => `Étapes Chronométrées (${c})`,
    askAnotherRecipe: 'Demander une Autre Recette',
    openFullSpreadTimers: 'Ouvrir la Double Page & Minuteurs',
    signInPrompt: 'Connectez-vous avec Google pour enregistrer vos nouvelles recettes durablement.',
    signInGoogle: 'Connexion Google',
    whatRecipePrompt: 'Quelle recette souhaitez-vous cuisiner ?',
    askPlaceholder: 'Indiquez un nom de plat, des ingrédients de saison ou vos préférences alimentaires...',
    bookChapterField: 'Chapitre du Livre',
    cancel: 'Annuler',
    generatingRecipe: 'Création de la recette...',
    postGetRecipe: 'Publier & Obtenir la Recette',

    aiAdaptationEyebrow: 'Adaptation IA',
    customizeDishTitle: (t) => `Personnaliser « ${t} »`,
    howToAdaptLabel: 'Comment souhaitez-vous adapter ce plat ?',
    customizePlaceholder: 'Décrivez les ajustements d’ingrédients, de saveurs ou de méthode de cuisson...',
    adaptingRecipe: 'Adaptation en cours...',
    applyAiCustomization: 'Appliquer l’Adaptation IA',

    footerColophon: 'Maison Feuille · Monographie Bistrot de Saison · Carnets Rue des Martyrs',
    toastSavedCloud: 'Nouvelle recette enregistrée dans votre base de données.',
    toastSavedLocal: 'Recette ajoutée ! Connectez-vous pour la synchroniser.',
    toastMigratedCloud: 'Vos nouvelles recettes ont été enregistrées dans le cloud.',
    toastCustomizedCloud: 'Recette personnalisée enregistrée dans votre livre.',
    toastCustomizedLocal: 'Recette personnalisée !',
    toastCustomUpdated: 'Adaptation mise à jour dans la base de données.',
    toastReverted: 'Recette restaurée à la version originale.',
    toastDeleted: 'Recette supprimée du livre.',
    toastSignedIn: 'Connecté — Livre de cuisine synchronisé.',
    toastSignInFailed: 'Échec de la connexion Google.',
    toastSignedOut: 'Déconnecté.',

    personSingular: 'personne',
    personPlural: 'personnes',

    settingsEyebrow: 'Préférences & Compte',
    settingsTitle: 'Paramètres',
    settingsSubtitle: 'Gérez votre connexion, vos droits de contributeur, la langue et le thème du livre.',
    accountSectionTitle: 'Compte & Droits de Cuisine',
    languageSectionTitle: 'Langue du Livre',
    themeSectionTitle: 'Thème de Papier',
    roleLabel: 'Rôle actuel',
    roleReader: 'Lecteur',
    roleContributor: 'Contributeur',
    roleAdmin: 'Administrateur',
    roleReaderDesc: 'Droits de lecture complets, signets personnels, minuteurs et avis en une ligne.',
    roleContributorDesc: 'Droits de lecture plus création et personnalisation de recettes IA.',
    roleAdminDesc: 'Droits complets incluant la gestion des rôles et l’édition des chapitres.',
    requestContributorBtn: 'Demander les Droits Contributeur',
    requestContributorNoteLabel: 'Note optionnelle pour l’administrateur',
    requestContributorNotePlaceholder: 'Précisez les recettes que vous souhaitez partager...',
    requestContributorPending: 'Votre demande de contributeur est en attente de validation.',
    requestContributorRejected: 'Votre demande précédente a été refusée. Vous pouvez soumettre une nouvelle demande.',
    toastContributorRequested: 'Demande de contributeur envoyée.',
    goToSettings: 'Ouvrir les Paramètres',
    contributorRequiredNotice: 'Votre compte dispose actuellement de droits de lecture. Demandez les droits contributeur dans les Paramètres.',

    adminEyebrow: 'Administration Éditoriale',
    adminTitle: 'Espace Admin',
    adminAccessDenied: 'Des droits d’administrateur sont requis pour accéder à cette page.',
    adminUsersTitle: 'Utilisateurs & Approbation des Rôles',
    rolesDirectoryTitle: 'Rôles',
    adminChaptersTitle: 'Chapitres du Livre',
    pendingRequestsFilter: 'Demandes en Attente',
    allUsersFilter: 'Tous les Utilisateurs',
    approveContributor: 'Approuver Contributeur',
    roleUpdatedToast: 'Rôle utilisateur mis à jour.',
    noUsersFound: 'Aucun utilisateur trouvé.',
    addChapterTitle: 'Ajouter un Chapitre',
    editChapterTitle: 'Modifier le Chapitre',
    chapterEditorEyebrow: 'Édition de Chapitre',
    backToAdmin: 'Retour à l’Espace Admin',
    chapterSlugLabel: 'Identifiant du Chapitre',
    parentChapterLabel: 'Chapitre Parent',
    noParentChapterOption: 'Chapitre Principal',
    chapterSortOrderLabel: 'Ordre d’affichage',
    chapterTitleLabel: 'Titre du Chapitre',
    chapterSeasonLabel: 'Note de Saison',
    chapterEpigraphLabel: 'Épigraphe Éditoriale',
    createChapterBtn: 'Créer le Chapitre',
    saveChapterBtn: 'Enregistrer',
    editBtn: 'Modifier',
    deleteBtn: 'Supprimer',
    confirmDeleteBtn: 'Confirmer',
    restoreDefaultChaptersBtn: 'Restaurer les Chapitres par Défaut',
    chapterCreatedToast: 'Chapitre créé.',
    chapterUpdatedToast: 'Chapitre mis à jour.',
    chapterDeletedToast: 'Chapitre supprimé.',
    addSubchapterTitle: 'Ajouter un Sous-chapitre',
    editSubchapterTitle: 'Modifier le Sous-chapitre',
    addSubchapterBtn: 'Ajouter un Sous-chapitre',
    createSubchapterBtn: 'Créer le Sous-chapitre',
    subchaptersCountLabel: (c) => `${c} ${c === 1 ? 'sous-chapitre' : 'sous-chapitres'}`,
    selectParentChapterHint: 'Sélectionnez le chapitre parent auquel appartient ce sous-chapitre.',

    ratingsEyebrow: 'Notes de Table',
    ratingsTitle: 'Avis & Notes des Lecteurs',
    ratingsCountLabel: (c) => `${c} ${c === 1 ? 'avis' : 'avis'}`,
    yourRatingLabel: 'Votre Note',
    oneLinerLabel: 'Note courte optionnelle (une ligne)',
    oneLinerPlaceholder: 'ex. J’adore, Délicieux, Cuisson parfaite...',
    submitRatingBtn: 'Publier l’Avis',
    updateRatingBtn: 'Mettre à Jour',
    removeRatingBtn: 'Supprimer',
    signInToRatePrompt: 'Connectez-vous dans les Paramètres pour noter ce plat et laisser un mot.',
    noRatingsYet: 'Aucun avis pour le moment. Soyez le premier à réagir.',
    ratingSavedToast: 'Votre note et commentaire ont été enregistrés.',
    ratingDeletedToast: 'Avis supprimé.',

    viewAllPlatesCount: (c) => `Voir les ${c} planches →`,
    showingPlatesRange: (s, e, total) => `${s}–${e} sur ${total} planches`,
    pageOfTotal: (p, t) => `Page ${p} sur ${t}`,
    previousPage: 'Précédente',
    nextPage: 'Suivante',

    navMyRecipes: 'Mes Recettes',
    myRecipesEyebrow: 'Espace Contributeur',
    myRecipesTitle: 'Mes Recettes',
    myRecipesSubtitle: 'Recherchez, créez, modifiez et publiez vos plats. Dépubliez une recette avant de la supprimer.',
    myRecipesAccessDenied: 'Les droits contributeur ou administrateur sont requis pour gérer vos recettes.',
    createRecipeBtn: 'Créer une Recette',
    searchMyRecipesPlaceholder: 'Rechercher par titre, chapitre ou ingrédient...',
    statusAll: 'Toutes',
    statusPublished: 'Publiées',
    statusDraft: 'Non publiées',
    publishBtn: 'Publier',
    unpublishBtn: 'Dépublier',
    unpublishToDeleteHint: 'Dépubliez d’abord pour supprimer',
    noMyRecipesTitle: 'Aucune recette personnelle pour le moment',
    noMyRecipesHint: 'Créez votre première recette ou demandez au Chef d’en composer une nouvelle.',
    openPlateBtn: 'Ouvrir',
    backToMyRecipes: 'Retour à Mes Recettes',
    recipeEditorEyebrow: 'Édition de Recette',
    createRecipeTitle: 'Créer une Nouvelle Recette',
    editRecipeTitle: 'Modifier la Recette',
    recipeTitleField: 'Titre du Plat',
    recipeSubtitleField: 'Sous-titre',
    recipeRegionField: 'Région',
    recipeSeasonField: 'Saison',
    recipePrepMinutesField: 'Prép. (min)',
    recipeCookMinutesField: 'Cuisson (min)',
    recipeBaseServingsField: 'Personnes de base',
    recipeChefAuthorField: 'Chef / Auteur',
    recipePlateImageField: 'Photographie du Plat',
    recipeFigureCaptionField: 'Légende de l’image',
    recipeExcerptField: 'Résumé du récit',
    recipeStoryField: 'Récit de cuisine',
    recipePullQuoteField: 'Citation mise en avant',
    recipePairingField: 'Accord Cave & Table',
    recipeIngredientsSection: 'Ingrédients',
    addIngredientBtn: 'Ajouter un Ingrédient',
    ingredientNamePlaceholder: 'Nom de l’ingrédient...',
    metricAmountLabel: 'Qté Métrique',
    metricUnitLabel: 'Unité',
    imperialAmountLabel: 'Qté US',
    imperialUnitLabel: 'Unité US',
    recipeStepsSection: 'Étapes de Préparation',
    addStepBtn: 'Ajouter une Étape',
    stepTitleLabel: 'Titre de l’étape',
    stepInstructionLabel: 'Instructions',
    stepTimerMinutesLabel: 'Minuteur (min)',
    stepTimerLabelField: 'Libellé du minuteur',
    stepTipLabel: 'Conseil du chef (optionnel)',
    saveDraftBtn: 'Enregistrer (Non publié)',
    saveAndPublishBtn: 'Enregistrer & Publier',
    saveRecipeChangesBtn: 'Enregistrer',
    recipePublishedToast: 'Recette publiée dans le livre.',
    recipeUnpublishedToast: 'Recette dépubliée et passée en brouillon.',
    recipeCreatedDraftToast: 'Brouillon de recette enregistré.',
    recipeUpdatedToast: 'Recette mise à jour.',
    dishCourseField: 'Service du Plat',
    chefLoggedInHint: 'Chef connecté',
    uploadPhotoBtn: 'Téléverser une photo',
    uploadPhotoHint: 'Téléversez une photo du plat (JPG, PNG, WebP) ou choisissez une planche ci-dessous.',
    processingPhotoLabel: 'Optimisation de la photo...',
    presetPlatesLabel: 'Ou choisissez une planche du livre',
    unitSectionTitle: 'Unités de Mesure',
    autoConvertNote: (other) => `Conversion automatique vers ${other}`,
    qtyLabel: 'Qté',
    unitLabel: 'Unité',
    seasonAllSeasons: 'Toutes saisons',
    seasonSpring: 'Printemps',
    seasonSummer: 'Été',
    seasonAutumn: 'Automne',
    seasonLateAutumn: 'Fin d’automne',
    seasonWinter: 'Hiver',
    stepVideoUrlLabel: 'Lien vidéo YouTube (optionnel)',
    stepVideoUrlPlaceholder: 'https://www.youtube.com/watch?v=...',
    invalidYouTubeUrlError: (stepNum) =>
      `Étape ${stepNum} : saisissez un lien YouTube valide ou laissez le champ vide.`,
    youtubeClipHint: 'Vidéo YouTube',
    allCoursesLabel: 'Tous les Services',
  },

  es: {
    navCover: 'Inicio',
    navChapters: 'Recetas',
    navCards: 'Fichas',
    navSaved: 'Guardados',
    navSettings: 'Ajustes',
    navAdmin: 'Admin',
    cookMode: 'Modo Cocina',
    cookModeActive: (c) => `Modo Cocina · ${c} Activo${c > 1 ? 's' : ''}`,
    languageLabel: 'Idioma',
    themeLabel: 'Tema',
    themeClassic: 'Clásico',
    themeWhitepaper: 'Papel blanco',
    themeModern: 'Moderno',
    themeColorful: 'Colorido',

    openFirstPlate: 'Abrir Lámina I',
    askChefForRecipe: 'Pedir Receta al Chef',
    browsePlates: 'Explorar Platos',
    tableOfContents: 'Índice General',
    chaptersIndexTitle: 'Nuestra Carta de Cocina',
    platesSummary: (p, c, t) => `${p} Platos · ${c} Clips · ${t} Temporizadores`,
    subchaptersLabel: 'Subcapítulos',
    allInParentChapter: (title) => `Todo ${title}`,
    clipsUnit: 'clips',
    minUnit: 'min',
    saveRecipeAria: 'Guardar receta',
    removeBookmarkAria: 'Quitar marcador',

    personalBookmarkShelf: 'Estantería Personal',
    seasonalBistroFolio: 'Folio Bistró de Temporada',
    savedTitle: 'Recetas Guardadas y Marcadores',
    chaptersTitle: 'Recetas',
    filterPlaceholder: 'Filtrar por plato o ingrediente...',
    filterAria: 'Filtrar recetas',
    askChefShort: 'Pedir Receta',
    allChapters: 'Todas las Recetas',
    signOut: 'Cerrar sesión',
    signInSync: 'Iniciar sesión para Sincronizar',
    noBookmarksTitle: 'Aún no hay recetas guardadas',
    noMatchesTitle: 'No se encontraron platos',
    noBookmarksHint: 'Usa el marcador en cualquier plato para reunir tu menú de temporada.',
    noMatchesHint: 'Prueba a borrar el filtro o volver a todas las recetas.',
    browseSeasonalChapters: 'Explorar Recetas',
    servesCount: (c) => `Para ${c}`,
    readStoryCard: 'Leer Historia y Ficha →',
    timersCount: (c) => `${c} relojes`,
    watchPrepClip: 'Ver Técnica',

    miseEnPlaceIndex: 'Índice de Mise en Place',
    collectibleCardsTitle: 'Fichas de Receta Coleccionables',
    metricFull: 'Métrico (g/ml)',
    usCustomaryFull: 'Medidas EE. UU.',
    filterByChapterAria: 'Filtrar fichas por plato',
    prepWord: 'Prep.',
    cookWord: 'Cocción',
    stepsWord: 'pasos',
    personsLabel: 'Personas',
    decreasePersonsAria: 'Reducir personas',
    increasePersonsAria: 'Aumentar personas',
    openBookSpread: 'Abrir Libro',
    prepClipShort: 'Clip Técnica',
    cookAndTime: 'Cocinar y Medir',

    customizedEdition: 'Edición Personalizada',
    customizeWithAi: 'Personalizar con IA',
    originalVersion: 'Original',
    deleteRecipeAria: 'Eliminar receta personalizada',
    bookmarked: 'Guardado',
    bookmark: 'Guardar',
    startCookMode: 'Modo Cocina',
    preparationClips: 'Clips de Preparación',
    visualStudiesCount: (c) => `${c} estudios visuales`,
    byAuthor: (a) => `Por ${a}`,
    cellarPairing: 'Maridaje de Bodega y Mesa',
    recipeCardEyebrow: 'Ficha de Receta',
    ingredientsAndScaling: 'Ingredientes y Porciones',
    metricShort: 'Métrico',
    usShort: 'EE. UU.',
    personCountLabel: 'Número de Personas',
    quickScaleFromBase: (b, w) => `Escala rápida desde base (${b} ${w})`,
    kitchenMarginNotes: 'Notas al Margen',
    savedNotice: 'Guardado',
    marginNotePlaceholder: 'Anota ajustes de horno, vinos o toques de condimento...',
    stepByStepMethod: 'Método Paso a Paso',
    preparationTimersTitle: 'Preparación y Temporizadores',
    stepsProgress: (d, t) => `${d} de ${t} pasos completos`,
    markStepCompleteAria: (n) => `Marcar paso ${n} completado`,
    chefsNotePrefix: 'Nota del chef:',
    doneLabel: '00:00 · Listo',
    pause: 'Pausar',
    restart: 'Reiniciar',
    resume: 'Reanudar',
    startTimerLabel: (time) => `Iniciar ${time}`,
    untimedPrepStep: 'Paso previo sin reloj',
    watchClipPrefix: (t) => `Ver Clip: ${t}`,
    previousPlate: 'Lámina Anterior',
    nextPlate: 'Siguiente Lámina',
    plateOfTotal: (i, t) => `Lámina ${i} de ${t}`,
    plateLabel: (p) => p.replace('Plate ', 'Lámina '),

    cookModePrefix: 'Modo Cocina',
    forPersons: (c, w) => `Para ${c} ${w}`,
    exitCookMode: 'Salir de Modo Cocina',
    stepLabel: (n) => `Paso 0${n}`,
    stepOfTotal: (n, t) => `Paso ${n} de ${t}`,
    stepTimerDefault: 'Reloj del paso',
    untimed: 'Sin reloj',
    startTimer: 'Iniciar Reloj',
    techniqueRefPrefix: (t) => `Referencia técnica: ${t}`,
    watchClip: 'Ver Clip',
    stepCompleted: 'Paso Completo',
    markStepDone: 'Marcar Listo',
    previous: 'Anterior',
    nextStep: 'Siguiente Paso',
    miseEnPlaceEyebrow: 'Mise en Place',
    scaledForPersons: (c, w) => `Calculado para ${c} ${w}`,

    preparationClipPrefix: 'Clip Técnico',
    closeClipAria: 'Cerrar clip técnico',
    targetPlate: 'Plato Objetivo',
    play: 'Reproducir',
    loop: 'Bucle',
    stagePrefix: (n) => `Fase 0${n}`,

    timerReady: 'Reloj Listo',
    kitchenTimersCount: (c) => `Relojes de Cocina (${c})`,
    stepShort: (n) => `Paso ${n}`,
    muteChimes: 'Silenciar aviso',
    unmuteChimes: 'Activar sonido',

    newBookEntry: 'Nueva Entrada',
    closeModalAria: 'Cerrar ventana',
    savedToCookbook: 'Guardado en el Libro',
    ingredientsCountHeader: (c, w) => `Ingredientes (${c} ${w})`,
    timedStepsHeader: (c) => `Pasos con Reloj (${c})`,
    askAnotherRecipe: 'Pedir Otra Receta',
    openFullSpreadTimers: 'Abrir Libro Completo y Relojes',
    signInPrompt: 'Inicia sesión con Google para guardar nuevas recetas en tu base de datos.',
    signInGoogle: 'Entrar con Google',
    whatRecipePrompt: '¿Qué receta te gustaría cocinar?',
    askPlaceholder: 'Escribe un plato, ingredientes de temporada o preferencias...',
    bookChapterField: 'Capítulo del Libro',
    cancel: 'Cancelar',
    generatingRecipe: 'Creando receta...',
    postGetRecipe: 'Publicar y Obtener Receta',

    aiAdaptationEyebrow: 'Adaptación con IA',
    customizeDishTitle: (t) => `Personalizar «${t}»`,
    howToAdaptLabel: '¿Cómo quieres adaptar este plato?',
    customizePlaceholder: 'Describe los cambios de ingredientes, sabor o técnica de cocción...',
    adaptingRecipe: 'Adaptando receta...',
    applyAiCustomization: 'Aplicar Adaptación IA',

    footerColophon: 'Maison Feuille · Monografía Bistró de Temporada · Notas Rue des Martyrs',
    toastSavedCloud: 'Nueva receta guardada en tu base de datos.',
    toastSavedLocal: '¡Receta añadida! Inicia sesión para guardarla en la nube.',
    toastMigratedCloud: 'Tus nuevas recetas se guardaron en tu base de datos.',
    toastCustomizedCloud: 'Receta personalizada guardada en tu libro.',
    toastCustomizedLocal: '¡Receta personalizada!',
    toastCustomUpdated: 'Adaptación actualizada en la base de datos.',
    toastReverted: 'Restaurada la receta original.',
    toastDeleted: 'Receta eliminada del libro.',
    toastSignedIn: 'Sesión iniciada — Libro sincronizado.',
    toastSignInFailed: 'No se pudo completar el inicio con Google.',
    toastSignedOut: 'Sesión cerrada.',

    personSingular: 'persona',
    personPlural: 'personas',

    settingsEyebrow: 'Preferencias y Cuenta',
    settingsTitle: 'Ajustes',
    settingsSubtitle: 'Gestiona tu sesión, permisos de colaborador, idioma y tema editorial.',
    accountSectionTitle: 'Cuenta y Permisos',
    languageSectionTitle: 'Idioma del Recetario',
    themeSectionTitle: 'Tema de Papel',
    roleLabel: 'Rol actual',
    roleReader: 'Lector',
    roleContributor: 'Colaborador',
    roleAdmin: 'Administrador',
    roleReaderDesc: 'Acceso de lectura, marcadores, temporizadores y valoraciones en una línea.',
    roleContributorDesc: 'Lectura más creación y personalización de recetas con IA.',
    roleAdminDesc: 'Permisos completos incluyendo gestión de roles y edición de capítulos.',
    requestContributorBtn: 'Solicitar Permisos de Colaborador',
    requestContributorNoteLabel: 'Nota opcional para el administrador',
    requestContributorNotePlaceholder: 'Cuéntanos brevemente qué recetas te gustaría aportar...',
    requestContributorPending: 'Tu solicitud de colaborador está pendiente de revisión.',
    requestContributorRejected: 'Tu solicitud anterior fue rechazada. Puedes enviar una nueva.',
    toastContributorRequested: 'Solicitud enviada al administrador.',
    goToSettings: 'Ir a Ajustes',
    contributorRequiredNotice: 'Tu cuenta tiene permisos de lectura. Solicita permisos de colaborador en Ajustes para guardar recetas IA.',

    adminEyebrow: 'Administración Editorial',
    adminTitle: 'Panel de Administración',
    adminAccessDenied: 'Se requieren permisos de administrador para ver esta página.',
    adminUsersTitle: 'Usuarios y Aprobación de Roles',
    rolesDirectoryTitle: 'Roles',
    adminChaptersTitle: 'Capítulos del Libro',
    pendingRequestsFilter: 'Solicitudes Pendientes',
    allUsersFilter: 'Todos los Usuarios',
    approveContributor: 'Aprobar Colaborador',
    roleUpdatedToast: 'Rol de usuario actualizado.',
    noUsersFound: 'No se encontraron usuarios.',
    addChapterTitle: 'Añadir Nuevo Capítulo',
    editChapterTitle: 'Editar Capítulo',
    chapterEditorEyebrow: 'Edición de Capítulo',
    backToAdmin: 'Volver al Panel Admin',
    chapterSlugLabel: 'ID del Capítulo (slug)',
    parentChapterLabel: 'Capítulo Principal',
    noParentChapterOption: 'Capítulo Principal',
    chapterSortOrderLabel: 'Orden',
    chapterTitleLabel: 'Título del Capítulo',
    chapterSeasonLabel: 'Nota de Temporada',
    chapterEpigraphLabel: 'Epígrafe Editorial',
    createChapterBtn: 'Crear Capítulo',
    saveChapterBtn: 'Guardar Cambios',
    editBtn: 'Editar',
    deleteBtn: 'Eliminar',
    confirmDeleteBtn: 'Confirmar',
    restoreDefaultChaptersBtn: 'Restaurar Capítulos Predeterminados',
    chapterCreatedToast: 'Capítulo creado.',
    chapterUpdatedToast: 'Capítulo actualizado.',
    chapterDeletedToast: 'Capítulo eliminado.',
    addSubchapterTitle: 'Añadir Nuevo Subcapítulo',
    editSubchapterTitle: 'Editar Subcapítulo',
    addSubchapterBtn: 'Añadir Subcapítulo',
    createSubchapterBtn: 'Crear Subcapítulo',
    subchaptersCountLabel: (c) => `${c} ${c === 1 ? 'subcapítulo' : 'subcapítulos'}`,
    selectParentChapterHint: 'Selecciona el capítulo principal al que pertenece este subcapítulo.',

    ratingsEyebrow: 'Notas de Mesa',
    ratingsTitle: 'Valoraciones y Notas Breves',
    ratingsCountLabel: (c) => `${c} ${c === 1 ? 'valoración' : 'valoraciones'}`,
    yourRatingLabel: 'Tu Valoración',
    oneLinerLabel: 'Nota breve opcional (una línea)',
    oneLinerPlaceholder: 'ej. Me encanta, Delicioso, Punto perfecto...',
    submitRatingBtn: 'Publicar Valoración',
    updateRatingBtn: 'Actualizar',
    removeRatingBtn: 'Quitar',
    signInToRatePrompt: 'Inicia sesión en Ajustes para valorar este plato y dejar una nota breve.',
    noRatingsYet: 'Aún no hay valoraciones. Sé el primero en dejar una nota.',
    ratingSavedToast: 'Tu valoración y nota se han guardado.',
    ratingDeletedToast: 'Valoración eliminada.',

    viewAllPlatesCount: (c) => `Ver los ${c} platos →`,
    showingPlatesRange: (s, e, total) => `Mostrando ${s}–${e} de ${total} platos`,
    pageOfTotal: (p, t) => `Página ${p} de ${t}`,
    previousPage: 'Anterior',
    nextPage: 'Siguiente',

    navMyRecipes: 'Mis Recetas',
    myRecipesEyebrow: 'Mesa del Colaborador',
    myRecipesTitle: 'Mis Recetas',
    myRecipesSubtitle: 'Busca, crea, actualiza y publica tus platos. Retira la publicación antes de eliminar una receta.',
    myRecipesAccessDenied: 'Se requieren permisos de colaborador o administrador para gestionar tus recetas.',
    createRecipeBtn: 'Crear Receta',
    searchMyRecipesPlaceholder: 'Buscar tus recetas por título, capítulo o ingrediente...',
    statusAll: 'Todas',
    statusPublished: 'Publicadas',
    statusDraft: 'No publicadas',
    publishBtn: 'Publicar',
    unpublishBtn: 'Retirar publicación',
    unpublishToDeleteHint: 'Retira la publicación primero para eliminar',
    noMyRecipesTitle: 'Aún no tienes recetas creadas',
    noMyRecipesHint: 'Crea tu primera receta o pide al Chef que elabore un nuevo plato.',
    openPlateBtn: 'Abrir Lámina',
    backToMyRecipes: 'Volver a Mis Recetas',
    recipeEditorEyebrow: 'Edición de Receta',
    createRecipeTitle: 'Crear Nueva Receta',
    editRecipeTitle: 'Actualizar Receta',
    recipeTitleField: 'Título del Plato',
    recipeSubtitleField: 'Subtítulo',
    recipeRegionField: 'Región',
    recipeSeasonField: 'Temporada',
    recipePrepMinutesField: 'Prep. (min)',
    recipeCookMinutesField: 'Cocción (min)',
    recipeBaseServingsField: 'Personas base',
    recipeChefAuthorField: 'Chef / Autor',
    recipePlateImageField: 'Fotografía del Plato',
    recipeFigureCaptionField: 'Pie de foto',
    recipeExcerptField: 'Resumen breve',
    recipeStoryField: 'Historia de cocina',
    recipePullQuoteField: 'Cita destacada',
    recipePairingField: 'Maridaje de Mesa',
    recipeIngredientsSection: 'Ingredientes',
    addIngredientBtn: 'Añadir Ingrediente',
    ingredientNamePlaceholder: 'Nombre del ingrediente...',
    metricAmountLabel: 'Cant. Métrica',
    metricUnitLabel: 'Unidad',
    imperialAmountLabel: 'Cant. EE. UU.',
    imperialUnitLabel: 'Unidad US',
    recipeStepsSection: 'Pasos de Preparación',
    addStepBtn: 'Añadir Paso',
    stepTitleLabel: 'Título del paso',
    stepInstructionLabel: 'Instrucción',
    stepTimerMinutesLabel: 'Reloj (min)',
    stepTimerLabelField: 'Etiqueta del reloj',
    stepTipLabel: 'Nota del chef (opcional)',
    saveDraftBtn: 'Guardar sin publicar',
    saveAndPublishBtn: 'Guardar y Publicar',
    saveRecipeChangesBtn: 'Guardar Cambios',
    recipePublishedToast: 'Receta publicada en el recetario.',
    recipeUnpublishedToast: 'Publicación retirada; guardada como borrador.',
    recipeCreatedDraftToast: 'Borrador de receta guardado.',
    recipeUpdatedToast: 'Receta actualizada.',
    dishCourseField: 'Tiempo del Plato',
    chefLoggedInHint: 'Chef conectado',
    uploadPhotoBtn: 'Subir foto',
    uploadPhotoHint: 'Sube una foto del plato (JPG, PNG, WebP) o elige una lámina abajo.',
    processingPhotoLabel: 'Optimizando foto...',
    presetPlatesLabel: 'O elige una lámina de la colección',
    unitSectionTitle: 'Unidades de Medida',
    autoConvertNote: (other) => `Conversión automática a ${other}`,
    qtyLabel: 'Cant.',
    unitLabel: 'Unidad',
    seasonAllSeasons: 'Todas las estaciones',
    seasonSpring: 'Primavera',
    seasonSummer: 'Verano',
    seasonAutumn: 'Otoño',
    seasonLateAutumn: 'Final de otoño',
    seasonWinter: 'Invierno',
    stepVideoUrlLabel: 'Enlace de vídeo de YouTube (opcional)',
    stepVideoUrlPlaceholder: 'https://www.youtube.com/watch?v=...',
    invalidYouTubeUrlError: (stepNum) =>
      `Paso ${stepNum}: introduce un enlace válido de YouTube o déjalo vacío.`,
    youtubeClipHint: 'Vídeo de YouTube',
    allCoursesLabel: 'Todos los Platos',
  },

  de: {
    navCover: 'Start',
    navChapters: 'Rezepte',
    navCards: 'Rezeptkarten',
    navSaved: 'Gespeichert',
    navSettings: 'Einstellungen',
    navAdmin: 'Admin',
    cookMode: 'Kochmodus',
    cookModeActive: (c) => `Kochmodus · ${c} Aktiv`,
    languageLabel: 'Sprache',
    themeLabel: 'Design',
    themeClassic: 'Klassisch',
    themeWhitepaper: 'Weißes Papier',
    themeModern: 'Modern',
    themeColorful: 'Farbenfroh',

    openFirstPlate: 'Tafel I öffnen',
    askChefForRecipe: 'Chef nach Rezept fragen',
    browsePlates: 'Gerichte ansehen',
    tableOfContents: 'Inhaltsverzeichnis',
    chaptersIndexTitle: 'Unser Küchenmenü',
    platesSummary: (p, c, t) => `${p} Tafeln · ${c} Technikclips · ${t} Kochtimer`,
    subchaptersLabel: 'Unterkapitel',
    allInParentChapter: (title) => `Alle · ${title}`,
    clipsUnit: 'Clips',
    minUnit: 'Min.',
    saveRecipeAria: 'Rezept merken',
    removeBookmarkAria: 'Lesezeichen entfernen',

    personalBookmarkShelf: 'Persönliches Lesezeichen-Regal',
    seasonalBistroFolio: 'Saisonales Bistro-Folio',
    savedTitle: 'Gespeicherte Rezepte & Lesezeichen',
    chaptersTitle: 'Rezepte',
    filterPlaceholder: 'Nach Gericht oder Zutat filtern...',
    filterAria: 'Rezepte filtern',
    askChefShort: 'Rezept anfragen',
    allChapters: 'Alle Rezepte',
    signOut: 'Abmelden',
    signInSync: 'Anmelden zum Synchronisieren',
    noBookmarksTitle: 'Noch keine Rezepte gemerkt',
    noMatchesTitle: 'Keine passenden Gerichte gefunden',
    noBookmarksHint: 'Nutze das Lesezeichen bei jedem Gericht, um dein Saisonmenü zu sammeln.',
    noMatchesHint: 'Lösche den Suchbegriff oder wechsle zurück zu allen Rezepten.',
    browseSeasonalChapters: 'Rezepte durchstöbern',
    servesCount: (c) => `Für ${c}`,
    readStoryCard: 'Geschichte & Rezeptkarte →',
    timersCount: (c) => `${c} Timer`,
    watchPrepClip: 'Technik-Clip ansehen',

    miseEnPlaceIndex: 'Bistro Mise-en-Place-Index',
    collectibleCardsTitle: 'Sammelbare Rezeptkarten',
    metricFull: 'Metrisch (g/ml)',
    usCustomaryFull: 'US-Einheiten',
    filterByChapterAria: 'Rezeptkarten nach Gang filtern',
    prepWord: 'Vorb.',
    cookWord: 'Kochen',
    stepsWord: 'Schritte',
    personsLabel: 'Personen',
    decreasePersonsAria: 'Personenzahl verringern',
    increasePersonsAria: 'Personenzahl erhöhen',
    openBookSpread: 'Buchseite öffnen',
    prepClipShort: 'Technikclip',
    cookAndTime: 'Kochen & Timer',

    customizedEdition: 'Angepasste Ausgabe',
    customizeWithAi: 'Mit KI anpassen',
    originalVersion: 'Original',
    deleteRecipeAria: 'Eigenes Rezept löschen',
    bookmarked: 'Gemerkt',
    bookmark: 'Merken',
    startCookMode: 'Kochmodus starten',
    preparationClips: 'Zubereitungsclips',
    visualStudiesCount: (c) => `${c} visuelle Studien`,
    byAuthor: (a) => `Von ${a}`,
    cellarPairing: 'Keller- & Weinempfehlung',
    recipeCardEyebrow: 'Rezeptkarte',
    ingredientsAndScaling: 'Zutaten & Mengen',
    metricShort: 'Metrisch',
    usShort: 'US',
    personCountLabel: 'Personenanzahl',
    quickScaleFromBase: (b, w) => `Schnell skalieren von Basis (${b} ${w})`,
    kitchenMarginNotes: 'Randnotizen aus der Küche',
    savedNotice: 'Gespeichert',
    marginNotePlaceholder: 'Ofentemperaturen, Weinempfehlungen oder Gewürznotizen festhalten...',
    stepByStepMethod: 'Schritt-für-Schritt-Anleitung',
    preparationTimersTitle: 'Zubereitung & Kochtimer',
    stepsProgress: (d, t) => `${d} von ${t} Schritten fertig`,
    markStepCompleteAria: (n) => `Schritt ${n} als erledigt markieren`,
    chefsNotePrefix: 'Hinweis des Chefs:',
    doneLabel: '00:00 · Fertig',
    pause: 'Pause',
    restart: 'Neu starten',
    resume: 'Fortsetzen',
    startTimerLabel: (time) => `${time} Timer starten`,
    untimedPrepStep: 'Schritt ohne Timer',
    watchClipPrefix: (t) => `Clip ansehen: ${t}`,
    previousPlate: 'Vorherige Tafel',
    nextPlate: 'Nächste Tafel',
    plateOfTotal: (i, t) => `Tafel ${i} von ${t}`,
    plateLabel: (p) => p.replace('Plate ', 'Tafel '),

    cookModePrefix: 'Kochmodus',
    forPersons: (c, w) => `Für ${c} ${w}`,
    exitCookMode: 'Kochmodus beenden',
    stepLabel: (n) => `Schritt 0${n}`,
    stepOfTotal: (n, t) => `Schritt ${n} von ${t}`,
    stepTimerDefault: 'Schritttimer',
    untimed: 'Ohne Timer',
    startTimer: 'Timer starten',
    techniqueRefPrefix: (t) => `Technikreferenz: ${t}`,
    watchClip: 'Clip ansehen',
    stepCompleted: 'Schritt erledigt',
    markStepDone: 'Als erledigt markieren',
    previous: 'Zurück',
    nextStep: 'Nächster Schritt',
    miseEnPlaceEyebrow: 'Mise en Place',
    scaledForPersons: (c, w) => `Skaliert für ${c} ${w}`,

    preparationClipPrefix: 'Technikclip',
    closeClipAria: 'Technikclip schließen',
    targetPlate: 'Zielgericht',
    play: 'Abspielen',
    loop: 'Schleife',
    stagePrefix: (n) => `Phase 0${n}`,

    timerReady: 'Timer fertig',
    kitchenTimersCount: (c) => `Küchentimer (${c})`,
    stepShort: (n) => `Schritt ${n}`,
    muteChimes: 'Signalton stumm',
    unmuteChimes: 'Signalton an',

    newBookEntry: 'Neuer Bucheintrag',
    closeModalAria: 'Fenster schließen',
    savedToCookbook: 'Im Kochbuch gespeichert',
    ingredientsCountHeader: (c, w) => `Zutaten (${c} ${w})`,
    timedStepsHeader: (c) => `Schritte mit Timer (${c})`,
    askAnotherRecipe: 'Weiteres Rezept anfragen',
    openFullSpreadTimers: 'Vollständige Buchseite & Timer öffnen',
    signInPrompt: 'Melde dich mit Google an, um neue Rezepte dauerhaft in deiner Datenbank zu speichern.',
    signInGoogle: 'Mit Google anmelden',
    whatRecipePrompt: 'Welches Rezept möchtest du kochen?',
    askPlaceholder: 'Gerichtname, saisonale Zutaten oder Ernährungswünsche eingeben...',
    bookChapterField: 'Buchkapitel',
    cancel: 'Abbrechen',
    generatingRecipe: 'Rezept wird erstellt...',
    postGetRecipe: 'Absenden & Rezept erhalten',

    aiAdaptationEyebrow: 'KI-Rezeptanpassung',
    customizeDishTitle: (t) => `„${t}“ anpassen`,
    howToAdaptLabel: 'Wie soll dieses Gericht angepasst werden?',
    customizePlaceholder: 'Beschreibe Änderungen bei Zutaten, Geschmack oder Zubereitungsart...',
    adaptingRecipe: 'Rezept wird angepasst...',
    applyAiCustomization: 'KI-Anpassung anwenden',

    footerColophon: 'Maison Feuille · Saisonale Bistro-Monografie · Küchennotizen Rue des Martyrs',
    toastSavedCloud: 'Neues Rezept in deiner Kochbuch-Datenbank gespeichert.',
    toastSavedLocal: 'Rezept hinzugefügt! Melde dich an, um es in der Cloud zu sichern.',
    toastMigratedCloud: 'Deine neuen Rezepte wurden in deiner Datenbank gesichert.',
    toastCustomizedCloud: 'Angepasstes Rezept in deinem Kochbuch gespeichert.',
    toastCustomizedLocal: 'Rezept angepasst!',
    toastCustomUpdated: 'Rezeptanpassung in der Datenbank aktualisiert.',
    toastReverted: 'Auf das Originalrezept zurückgesetzt.',
    toastDeleted: 'Rezept aus dem Kochbuch entfernt.',
    toastSignedIn: 'Angemeldet — Kochbuch synchronisiert.',
    toastSignInFailed: 'Google-Anmeldung fehlgeschlagen.',
    toastSignedOut: 'Abgemeldet.',

    personSingular: 'Person',
    personPlural: 'Personen',

    settingsEyebrow: 'Einstellungen & Konto',
    settingsTitle: 'Einstellungen',
    settingsSubtitle: 'Verwalte Anmeldung, Mitwirkungsrechte, Sprache und das Buchdesign.',
    accountSectionTitle: 'Konto & Küchenrechte',
    languageSectionTitle: 'Sprache des Kochbuchs',
    themeSectionTitle: 'Papierdesign',
    roleLabel: 'Aktuelle Rolle',
    roleReader: 'Leser',
    roleContributor: 'Mitwirkender',
    roleAdmin: 'Administrator',
    roleReaderDesc: 'Volles Leserecht, Lesezeichen, Kochtimer sowie Bewertungen mit Einzeiler.',
    roleContributorDesc: 'Leserecht plus Erstellen und Anpassen von KI-Rezepten im Kochbuch.',
    roleAdminDesc: 'Alle Rechte inklusive Benutzerrollen-Verwaltung und Kapitelbearbeitung.',
    requestContributorBtn: 'Mitwirkungsrechte Anfragen',
    requestContributorNoteLabel: 'Optionale Notiz für den Admin',
    requestContributorNotePlaceholder: 'Beschreibe kurz, welche Gerichte du beitragen möchtest...',
    requestContributorPending: 'Deine Anfrage wird vom Administrator geprüft.',
    requestContributorRejected: 'Deine frühere Anfrage wurde abgelehnt. Du kannst erneut anfragen.',
    toastContributorRequested: 'Anfrage an den Administrator gesendet.',
    goToSettings: 'Zu den Einstellungen',
    contributorRequiredNotice: 'Dein Konto hat aktuell Leserechte. Frage Mitwirkungsrechte in den Einstellungen an.',

    adminEyebrow: 'Redaktionsverwaltung',
    adminTitle: 'Admin-Bereich',
    adminAccessDenied: 'Für diese Seite sind Administratorrechte erforderlich.',
    adminUsersTitle: 'Benutzer & Rollenfreigabe',
    rolesDirectoryTitle: 'Rollen',
    adminChaptersTitle: 'Buchkapitel',
    pendingRequestsFilter: 'Offene Anfragen',
    allUsersFilter: 'Alle Benutzer',
    approveContributor: 'Als Mitwirkender freigeben',
    roleUpdatedToast: 'Benutzerrolle aktualisiert.',
    noUsersFound: 'Keine Benutzer gefunden.',
    addChapterTitle: 'Neues Kapitel hinzufügen',
    editChapterTitle: 'Kapitel bearbeiten',
    chapterEditorEyebrow: 'Kapitelbearbeitung',
    backToAdmin: 'Zurück zum Admin-Bereich',
    chapterSlugLabel: 'Kapitel-ID (Slug)',
    parentChapterLabel: 'Übergeordnetes Kapitel',
    noParentChapterOption: 'Hauptkapitel',
    chapterSortOrderLabel: 'Reihenfolge',
    chapterTitleLabel: 'Kapiteltitel',
    chapterSeasonLabel: 'Saison-Hinweis',
    chapterEpigraphLabel: 'Redaktioneller Epigraph',
    createChapterBtn: 'Kapitel erstellen',
    saveChapterBtn: 'Änderungen speichern',
    editBtn: 'Bearbeiten',
    deleteBtn: 'Löschen',
    confirmDeleteBtn: 'Löschen bestätigen',
    restoreDefaultChaptersBtn: 'Standardkapitel wiederherstellen',
    chapterCreatedToast: 'Kapitel erstellt.',
    chapterUpdatedToast: 'Kapitel aktualisiert.',
    chapterDeletedToast: 'Kapitel gelöscht.',
    addSubchapterTitle: 'Neues Unterkapitel hinzufügen',
    editSubchapterTitle: 'Unterkapitel bearbeiten',
    addSubchapterBtn: 'Unterkapitel hinzufügen',
    createSubchapterBtn: 'Unterkapitel erstellen',
    subchaptersCountLabel: (c) => `${c} ${c === 1 ? 'Unterkapitel' : 'Unterkapitel'}`,
    selectParentChapterHint: 'Wähle das übergeordnete Kapitel für dieses Unterkapitel aus.',

    ratingsEyebrow: 'Tischnotizen',
    ratingsTitle: 'Bewertungen & Kurze Notizen',
    ratingsCountLabel: (c) => `${c} ${c === 1 ? 'Bewertung' : 'Bewertungen'}`,
    yourRatingLabel: 'Deine Bewertung',
    oneLinerLabel: 'Optionaler Einzeiler',
    oneLinerPlaceholder: 'z.B. Ich liebe es, Köstlich, Perfekte Kruste...',
    submitRatingBtn: 'Bewertung senden',
    updateRatingBtn: 'Aktualisieren',
    removeRatingBtn: 'Entfernen',
    signInToRatePrompt: 'Melde dich in den Einstellungen an, um dieses Gericht zu bewerten.',
    noRatingsYet: 'Noch keine Bewertungen vorhanden.',
    ratingSavedToast: 'Deine Bewertung und Notiz wurden gespeichert.',
    ratingDeletedToast: 'Bewertung entfernt.',

    viewAllPlatesCount: (c) => `Alle ${c} Tafeln ansehen →`,
    showingPlatesRange: (s, e, total) => `${s}–${e} von ${total} Tafeln`,
    pageOfTotal: (p, t) => `Seite ${p} von ${t}`,
    previousPage: 'Zurück',
    nextPage: 'Weiter',

    navMyRecipes: 'Meine Rezepte',
    myRecipesEyebrow: 'Küche für Mitwirkende',
    myRecipesTitle: 'Meine Rezepte',
    myRecipesSubtitle: 'Eigene Rezepte suchen, erstellen, bearbeiten und veröffentlichen. Zum Löschen zuerst die Veröffentlichung aufheben.',
    myRecipesAccessDenied: 'Für diesen Bereich sind Mitwirkungs- oder Administratorrechte erforderlich.',
    createRecipeBtn: 'Rezept Erstellen',
    searchMyRecipesPlaceholder: 'Eigene Rezepte nach Titel, Kapitel oder Zutat suchen...',
    statusAll: 'Alle',
    statusPublished: 'Veröffentlicht',
    statusDraft: 'Unveröffentlicht',
    publishBtn: 'Veröffentlichen',
    unpublishBtn: 'Veröffentlichung aufheben',
    unpublishToDeleteHint: 'Zum Löschen zuerst Veröffentlichung aufheben',
    noMyRecipesTitle: 'Noch keine eigenen Rezepte',
    noMyRecipesHint: 'Erstelle dein erstes Rezept oder frage den Chef nach einem neuen Gericht.',
    openPlateBtn: 'Öffnen',
    backToMyRecipes: 'Zurück zu Meine Rezepte',
    recipeEditorEyebrow: 'Rezept-Redaktion',
    createRecipeTitle: 'Neues Rezept Erstellen',
    editRecipeTitle: 'Rezept Aktualisieren',
    recipeTitleField: 'Gerichtstitel',
    recipeSubtitleField: 'Untertitel',
    recipeRegionField: 'Region',
    recipeSeasonField: 'Saison',
    recipePrepMinutesField: 'Vorb. (Min.)',
    recipeCookMinutesField: 'Kochen (Min.)',
    recipeBaseServingsField: 'Basispersonen',
    recipeChefAuthorField: 'Chef / Autor',
    recipePlateImageField: 'Gerichtsfoto',
    recipeFigureCaptionField: 'Bildunterschrift',
    recipeExcerptField: 'Kurzbeschreibung',
    recipeStoryField: 'Küchengeschichte',
    recipePullQuoteField: 'Zitat',
    recipePairingField: 'Wein- & Tischempfehlung',
    recipeIngredientsSection: 'Zutaten',
    addIngredientBtn: 'Zutat Hinzufügen',
    ingredientNamePlaceholder: 'Zutatenname...',
    metricAmountLabel: 'Metrisch',
    metricUnitLabel: 'Einheit',
    imperialAmountLabel: 'US-Menge',
    imperialUnitLabel: 'US-Einheit',
    recipeStepsSection: 'Zubereitungsschritte',
    addStepBtn: 'Schritt Hinzufügen',
    stepTitleLabel: 'Schritttitel',
    stepInstructionLabel: 'Anleitung',
    stepTimerMinutesLabel: 'Timer (Min.)',
    stepTimerLabelField: 'Timer-Bezeichnung',
    stepTipLabel: 'Chef-Tipp (optional)',
    saveDraftBtn: 'Als Entwurf speichern',
    saveAndPublishBtn: 'Speichern & Veröffentlichen',
    saveRecipeChangesBtn: 'Änderungen speichern',
    recipePublishedToast: 'Rezept im Kochbuch veröffentlicht.',
    recipeUnpublishedToast: 'Veröffentlichung aufgehoben; als Entwurf gespeichert.',
    recipeCreatedDraftToast: 'Unveröffentlichter Rezeptentwurf gespeichert.',
    recipeUpdatedToast: 'Rezept aktualisiert.',
    dishCourseField: 'Gerichtsgang',
    chefLoggedInHint: 'Angemeldeter Koch',
    uploadPhotoBtn: 'Foto hochladen',
    uploadPhotoHint: 'Lade ein Foto des Gerichts hoch (JPG, PNG, WebP) oder wähle unten eine Vorlage.',
    processingPhotoLabel: 'Foto wird optimiert...',
    presetPlatesLabel: 'Oder wähle eine kuratierte Tafel',
    unitSectionTitle: 'Maßeinheiten',
    autoConvertNote: (other) => `Automatische Umrechnung in ${other}`,
    qtyLabel: 'Menge',
    unitLabel: 'Einheit',
    seasonAllSeasons: 'Alle Jahreszeiten',
    seasonSpring: 'Frühling',
    seasonSummer: 'Sommer',
    seasonAutumn: 'Herbst',
    seasonLateAutumn: 'Spätherbst',
    seasonWinter: 'Winter',
    stepVideoUrlLabel: 'YouTube-Videolink (optional)',
    stepVideoUrlPlaceholder: 'https://www.youtube.com/watch?v=...',
    invalidYouTubeUrlError: (stepNum) =>
      `Schritt ${stepNum}: Bitte einen gültigen YouTube-Link eingeben oder leer lassen.`,
    youtubeClipHint: 'YouTube-Video',
    allCoursesLabel: 'Alle Gänge',
  },

  it: {
    navCover: 'Home',
    navChapters: 'Ricette',
    navCards: 'Schede Ricette',
    navSaved: 'Salvati',
    navSettings: 'Impostazioni',
    navAdmin: 'Admin',
    cookMode: 'Modalità Cucina',
    cookModeActive: (c) => `Cucina · ${c} Attiv${c > 1 ? 'i' : 'o'}`,
    languageLabel: 'Lingua',
    themeLabel: 'Tema',
    themeClassic: 'Classico',
    themeWhitepaper: 'Carta bianca',
    themeModern: 'Moderno',
    themeColorful: 'Colorato',

    openFirstPlate: 'Apri Tavola I',
    askChefForRecipe: 'Chiedi una Ricetta allo Chef',
    browsePlates: 'Sfoglia i Piatti',
    tableOfContents: 'Indice dei Capitoli',
    chaptersIndexTitle: 'Il Menu della Nostra Cucina',
    platesSummary: (p, c, t) => `${p} Piatti · ${c} Clip Tecniche · ${t} Timer`,
    subchaptersLabel: 'Sottocapitoli',
    allInParentChapter: (title) => `Tutti · ${title}`,
    clipsUnit: 'clip',
    minUnit: 'min',
    saveRecipeAria: 'Salva ricetta',
    removeBookmarkAria: 'Rimuovi segnalibro',

    personalBookmarkShelf: 'Scaffale Personale',
    seasonalBistroFolio: 'Folio Bistrot di Stagione',
    savedTitle: 'Ricette Salvate e Segnalibri',
    chaptersTitle: 'Ricette',
    filterPlaceholder: 'Filtra per piatto o ingrediente...',
    filterAria: 'Filtra ricette',
    askChefShort: 'Chiedi allo Chef',
    allChapters: 'Tutte le Ricette',
    signOut: 'Esci',
    signInSync: 'Accedi per Sincronizzare',
    noBookmarksTitle: 'Nessuna ricetta salvata',
    noMatchesTitle: 'Nessun piatto trovato',
    noBookmarksHint: 'Usa il segnalibro su qualsiasi piatto per raccogliere il tuo menu di stagione.',
    noMatchesHint: 'Prova a cancellare la ricerca o torna a tutte le ricette.',
    browseSeasonalChapters: 'Sfoglia le Ricette',
    servesCount: (c) => `Per ${c}`,
    readStoryCard: 'Leggi Storia & Scheda →',
    timersCount: (c) => `${c} timer`,
    watchPrepClip: 'Guarda Tecnica',

    miseEnPlaceIndex: 'Indice Mise en Place',
    collectibleCardsTitle: 'Schede Ricette da Collezione',
    metricFull: 'Metrico (g/ml)',
    usCustomaryFull: 'Misure US',
    filterByChapterAria: 'Filtra schede per portata',
    prepWord: 'Prep.',
    cookWord: 'Cottura',
    stepsWord: 'passaggi',
    personsLabel: 'Persone',
    decreasePersonsAria: 'Riduci persone',
    increasePersonsAria: 'Aumenta persone',
    openBookSpread: 'Apri Doppia Pagina',
    prepClipShort: 'Clip Tecnica',
    cookAndTime: 'Cucina & Timer',

    customizedEdition: 'Edizione Personalizzata',
    customizeWithAi: 'Personalizza con IA',
    originalVersion: 'Originale',
    deleteRecipeAria: 'Elimina ricetta personalizzata',
    bookmarked: 'Salvata',
    bookmark: 'Salva',
    startCookMode: 'Avvia Modalità Cucina',
    preparationClips: 'Clip di Preparazione',
    visualStudiesCount: (c) => `${c} studi visivi`,
    byAuthor: (a) => `Di ${a}`,
    cellarPairing: 'Abbinamento Cantina & Tavola',
    recipeCardEyebrow: 'Scheda Ricetta',
    ingredientsAndScaling: 'Ingredienti & Dosi',
    metricShort: 'Metrico',
    usShort: 'US',
    personCountLabel: 'Numero di Persone',
    quickScaleFromBase: (b, w) => `Scala rapidamente dalla base (${b} ${w})`,
    kitchenMarginNotes: 'Note a Margine',
    savedNotice: 'Salvato',
    marginNotePlaceholder: 'Annota temperature del forno, vini o aggiustamenti...',
    stepByStepMethod: 'Metodo Passo dopo Passo',
    preparationTimersTitle: 'Preparazione & Timer di Cottura',
    stepsProgress: (d, t) => `${d} di ${t} passaggi completati`,
    markStepCompleteAria: (n) => `Segna passaggio ${n} completato`,
    chefsNotePrefix: 'Nota dello chef:',
    doneLabel: '00:00 · Pronto',
    pause: 'Pausa',
    restart: 'Riavvia',
    resume: 'Riprendi',
    startTimerLabel: (time) => `Avvia Timer ${time}`,
    untimedPrepStep: 'Passaggio senza timer',
    watchClipPrefix: (t) => `Guarda Clip: ${t}`,
    previousPlate: 'Tavola Precedente',
    nextPlate: 'Tavola Successiva',
    plateOfTotal: (i, t) => `Tavola ${i} di ${t}`,
    plateLabel: (p) => p.replace('Plate ', 'Tavola '),

    cookModePrefix: 'Modalità Cucina',
    forPersons: (c, w) => `Per ${c} ${w}`,
    exitCookMode: 'Esci dalla Cucina',
    stepLabel: (n) => `Passo 0${n}`,
    stepOfTotal: (n, t) => `Passaggio ${n} di ${t}`,
    stepTimerDefault: 'Timer passaggio',
    untimed: 'Senza timer',
    startTimer: 'Avvia Timer',
    techniqueRefPrefix: (t) => `Riferimento tecnico: ${t}`,
    watchClip: 'Guarda Clip',
    stepCompleted: 'Passaggio Completato',
    markStepDone: 'Segna Fatto',
    previous: 'Precedente',
    nextStep: 'Prossimo Passo',
    miseEnPlaceEyebrow: 'Mise en Place',
    scaledForPersons: (c, w) => `Calcolato per ${c} ${w}`,

    preparationClipPrefix: 'Clip Tecnica',
    closeClipAria: 'Chiudi clip tecnica',
    targetPlate: 'Piatto Finale',
    play: 'Riproduci',
    loop: 'Ripeti',
    stagePrefix: (n) => `Fase 0${n}`,

    timerReady: 'Timer Pronto',
    kitchenTimersCount: (c) => `Timer Cucina (${c})`,
    stepShort: (n) => `Passo ${n}`,
    muteChimes: 'Silenzia avvisi',
    unmuteChimes: 'Attiva suono',

    newBookEntry: 'Nuova Voce',
    closeModalAria: 'Chiudi finestra',
    savedToCookbook: 'Salvata nel Ricettario',
    ingredientsCountHeader: (c, w) => `Ingredienti (${c} ${w})`,
    timedStepsHeader: (c) => `Passaggi con Timer (${c})`,
    askAnotherRecipe: 'Chiedi un’Altra Ricetta',
    openFullSpreadTimers: 'Apri Doppia Pagina & Timer',
    signInPrompt: 'Accedi con Google per salvare in modo permanente le nuove ricette nel database.',
    signInGoogle: 'Accedi con Google',
    whatRecipePrompt: 'Che ricetta vorresti preparare?',
    askPlaceholder: 'Inserisci un piatto, ingredienti di stagione o preferenze alimentari...',
    bookChapterField: 'Capitolo del Libro',
    cancel: 'Annulla',
    generatingRecipe: 'Creazione ricetta...',
    postGetRecipe: 'Invia & Ottieni Ricetta',

    aiAdaptationEyebrow: 'Adattamento IA',
    customizeDishTitle: (t) => `Personalizza “${t}”`,
    howToAdaptLabel: 'Come vuoi adattare questo piatto?',
    customizePlaceholder: 'Descrivi le modifiche agli ingredienti, ai sapori o al metodo di cottura...',
    adaptingRecipe: 'Adattamento in corso...',
    applyAiCustomization: 'Applica Adattamento IA',

    footerColophon: 'Maison Feuille · Monografia Bistrot di Stagione · Note Rue des Martyrs',
    toastSavedCloud: 'Nuova ricetta salvata nel database del Ricettario.',
    toastSavedLocal: 'Ricetta aggiunta! Accedi per salvarla nel cloud.',
    toastMigratedCloud: 'Le tue nuove ricette sono state salvate nel database.',
    toastCustomizedCloud: 'Ricetta personalizzata salvata nel Ricettario.',
    toastCustomizedLocal: 'Ricetta personalizzata!',
    toastCustomUpdated: 'Adattamento aggiornato nel database.',
    toastReverted: 'Ripristinata la ricetta originale.',
    toastDeleted: 'Ricetta rimossa dal Ricettario.',
    toastSignedIn: 'Accesso effettuato — Ricettario sincronizzato.',
    toastSignInFailed: 'Impossibile completare l’accesso con Google.',
    toastSignedOut: 'Disconnesso.',

    personSingular: 'persona',
    personPlural: 'persone',

    settingsEyebrow: 'Preferenze & Account',
    settingsTitle: 'Impostazioni',
    settingsSubtitle: 'Gestisci accesso, permessi di collaboratore, lingua e tema del ricettario.',
    accountSectionTitle: 'Account & Diritti di Cucina',
    languageSectionTitle: 'Lingua del Ricettario',
    themeSectionTitle: 'Tema Editoriale',
    roleLabel: 'Ruolo attuale',
    roleReader: 'Lettore',
    roleContributor: 'Collaboratore',
    roleAdmin: 'Amministratore',
    roleReaderDesc: 'Accesso in lettura, segnalibri, timer di cottura e valutazioni brevi.',
    roleContributorDesc: 'Diritti di lettura più creazione e personalizzazione di ricette con IA.',
    roleAdminDesc: 'Diritti completi inclusa gestione ruoli e modifica dei capitoli.',
    requestContributorBtn: 'Richiedi Diritti Collaboratore',
    requestContributorNoteLabel: 'Nota opzionale per l’amministratore',
    requestContributorNotePlaceholder: 'Indica brevemente quali piatti vorresti contribuire...',
    requestContributorPending: 'La richiesta è in attesa di approvazione.',
    requestContributorRejected: 'La richiesta precedente è stata rifiutata. Puoi inviarne una nuova.',
    toastContributorRequested: 'Richiesta inviata all’amministratore.',
    goToSettings: 'Apri Impostazioni',
    contributorRequiredNotice: 'Il tuo account ha permessi di lettura. Richiedi i diritti di collaboratore nelle Impostazioni.',

    adminEyebrow: 'Amministrazione Editoriale',
    adminTitle: 'Pannello Admin',
    adminAccessDenied: 'Sono necessari i diritti di amministratore per accedere a questa pagina.',
    adminUsersTitle: 'Utenti & Approvazione Ruoli',
    rolesDirectoryTitle: 'Ruoli',
    adminChaptersTitle: 'Capitoli del Libro',
    pendingRequestsFilter: 'Richieste in Sospeso',
    allUsersFilter: 'Tutti gli Utenti',
    approveContributor: 'Approva Collaboratore',
    roleUpdatedToast: 'Ruolo utente aggiornato.',
    noUsersFound: 'Nessun utente trovato.',
    addChapterTitle: 'Aggiungi Nuovo Capitolo',
    editChapterTitle: 'Modifica Capitolo',
    chapterEditorEyebrow: 'Redazione Capitolo',
    backToAdmin: 'Torna al Pannello Admin',
    chapterSlugLabel: 'ID Capitolo (slug)',
    parentChapterLabel: 'Capitolo Principale',
    noParentChapterOption: 'Capitolo Principale',
    chapterSortOrderLabel: 'Ordine',
    chapterTitleLabel: 'Titolo Capitolo',
    chapterSeasonLabel: 'Nota Stagionale',
    chapterEpigraphLabel: 'Epigrafe Editoriale',
    createChapterBtn: 'Crea Capitolo',
    saveChapterBtn: 'Salva Modifiche',
    editBtn: 'Modifica',
    deleteBtn: 'Elimina',
    confirmDeleteBtn: 'Conferma',
    restoreDefaultChaptersBtn: 'Ripristina Capitoli Predefiniti',
    chapterCreatedToast: 'Capitolo creato.',
    chapterUpdatedToast: 'Capitolo aggiornato.',
    chapterDeletedToast: 'Capitolo eliminato.',
    addSubchapterTitle: 'Aggiungi Nuovo Sottocapitolo',
    editSubchapterTitle: 'Modifica Sottocapitolo',
    addSubchapterBtn: 'Aggiungi Sottocapitolo',
    createSubchapterBtn: 'Crea Sottocapitolo',
    subchaptersCountLabel: (c) => `${c} ${c === 1 ? 'sottocapitolo' : 'sottocapitoli'}`,
    selectParentChapterHint: 'Seleziona il capitolo principale a cui appartiene questo sottocapitolo.',

    ratingsEyebrow: 'Note da Tavola',
    ratingsTitle: 'Valutazioni & Note Brevi',
    ratingsCountLabel: (c) => `${c} ${c === 1 ? 'recensione' : 'recensioni'}`,
    yourRatingLabel: 'La tua Valutazione',
    oneLinerLabel: 'Nota opzionale su una riga',
    oneLinerPlaceholder: 'es. Lo adoro, Delizioso, Cottura perfetta...',
    submitRatingBtn: 'Pubblica Nota',
    updateRatingBtn: 'Aggiorna',
    removeRatingBtn: 'Rimuovi',
    signInToRatePrompt: 'Accedi dalle Impostazioni per valutare questo piatto e lasciare una nota breve.',
    noRatingsYet: 'Ancora nessuna valutazione. Sii il primo a lasciare una nota.',
    ratingSavedToast: 'Valutazione e nota salvate.',
    ratingDeletedToast: 'Valutazione rimossa.',

    viewAllPlatesCount: (c) => `Vedi tutti i ${c} piatti →`,
    showingPlatesRange: (s, e, total) => `Da ${s} a ${e} di ${total} piatti`,
    pageOfTotal: (p, t) => `Pagina ${p} di ${t}`,
    previousPage: 'Precedente',
    nextPage: 'Successiva',

    navMyRecipes: 'Le Mie Ricette',
    myRecipesEyebrow: 'Scrivania Collaboratore',
    myRecipesTitle: 'Le Mie Ricette',
    myRecipesSubtitle: 'Cerca, crea, aggiorna e pubblica i tuoi piatti. Rimuovi la pubblicazione prima di eliminare una ricetta.',
    myRecipesAccessDenied: 'Sono necessari i diritti di collaboratore o amministratore per gestire le tue ricette.',
    createRecipeBtn: 'Crea Ricetta',
    searchMyRecipesPlaceholder: 'Cerca tra le tue ricette per titolo, capitolo o ingrediente...',
    statusAll: 'Tutte',
    statusPublished: 'Pubblicate',
    statusDraft: 'Non pubblicate',
    publishBtn: 'Pubblica',
    unpublishBtn: 'Rimuovi pubblicazione',
    unpublishToDeleteHint: 'Rimuovi prima la pubblicazione per eliminare',
    noMyRecipesTitle: 'Nessuna ricetta personale',
    noMyRecipesHint: 'Crea la tua prima ricetta o chiedi allo Chef di comporre un nuovo piatto.',
    openPlateBtn: 'Apri Tavola',
    backToMyRecipes: 'Torna a Le Mie Ricette',
    recipeEditorEyebrow: 'Redazione Ricetta',
    createRecipeTitle: 'Crea Nuova Ricetta',
    editRecipeTitle: 'Aggiorna Ricetta',
    recipeTitleField: 'Titolo del Piatto',
    recipeSubtitleField: 'Sottotitolo',
    recipeRegionField: 'Regione',
    recipeSeasonField: 'Stagione',
    recipePrepMinutesField: 'Prep. (min)',
    recipeCookMinutesField: 'Cottura (min)',
    recipeBaseServingsField: 'Persone base',
    recipeChefAuthorField: 'Chef / Autore',
    recipePlateImageField: 'Fotografia del Piatto',
    recipeFigureCaptionField: 'Didascalia',
    recipeExcerptField: 'Breve estratto',
    recipeStoryField: 'Racconto di cucina',
    recipePullQuoteField: 'Citazione',
    recipePairingField: 'Abbinamento Tavola',
    recipeIngredientsSection: 'Ingredienti',
    addIngredientBtn: 'Aggiungi Ingrediente',
    ingredientNamePlaceholder: 'Nome ingrediente...',
    metricAmountLabel: 'Qtà Metrica',
    metricUnitLabel: 'Unità',
    imperialAmountLabel: 'Qtà US',
    imperialUnitLabel: 'Unità US',
    recipeStepsSection: 'Passaggi di Preparazione',
    addStepBtn: 'Aggiungi Passaggio',
    stepTitleLabel: 'Titolo passaggio',
    stepInstructionLabel: 'Istruzioni',
    stepTimerMinutesLabel: 'Timer (min)',
    stepTimerLabelField: 'Etichetta timer',
    stepTipLabel: 'Consiglio dello chef (opzionale)',
    saveDraftBtn: 'Salva come Bozza',
    saveAndPublishBtn: 'Salva e Pubblica',
    saveRecipeChangesBtn: 'Salva Modifiche',
    recipePublishedToast: 'Ricetta pubblicata nel ricettario.',
    recipeUnpublishedToast: 'Pubblicazione rimossa; ricetta spostata in bozza.',
    recipeCreatedDraftToast: 'Bozza di ricetta salvata.',
    recipeUpdatedToast: 'Ricetta aggiornata.',
    dishCourseField: 'Portata',
    chefLoggedInHint: 'Chef connesso',
    uploadPhotoBtn: 'Carica foto',
    uploadPhotoHint: 'Carica una foto del piatto (JPG, PNG, WebP) o scegli una tavola qui sotto.',
    processingPhotoLabel: 'Ottimizzazione foto...',
    presetPlatesLabel: 'Oppure scegli una tavola del libro',
    unitSectionTitle: 'Unità di Misura',
    autoConvertNote: (other) => `Conversione automatica in ${other}`,
    qtyLabel: 'Qtà',
    unitLabel: 'Unità',
    seasonAllSeasons: 'Tutte le stagioni',
    seasonSpring: 'Primavera',
    seasonSummer: 'Estate',
    seasonAutumn: 'Autunno',
    seasonLateAutumn: 'Tardo autunno',
    seasonWinter: 'Inverno',
    stepVideoUrlLabel: 'Link video YouTube (opzionale)',
    stepVideoUrlPlaceholder: 'https://www.youtube.com/watch?v=...',
    invalidYouTubeUrlError: (stepNum) =>
      `Passaggio ${stepNum}: inserisci un link YouTube valido o lascia vuoto.`,
    youtubeClipHint: 'Video YouTube',
    allCoursesLabel: 'Tutte le Portate',
  },
};

export function getLocalizedSeasonLabel(
  season: string,
  lang: LanguageCode
): string {
  const t = UI_STRINGS[lang];
  switch (season.trim().toLowerCase()) {
    case 'all seasons':
      return t.seasonAllSeasons;
    case 'spring':
      return t.seasonSpring;
    case 'summer':
      return t.seasonSummer;
    case 'autumn':
    case 'fall':
      return t.seasonAutumn;
    case 'late autumn':
    case 'late fall':
      return t.seasonLateAutumn;
    case 'winter':
      return t.seasonWinter;
    default:
      return season;
  }
}

export interface LocalizedBookMeta {
  brand: string;
  volume: string;
  title: string;
  subtitle: string;
  coverCaption: string;
  foreword: string;
}

export const BOOK_METADATA_I18N: Record<LanguageCode, LocalizedBookMeta> = {
  en: {
    brand: 'Maison Feuille',
    volume: 'A public cookbook',
    title: 'The Hearth, the Coast, and the Orchard',
    subtitle: 'Seven hundred seasonal plates across fourteen chapters, their kitchen stories, and timed preparations.',
    coverCaption: 'Frontispiece — Morning mise en place on unbleached linen, Rue des Martyrs test kitchen.',
    foreword:
      'A true bistro dish is never rushed, yet every decisive moment happens by the clock—the instant butter begins to foam noisette, the three minutes an emulsion holds over gentle heat, the quiet rest before carving. Turn these pages as you would a linen-bound notebook kept beside the range.',
  },
  nl: {
    brand: 'Maison Feuille',
    volume: 'Een openbaar kookboek',
    title: 'De Haard, de Kust en de Boomgaard',
    subtitle: 'Zevenhonderd seizoensgebonden gerechten in veertien hoofdstukken, hun keukenverhalen en nauwkeurig getimede bereidingen.',
    coverCaption: 'Frontispice — Ochtend mise-en-place op ongebleekt linnen, proefkeuken Rue des Martyrs.',
    foreword:
      'Een echt bistrogerecht wordt nooit gehaast, maar elk beslissend moment draait om de klok—het ogenblik waarop boter begint te bruisen tot noisette, de drie minuten dat een emulsie bindt op zacht vuur, de rust voor het trancheren. Sla deze pagina’s om als een linnen notitieboek naast het fornuis.',
  },
  fr: {
    brand: 'Maison Feuille',
    volume: 'Un livre de cuisine public',
    title: 'L’Âtre, le Rivage et le Verger',
    subtitle: 'Sept cents assiettes de saison en quatorze chapitres, leurs récits de cuisine et leurs préparations minutées.',
    coverCaption: 'Frontispice — Mise en place matinale sur lin écru, cuisine d’essai de la Rue des Martyrs.',
    foreword:
      'Un vrai plat de bistrot ne se presse jamais, mais chaque instant décisif obéit à l’horloge : l’instant où le beurre mousse noisette, les trois minutes où l’émulsion se serre à feu doux, le repos silencieux avant la découpe. Feuilletez ces pages comme un carnet relié de lin posé près des fourneaux.',
  },
  es: {
    brand: 'Maison Feuille',
    volume: 'Un libro de cocina público',
    title: 'El Hogar, la Costa y el Huerto',
    subtitle: 'Setecientos platos de temporada en catorce capítulos, sus historias de cocina y preparaciones cronometradas.',
    coverCaption: 'Frontispicio — Mise en place matinal sobre lino crudo, cocina de pruebas Rue des Martyrs.',
    foreword:
      'Un verdadero plato de bistró nunca se apresura, pero cada momento decisivo sucede al compás del reloj: el instante en que la mantequilla espumea tostada, los tres minutos en que liga una emulsión a fuego suave, el reposo antes de trinchar. Pasa estas páginas como un cuaderno de lino junto al fogón.',
  },
  de: {
    brand: 'Maison Feuille',
    volume: 'Ein öffentliches Kochbuch',
    title: 'Der Herd, die Küste und der Obstgarten',
    subtitle: 'Siebenhundert saisonale Gerichte in vierzehn Kapiteln, ihre Küchengeschichten und zeitlich abgestimmte Zubereitungen.',
    coverCaption: 'Frontispiz — Morgendliches Mise en Place auf ungebleichtem Leinen, Versuchsküche Rue des Martyrs.',
    foreword:
      'Ein echtes Bistrogericht wird niemals gehetzt, doch jeder entscheidende Moment folgt der Uhr: der Augenblick, in dem Butter nussbraun schäumt, die drei Minuten einer Emulsion über sanfter Hitze, die Ruhezeit vor dem Tranchieren. Blättern Sie durch diese Seiten wie durch ein Leinengebundenes Notizbuch neben dem Herd.',
  },
  it: {
    brand: 'Maison Feuille',
    volume: 'Un ricettario pubblico',
    title: 'Il Focolare, la Costa e il Frutteto',
    subtitle: 'Settecento piatti stagionali in quattordici capitoli, i loro racconti di cucina e le preparazioni cronometrate.',
    coverCaption: 'Frontespizio — Mise en place mattutina su lino grezzo, cucina sperimentale di Rue des Martyrs.',
    foreword:
      'Un vero piatto da bistrot non ha mai fretta, eppure ogni istante decisivo segue l’orologio: l’attimo in cui il burro spumeggia nocciola, i tre minuti in cui l’emulsione lega a fuoco dolce, il riposo silenzioso prima di scaloppare. Sfogliate queste pagine come un taccuino rilegato in lino tenuto accanto ai fornelli.',
  },
};

export const CHAPTERS_I18N: Record<LanguageCode, Chapter[]> = {
  en: [
    {
      id: 'breakfast',
      title: 'Breakfast',
      seasonNote: 'Morning Table · Eggs, Pastries & Griddle',
      epigraph: 'Sunlit morning plates, soft-folded omelettes, warm brioche, and café-au-lait rituals.',
      sortOrder: 0,
    },
    {
      id: 'lunch',
      title: 'Lunch',
      seasonNote: 'Midday Bistro · Tartines, Salads & Bowls',
      epigraph: 'Crisp market greens, savory galettes, warm broths, and light midday plates.',
      sortOrder: 1,
    },
    {
      id: 'dinner',
      title: 'Dinner',
      seasonNote: 'Evening Service · Roast, Sear & Reduction',
      epigraph: 'Centerpiece evening courses built on crisp sears, slow wine reductions, and table service.',
      sortOrder: 2,
    },
    {
      id: 'comfort-food',
      title: 'Comfort Food',
      seasonNote: 'Hearth & Cast Iron · Slow Braises & Stews',
      epigraph: 'Slow-simmered beans, golden gratins, and deep cast-iron roasts from the back of the range.',
      sortOrder: 3,
    },
    {
      id: 'quick-easy-meals',
      title: 'Quick & Easy Meals',
      seasonNote: 'Weeknight Pantry · Under 30 Minutes',
      epigraph: 'Decisive weeknight plates relying on pantry staples and bright pan sauces in half an hour.',
      sortOrder: 4,
    },
    {
      id: 'vegetarian',
      title: 'Vegetarian',
      seasonNote: 'Market Harvest · Roots, Grains & Herbs',
      epigraph: 'Wild mushrooms, roasted roots, nutty grains, and aged alpine cheeses.',
      sortOrder: 5,
    },
    {
      id: 'international-favorites',
      title: 'International Favorites',
      seasonNote: 'World Kitchens · Regional Classics',
      epigraph: 'Beloved regional dishes spanning Italian, Asian, Mediterranean, and Mexican kitchens.',
      sortOrder: 6,
    },
    {
      id: 'international-italian',
      parentChapterId: 'international-favorites',
      title: 'Italian',
      seasonNote: 'Trattoria · Handmade Pasta, Olive Oil & Risotto',
      epigraph: 'Silky pasta emulsions, slow-simmered ragù, blistered flatbreads, and Sicilian citrus.',
      sortOrder: 7,
    },
    {
      id: 'international-asian',
      parentChapterId: 'international-favorites',
      title: 'Asian',
      seasonNote: 'Wok & Broth · Ginger, Soy & Aromatic Steam',
      epigraph: 'High-heat sear, clear dashi broths, hand-folded dumplings, and fragrant aromatics.',
      sortOrder: 8,
    },
    {
      id: 'international-mediterranean',
      parentChapterId: 'international-favorites',
      title: 'Mediterranean',
      seasonNote: 'Sun & Sea · Saffron, Fennel & Coastal Catch',
      epigraph: 'Harbor-side seafood stews, charred vegetables, extra-virgin olive oil, and saffron.',
      sortOrder: 9,
    },
    {
      id: 'international-mexican',
      parentChapterId: 'international-favorites',
      title: 'Mexican',
      seasonNote: 'Comal & Chile · Masa, Mole & Bright Lime',
      epigraph: 'Stone-ground masa, toasted dried chiles, slow-braised fillings, and crisp lime salsas.',
      sortOrder: 10,
    },
    {
      id: 'baking-bread',
      title: 'Baking & Bread',
      seasonNote: 'Oven & Flour · Levain, Tarts & Laminated Dough',
      epigraph: 'Crackling sourdough crusts, stone-milled galettes, and fluted pastry shells.',
      sortOrder: 11,
    },
    {
      id: 'desserts',
      title: 'Desserts',
      seasonNote: 'Patisserie · Burnt Honey, Custard & Fruit',
      epigraph: 'Caramelized puff pastry, vanilla bean crème diplomat, poached fruit, and table sweets.',
      sortOrder: 12,
    },
    {
      id: 'drinks',
      title: 'Drinks',
      seasonNote: 'Cellar & Bar · Infusions, Apéritifs & Coffee',
      epigraph: 'Herb-steeped shrubs, orchard spritzes, spiced winter infusions, and café digestifs.',
      sortOrder: 13,
    },
  ],
  nl: [
    {
      id: 'breakfast',
      title: 'Ontbijt',
      seasonNote: 'Ochtendtafel · Eieren, Gebak & Plaat',
      epigraph: 'Zonnige ochtendgerechten, luchtige omeletten, warme brioche en café-au-lait.',
      sortOrder: 0,
    },
    {
      id: 'lunch',
      title: 'Lunch',
      seasonNote: 'Middagbistro · Tartines, Salades & Kommen',
      epigraph: 'Knapperige marktsla, hartige galettes, warme bouillons en lichte middagplaten.',
      sortOrder: 1,
    },
    {
      id: 'dinner',
      title: 'Diner',
      seasonNote: 'Avondservice · Braden, Schroei & Reductie',
      epigraph: 'Avondgerechten met krokante korst, langzame wijnreducties en tafelservice.',
      sortOrder: 2,
    },
    {
      id: 'comfort-food',
      title: 'Comfort Food',
      seasonNote: 'Haard & Gietijzer · Stoofschotels',
      epigraph: 'Langzaam gegaarde bonen, gouden gratins en rijke gietijzeren klassiekers.',
      sortOrder: 3,
    },
    {
      id: 'quick-easy-meals',
      title: 'Snel & Makkelijk',
      seasonNote: 'Doordeweekse Voorraad · Onder 30 Minuten',
      epigraph: 'Snelle doordeweekse gerechten met voorraadkast-ingrediënten en frisse pansauzen.',
      sortOrder: 4,
    },
    {
      id: 'vegetarian',
      title: 'Vegetarisch',
      seasonNote: 'Marktoogst · Wortels, Granen & Kruiden',
      epigraph: 'Wilde paddenstoelen, geroosterde groenten, notige granen en gerijpte kazen.',
      sortOrder: 5,
    },
    {
      id: 'international-favorites',
      title: 'Internationale Favorieten',
      seasonNote: 'Wereldkeukens · Regionale Klassiekers',
      epigraph: 'Geliefde streekgerechten uit de Italiaanse, Aziatische, Mediterrane en Mexicaanse keuken.',
      sortOrder: 6,
    },
    {
      id: 'international-italian',
      parentChapterId: 'international-favorites',
      title: 'Italiaans',
      seasonNote: 'Trattoria · Verse Pasta, Olijfolie & Risotto',
      epigraph: 'Zijdezachte pasta-emulsies, langzaam gestoofde ragù en knapperige focaccia.',
      sortOrder: 7,
    },
    {
      id: 'international-asian',
      parentChapterId: 'international-favorites',
      title: 'Aziatisch',
      seasonNote: 'Wok & Bouillon · Gember, Soja & Stoom',
      epigraph: 'Hete wokbereiding, heldere dashi-bouillons, dumplings en geurige kruiden.',
      sortOrder: 8,
    },
    {
      id: 'international-mediterranean',
      parentChapterId: 'international-favorites',
      title: 'Mediterraans',
      seasonNote: 'Zon & Zee · Saffraan, Venkel & Kustvangst',
      epigraph: 'Kuststoofpotten, gegrilde groenten, olijfolie van eerste persing en saffraan.',
      sortOrder: 9,
    },
    {
      id: 'international-mexican',
      parentChapterId: 'international-favorites',
      title: 'Mexicaans',
      seasonNote: 'Comal & Chili · Masa, Mole & Limoen',
      epigraph: 'Gemalen masa, geroosterde pepers, langzaam gegaarde vullingen en frisse salsa’s.',
      sortOrder: 10,
    },
    {
      id: 'baking-bread',
      title: 'Bakken & Brood',
      seasonNote: 'Oven & Bloem · Desem, Taarten & Deeg',
      epigraph: 'Krakende zuurdesemkorsten, boekweitgalettes en knapperige taartbodems.',
      sortOrder: 11,
    },
    {
      id: 'desserts',
      title: 'Desserts',
      seasonNote: 'Patisserie · Gebrande Honing, Room & Fruit',
      epigraph: 'Gekaramelliseerd bladerdeeg, vanille-diplomatenroom en gepocheerd fruit.',
      sortOrder: 12,
    },
    {
      id: 'drinks',
      title: 'Dranken',
      seasonNote: 'Kelder & Bar · Infusies, Aperitieven & Koffie',
      epigraph: 'Kruideninfusies, boomgaard-spritzers en langzaam geschonken digestieven.',
      sortOrder: 13,
    },
  ],
  fr: [
    {
      id: 'breakfast',
      title: 'Petit-Déjeuner',
      seasonNote: 'Table du Matin · Œufs, Viennoiseries & Poêle',
      epigraph: 'Assiettes matinales ensoleillées, omelettes baveuses, brioche tiède et café au lait.',
      sortOrder: 0,
    },
    {
      id: 'lunch',
      title: 'Déjeuner',
      seasonNote: 'Bistrot de Midi · Tartines, Salades & Bols',
      epigraph: 'Jeunes pousses du marché, galettes salées et bouillons clairs pour la pause méridienne.',
      sortOrder: 1,
    },
    {
      id: 'dinner',
      title: 'Dîner',
      seasonNote: 'Service du Soir · Rôtis, Saisies & Réductions',
      epigraph: 'Plats principaux du soir bâtis sur des saisies nettes et des jus réduits au vin.',
      sortOrder: 2,
    },
    {
      id: 'comfort-food',
      title: 'Cuisine Réconfortante',
      seasonNote: 'Âtre & Fonte · Mijotés & Gratins',
      epigraph: 'Haricots mijotés, gratins dorés et cocottes en fonte au coin du fourneau.',
      sortOrder: 3,
    },
    {
      id: 'quick-easy-meals',
      title: 'Repas Rapides & Faciles',
      seasonNote: 'Garde-Manger · Moins de 30 Minutes',
      epigraph: 'Plats de semaine décidés en trente minutes avec les essentiels du placard.',
      sortOrder: 4,
    },
    {
      id: 'vegetarian',
      title: 'Végétarien',
      seasonNote: 'Récolte du Marché · Racines, Céréales & Herbes',
      epigraph: 'Girolles sauvages, légumes racines rôtis, sarrasin et fromages affinés d’alpage.',
      sortOrder: 5,
    },
    {
      id: 'international-favorites',
      title: 'Classiques Internationaux',
      seasonNote: 'Cuisines du Monde · Grands Classiques',
      epigraph: 'Recettes emblématiques des cuisines italienne, asiatique, méditerranéenne et mexicaine.',
      sortOrder: 6,
    },
    {
      id: 'international-italian',
      parentChapterId: 'international-favorites',
      title: 'Italien',
      seasonNote: 'Trattoria · Pâtes Fraîches, Huile d’Olive & Risotto',
      epigraph: 'Émulsions soyeuses de pâtes, ragoûts mijotés et agrumes de Sicile.',
      sortOrder: 7,
    },
    {
      id: 'international-asian',
      parentChapterId: 'international-favorites',
      title: 'Asiatique',
      seasonNote: 'Wok & Bouillon · Gingembre, Soja & Vapeur',
      epigraph: 'Saisies au wok vif, bouillons dashi limpides, raviolis pliés main et citronnelle.',
      sortOrder: 8,
    },
    {
      id: 'international-mediterranean',
      parentChapterId: 'international-favorites',
      title: 'Méditerranéen',
      seasonNote: 'Soleil & Rivage · Safran, Fenouil & Pêche',
      epigraph: 'Soupes de roche parfumées au safran, légumes grillés et huile d’olive vierge.',
      sortOrder: 9,
    },
    {
      id: 'international-mexican',
      parentChapterId: 'international-favorites',
      title: 'Mexicain',
      seasonNote: 'Comal & Piment · Masa, Mole & Citron Vert',
      epigraph: 'Masa moulue sur pierre, piments séchés toastés et salsas vives au citron vert.',
      sortOrder: 10,
    },
    {
      id: 'baking-bread',
      title: 'Pains & Pâtisserie Boulangère',
      seasonNote: 'Four & Farine · Levain, Tartes & Feuilletage',
      epigraph: 'Croûtes au levain chantantes, galettes au sarrasin et fonds de tarte sablés.',
      sortOrder: 11,
    },
    {
      id: 'desserts',
      title: 'Desserts',
      seasonNote: 'Pâtisserie · Miel Brûlé, Crèmes & Verger',
      epigraph: 'Feuilletage caramélisé, crème diplomate à la vanille et fruits pochés.',
      sortOrder: 12,
    },
    {
      id: 'drinks',
      title: 'Boissons',
      seasonNote: 'Cave & Comptoir · Infusions, Apéritifs & Cafés',
      epigraph: 'Infusions d’herbes, spritz du verger, élixirs d’épices et digestifs de comptoir.',
      sortOrder: 13,
    },
  ],
  es: [
    {
      id: 'breakfast',
      title: 'Desayuno',
      seasonNote: 'Mesa de Mañana · Huevos, Bollería y Plancha',
      epigraph: 'Platos luminosos de mañana, tortillas jugosas, brioche tibio y café con leche.',
      sortOrder: 0,
    },
    {
      id: 'lunch',
      title: 'Almuerzo',
      seasonNote: 'Bistró de Mediodía · Tostadas, Ensaladas y Cuencos',
      epigraph: 'Brotes tiernos del mercado, galettes saladas y caldos ligeros de mediodía.',
      sortOrder: 1,
    },
    {
      id: 'dinner',
      title: 'Cena',
      seasonNote: 'Servicio Nocturno · Asados, Sellados y Reducciones',
      epigraph: 'Platos centrales de noche con pieles crujientes, reducciones de vino y emplatado cuidado.',
      sortOrder: 2,
    },
    {
      id: 'comfort-food',
      title: 'Comida Reconfortante',
      seasonNote: 'Hogar y Hierro · Guisos y Estofados Lentos',
      epigraph: 'Alubias guisadas a fuego lento, gratinados dorados y cazuelas de hierro fundido.',
      sortOrder: 3,
    },
    {
      id: 'quick-easy-meals',
      title: 'Comidas Rápidas y Fáciles',
      seasonNote: 'Despensa Diaria · Menos de 30 Minutos',
      epigraph: 'Recetas ágiles de entre semana con ingredientes de despensa y salsas rápidas.',
      sortOrder: 4,
    },
    {
      id: 'vegetarian',
      title: 'Vegetariano',
      seasonNote: 'Cosecha de Mercado · Raíces, Granos y Hierbas',
      epigraph: 'Setas silvestres, raíces asadas, cereales tostados y quesos alpinos curados.',
      sortOrder: 5,
    },
    {
      id: 'international-favorites',
      title: 'Favoritos Internacionales',
      seasonNote: 'Cocinas del Mundo · Clásicos Regionales',
      epigraph: 'Platos emblemáticos de las cocinas italiana, asiática, mediterránea y mexicana.',
      sortOrder: 6,
    },
    {
      id: 'international-italian',
      parentChapterId: 'international-favorites',
      title: 'Italiana',
      seasonNote: 'Trattoria · Pasta Fresca, Aceite y Risotto',
      epigraph: 'Emulsiones sedosas de pasta, ragú lento y cítricos brillantes de Sicilia.',
      sortOrder: 7,
    },
    {
      id: 'international-asian',
      parentChapterId: 'international-favorites',
      title: 'Asiática',
      seasonNote: 'Wok y Caldo · Jengibre, Soja y Vapor',
      epigraph: 'Salteados a fuego vivo, caldos dashi limpios, dumplings y hierbas aromáticas.',
      sortOrder: 8,
    },
    {
      id: 'international-mediterranean',
      parentChapterId: 'international-favorites',
      title: 'Mediterránea',
      seasonNote: 'Sol y Mar · Azafrán, Hinojo y Pesca Costera',
      epigraph: 'Calderetas marineras con azafrán, verduras al carbón y aceite de oliva virgen.',
      sortOrder: 9,
    },
    {
      id: 'international-mexican',
      parentChapterId: 'international-favorites',
      title: 'Mexicana',
      seasonNote: 'Comal y Chile · Masa, Mole y Lima Fresca',
      epigraph: 'Masa molida a la piedra, chiles secos tostados, guisos lentos y salsas frescas.',
      sortOrder: 10,
    },
    {
      id: 'baking-bread',
      title: 'Panadería y Horno',
      seasonNote: 'Horno y Harina · Masa Madre, Tartas y Hojaldre',
      epigraph: 'Cortezas crujientes de masa madre, galettes de trigo sarraceno y tartas horneadas.',
      sortOrder: 11,
    },
    {
      id: 'desserts',
      title: 'Postres',
      seasonNote: 'Pastelería · Miel Tostada, Crema y Fruta',
      epigraph: 'Hojaldre caramelizado, crema diplomática de vainilla y fruta escalfada.',
      sortOrder: 12,
    },
    {
      id: 'drinks',
      title: 'Bebidas',
      seasonNote: 'Bodega y Barra · Infusiones, Aperitivos y Café',
      epigraph: 'Infusiones herbales, spritz de huerto, bebidas especiadas y digestivos.',
      sortOrder: 13,
    },
  ],
  de: [
    {
      id: 'breakfast',
      title: 'Frühstück',
      seasonNote: 'Morgentisch · Eier, Gebäck & Pfanne',
      epigraph: 'Leichte Morgengerichte, zarte Omeletts, warme Brioche und Café-au-Lait-Rituale.',
      sortOrder: 0,
    },
    {
      id: 'lunch',
      title: 'Mittagessen',
      seasonNote: 'Mittagsbistro · Tartines, Salate & Bowls',
      epigraph: 'Knackige Marktsalate, herzhafte Galettes und wärmende Mittagsbrühen.',
      sortOrder: 1,
    },
    {
      id: 'dinner',
      title: 'Abendessen',
      seasonNote: 'Abendservice · Braten, Rösten & Reduktion',
      epigraph: 'Abendliche Hauptgänge mit krosser Haut, feinen Weinreduktionen und Tischservice.',
      sortOrder: 2,
    },
    {
      id: 'comfort-food',
      title: 'Comfort Food',
      seasonNote: 'Herd & Gusseisen · Schmorgerichte & Eintöpfe',
      epigraph: 'Langsam gekochte Bohnen, goldene Gratins und herzhafte Braten im Gusseisentopf.',
      sortOrder: 3,
    },
    {
      id: 'quick-easy-meals',
      title: 'Schnell & Einfach',
      seasonNote: 'Alltagsküche · Unter 30 Minuten',
      epigraph: 'Klare Feierabendgerichte aus der Vorratskammer mit frischen Pfannensaucen.',
      sortOrder: 4,
    },
    {
      id: 'vegetarian',
      title: 'Vegetarisch',
      seasonNote: 'Markternte · Wurzeln, Getreide & Kräuter',
      epigraph: 'Wilde Pfifferlinge, geröstetes Wurzelgemüse, Buchweizen und gereifter Bergkäse.',
      sortOrder: 5,
    },
    {
      id: 'international-favorites',
      title: 'Internationale Favoriten',
      seasonNote: 'Weltküchen · Regionale Klassiker',
      epigraph: 'Beliebte Klassiker der italienischen, asiatischen, mediterranen und mexikanischen Küche.',
      sortOrder: 6,
    },
    {
      id: 'international-italian',
      parentChapterId: 'international-favorites',
      title: 'Italienisch',
      seasonNote: 'Trattoria · Frische Pasta, Olivenöl & Risotto',
      epigraph: 'Seidige Pasta-Emulsionen, langsam geschmortes Ragù und sizilianische Zitrusnoten.',
      sortOrder: 7,
    },
    {
      id: 'international-asian',
      parentChapterId: 'international-favorites',
      title: 'Asiatisch',
      seasonNote: 'Wok & Brühe · Ingwer, Soja & Dampf',
      epigraph: 'Scharfes Wok-Anbraten, klare Dashi-Brühen, handgefaltete Dumplings und Zitronengras.',
      sortOrder: 8,
    },
    {
      id: 'international-mediterranean',
      parentChapterId: 'international-favorites',
      title: 'Mediterran',
      seasonNote: 'Sonne & Meer · Safran, Fenchel & Küstenfang',
      epigraph: 'Hafen-Fischeintöpfe mit Safran, gegrilltes Gemüse und natives Olivenöl.',
      sortOrder: 9,
    },
    {
      id: 'international-mexican',
      parentChapterId: 'international-favorites',
      title: 'Mexikanisch',
      seasonNote: 'Comal & Chili · Masa, Mole & Limette',
      epigraph: 'Steingemahlene Masa, geröstete Trockenchilis, zarte Schmorgerichte und frische Salsas.',
      sortOrder: 10,
    },
    {
      id: 'baking-bread',
      title: 'Backen & Brot',
      seasonNote: 'Ofen & Mehl · Sauerteig, Tartes & Blätterteig',
      epigraph: 'Knusprige Sauerteigkrusten, Buchweizen-Galettes und mürbe Tarteböden.',
      sortOrder: 11,
    },
    {
      id: 'desserts',
      title: 'Desserts',
      seasonNote: 'Patisserie · Gebrannter Honig, Creme & Obst',
      epigraph: 'Karamellisierter Blätterteig, Vanille-Diplomatencreme und pochierte Birnen.',
      sortOrder: 12,
    },
    {
      id: 'drinks',
      title: 'Getränke',
      seasonNote: 'Keller & Bar · Aufgüsse, Aperitifs & Kaffee',
      epigraph: 'Kräuterauszüge, Obstgarten-Spritz, Gewürzaufgüsse und klassische Digestifs.',
      sortOrder: 13,
    },
  ],
  it: [
    {
      id: 'breakfast',
      title: 'Colazione',
      seasonNote: 'Tavola del Mattino · Uova, Lievitati & Piastra',
      epigraph: 'Piatti luminosi del mattino, omelette morbide, brioche calde e caffellatte.',
      sortOrder: 0,
    },
    {
      id: 'lunch',
      title: 'Pranzo',
      seasonNote: 'Bistrot di Mezzogiorno · Tartine, Insalate & Zuppe',
      epigraph: 'Insalate croccanti di mercato, galette salate e brodi caldi di metà giornata.',
      sortOrder: 1,
    },
    {
      id: 'dinner',
      title: 'Cena',
      seasonNote: 'Servizio Serale · Arrosti, Scottature & Riduzioni',
      epigraph: 'Portate serali protagoniste costruite su pelli croccanti e riduzioni lente al vino.',
      sortOrder: 2,
    },
    {
      id: 'comfort-food',
      title: 'Comfort Food',
      seasonNote: 'Focolare & Ghisa · Brasati & Stufati Lenti',
      epigraph: 'Fagioli cotti lentamente, gratin dorati e ricche casseruole in ghisa.',
      sortOrder: 3,
    },
    {
      id: 'quick-easy-meals',
      title: 'Piatti Veloci e Facili',
      seasonNote: 'Dispensa Quotidiana · Sotto i 30 Minuti',
      epigraph: 'Piatti decisi per la settimana con ingredienti di dispensa e salse espresse.',
      sortOrder: 4,
    },
    {
      id: 'vegetarian',
      title: 'Vegetariano',
      seasonNote: 'Raccolto del Mercato · Radici, Cereali & Erbe',
      epigraph: 'Finferli selvatici, radici arrostite, grano saraceno e formaggi alpini stagionati.',
      sortOrder: 5,
    },
    {
      id: 'international-favorites',
      title: 'Classici Internazionali',
      seasonNote: 'Cucine dal Mondo · Tradizioni Regionali',
      epigraph: 'Piatti regionali amati tra cucina italiana, asiatica, mediterranea e messicana.',
      sortOrder: 6,
    },
    {
      id: 'international-italian',
      parentChapterId: 'international-favorites',
      title: 'Italiana',
      seasonNote: 'Trattoria · Pasta Fresca, Olio & Risotto',
      epigraph: 'Emulsioni setose di pasta, ragù lenti e agrumi luminosi di Sicilia.',
      sortOrder: 7,
    },
    {
      id: 'international-asian',
      parentChapterId: 'international-favorites',
      title: 'Asiatica',
      seasonNote: 'Wok & Brodo · Zenzero, Soia & Vapore',
      epigraph: 'Cotture rapide nel wok, brodi dashi limpidi, ravioli fatti a mano e citronella.',
      sortOrder: 8,
    },
    {
      id: 'international-mediterranean',
      parentChapterId: 'international-favorites',
      title: 'Mediterranea',
      seasonNote: 'Sole & Mare · Zafferano, Finocchietto & Pescato',
      epigraph: 'Zuppe di pesce da porto allo zafferano, verdure arrosto e olio extravergine.',
      sortOrder: 9,
    },
    {
      id: 'international-mexican',
      parentChapterId: 'international-favorites',
      title: 'Messicana',
      seasonNote: 'Comal & Peperoncino · Masa, Mole & Lime',
      epigraph: 'Masa macinata a pietra, peperoncini tostati, stufati lenti e salse fresche al lime.',
      sortOrder: 10,
    },
    {
      id: 'baking-bread',
      title: 'Pane e Prodotti da Forno',
      seasonNote: 'Forno & Farina · Lievito Madre, Torte & Sfoglia',
      epigraph: 'Croste croccanti di lievito madre, galette di grano saraceno e gusci di frolla.',
      sortOrder: 11,
    },
    {
      id: 'desserts',
      title: 'Dolci',
      seasonNote: 'Pasticceria · Miele Bruciato, Creme & Frutta',
      epigraph: 'Sfoglia caramellata, crema diplomatica alla vaniglia e frutta sciroppata.',
      sortOrder: 12,
    },
    {
      id: 'drinks',
      title: 'Bevande',
      seasonNote: 'Cantina & Bar · Infusi, Aperitivi & Caffè',
      epigraph: 'Infusi alle erbe, spritz del frutteto, bevande speziate e digestivi della casa.',
      sortOrder: 13,
    },
  ],
};

export function formatPersonLabel(count: number, lang: LanguageCode): string {
  const strings = UI_STRINGS[lang];
  return count === 1 ? strings.personSingular : strings.personPlural;
}

export function getLocalizedChapters(lang: LanguageCode): Chapter[] {
  return CHAPTERS_I18N[lang] ?? CHAPTERS_I18N.en;
}
