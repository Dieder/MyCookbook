export type BookView = 'cover' | 'chapters' | 'cards' | 'saved' | 'spread';

export type UnitSystem = 'metric' | 'imperial';

export type LanguageCode = 'en' | 'nl' | 'fr' | 'es' | 'de' | 'it';

export type ThemeId = 'whitepaper' | 'modern' | 'colorful';

export type TechniquePreset =
  | 'butter-basting'
  | 'knife-julienne'
  | 'emulsion-whisk'
  | 'caramel-swirl'
  | 'dough-fold'
  | 'herb-searing';

export interface Chapter {
  id: string;
  romanIndex: string;
  title: string;
  seasonNote: string;
  epigraph: string;
}

export interface Ingredient {
  id: string;
  name: string;
  prepNote?: string;
  metricAmount: number;
  metricUnit: string;
  imperialAmount: number;
  imperialUnit: string;
  section?: string;
}

export interface TechniqueStage {
  timeSeconds: number;
  title: string;
  cue: string;
  heatSetting: string;
}

export interface TechniqueClip {
  id: string;
  title: string;
  subtitle: string;
  durationSeconds: number;
  preset: TechniquePreset;
  keyframeImage: string;
  stages: TechniqueStage[];
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  durationSeconds?: number;
  timerLabel?: string;
  tip?: string;
  techniqueClipId?: string;
}

export interface Recipe {
  id: string;
  chapterId: string;
  plateNumber: string;
  title: string;
  subtitle: string;
  region: string;
  season: string;
  prepMinutes: number;
  cookMinutes: number;
  baseServings: number;
  heroImage: string;
  figureCaption: string;
  storyExcerpt: string;
  storyParagraphs: string[];
  pullQuote: string;
  pairingNote: string;
  chefAuthor: string;
  ingredients: Ingredient[];
  techniques: TechniqueClip[];
  steps: RecipeStep[];
  ownerId?: string;
  sourceType?: 'curated' | 'ai-generated' | 'ai-customized';
  parentRecipeId?: string;
  customizationNote?: string;
}

export interface ActiveTimer {
  id: string;
  recipeId: string;
  recipeTitle: string;
  stepNumber: number;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  endTimestamp: number | null;
  status: 'running' | 'paused' | 'completed';
}
