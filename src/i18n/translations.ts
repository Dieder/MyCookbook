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

export const THEME_OPTIONS: ThemeId[] = ['whitepaper', 'modern', 'colorful'];

export interface UIStrings {
  // Navigation & Preferences
  navCover: string;
  navChapters: string;
  navCards: string;
  navSaved: string;
  cookMode: string;
  cookModeActive: (count: number) => string;
  languageLabel: string;
  themeLabel: string;
  themeWhitepaper: string;
  themeModern: string;
  themeColorful: string;

  // Frontispiece / Cover
  openFirstPlate: string;
  askChefForRecipe: string;
  browsePlates: string;
  tableOfContents: string;
  threeChaptersTitle: string;
  platesSummary: (plates: number, clips: number, timed: number) => string;
  chapterPrefix: string;
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
}

export const UI_STRINGS: Record<LanguageCode, UIStrings> = {
  en: {
    navCover: 'Cover',
    navChapters: 'Chapters',
    navCards: 'Recipe Cards',
    navSaved: 'Saved',
    cookMode: 'Cook Mode',
    cookModeActive: (c) => `Cook Mode · ${c} Active`,
    languageLabel: 'Language',
    themeLabel: 'Theme',
    themeWhitepaper: 'Whitepaper',
    themeModern: 'Modern',
    themeColorful: 'Colorful',

    openFirstPlate: 'Open Plate I',
    askChefForRecipe: 'Ask Chef for a Recipe',
    browsePlates: 'Browse Plates',
    tableOfContents: 'Table of Contents',
    threeChaptersTitle: 'Three Chapters from the Seasonal Bistro',
    platesSummary: (p, c, t) => `${p} Plates · ${c} Prep Clips · ${t} Timed Steps`,
    chapterPrefix: 'Chapter',
    clipsUnit: 'clips',
    minUnit: 'min',
    saveRecipeAria: 'Save recipe',
    removeBookmarkAria: 'Remove bookmark',

    personalBookmarkShelf: 'Personal Bookmark Shelf',
    seasonalBistroFolio: 'Seasonal Bistro Folio',
    savedTitle: 'Saved Recipes & Kitchen Bookmarks',
    chaptersTitle: 'Chapters & Illustrated Plates',
    filterPlaceholder: 'Filter by dish or ingredient...',
    filterAria: 'Filter recipes',
    askChefShort: 'Ask Chef for Recipe',
    allChapters: 'All Chapters',
    signOut: 'Sign out',
    signInSync: 'Sign in to Sync Cookbook',
    noBookmarksTitle: 'No recipes bookmarked yet',
    noMatchesTitle: 'No matching plates found',
    noBookmarksHint: 'Use the bookmark ribbon on any dish to gather your seasonal menu in one place.',
    noMatchesHint: 'Try clearing your search term or switching back to all chapters.',
    browseSeasonalChapters: 'Browse Seasonal Chapters',
    servesCount: (c) => `Serves ${c}`,
    readStoryCard: 'Read Story & Recipe Card →',
    timersCount: (c) => `${c} timers`,
    watchPrepClip: 'Watch Prep Clip',

    miseEnPlaceIndex: 'Bistro Mise en Place Index',
    collectibleCardsTitle: 'Collectible Recipe Cards',
    metricFull: 'Metric (g/ml)',
    usCustomaryFull: 'US Customary',
    filterByChapterAria: 'Filter recipe cards by chapter',
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
  },

  nl: {
    navCover: 'Omslag',
    navChapters: 'Hoofdstukken',
    navCards: 'Receptkaarten',
    navSaved: 'Bewaard',
    cookMode: 'Kookmodus',
    cookModeActive: (c) => `Kookmodus · ${c} Actief`,
    languageLabel: 'Taal',
    themeLabel: 'Thema',
    themeWhitepaper: 'Wit papier',
    themeModern: 'Modern',
    themeColorful: 'Kleurrijk',

    openFirstPlate: 'Open Plaat I',
    askChefForRecipe: 'Vraag de Chef om een Recept',
    browsePlates: 'Bekijk Gerechten',
    tableOfContents: 'Inhoudsopgave',
    threeChaptersTitle: 'Drie Hoofdstukken uit de Seizoensbistro',
    platesSummary: (p, c, t) => `${p} Gerechten · ${c} Techniekclips · ${t} Kooktimers`,
    chapterPrefix: 'Hoofdstuk',
    clipsUnit: 'clips',
    minUnit: 'min',
    saveRecipeAria: 'Recept bewaren',
    removeBookmarkAria: 'Bladwijzer verwijderen',

    personalBookmarkShelf: 'Persoonlijke Bladwijzers',
    seasonalBistroFolio: 'Seizoensbistro Folio',
    savedTitle: 'Bewaarde Recepten & Keukenbladwijzers',
    chaptersTitle: 'Hoofdstukken & Geïllustreerde Platen',
    filterPlaceholder: 'Filter op gerecht of ingrediënt...',
    filterAria: 'Recepten filteren',
    askChefShort: 'Vraag Recept aan Chef',
    allChapters: 'Alle Hoofdstukken',
    signOut: 'Uitloggen',
    signInSync: 'Inloggen om Kookboek te Synchroniseren',
    noBookmarksTitle: 'Nog geen recepten bewaard',
    noMatchesTitle: 'Geen overeenkomende gerechten',
    noBookmarksHint: 'Gebruik het bladwijzerlint bij elk gerecht om je seizoensmenu te verzamelen.',
    noMatchesHint: 'Wis de zoekterm of ga terug naar alle hoofdstukken.',
    browseSeasonalChapters: 'Bekijk Seizoenshoofdstukken',
    servesCount: (c) => `Voor ${c}`,
    readStoryCard: 'Lees Verhaal & Receptkaart →',
    timersCount: (c) => `${c} timers`,
    watchPrepClip: 'Bekijk Bereidingsclip',

    miseEnPlaceIndex: 'Bistro Mise en Place Index',
    collectibleCardsTitle: 'Verzamelbare Receptkaarten',
    metricFull: 'Metriek (g/ml)',
    usCustomaryFull: 'VS Maten',
    filterByChapterAria: 'Filter receptkaarten op hoofdstuk',
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
  },

  fr: {
    navCover: 'Couverture',
    navChapters: 'Chapitres',
    navCards: 'Fiches Recettes',
    navSaved: 'Favoris',
    cookMode: 'Mode Cuisine',
    cookModeActive: (c) => `Mode Cuisine · ${c} Actif${c > 1 ? 's' : ''}`,
    languageLabel: 'Langue',
    themeLabel: 'Thème',
    themeWhitepaper: 'Papier blanc',
    themeModern: 'Moderne',
    themeColorful: 'Coloré',

    openFirstPlate: 'Ouvrir Planche I',
    askChefForRecipe: 'Demander une Recette au Chef',
    browsePlates: 'Parcourir les Plats',
    tableOfContents: 'Table des Matières',
    threeChaptersTitle: 'Trois Chapitres du Bistrot de Saison',
    platesSummary: (p, c, t) => `${p} Plats · ${c} Clips Techniques · ${t} Minuteurs`,
    chapterPrefix: 'Chapitre',
    clipsUnit: 'clips',
    minUnit: 'min',
    saveRecipeAria: 'Enregistrer la recette',
    removeBookmarkAria: 'Retirer le signet',

    personalBookmarkShelf: 'Étagère de Signets',
    seasonalBistroFolio: 'Folio Bistrot de Saison',
    savedTitle: 'Recettes Enregistrées & Signets',
    chaptersTitle: 'Chapitres & Planches Illustrées',
    filterPlaceholder: 'Filtrer par plat ou ingrédient...',
    filterAria: 'Filtrer les recettes',
    askChefShort: 'Demander au Chef',
    allChapters: 'Tous les Chapitres',
    signOut: 'Déconnexion',
    signInSync: 'Se connecter pour Synchroniser',
    noBookmarksTitle: 'Aucune recette enregistrée',
    noMatchesTitle: 'Aucun plat correspondant',
    noBookmarksHint: 'Utilisez le ruban signet sur n’importe quel plat pour composer votre menu.',
    noMatchesHint: 'Effacez votre recherche ou revenez à tous les chapitres.',
    browseSeasonalChapters: 'Parcourir les Chapitres',
    servesCount: (c) => `Pour ${c}`,
    readStoryCard: 'Lire le Récit & la Fiche →',
    timersCount: (c) => `${c} minuteurs`,
    watchPrepClip: 'Voir le Geste Technique',

    miseEnPlaceIndex: 'Index Mise en Place',
    collectibleCardsTitle: 'Fiches Recettes de Collection',
    metricFull: 'Métrique (g/ml)',
    usCustomaryFull: 'Mesures US',
    filterByChapterAria: 'Filtrer les fiches par chapitre',
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
  },

  es: {
    navCover: 'Portada',
    navChapters: 'Capítulos',
    navCards: 'Fichas',
    navSaved: 'Guardados',
    cookMode: 'Modo Cocina',
    cookModeActive: (c) => `Modo Cocina · ${c} Activo${c > 1 ? 's' : ''}`,
    languageLabel: 'Idioma',
    themeLabel: 'Tema',
    themeWhitepaper: 'Papel blanco',
    themeModern: 'Moderno',
    themeColorful: 'Colorido',

    openFirstPlate: 'Abrir Lámina I',
    askChefForRecipe: 'Pedir Receta al Chef',
    browsePlates: 'Explorar Platos',
    tableOfContents: 'Índice General',
    threeChaptersTitle: 'Tres Capítulos del Bistró de Temporada',
    platesSummary: (p, c, t) => `${p} Platos · ${c} Clips · ${t} Temporizadores`,
    chapterPrefix: 'Capítulo',
    clipsUnit: 'clips',
    minUnit: 'min',
    saveRecipeAria: 'Guardar receta',
    removeBookmarkAria: 'Quitar marcador',

    personalBookmarkShelf: 'Estantería Personal',
    seasonalBistroFolio: 'Folio Bistró de Temporada',
    savedTitle: 'Recetas Guardadas y Marcadores',
    chaptersTitle: 'Capítulos y Láminas Ilustradas',
    filterPlaceholder: 'Filtrar por plato o ingrediente...',
    filterAria: 'Filtrar recetas',
    askChefShort: 'Pedir Receta',
    allChapters: 'Todos los Capítulos',
    signOut: 'Cerrar sesión',
    signInSync: 'Iniciar sesión para Sincronizar',
    noBookmarksTitle: 'Aún no hay recetas guardadas',
    noMatchesTitle: 'No se encontraron platos',
    noBookmarksHint: 'Usa el marcador en cualquier plato para reunir tu menú de temporada.',
    noMatchesHint: 'Prueba a borrar el filtro o volver a todos los capítulos.',
    browseSeasonalChapters: 'Ver Capítulos de Temporada',
    servesCount: (c) => `Para ${c}`,
    readStoryCard: 'Leer Historia y Ficha →',
    timersCount: (c) => `${c} relojes`,
    watchPrepClip: 'Ver Técnica',

    miseEnPlaceIndex: 'Índice de Mise en Place',
    collectibleCardsTitle: 'Fichas de Receta Coleccionables',
    metricFull: 'Métrico (g/ml)',
    usCustomaryFull: 'Medidas EE. UU.',
    filterByChapterAria: 'Filtrar fichas por capítulo',
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
  },

  de: {
    navCover: 'Einband',
    navChapters: 'Kapitel',
    navCards: 'Rezeptkarten',
    navSaved: 'Gespeichert',
    cookMode: 'Kochmodus',
    cookModeActive: (c) => `Kochmodus · ${c} Aktiv`,
    languageLabel: 'Sprache',
    themeLabel: 'Design',
    themeWhitepaper: 'Weißes Papier',
    themeModern: 'Modern',
    themeColorful: 'Farbenfroh',

    openFirstPlate: 'Tafel I öffnen',
    askChefForRecipe: 'Chef nach Rezept fragen',
    browsePlates: 'Gerichte ansehen',
    tableOfContents: 'Inhaltsverzeichnis',
    threeChaptersTitle: 'Drei Kapitel aus dem Saison-Bistro',
    platesSummary: (p, c, t) => `${p} Tafeln · ${c} Technikclips · ${t} Kochtimer`,
    chapterPrefix: 'Kapitel',
    clipsUnit: 'Clips',
    minUnit: 'Min.',
    saveRecipeAria: 'Rezept merken',
    removeBookmarkAria: 'Lesezeichen entfernen',

    personalBookmarkShelf: 'Persönliches Lesezeichen-Regal',
    seasonalBistroFolio: 'Saisonales Bistro-Folio',
    savedTitle: 'Gespeicherte Rezepte & Lesezeichen',
    chaptersTitle: 'Kapitel & Illustrierte Tafeln',
    filterPlaceholder: 'Nach Gericht oder Zutat filtern...',
    filterAria: 'Rezepte filtern',
    askChefShort: 'Rezept anfragen',
    allChapters: 'Alle Kapitel',
    signOut: 'Abmelden',
    signInSync: 'Anmelden zum Synchronisieren',
    noBookmarksTitle: 'Noch keine Rezepte gemerkt',
    noMatchesTitle: 'Keine passenden Gerichte gefunden',
    noBookmarksHint: 'Nutze das Lesezeichen bei jedem Gericht, um dein Saisonmenü zu sammeln.',
    noMatchesHint: 'Lösche den Suchbegriff oder wechsle zurück zu allen Kapiteln.',
    browseSeasonalChapters: 'Kapitel durchstöbern',
    servesCount: (c) => `Für ${c}`,
    readStoryCard: 'Geschichte & Rezeptkarte →',
    timersCount: (c) => `${c} Timer`,
    watchPrepClip: 'Technik-Clip ansehen',

    miseEnPlaceIndex: 'Bistro Mise-en-Place-Index',
    collectibleCardsTitle: 'Sammelbare Rezeptkarten',
    metricFull: 'Metrisch (g/ml)',
    usCustomaryFull: 'US-Einheiten',
    filterByChapterAria: 'Rezeptkarten nach Kapitel filtern',
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
  },

  it: {
    navCover: 'Copertina',
    navChapters: 'Capitoli',
    navCards: 'Schede Ricette',
    navSaved: 'Salvati',
    cookMode: 'Modalità Cucina',
    cookModeActive: (c) => `Cucina · ${c} Attiv${c > 1 ? 'i' : 'o'}`,
    languageLabel: 'Lingua',
    themeLabel: 'Tema',
    themeWhitepaper: 'Carta bianca',
    themeModern: 'Moderno',
    themeColorful: 'Colorato',

    openFirstPlate: 'Apri Tavola I',
    askChefForRecipe: 'Chiedi una Ricetta allo Chef',
    browsePlates: 'Sfoglia i Piatti',
    tableOfContents: 'Indice dei Capitoli',
    threeChaptersTitle: 'Tre Capitoli dal Bistrot di Stagione',
    platesSummary: (p, c, t) => `${p} Piatti · ${c} Clip Tecniche · ${t} Timer`,
    chapterPrefix: 'Capitolo',
    clipsUnit: 'clip',
    minUnit: 'min',
    saveRecipeAria: 'Salva ricetta',
    removeBookmarkAria: 'Rimuovi segnalibro',

    personalBookmarkShelf: 'Scaffale Personale',
    seasonalBistroFolio: 'Folio Bistrot di Stagione',
    savedTitle: 'Ricette Salvate e Segnalibri',
    chaptersTitle: 'Capitoli e Tavole Illustrate',
    filterPlaceholder: 'Filtra per piatto o ingrediente...',
    filterAria: 'Filtra ricette',
    askChefShort: 'Chiedi allo Chef',
    allChapters: 'Tutti i Capitoli',
    signOut: 'Esci',
    signInSync: 'Accedi per Sincronizzare',
    noBookmarksTitle: 'Nessuna ricetta salvata',
    noMatchesTitle: 'Nessun piatto trovato',
    noBookmarksHint: 'Usa il segnalibro su qualsiasi piatto per raccogliere il tuo menu di stagione.',
    noMatchesHint: 'Prova a cancellare la ricerca o torna a tutti i capitoli.',
    browseSeasonalChapters: 'Sfoglia i Capitoli',
    servesCount: (c) => `Per ${c}`,
    readStoryCard: 'Leggi Storia & Scheda →',
    timersCount: (c) => `${c} timer`,
    watchPrepClip: 'Guarda Tecnica',

    miseEnPlaceIndex: 'Indice Mise en Place',
    collectibleCardsTitle: 'Schede Ricette da Collezione',
    metricFull: 'Metrico (g/ml)',
    usCustomaryFull: 'Misure US',
    filterByChapterAria: 'Filtra schede per capitolo',
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
  },
};

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
    volume: 'Volume IV · Autumn–Winter Monograph',
    title: 'The Hearth, the Coast, and the Orchard',
    subtitle: 'Six seasonal bistro plates, their kitchen stories, and timed preparations.',
    coverCaption: 'Frontispiece — Morning mise en place on unbleached linen, Rue des Martyrs test kitchen.',
    foreword:
      'A true bistro dish is never rushed, yet every decisive moment happens by the clock—the instant butter begins to foam noisette, the three minutes an emulsion holds over gentle heat, the quiet rest before carving. Turn these pages as you would a linen-bound notebook kept beside the range.',
  },
  nl: {
    brand: 'Maison Feuille',
    volume: 'Deel IV · Herfst–Winter Monografie',
    title: 'De Haard, de Kust en de Boomgaard',
    subtitle: 'Zes seizoensgebonden bistrogerechten, hun keukenverhalen en nauwkeurig getimede bereidingen.',
    coverCaption: 'Frontispice — Ochtend mise-en-place op ongebleekt linnen, proefkeuken Rue des Martyrs.',
    foreword:
      'Een echt bistrogerecht wordt nooit gehaast, maar elk beslissend moment draait om de klok—het ogenblik waarop boter begint te bruisen tot noisette, de drie minuten dat een emulsie bindt op zacht vuur, de rust voor het trancheren. Sla deze pagina’s om als een linnen notitieboek naast het fornuis.',
  },
  fr: {
    brand: 'Maison Feuille',
    volume: 'Tome IV · Monographie Automne–Hiver',
    title: 'L’Âtre, le Rivage et le Verger',
    subtitle: 'Six assiettes de bistrot de saison, leurs récits de cuisine et leurs préparations minutées.',
    coverCaption: 'Frontispice — Mise en place matinale sur lin écru, cuisine d’essai de la Rue des Martyrs.',
    foreword:
      'Un vrai plat de bistrot ne se presse jamais, mais chaque instant décisif obéit à l’horloge : l’instant où le beurre mousse noisette, les trois minutes où l’émulsion se serre à feu doux, le repos silencieux avant la découpe. Feuilletez ces pages comme un carnet relié de lin posé près des fourneaux.',
  },
  es: {
    brand: 'Maison Feuille',
    volume: 'Volumen IV · Monografía Otoño–Invierno',
    title: 'El Hogar, la Costa y el Huerto',
    subtitle: 'Seis platos de bistró de temporada, sus historias de cocina y preparaciones cronometradas.',
    coverCaption: 'Frontispicio — Mise en place matinal sobre lino crudo, cocina de pruebas Rue des Martyrs.',
    foreword:
      'Un verdadero plato de bistró nunca se apresura, pero cada momento decisivo sucede al compás del reloj: el instante en que la mantequilla espumea tostada, los tres minutos en que liga una emulsión a fuego suave, el reposo antes de trinchar. Pasa estas páginas como un cuaderno de lino junto al fogón.',
  },
  de: {
    brand: 'Maison Feuille',
    volume: 'Band IV · Herbst–Winter Monografie',
    title: 'Der Herd, die Küste und der Obstgarten',
    subtitle: 'Sechs saisonale Bistrogerichte, ihre Küchengeschichten und zeitlich abgestimmte Zubereitungen.',
    coverCaption: 'Frontispiz — Morgendliches Mise en Place auf ungebleichtem Leinen, Versuchsküche Rue des Martyrs.',
    foreword:
      'Ein echtes Bistrogericht wird niemals gehetzt, doch jeder entscheidende Moment folgt der Uhr: der Augenblick, in dem Butter nussbraun schäumt, die drei Minuten einer Emulsion über sanfter Hitze, die Ruhezeit vor dem Tranchieren. Blättern Sie durch diese Seiten wie durch ein Leinengebundenes Notizbuch neben dem Herd.',
  },
  it: {
    brand: 'Maison Feuille',
    volume: 'Volume IV · Monografia Autunno–Inverno',
    title: 'Il Focolare, la Costa e il Frutteto',
    subtitle: 'Sei piatti stagionali da bistrot, i loro racconti di cucina e le preparazioni cronometrate.',
    coverCaption: 'Frontespizio — Mise en place mattutina su lino grezzo, cucina sperimentale di Rue des Martyrs.',
    foreword:
      'Un vero piatto da bistrot non ha mai fretta, eppure ogni istante decisivo segue l’orologio: l’attimo in cui il burro spumeggia nocciola, i tre minuti in cui l’emulsione lega a fuoco dolce, il riposo silenzioso prima di scaloppare. Sfogliate queste pagine come un taccuino rilegato in lino tenuto accanto ai fornelli.',
  },
};

export const CHAPTERS_I18N: Record<LanguageCode, Chapter[]> = {
  en: [
    {
      id: 'hearth-harvest',
      romanIndex: 'I',
      title: 'Hearth & Harvest',
      seasonNote: 'Late Autumn · Cellar Roots & Cast Iron',
      epigraph:
        'Slow-rendered duck fat, wild chanterelles brushed clean of pine needles, and deep copper pots set at the back of the range.',
    },
    {
      id: 'coastal-market',
      romanIndex: 'II',
      title: 'Coastal & Market',
      seasonNote: 'Early Winter · Tide, Fennel & Saffron',
      epigraph:
        'Line-caught sea bass crisped skin-down and saffron broth steeped slowly with bruised fennel fronds and toasted bread.',
    },
    {
      id: 'orchard-patisserie',
      romanIndex: 'III',
      title: 'Orchard & Patisserie',
      seasonNote: 'Orchard Cellar · Warm Pastry & Burnt Honey',
      epigraph:
        'Bosc pears poached in spiced cider reduction and laminated pastry shattered between spoons of Madagascar vanilla cream.',
    },
  ],
  nl: [
    {
      id: 'hearth-harvest',
      romanIndex: 'I',
      title: 'Haard & Oogst',
      seasonNote: 'Late Herfst · Kelderwortels & Gietijzer',
      epigraph:
        'Langzaam uitgesmolten eendenvet, wilde cantharellen schoongeborsteld en diepe koperen pannen achter op het fornuis.',
    },
    {
      id: 'coastal-market',
      romanIndex: 'II',
      title: 'Kust & Markt',
      seasonNote: 'Vroege Winter · Getij, Venkel & Saffraan',
      epigraph:
        'Met de lijn gevangen zeebaars krokant op de huid gebakken en saffraanbouillon getrokken met venkelgroen en geroosterd brood.',
    },
    {
      id: 'orchard-patisserie',
      romanIndex: 'III',
      title: 'Boomgaard & Patisserie',
      seasonNote: 'Fruitkelder · Warm Gebak & Gebrande Honing',
      epigraph:
        'Bosc-peren gepocheerd in gekruide ciderreductie en knapperig bladerdeeg tussen lagen vanille-diplomatenroom.',
    },
  ],
  fr: [
    {
      id: 'hearth-harvest',
      romanIndex: 'I',
      title: 'Âtre & Récolte',
      seasonNote: 'Fin d’Automne · Racines de Cave & Fonte',
      epigraph:
        'Graisse de canard fondue lentement, girolles sauvages brossées des aiguilles de pin et marmites en cuivre au fond du piano.',
    },
    {
      id: 'coastal-market',
      romanIndex: 'II',
      title: 'Rivage & Marché',
      seasonNote: 'Début d’Hiver · Marée, Fenouil & Safran',
      epigraph:
        'Bar de ligne saisi sur peau croustillante et bouillon safrané infusé avec pluches de fenouil et pain grillé.',
    },
    {
      id: 'orchard-patisserie',
      romanIndex: 'III',
      title: 'Verger & Pâtisserie',
      seasonNote: 'Cellier · Pâte Dorée & Miel Brûlé',
      epigraph:
        'Poires Bosc pochées au sirop d’épices et feuilletage caramélisé garni d’une crème diplomate à la vanille.',
    },
  ],
  es: [
    {
      id: 'hearth-harvest',
      romanIndex: 'I',
      title: 'Hogar y Cosecha',
      seasonNote: 'Otoño Tardío · Raíces y Hierro Fundido',
      epigraph:
        'Grasa de pato fundida a fuego lento, rebozuelos silvestres limpios y cazuelas hondas de cobre al fondo del fogón.',
    },
    {
      id: 'coastal-market',
      romanIndex: 'II',
      title: 'Costa y Mercado',
      seasonNote: 'Invierno Temprano · Marea, Hinojo y Azafrán',
      epigraph:
        'Lubina de anzuelo dorada por la piel y caldo de azafrán infusionado despacio con hinojo y pan tostado.',
    },
    {
      id: 'orchard-patisserie',
      romanIndex: 'III',
      title: 'Huerto y Pastelería',
      seasonNote: 'Bodega · Hojaldre Tibio y Miel Tostada',
      epigraph:
        'Peras Bosc escalfadas en almíbar especiado y hojaldre caramelizado con crema diplomática de vainilla.',
    },
  ],
  de: [
    {
      id: 'hearth-harvest',
      romanIndex: 'I',
      title: 'Herd & Ernte',
      seasonNote: 'Spätherbst · Wurzelgemüse & Gusseisen',
      epigraph:
        'Langsam ausgelassenes Entenfett, sauber gebürstete Pfifferlinge und tiefe Kupfertöpfe im hinteren Teil des Herdes.',
    },
    {
      id: 'coastal-market',
      romanIndex: 'II',
      title: 'Küste & Markt',
      seasonNote: 'Frühwinter · Gezeiten, Fenchel & Safran',
      epigraph:
        'Angelfrischer Wolfsbarsch kross auf der Haut gebraten und Safransud, langsam gezogen mit Fenchelgrün und Röstbrot.',
    },
    {
      id: 'orchard-patisserie',
      romanIndex: 'III',
      title: 'Obstgarten & Patisserie',
      seasonNote: 'Obstkeller · Warmes Gebäck & Gebrannter Honig',
      epigraph:
        'Bosc-Birnen pochiert in Gewürzsud und karamellisierter Blätterteig zwischen Löffeln voller Vanille-Diplomatencreme.',
    },
  ],
  it: [
    {
      id: 'hearth-harvest',
      romanIndex: 'I',
      title: 'Focolare & Raccolto',
      seasonNote: 'Tardo Autunno · Radici di Cantina & Ghisa',
      epigraph:
        'Grasso d’anatra fuso lentamente, finferli selvatici spazzolati dagli aghi di pino e pentole di rame sul retro dei fornelli.',
    },
    {
      id: 'coastal-market',
      romanIndex: 'II',
      title: 'Costa & Mercato',
      seasonNote: 'Inizio Inverno · Marea, Finocchietto & Zafferano',
      epigraph:
        'Branzino all’amo croccante dalla parte della pelle e brodo allo zafferano in infusione lenta con finocchio e pane tostato.',
    },
    {
      id: 'orchard-patisserie',
      romanIndex: 'III',
      title: 'Frutteto & Pasticceria',
      seasonNote: 'Cantina · Sfoglia Calda & Miele Bruciato',
      epigraph:
        'Pere Bosc sciroppate alle spezie e sfoglia caramellata fra cucchiaiate di crema diplomatica alla vaniglia.',
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
