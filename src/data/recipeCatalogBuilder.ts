import {
  Ingredient,
  Recipe,
  RecipeStep,
  TechniqueClip,
  TechniquePreset,
} from '../types/cookbook';

export type MethodStyle =
  | 'seared'
  | 'braised'
  | 'baked'
  | 'simmered'
  | 'griddled'
  | 'chilled'
  | 'stirfried'
  | 'steamed'
  | 'emulsified'
  | 'infused';

export type DishMetricUnit =
  | 'g'
  | 'ml'
  | 'whole'
  | 'fillets'
  | 'eggs'
  | 'slices';

export type DishBlueprint = [
  slug: string,
  chapterId: string,
  title: string,
  subtitle: string,
  mainIngredient: string,
  mainMetricQty: number,
  mainMetricUnit: DishMetricUnit,
  secondaryIngredient: string,
  aromaticOrSpice: string,
  finishingElement: string,
  region: string,
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter',
  prepMinutes: number,
  cookMinutes: number,
  baseServings: number,
  methodStyle: MethodStyle,
];

const CHAPTER_HERO_POOL: Record<string, string[]> = {
  breakfast: [
    '/src/assets/images/plate_breakfast_brioche_1794902209046.jpg',
    '/src/assets/images/plate_artisan_sourdough_1794902210602.jpg',
    '/src/assets/images/recipe_poached_pear_tart_1794869456644.jpg',
  ],
  lunch: [
    '/src/assets/images/recipe_mushroom_galette_1794869454174.jpg',
    '/src/assets/images/plate_breakfast_brioche_1794902209046.jpg',
    '/src/assets/images/recipe_sea_bass_fennel_1794869454991.jpg',
  ],
  dinner: [
    '/src/assets/images/recipe_sea_bass_fennel_1794869454991.jpg',
    '/src/assets/images/recipe_duck_confit_cassoulet_1794869454292.jpg',
    '/src/assets/images/recipe_heirloom_bouillabaisse_1794869455337.jpg',
  ],
  'comfort-food': [
    '/src/assets/images/recipe_duck_confit_cassoulet_1794869454292.jpg',
    '/src/assets/images/recipe_heirloom_bouillabaisse_1794869455337.jpg',
    '/src/assets/images/plate_artisan_sourdough_1794902210602.jpg',
  ],
  'quick-easy-meals': [
    '/src/assets/images/recipe_sea_bass_fennel_1794869454991.jpg',
    '/src/assets/images/recipe_mushroom_galette_1794869454174.jpg',
    '/src/assets/images/plate_asian_ramen_1794902208492.jpg',
  ],
  vegetarian: [
    '/src/assets/images/recipe_mushroom_galette_1794869454174.jpg',
    '/src/assets/images/plate_artisan_sourdough_1794902210602.jpg',
    '/src/assets/images/recipe_heirloom_bouillabaisse_1794869455337.jpg',
  ],
  'international-favorites': [
    '/src/assets/images/recipe_heirloom_bouillabaisse_1794869455337.jpg',
    '/src/assets/images/plate_asian_ramen_1794902208492.jpg',
    '/src/assets/images/plate_mexican_tacos_1794902208640.jpg',
  ],
  'international-italian': [
    '/src/assets/images/recipe_heirloom_bouillabaisse_1794869455337.jpg',
    '/src/assets/images/recipe_mushroom_galette_1794869454174.jpg',
    '/src/assets/images/plate_artisan_sourdough_1794902210602.jpg',
  ],
  'international-asian': [
    '/src/assets/images/plate_asian_ramen_1794902208492.jpg',
    '/src/assets/images/recipe_sea_bass_fennel_1794869454991.jpg',
  ],
  'international-mediterranean': [
    '/src/assets/images/recipe_heirloom_bouillabaisse_1794869455337.jpg',
    '/src/assets/images/recipe_sea_bass_fennel_1794869454991.jpg',
    '/src/assets/images/recipe_mushroom_galette_1794869454174.jpg',
  ],
  'international-mexican': [
    '/src/assets/images/plate_mexican_tacos_1794902208640.jpg',
    '/src/assets/images/recipe_duck_confit_cassoulet_1794869454292.jpg',
  ],
  'baking-bread': [
    '/src/assets/images/plate_artisan_sourdough_1794902210602.jpg',
    '/src/assets/images/recipe_poached_pear_tart_1794869456644.jpg',
    '/src/assets/images/recipe_burnt_honey_millefeuille_1794869456539.jpg',
  ],
  desserts: [
    '/src/assets/images/recipe_burnt_honey_millefeuille_1794869456539.jpg',
    '/src/assets/images/recipe_poached_pear_tart_1794869456644.jpg',
  ],
  drinks: [
    '/src/assets/images/plate_bistro_drinks_1794902211731.jpg',
    '/src/assets/images/bistro_cover_still_life_1794869453098.jpg',
  ],
};

const CHEF_AUTHORS = [
  'Henriette Delacroix',
  'Marcello Renaud',
  'Claire Vasseur',
  'Amélie Laurent',
  'Sébastien Moreau',
  'Elena Conti',
  'Kenji Takahashi',
  'Mateo Alvarado',
];

const ROMAN_EARLY = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
  'XIV',
  'XV',
];

export function formatPlateLabel(plateIndexZeroBased: number): string {
  if (plateIndexZeroBased < ROMAN_EARLY.length) {
    return `Plate ${ROMAN_EARLY[plateIndexZeroBased]}`;
  }
  return `Plate ${plateIndexZeroBased + 1}`;
}

function toImperialQty(qty: number, unit: DishMetricUnit): { amount: number; unit: string } {
  switch (unit) {
    case 'g': {
      const oz = Math.max(0.5, Math.round((qty / 28.35) * 4) / 4);
      return { amount: oz, unit: 'oz' };
    }
    case 'ml': {
      const cups = Math.max(0.25, Math.round((qty / 240) * 4) / 4);
      return { amount: cups, unit: cups === 1 ? 'cup' : 'cups' };
    }
    case 'whole':
    case 'fillets':
    case 'eggs':
    case 'slices':
    default:
      return { amount: qty, unit };
  }
}

function getPresetForMethod(style: MethodStyle, chapterId: string): TechniquePreset {
  if (chapterId === 'baking-bread' || style === 'baked') return 'dough-fold';
  if (chapterId === 'desserts' || chapterId === 'drinks' || style === 'infused') {
    return 'caramel-swirl';
  }
  switch (style) {
    case 'seared':
    case 'griddled':
    case 'stirfried':
      return 'herb-searing';
    case 'braised':
    case 'simmered':
      return 'butter-basting';
    case 'emulsified':
      return 'emulsion-whisk';
    case 'chilled':
    case 'steamed':
    default:
      return 'knife-julienne';
  }
}

function getPairingForChapter(chapterId: string, title: string): string {
  switch (chapterId) {
    case 'breakfast':
      return `Pair ${title} with single-origin café au lait, Earl Grey tea, or freshly pressed orchard apple juice.`;
    case 'lunch':
      return `Serve alongside a crisp Loire Sauvignon Blanc or lightly sparkling mineral water with lemon.`;
    case 'dinner':
      return `Pair with a cellar Burgundy Pinot Noir or mineral-driven Chablis depending on the sauce.`;
    case 'comfort-food':
      return `Pour a supple Côtes du Rhône or rustic Malbec to balance the slow-cooked warmth.`;
    case 'quick-easy-meals':
      return `Serve immediately with crusty country bread and a chilled glass of Pinot Grigio or Vermentino.`;
    case 'vegetarian':
      return `Pair with a dry Jura Chardonnay or crisp dry Normandy orchard cider.`;
    case 'international-italian':
      return `Accompany with Chianti Classico, Nebbiolo, or a bright chilled Pinot Bianco.`;
    case 'international-asian':
      return `Serve with toasted jasmine oolong tea, crisp dry Riesling, or an unfiltered rice lager.`;
    case 'international-mediterranean':
      return `Pour a chilled Bandol Rosé or crisp Assyrtiko beside warm grilled flatbread.`;
    case 'international-mexican':
      return `Serve with crisp Mexican pilsner, chilled hibiscus agua fresca, or blanco tequila with lime.`;
    case 'baking-bread':
      return `Enjoy warm from the oven with cultured salted butter, espresso, or late-harvest Chenin Blanc.`;
    case 'desserts':
      return `Pair with a double espresso, Sauternes, or lightly sweetened chamomile infusion.`;
    case 'drinks':
      return `Serve over hand-carved ice alongside toasted Marcona almonds or crisp herb sablés.`;
    case 'international-favorites':
    default:
      return `Serve family-style at the center of the table with a crisp dry sparkling wine or herbal tea.`;
  }
}

function buildStepsAndTechnique(
  bp: DishBlueprint,
  heroImage: string
): { techniques: TechniqueClip[]; steps: RecipeStep[] } {
  const [
    slug,
    chapterId,
    title,
    ,
    mainIng,
    ,
    ,
    secondaryIng,
    aromatic,
    finishing,
    ,
    ,
    prepMinutes,
    cookMinutes,
    ,
    methodStyle,
  ] = bp;

  const preset = getPresetForMethod(methodStyle, chapterId);
  const clipId = `${slug}-tech`;

  const step1Sec = Math.max(120, Math.min(900, Math.round(prepMinutes * 30)));
  const totalCookSec = Math.max(180, cookMinutes * 60);
  const step2Sec = Math.max(90, Math.round(totalCookSec * 0.35));
  const step3Sec = Math.max(120, Math.round(totalCookSec * 0.45));
  const step4Sec = Math.max(60, Math.round(totalCookSec * 0.2));

  const methodActionMap: Record<
    MethodStyle,
    {
      techTitle: string;
      techSub: string;
      stage1: [string, string, string];
      stage2: [string, string, string];
      stage3: [string, string, string];
      step2Title: string;
      step2Text: string;
      step2Timer: string;
      step3Title: string;
      step3Text: string;
      step3Timer: string;
      step4Title: string;
      step4Text: string;
      step4Timer: string;
      tip: string;
    }
  > = {
    seared: {
      techTitle: 'Dry-Surface Sear & Aromatic Baste',
      techSub: `Building a golden Maillard crust on ${mainIng} without overcooking`,
      stage1: ['Dry Surface Prep', `Pat ${mainIng} dry and season evenly just before hitting hot fat.`, 'Medium-High · 195°C'],
      stage2: ['Undisturbed Sear', 'Hold flat in shimmering fat until edges bronze cleanly.', 'Medium-High · 190°C'],
      stage3: ['Aromatic Butter Baste', `Add ${aromatic} and tilt pan to spoon foaming glaze over the surface.`, 'Medium · 160°C'],
      step2Title: `Sear ${mainIng} Golden`,
      step2Text: `Heat heavy cast iron until shimmering, lay in ${mainIng}, and sear undisturbed until deeply browned and crisp at the edges.`,
      step2Timer: 'Sear primary cut',
      step3Title: `Bloom ${aromatic} & Fold ${secondaryIng}`,
      step3Text: `Lower heat slightly, add ${secondaryIng} and ${aromatic}, and toss or baste continuously until tender, glossy, and deeply fragrant.`,
      step3Timer: 'Aromatic baste',
      step4Title: `Finish with ${finishing}`,
      step4Text: `Remove from heat, rest briefly so juices settle, and plate topped generously with ${finishing}.`,
      step4Timer: 'Rest & plate',
      tip: 'Never crowd the pan—give every piece space so moisture evaporates rather than steaming.',
    },
    braised: {
      techTitle: 'Slow Lid-On Braise & Glossy Reduction',
      techSub: `Gentle oven or stovetop simmering so ${mainIng} turns fork-tender`,
      stage1: ['Deep Fond Sear', `Brown ${mainIng} patiently to coat the pot base with caramelized flavor.`, 'Medium-High · 185°C'],
      stage2: ['Aromatic Deglaze', `Sweat ${aromatic} and scrape every browned bit free with simmering stock.`, 'Medium · 145°C'],
      stage3: ['Bare Shimmer Braise', `Cover snugly and hold just below a boil so ${secondaryIng} stays velvety.`, 'Low Simmer · 94°C'],
      step2Title: `Brown Base & Sweat ${aromatic}`,
      step2Text: `Sear ${mainIng} in a heavy Dutch oven until browned, then soften ${aromatic} and ${secondaryIng} in the rendered pan drippings.`,
      step2Timer: 'Brown & sweat base',
      step3Title: 'Gentle Braise Until Tender',
      step3Text: `Pour in simmering stock, cover with parchment and lid, and braise gently until ${mainIng} yields effortlessly and broth turns rich.`,
      step3Timer: 'Slow braise',
      step4Title: `Reduce Glaze & Fold ${finishing}`,
      step4Text: `Uncover for final minutes to thicken the sauce to a satin sheen, adjust seasoning, and finish with ${finishing}.`,
      step4Timer: 'Glaze & rest',
      tip: 'Keep the braising liquid at a lazy bubble; a rolling boil tightens proteins.',
    },
    baked: {
      techTitle: 'Even Convection Bake & Crust Set',
      techSub: `Balancing bottom heat and golden top color for ${title}`,
      stage1: ['Preheated Tray Transfer', 'Bake directly on a hot steel or stone tray for crisp base texture.', 'Oven · 200°C'],
      stage2: ['Mid-Bake Rotation', 'Rotate pan 180° halfway through for uniform golden caramelization.', 'Oven · 195°C'],
      stage3: ['Rack Set & Carryover', 'Cool briefly on a wire rack so structure sets cleanly before slicing.', 'Room Temp'],
      step2Title: `Layer ${mainIng} & ${secondaryIng}`,
      step2Text: `Prepare baking vessel, combine ${mainIng} with ${secondaryIng} and ${aromatic} evenly so heat penetrates uniformly.`,
      step2Timer: 'Prep bake pan',
      step3Title: 'Bake Until Deeply Golden',
      step3Text: `Transfer to preheated oven and bake until puffed, bubbling, and rich amber-gold along the crust and edges.`,
      step3Timer: 'Bake in oven',
      step4Title: `Rest & Finish with ${finishing}`,
      step4Text: `Cool briefly on a rack to let crumb or custard set cleanly, then dress with ${finishing} before serving.`,
      step4Timer: 'Carryover set',
      tip: 'Allow at least five minutes of resting time out of the oven so internal moisture redistributes.',
    },
    simmered: {
      techTitle: 'Controlled Broth Simmer & Seasoning',
      techSub: 'Extracting clear aroma without clouding or boiling over',
      stage1: ['Gentle Sweat', `Soften ${aromatic} slowly in olive oil or butter without scorching.`, 'Low-Medium · 130°C'],
      stage2: ['Measured Simmer', `Hold liquid at delicate surface ripples while ${mainIng} and ${secondaryIng} infuse.`, 'Simmer · 93°C'],
      stage3: ['Final Brightness', `Stir in ${finishing} off the flame to lift acidity and aroma.`, 'Off Heat'],
      step2Title: `Sweat ${aromatic} & Build Broth`,
      step2Text: `Warm fat gently and sweat ${aromatic} until translucent and fragrant, then stir in ${secondaryIng} and liquid base.`,
      step2Timer: 'Build broth base',
      step3Title: `Simmer ${mainIng} Gently`,
      step3Text: `Lower heat to a quiet simmer and cook ${mainIng} until tender and the broth coats a spoon with deep flavor.`,
      step3Timer: 'Simmer steadily',
      step4Title: `Balance & Top with ${finishing}`,
      step4Text: `Taste carefully for salt and acidity, ladle into warm bowls, and crown with ${finishing}.`,
      step4Timer: 'Finish & ladle',
      tip: 'Always taste the broth right before serving after any final reduction.',
    },
    griddled: {
      techTitle: 'Controlled Griddle & Skillet Crisp',
      techSub: 'Holding medium heat for blistered golden surfaces and tender centers',
      stage1: ['Evenly Seasoned Griddle', 'Warm heavy griddle slowly until a drop of water dances lightly.', 'Medium · 175°C'],
      stage2: ['Steady Flip Timing', 'Wait for tiny bubbles or golden rim before turning cleanly once.', 'Medium · 175°C'],
      stage3: ['Warm Butter Brush', `Finish directly off the griddle with ${finishing}.`, 'Warm Hold'],
      step2Title: `Season & Warm Griddle Surface`,
      step2Text: `Bring skillet or griddle to steady medium heat and brush lightly with butter or oil while combining ${mainIng} and ${aromatic}.`,
      step2Timer: 'Preheat griddle',
      step3Title: `Griddle ${mainIng} & ${secondaryIng}`,
      step3Text: `Cook in steady contact until deeply golden and crisp on both sides while keeping the center tender.`,
      step3Timer: 'Griddle both sides',
      step4Title: `Plate Warm with ${finishing}`,
      step4Text: `Transfer straight to warmed plates and top immediately with ${finishing}.`,
      step4Timer: 'Plate warm',
      tip: 'Pat the first batch warm on a low rack while finishing remaining pieces.',
    },
    chilled: {
      techTitle: 'Clean Prep, Blanch & Chill Set',
      techSub: 'Locking bright color, crisp snap, and delicate texture cleanly',
      stage1: ['Precision Prep', `Cut ${mainIng} and ${secondaryIng} uniformly for balanced bite and chill.`, 'Cold Prep · 12°C'],
      stage2: ['Aromatic Steep', `Fold ${aromatic} cleanly so flavors infuse evenly as it chills.`, 'Chilled · 4°C'],
      stage3: ['Crisp Garnish Finish', `Add ${finishing} right at service to preserve crunch.`, 'Service'],
      step2Title: `Prepare ${mainIng} & ${secondaryIng}`,
      step2Text: `Trim, blanch or toss ${mainIng} with ${secondaryIng} and ${aromatic} for even flavor distribution.`,
      step2Timer: 'Prep & combine',
      step3Title: 'Chill & Marry Flavors',
      step3Text: `Cover and chill thoroughly until crisp, well-set, and refreshingly cold throughout.`,
      step3Timer: 'Chill & infuse',
      step4Title: `Dress & Garnish with ${finishing}`,
      step4Text: `Arrange on chilled plates or bowls and finish immediately before serving with ${finishing}.`,
      step4Timer: 'Final garnish',
      tip: 'Chill serving bowls briefly in the fridge for crisp, vibrant presentation.',
    },
    stirfried: {
      techTitle: 'High-Heat Wok Sear & Aromatics',
      techSub: 'Rapid tossing over fierce heat to lock juiciness and smoky char',
      stage1: ['Mise en Place Lineup', `Have ${mainIng}, ${secondaryIng}, and sauce within arm’s reach before lighting burner.`, 'Prep Station'],
      stage2: ['Smoking Wok Flash', 'Sear main ingredients first in thin smoking oil before adding aromatics.', 'High · 225°C'],
      stage3: ['Glossy Sauce Toss', `Splash sauce down the wok rim and toss quickly with ${finishing}.`, 'High · 210°C'],
      step2Title: `Flash-Sear ${mainIng}`,
      step2Text: `Heat wok or wide skillet until wisps of smoke appear, swirl oil, and sear ${mainIng} rapidly in a single layer.`,
      step2Timer: 'High-heat wok sear',
      step3Title: `Toss ${secondaryIng} & ${aromatic}`,
      step3Text: `Add ${secondaryIng} and ${aromatic}, keeping ingredients moving briskly with sauce until glazed and crisp-tender.`,
      step3Timer: 'Toss & glaze',
      step4Title: `Serve Piping Hot with ${finishing}`,
      step4Text: `Cut heat immediately, fold through ${finishing}, and transfer to warm bowls at once.`,
      step4Timer: 'Final toss',
      tip: 'Everything cooks in minutes—slice all ingredients evenly before heating the pan.',
    },
    steamed: {
      techTitle: 'Gentle Aromatic Steam & Glaze',
      techSub: 'Cooking delicately in vapor so texture remains juicy and bright',
      stage1: ['Boiling Steam Base', `Bring steaming pot to a steady simmer infused with ${aromatic}.`, 'Steam · 100°C'],
      stage2: ['Covered Vapor Cook', `Space ${mainIng} cleanly on parchment or rack so steam circulates freely.`, 'Covered · 100°C'],
      stage3: ['Immediate Uncover', `Lift lid away from face and spoon over ${finishing} immediately.`, 'Service'],
      step2Title: `Prepare Steam Basket & ${aromatic}`,
      step2Text: `Bring water or broth to a gentle simmer below the steamer basket and arrange ${mainIng} alongside ${secondaryIng} and ${aromatic}.`,
      step2Timer: 'Bring to steam',
      step3Title: `Steam ${mainIng} Covered`,
      step3Text: `Cover tightly and steam undisturbed until tender, juicy, and cooked evenly through.`,
      step3Timer: 'Steam covered',
      step4Title: `Dress Warm with ${finishing}`,
      step4Text: `Transfer straight to warm plates and drizzle or scatter ${finishing} before serving.`,
      step4Timer: 'Glaze & serve',
      tip: 'Line steamer racks with perforated parchment or cabbage leaves to prevent sticking.',
    },
    emulsified: {
      techTitle: 'Silky Emulsion & Heat Control',
      techSub: 'Binding rich liquids and fats into a glossy, unbroken coat',
      stage1: ['Warm Base Whisk', `Combine base liquids and ${aromatic} steadily without scorching.`, 'Low · 65°C'],
      stage2: ['Gradual Enrichment', `Stream fat or cheese slowly into ${mainIng} while whisking constantly.`, 'Low · 62°C'],
      stage3: ['Nappe Gloss Check', 'Coat the back of a spoon cleanly before tossing with remaining ingredients.', 'Off Heat'],
      step2Title: `Cook ${mainIng} Base`,
      step2Text: `Prepare ${mainIng} cleanly while warming ${aromatic} and ${secondaryIng} gently in a separate pan.`,
      step2Timer: 'Cook primary base',
      step3Title: 'Emulsify Glossy Sauce',
      step3Text: `Over very low or residual heat, whisk together starchy liquid, fat, or yolks until creamy, glossy, and cohesive.`,
      step3Timer: 'Build emulsion',
      step4Title: `Toss & Finish with ${finishing}`,
      step4Text: `Fold through immediately with ${finishing} and serve on pre-warmed plates.`,
      step4Timer: 'Final toss',
      tip: 'Never let an egg or butter emulsion boil; use residual pan warmth for silky cling.',
    },
    infused: {
      techTitle: 'Aromatic Steep, Balance & Pour',
      techSub: 'Extracting clean botanicals without harsh bitterness',
      stage1: ['Gentle Steep or Muddle', `Coax volatile oils from ${aromatic} cleanly without bruising bitter pith.`, 'Steep · 75°C'],
      stage2: ['Syrup & Acid Balance', `Harmonize ${mainIng} and ${secondaryIng} for crisp sweetness and lift.`, 'Bar Prep'],
      stage3: ['Chill & Aromatic Garnish', `Strain fine and express oils of ${finishing} over the glass.`, 'Service'],
      step2Title: `Infuse ${aromatic} & Base`,
      step2Text: `Combine ${mainIng} with ${aromatic} and allow flavors to steep gently or muddle cleanly to extract bright oils.`,
      step2Timer: 'Steep aromatics',
      step3Title: `Blend ${secondaryIng} & Strain`,
      step3Text: `Stir or shake thoroughly with ${secondaryIng} until well chilled or dissolved, then strain finely.`,
      step3Timer: 'Shake & strain',
      step4Title: `Pour & Garnish with ${finishing}`,
      step4Text: `Serve over clear ice or in warmed glassware finished with ${finishing}.`,
      step4Timer: 'Garnish & pour',
      tip: 'Fine-strain infusions through a mesh sieve so the finished pour stays crystal clear.',
    },
  };

  const m = methodActionMap[methodStyle];
  const technique: TechniqueClip = {
    id: clipId,
    title: m.techTitle,
    subtitle: m.techSub,
    durationSeconds: 15,
    preset,
    keyframeImage: heroImage,
    stages: [
      { timeSeconds: 0, title: m.stage1[0], cue: m.stage1[1], heatSetting: m.stage1[2] },
      { timeSeconds: 5, title: m.stage2[0], cue: m.stage2[1], heatSetting: m.stage2[2] },
      { timeSeconds: 10, title: m.stage3[0], cue: m.stage3[1], heatSetting: m.stage3[2] },
    ],
  };

  const steps: RecipeStep[] = [
    {
      stepNumber: 1,
      title: `Prepare Mise en Place for ${title}`,
      instruction: `Measure ${mainIng}, prep ${secondaryIng}, and finely prepare ${aromatic} so every element moves smoothly to the stove or counter.`,
      durationSeconds: step1Sec,
      timerLabel: 'Mise en place',
      tip: m.tip,
    },
    {
      stepNumber: 2,
      title: m.step2Title,
      instruction: m.step2Text,
      durationSeconds: step2Sec,
      timerLabel: m.step2Timer,
      techniqueClipId: clipId,
    },
    {
      stepNumber: 3,
      title: m.step3Title,
      instruction: m.step3Text,
      durationSeconds: step3Sec,
      timerLabel: m.step3Timer,
      techniqueClipId: clipId,
    },
    {
      stepNumber: 4,
      title: m.step4Title,
      instruction: m.step4Text,
      durationSeconds: step4Sec,
      timerLabel: m.step4Timer,
    },
  ];

  return { techniques: [technique], steps };
}

function buildIngredients(bp: DishBlueprint): Ingredient[] {
  const [
    slug,
    chapterId,
    ,
    ,
    mainIng,
    mainMetricQty,
    mainMetricUnit,
    secondaryIng,
    aromatic,
    finishing,
    ,
    ,
    ,
    ,
    baseServings,
    methodStyle,
  ] = bp;

  const impMain = toImperialQty(mainMetricQty, mainMetricUnit);
  const scaleFactor = Math.max(1, Math.round(baseServings / 2));

  const isDrinkOrDessert =
    chapterId === 'drinks' || chapterId === 'desserts' || methodStyle === 'infused';

  const fatOrBase: Ingredient =
    chapterId === 'drinks'
      ? {
          id: `${slug}-ing-base`,
          name: 'Filtered sparkling or chilled spring water',
          metricAmount: 180 * scaleFactor,
          metricUnit: 'ml',
          imperialAmount: Math.round(0.75 * scaleFactor * 100) / 100,
          imperialUnit: 'cups',
        }
      : chapterId === 'desserts' || chapterId === 'baking-bread'
      ? {
          id: `${slug}-ing-base`,
          name: 'Unsalted cultured butter, cool or melted as needed',
          metricAmount: 45 * scaleFactor,
          metricUnit: 'g',
          imperialAmount: 3 * scaleFactor,
          imperialUnit: 'tbsp',
        }
      : {
          id: `${slug}-ing-base`,
          name: 'Extra-virgin olive oil or unsalted butter',
          metricAmount: 20 * scaleFactor,
          metricUnit: 'ml',
          imperialAmount: 1.5 * scaleFactor,
          imperialUnit: 'tbsp',
        };

  const seasoning: Ingredient = isDrinkOrDessert
    ? {
        id: `${slug}-ing-season`,
        name: 'Fine sea salt pinch & fresh citrus zest',
        metricAmount: 1,
        metricUnit: 'tsp',
        imperialAmount: 1,
        imperialUnit: 'tsp',
      }
    : {
        id: `${slug}-ing-season`,
        name: 'Flaky sea salt & freshly cracked black pepper',
        metricAmount: 1,
        metricUnit: 'tsp',
        imperialAmount: 1,
        imperialUnit: 'tsp',
      };

  return [
    {
      id: `${slug}-ing-1`,
      name: mainIng,
      metricAmount: mainMetricQty,
      metricUnit: mainMetricUnit,
      imperialAmount: impMain.amount,
      imperialUnit: impMain.unit,
    },
    {
      id: `${slug}-ing-2`,
      name: secondaryIng,
      metricAmount: 120 * scaleFactor,
      metricUnit: 'g',
      imperialAmount: 4 * scaleFactor,
      imperialUnit: 'oz',
    },
    {
      id: `${slug}-ing-3`,
      name: aromatic,
      metricAmount: 25 * scaleFactor,
      metricUnit: 'g',
      imperialAmount: 2 * scaleFactor,
      imperialUnit: 'tbsp',
    },
    {
      id: `${slug}-ing-4`,
      name: finishing,
      metricAmount: 30 * scaleFactor,
      metricUnit: 'g',
      imperialAmount: 2 * scaleFactor,
      imperialUnit: 'tbsp',
    },
    fatOrBase,
    seasoning,
  ];
}

export function buildExpandedRecipes(
  blueprints: DishBlueprint[],
  startingPlateIndex: number
): Recipe[] {
  return blueprints.map((bp, idx) => {
    const [
      slug,
      chapterId,
      title,
      subtitle,
      mainIng,
      ,
      ,
      secondaryIng,
      aromatic,
      finishing,
      region,
      season,
      prepMinutes,
      cookMinutes,
      baseServings,
      methodStyle,
    ] = bp;

    const plateIdx = startingPlateIndex + idx;
    const plateNumber = formatPlateLabel(plateIdx);
    const heroPool =
      CHAPTER_HERO_POOL[chapterId] ?? CHAPTER_HERO_POOL.dinner;
    const heroImage = heroPool[idx % heroPool.length];
    const chefAuthor = CHEF_AUTHORS[(plateIdx + chapterId.length) % CHEF_AUTHORS.length];
    const { techniques, steps } = buildStepsAndTechnique(bp, heroImage);

    return {
      id: slug,
      chapterId,
      plateNumber,
      title,
      subtitle,
      region,
      season,
      prepMinutes,
      cookMinutes,
      baseServings,
      heroImage,
      figureCaption: `Fig. ${plateIdx + 1} — ${title}, finished with ${finishing.toLowerCase()}.`,
      storyExcerpt: `Rooted in ${region}, ${title} pairs ${mainIng.toLowerCase()} with ${secondaryIng.toLowerCase()}, ${aromatic.toLowerCase()}, and ${finishing.toLowerCase()}.`,
      storyParagraphs: [
        `Across ${region}, ${title} belongs to the rhythm of ${season.toLowerCase()} cooking—built from ${mainIng.toLowerCase()} balanced cleanly against ${secondaryIng.toLowerCase()} and scented with ${aromatic.toLowerCase()}.`,
        `In the My Cookbook test kitchen, each timer marks the moment aroma and texture align: prepare your mise en place deliberately, guide the heat by sight and sound, and crown the plate with ${finishing.toLowerCase()} just before service.`,
      ],
      pullQuote: `“Let ${aromatic.toLowerCase()} bloom gently first; great ${methodStyle} cooking rewards calm timing and a crisp finish of ${finishing.toLowerCase()}.”`,
      pairingNote: getPairingForChapter(chapterId, title),
      chefAuthor,
      ingredients: buildIngredients(bp),
      techniques,
      steps,
    };
  });
}
