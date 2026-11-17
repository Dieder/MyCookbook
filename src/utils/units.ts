import { RECIPES as CURATED_RECIPES } from '../data/cookbookData';
import { LanguageCode } from '../types/cookbook';

const BASE_METRIC_UNITS = ['g', 'kg', 'ml', 'l', 'tbsp', 'tsp'];
const BASE_IMPERIAL_UNITS = ['oz', 'lb', 'cup', 'cups', 'tbsp', 'tsp', 'fl oz'];

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
    tbsp: 'tbsp',
    tsp: 'tsp',
    'fl oz': 'fl oz',
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
    tbsp: 'el (eetlepel)',
    tsp: 'tl (theelepel)',
    'fl oz': 'fl oz',
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
    tbsp: 'c. à s.',
    tsp: 'c. à c.',
    'fl oz': 'fl oz',
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
    tbsp: 'cda',
    tsp: 'cdta',
    'fl oz': 'fl oz',
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
    tbsp: 'EL',
    tsp: 'TL',
    'fl oz': 'fl oz',
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
    g: 'g (grammi)',
    kg: 'kg (chilogrammi)',
    ml: 'ml (millilitri)',
    l: 'l (litri)',
    oz: 'oz',
    lb: 'lb',
    cup: 'tazza',
    cups: 'tazze',
    tbsp: 'cucch.',
    tsp: 'cucch.ino',
    'fl oz': 'fl oz',
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
  return UNIT_LABELS[lang]?.[unit] ?? UNIT_LABELS.en[unit] ?? unit;
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
