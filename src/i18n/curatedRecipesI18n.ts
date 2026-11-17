import { LanguageCode, Recipe } from '../types/cookbook';
import { localizeExpandedRecipe } from './expandedRecipesI18n';

interface RecipeTextPatch {
  title: string;
  subtitle: string;
  region: string;
  season: string;
  figureCaption: string;
  storyExcerpt: string;
  storyParagraphs: string[];
  pullQuote: string;
  pairingNote: string;
  ingredients: Record<string, { name: string; metricUnit?: string; imperialUnit?: string }>;
  techniques: Record<
    string,
    {
      title: string;
      subtitle: string;
      stages: Array<{ title: string; cue: string; heatSetting: string }>;
    }
  >;
  steps: Record<
    number,
    { title: string; instruction: string; timerLabel?: string; tip?: string }
  >;
}

const CURATED_PATCHES: Partial<Record<LanguageCode, Record<string, RecipeTextPatch>>> = {
  nl: {
    'duck-confit-cassoulet': {
      title: 'Krokante Eendenconfit op Tarbais-bonen',
      subtitle: 'Gekaramelliseerde sjalotten, gebakken salie en zacht getrokken knoflookbouillon',
      region: 'Gascogne & Parijs',
      season: 'Herfst',
      figureCaption: 'Afb. 1 — Krokant gebakken eendenbout op romige Tarbais-bonen met knapperige salie.',
      storyExcerpt:
        'In een klein hoekbistro aan het Canal Saint-Martin lag het geheim van doordeweekse cassoulet in het starten van gekonfijte eendenbouten in een koude gietijzeren pan.',
      storyParagraphs: [
        'Elke november, zodra de regen over de hoge ramen langs het Canal Saint-Martin striemt, haalt chef Henriette Delacroix brede aardewerken kommen van de plank. In plaats van drie dagen te wachten op een klassieke cassouletkorst, combineert ze zijdezachte Tarbais-bonen—zachtjes gesudderd met bouquet garni en gekneusde knoflook—met gekonfijte eendenbouten die flinterdun krokant worden gebakken.',
        'De echte techniek zit in het plaatsen van de eendenbouten op de huid in een volledig koude gietijzeren koekenpan. Terwijl het ijzer op middellaag vuur opwarmt, smelt het onderhuidse vet gelijkmatig tot vloeibaar goud zonder het vlees uit te drogen. Een laatste lepel schuimend eendenvet en vlokjes zeezout brengen de hele haard aan tafel.',
      ],
      pullQuote:
        '“Begin met een koude ijzeren pan; laat geduld het vel tot amberkleurig kant smelten terwijl de bonen de warmte van de bouillon vasthouden.”',
      pairingNote: 'Serveer met een kelderkoele Cahors Malbec of een frisse witlofsalade met walnootolie.',
      ingredients: {
        'duck-legs': { name: 'Gekonfijte eendenbouten, goed drooggedept', metricUnit: 'bouten', imperialUnit: 'bouten' },
        'tarbais-beans': { name: 'Gekookte Tarbais- of cannellinibonen, met kookvocht', metricUnit: 'g', imperialUnit: 'koppen' },
        shallots: { name: 'Banaansjalotten, in de lengte gehalveerd', metricUnit: 'stuks', imperialUnit: 'stuks' },
        garlic: { name: 'Knoflooktenen, licht gekneusd', metricUnit: 'tenen', imperialUnit: 'tenen' },
        'chicken-stock': { name: 'Krachtige geroosterde gevogeltebouillon', metricUnit: 'ml', imperialUnit: 'kop' },
        'sage-leaves': { name: 'Verse hele salieblaadjes', metricUnit: 'blaadjes', imperialUnit: 'blaadjes' },
        thyme: { name: 'Verse takjes tijm', metricUnit: 'takjes', imperialUnit: 'takjes' },
        butter: { name: 'Ongezouten roomboter, in koude blokjes', metricUnit: 'g', imperialUnit: 'el' },
      },
      techniques: {
        'confit-cold-render': {
          title: 'Huid Uitsmelten in Koude Pan & Salie',
          subtitle: 'Langzaam vet uitsmelten voor flinterdunne krokante huid',
          stages: [
            { title: 'Koude IJzerplaatsing', cue: 'Leg eendenbouten op de huid in een koude pan zodat het vet geleidelijk smelt.', heatSetting: 'Laag-Middel · 140°C' },
            { title: 'Gelijkmatig Goudbruin', cue: 'Luister naar een rustig sisgeluid; druk lichtjes aan met een spatel.', heatSetting: 'Middel · 165°C' },
            { title: 'Krokante Salie Finish', cue: 'Bak hele salieblaadjes 20 seconden mee in het hete eendenvet.', heatSetting: 'Middel · 175°C' },
          ],
        },
        'shallot-glaze-emulsion': {
          title: 'Bonenbouillon Reductie & Boterglazuur',
          subtitle: 'Kookvocht van bonen binden met koude boter tot een glanzende saus',
          stages: [
            { title: 'Sjalotten Karamelliseren', cue: 'Bak halve sjalotten op het snijvlak in 1 el eendenvet tot ze mahoniebruin zijn.', heatSetting: 'Middel · 170°C' },
            { title: 'Bouillon & Bonen Sudderen', cue: 'Voeg bouillon en bonen toe; laat zachtjes pruttelen zonder te roeren.', heatSetting: 'Zacht Sudderen · 95°C' },
            { title: 'Boter Van het Vuur Kloppen', cue: 'Zwenk koude boter van het vuur af door het zetmeelrijke vocht.', heatSetting: 'Van het Vuur' },
          ],
        },
      },
      steps: {
        1: { title: 'Eendenbouten Drogen & Tempereren', instruction: 'Veeg overtollig vet van de eendenbouten en dep de huid kurkdroog. Leg ze met de huid omlaag in een koude gietijzeren pan.', timerLabel: 'Drogen & rusten', tip: 'Vocht verhindert een krokant vel; laat de bouten 3 minuten drogen aan de lucht.' },
        2: { title: 'Langzaam Uitsmelten tot Krokant', instruction: 'Zet de pan op middellaag vuur en bak ongestoord tot het vel diep amberkleurig en knapperig is. Keer 2 minuten om te verwarmen.', timerLabel: 'Vel krokant bakken' },
        3: { title: 'Sjalotten Karamelliseren & Salie Bakken', instruction: 'Leg het eendenvlees op een warm bord. Bak de sjalotten, knoflook en tijm bruin in het vet en bak daarna de salie kort krokant.', timerLabel: 'Sjalotten karamelliseren' },
        4: { title: 'Tarbais-bonen Sudderen in Bouillon', instruction: 'Schenk de bouillon erbij, roer de aanbaksels los en voeg de bonen met vocht toe. Laat inkoken tot een fluweelzachte saus.', timerLabel: 'Bonen sudderen' },
        5: { title: 'Monteren met Boter & Serveren', instruction: 'Haal van het vuur, roer de koude boter erdoor, schep in warme kommen, leg een krokante eendenbout erbovenop en garneer met salie.', timerLabel: 'Rusten & opdienen' },
      },
    },
    'chanterelle-buckwheat-galette': {
      title: 'Boekweitgalette met Wilde Cantharellen & Comté',
      subtitle: 'Krokante steengemalen korst, tijmpaddenstoelen en gebruinde boter',
      region: 'Jura & Bretagne',
      season: 'Herfst',
      figureCaption: 'Afb. 2 — Geplooide boekweitgalette gevuld met geroosterde cantharellen en gerijpte Comté.',
      storyExcerpt: 'Boekweit geeft koudboterdeeg een geroosterde hazelnootwarmte die bospaddenstoelen en alpenkaas tot een bistromiddelpunt maakt.',
      storyParagraphs: [
        'Een open galette vergeeft de strengheid van gekartelde taartvormen. Met steengemalen boekweitmeel en patentbloem ontstaat een knapperige, nootachtige korst rondom gesmolten 18-maanden Comté en paddenstoelen met citroentijm.',
        'De echte discipline gebeurt in de koekenpan voordat het deeg de oven ingaat. Paddenstoelen moeten in een enkele laag in geklaarde boter worden geschroeid totdat al het vocht verdampt is.',
      ],
      pullQuote: '“Leg wilde paddenstoelen nooit op elkaar in de pan; geef elke cantharel ruimte om droog te bakken.”',
      pairingNote: 'Serveer met een droge Jura Savagnin of een frisse appelcider.',
      ingredients: {
        'pastry-flour': { name: 'Patentbloem voor taartdeeg', metricUnit: 'g', imperialUnit: 'koppen' },
        'buckwheat-flour': { name: 'Geroosterd boekweitmeel', metricUnit: 'g', imperialUnit: 'kop' },
        'cold-butter': { name: 'Koude gezouten boter, in blokjes', metricUnit: 'g', imperialUnit: 'el' },
        chanterelles: { name: 'Wilde cantharellen en kastanjechampignons', metricUnit: 'g', imperialUnit: 'lb' },
        'comte-cheese': { name: 'Gerijpte Comté kaas, grof geraspt', metricUnit: 'g', imperialUnit: 'koppen' },
        'creme-fraiche': { name: 'Dikke crème fraîche', metricUnit: 'g', imperialUnit: 'kop' },
        'egg-yolk': { name: 'Eidooier losgeklopt met 1 el room', metricUnit: 'dooier', imperialUnit: 'dooier' },
      },
      techniques: {
        'galette-dough-fold': {
          title: 'Fraisage & Rustieke Galette-plooi',
          subtitle: 'Koude boter platdrukken tot laagjes in boekweitdeeg',
          stages: [
            { title: 'Koude Botervlokken', cue: 'Druk koude boterblokjes plat tussen duim en vingers zonder ze te laten smelten.', heatSetting: 'Koel Marmer · 16°C' },
            { title: 'Fraisage met Handpalm', cue: 'Strijk het deeg eenmaal uit over bakpapier voor lange boterlinten.', heatSetting: 'Koel Werkblad' },
            { title: 'Overlappende Plooien', cue: 'Vouw de buitenrand van 4 cm telkens naar binnen zodat kaas binnenblijft.', heatSetting: 'Kamertemp.' },
          ],
        },
        'mushroom-dry-sear': {
          title: 'Cantharellen Heet Schroeiend Bakken',
          subtitle: 'Paddenstoelenvocht verdampen vóór het vullen',
          stages: [
            { title: 'Gelijkmatig Scheuren', cue: 'Scheur grote cantharellen in de lengte en snijd champignons op 5 mm.', heatSetting: 'Snijplank' },
            { title: 'Enkele Laag Bakken', cue: 'Laat 2 minuten liggen tot de randen kleuren vóór het omschudden.', heatSetting: 'Hoog · 205°C' },
          ],
        },
      },
      steps: {
        1: { title: 'Boekweitdeeg Mengen & Koelen', instruction: 'Wrijf koude boter door bloem, boekweit en zout. Voeg ijswater toe, vorm een schijf en koel stevig door.', timerLabel: 'Deeg koelen' },
        2: { title: 'Paddenstoelen Nootachtig Bakken', instruction: 'Verhit 2 el boter op hoog vuur en bak de paddenstoelen in een enkele laag droog en goudbruin met tijm en peper.', timerLabel: 'Cantharellen bakken' },
        3: { title: 'Uitrollen, Vullen & Plooien', instruction: 'Rol het deeg uit tot 34 cm, bestrijk het midden met crème fraîche, verdeel Comté en paddenstoelen en plooi de rand.', timerLabel: 'Korst laten opstijven' },
        4: { title: 'Goudbruin Afakken', instruction: 'Bestrijk de rand met eigeel en bak op 205°C tot de korst knapperig en de kaas bubbelend goudbruin is.', timerLabel: 'Galette bakken', tip: 'Laat 5 minuten rusten op een rooster zodat de Comté iets opstijft.' },
      },
    },
    'sea-bass-saffron-fennel': {
      title: 'Krokante Zeebaars met Venkel & Saffraan-Beurre Blanc',
      subtitle: 'Ingekerfde huid, geblakerde citroen en fluweelzachte wittewijnreductie',
      region: 'Côte d’Azur',
      season: 'Winter',
      figureCaption: 'Afb. 3 — Krokante zeebaars op gestoofde babyvenkel in gouden saffraansaus.',
      storyExcerpt: 'Een klassiek kustgerecht draait om twee temperaturen: knisperende vissenhuid rechtstreeks uit de pan op een warm bedje van saffraanboter.',
      storyParagraphs: [
        'Vis gaart in enkele minuten, dus alle voorbereiding telt. Babyvenkel wordt in kwarten gesneden met behoud van de kern, zacht gestoofd in droge vermout en warm gehouden.',
        'Bij een beurre blanc is temperatuurbeheersing alles: de gereduceerde wijn moet net lauwwarm zijn terwijl koude klontjes boter één voor één worden ingeklopt tot een satijnen glans.',
      ],
      pullQuote: '“Druk de vis twintig seconden zacht aan zodra hij de pan raakt—krokante huid ontstaat in stilte.”',
      pairingNote: 'Serveer met een minerale Chablis of frisse Vermentino.',
      ingredients: {
        'sea-bass': { name: 'Wilde zeebaarsfilets met huid', metricUnit: 'g', imperialUnit: 'oz' },
        'baby-fennel': { name: 'Babyvenkelknollen in kwarten, groen bewaard', metricUnit: 'knollen', imperialUnit: 'knollen' },
        saffron: { name: 'Saffraandraadjes geweekt in 1 el warme wijn', metricUnit: 'tl', imperialUnit: 'tl' },
        'dry-white-wine': { name: 'Droge witte wijn of vermout', metricUnit: 'ml', imperialUnit: 'kop' },
        'cold-butter-cubes': { name: 'Koude ongezouten boter, in blokjes', metricUnit: 'g', imperialUnit: 'el' },
        'meyer-lemon': { name: 'Citroen, gehalveerd om te blakeren', metricUnit: 'stuk', imperialUnit: 'stuk' },
      },
      techniques: {
        'saffron-beurre-blanc': {
          title: 'Saffraan Beurre Blanc Emulsie',
          subtitle: 'Koude boter binden in warme wijnreductie zonder schiften',
          stages: [
            { title: 'Aromatische Reductie', cue: 'Kook sjalot, wijn en saffraan in tot er 2 eetlepels overblijven.', heatSetting: 'Middel · 100°C' },
            { title: 'Koude Boter Inkloppen', cue: 'Zet het vuur laag en klop steeds 2 koude blokjes boter tot romig.', heatSetting: 'Laag · 62°C' },
            { title: 'Nappe-controle', cue: 'Trek een vinger over de bolle kant van een lepel—de lijn moet scherp blijven.', heatSetting: 'Warmhouden · 58°C' },
          ],
        },
        'fish-skin-sear': {
          title: 'Krokante Huid onder Lichte Druk',
          subtitle: 'Inkerven en aandrukken voor een egaal knapperige korst',
          stages: [
            { title: 'Ondiep Inkerven', cue: 'Kerf de huid 3 keer licht in zodat de filet vlak blijft liggen.', heatSetting: 'Snijplank' },
            { title: '20 Seconden Aandrukken', cue: 'Druk licht met een visspatel zodra de filet de hete olie raakt.', heatSetting: 'Middelhoog · 190°C' },
          ],
        },
      },
      steps: {
        1: { title: 'Venkelkwarten Stoven', instruction: 'Bak venkel goudbruin, blus af met de helft van de witte wijn en stoof afgedekt beetgaar.', timerLabel: 'Venkel stoven' },
        2: { title: 'Saffraan & Wijn Reduceren', instruction: 'Kook de resterende wijn met saffraan en sjalot in tot een stroperige basis.', timerLabel: 'Saffraan inkoken' },
        3: { title: 'Zeebaars op de Huid Bakken', instruction: 'Kerf de huid in, bestrooi met zout en bak 3–4 minuten op de huid tot 80% gaar; keer 45 seconden.', timerLabel: 'Vis krokant bakken' },
        4: { title: 'Citroen Blakeren & Beurre Blanc Kloppen', instruction: 'Schroei citroenhelften en klop op laagste stand de koude boter door de warme saffraanreductie.', timerLabel: 'Saus monteren' },
      },
    },
    'heirloom-copper-bouillabaisse': {
      title: 'Koperen-Pan Bouillabaisse & Saffraan-Rouille',
      subtitle: 'Wilde mosselen, gamba’s, saffraan-tomatenbouillon en knoflookcroutons',
      region: 'Marseille',
      season: 'Winter',
      figureCaption: 'Afb. 4 — Saffraanbouillabaisse in gehamerd koper naast knapperig brood met rouille.',
      storyExcerpt: 'Echte bouillabaisse draait om volgorde: stevige vis eerst, garnalen daarna en mosselen die in de laatste anderhalve minuut opengaan.',
      storyParagraphs: [
        'Langs de haven van Marseille kookten vissers boven drijfhout met de stevige rotsvis die overbleef. De ziel van het gerecht is de geurige basis van venkelzaad, sinaasappelschil, prei, tomaat en Spaanse saffraan.',
        'Om alle zeevruchten mals te houden werkt de pan als een precieze aftelling: eerst pocheert de stevige witvis, daarna garen de gamba’s roze en helemaal aan het eind stomen de mosselen open.',
      ],
      pullQuote: '“Laat een visstoof nooit hard koken; houd de saffraanbouillon op een stille rilling.”',
      pairingNote: 'Schenk een gekoelde Bandol Rosé bij de kruidige knoflookrouille.',
      ingredients: {
        'white-fish': { name: 'Stevige witvis (zeeduivel of kabeljauw), in stukken', metricUnit: 'g', imperialUnit: 'lb' },
        'black-mussels': { name: 'Verse zwarte mosselen, schoongemaakt', metricUnit: 'g', imperialUnit: 'lb' },
        'wild-prawns': { name: 'Wilde gamba’s met kop', metricUnit: 'stuks', imperialUnit: 'stuks' },
        'fish-stock': { name: 'Aromatische visfumet of schaaldierenbouillon', metricUnit: 'ml', imperialUnit: 'koppen' },
        'fennel-orange': { name: 'Gesneden prei, venkel & reep sinaasappelschil', metricUnit: 'g', imperialUnit: 'koppen' },
        'tomato-paste': { name: 'Tomatenpuree & gepelde pruimtomaten', metricUnit: 'g', imperialUnit: 'kop' },
        'rouille-base': { name: 'Saffraan-knoflookrouille & geroosterd stokbrood', metricUnit: 'g', imperialUnit: 'kop' },
      },
      techniques: {
        'bouillabaisse-emulsion': {
          title: 'Saffraan-Rouille in de Vijzel',
          subtitle: 'Dikke emulsie van knoflook, saffraan en olijfolie voor toast',
          stages: [
            { title: 'Knoflook & Saffraanpasta', cue: 'Wrijf knoflook, cayenne, saffraan en eidooier tot een dieprode pasta.', heatSetting: 'Koude Vijzel' },
            { title: 'Langzame Olijfoliestraal', cue: 'Druppel extra vierge olijfolie langzaam erbij al kloppend tot een dikke saus.', heatSetting: 'Kamertemp.' },
          ],
        },
      },
      steps: {
        1: { title: 'Prei, Venkel & Tomaat Aanzetten', instruction: 'Fruit prei, venkel, knoflook en sinaasappelschil zachtjes in olijfolie. Roer tomatenpuree en venkelzaad mee.', timerLabel: 'Aromaten fruiten' },
        2: { title: 'Saffraanfumet Trekken', instruction: 'Voeg visbouillon, tomaten en geweekte saffraan toe en laat zachtjes trekken tot een robijnrode bouillon.', timerLabel: 'Bouillon trekken' },
        3: { title: 'Witvis Pocheren & Rouille Kloppen', instruction: 'Leg de stukken witvis in de zacht rillende bouillon en klop intussen de rouille en rooster het brood.', timerLabel: 'Witvis pocheren' },
        4: { title: 'Gamba’s & Mosselen Stomen', instruction: 'Voeg gamba’s en mosselen toe, sluit het deksel en stoom tot de schelpen openstaan.', timerLabel: 'Schaaldieren stomen' },
      },
    },
    'poached-pear-frangipane-tart': {
      title: 'Gepocheerde Peer & Amandel-Frangipanetaart',
      subtitle: 'Gekartelde zandtaartbodem, geroosterde amandelcrème en tijmsiroop',
      region: 'Lyon & Loire',
      season: 'Herfst',
      figureCaption: 'Afb. 5 — Gepocheerde Bosc-peren gebakken in amandelfrangipane met tijmsiroop.',
      storyExcerpt: 'Door stevige peren eerst te pocheren in gekruide siroop voorkom je vochtige plekken en krijg je meteen het glazuur voor de taart.',
      storyParagraphs: [
        'Een rauwe peer in frangipane laat tijdens het bakken te veel sap los. Door geschilde Bosc-peren onder een papieren cartouche te garen in vanille, steranijs en citroen blijven ze zijdezacht en strak van vorm.',
        'Na het afkoelen wordt de overgebleven pocheersiroop ingekookt tot een donkere amberkleurige lak die warm over de taart wordt gekwast.',
      ],
      pullQuote: '“Bewaar de pocheersiroop; ingekookt tot glazuur vangt hij de hele geur van de boomgaard.”',
      pairingNote: 'Serveer lauw met ongezoete crème fraîche en een late-oogst Chenin Blanc.',
      ingredients: {
        'bosc-pears': { name: 'Stevige Bosc-peren, geschild & gehalveerd', metricUnit: 'peren', imperialUnit: 'peren' },
        'almond-flour': { name: 'Fijngemalen amandelmeel', metricUnit: 'g', imperialUnit: 'koppen' },
        'soft-butter': { name: 'Zachte ongezouten boter', metricUnit: 'g', imperialUnit: 'el' },
        'caster-sugar': { name: 'Fijne kristalsuiker', metricUnit: 'g', imperialUnit: 'kop' },
        eggs: { name: 'Grote eieren op kamertemperatuur', metricUnit: 'stuks', imperialUnit: 'stuks' },
        'tart-shell': { name: 'Blindgebakken taartbodem (24 cm)', metricUnit: 'bodem', imperialUnit: 'bodem' },
        'flaked-almonds': { name: 'Geschaafde amandelen & verse tijm', metricUnit: 'g', imperialUnit: 'kop' },
      },
      techniques: {
        'pear-syrup-reduction': {
          title: 'Amberkleurige Pocheersiroop Inkoken',
          subtitle: 'Gekruid perenvocht reduceren tot een glanzende patisserielak',
          stages: [
            { title: 'Pocheren onder Cartouche', cue: 'Dek peren af met een ronde bakpapieren deksel zodat ze ondergedompeld blijven.', heatSetting: 'Zacht Pruttelen · 92°C' },
            { title: 'Siroop Inkoken', cue: 'Kook gezeefde siroop in tot grote trage bellen aan de lepel blijven hangen.', heatSetting: 'Middelhoog · 108°C' },
          ],
        },
      },
      steps: {
        1: { title: 'Bosc-peren Zachtjes Pocheren', instruction: 'Pocheer de geschilde peren onder bakpapier in water, suiker, vanille en citroenschil tot ze net zacht zijn.', timerLabel: 'Peren pocheren' },
        2: { title: 'Siroop Inkoken & Frangipane Kloppen', instruction: 'Kook de siroop in tot amberkleurig glazuur en klop intussen boter, suiker, eieren en amandelmeel luchtig.', timerLabel: 'Glazuur inkoken' },
        3: { title: 'Peren Waaieren & Vullen', instruction: 'Strijk frangipane in de bodem, leg de peren in een waaier erin en strooi amandelschaafsel ertussen.', timerLabel: 'Taart opbouwen' },
        4: { title: 'Bakken & Lakken met Tijmglazuur', instruction: 'Bak op 180°C goudbruin en bestrijk direct met de warme perensiroop en verse tijmblaadjes.', timerLabel: 'Perentaart bakken' },
      },
    },
    'burnt-honey-fig-millefeuille': {
      title: 'Mille-Feuille met Gebrande Honing & Geroosterde Vijgen',
      subtitle: 'Gekaramelliseerd bladerdeeg met vanille-diplomatenroom',
      region: 'Parijs',
      season: 'Late Herfst',
      figureCaption: 'Afb. 6 — Krokant gekaramelliseerd bladerdeeg met vanilleroompudding en geroosterde vijgen.',
      storyExcerpt: 'Bladerdeeg bakken tussen twee zware bakplaten geeft flinterdunne, krokante lagen die niet breken onder de lepel.',
      storyParagraphs: [
        'Een echte mille-feuille mag de room niet platdrukken bij het aansnijden. Door deeg tussen twee bakplaten te bakken met poedersuiker ontstaat een flinterdunne, gekaramelliseerde wafel.',
        'Daartussen komt een luchtige crème diplomat—banketbakkersroom gelucht met slagroom en echte vanille—bekroond met zwarte vijgen uit de oven in donkere, bijna rokerige honing.',
      ],
      pullQuote: '“Laat de honing één tint donkerder worden dan comfortabel voelt; dat bittertje wekt de vanille.”',
      pairingNote: 'Serveer met een verse espresso of een glaasje oude Bas-Armagnac.',
      ingredients: {
        'puff-pastry': { name: 'Koud roomboterbladerdeeg', metricUnit: 'g', imperialUnit: 'oz' },
        'icing-sugar': { name: 'Poedersuiker om te karamelliseren', metricUnit: 'g', imperialUnit: 'kop' },
        'whole-milk': { name: 'Volle melk getrokken met 1 vanillestokje', metricUnit: 'ml', imperialUnit: 'koppen' },
        'heavy-cream': { name: 'Koude slagroom voor de diplomatenroom', metricUnit: 'ml', imperialUnit: 'kop' },
        'black-figs': { name: 'Rijpe zwarte vijgen, gehalveerd', metricUnit: 'vijgen', imperialUnit: 'vijgen' },
        'wildflower-honey': { name: 'Donkere wildebloemen- of kastanjehoning', metricUnit: 'g', imperialUnit: 'el' },
      },
      techniques: {
        'burnt-honey-caramel': {
          title: 'Gebrande Honing & Glazuur',
          subtitle: 'Honing karamelliseren tot rokerig kastanjebruin en blussen met citroen',
          stages: [
            { title: 'Snelle Honingschuim', cue: 'Kook honing in een lichte steelpan zodat je de kleur goed ziet veranderen.', heatSetting: 'Middel · 155°C' },
            { title: 'Rokerig Blussen', cue: 'Zodra lichte rook opstijgt, blus met 1 el warm water en citroensap.', heatSetting: 'Van het Vuur' },
          ],
        },
        'diplomat-fold': {
          title: 'Crème Diplomat Spatelen',
          subtitle: 'Licht opgeklopte room luchtig door gekoelde vanilleroom spatelen',
          stages: [
            { title: 'Room Loskloppen', cue: 'Klop koude banketbakkersroom eerst volledig glad.', heatSetting: 'Koude Kom · 8°C' },
            { title: 'J-Slag Spatelen', cue: 'Snijd door het midden en vouw rustig om om alle lucht te bewaren.', heatSetting: 'Gekoeld' },
          ],
        },
      },
      steps: {
        1: { title: 'Gekaramelliseerd Bladerdeeg Bakken', instruction: 'Prik het bladerdeeg in, bak onder een tweede bakplaat op 195°C goudbruin en karamelliseer kort met poedersuiker.', timerLabel: 'Bladerdeeg bakken' },
        2: { title: 'Vijgen Roosteren & Honing Branden', instruction: 'Karamelliseer de honing donker, blus met citroensap en rooster de gehalveerde vijgen kort met de honing.', timerLabel: 'Vijgen roosteren' },
        3: { title: 'Vanille Crème Diplomat Spatelen', instruction: 'Klop de banketbakkersroom glad en spatel in twee delen de lobbig geklopte slagroom erdoor.', timerLabel: 'Room koelen' },
        4: { title: 'Snijden & Opbouwen voor Service', instruction: 'Snijd krokante rechthoeken, spuit rozetten vanilleroom tussen drie lagen en werk af met vijgen en gebrande honing.', timerLabel: 'Mille-feuille opbouwen' },
      },
    },
  },

  fr: {
    'duck-confit-cassoulet': {
      title: 'Confit de Canard Croustillant aux Haricots Tarbais',
      subtitle: 'Échalotes confites, sauge frite et bouillon doux à l’ail',
      region: 'Gascogne & Paris',
      season: 'Automne',
      figureCaption: 'Fig. 1 — Cuisse de canard saisie sur haricots tarbais crémeux et sauge croustillante.',
      storyExcerpt: 'Dans un petit bistrot du canal Saint-Martin, le secret d’un cassoulet de semaine tient au départ à froid dans une poêle en fonte.',
      storyParagraphs: [
        'Chaque novembre, lorsque la pluie bat les hautes fenêtres du canal Saint-Martin, la cheffe Henriette Delacroix sort ses larges assiettes de grès. Plutôt qu’un cassoulet de trois jours, elle marie de fondants haricots tarbais mijotés au bouquet garni avec des cuisses confites dorées jusqu’au craquant.',
        'Tout se joue au départ dans une poêle en fonte absolument froide. À feu doux-moyen, la graisse sous-cutanée fond en or liquide sans dessécher la chair, avant un glaçage final au beurre et une pincée de fleur de sel.',
      ],
      pullQuote: '« Commencez toujours à poêle froide ; laissez le temps transformer la peau en dentelle ambrée. »',
      pairingNote: 'Servez avec un Cahors Malbec frais ou une salade de chicorée à l’huile de noix.',
      ingredients: {
        'duck-legs': { name: 'Cuisses de canard confites, soigneusement séchées', metricUnit: 'cuisses', imperialUnit: 'cuisses' },
        'tarbais-beans': { name: 'Haricots tarbais cuits avec leur bouillon', metricUnit: 'g', imperialUnit: 'tasses' },
        shallots: { name: 'Échalotes bananes fendues en deux', metricUnit: 'pièces', imperialUnit: 'pièces' },
        garlic: { name: 'Gousses d’ail légèrement écrasées', metricUnit: 'gousses', imperialUnit: 'gousses' },
        'chicken-stock': { name: 'Bouillon corsé de volaille rôtie', metricUnit: 'ml', imperialUnit: 'tasse' },
        'sage-leaves': { name: 'Feuilles de sauge fraîche entières', metricUnit: 'feuilles', imperialUnit: 'feuilles' },
        thyme: { name: 'Brins de thym frais', metricUnit: 'brins', imperialUnit: 'brins' },
        butter: { name: 'Beurre demi-sel ou doux froid en dés', metricUnit: 'g', imperialUnit: 'c. à s.' },
      },
      techniques: {
        'confit-cold-render': {
          title: 'Fonte à Froid & Sauge Croustillante',
          subtitle: 'Rendre la graisse doucement pour une peau vitrifiée',
          stages: [
            { title: 'Départ sur Fonte Froide', cue: 'Posez les cuisses côté peau dans une poêle froide pour une fonte régulière.', heatSetting: 'Doux-Moyen · 140°C' },
            { title: 'Frémissement Doré', cue: 'Écoutez un crépitement régulier et appuyez légèrement avec la spatule.', heatSetting: 'Moyen · 165°C' },
            { title: 'Sauge Soufflée', cue: 'Plongez la sauge 20 secondes dans la graisse chaude jusqu’à ce qu’elle croustille.', heatSetting: 'Moyen · 175°C' },
          ],
        },
        'shallot-glaze-emulsion': {
          title: 'Réduction du Bouillon & Glaçage',
          subtitle: 'Lier le jus des haricots au beurre froid',
          stages: [
            { title: 'Caramélisation des Échalotes', cue: 'Saisissez les échalotes côté coupé dans 1 c. à s. de graisse.', heatSetting: 'Moyen · 170°C' },
            { title: 'Mijotage Doux', cue: 'Ajoutez bouillon et haricots sans remuer brutalement.', heatSetting: 'Frémissement · 95°C' },
            { title: 'Beurre Hors du Feu', cue: 'Montez au beurre froid hors du feu pour napper les grains.', heatSetting: 'Hors du Feu' },
          ],
        },
      },
      steps: {
        1: { title: 'Tempérer & Sécher les Cuisses', instruction: 'Essuyez l’excédent de graisse et séchez parfaitement la peau. Posez-les côté peau dans une poêle en fonte froide.', timerLabel: 'Séchage & repos' },
        2: { title: 'Rissoler Jusqu’au Craquant', instruction: 'Chauffez à feu doux-moyen sans bouger jusqu’à peau ambrée, puis retournez 2 minutes.', timerLabel: 'Dorer la peau' },
        3: { title: 'Caraméliser Échalotes & Sauge', instruction: 'Réservez le canard. Faites caraméliser échalotes, ail et thym puis frire la sauge.', timerLabel: 'Caraméliser échalotes' },
        4: { title: 'Mijoter les Haricots au Bouillon', instruction: 'Déglacez au bouillon de volaille et laissez réduire avec les haricots jusqu’à consistance veloutée.', timerLabel: 'Mijoter haricots' },
        5: { title: 'Monter au Beurre & Dresser', instruction: 'Hors du feu, montez au beurre froid, servez en bols chauds sous la cuisse et la sauge frite.', timerLabel: 'Repos & service' },
      },
    },
    'chanterelle-buckwheat-galette': {
      title: 'Galette de Sarrasin aux Girolles & Comté Affiné',
      subtitle: 'Pâte feuilletée au blé noir, champignons au thym et beurre noisette',
      region: 'Jura & Bretagne',
      season: 'Automne',
      figureCaption: 'Fig. 2 — Galette rustique plissée autour des girolles rôties et du Comté.',
      storyExcerpt: 'Le sarrasin apporte une chaleur de noisette grillée qui transforme les girolles et le Comté en pièce maîtresse de bistrot.',
      storyParagraphs: [
        'Une galette libre pardonne la rigueur des moules cannelés. La farine de sarrasin moulue sur pierre donne une pâte rustique autour du Comté affiné 18 mois.',
        'Tout se décide à la poêle avant d’enfourner : les champignons doivent rendre toute leur eau à feu vif en une seule couche.',
      ],
      pullQuote: '« Ne serrez jamais les girolles dans la poêle ; laissez-leur l’espace de sécher et dorer. »',
      pairingNote: 'Accordez avec un Savagnin du Jura ou un cidre fermier sec.',
      ingredients: {
        'pastry-flour': { name: 'Farine de blé T55', metricUnit: 'g', imperialUnit: 'tasses' },
        'buckwheat-flour': { name: 'Farine de sarrasin torréfiée', metricUnit: 'g', imperialUnit: 'tasse' },
        'cold-butter': { name: 'Beurre demi-sel bien froid en dés', metricUnit: 'g', imperialUnit: 'c. à s.' },
        chanterelles: { name: 'Girolles et champignons de Paris brossés', metricUnit: 'g', imperialUnit: 'lb' },
        'comte-cheese': { name: 'Comté affiné râpé gros', metricUnit: 'g', imperialUnit: 'tasses' },
        'creme-fraiche': { name: 'Crème fraîche épaisse', metricUnit: 'g', imperialUnit: 'tasse' },
        'egg-yolk': { name: 'Jaune d’œuf battu avec 1 c. à s. de crème', metricUnit: 'jaune', imperialUnit: 'jaune' },
      },
      techniques: {
        'galette-dough-fold': {
          title: 'Fraisage & Pliage Rustique',
          subtitle: 'Écraser le beurre froid pour créer un feuilletage net',
          stages: [
            { title: 'Pincement du Beurre', cue: 'Aplatissez les dés froids sans réchauffer la pâte.', heatSetting: 'Marbre Froid · 16°C' },
            { title: 'Fraisage à la Paume', cue: 'Écrasez la pâte une fois devant vous pour lier farine et beurre.', heatSetting: 'Plan Froid' },
            { title: 'Plis Chevauchants', cue: 'Repliez une bordure de 4 cm tous les 6 cm en soudant bien.', heatSetting: 'Temp. Ambiante' },
          ],
        },
        'mushroom-dry-sear': {
          title: 'Saisie Vive des Girolles',
          subtitle: 'Évaporer toute l’humidité avant le montage',
          stages: [
            { title: 'Taille Régulière', cue: 'Déchirez les grosses girolles dans la longueur.', heatSetting: 'Planche' },
            { title: 'Saisie sans Couche', cue: 'Laissez dorer 2 minutes sans remuer avant d’ajouter le thym.', heatSetting: 'Vif · 205°C' },
          ],
        },
      },
      steps: {
        1: { title: 'Travailler & Réfrigérer la Pâte', instruction: 'Sablez farines, sel et beurre froid, liez à l’eau glacée et laissez reposer au frais.', timerLabel: 'Repos de la pâte' },
        2: { title: 'Saisir les Girolles au Beurre', instruction: 'Faites dorer les champignons à feu vif en une couche jusqu’à évaporation complète.', timerLabel: 'Saisir girolles' },
        3: { title: 'Étaler, Garnir & Plisser', instruction: 'Étalez en cercle de 34 cm, tartinez de crème, ajoutez Comté et girolles puis plissez les bords.', timerLabel: 'Rafraîchir la pâte' },
        4: { title: 'Cuire Jusqu’au Doré Ambré', instruction: 'Dorez au jaune d’œuf et enfournez à 205°C jusqu’à pâte bien croustillante.', timerLabel: 'Cuisson galette' },
      },
    },
    'sea-bass-saffron-fennel': {
      title: 'Bar Croustillant, Fenouil Braisé & Beurre Blanc au Safran',
      subtitle: 'Peau incisée, citron Meyer grillé et réduction au vin blanc',
      region: 'Côte d’Azur',
      season: 'Hiver',
      figureCaption: 'Fig. 3 — Filet de bar sur fenouil braisé dans un beurre blanc safrané.',
      storyExcerpt: 'Tout l’équilibre repose sur le contraste entre une peau brûlante et croquante et une émulsion tiède au safran.',
      storyParagraphs: [
        'Le poisson cuit en quelques minutes : tout se prépare avant la saisie. Les bulbes de fenouil braisent doucement au vermouth blanc.',
        'Pour le beurre blanc, la maîtrise de la chaleur est reine : hors d’ébullition, les dés de beurre très froid montent une sauce satinée couleur d’or.',
      ],
      pullQuote: '« Appuyez doucement vingt secondes dès l’entrée en poêle : la peau croustillante naît dans le calme. »',
      pairingNote: 'Servez avec un Chablis minéral ou un Vermentino vif.',
      ingredients: {
        'sea-bass': { name: 'Filets de bar sauvage avec peau', metricUnit: 'g', imperialUnit: 'oz' },
        'baby-fennel': { name: 'Jeunes bulbes de fenouil en quartiers', metricUnit: 'bulbes', imperialUnit: 'bulbes' },
        saffron: { name: 'Pistils de safran infusés au vin tiède', metricUnit: 'c. à c.', imperialUnit: 'c. à c.' },
        'dry-white-wine': { name: 'Vin blanc sec ou vermouth', metricUnit: 'ml', imperialUnit: 'tasse' },
        'cold-butter-cubes': { name: 'Beurre froid en petits dés', metricUnit: 'g', imperialUnit: 'c. à s.' },
        'meyer-lemon': { name: 'Citron Meyer coupé en deux', metricUnit: 'pièce', imperialUnit: 'pièce' },
      },
      techniques: {
        'saffron-beurre-blanc': {
          title: 'Émulsion Beurre Blanc au Safran',
          subtitle: 'Monter le beurre froid sans jamais trancher la sauce',
          stages: [
            { title: 'Réduction Aromatique', cue: 'Réduisez échalote, vin blanc et safran à 2 cuillères à soupe.', heatSetting: 'Moyen · 100°C' },
            { title: 'Incorporation Douce', cue: 'Sur feu minimal, fouettez 2 dés froids à la fois.', heatSetting: 'Doux · 62°C' },
            { title: 'Test à la Cuillère', cue: 'La sauce doit napper nettement le dos d’une cuillère.', heatSetting: 'Maintien · 58°C' },
          ],
        },
        'fish-skin-sear': {
          title: 'Saisie Lestée Côté Peau',
          subtitle: 'Inciser et presser pour une croûte uniforme',
          stages: [
            { title: 'Incisions Légères', cue: 'Entaillez la peau trois fois sans toucher la chair.', heatSetting: 'Planche' },
            { title: 'Pression 20 Secondes', cue: 'Maintenez le filet à plat avec la spatule dès le contact.', heatSetting: 'Moyen-Vif · 190°C' },
          ],
        },
      },
      steps: {
        1: { title: 'Braiser les Quartiers de Fenouil', instruction: 'Dorez le fenouil à l’huile d’olive puis braisez à couvert au vin blanc.', timerLabel: 'Braiser fenouil' },
        2: { title: 'Réduire Vin & Safran', instruction: 'Faites réduire le vin restant avec le safran et l’échalote en un sirop.', timerLabel: 'Réduction safran' },
        3: { title: 'Saisir le Bar Côté Peau', instruction: 'Incisez la peau, salez et saisissez côté peau 4 min puis 45 s côté chair.', timerLabel: 'Saisir le bar' },
        4: { title: 'Griller le Citron & Monter la Sauce', instruction: 'Montez la réduction au beurre froid et citronnez juste avant de napper.', timerLabel: 'Monter beurre blanc' },
      },
    },
    'heirloom-copper-bouillabaisse': {
      title: 'Bouillabaisse en Cuivre & Rouille Safranée',
      subtitle: 'Moules, gambas sauvages, bouillon tomate-safran et croûtons à l’ail',
      region: 'Marseille',
      season: 'Hiver',
      figureCaption: 'Fig. 4 — Bouillabaisse au safran en marmite de cuivre et croûtons de rouille.',
      storyExcerpt: 'La vraie bouillabaisse obéit au rythme de cuisson : poissons fermes d’abord, gambas ensuite, moules ouvertes dans les dernières secondes.',
      storyParagraphs: [
        'Sur le port de Marseille, le secret reste la base aromatique : fenouil, zeste d’orange, poireaux, tomates mûres et safran.',
        'Chaque espèce entre en scène au moment juste pour rester nacrée dans un bouillon doucement frémissant.',
      ],
      pullQuote: '« Faire bouillir une soupe de poisson la durcit ; gardez un frémissement paisible. »',
      pairingNote: 'Servez un Bandol Rosé bien frais.',
      ingredients: {
        'white-fish': { name: 'Poissons blancs fermes (lotte, cabillaud) en tronçons', metricUnit: 'g', imperialUnit: 'lb' },
        'black-mussels': { name: 'Moules de bouchot nettoyées', metricUnit: 'g', imperialUnit: 'lb' },
        'wild-prawns': { name: 'Gambas sauvages entières', metricUnit: 'pièces', imperialUnit: 'pièces' },
        'fish-stock': { name: 'Fumet de poisson aromatique', metricUnit: 'ml', imperialUnit: 'tasses' },
        'fennel-orange': { name: 'Poireau, fenouil & zeste d’orange', metricUnit: 'g', imperialUnit: 'tasses' },
        'tomato-paste': { name: 'Concentré et tomates concassées', metricUnit: 'g', imperialUnit: 'tasse' },
        'rouille-base': { name: 'Rouille à l’ail safranée & baguette grillée', metricUnit: 'g', imperialUnit: 'tasse' },
      },
      techniques: {
        'bouillabaisse-emulsion': {
          title: 'Rouille au Mortier',
          subtitle: 'Émulsion épaisse ail, safran et huile d’olive vierge',
          stages: [
            { title: 'Pâte Ail & Safran', cue: 'Pilez ail, piment, safran et jaune d’œuf en pâte dense.', heatSetting: 'Mortier Froid' },
            { title: 'Filet d’Huile d’Olive', cue: 'Montez goutte à goutte au fouet jusqu’à consistance ferme.', heatSetting: 'Temp. Ambiante' },
          ],
        },
      },
      steps: {
        1: { title: 'Suer Poireaux, Fenouil & Tomate', instruction: 'Faites fondre poireaux, fenouil, ail et zeste à l’huile d’olive puis ajoutez la tomate.', timerLabel: 'Suer aromates' },
        2: { title: 'Infuser le Fumet au Safran', instruction: 'Mouillez au fumet avec les tomates et le safran; laissez mijoter 15 minutes.', timerLabel: 'Mijoter bouillon' },
        3: { title: 'Pocher le Poisson & Monter la Rouille', instruction: 'Pochez le poisson blanc à feu doux pendant que vous montez la rouille.', timerLabel: 'Pocher poisson' },
        4: { title: 'Ouvrir Gambas & Moules', instruction: 'Ajoutez gambas et moules à couvert jusqu’à ouverture complète.', timerLabel: 'Cuire coquillages' },
      },
    },
    'poached-pear-frangipane-tart': {
      title: 'Tarte aux Poires Pochées & Frangipane aux Amandes',
      subtitle: 'Pâte sucrée cannelée, crème d’amandes et sirop au thym',
      region: 'Lyon & Loire',
      season: 'Automne',
      figureCaption: 'Fig. 5 — Poires Bosc pochées sur crème d’amandes dorée au sirop de thym.',
      storyExcerpt: 'Pocher les poires Bosc avant la cuisson évite l’humidité et livre un sirop ambré parfait pour glacer la tarte.',
      storyParagraphs: [
        'Des poires crues détrempent la crème d’amande. En les pochant d’abord sous un disque de papier cuisson avec vanille et badiane, elles restent fondantes et nettes.',
        'Le sirop réduit ensuite en un vernis ambré parfumé de thym frais.',
      ],
      pullQuote: '« Gardez le sirop de pochage : réduit à la nappe, il concentre tout le parfum du verger. »',
      pairingNote: 'Dégustez tiède avec une crème fraîche épaisse et un Chenin moelleux.',
      ingredients: {
        'bosc-pears': { name: 'Poires Bosc fermes, pelées & coupées en deux', metricUnit: 'poires', imperialUnit: 'poires' },
        'almond-flour': { name: 'Poudre d’amandes blanches fine', metricUnit: 'g', imperialUnit: 'tasses' },
        'soft-butter': { name: 'Beurre doux pommade', metricUnit: 'g', imperialUnit: 'c. à s.' },
        'caster-sugar': { name: 'Sucre fin', metricUnit: 'g', imperialUnit: 'tasse' },
        eggs: { name: 'Œufs fermiers à température ambiante', metricUnit: 'œufs', imperialUnit: 'œufs' },
        'tart-shell': { name: 'Fond de pâte sucrée cuit à blanc (24 cm)', metricUnit: 'fond', imperialUnit: 'fond' },
        'flaked-almonds': { name: 'Amandes effilées & thym frais', metricUnit: 'g', imperialUnit: 'tasse' },
      },
      techniques: {
        'pear-syrup-reduction': {
          title: 'Réduction du Sirop Ambré',
          subtitle: 'Transformer le jus de pochage en glaçage brillant',
          stages: [
            { title: 'Pochage sous Cartouche', cue: 'Couvrez d’un disque de papier pour teinter uniformément.', heatSetting: 'Frémissement · 92°C' },
            { title: 'Serrage du Sirop', cue: 'Bouillez le sirop filtré jusqu’à bulles lentes et brillantes.', heatSetting: 'Moyen-Vif · 108°C' },
          ],
        },
      },
      steps: {
        1: { title: 'Pocher les Poires Bosc', instruction: 'Pochez les poires sous papier sulfurisé dans le sirop vanillé jusqu’à tendreté.', timerLabel: 'Pocher poires' },
        2: { title: 'Réduire le Sirop & Préparer la Frangipane', instruction: 'Réduisez le sirop en glaçage et crémez beurre, sucre, œufs et poudre d’amandes.', timerLabel: 'Réduire sirop' },
        3: { title: 'Garnir & Disposer en Étoile', instruction: 'Étalez la frangipane dans le fond de tarte et disposez les poires émincées.', timerLabel: 'Monter la tarte' },
        4: { title: 'Cuire & Lustrer au Sirop Chaud', instruction: 'Cuisez à 180°C jusqu’à belle coloration et lustrez au sirop et au thym.', timerLabel: 'Cuire la tarte' },
      },
    },
    'burnt-honey-fig-millefeuille': {
      title: 'Mille-Feuille au Miel Brûlé & Figues Rôties',
      subtitle: 'Feuilletage caramélisé et crème diplomate à la vanille',
      region: 'Paris',
      season: 'Fin d’Automne',
      figureCaption: 'Fig. 6 — Feuilletage caramélisé, crème diplomate vanille et figues rôties.',
      storyExcerpt: 'Cuire le feuilletage entre deux plaques lourdes offre des feuilles plates et vitrifiées qui cassent net sous la fourchette.',
      storyParagraphs: [
        'Un grand mille-feuille ne doit jamais écraser sa crème à la découpe. Entre deux plaques avec sucre glace, le feuilletage cuit droit et croustillant.',
        'Il renferme une crème diplomate aérienne surmontée de figues noires rôties au miel de sarrasin presque fumé.',
      ],
      pullQuote: '« Poussez le miel une nuance au-delà du confort : son amertume réveille la vanille. »',
      pairingNote: 'Servez avec un espresso ou un vieux Bas-Armagnac.',
      ingredients: {
        'puff-pastry': { name: 'Pâte feuilletée pur beurre bien froide', metricUnit: 'g', imperialUnit: 'oz' },
        'icing-sugar': { name: 'Sucre glace pour caraméliser', metricUnit: 'g', imperialUnit: 'tasse' },
        'whole-milk': { name: 'Lait entier infusé à la vanille', metricUnit: 'ml', imperialUnit: 'tasses' },
        'heavy-cream': { name: 'Crème liquide entière bien froide', metricUnit: 'ml', imperialUnit: 'tasse' },
        'black-figs': { name: 'Figues noires mûres coupées en deux', metricUnit: 'figues', imperialUnit: 'figues' },
        'wildflower-honey': { name: 'Miel foncé de châtaignier ou fleurs', metricUnit: 'g', imperialUnit: 'c. à s.' },
      },
      techniques: {
        'burnt-honey-caramel': {
          title: 'Miel Brûlé & Glaçage',
          subtitle: 'Cuire le miel jusqu’au stade châtain fumé',
          stages: [
            { title: 'Ébullition Rapide', cue: 'Surveillez la teinte dans une casserole claire.', heatSetting: 'Moyen · 155°C' },
            { title: 'Déglacer au Citron', cue: 'Dès les premières volutes fumées, stoppez avec eau et jus de citron.', heatSetting: 'Hors du Feu' },
          ],
        },
        'diplomat-fold': {
          title: 'Mélange de la Crème Diplomate',
          subtitle: 'Incorporer la chantilly à la crème pâtissière froide',
          stages: [
            { title: 'Lisser la Pâtissière', cue: 'Fouettez vivement la crème froide avant d’ajouter la crème montée.', heatSetting: 'Bol Froid · 8°C' },
            { title: 'Geste à la Maryse', cue: 'Soulevez la masse du fond vers le haut sans chasser l’air.', heatSetting: 'Froid' },
          ],
        },
      },
      steps: {
        1: { title: 'Cuire le Feuilletage Caramélisé', instruction: 'Piquez la pâte, cuisez sous une deuxième plaque à 195°C et caramélisez au sucre glace.', timerLabel: 'Cuire feuilletage' },
        2: { title: 'Rôtir les Figues au Miel Brûlé', instruction: 'Faites brunir le miel, stoppez au citron et rôtissez les figues arrosées de miel.', timerLabel: 'Rôtir figues' },
        3: { title: 'Monter la Crème Diplomate', instruction: 'Lissez la crème pâtissière vanille et incorporez délicatement la crème fouettée.', timerLabel: 'Refroidir crème' },
        4: { title: 'Tailler & Monter Minute', instruction: 'Taillez trois rectangles nets, pochez la crème entre les feuilles et couronnez de figues.', timerLabel: 'Dresser mille-feuille' },
      },
    },
  },

  es: {
    'duck-confit-cassoulet': {
      title: 'Confit de Pato Crujiente sobre Alubias Tarbais',
      subtitle: 'Chalotas caramelizadas, salvia frita y caldo suave de ajo',
      region: 'Gascuña y París',
      season: 'Otoño',
      figureCaption: 'Fig. 1 — Muslo de pato dorado sobre alubias cremosas con salvia crujiente.',
      storyExcerpt: 'En un pequeño bistró del Canal Saint-Martin, el secreto consistía en empezar los muslos confitados en una sartén de hierro completamente fría.',
      storyParagraphs: [
        'Cada noviembre, la chef Henriette Delacroix sirve anchos cuencos de loza con alubias blancas Tarbais cocidas lentamente con hierbas y acompañadas de muslos de pato confitados de piel cristalina.',
        'La clave está en empezar en una sartén de hierro fría: al subir despacio el fuego, la grasa se funde sin resecar la carne.',
      ],
      pullQuote: '«Empieza siempre con la sartén fría; deja que la paciencia convierta la piel en encaje ámbar.»',
      pairingNote: 'Acompaña con un Cahors Malbec fresco o ensalada de escarola al aceite de nuez.',
      ingredients: {
        'duck-legs': { name: 'Muslos de pato confitados bien secos', metricUnit: 'muslos', imperialUnit: 'muslos' },
        'tarbais-beans': { name: 'Alubias blancas cocidas con su caldo', metricUnit: 'g', imperialUnit: 'tazas' },
        shallots: { name: 'Chalotas partidas a lo largo', metricUnit: 'piezas', imperialUnit: 'piezas' },
        garlic: { name: 'Dientes de ajo machacados', metricUnit: 'dientes', imperialUnit: 'dientes' },
        'chicken-stock': { name: 'Caldo oscuro de ave asada', metricUnit: 'ml', imperialUnit: 'taza' },
        'sage-leaves': { name: 'Hojas enteras de salvia fresca', metricUnit: 'hojas', imperialUnit: 'hojas' },
        thyme: { name: 'Ramitas de tomillo fresco', metricUnit: 'ramitas', imperialUnit: 'ramitas' },
        butter: { name: 'Mantequilla fría en dados', metricUnit: 'g', imperialUnit: 'cdas.' },
      },
      techniques: {
        'confit-cold-render': {
          title: 'Fundido en Sartén Fría y Salvia',
          subtitle: 'Derretir la grasa despacio para lograr piel crujiente',
          stages: [
            { title: 'Inicio en Hierro Frío', cue: 'Coloca los muslos con la piel hacia abajo sin precalentar.', heatSetting: 'Bajo-Medio · 140°C' },
            { title: 'Burbujas Doradas', cue: 'Presiona ligeramente con espátula mientras dora uniforme.', heatSetting: 'Medio · 165°C' },
            { title: 'Toque de Salvia', cue: 'Fríe la salvia 20 segundos en la grasa dorada.', heatSetting: 'Medio · 175°C' },
          ],
        },
        'shallot-glaze-emulsion': {
          title: 'Reducción y Glaseado de Alubias',
          subtitle: 'Ligar el caldo con mantequilla fría fuera del fuego',
          stages: [
            { title: 'Chalotas Caramelizadas', cue: 'Dora las chalotas boca abajo en grasa de pato.', heatSetting: 'Medio · 170°C' },
            { title: 'Chup-chup Suave', cue: 'Añade caldo y alubias sin romper la piel.', heatSetting: 'Hervor Suave · 95°C' },
            { title: 'Montado al Final', cue: 'Bate mantequilla fría fuera del fuego hasta dar brillo.', heatSetting: 'Sin Fuego' },
          ],
        },
      },
      steps: {
        1: { title: 'Secar y Templar los Muslos', instruction: 'Retira el exceso de grasa, seca muy bien la piel y coloca en sartén de hierro fría.', timerLabel: 'Reposar y secar' },
        2: { title: 'Dorar Despacio Hasta Crujir', instruction: 'Cocina a fuego medio-bajo hasta que la piel esté ámbar y crujiente; gira 2 minutos.', timerLabel: 'Crujir la piel' },
        3: { title: 'Caramelizar Chalotas y Salvia', instruction: 'Reserva el pato; dora chalotas, ajo y tomillo y fríe la salvia.', timerLabel: 'Dorar chalotas' },
        4: { title: 'Cocer las Alubias en Caldo', instruction: 'Desglasa con el caldo y reduce suavemente con las alubias.', timerLabel: 'Cocer alubias' },
        5: { title: 'Montar con Mantequilla y Servir', instruction: 'Fuera del fuego incorpora la mantequilla fría y sirve con el pato encima.', timerLabel: 'Reposar y servir' },
      },
    },
    'chanterelle-buckwheat-galette': {
      title: 'Galette de Trigo Sarraceno con Rebozuelos y Comté',
      subtitle: 'Masa rústica quebradiza, setas al tomillo y mantequilla tostada',
      region: 'Jura y Bretaña',
      season: 'Otoño',
      figureCaption: 'Fig. 2 — Galette rústica plegada con rebozuelos salteados y Comté curado.',
      storyExcerpt: 'El trigo sarraceno aporta un aroma a avellana tostada ideal para setas de bosque y queso alpino.',
      storyParagraphs: [
        'La galette rústica prescinde de moldes rígidos y acoge queso Comté de 18 meses con rebozuelos frescos.',
        'Las setas deben saltearse en una sola capa a fuego vivo para evaporar toda el agua antes de hornear.',
      ],
      pullQuote: '«Nunca amontones las setas; dales espacio para dorarse secas antes de tocar la masa.»',
      pairingNote: 'Sirve con un Savagnin del Jura o sidra seca natural.',
      ingredients: {
        'pastry-flour': { name: 'Harina de trigo para repostería', metricUnit: 'g', imperialUnit: 'tazas' },
        'buckwheat-flour': { name: 'Harina tostada de trigo sarraceno', metricUnit: 'g', imperialUnit: 'taza' },
        'cold-butter': { name: 'Mantequilla salada muy fría en cubos', metricUnit: 'g', imperialUnit: 'cdas.' },
        chanterelles: { name: 'Rebozuelos y setas limpias con brocha', metricUnit: 'g', imperialUnit: 'lb' },
        'comte-cheese': { name: 'Queso Comté curado rallado', metricUnit: 'g', imperialUnit: 'tazas' },
        'creme-fraiche': { name: 'Crème fraîche espesa', metricUnit: 'g', imperialUnit: 'taza' },
        'egg-yolk': { name: 'Yema de huevo batida con nata', metricUnit: 'yema', imperialUnit: 'yema' },
      },
      techniques: {
        'galette-dough-fold': {
          title: 'Fraisage y Pliegue de Galette',
          subtitle: 'Laminar mantequilla fría entre capas de masa',
          stages: [
            { title: 'Láminas de Mantequilla', cue: 'Aplasta los cubos fríos sin derretirlos.', heatSetting: 'Mármol Frío · 16°C' },
            { title: 'Fraisage con la Palma', cue: 'Extiende la masa una vez sobre papel para crear capas.', heatSetting: 'Superficie Fría' },
            { title: 'Pliegue Superpuesto', cue: 'Dobla 4 cm de borde hacia dentro sellando bien.', heatSetting: 'Ambiente' },
          ],
        },
        'mushroom-dry-sear': {
          title: 'Sellado Vivo de Setas',
          subtitle: 'Evaporar el agua de bosque antes del montaje',
          stages: [
            { title: 'Corte Uniforme', cue: 'Rasga los rebozuelos grandes a lo largo.', heatSetting: 'Tabla' },
            { title: 'Una Sola Capa', cue: 'Dora 2 minutos sin mover antes de añadir tomillo.', heatSetting: 'Fuerte · 205°C' },
          ],
        },
      },
      steps: {
        1: { title: 'Preparar y Enfriar la Masa', instruction: 'Mezcla harinas, sal y mantequilla fría, añade agua helada y refrigera.', timerLabel: 'Enfriar masa' },
        2: { title: 'Saltear las Setas Hasta Dorar', instruction: 'Dora las setas en mantequilla a fuego fuerte en una sola capa.', timerLabel: 'Saltear setas' },
        3: { title: 'Estirar, Rellenar y Plegar', instruction: 'Estira un disco de 34 cm, unta crème fraîche, reparte queso y setas y pliega el borde.', timerLabel: 'Asentar masa' },
        4: { title: 'Hornear Hasta Dorar', instruction: 'Pinta con yema y hornea a 205°C hasta borde crujiente.', timerLabel: 'Hornear galette' },
      },
    },
    'sea-bass-saffron-fennel': {
      title: 'Lubina Crujiente con Hinojo y Beurre Blanc al Azafrán',
      subtitle: 'Piel marcada, limón asado y emulsión de vino blanco',
      region: 'Costa Azul',
      season: 'Invierno',
      figureCaption: 'Fig. 3 — Lubina crujiente sobre hinojo braseado en beurre blanc de azafrán.',
      storyExcerpt: 'Un plato costero clásico juega con el contraste entre piel crujiente recién salida del fuego y salsa tibia.',
      storyParagraphs: [
        'El hinojo tierno se brasea primero en vermut seco hasta que cede con facilidad.',
        'La beurre blanc exige calor mínimo para emulsionar la mantequilla fría sin cortarse.',
      ],
      pullQuote: '«Presiona veinte segundos al tocar el aceite: la piel crujiente se gana en silencio.»',
      pairingNote: 'Acompaña con un Chablis mineral o Vermentino fresco.',
      ingredients: {
        'sea-bass': { name: 'Lomos de lubina salvaje con piel', metricUnit: 'g', imperialUnit: 'oz' },
        'baby-fennel': { name: 'Bulbos de hinojo tierno en cuartos', metricUnit: 'bulbos', imperialUnit: 'bulbos' },
        saffron: { name: 'Hebras de azafrán en vino tibio', metricUnit: 'cdta.', imperialUnit: 'cdta.' },
        'dry-white-wine': { name: 'Vino blanco seco o vermut', metricUnit: 'ml', imperialUnit: 'taza' },
        'cold-butter-cubes': { name: 'Mantequilla fría sin sal en cubos', metricUnit: 'g', imperialUnit: 'cdas.' },
        'meyer-lemon': { name: 'Limón Meyer partido por la mitad', metricUnit: 'pieza', imperialUnit: 'pieza' },
      },
      techniques: {
        'saffron-beurre-blanc': {
          title: 'Emulsión Beurre Blanc al Azafrán',
          subtitle: 'Montar mantequilla fría en reducción tibia sin cortar',
          stages: [
            { title: 'Reducción Aromática', cue: 'Reduce chalota, vino y azafrán a 2 cucharadas.', heatSetting: 'Medio · 100°C' },
            { title: 'Cubos Fríos', cue: 'Bate 2 cubos de mantequilla a la vez a fuego mínimo.', heatSetting: 'Bajo · 62°C' },
            { title: 'Punto Napado', cue: 'La salsa debe cubrir el dorso de una cuchara con brillo.', heatSetting: 'Tibio · 58°C' },
          ],
        },
        'fish-skin-sear': {
          title: 'Sellado Plano de la Piel',
          subtitle: 'Marcar y presionar para un crujiente uniforme',
          stages: [
            { title: 'Cortes Superficiales', cue: 'Haz 3 cortes en la piel sin llegar a la carne.', heatSetting: 'Tabla' },
            { title: 'Presión 20 Segundos', cue: 'Presiona con espátula al contacto con el aceite.', heatSetting: 'Medio-Alto · 190°C' },
          ],
        },
      },
      steps: {
        1: { title: 'Brasear el Hinojo', instruction: 'Dora los cuartos de hinojo y brasea tapados con vino blanco.', timerLabel: 'Brasear hinojo' },
        2: { title: 'Reducir Vino y Azafrán', instruction: 'Hierve el vino con azafrán y chalota hasta lograr dos cucharadas de jarabe.', timerLabel: 'Reducir azafrán' },
        3: { title: 'Marcar la Lubina por la Piel', instruction: 'Cocina por el lado de la piel presionando 20 segundos y termina 45 s por el otro lado.', timerLabel: 'Crujir pescado' },
        4: { title: 'Asar Limón y Montar la Salsa', instruction: 'Emulsiona la mantequilla fría en la base tibia de azafrán y sirve al momento.', timerLabel: 'Montar salsa' },
      },
    },
    'heirloom-copper-bouillabaisse': {
      title: 'Bullabesa en Cazuela de Cobre con Rouille',
      subtitle: 'Mejillones, langostinos, caldo de azafrán y pan tostado al ajo',
      region: 'Marsella',
      season: 'Invierno',
      figureCaption: 'Fig. 4 — Bullabesa al azafrán en cobre martillado con tostas de rouille.',
      storyExcerpt: 'La auténtica bullabesa se define por el orden de entrada: primero pescado firme, luego langostinos y al final mejillones.',
      storyParagraphs: [
        'En el puerto de Marsella la base aromática de hinojo, piel de naranja, puerro, tomate y azafrán transforma el caldo.',
        'Mantener un hervor apenas tembloroso conserva la ternura del marisco.',
      ],
      pullQuote: '«Si hierves a borbotones endureces el pescado; mantén el caldo en un susurro.»',
      pairingNote: 'Sirve con un Bandol Rosado bien frío.',
      ingredients: {
        'white-fish': { name: 'Pescado blanco firme en trozos', metricUnit: 'g', imperialUnit: 'lb' },
        'black-mussels': { name: 'Mejillones frescos limpios', metricUnit: 'g', imperialUnit: 'lb' },
        'wild-prawns': { name: 'Langostinos enteros', metricUnit: 'piezas', imperialUnit: 'piezas' },
        'fish-stock': { name: 'Fumet aromático de pescado', metricUnit: 'ml', imperialUnit: 'tazas' },
        'fennel-orange': { name: 'Puerro, hinojo y piel de naranja', metricUnit: 'g', imperialUnit: 'tazas' },
        'tomato-paste': { name: 'Concentrado y tomate triturado', metricUnit: 'g', imperialUnit: 'taza' },
        'rouille-base': { name: 'Rouille de ajo y azafrán con pan tostado', metricUnit: 'g', imperialUnit: 'taza' },
      },
      techniques: {
        'bouillabaisse-emulsion': {
          title: 'Rouille de Azafrán en Mortero',
          subtitle: 'Emulsión espesa de ajo y aceite para untar en pan',
          stages: [
            { title: 'Pasta de Ajo y Azafrán', cue: 'Maja ajo, cayena, azafrán y yema hasta formar pasta.', heatSetting: 'Mortero Frío' },
            { title: 'Hilo de Aceite', cue: 'Añade aceite de oliva gota a gota sin dejar de batir.', heatSetting: 'Temp. Ambiente' },
          ],
        },
      },
      steps: {
        1: { title: 'Pochar Puerro, Hinojo y Tomate', instruction: 'Sofríe suavemente las verduras en aceite de oliva e incorpora tomate y semillas de hinojo.', timerLabel: 'Pochar base' },
        2: { title: 'Infusionar el Caldo de Azafrán', instruction: 'Vierte el fumet, tomates y azafrán y cuece a fuego lento 15 minutos.', timerLabel: 'Cocer caldo' },
        3: { title: 'Pochar el Pescado y Hacer Rouille', instruction: 'Introduce el pescado blanco en el caldo suave mientras bates la rouille.', timerLabel: 'Pochar pescado' },
        4: { title: 'Abrir Langostinos y Mejillones', instruction: 'Añade langostinos y mejillones, tapa y cocina hasta que abran.', timerLabel: 'Cocer marisco' },
      },
    },
    'poached-pear-frangipane-tart': {
      title: 'Tarta de Peras Escalfadas y Frangipane de Almendra',
      subtitle: 'Masa quebrada dulce, crema de almendra y glaseado de tomillo',
      region: 'Lyon y Loira',
      season: 'Otoño',
      figureCaption: 'Fig. 5 — Peras Bosc escalfadas sobre frangipane con glaseado de tomillo.',
      storyExcerpt: 'Escalfar las peras primero evita humedad en la crema y regala el almíbar perfecto para barnizar la tarta.',
      storyParagraphs: [
        'Las peras crudas sueltan agua en el horno; cocerlas antes bajo papel vegetal con vainilla y anís conserva su forma sedosa.',
        'El almíbar reducido a punto de brillo sella la tarta al salir del horno.',
      ],
      pullQuote: '«Guarda el almíbar de escalfar: reducido a glaseado encierra todo el perfume del huerto.»',
      pairingNote: 'Sirve tibia con crème fraîche y un Chenin Blanc tardío.',
      ingredients: {
        'bosc-pears': { name: 'Peras Bosc firmes, peladas y partidas', metricUnit: 'peras', imperialUnit: 'peras' },
        'almond-flour': { name: 'Harina fina de almendra', metricUnit: 'g', imperialUnit: 'tazas' },
        'soft-butter': { name: 'Mantequilla sin sal en pomada', metricUnit: 'g', imperialUnit: 'cdas.' },
        'caster-sugar': { name: 'Azúcar fino', metricUnit: 'g', imperialUnit: 'taza' },
        eggs: { name: 'Huevos grandes a temperatura ambiente', metricUnit: 'huevos', imperialUnit: 'huevos' },
        'tart-shell': { name: 'Base de masa quebrada precocida (24 cm)', metricUnit: 'base', imperialUnit: 'base' },
        'flaked-almonds': { name: 'Almendra laminada y tomillo fresco', metricUnit: 'g', imperialUnit: 'taza' },
      },
      techniques: {
        'pear-syrup-reduction': {
          title: 'Reducción de Almíbar Ámbar',
          subtitle: 'Concentrar el caldo especiado en un glaseado brillante',
          stages: [
            { title: 'Escalfado con Papel', cue: 'Cubre con disco de papel para mantener las peras sumergidas.', heatSetting: 'Hervor Suave · 92°C' },
            { title: 'Punto de Glaseado', cue: 'Hierve el almíbar colado hasta que espese y brille.', heatSetting: 'Medio-Alto · 108°C' },
          ],
        },
      },
      steps: {
        1: { title: 'Escalfar las Peras Suavemente', instruction: 'Cuece las peras bajo papel en almíbar de vainilla y limón hasta que estén tiernas.', timerLabel: 'Escalfar peras' },
        2: { title: 'Reducir Almíbar y Batir Frangipane', instruction: 'Reduce el jarabe a ámbar mientras bates mantequilla, azúcar, huevos y almendra.', timerLabel: 'Reducir glaseado' },
        3: { title: 'Disponer Peras y Almendras', instruction: 'Extiende la frangipane en la base y acomoda las peras en abanico.', timerLabel: 'Montar tarta' },
        4: { title: 'Hornear y Barnizar en Caliente', instruction: 'Hornea a 180°C hasta dorar y pinta enseguida con el almíbar y tomillo.', timerLabel: 'Hornear tarta' },
      },
    },
    'burnt-honey-fig-millefeuille': {
      title: 'Milhojas de Miel Tostada e Higos Asados',
      subtitle: 'Hojaldre caramelizado con crema diplomática de vainilla',
      region: 'París',
      season: 'Otoño Tardío',
      figureCaption: 'Fig. 6 — Hojaldre caramelizado con crema de vainilla e higos a la miel.',
      storyExcerpt: 'Hornear el hojaldre prensado entre dos bandejas produce láminas planas y vítreas que crujen limpiamente.',
      storyParagraphs: [
        'Un buen milhojas no aplasta su crema al cortarlo; horneado con peso y azúcar glas queda crujiente y fino.',
        'Se intercala con crema diplomática ligera e higos negros asados con miel oscura llevada casi al punto ahumado.',
      ],
      pullQuote: '«Lleva la miel un tono más oscuro de lo cómodo; ese toque amargo despierta la vainilla.»',
      pairingNote: 'Acompaña con un espresso o un Bas-Armagnac añejo.',
      ingredients: {
        'puff-pastry': { name: 'Lámina de hojaldre de mantequilla fría', metricUnit: 'g', imperialUnit: 'oz' },
        'icing-sugar': { name: 'Azúcar glas para caramelizar', metricUnit: 'g', imperialUnit: 'taza' },
        'whole-milk': { name: 'Leche entera infusionada con vainilla', metricUnit: 'ml', imperialUnit: 'tazas' },
        'heavy-cream': { name: 'Nata fría para montar', metricUnit: 'ml', imperialUnit: 'taza' },
        'black-figs': { name: 'Higos negros maduros partidos', metricUnit: 'higos', imperialUnit: 'higos' },
        'wildflower-honey': { name: 'Miel oscura de castaño o flores', metricUnit: 'g', imperialUnit: 'cdas.' },
      },
      techniques: {
        'burnt-honey-caramel': {
          title: 'Miel Tostada al Limón',
          subtitle: 'Oscurecer la miel y detener la cocción en el punto justo',
          stages: [
            { title: 'Espuma Rápida', cue: 'Hierve la miel en cazo claro para vigilar el color.', heatSetting: 'Medio · 155°C' },
            { title: 'Corte Cítrico', cue: 'Al primer aroma ahumado detén con agua y zumo de limón.', heatSetting: 'Sin Fuego' },
          ],
        },
        'diplomat-fold': {
          title: 'Plegado de Crema Diplomática',
          subtitle: 'Integrar nata semimontada en crema pastelera fría',
          stages: [
            { title: 'Alisar la Pastelera', cue: 'Bate enérgicamente la crema fría hasta quedar sedosa.', heatSetting: 'Bol Frío · 8°C' },
            { title: 'Movimientos Envolventes', cue: 'Envuelve con espátula conservando el aire.', heatSetting: 'Frío' },
          ],
        },
      },
      steps: {
        1: { title: 'Hornear Hojaldre Prensado', instruction: 'Pincha el hojaldre, hornea entre dos bandejas a 195°C y carameliza con azúcar glas.', timerLabel: 'Hornear hojaldre' },
        2: { title: 'Asar Higos y Tostar la Miel', instruction: 'Oscurece la miel, frena con limón y asa los higos rociados con ella.', timerLabel: 'Asar higos' },
        3: { title: 'Preparar Crema Diplomática', instruction: 'Alisa la crema de vainilla y mezcla suavemente con la nata montada.', timerLabel: 'Enfriar crema' },
        4: { title: 'Cortar y Montar al Momento', instruction: 'Corta rectángulos, intercala tres capas de hojaldre con crema y corona con higos.', timerLabel: 'Montar milhojas' },
      },
    },
  },

  de: {
    'duck-confit-cassoulet': {
      title: 'Knuspriges Entenconfit auf Tarbais-Bohnen',
      subtitle: 'Karamellisierte Schalotten, frittierter Salbei und Knoblauchbrühe',
      region: 'Gascogne & Paris',
      season: 'Herbst',
      figureCaption: 'Abb. 1 — Kross gebratene Entenkeule auf cremigen Tarbais-Bohnen mit Salbei.',
      storyExcerpt: 'In einem kleinen Bistro am Canal Saint-Martin lag das Geheimnis darin, die Entenkeulen in einer völlig kalten Gusseisenpfanne zu starten.',
      storyParagraphs: [
        'Jeden November serviert Küchenchefin Henriette Delacroix breite Steingutschalen mit samtigen Tarbais-Bohnen und glasdünn knusprigem Entenconfit.',
        'Entscheidend ist der Start in der kalten Pfanne: So schmilzt das Fett gleichmäßig aus, ohne das Fleisch auszutrocknen.',
      ],
      pullQuote: '„Beginnen Sie mit einer kalten Eisenpfanne; Geduld verwandelt die Haut in bernsteinfarbene Spitze.“',
      pairingNote: 'Dazu passt ein kühler Cahors Malbec oder ein Chicoréesalat mit Walnussöl.',
      ingredients: {
        'duck-legs': { name: 'Gepökelte & gegarte Entenconfit-Keulen, trocken getupft', metricUnit: 'Keulen', imperialUnit: 'Keulen' },
        'tarbais-beans': { name: 'Gekochte weiße Tarbais-Bohnen mit Sud', metricUnit: 'g', imperialUnit: 'Tassen' },
        shallots: { name: 'Bananenschalotten, längs halbiert', metricUnit: 'Stück', imperialUnit: 'Stück' },
        garlic: { name: 'Knoblauchzehen, leicht angedrückt', metricUnit: 'Zehen', imperialUnit: 'Zehen' },
        'chicken-stock': { name: 'Kräftiger Geflügelfond', metricUnit: 'ml', imperialUnit: 'Tasse' },
        'sage-leaves': { name: 'Frische ganze Salbeiblätter', metricUnit: 'Blätter', imperialUnit: 'Blätter' },
        thyme: { name: 'Frische Thymianzweige', metricUnit: 'Zweige', imperialUnit: 'Zweige' },
        butter: { name: 'Kalte ungesalzene Butter in Würfeln', metricUnit: 'g', imperialUnit: 'EL' },
      },
      techniques: {
        'confit-cold-render': {
          title: 'Kalt-Auslassen & Knuspersalbei',
          subtitle: 'Langsames Auslassen für glasartig krosse Haut',
          stages: [
            { title: 'Kalter Pfannenstart', cue: 'Keulen mit der Haut nach unten in die kalte Pfanne legen.', heatSetting: 'Niedrig-Mittel · 140°C' },
            { title: 'Goldenes Brutzeln', cue: 'Gleichmäßig braten und leicht mit dem Pfannenwender andrücken.', heatSetting: 'Mittel · 165°C' },
            { title: 'Salbei-Finish', cue: 'Salbeiblätter 20 Sekunden im heißen Entenfett knusprig backen.', heatSetting: 'Mittel · 175°C' },
          ],
        },
        'shallot-glaze-emulsion': {
          title: 'Bohnensud-Reduktion & Butterglanz',
          subtitle: 'Stärkehaltigen Sud mit kalter Butter binden',
          stages: [
            { title: 'Schalotten Karamelisieren', cue: 'Halbierte Schalotten auf der Schnittfläche tiefbraun braten.', heatSetting: 'Mittel · 170°C' },
            { title: 'Sanftes Köcheln', cue: 'Fond und Bohnen zugeben und ruhig einkochen lassen.', heatSetting: 'Simmern · 95°C' },
            { title: 'Aufmontieren', cue: 'Abseits der Hitze kalte Butter einschwenken.', heatSetting: 'Ohne Hitze' },
          ],
        },
      },
      steps: {
        1: { title: 'Keulen Abtrocknen & Temperieren', instruction: 'Überschüssiges Fett abwischen, Haut sehr trocken tupfen und in eine kalte Gusseisenpfanne legen.', timerLabel: 'Trocknen & Ruhen' },
        2: { title: 'Langsam Knusprig Braten', instruction: 'Bei mittlerer bis niedriger Hitze braten, bis die Haut tief bernsteinfarben und kross ist.', timerLabel: 'Haut kross braten' },
        3: { title: 'Schalotten & Salbei Braten', instruction: 'Ente warmstellen. Schalotten, Knoblauch und Thymian bräunen, dann Salbei ausbacken.', timerLabel: 'Schalotten bräunen' },
        4: { title: 'Bohnen im Fond Köcheln', instruction: 'Mit Geflügelfond ablöschen und Bohnen samt Sud sämig einkochen.', timerLabel: 'Bohnen köcheln' },
        5: { title: 'Mit Butter Binden & Servieren', instruction: 'Kalte Butter unterschwenken, Bohnen anrichten und Ente samt Salbei auflegen.', timerLabel: 'Ruhen & Anrichten' },
      },
    },
    'chanterelle-buckwheat-galette': {
      title: 'Pfifferling-Buchweizen-Galette mit gereiftem Comté',
      subtitle: 'Blättriger Mürbeteig, Thymian-Waldpilze und Nussbutter',
      region: 'Jura & Bretagne',
      season: 'Herbst',
      figureCaption: 'Abb. 2 — Rustikale Buchweizen-Galette mit gerösteten Pfifferlingen und Comté.',
      storyExcerpt: 'Buchweizen verleiht kaltem Butterteig eine geröstete Haselnussnote für Waldpilze und Alpenkäse.',
      storyParagraphs: [
        'Eine freie Galette verzeiht alles und rahmt 18 Monate gereiften Comté mit Zitronenthymian perfekt ein.',
        'Pilze müssen vorab in einer Schicht trocken angebraten werden, damit der Boden knusprig bleibt.',
      ],
      pullQuote: '„Überfüllen Sie die Pfanne nie mit Waldpilzen; jeder Pfifferling braucht Platz zum Rösten.“',
      pairingNote: 'Dazu passt ein trockener Jura Savagnin oder herber Cidre.',
      ingredients: {
        'pastry-flour': { name: 'Feines Weizenmehl', metricUnit: 'g', imperialUnit: 'Tassen' },
        'buckwheat-flour': { name: 'Geröstetes Buchweizenmehl', metricUnit: 'g', imperialUnit: 'Tasse' },
        'cold-butter': { name: 'Kalte gesalzene Butter in Würfeln', metricUnit: 'g', imperialUnit: 'EL' },
        chanterelles: { name: 'Frische Pfifferlinge & braune Champignons', metricUnit: 'g', imperialUnit: 'lb' },
        'comte-cheese': { name: 'Gereifter Comté-Käse, grob gerieben', metricUnit: 'g', imperialUnit: 'Tassen' },
        'creme-fraiche': { name: 'Dicke Crème fraîche', metricUnit: 'g', imperialUnit: 'Tasse' },
        'egg-yolk': { name: 'Eigelb verquirlt mit 1 EL Sahne', metricUnit: 'Eigelb', imperialUnit: 'Eigelb' },
      },
      techniques: {
        'galette-dough-fold': {
          title: 'Fraisage & Rustikaler Faltenrand',
          subtitle: 'Kalte Butterflocken zu blättrigen Schichten verarbeiten',
          stages: [
            { title: 'Butterplättchen', cue: 'Kalte Butter flach drücken, ohne sie anzuwärmen.', heatSetting: 'Kühler Marmor · 16°C' },
            { title: 'Fraisage mit dem Handballen', cue: 'Teig einmal über Backpapier verstreichen.', heatSetting: 'Kühle Fläche' },
            { title: 'Überlappendes Falten', cue: '4 cm Rand rundum fest einschlagen.', heatSetting: 'Raumtemp.' },
          ],
        },
        'mushroom-dry-sear': {
          title: 'Scharfes Pilz-Anbraten',
          subtitle: 'Pilzfeuchtigkeit restlos verdampfen',
          stages: [
            { title: 'Gleichmäßiges Zupfen', cue: 'Große Pfifferlinge längs teilen.', heatSetting: 'Schneidebrett' },
            { title: 'Einlagiges Braten', cue: '2 Minuten ungestört bräunen, dann Thymian zugeben.', heatSetting: 'Hoch · 205°C' },
          ],
        },
      },
      steps: {
        1: { title: 'Buchweizenteig Kneten & Kühlen', instruction: 'Kalte Butter mit Mehlen und Salz verreiben, Eiswasser zugeben und kaltstellen.', timerLabel: 'Teig kühlen' },
        2: { title: 'Pilze Nussig Braten', instruction: 'Pilze einlagig in heißer Butter trocken und goldbraun braten.', timerLabel: 'Pfifferlinge braten' },
        3: { title: 'Ausrollen, Belegen & Falten', instruction: 'Auf 34 cm ausrollen, mit Crème fraîche bestreichen, Comté und Pilze auflegen und Rand falten.', timerLabel: 'Rand kühlen' },
        4: { title: 'Goldbraun Backen', instruction: 'Rand mit Eigelb bestreichen und bei 205°C kross backen.', timerLabel: 'Galette backen' },
      },
    },
    'sea-bass-saffron-fennel': {
      title: 'Krosser Wolfsbarsch mit Fenchel & Safran-Beurre Blanc',
      subtitle: 'Eingeritzte Haut, geröstete Zitrone und Weißwein-Reduktion',
      region: 'Côte d’Azur',
      season: 'Winter',
      figureCaption: 'Abb. 3 — Wolfsbarsch auf geschmortem Babyfenchel in Safran-Beurre Blanc.',
      storyExcerpt: 'Ein Küstenklassiker lebt vom Kontrast zwischen splitterkrosser Fischhaut und warmer Safranbutter.',
      storyParagraphs: [
        'Babyfenchel wird in Wermut zart geschmort und warmgehalten.',
        'Die Beurre blanc verlangt niedrigste Hitze, damit kalte Butterwürfel seidig emulgieren.',
      ],
      pullQuote: '„Drücken Sie das Filet zwanzig Sekunden sanft an—knusprige Fischhaut entsteht in Stille.“',
      pairingNote: 'Servieren Sie dazu einen mineralischen Chablis oder Vermentino.',
      ingredients: {
        'sea-bass': { name: 'Wilde Wolfsbarschfilets mit Haut', metricUnit: 'g', imperialUnit: 'oz' },
        'baby-fennel': { name: 'Baby-Fenchelknollen geviertelt', metricUnit: 'Knollen', imperialUnit: 'Knollen' },
        saffron: { name: 'Safranfäden in warmem Wein eingeweicht', metricUnit: 'TL', imperialUnit: 'TL' },
        'dry-white-wine': { name: 'Trockener Weißwein oder Wermut', metricUnit: 'ml', imperialUnit: 'Tasse' },
        'cold-butter-cubes': { name: 'Kalte ungesalzene Butter in Würfeln', metricUnit: 'g', imperialUnit: 'EL' },
        'meyer-lemon': { name: 'Meyer-Zitrone halbiert', metricUnit: 'Stück', imperialUnit: 'Stück' },
      },
      techniques: {
        'saffron-beurre-blanc': {
          title: 'Safran-Beurre-Blanc-Emulsion',
          subtitle: 'Kalte Butter stabil in warme Weinreduktion einrühren',
          stages: [
            { title: 'Aromareduktion', cue: 'Schalotte, Wein und Safran auf 2 EL einkochen.', heatSetting: 'Mittel · 100°C' },
            { title: 'Butter Einarbeiten', cue: 'Bei kleinster Flamme jeweils 2 kalte Würfel einrühren.', heatSetting: 'Niedrig · 62°C' },
            { title: 'Löffelprobe', cue: 'Die Sauce überzieht den Löffelrücken glänzend.', heatSetting: 'Warmhalten · 58°C' },
          ],
        },
        'fish-skin-sear': {
          title: 'Plan-Anbraten auf der Haut',
          subtitle: 'Leicht einritzen und beschweren für gleichmäßige Kruste',
          stages: [
            { title: 'Flache Schnitte', cue: 'Haut 3-mal einritzen, ohne ins Fleisch zu schneiden.', heatSetting: 'Brett' },
            { title: '20-Sekunden-Druck', cue: 'Sofort beim Einlegen sanft mit dem Fischheber andrücken.', heatSetting: 'Mittel-Hoch · 190°C' },
          ],
        },
      },
      steps: {
        1: { title: 'Fenchelviertel Schmoren', instruction: 'Fenchel goldbraun anbraten und mit Weißwein zugedeckt weich schmoren.', timerLabel: 'Fenchel schmoren' },
        2: { title: 'Safran & Wein Einkochen', instruction: 'Restlichen Wein mit Safran und Schalotte sirupartig einkochen.', timerLabel: 'Safran reduzieren' },
        3: { title: 'Wolfsbarsch auf der Haut Braten', instruction: 'Haut einritzen, salzen, 4 Min auf der Haut braten und 45 Sek wenden.', timerLabel: 'Fisch braten' },
        4: { title: 'Zitrone Rösten & Sauce Aufschlagen', instruction: 'Kalte Butter in die Safranreduktion schlagen und sofort servieren.', timerLabel: 'Sauce montieren' },
      },
    },
    'heirloom-copper-bouillabaisse': {
      title: 'Bouillabaisse aus dem Kupfertopf & Safran-Rouille',
      subtitle: 'Miesmuscheln, Garnelen, Safran-Tomatenfond und Knoblauchbrot',
      region: 'Marseille',
      season: 'Winter',
      figureCaption: 'Abb. 4 — Safran-Bouillabaisse im Kupfertopf mit gerösteter Rouille.',
      storyExcerpt: 'Echte Bouillabaisse folgt einer genauen Reihenfolge: erst fester Fisch, dann Garnelen, zuletzt die Muscheln.',
      storyParagraphs: [
        'Fenchelsaat, Orangenschale, Lauch, Tomate und Safran bilden das unvergessliche Fundament.',
        'Ein ruhiges Simmern statt wilden Kochens hält Fisch und Meeresfrüchte zart.',
      ],
      pullQuote: '„Kocht man Fischsuppe stark, wird der Fisch zäh; lassen Sie den Sud nur leise zittern.“',
      pairingNote: 'Ein gekühlter Bandol Rosé balanciert die Knoblauch-Rouille.',
      ingredients: {
        'white-fish': { name: 'Fester weißer Seefisch in Stücken', metricUnit: 'g', imperialUnit: 'lb' },
        'black-mussels': { name: 'Frische Miesmuscheln, geputzt', metricUnit: 'g', imperialUnit: 'lb' },
        'wild-prawns': { name: 'Wilde Riesengarnelen mit Kopf', metricUnit: 'Stück', imperialUnit: 'Stück' },
        'fish-stock': { name: 'Aromatischer Fischfond', metricUnit: 'ml', imperialUnit: 'Tassen' },
        'fennel-orange': { name: 'Lauch, Fenchel & 1 Streifen Orangenschale', metricUnit: 'g', imperialUnit: 'Tassen' },
        'tomato-paste': { name: 'Tomatenmark & gehackte Tomaten', metricUnit: 'g', imperialUnit: 'Tasse' },
        'rouille-base': { name: 'Safran-Knoblauch-Rouille & Baguette', metricUnit: 'g', imperialUnit: 'Tasse' },
      },
      techniques: {
        'bouillabaisse-emulsion': {
          title: 'Safran-Rouille aus dem Mörser',
          subtitle: 'Dicke Knoblauch-Safran-Emulsion für geröstetes Brot',
          stages: [
            { title: 'Würzpaste', cue: 'Knoblauch, Cayenne, Safran und Eigelb glatt reiben.', heatSetting: 'Kalter Mörser' },
            { title: 'Öl-Emulsion', cue: 'Olivenöl tropfenweise einrühren, bis die Creme steht.', heatSetting: 'Raumtemp.' },
          ],
        },
      },
      steps: {
        1: { title: 'Lauch, Fenchel & Tomate Anschwitzen', instruction: 'Gemüse und Orangenschale sanft anschwitzen, Tomatenmark kurz mitrösten.', timerLabel: 'Basis anschwitzen' },
        2: { title: 'Safranfond Ziehen Lassen', instruction: 'Fischfond, Tomaten und Safran aufkochen und 15 Min sanft simmern.', timerLabel: 'Fond ziehen' },
        3: { title: 'Fisch Pochieren & Rouille Rühren', instruction: 'Fischstücke behutsam einlegen, während Rouille und Crostini vorbereitet werden.', timerLabel: 'Fisch pochieren' },
        4: { title: 'Garnelen & Muscheln Dämpfen', instruction: 'Garnelen und Muscheln zugeben und zugedeckt garen, bis alle Schalen öffnen.', timerLabel: 'Schalentiere garen' },
      },
    },
    'poached-pear-frangipane-tart': {
      title: 'Pochierte Birnen- & Mandel-Frangipane-Tarte',
      subtitle: 'Mürbeteigboden, geröstete Mandelcreme und Thymian-Sirup',
      region: 'Lyon & Loire',
      season: 'Herbst',
      figureCaption: 'Abb. 5 — Pochierte Bosc-Birnen auf Mandel-Frangipane mit Thymiansirup.',
      storyExcerpt: 'Vorgekochte Bosc-Birnen verhindern wässrige Stellen und liefern direkt den Sirup für die glänzende Glasur.',
      storyParagraphs: [
        'Rohe Birnen geben beim Backen Wasser ab; unter Backpapier im Vanille-Gewürzsud gegart bleiben sie perfekt in Form.',
        'Der eingekochte Sud verleiht der warmen Tarte ihren goldenen Spiegelglanz.',
      ],
      pullQuote: '„Heben Sie den Pochiersirup auf—eingekocht trägt er das ganze Aroma des Obstgartens.“',
      pairingNote: 'Lauwarm mit Crème fraîche und einer Spätlese Chenin Blanc genießen.',
      ingredients: {
        'bosc-pears': { name: 'Feste Bosc-Birnen, geschält & halbiert', metricUnit: 'Birnen', imperialUnit: 'Birnen' },
        'almond-flour': { name: 'Fein gemahlene blanchierte Mandeln', metricUnit: 'g', imperialUnit: 'Tassen' },
        'soft-butter': { name: 'Weiche ungesalzene Butter', metricUnit: 'g', imperialUnit: 'EL' },
        'caster-sugar': { name: 'Feiner Zucker', metricUnit: 'g', imperialUnit: 'Tasse' },
        eggs: { name: 'Große Eier, zimmerwarm', metricUnit: 'Eier', imperialUnit: 'Eier' },
        'tart-shell': { name: 'Blindgebackener Mürbeteigboden (24 cm)', metricUnit: 'Boden', imperialUnit: 'Boden' },
        'flaked-almonds': { name: 'Geröstete Mandelblättchen & frischer Thymian', metricUnit: 'g', imperialUnit: 'Tasse' },
      },
      techniques: {
        'pear-syrup-reduction': {
          title: 'Bernsteinfarbene Sirupreduktion',
          subtitle: 'Pochierflüssigkeit zu glänzender Patisserieglasur einkochen',
          stages: [
            { title: 'Cartouche-Pochieren', cue: 'Birnen mit Backpapierscheibe bedecken, damit sie gleichmäßig ziehen.', heatSetting: 'Sanft · 92°C' },
            { title: 'Sirup Einkochen', cue: 'Abgeseihte Flüssigkeit dicklich und glänzend einkochen.', heatSetting: 'Mittel-Hoch · 108°C' },
          ],
        },
      },
      steps: {
        1: { title: 'Birnen Sanft Pochieren', instruction: 'Birnenhälften unter Backpapier im Vanille-Zitrone-Sud weich garen.', timerLabel: 'Birnen pochieren' },
        2: { title: 'Sirup Einkochen & Creme Rühren', instruction: 'Sirup reduzieren und Butter, Zucker, Eier sowie Mandeln schaumig rühren.', timerLabel: 'Sirup einkochen' },
        3: { title: 'Birnen Fächern & Einsetzen', instruction: 'Frangipane einstreichen und Birnen fächerförmig aufsetzen.', timerLabel: 'Tarte füllen' },
        4: { title: 'Backen & Warm Glasieren', instruction: 'Bei 180°C goldbraun backen und direkt mit warmem Sirup und Thymian bestreichen.', timerLabel: 'Birnentarte backen' },
      },
    },
    'burnt-honey-fig-millefeuille': {
      title: 'Mille-Feuille mit Gebranntem Honig & Gerösteten Feigen',
      subtitle: 'Karamellisierter Blätterteig mit Vanille-Diplomatencreme',
      region: 'Paris',
      season: 'Spätherbst',
      figureCaption: 'Abb. 6 — Karamellisierter Blätterteig mit Vanillecreme und Honigfeigen.',
      storyExcerpt: 'Zwischen zwei Backblechen gebackener Blätterteig wird flach und glasartig knusprig.',
      storyParagraphs: [
        'Ein perfektes Mille-Feuille zerdrückt seine Creme nicht. Mit Puderzucker karamellisiert splittert der Teig sauber.',
        'Dazu kommen Vanille-Diplomatencreme und schwarze Feigen in dunkel gebranntem Kastanienhonig.',
      ],
      pullQuote: '„Lassen Sie den Honig eine Nuance dunkler werden—diese Herbe weckt die Vanille.“',
      pairingNote: 'Mit Espresso oder altem Bas-Armagnac servieren.',
      ingredients: {
        'puff-pastry': { name: 'Kalter Butter-Blätterteig', metricUnit: 'g', imperialUnit: 'oz' },
        'icing-sugar': { name: 'Puderzucker zum Karamellisieren', metricUnit: 'g', imperialUnit: 'Tasse' },
        'whole-milk': { name: 'Vollmilch mit 1 Vanilleschote', metricUnit: 'ml', imperialUnit: 'Tassen' },
        'heavy-cream': { name: 'Kalte Schlagsahne', metricUnit: 'ml', imperialUnit: 'Tasse' },
        'black-figs': { name: 'Reife schwarze Feigen, halbiert', metricUnit: 'Feigen', imperialUnit: 'Feigen' },
        'wildflower-honey': { name: 'Dunkler Blüten- oder Kastanienhonig', metricUnit: 'g', imperialUnit: 'EL' },
      },
      techniques: {
        'burnt-honey-caramel': {
          title: 'Gebrannter Honig',
          subtitle: 'Honig bis zur rauchigen Kastanienfarbe kochen und mit Zitrone stoppen',
          stages: [
            { title: 'Honigschaum', cue: 'Im hellen Topf erhitzen, um die Farbänderung genau zu verfolgen.', heatSetting: 'Mittel · 155°C' },
            { title: 'Aromatisches Ablöschen', cue: 'Sobald feiner Rauch aufsteigt, mit Wasser und Zitronensaft stoppen.', heatSetting: 'Ohne Hitze' },
          ],
        },
        'diplomat-fold': {
          title: 'Diplomatencreme Unterheben',
          subtitle: 'Geschlagene Sahne luftig in Vanillepudding ziehen',
          stages: [
            { title: 'Creme Glattrühren', cue: 'Gekühlte Konditorcreme vorab glatt rühren.', heatSetting: 'Kalte Schüssel · 8°C' },
            { title: 'Sanftes Unterheben', cue: 'Mit dem Teigschaber locker unterziehen.', heatSetting: 'Gekühlt' },
          ],
        },
      },
      steps: {
        1: { title: 'Karamellisierten Blätterteig Backen', instruction: 'Teig einstechen, unter zweitem Blech bei 195°C backen und mit Puderzucker karamellisieren.', timerLabel: 'Blätterteig backen' },
        2: { title: 'Feigen Rösten & Honig Brennen', instruction: 'Honig dunkel karamellisieren, ablöschen und Feigen darin kurz rösten.', timerLabel: 'Feigen rösten' },
        3: { title: 'Vanille-Diplomatencreme Mischen', instruction: 'Konditorcreme glattrühren und Schlagsahne unterheben.', timerLabel: 'Creme kühlen' },
        4: { title: 'Schneiden & Frisch Schichten', instruction: 'Rechtecke schneiden, drei Schichten mit Creme füllen und mit Feigen krönen.', timerLabel: 'Törtchen schichten' },
      },
    },
  },

  it: {
    'duck-confit-cassoulet': {
      title: 'Confit d’Anatra Croccante su Fagioli Tarbais',
      subtitle: 'Scalogni caramellati, salvia fritta e brodo leggero all’aglio',
      region: 'Guascogna & Parigi',
      season: 'Autunno',
      figureCaption: 'Fig. 1 — Coscia d’anatra croccante su fagioli Tarbais cremosi con salvia.',
      storyExcerpt: 'In un piccolo bistrot lungo il Canal Saint-Martin, il segreto stava nell’iniziare la cottura delle cosce in padella di ghisa completamente fredda.',
      storyParagraphs: [
        'Ogni novembre, la chef Henriette Delacroix serve scodelle di gres con setosi fagioli bianchi Tarbais stufati con erbe aromatiche e cosce d’anatra confit croccanti come vetro.',
        'Il gesto decisivo è partire a freddo: il grasso si scioglie lentamente in oro liquido senza asciugare la carne.',
      ],
      pullQuote: '«Partite sempre da una padella di ghisa fredda; lasciate che la pazienza trasformi la pelle in merletto d’ambra.»',
      pairingNote: 'Servite con un Cahors Malbec fresco o insalata di cicoria all’olio di noci.',
      ingredients: {
        'duck-legs': { name: 'Cosce d’anatra confit ben asciugate', metricUnit: 'cosce', imperialUnit: 'cosce' },
        'tarbais-beans': { name: 'Fagioli bianchi Tarbais cotti con brodo', metricUnit: 'g', imperialUnit: 'tazze' },
        shallots: { name: 'Scalogni lunghi tagliati a metà', metricUnit: 'pezzi', imperialUnit: 'pezzi' },
        garlic: { name: 'Spicchi d’aglio schiacciati', metricUnit: 'spicchi', imperialUnit: 'spicchi' },
        'chicken-stock': { name: 'Brodo ricco di pollame arrosto', metricUnit: 'ml', imperialUnit: 'tazza' },
        'sage-leaves': { name: 'Foglie intere di salvia fresca', metricUnit: 'foglie', imperialUnit: 'foglie' },
        thyme: { name: 'Rametti di timo fresco', metricUnit: 'rametti', imperialUnit: 'rametti' },
        butter: { name: 'Burro freddo non salato a cubetti', metricUnit: 'g', imperialUnit: 'cucchiai' },
      },
      techniques: {
        'confit-cold-render': {
          title: 'Rosolatura a Freddo & Salvia',
          subtitle: 'Sciogliere il grasso dolcemente per pelle croccante',
          stages: [
            { title: 'Avvio in Ghisa Fredda', cue: 'Disponete le cosce dalla parte della pelle senza preriscaldare.', heatSetting: 'Basso-Medio · 140°C' },
            { title: 'Doratura Uniforme', cue: 'Premete delicatamente con la spatola mentre rosolano.', heatSetting: 'Medio · 165°C' },
            { title: 'Salvia Croccante', cue: 'Friggete la salvia 20 secondi nel grasso dorato.', heatSetting: 'Medio · 175°C' },
          ],
        },
        'shallot-glaze-emulsion': {
          title: 'Riduzione del Brodo & Mantecatura',
          subtitle: 'Legare il fondo dei fagioli con burro freddo',
          stages: [
            { title: 'Scalogni Caramellati', cue: 'Rosolate gli scalogni dal lato tagliato fino al color mogano.', heatSetting: 'Medio · 170°C' },
            { title: 'Sobbollire Dolcemente', cue: 'Unite brodo e fagioli senza mescolare con forza.', heatSetting: 'Dolce · 95°C' },
            { title: 'Mantecatura Fuori Fuoco', cue: 'Unite il burro freddo lontano dalla fiamma.', heatSetting: 'Fuori Fuoco' },
          ],
        },
      },
      steps: {
        1: { title: 'Asciugare & Temperare le Cosce', instruction: 'Rimuovete il grasso in eccesso, asciugate benissimo la pelle e mettete in ghisa fredda.', timerLabel: 'Asciugatura' },
        2: { title: 'Rosolare Lento Fino a Croccantezza', instruction: 'Cuocete a fuoco medio-basso finché la pelle diventa ambrata e croccante; girate 2 minuti.', timerLabel: 'Pelle croccante' },
        3: { title: 'Caramellare Scalogni & Salvia', instruction: 'Tenete in caldo l’anatra; dorate scalogni, aglio e timo, poi friggete la salvia.', timerLabel: 'Scalogni dorati' },
        4: { title: 'Sobbollire i Fagioli nel Brodo', instruction: 'Sfumate col brodo e riducete dolcemente insieme ai fagioli.', timerLabel: 'Cottura fagioli' },
        5: { title: 'Mantecare & Servire', instruction: 'Fuori dal fuoco mantecate con burro freddo, impiattate nei piatti fondi e adagiate l’anatra.', timerLabel: 'Riposo & servizio' },
      },
    },
    'chanterelle-buckwheat-galette': {
      title: 'Galette di Grano Saraceno ai Finferli e Comté',
      subtitle: 'Sfoglia rustica macinata a pietra, funghi al timo e burro nocciola',
      region: 'Giura & Bretagna',
      season: 'Autunno',
      figureCaption: 'Fig. 2 — Galette rustica ripiegata su finferli arrosto e Comté stagionato.',
      storyExcerpt: 'Il grano saraceno dona un calore di nocciola tostata perfetto per funghi di bosco e formaggi alpini.',
      storyParagraphs: [
        'La galette libera accoglie senza sforzo il Comté 18 mesi insieme ai finferli profumati al timo.',
        'I funghi vanno scottati in padella in un solo strato affinché perdano tutta l’acqua prima del forno.',
      ],
      pullQuote: '«Non affollate mai i funghi in padella; date a ogni finferlo spazio per dorarsi asciutto.»',
      pairingNote: 'Abbinate a un Savagnin del Giura o sidro secco.',
      ingredients: {
        'pastry-flour': { name: 'Farina per sfoglia', metricUnit: 'g', imperialUnit: 'tazze' },
        'buckwheat-flour': { name: 'Farina tostata di grano saraceno', metricUnit: 'g', imperialUnit: 'tazza' },
        'cold-butter': { name: 'Burro salato molto freddo a cubetti', metricUnit: 'g', imperialUnit: 'cucchiai' },
        chanterelles: { name: 'Finferli selvatici e funghi puliti', metricUnit: 'g', imperialUnit: 'lb' },
        'comte-cheese': { name: 'Formaggio Comté stagionato grattugiato', metricUnit: 'g', imperialUnit: 'tazze' },
        'creme-fraiche': { name: 'Crème fraîche densa', metricUnit: 'g', imperialUnit: 'tazza' },
        'egg-yolk': { name: 'Tuorlo sbattuto con 1 cucchiaio di panna', metricUnit: 'tuorlo', imperialUnit: 'tuorlo' },
      },
      techniques: {
        'galette-dough-fold': {
          title: 'Fraisage & Pieghe della Galette',
          subtitle: 'Schiacciare il burro freddo per creare sfogliatura',
          stages: [
            { title: 'Lamelle di Burro', cue: 'Schiacciate i cubetti freddi senza scaldarli.', heatSetting: 'Marmo Freddo · 16°C' },
            { title: 'Fraisage con il Palmo', cue: 'Strisciate l’impasto su carta forno in nastri sottili.', heatSetting: 'Piano Freddo' },
            { title: 'Pieghe Sovrapposte', cue: 'Ripiegate un bordo di 4 cm sigillando bene.', heatSetting: 'Temp. Ambiente' },
          ],
        },
        'mushroom-dry-sear': {
          title: 'Scottatura Viva dei Finferli',
          subtitle: 'Evaporare l’umidità prima della farcitura',
          stages: [
            { title: 'Taglio Regolare', cue: 'Dividete a mano i finferli grandi per il lungo.', heatSetting: 'Tagliere' },
            { title: 'Un Solo Strato', cue: 'Dorate 2 minuti senza girare, poi unite il timo.', heatSetting: 'Forte · 205°C' },
          ],
        },
      },
      steps: {
        1: { title: 'Impastare & Raffreddare', instruction: 'Sabbiate farine, sale e burro freddo, legate con acqua ghiacciata e fate riposare.', timerLabel: 'Raffreddare pasta' },
        2: { title: 'Scottare i Funghi', instruction: 'Rosolate i funghi in burro caldo a fiamma viva finché asciutti.', timerLabel: 'Scottare finferli' },
        3: { title: 'Stendere, Farcire & Piegare', instruction: 'Stendete a 34 cm, spalmate la crème fraîche, aggiungete Comté e funghi e piegate il bordo.', timerLabel: 'Riposo forma' },
        4: { title: 'Cuocere Fino a Doratura', instruction: 'Spennellate con tuorlo e infornate a 205°C finché ben dorata.', timerLabel: 'Cuocere galette' },
      },
    },
    'sea-bass-saffron-fennel': {
      title: 'Branzino Croccante con Finocchio e Beurre Blanc allo Zafferano',
      subtitle: 'Pelle incisa, limone arrostito e riduzione al vino bianco',
      region: 'Costa Azzurra',
      season: 'Inverno',
      figureCaption: 'Fig. 3 — Branzino croccante su finocchio brasato con beurre blanc allo zafferano.',
      storyExcerpt: 'Un grande classico costiero vive del contrasto fra pelle croccantissima e salsa tiepida allo zafferano.',
      storyParagraphs: [
        'I piccoli finocchi brasano lentamente nel vermouth secco fino a diventare tenerissimi.',
        'La beurre blanc richiede fuoco dolce per emulsionare il burro freddo senza impazzire.',
      ],
      pullQuote: '«Premete delicatamente per venti secondi all’inizio: la pelle croccante nasce nel silenzio.»',
      pairingNote: 'Servite con uno Chablis minerale o un Vermentino fresco.',
      ingredients: {
        'sea-bass': { name: 'Filetti di branzino selvatico con pelle', metricUnit: 'g', imperialUnit: 'oz' },
        'baby-fennel': { name: 'Finocchietti baby tagliati in quarti', metricUnit: 'bulbi', imperialUnit: 'bulbi' },
        saffron: { name: 'Pistilli di zafferano in vino tiepido', metricUnit: 'cucchiaino', imperialUnit: 'cucchiaino' },
        'dry-white-wine': { name: 'Vino bianco secco o vermouth', metricUnit: 'ml', imperialUnit: 'tazza' },
        'cold-butter-cubes': { name: 'Burro freddo non salato a cubetti', metricUnit: 'g', imperialUnit: 'cucchiai' },
        'meyer-lemon': { name: 'Limone Meyer tagliato a metà', metricUnit: 'pezzo', imperialUnit: 'pezzo' },
      },
      techniques: {
        'saffron-beurre-blanc': {
          title: 'Emulsione Beurre Blanc allo Zafferano',
          subtitle: 'Montare burro freddo nella riduzione tiepida',
          stages: [
            { title: 'Riduzione Aromatica', cue: 'Riducete scalogno, vino e zafferano a 2 cucchiai.', heatSetting: 'Medio · 100°C' },
            { title: 'Burro Freddo', cue: 'A fiamma minima frustate 2 cubetti alla volta.', heatSetting: 'Dolce · 62°C' },
            { title: 'Prova del Cucchiaio', cue: 'La salsa deve velare il dorso del cucchiaio.', heatSetting: 'Caldo · 58°C' },
          ],
        },
        'fish-skin-sear': {
          title: 'Scottatura Piana dalla Pelle',
          subtitle: 'Incidere e pressare per croccantezza uniforme',
          stages: [
            { title: 'Incisioni Leggere', cue: 'Incidete la pelle 3 volte senza tagliare la polpa.', heatSetting: 'Tagliere' },
            { title: 'Pressione 20 Secondi', cue: 'Tenete piatto il filetto con la spatola appena tocca l’olio.', heatSetting: 'Medio-Alto · 190°C' },
          ],
        },
      },
      steps: {
        1: { title: 'Brasare i Finocchi', instruction: 'Dorate i quarti di finocchio e brasate coperti con vino bianco.', timerLabel: 'Brasare finocchi' },
        2: { title: 'Ridurre Vino & Zafferano', instruction: 'Riducete il vino rimanente con zafferano e scalogno.', timerLabel: 'Ridurre zafferano' },
        3: { title: 'Cuocere il Branzino dalla Pelle', instruction: 'Incidete la pelle, salate, rosolate 4 min e girate 45 secondi.', timerLabel: 'Cuocere pesce' },
        4: { title: 'Arrostire Limone & Montare Salsa', instruction: 'Emulsionate il burro freddo nella base allo zafferano e servite subito.', timerLabel: 'Montare salsa' },
      },
    },
    'heirloom-copper-bouillabaisse': {
      title: 'Bouillabaisse in Pentola di Rame & Rouille',
      subtitle: 'Cozze, gamberoni, brodo allo zafferano e crostini all’aglio',
      region: 'Marsiglia',
      season: 'Inverno',
      figureCaption: 'Fig. 4 — Bouillabaisse allo zafferano in rame battuto con pane alla rouille.',
      storyExcerpt: 'La vera bouillabaisse si definisce dall’ordine di cottura: pesce sodo per primo, poi gamberi e infine cozze.',
      storyParagraphs: [
        'Nel porto di Marsiglia la base di finocchio, scorza d’arancia, porri, pomodoro e zafferano crea un brodo indimenticabile.',
        'Un leggero fremito mantiene teneri tutti i frutti di mare.',
      ],
      pullQuote: '«Se fate bollire forte la zuppa il pesce indurisce; tenete il brodo su un lieve brivido.»',
      pairingNote: 'Accompagnate con un Bandol Rosé ben freddo.',
      ingredients: {
        'white-fish': { name: 'Pesce bianco sodo a tranci', metricUnit: 'g', imperialUnit: 'lb' },
        'black-mussels': { name: 'Cozze fresche pulite', metricUnit: 'g', imperialUnit: 'lb' },
        'wild-prawns': { name: 'Gamberoni interi', metricUnit: 'pezzi', imperialUnit: 'pezzi' },
        'fish-stock': { name: 'Fumetto aromatico di pesce', metricUnit: 'ml', imperialUnit: 'tazze' },
        'fennel-orange': { name: 'Porro, finocchio e scorza d’arancia', metricUnit: 'g', imperialUnit: 'tazze' },
        'tomato-paste': { name: 'Concentrato e pomodori pelati', metricUnit: 'g', imperialUnit: 'tazza' },
        'rouille-base': { name: 'Rouille all’aglio e zafferano con baguette tostata', metricUnit: 'g', imperialUnit: 'tazza' },
      },
      techniques: {
        'bouillabaisse-emulsion': {
          title: 'Rouille al Mortaio',
          subtitle: 'Densa emulsione di aglio, zafferano e olio extravergine',
          stages: [
            { title: 'Pasta Aglio & Zafferano', cue: 'Pestate aglio, peperoncino, zafferano e tuorlo.', heatSetting: 'Mortaio Freddo' },
            { title: 'Olio a Filo', cue: 'Emulsionate goccia a goccia fino a consistenza soda.', heatSetting: 'Temp. Ambiente' },
          ],
        },
      },
      steps: {
        1: { title: 'Appassire Porri, Finocchio & Pomodoro', instruction: 'Stufate dolcemente gli aromi in olio e unite il concentrato.', timerLabel: 'Stufare base' },
        2: { title: 'Infondere il Fumetto allo Zafferano', instruction: 'Aggiungete brodo, pomodori e zafferano e sobbollite 15 minuti.', timerLabel: 'Cuocere brodo' },
        3: { title: 'Affogare il Pesce & Preparare Rouille', instruction: 'Cuocete dolcemente il pesce bianco mentre montate la rouille.', timerLabel: 'Cuocere pesce' },
        4: { title: 'Aprire Gamberi & Cozze', instruction: 'Unite gamberi e cozze, coprite e fate aprire i gusci.', timerLabel: 'Cuocere molluschi' },
      },
    },
    'poached-pear-frangipane-tart': {
      title: 'Crostata di Pere Sciroppate e Frangipane alle Mandorle',
      subtitle: 'Frolla scanalata, crema alle mandorle e glassa al timo',
      region: 'Lione & Loira',
      season: 'Autunno',
      figureCaption: 'Fig. 5 — Pere Bosc sciroppate cotte nella frangipane con glassa al timo.',
      storyExcerpt: 'Cuocere prima le pere nello sciroppo speziato evita sacche d’acqua e regala la glassa perfetta.',
      storyParagraphs: [
        'Le pere crude rilasciano succo in forno; sciroppate sotto carta forno con vaniglia e anice restano setose.',
        'Lo sciroppo ridotto lucida la crostata calda con foglie di timo fresco.',
      ],
      pullQuote: '«Conservate lo sciroppo di cottura: ridotto a glassa racchiude tutto il profumo del frutteto.»',
      pairingNote: 'Servite tiepida con crème fraîche e Chenin Blanc vendemmia tardiva.',
      ingredients: {
        'bosc-pears': { name: 'Pere Bosc sode, sbucciate e divise a metà', metricUnit: 'pere', imperialUnit: 'pere' },
        'almond-flour': { name: 'Farina fine di mandorle pelate', metricUnit: 'g', imperialUnit: 'tazze' },
        'soft-butter': { name: 'Burro morbido non salato', metricUnit: 'g', imperialUnit: 'cucchiai' },
        'caster-sugar': { name: 'Zucchero semolato fine', metricUnit: 'g', imperialUnit: 'tazza' },
        eggs: { name: 'Uova grandi a temperatura ambiente', metricUnit: 'uova', imperialUnit: 'uova' },
        'tart-shell': { name: 'Guscio di frolla cotto in bianco (24 cm)', metricUnit: 'guscio', imperialUnit: 'guscio' },
        'flaked-almonds': { name: 'Mandorle a lamelle e timo fresco', metricUnit: 'g', imperialUnit: 'tazza' },
      },
      techniques: {
        'pear-syrup-reduction': {
          title: 'Riduzione dello Sciroppo Ambrato',
          subtitle: 'Concentrare il liquido speziato in una glassa lucida',
          stages: [
            { title: 'Cottura sotto Cartouche', cue: 'Coprite con disco di carta per tenere immerse le pere.', heatSetting: 'Sobbollire · 92°C' },
            { title: 'Glassa Densa', cue: 'Bollite lo sciroppo filtrato fino a bolle lente e lucide.', heatSetting: 'Medio-Alto · 108°C' },
          ],
        },
      },
      steps: {
        1: { title: 'Sciroppare le Pere Dolcemente', instruction: 'Cuocete le pere nello sciroppo con vaniglia e limone sotto carta forno.', timerLabel: 'Sciroppare pere' },
        2: { title: 'Ridurre Sciroppo & Montare Frangipane', instruction: 'Riducete lo sciroppo mentre lavorate burro, zucchero, uova e mandorle.', timerLabel: 'Ridurre glassa' },
        3: { title: 'Disporre le Pere a Raggiera', instruction: 'Spalmate la frangipane nel guscio e adagiate le pere affettate.', timerLabel: 'Comporre crostata' },
        4: { title: 'Cuocere & Lucidare a Caldo', instruction: 'Infornate a 180°C fino a doratura e lucidate con sciroppo caldo e timo.', timerLabel: 'Cuocere crostata' },
      },
    },
    'burnt-honey-fig-millefeuille': {
      title: 'Millefoglie al Miele Bruciato & Fichi Arrostiti',
      subtitle: 'Sfoglia caramellata con crema diplomatica alla vaniglia',
      region: 'Parigi',
      season: 'Tardo Autunno',
      figureCaption: 'Fig. 6 — Sfoglia caramellata, crema diplomatica e fichi al miele.',
      storyExcerpt: 'Cuocere la sfoglia pressata fra due teglie crea lastre sottili e vetrose che si spezzano con precisione.',
      storyParagraphs: [
        'Una vera millefoglie non schiaccia mai la crema al taglio: cotta sotto peso con zucchero a velo resta leggera.',
        'Accompagnata da crema diplomatica e fichi neri arrostiti al miele scuro leggermente affumicato.',
      ],
      pullQuote: '«Portate il miele una sfumatura oltre il solito: quella nota amara risveglia la vaniglia.»',
      pairingNote: 'Servite con un espresso o un Bas-Armagnac invecchiato.',
      ingredients: {
        'puff-pastry': { name: 'Sfoglia al burro ben fredda', metricUnit: 'g', imperialUnit: 'oz' },
        'icing-sugar': { name: 'Zucchero a velo per caramellare', metricUnit: 'g', imperialUnit: 'tazza' },
        'whole-milk': { name: 'Latte intero in infusione di vaniglia', metricUnit: 'ml', imperialUnit: 'tazze' },
        'heavy-cream': { name: 'Panna fresca fredda da montare', metricUnit: 'ml', imperialUnit: 'tazza' },
        'black-figs': { name: 'Fichi neri maturi divisi a metà', metricUnit: 'fichi', imperialUnit: 'fichi' },
        'wildflower-honey': { name: 'Miele scuro di castagno o millefiori', metricUnit: 'g', imperialUnit: 'cucchiai' },
      },
      techniques: {
        'burnt-honey-caramel': {
          title: 'Miele Bruciato al Limone',
          subtitle: 'Caramellare il miele e arrestare la cottura al punto giusto',
          stages: [
            { title: 'Schiuma Rapida', cue: 'Cuocete in pentolino chiaro per seguire bene il colore.', heatSetting: 'Medio · 155°C' },
            { title: 'Arresto al Limone', cue: 'Al primo profumo fumé fermate con acqua e limone.', heatSetting: 'Fuori Fuoco' },
          ],
        },
        'diplomat-fold': {
          title: 'Crema Diplomatica Ariosa',
          subtitle: 'Incorporare panna montata nella pasticcera fredda',
          stages: [
            { title: 'Ammorbidire la Pasticcera', cue: 'Frustate bene la crema fredda prima di unire la panna.', heatSetting: 'Ciotola Fredda · 8°C' },
            { title: 'Movimenti Dal Basso', cue: 'Mescolate con spatola senza smontare l’aria.', heatSetting: 'Freddo' },
          ],
        },
      },
      steps: {
        1: { title: 'Cuocere Sfoglia Caramellata', instruction: 'Bucherellate la sfoglia, cuocete fra due teglie a 195°C e caramellate con zucchero a velo.', timerLabel: 'Cuocere sfoglia' },
        2: { title: 'Arrostire Fichi & Bruciare Miele', instruction: 'Scurite il miele, fermate col limone e arrostite brevemente i fichi.', timerLabel: 'Arrostire fichi' },
        3: { title: 'Unire la Crema Diplomatica', instruction: 'Lisciate la pasticcera alla vaniglia e incorporate la panna montata.', timerLabel: 'Raffreddare crema' },
        4: { title: 'Tagliare & Comporre al Momento', instruction: 'Ritagliate rettangoli croccanti, alternate crema e sfoglia e guarnite con i fichi.', timerLabel: 'Comporre dolce' },
      },
    },
  },
};

export function localizeRecipe(recipe: Recipe, lang: LanguageCode): Recipe {
  if (lang === 'en') return recipe;
  if (recipe.sourceType === 'ai-generated' || recipe.sourceType === 'ai-customized') {
    return recipe;
  }

  const patch = CURATED_PATCHES[lang]?.[recipe.id];
  if (!patch) return localizeExpandedRecipe(recipe, lang);

  return {
    ...recipe,
    title: patch.title,
    subtitle: patch.subtitle,
    region: patch.region,
    season: patch.season,
    figureCaption: patch.figureCaption,
    storyExcerpt: patch.storyExcerpt,
    storyParagraphs: patch.storyParagraphs,
    pullQuote: patch.pullQuote,
    pairingNote: patch.pairingNote,
    ingredients: recipe.ingredients.map((ing) => {
      const ingPatch = patch.ingredients[ing.id];
      if (!ingPatch) return ing;
      return {
        ...ing,
        name: ingPatch.name,
        metricUnit: ingPatch.metricUnit ?? ing.metricUnit,
        imperialUnit: ingPatch.imperialUnit ?? ing.imperialUnit,
      };
    }),
    techniques: recipe.techniques.map((tech) => {
      const techPatch = patch.techniques[tech.id];
      if (!techPatch) return tech;
      return {
        ...tech,
        title: techPatch.title,
        subtitle: techPatch.subtitle,
        stages: tech.stages.map((st, idx) => {
          const stPatch = techPatch.stages[idx];
          return stPatch ? { ...st, ...stPatch } : st;
        }),
      };
    }),
    steps: recipe.steps.map((step) => {
      const stepPatch = patch.steps[step.stepNumber];
      if (!stepPatch) return step;
      return {
        ...step,
        title: stepPatch.title,
        instruction: stepPatch.instruction,
        timerLabel: stepPatch.timerLabel ?? step.timerLabel,
        tip: stepPatch.tip ?? step.tip,
      };
    }),
  };
}
