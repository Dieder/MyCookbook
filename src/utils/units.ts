import { RECIPES as CURATED_RECIPES } from '../data/cookbookData';
import { LanguageCode } from '../types/cookbook';

const BASE_METRIC_UNITS = ['g', 'kg', 'ml', 'l', 'tbsp', 'tsp', 'piece'];
const BASE_IMPERIAL_UNITS = ['oz', 'lb', 'cup', 'cups', 'tbsp', 'tsp', 'fl oz', 'piece'];

function buildUnitLists(): { metricUnits: string[]; imperialUnits: string[] } {
  const metricSet = new Set<string>(BASE_METRIC_UNITS);
  const imperialSet = new Set<string>(BASE_IMPERIAL_UNITS);

  for (const recipe of CURATED_RECIPES) {
    for (const ing of recipe.ingredients) {
      if (ing.metricUnit?.trim()) {
        metricSet.add(ing.metricUnit.trim());
      }
      if (ing.imperialUnit?.trim()) {
        imperialSet.add(ing.imperialUnit.trim());
      }
    }
  }

  metricSet.add('pinch');
  imperialSet.add('pinch');

  return {
    metricUnits: Array.from(metricSet),
    imperialUnits: Array.from(imperialSet),
  };
}

const { metricUnits, imperialUnits } = buildUnitLists();

export const METRIC_UNIT_OPTIONS: string[] = metricUnits;
export const IMPERIAL_UNIT_OPTIONS: string[] = imperialUnits;

const UNIT_LABELS: Record<LanguageCode, Record<string, string>> = {
  en: {
    g: 'g (grams)',
    kg: 'kg (kilograms)',
    ml: 'ml (milliliters)',
    l: 'l (liters)',
    oz: 'oz (ounces)',
    lb: 'lb (pounds)',
    cup: 'cup',
    cups: 'cups',
    tbsp: 'tablespoon',
    tsp: 'teaspoon',
    'fl oz': 'fl oz',
    piece: 'piece',
    whole: 'whole',
    cloves: 'cloves',
    leaves: 'leaves',
    sprigs: 'sprigs',
    bulbs: 'bulbs',
    fillets: 'fillets',
    eggs: 'eggs',
    slices: 'slices',
    legs: 'legs',
    prawns: 'prawns',
    pears: 'pears',
    figs: 'figs',
    yolk: 'yolk',
    shell: 'shell',
    pinch: 'pinch',
  },
  nl: {
    g: 'g (gram)',
    kg: 'kg (kilogram)',
    ml: 'ml (milliliter)',
    l: 'l (liter)',
    oz: 'oz',
    lb: 'lb',
    cup: 'kop',
    cups: 'koppen',
    tbsp: 'eetlepel',
    tsp: 'theelepel',
    'fl oz': 'fl oz',
    piece: 'stuk',
    whole: 'stuks',
    cloves: 'tenen',
    leaves: 'blaadjes',
    sprigs: 'takjes',
    bulbs: 'knollen',
    fillets: 'filets',
    eggs: 'eieren',
    slices: 'plakken',
    legs: 'bouten',
    prawns: 'garnalen',
    pears: 'peren',
    figs: 'vijgen',
    yolk: 'dooier',
    shell: 'bodem',
    pinch: 'snufje',
  },
  fr: {
    g: 'g (grammes)',
    kg: 'kg (kilogrammes)',
    ml: 'ml (millilitres)',
    l: 'l (litres)',
    oz: 'oz',
    lb: 'lb',
    cup: 'tasse',
    cups: 'tasses',
    tbsp: 'cuillère à soupe',
    tsp: 'cuillère à café',
    'fl oz': 'fl oz',
    piece: 'pièce',
    whole: 'pièces',
    cloves: 'gousses',
    leaves: 'feuilles',
    sprigs: 'brins',
    bulbs: 'bulbes',
    fillets: 'filets',
    eggs: 'œufs',
    slices: 'tranches',
    legs: 'cuisses',
    prawns: 'crevettes',
    pears: 'poires',
    figs: 'figues',
    yolk: 'jaune',
    shell: 'fond',
    pinch: 'pincée',
  },
  es: {
    g: 'g (gramos)',
    kg: 'kg (kilogramos)',
    ml: 'ml (mililitros)',
    l: 'l (litros)',
    oz: 'oz',
    lb: 'lb',
    cup: 'taza',
    cups: 'tazas',
    tbsp: 'cucharada',
    tsp: 'cucharadita',
    'fl oz': 'fl oz',
    piece: 'pieza',
    whole: 'piezas',
    cloves: 'dientes',
    leaves: 'hojas',
    sprigs: 'ramitas',
    bulbs: 'bulbos',
    fillets: 'filetes',
    eggs: 'huevos',
    slices: 'rebanadas',
    legs: 'muslos',
    prawns: 'langostinos',
    pears: 'peras',
    figs: 'higos',
    yolk: 'yema',
    shell: 'base',
    pinch: 'pizca',
  },
  de: {
    g: 'g (Gramm)',
    kg: 'kg (Kilogramm)',
    ml: 'ml (Milliliter)',
    l: 'l (Liter)',
    oz: 'oz',
    lb: 'lb',
    cup: 'Tasse',
    cups: 'Tassen',
    tbsp: 'Esslöffel',
    tsp: 'Teelöffel',
    'fl oz': 'fl oz',
    piece: 'Stück',
    whole: 'Stück (ganz)',
    cloves: 'Zehen',
    leaves: 'Blätter',
    sprigs: 'Zweige',
    bulbs: 'Knollen',
    fillets: 'Filets',
    eggs: 'Eier',
    slices: 'Scheiben',
    legs: 'Keulen',
    prawns: 'Garnelen',
    pears: 'Birnen',
    figs: 'Feigen',
    yolk: 'Eigelb',
    shell: 'Boden',
    pinch: 'Prise',
  },
  it: {
    g: 'g (grammi)',
    kg: 'kg (chilogrammi)',
    ml: 'ml (millilitri)',
    l: 'l (litri)',
    oz: 'oz',
    lb: 'lb',
    cup: 'tazza',
    cups: 'tazze',
    tbsp: 'cucchiaio',
    tsp: 'cucchiaino',
    'fl oz': 'fl oz',
    piece: 'pezzo',
    whole: 'pezzi',
    cloves: 'spicchi',
    leaves: 'foglie',
    sprigs: 'rametti',
    bulbs: 'bulbi',
    fillets: 'filetti',
    eggs: 'uova',
    slices: 'fette',
    legs: 'cosce',
    prawns: 'gamberi',
    pears: 'pere',
    figs: 'fichi',
    yolk: 'tuorlo',
    shell: 'guscio',
    pinch: 'pizzico',
  },
};

const UNIT_ALIASES: Record<string, string> = {
  // Metric & imperial weight/volume
  g: 'g',
  gr: 'g',
  gram: 'g',
  grams: 'g',
  gramm: 'g',
  grammes: 'g',
  gramos: 'g',
  grammi: 'g',
  kg: 'kg',
  kilo: 'kg',
  kilogram: 'kg',
  kilograms: 'kg',
  kilogramm: 'kg',
  kilogrammes: 'kg',
  kilogramos: 'kg',
  chilogrammi: 'kg',
  ml: 'ml',
  milliliter: 'ml',
  milliliters: 'ml',
  millilitre: 'ml',
  millilitres: 'ml',
  mililitros: 'ml',
  millilitri: 'ml',
  l: 'l',
  lt: 'l',
  liter: 'l',
  liters: 'l',
  litre: 'l',
  litres: 'l',
  litros: 'l',
  litri: 'l',
  oz: 'oz',
  ounce: 'oz',
  ounces: 'oz',
  lb: 'lb',
  lbs: 'lb',
  pound: 'lb',
  pounds: 'lb',
  'fl oz': 'fl oz',
  floz: 'fl oz',
  // Spoons & cups
  cup: 'cup',
  kop: 'cup',
  kopje: 'cup',
  tasse: 'cup',
  taza: 'cup',
  tazza: 'cup',
  cups: 'cups',
  koppen: 'cups',
  kopjes: 'cups',
  tasses: 'cups',
  tazas: 'cups',
  tassen: 'cups',
  tazze: 'cups',
  tbsp: 'tbsp',
  tbs: 'tbsp',
  el: 'tbsp',
  eetlepel: 'tbsp',
  eetlepels: 'tbsp',
  tablespoon: 'tbsp',
  tablespoons: 'tbsp',
  'c. à s.': 'tbsp',
  'c. à soupe': 'tbsp',
  'cuillère à soupe': 'tbsp',
  'cuillères à soupe': 'tbsp',
  cda: 'tbsp',
  'cda.': 'tbsp',
  cucharada: 'tbsp',
  cucharadas: 'tbsp',
  esslöffel: 'tbsp',
  cucchiaio: 'tbsp',
  cucchiai: 'tbsp',
  tsp: 'tsp',
  tl: 'tsp',
  theelepel: 'tsp',
  theelepels: 'tsp',
  teaspoon: 'tsp',
  teaspoons: 'tsp',
  'c. à c.': 'tsp',
  'c. à café': 'tsp',
  'cuillère à café': 'tsp',
  'cuillères à café': 'tsp',
  cdta: 'tsp',
  'cdta.': 'tsp',
  cucharadita: 'tsp',
  cucharaditas: 'tsp',
  teelöffel: 'tsp',
  cucchiaino: 'tsp',
  cucchiaini: 'tsp',
  // Count & culinary pieces
  piece: 'piece',
  pieces: 'piece',
  pc: 'piece',
  pcs: 'piece',
  stuk: 'piece',
  pièce: 'piece',
  pieza: 'piece',
  stück: 'piece',
  pezzo: 'piece',
  whole: 'whole',
  stuks: 'whole',
  pièces: 'whole',
  piezas: 'whole',
  pezzi: 'whole',
  clove: 'cloves',
  cloves: 'cloves',
  teen: 'cloves',
  tenen: 'cloves',
  teentje: 'cloves',
  teentjes: 'cloves',
  gousse: 'cloves',
  gousses: 'cloves',
  diente: 'cloves',
  dientes: 'cloves',
  zehe: 'cloves',
  zehen: 'cloves',
  spicchio: 'cloves',
  spicchi: 'cloves',
  leaf: 'leaves',
  leaves: 'leaves',
  blaadje: 'leaves',
  blaadjes: 'leaves',
  blad: 'leaves',
  bladeren: 'leaves',
  feuille: 'leaves',
  feuilles: 'leaves',
  hoja: 'leaves',
  hojas: 'leaves',
  blatt: 'leaves',
  blätter: 'leaves',
  foglia: 'leaves',
  foglie: 'leaves',
  sprig: 'sprigs',
  sprigs: 'sprigs',
  takje: 'sprigs',
  takjes: 'sprigs',
  brin: 'sprigs',
  brins: 'sprigs',
  ramita: 'sprigs',
  ramitas: 'sprigs',
  zweig: 'sprigs',
  zweige: 'sprigs',
  rametto: 'sprigs',
  rametti: 'sprigs',
  bulb: 'bulbs',
  bulbs: 'bulbs',
  knol: 'bulbs',
  knollen: 'bulbs',
  bulbe: 'bulbs',
  bulbes: 'bulbs',
  bulbo: 'bulbs',
  bulbos: 'bulbs',
  bulbi: 'bulbs',
  knolle: 'bulbs',
  fillet: 'fillets',
  fillets: 'fillets',
  filet: 'fillets',
  filets: 'fillets',
  filete: 'fillets',
  filetes: 'fillets',
  filetti: 'fillets',
  egg: 'eggs',
  eggs: 'eggs',
  ei: 'eggs',
  eieren: 'eggs',
  oeuf: 'eggs',
  oeufs: 'eggs',
  œuf: 'eggs',
  œufs: 'eggs',
  huevo: 'eggs',
  huevos: 'eggs',
  eier: 'eggs',
  uovo: 'eggs',
  uova: 'eggs',
  slice: 'slices',
  slices: 'slices',
  plak: 'slices',
  plakken: 'slices',
  snee: 'slices',
  sneetjes: 'slices',
  tranche: 'slices',
  tranches: 'slices',
  rebanada: 'slices',
  rebanadas: 'slices',
  scheibe: 'slices',
  scheiben: 'slices',
  fetta: 'slices',
  fette: 'slices',
  leg: 'legs',
  legs: 'legs',
  bout: 'legs',
  bouten: 'legs',
  cuisse: 'legs',
  cuisses: 'legs',
  muslo: 'legs',
  muslos: 'legs',
  keule: 'legs',
  keulen: 'legs',
  coscia: 'legs',
  cosce: 'legs',
  prawn: 'prawns',
  prawns: 'prawns',
  garnaal: 'prawns',
  garnalen: 'prawns',
  crevette: 'prawns',
  crevettes: 'prawns',
  langostino: 'prawns',
  langostinos: 'prawns',
  garnele: 'prawns',
  garnelen: 'prawns',
  gambero: 'prawns',
  gamberi: 'prawns',
  pear: 'pears',
  pears: 'pears',
  peer: 'pears',
  peren: 'pears',
  poire: 'pears',
  poires: 'pears',
  pera: 'pears',
  peras: 'pears',
  birne: 'pears',
  birnen: 'pears',
  pere: 'pears',
  fig: 'figs',
  figs: 'figs',
  vijg: 'figs',
  vijgen: 'figs',
  figue: 'figs',
  figues: 'figs',
  higo: 'figs',
  higos: 'figs',
  feige: 'figs',
  feigen: 'figs',
  fico: 'figs',
  fichi: 'figs',
  yolk: 'yolk',
  dooier: 'yolk',
  jaune: 'yolk',
  yema: 'yolk',
  eigelb: 'yolk',
  tuorlo: 'yolk',
  shell: 'shell',
  bodem: 'shell',
  fond: 'shell',
  base: 'shell',
  boden: 'shell',
  guscio: 'shell',
  pinch: 'pinch',
  pinches: 'pinch',
  snuf: 'pinch',
  snufje: 'pinch',
  pincée: 'pinch',
  pizca: 'pinch',
  prise: 'pinch',
  pizzico: 'pinch',
};

export function canonicalizeUnitKey(unit: string): string {
  const trimmed = unit.trim();
  if (!trimmed) return '';
  const lower = trimmed.toLowerCase();
  return UNIT_ALIASES[lower] ?? trimmed;
}

const DISPLAY_UNIT_LABELS: Record<LanguageCode, Record<string, string>> = {
  en: {
    g: 'g',
    kg: 'kg',
    ml: 'ml',
    l: 'l',
    oz: 'oz',
    lb: 'lb',
    cup: 'cup',
    cups: 'cups',
    tbsp: 'tbsp',
    tsp: 'tsp',
    'fl oz': 'fl oz',
    piece: 'piece',
    whole: 'whole',
    cloves: 'cloves',
    leaves: 'leaves',
    sprigs: 'sprigs',
    bulbs: 'bulbs',
    fillets: 'fillets',
    eggs: 'eggs',
    slices: 'slices',
    legs: 'legs',
    prawns: 'prawns',
    pears: 'pears',
    figs: 'figs',
    yolk: 'yolk',
    shell: 'shell',
    pinch: 'pinch',
  },
  nl: {
    g: 'g',
    kg: 'kg',
    ml: 'ml',
    l: 'l',
    oz: 'oz',
    lb: 'lb',
    cup: 'kop',
    cups: 'koppen',
    tbsp: 'el',
    tsp: 'tl',
    'fl oz': 'fl oz',
    piece: 'stuk',
    whole: 'stuks',
    cloves: 'tenen',
    leaves: 'blaadjes',
    sprigs: 'takjes',
    bulbs: 'knollen',
    fillets: 'filets',
    eggs: 'eieren',
    slices: 'plakken',
    legs: 'bouten',
    prawns: 'garnalen',
    pears: 'peren',
    figs: 'vijgen',
    yolk: 'dooier',
    shell: 'bodem',
    pinch: 'snufje',
  },
  fr: {
    g: 'g',
    kg: 'kg',
    ml: 'ml',
    l: 'l',
    oz: 'oz',
    lb: 'lb',
    cup: 'tasse',
    cups: 'tasses',
    tbsp: 'c. à s.',
    tsp: 'c. à c.',
    'fl oz': 'fl oz',
    piece: 'pièce',
    whole: 'pièces',
    cloves: 'gousses',
    leaves: 'feuilles',
    sprigs: 'brins',
    bulbs: 'bulbes',
    fillets: 'filets',
    eggs: 'œufs',
    slices: 'tranches',
    legs: 'cuisses',
    prawns: 'crevettes',
    pears: 'poires',
    figs: 'figues',
    yolk: 'jaune',
    shell: 'fond',
    pinch: 'pincée',
  },
  es: {
    g: 'g',
    kg: 'kg',
    ml: 'ml',
    l: 'l',
    oz: 'oz',
    lb: 'lb',
    cup: 'taza',
    cups: 'tazas',
    tbsp: 'cda.',
    tsp: 'cdta.',
    'fl oz': 'fl oz',
    piece: 'pieza',
    whole: 'piezas',
    cloves: 'dientes',
    leaves: 'hojas',
    sprigs: 'ramitas',
    bulbs: 'bulbos',
    fillets: 'filetes',
    eggs: 'huevos',
    slices: 'rebanadas',
    legs: 'muslos',
    prawns: 'langostinos',
    pears: 'peras',
    figs: 'higos',
    yolk: 'yema',
    shell: 'base',
    pinch: 'pizca',
  },
  de: {
    g: 'g',
    kg: 'kg',
    ml: 'ml',
    l: 'l',
    oz: 'oz',
    lb: 'lb',
    cup: 'Tasse',
    cups: 'Tassen',
    tbsp: 'EL',
    tsp: 'TL',
    'fl oz': 'fl oz',
    piece: 'Stück',
    whole: 'Stück',
    cloves: 'Zehen',
    leaves: 'Blätter',
    sprigs: 'Zweige',
    bulbs: 'Knollen',
    fillets: 'Filets',
    eggs: 'Eier',
    slices: 'Scheiben',
    legs: 'Keulen',
    prawns: 'Garnelen',
    pears: 'Birnen',
    figs: 'Feigen',
    yolk: 'Eigelb',
    shell: 'Boden',
    pinch: 'Prise',
  },
  it: {
    g: 'g',
    kg: 'kg',
    ml: 'ml',
    l: 'l',
    oz: 'oz',
    lb: 'lb',
    cup: 'tazza',
    cups: 'tazze',
    tbsp: 'cucchiaio',
    tsp: 'cucchiaino',
    'fl oz': 'fl oz',
    piece: 'pezzo',
    whole: 'pezzi',
    cloves: 'spicchi',
    leaves: 'foglie',
    sprigs: 'rametti',
    bulbs: 'bulbi',
    fillets: 'filetti',
    eggs: 'uova',
    slices: 'fette',
    legs: 'cosce',
    prawns: 'gamberi',
    pears: 'pere',
    figs: 'fichi',
    yolk: 'tuorlo',
    shell: 'guscio',
    pinch: 'pizzico',
  },
};

export function getLocalizedUnitLabel(unit: string, lang: LanguageCode): string {
  const canonical = canonicalizeUnitKey(unit);
  return UNIT_LABELS[lang]?.[canonical] ?? UNIT_LABELS.en[canonical] ?? unit;
}

export function getDisplayUnitLabel(unit: string, lang: LanguageCode): string {
  const canonical = canonicalizeUnitKey(unit);
  return (
    DISPLAY_UNIT_LABELS[lang]?.[canonical] ??
    DISPLAY_UNIT_LABELS.en[canonical] ??
    unit
  );
}

function roundToQuarter(val: number, min = 0.25): number {
  return Math.max(min, Math.round(val * 4) / 4);
}

function roundToTenth(val: number, min = 0.1): number {
  return Math.max(min, Math.round(val * 10) / 10);
}

export function convertMetricToImperial(
  amount: number,
  metricUnit: string
): { amount: number; unit: string } {
  const safeQty = Math.max(0.1, Number(amount) || 0.1);
  const unit = metricUnit.trim().toLowerCase();

  switch (unit) {
    case 'g': {
      if (safeQty >= 454) {
        return { amount: roundToQuarter(safeQty / 453.592), unit: 'lb' };
      }
      return { amount: roundToTenth(safeQty / 28.3495), unit: 'oz' };
    }
    case 'kg': {
      return { amount: roundToQuarter(safeQty * 2.20462), unit: 'lb' };
    }
    case 'ml': {
      if (safeQty < 15) {
        return { amount: roundToQuarter(safeQty / 4.92892), unit: 'tsp' };
      }
      if (safeQty < 60) {
        return {
          amount: Math.max(0.5, Math.round((safeQty / 14.7868) * 2) / 2),
          unit: 'tbsp',
        };
      }
      const cups = roundToQuarter(safeQty / 240);
      return { amount: cups, unit: cups <= 1 ? 'cup' : 'cups' };
    }
    case 'l': {
      const cups = roundToQuarter((safeQty * 1000) / 240);
      return { amount: cups, unit: cups <= 1 ? 'cup' : 'cups' };
    }
    default:
      return { amount: safeQty, unit: metricUnit.trim() || 'whole' };
  }
}

export function convertImperialToMetric(
  amount: number,
  imperialUnit: string
): { amount: number; unit: string } {
  const safeQty = Math.max(0.1, Number(amount) || 0.1);
  const unit = imperialUnit.trim().toLowerCase();

  switch (unit) {
    case 'oz': {
      const grams = Math.max(1, Math.round(safeQty * 28.3495));
      return { amount: grams, unit: 'g' };
    }
    case 'lb': {
      const grams = Math.max(10, Math.round((safeQty * 453.592) / 5) * 5);
      if (grams >= 1000 && grams % 100 === 0) {
        return { amount: roundToTenth(grams / 1000), unit: 'kg' };
      }
      return { amount: grams, unit: 'g' };
    }
    case 'cup':
    case 'cups': {
      const ml = Math.max(5, Math.round((safeQty * 240) / 5) * 5);
      return { amount: ml, unit: 'ml' };
    }
    case 'fl oz': {
      const ml = Math.max(5, Math.round(safeQty * 29.5735));
      return { amount: ml, unit: 'ml' };
    }
    case 'tbsp': {
      const ml = Math.max(5, Math.round(safeQty * 15));
      return { amount: ml, unit: 'ml' };
    }
    case 'tsp': {
      const ml = Math.max(2, Math.round(safeQty * 5));
      return { amount: ml, unit: 'ml' };
    }
    default:
      return { amount: safeQty, unit: imperialUnit.trim() || 'whole' };
  }
}

export async function compressDishPhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file (JPG, PNG, or WebP).');
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Unable to read image file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to load selected photo.'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Selected file is not a valid image.'));
    image.src = dataUrl;
  });

  const maxWidth = 880;
  const maxHeight = 660;
  let targetW = img.naturalWidth || 800;
  let targetH = img.naturalHeight || 600;

  if (targetW > maxWidth || targetH > maxHeight) {
    const ratio = Math.min(maxWidth / targetW, maxHeight / targetH);
    targetW = Math.max(1, Math.round(targetW * ratio));
    targetH = Math.max(1, Math.round(targetH * ratio));
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Browser canvas unavailable for image resizing.');
  }
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const qualities = [0.8, 0.68, 0.55, 0.42];
  for (const q of qualities) {
    const encoded = canvas.toDataURL('image/jpeg', q);
    if (encoded.length <= 200000) {
      return encoded;
    }
  }

  // Final smaller resize if photo is extremely high-detail
  canvas.width = Math.max(1, Math.round(targetW * 0.7));
  canvas.height = Math.max(1, Math.round(targetH * 0.7));
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const compact = canvas.toDataURL('image/jpeg', 0.5);
  if (compact.length > 240000) {
    throw new Error('Photo is still too large after compression. Please pick a smaller photo.');
  }
  return compact;
}
