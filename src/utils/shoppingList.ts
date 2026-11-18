import {
  LanguageCode,
  MealCalendarEntry,
  Recipe,
  ShoppingCategory,
  ShoppingDateWindow,
  ShoppingItemSource,
  ShoppingListItem,
  UnitSystem,
} from '../types/cookbook';
import { addDaysLocal, formatLocalDateKey } from './calendar';
import { formatCulinaryQuantity } from './formatters';
import { getLocalizedUnitLabel } from './units';

export const SHOPPING_CATEGORY_ORDER: ShoppingCategory[] = [
  'produce',
  'meat-fish',
  'dairy',
  'bakery',
  'pantry',
  'other',
];

const CATEGORY_KEYWORDS: Record<ShoppingCategory, string[]> = {
  produce: [
    'onion', 'shallot', 'garlic', 'leek', 'carrot', 'celery', 'potato', 'tomato',
    'mushroom', 'chanterelle', 'spinach', 'kale', 'lettuce', 'arugula', 'fennel',
    'lemon', 'lime', 'orange', 'pear', 'apple', 'fig', 'berry', 'herbs', 'parsley',
    'thyme', 'rosemary', 'sage', 'basil', 'cilantro', 'coriander', 'chive', 'tarragon',
    'dill', 'mint', 'ginger', 'chili', 'pepper', 'courgette', 'zucchini', 'eggplant',
    'aubergine', 'avocado', 'cucumber', 'radish', 'cabbage', 'broccoli', 'cauliflower',
    'asparagus', 'pea', 'bean sprout', 'scallion', 'spring onion', 'endive', 'chicory',
    // NL / FR / DE / ES / IT
    'ui', 'sjalot', 'knoflook', 'prei', 'wortel', 'bleekselderij', 'aardappel', 'tomaat',
    'champignon', 'paddenstoel', 'spinazie', 'venkel', 'citroen', 'limoen', 'sinaasappel',
    'peer', 'appel', 'vijg', 'peterselie', 'tijm', 'rozemarijn', 'salie', 'basilicum',
    'gember', 'komkommer', 'oignon', 'échalote', 'ail', 'poireau', 'carotte', 'tomate',
    'citron', 'poire', 'persil', 'thym', 'romarin', 'zwiebel', 'knoblauch', 'karotte',
    'kartoffel', 'zitrone', 'cebolla', 'ajo', 'tomate', 'limón', 'cipolla', 'aglio',
  ],
  'meat-fish': [
    'duck', 'chicken', 'beef', 'pork', 'lamb', 'veal', 'bacon', 'pancetta', 'lardon',
    'sausage', 'chorizo', 'ham', 'prosciutto', 'turkey', 'salmon', 'cod', 'sea bass',
    'bass', 'trout', 'tuna', 'prawn', 'shrimp', 'mussel', 'clam', 'scallop', 'squid',
    'anchovy', 'fish', 'seafood', 'steak', 'confit', 'tofu', 'tempeh',
    // NL / FR / DE / ES / IT
    'eend', 'kip', 'rund', 'varken', 'lam', 'spek', 'worst', 'zalm', 'kabeljauw',
    'zeebaars', 'garnaal', 'garnalen', 'mossel', 'vis', 'canard', 'poulet', 'boeuf',
    'porc', 'agneau', 'saumon', 'bar', 'crevette', 'ente', 'hähnchen', 'rind', 'lachs',
    'pato', 'pollo', 'ternera', 'salmón', 'anatra', 'manzo', 'salmone',
  ],
  dairy: [
    'butter', 'unsalted butter', 'salted butter', 'cream', 'heavy cream', 'double cream',
    'crème fraîche', 'milk', 'buttermilk', 'yogurt', 'cheese', 'parmesan', 'parmigiano',
    'gruyère', 'comté', 'cheddar', 'mozzarella', 'ricotta', 'goat cheese', 'chèvre',
    'feta', 'brie', 'mascarpone', 'egg', 'eggs', 'egg yolk', 'egg white',
    // NL / FR / DE / ES / IT
    'boter', 'roomboter', 'room', 'slagroom', 'melk', 'karnemelk', 'yoghurt', 'kaas',
    'ei', 'eieren', 'eidooier', 'beurre', 'crème', 'lait', 'fromage', 'oeuf', 'œuf',
    'butter', 'sahne', 'milch', 'käse', 'mantequilla', 'nata', 'leche', 'queso',
    'huevo', 'burro', 'panna', 'latte', 'formaggio', 'uova',
  ],
  bakery: [
    'flour', 'all-purpose flour', 'bread flour', 'buckwheat', 'bread', 'sourdough',
    'baguette', 'brioche', 'tart shell', 'pastry', 'puff pastry', 'dough', 'yeast',
    'breadcrumbs', 'panko', 'pasta', 'spaghetti', 'tagliatelle', 'risotto', 'arborio',
    'rice', 'noodles', 'ramen', 'udon', 'tortilla', 'couscous', 'quinoa', 'oats',
    // NL / FR / DE / ES / IT
    'bloem', 'meel', 'brood', 'zuurdesem', 'bladerdeeg', 'deeg', 'gist', 'paneermeel',
    'rijst', 'noedels', 'farine', 'pain', 'pâte', 'levure', 'riz', 'mehl', 'brot',
    'teig', 'hefe', 'reis', 'harina', 'pan', 'masa', 'arroz', 'farina', 'pane', 'riso',
  ],
  pantry: [
    'olive oil', 'oil', 'vegetable oil', 'sesame oil', 'vinegar', 'balsamic', 'wine',
    'white wine', 'red wine', 'stock', 'broth', 'bouillon', 'soy sauce', 'tamari',
    'miso', 'mirin', 'mustard', 'dijon', 'honey', 'sugar', 'brown sugar', 'maple',
    'salt', 'sea salt', 'fleur de sel', 'black pepper', 'peppercorn', 'spice',
    'paprika', 'cumin', 'coriander seed', 'saffron', 'cinnamon', 'nutmeg', 'clove',
    'bay leaf', 'bay leaves', 'vanilla', 'almond', 'walnut', 'hazelnut', 'pine nut',
    'pistachio', 'sesame', 'bean', 'beans', 'lentil', 'chickpea', 'tomato paste',
    'capers', 'olive', 'chocolate', 'cocoa', 'coffee', 'espresso', 'tea',
    // NL / FR / DE / ES / IT
    'olijfolie', 'olie', 'azijn', 'wijn', 'bouillon', 'sojasaus', 'mosterd', 'honing',
    'suiker', 'zout', 'peper', 'kaneel', 'nootmuskaat', 'laurier', 'vanille', 'amandel',
    'bonen', 'linzen', 'huile', 'vinaigre', 'vin', 'moutarde', 'miel', 'sucre', 'sel',
    'poivre', 'öl', 'essig', 'wein', 'senf', 'honig', 'zucker', 'salz', 'pfeffer',
    'aceite', 'vinagre', 'vino', 'miel', 'azúcar', 'sal', 'pimienta', 'olio', 'aceto',
    'miele', 'zucchero', 'sale', 'pepe',
  ],
  other: [],
};

export function inferShoppingCategory(ingredientName: string): ShoppingCategory {
  const lower = ingredientName.toLowerCase();
  for (const cat of SHOPPING_CATEGORY_ORDER) {
    if (cat === 'other') continue;
    const keywords = CATEGORY_KEYWORDS[cat];
    if (keywords.some((kw) => lower.includes(kw))) {
      return cat;
    }
  }
  return 'other';
}

export function getWindowDateRange(
  windowType: ShoppingDateWindow,
  baseDate: Date = new Date()
): { startKey: string; endKey: string } {
  const startKey = formatLocalDateKey(baseDate);
  if (windowType === '7d') {
    return {
      startKey,
      endKey: formatLocalDateKey(addDaysLocal(baseDate, 6)),
    };
  }
  if (windowType === '14d') {
    return {
      startKey,
      endKey: formatLocalDateKey(addDaysLocal(baseDate, 13)),
    };
  }
  // 'month': from today through the end of the current month (or at least 30 days ahead if near month end)
  const endOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
  const thirtyDaysOut = addDaysLocal(baseDate, 29);
  const effectiveEnd = endOfMonth > thirtyDaysOut ? endOfMonth : thirtyDaysOut;
  return {
    startKey,
    endKey: formatLocalDateKey(effectiveEnd),
  };
}

interface NormalizedUnitAmount {
  groupKey: string;
  amount: number;
  baseUnit: string;
}

function normalizeUnitAndAmount(
  amount: number,
  rawUnit: string,
  unitSystem: UnitSystem
): NormalizedUnitAmount {
  const unit = rawUnit.trim().toLowerCase();
  const safeAmt = Number.isFinite(amount) && amount > 0 ? amount : 0;

  if (unitSystem === 'metric') {
    if (unit === 'kg') {
      return { groupKey: 'weight_metric', amount: safeAmt * 1000, baseUnit: 'g' };
    }
    if (unit === 'g') {
      return { groupKey: 'weight_metric', amount: safeAmt, baseUnit: 'g' };
    }
    if (unit === 'l') {
      return { groupKey: 'volume_metric', amount: safeAmt * 1000, baseUnit: 'ml' };
    }
    if (unit === 'ml') {
      return { groupKey: 'volume_metric', amount: safeAmt, baseUnit: 'ml' };
    }
  } else {
    if (unit === 'lb') {
      return { groupKey: 'weight_us', amount: safeAmt * 16, baseUnit: 'oz' };
    }
    if (unit === 'oz') {
      return { groupKey: 'weight_us', amount: safeAmt, baseUnit: 'oz' };
    }
    if (unit === 'cup' || unit === 'cups') {
      return { groupKey: 'volume_cups', amount: safeAmt, baseUnit: 'cups' };
    }
  }

  return {
    groupKey: `unit_${unit || 'piece'}`,
    amount: safeAmt,
    baseUnit: unit || 'piece',
  };
}

function formatNormalizedTotal(
  totalAmount: number,
  baseUnit: string,
  unitSystem: UnitSystem,
  lang: LanguageCode
): { amount: number; unit: string; formattedAmount: string } {
  let displayAmt = totalAmount;
  let displayUnit = baseUnit;

  if (unitSystem === 'metric') {
    if (baseUnit === 'g' && totalAmount >= 1000) {
      displayAmt = Math.round((totalAmount / 1000) * 100) / 100;
      displayUnit = 'kg';
    } else if (baseUnit === 'ml' && totalAmount >= 1000) {
      displayAmt = Math.round((totalAmount / 1000) * 100) / 100;
      displayUnit = 'l';
    }
  } else {
    if (baseUnit === 'oz' && totalAmount >= 16) {
      displayAmt = Math.round((totalAmount / 16) * 4) / 4;
      displayUnit = 'lb';
    } else if (baseUnit === 'cups' && totalAmount <= 1) {
      displayUnit = 'cup';
    }
  }

  const qtyText =
    displayAmt > 0 ? formatCulinaryQuantity(displayAmt, displayUnit) : '';
  const localizedUnit = getLocalizedUnitLabel(displayUnit, lang);
  // Keep compact unit tokens crisp (use short forms for standard weights/volumes)
  const shortUnits = new Set(['g', 'kg', 'ml', 'l', 'oz', 'lb', 'fl oz']);
  const unitLabel = shortUnits.has(displayUnit) ? displayUnit : localizedUnit;
  return {
    amount: displayAmt,
    unit: displayUnit,
    formattedAmount: qtyText ? `${qtyText} ${unitLabel}`.trim() : unitLabel,
  };
}

export interface AggregatedShoppingResult {
  items: ShoppingListItem[];
  plannedEntries: MealCalendarEntry[];
  startKey: string;
  endKey: string;
}

export function aggregateShoppingList(params: {
  entries: MealCalendarEntry[];
  recipes: Recipe[];
  servingsMap: Record<string, number>;
  unitSystem: UnitSystem;
  windowType: ShoppingDateWindow;
  lang: LanguageCode;
  baseDate?: Date;
}): AggregatedShoppingResult {
  const {
    entries,
    recipes,
    servingsMap,
    unitSystem,
    windowType,
    lang,
    baseDate = new Date(),
  } = params;

  const { startKey, endKey } = getWindowDateRange(windowType, baseDate);

  const recipeMap = new Map<string, Recipe>();
  for (const r of recipes) {
    recipeMap.set(r.id, r);
  }

  // Strictly aggregate ONLY from planned calendar days within the active date window
  const plannedEntries = entries.filter(
    (e) => e.date >= startKey && e.date <= endKey
  );

  interface Bucket {
    key: string;
    name: string;
    totalAmount: number;
    baseUnit: string;
    category: ShoppingCategory;
    sources: ShoppingItemSource[];
  }

  const buckets = new Map<string, Bucket>();

  for (const entry of plannedEntries) {
    const recipe = recipeMap.get(entry.recipeId);
    if (!recipe) continue;

    const targetServings =
      entry.servings ?? servingsMap[entry.recipeId] ?? recipe.baseServings;
    const scale = targetServings / Math.max(1, recipe.baseServings);

    for (const ing of recipe.ingredients) {
      const normalizedName = ing.name.trim().toLowerCase().replace(/\s+/g, ' ');
      if (!normalizedName) continue;

      const rawAmount =
        unitSystem === 'metric' ? ing.metricAmount : ing.imperialAmount;
      const rawUnit =
        unitSystem === 'metric' ? ing.metricUnit : ing.imperialUnit;

      const scaledAmount = rawAmount * scale;
      const normalized = normalizeUnitAndAmount(scaledAmount, rawUnit, unitSystem);
      const bucketKey = `${normalizedName}::${normalized.groupKey}`;

      const existing = buckets.get(bucketKey);
      const source: ShoppingItemSource = {
        entryId: entry.id,
        date: entry.date,
        mealSlot: entry.mealSlot,
        recipeId: entry.recipeId,
        recipeTitle: recipe.title,
      };

      if (existing) {
        existing.totalAmount += normalized.amount;
        if (!existing.sources.some((s) => s.entryId === entry.id)) {
          existing.sources.push(source);
        }
      } else {
        buckets.set(bucketKey, {
          key: bucketKey,
          name: ing.name.trim(),
          totalAmount: normalized.amount,
          baseUnit: normalized.baseUnit,
          category: inferShoppingCategory(ing.name),
          sources: [source],
        });
      }
    }
  }

  const items: ShoppingListItem[] = Array.from(buckets.values()).map((b) => {
    const formatted = formatNormalizedTotal(b.totalAmount, b.baseUnit, unitSystem, lang);
    return {
      key: b.key,
      name: b.name,
      totalAmount: formatted.amount,
      unit: formatted.unit,
      formattedAmount: formatted.formattedAmount,
      category: b.category,
      sources: b.sources,
    };
  });

  items.sort((a, b) => {
    const catDiff =
      SHOPPING_CATEGORY_ORDER.indexOf(a.category) -
      SHOPPING_CATEGORY_ORDER.indexOf(b.category);
    if (catDiff !== 0) return catDiff;
    return a.name.localeCompare(b.name);
  });

  return {
    items,
    plannedEntries,
    startKey,
    endKey,
  };
}

export function formatShoppingListAsText(
  items: ShoppingListItem[],
  categoryLabels: Record<ShoppingCategory, string>,
  checkedSet: Set<string>
): string {
  const lines: string[] = [];
  for (const cat of SHOPPING_CATEGORY_ORDER) {
    const catItems = items.filter((i) => i.category === cat && !checkedSet.has(i.key));
    if (catItems.length === 0) continue;
    lines.push(`${categoryLabels[cat].toUpperCase()}`);
    for (const item of catItems) {
      lines.push(`- ${item.formattedAmount} ${item.name}`);
    }
    lines.push('');
  }
  return lines.join('\n').trim();
}
