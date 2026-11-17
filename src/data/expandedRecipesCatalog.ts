import { DishBlueprint, buildExpandedRecipes } from './recipeCatalogBuilder';
import { CATALOG_PART_1 } from './catalogPart1';
import { CATALOG_PART_2A } from './catalogPart2A';
import { CATALOG_PART_2B } from './catalogPart2B';
import { CATALOG_PART_2C } from './catalogPart2C';
import { CATALOG_PART_3A } from './catalogPart3A';
import { CATALOG_PART_3B } from './catalogPart3B';
import { Recipe } from '../types/cookbook';

export const ALL_BLUEPRINTS: DishBlueprint[] = [
  ...CATALOG_PART_1,
  ...CATALOG_PART_2A,
  ...CATALOG_PART_2B,
  ...CATALOG_PART_2C,
  ...CATALOG_PART_3A,
  ...CATALOG_PART_3B,
];

export const BLUEPRINT_MAP: Map<string, DishBlueprint> = new Map(
  ALL_BLUEPRINTS.map((bp) => [bp[0], bp])
);

// Flagship curated plates take indices 0..5 (Plates I..VI). Expanded begin at 6 (Plate VII..Plate 700).
export const EXPANDED_RECIPES: Recipe[] = buildExpandedRecipes(ALL_BLUEPRINTS, 6);
