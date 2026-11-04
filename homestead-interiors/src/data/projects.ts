/**
 * PORTFOLIO DATA
 * ------------------------------------------------------------------
 * Built from the photographs, renders and walkthrough video supplied by the
 * studio. Copy describes only what is visible in the imagery — no clients,
 * locations, dates or scope have been invented.
 *
 * Every image declares what it is, and the UI labels it honestly:
 *   kind: "photo"  → photograph of a finished space (no label)
 *   kind: "render" → 3D visualisation          (labelled "3D visualisation")
 *   kind: "site"   → construction / on-site     (labelled "On site")
 *
 * Images are never cropped anywhere on the site: every frame takes the photo's
 * own width/height ratio (from src/data/media.generated.ts).
 *
 * TO CONFIRM WITH THE STUDIO (see README → "Still needed"):
 *   - Final project names (titles below are descriptive working titles,
 *     except Sanjivani Hospital, whose name appears on the building).
 *   - Location, year and the studio's exact scope for each project.
 *
 * Adding a project: put images in /public/images/projects/<slug>/, run
 * `python3 scripts/build-media-manifest.py`, then add an entry below.
 */

export const projectCategories = [
  "Residential",
  "Living Spaces",
  "Bedrooms",
  "Kitchens",
  "Commercial",
  "Healthcare",
  "Education",
  "Dining",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];

export type ImageKind = "photo" | "render" | "site";

export type ProjectImage = {
  src: string;
  alt: string;
  caption?: string;
  kind: ImageKind;
};

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  /** One-line summary used on cards. */
  description: string;
  /** null = not yet confirmed; hidden in the UI. */
  location: string | null;
  cover: ProjectImage;
  introduction: string;
  concept: { heading: string; body: string };
  gallery: ProjectImage[];
  materials: { name: string; note: string }[];
  details: { label: string; value: string }[];
  finalImages: ProjectImage[];
  /** Optional walkthrough video (muted, looping). */
  video?: { src: string; poster: string; caption: string; width: number; height: number };
  /** Shown in the homepage "Selected work" grid. */
  featured?: boolean;
  /** true = illustrative sample, never a real completed project. */
  isSample: boolean;
};

const P = (slug: string, file: string) => `/images/projects/${slug}/${file}.jpg`;

const allProjects: Project[] = [
  {
    slug: "grey-marble-residence",
    title: "Grey Marble Residence",
    category: "Residential",
    description: "A completed home with grey marble floors, arched display niches, a tiered ceiling and a carved-door pooja room.",
    location: null,
    featured: true,
    cover: {
      src: P("grey-marble-residence", "kitchen-island"),
      alt: "Kitchen with a white quartz island, linen-finish cabinets, arched backlit niches and a tiered coffered ceiling above grey marble floors",
      kind: "photo",
    },
    introduction:
      "A finished residence photographed on completion: an expansive kitchen with an island and arched display niches, a pooja room behind carved double doors, a panelled staircase and a living room with a marble-look media wall — all set on polished grey marble.",
    concept: {
      heading: "Soft arches, layered light.",
      body: "Rounded arches repeat from the kitchen niches to the pooja-room doorway, and cove lighting traces every ceiling tier, so the rooms feel calm and connected.",
    },
    gallery: [
      {
        src: P("grey-marble-residence", "kitchen-arches"),
        alt: "Kitchen with arched backlit niches, teal-backed open shelving and a curved counter beneath a coffered ceiling",
        caption: "Kitchen & arched niches",
        kind: "photo",
      },
      {
        src: P("grey-marble-residence", "kitchen-counter"),
        alt: "L-shaped kitchen counter with linen-finish cabinets, a teal fluted backsplash and a cove-lit ceiling",
        caption: "Kitchen counter",
        kind: "photo",
      },
      {
        src: P("grey-marble-residence", "pooja-doors"),
        alt: "Arched white double doors carved with a mandala pattern, beside a backlit Om panel",
        caption: "Carved pooja-room doors",
        kind: "photo",
      },
      {
        src: P("grey-marble-residence", "pooja-room"),
        alt: "Pooja room seen through the open carved doors, with a lit mandala arch and red-draped altar shelves",
        caption: "Pooja room",
        kind: "photo",
      },
      {
        src: P("grey-marble-residence", "living-panel-wall"),
        alt: "Living room with a white marble-look media panel, floating console and timber-slat cabinets under a beamed ceiling",
        caption: "Living room",
        kind: "photo",
      },
      {
        src: P("grey-marble-residence", "staircase"),
        alt: "Staircase with panelled walls, textured wallpaper, framed artwork and track spotlights",
        caption: "Staircase",
        kind: "photo",
      },
    ],
    materials: [
      { name: "Grey marble flooring", note: "Polished, continuous through every room" },
      { name: "Linen-finish laminates", note: "Kitchen cabinetry" },
      { name: "Carved white doors", note: "Mandala-pattern pooja-room entrance" },
      { name: "Cove & track lighting", note: "Layered, warm light" },
    ],
    details: [{ label: "Imagery", value: "Completed-site photographs & walkthrough video" }],
    finalImages: [],
    video: {
      src: "/images/projects/grey-marble-residence/walkthrough.mp4",
      poster: "/videos/posters/grey-marble-walkthrough.jpg",
      caption: "Walkthrough from the hall to the pooja room",
      width: 960,
      height: 1706,
    },
    isSample: false,
  },
  {
    slug: "living-dining-residence",
    title: "Living & Dining Residence",
    category: "Living Spaces",
    description: "A bright open-plan living and dining room with walnut joinery, marble-look walls and layered ceiling light.",
    location: null,
    featured: true,
    cover: {
      src: P("living-dining-residence", "living-dining"),
      alt: "Living room with a white sofa, green velvet armchair and a marble-look wall with brass inlay lines, beside a walnut dining table",
      kind: "photo",
    },
    introduction:
      "An open living and dining space where a fluted media wall, a marble-look feature wall with brass inlays, a glowing display unit and a sculpted cove ceiling bring warmth to a calm, light palette.",
    concept: {
      heading: "Warm wood, soft light.",
      body: "Dark wood is used in a few strong moves — the media wall, the doors, the dining table — so the room stays bright. A curved cove ceiling, a crystal chandelier and backlit shelving wash the space in soft, even light from evening into night.",
    },
    gallery: [
      {
        src: P("living-dining-residence", "media-wall-dining"),
        alt: "Fluted media wall with a floating white console, the dining table and a backlit bar unit beyond",
        caption: "Media wall & dining",
        kind: "photo",
      },
      {
        src: P("living-dining-residence", "media-wall-curtains"),
        alt: "Media wall with lit display shelving, a green velvet armchair and sheer curtains over a large window",
        caption: "Media wall & window",
        kind: "photo",
      },
      {
        src: P("living-dining-residence", "chandelier-living"),
        alt: "Wide view of the living and dining room under a looped crystal chandelier and cove-lit ceiling",
        caption: "Chandelier & cove ceiling",
        kind: "photo",
      },
      {
        src: P("living-dining-residence", "dining"),
        alt: "Walnut dining table with upholstered chairs in front of a lit display unit",
        caption: "Dining",
        kind: "photo",
      },
      {
        src: P("living-dining-residence", "display-unit"),
        alt: "Backlit display unit with glass shelves, closed storage and a walnut door beside it",
        caption: "Display unit",
        kind: "photo",
      },
    ],
    materials: [
      { name: "Walnut-finish joinery", note: "Doors, media wall and dining table" },
      { name: "Marble-look wall panels", note: "Feature wall with brass inlay lines" },
      { name: "Backlit display shelving", note: "Glass shelves with integrated lighting" },
      { name: "Cove-lit false ceiling", note: "Curved profile with warm indirect light" },
    ],
    details: [
      { label: "Imagery", value: "Photographs & walkthrough video" },
      { label: "Spaces shown", value: "Living, dining, display unit" },
    ],
    finalImages: [],
    video: {
      src: "/images/projects/living-dining-residence/walkthrough.mp4",
      poster: "/videos/posters/living-dining-walkthrough.jpg",
      caption: "Walkthrough of the dining area and display unit",
      width: 848,
      height: 480,
    },
    isSample: false,
  },
  {
    slug: "two-finish-kitchen",
    title: "Two-Finish Modular Kitchen",
    category: "Kitchens",
    description: "One modular kitchen visualised in two finishes — warm beige gloss and soft sage — with marble-look backsplashes.",
    location: null,
    featured: true,
    cover: {
      src: P("two-finish-kitchen", "beige-u-kitchen"),
      alt: "3D visualisation of a U-shaped modular kitchen in beige gloss with a marble-look backsplash and a breakfast counter",
      kind: "render",
    },
    introduction:
      "A modular kitchen shown in two colour options so the client could compare them side by side: a warm beige gloss and a soft sage green, each with tall appliance units, a breakfast bar and marble-look surfaces.",
    concept: {
      heading: "The same plan, two moods.",
      body: "Layout, appliances and lighting stay identical; only the finishes change — an easy way to see how colour shifts the feel of a room before anything is built.",
    },
    gallery: [
      {
        src: P("two-finish-kitchen", "beige-tall-units"),
        alt: "3D visualisation of tall beige gloss units with a built-in refrigerator and stacked ovens",
        caption: "Beige — tall units",
        kind: "render",
      },
      {
        src: P("two-finish-kitchen", "beige-breakfast-bar"),
        alt: "3D visualisation of the beige kitchen's breakfast bar with timber-slat panel and bar stools",
        caption: "Beige — breakfast bar",
        kind: "render",
      },
      {
        src: P("two-finish-kitchen", "sage-u-kitchen"),
        alt: "3D visualisation of the same U-shaped kitchen with sage-green lower cabinets and white gloss uppers",
        caption: "Sage — U-shaped kitchen",
        kind: "render",
      },
      {
        src: P("two-finish-kitchen", "sage-tall-units"),
        alt: "3D visualisation of sage-green tall units with a refrigerator and stacked ovens",
        caption: "Sage — tall units",
        kind: "render",
      },
      {
        src: P("two-finish-kitchen", "sage-breakfast-bar"),
        alt: "3D visualisation of the sage kitchen's breakfast bar with timber slats and leather bar stools",
        caption: "Sage — breakfast bar",
        kind: "render",
      },
    ],
    materials: [
      { name: "Gloss lacquer shutters", note: "Beige or white uppers" },
      { name: "Sage matte lowers", note: "The alternative finish" },
      { name: "Marble-look backsplash", note: "Continuous behind the hob" },
      { name: "Under-cabinet lighting", note: "Warm task light" },
    ],
    details: [{ label: "Imagery", value: "3D visualisations" }, { label: "Options", value: "Two colour finishes" }],
    finalImages: [],
    isSample: false,
  },
  {
    slug: "corporate-office",
    title: "Corporate Office",
    category: "Commercial",
    description: "A bright workplace with timber-finish workstations, frosted glass cabins, a mezzanine and a director's cabin.",
    location: null,
    featured: true,
    cover: {
      src: P("corporate-office", "workstations-mezzanine"),
      alt: "Open office with timber-finish workstations, frosted glass cabins and a mezzanine with a glass railing",
      kind: "photo",
    },
    introduction:
      "An office arranged over two levels: an open floor of workstations, frosted glass cabins along one side, a mezzanine above, a meeting room — and a director's cabin with a city view.",
    concept: {
      heading: "Open, bright and organised.",
      body: "Light timber-finish panelling, white ceilings with recessed lights and warm cove details keep the working floor calm and evenly lit. Glass partitions give cabins privacy without closing them off, and a red-carpeted stair leads up to the mezzanine.",
    },
    gallery: [
      {
        src: P("corporate-office", "director-cabin-window"),
        alt: "Director's cabin with a white desk, leather chairs, cream sofa, teal display wall and a large window over the city",
        caption: "Director's cabin",
        kind: "photo",
      },
      {
        src: P("corporate-office", "workstations"),
        alt: "Workstations with patterned screens, a red-carpeted staircase and timber-panelled cabins",
        caption: "Workstations",
        kind: "photo",
      },
      {
        src: P("corporate-office", "corridor-stairs"),
        alt: "Corridor beside frosted glass cabins and a red-carpeted staircase",
        caption: "Cabins & stair",
        kind: "photo",
      },
      {
        src: P("corporate-office", "meeting-room"),
        alt: "Meeting room with a timber table, mesh chairs and framed photographs on panelled walls",
        caption: "Meeting room",
        kind: "photo",
      },
      {
        src: P("corporate-office", "director-cabin-meeting"),
        alt: "Kidney-shaped white meeting table with leather chairs beside a teal display niche",
        caption: "Director's meeting table",
        kind: "photo",
      },
      {
        src: P("corporate-office", "director-cabin-desk"),
        alt: "Oval white desk with leather chairs in front of floor-length maroon curtains",
        caption: "Director's desk",
        kind: "photo",
      },
      {
        src: P("corporate-office", "workspace"),
        alt: "View along the office floor towards the workstations and glass cabins",
        caption: "Office floor",
        kind: "photo",
      },
    ],
    materials: [
      { name: "Timber-finish laminate", note: "Workstations, panelling and cabin walls" },
      { name: "Frosted glass partitions", note: "Private cabins that share daylight" },
      { name: "Wood-finish flooring", note: "Warmth in the director's cabin" },
      { name: "Recessed & cove lighting", note: "Even illumination across the floor" },
    ],
    details: [
      { label: "Imagery", value: "Photographs" },
      { label: "Spaces shown", value: "Workstations, cabins, meeting room, director's cabin" },
    ],
    finalImages: [],
    isSample: false,
  },
  {
    slug: "sanjivani-hospital",
    title: "Sanjivani Hospital",
    category: "Healthcare",
    description: "Calm, practical healthcare interiors — from the street frontage to the operation theatre.",
    location: null,
    cover: {
      src: P("sanjivani-hospital", "waiting-area"),
      alt: "Hospital waiting area with leather sofas, seating and natural light",
      kind: "photo",
    },
    introduction:
      "Spaces across the hospital: a street frontage, a bright waiting area, a branded reception and an operation theatre — kept light, clean and easy to navigate.",
    concept: {
      heading: "Clarity at every step.",
      body: "Light walls and reflective floors keep the interiors bright and easy to maintain. Clear signage, simple furniture and a clean branded reception help patients and visitors find their way.",
    },
    gallery: [
      {
        src: P("sanjivani-hospital", "reception"),
        alt: "Reception desk with Sanjivani Hospital branding beside a window",
        caption: "Reception",
        kind: "photo",
      },
      {
        src: P("sanjivani-hospital", "operation-theatre"),
        alt: "Operation theatre with surgical lights and an operating table",
        caption: "Operation theatre",
        kind: "photo",
      },
      {
        src: P("sanjivani-hospital", "exterior"),
        alt: "Street frontage of Sanjivani Hospital with glass facade and signage",
        caption: "Street frontage",
        kind: "photo",
      },
    ],
    materials: [
      { name: "Light wall finishes", note: "Bright, easy-to-clean surfaces" },
      { name: "Polished floor tiles", note: "Durable and reflective" },
      { name: "Laminate reception joinery", note: "Branded, hard-wearing counter" },
    ],
    details: [
      { label: "Imagery", value: "Photographs" },
      { label: "Spaces shown", value: "Frontage, waiting, reception, operation theatre" },
    ],
    finalImages: [],
    isSample: false,
  },
  {
    slug: "school-campus",
    title: "School Campus Building",
    category: "Education",
    description: "A five-storey school building with a blue glass curtain wall, shown from construction to completion.",
    location: null,
    cover: {
      src: P("school-campus", "front-elevation"),
      alt: "Completed five-storey school building with a central blue glass facade behind a sports court",
      kind: "photo",
    },
    introduction:
      "A large school building organised around a central glazed block, flanked by wings of classrooms with deep horizontal bands. The imagery follows the facade from scaffolding to completion.",
    concept: {
      heading: "A bright civic presence.",
      body: "Strong horizontal slabs give the building a calm rhythm, while the reflective blue curtain wall marks the entrance and the heart of the campus.",
    },
    gallery: [
      {
        src: P("school-campus", "facade-glazing-progress"),
        alt: "School building under construction with scaffolding across the glass facade",
        caption: "Facade installation",
        kind: "site",
      },
      {
        src: P("school-campus", "curtain-wall-detail"),
        alt: "Close view of the blue glass curtain wall with scaffolding above the entrance",
        caption: "Curtain wall",
        kind: "site",
      },
    ],
    materials: [
      { name: "Blue glass curtain wall", note: "The central entrance block" },
      { name: "White plaster bands", note: "Horizontal slabs across every floor" },
    ],
    details: [
      { label: "Imagery", value: "Site photographs & completed building" },
      { label: "Storeys", value: "Ground + four" },
    ],
    finalImages: [],
    isSample: false,
  },
  {
    slug: "travertine-frame-residence",
    title: "Travertine Frame Residence",
    category: "Residential",
    description: "A contemporary home wrapped in a stone frame, with timber louvres and a glazed pergola.",
    location: null,
    cover: {
      src: P("travertine-frame-residence", "elevation-corner"),
      alt: "3D visualisation of a three-storey home framed in stone with timber louvres at dusk",
      kind: "render",
    },
    introduction:
      "A three-storey residence organised inside a bold stone-clad frame. Deep balconies, timber louvres and a glazed pergola give the facade depth, while a continuous line of light traces the frame at dusk.",
    concept: {
      heading: "A frame for everyday life.",
      body: "The upper floors sit within one sculptural stone frame. Within it, terraces, planters and sliding louvres create layers of privacy and shade, and generous glazing keeps the interiors bright.",
    },
    gallery: [
      {
        src: P("travertine-frame-residence", "elevation-side"),
        alt: "3D visualisation of the residence's long elevation with a glazed stair tower and landscaped boundary wall",
        caption: "Side elevation",
        kind: "render",
      },
    ],
    materials: [
      { name: "Stone-finish cladding", note: "The defining frame and boundary walls" },
      { name: "Timber louvres", note: "Shading and privacy screens" },
      { name: "Glass balustrades", note: "Uninterrupted views from the terraces" },
      { name: "Glazed pergola", note: "Filtered daylight over the top terrace" },
    ],
    details: [
      { label: "Imagery", value: "3D visualisations" },
      { label: "Views", value: "Corner and side elevations" },
    ],
    finalImages: [],
    isSample: false,
  },
  {
    slug: "jaali-facade-residence",
    title: "Jaali Façade Residence",
    category: "Residential",
    description: "A layered urban home with timber cladding and jaali screens — from visualisation to site.",
    location: null,
    cover: {
      src: P("jaali-facade-residence", "elevation"),
      alt: "3D visualisation of a three-storey home with timber cladding, jaali screens and glass balconies",
      kind: "render",
    },
    introduction:
      "A compact three-storey home on an urban plot, composed of stacked volumes in timber-effect cladding, grey panels and white plaster, with decorative jaali screens for privacy and light.",
    concept: {
      heading: "Pattern, shade and privacy.",
      body: "Jaali panels filter light and views, while balconies with glass and steel railings open the main rooms to the street. The site photograph shows the same massing taking shape in concrete.",
    },
    gallery: [
      {
        src: P("jaali-facade-residence", "on-site"),
        alt: "The same residence under construction, with the structure and balconies in place",
        caption: "On site",
        kind: "site",
      },
    ],
    materials: [
      { name: "Timber-effect cladding", note: "Warm horizontal panels" },
      { name: "Jaali screens", note: "Patterned privacy panels" },
      { name: "Glass & steel railings", note: "Balconies on every floor" },
    ],
    details: [
      { label: "Imagery", value: "3D visualisation & site photograph" },
      { label: "Storeys", value: "Ground + two, with terrace" },
    ],
    finalImages: [],
    isSample: false,
  },
  {
    slug: "executive-cabin",
    title: "Executive Cabin",
    category: "Commercial",
    description: "A warm executive office with full-height wood panelling, a library wall and a lit prayer niche.",
    location: null,
    cover: {
      src: P("executive-cabin", "library-wall"),
      alt: "3D visualisation of an executive cabin with a wood-panelled library wall and white sofas",
      kind: "render",
    },
    introduction:
      "An executive cabin built around a wood-panelled library wall — open shelving for books, awards and photographs — with white lounge seating, grey fluted panels and marble-look walls with fine metal inlays.",
    concept: {
      heading: "A room with a point of view.",
      body: "The library wall becomes the backdrop for meetings, while crisp white seating, a softly lit prayer niche and a floating ceiling panel keep the room light and composed.",
    },
    gallery: [
      {
        src: P("executive-cabin", "lounge"),
        alt: "3D visualisation of the cabin's lounge seating, prayer niche and fluted grey panels beside the library wall",
        caption: "Lounge & prayer niche",
        kind: "render",
      },
    ],
    materials: [
      { name: "Wood panelling", note: "Full-height, with metal inlay lines" },
      { name: "Open library shelving", note: "Display for books and awards" },
      { name: "Fluted grey panels", note: "Texture beside marble-look walls" },
      { name: "White upholstery", note: "Lounge seating for informal meetings" },
    ],
    details: [{ label: "Imagery", value: "3D visualisations" }],
    finalImages: [],
    isSample: false,
  },
  {
    slug: "dining-room",
    title: "Curtained Dining Room",
    category: "Dining",
    description: "A dining room wrapped in floor-length curtains, with a marble-look table, wash counter and wood-plank floor.",
    location: null,
    cover: {
      src: P("dining-room", "dining-table"),
      alt: "Marble-look dining table with upholstered chairs in a room lined with floor-length curtains",
      kind: "photo",
    },
    introduction:
      "A bright dining room enclosed by floor-length curtains on every side, with a pale marble-look table, upholstered chairs, a wash counter and a wood-plank floor. Stills are taken from the studio's walkthrough video.",
    concept: {
      heading: "Soft light, all around.",
      body: "Curtains soften the daylight and the sound, while the pale tabletop and warm wood-plank floor keep the room fresh, practical and easy to look after.",
    },
    gallery: [
      {
        src: P("dining-room", "table-and-basin"),
        alt: "Dining table beside a wash counter with a vessel basin and a long mirror",
        caption: "Table & wash counter",
        kind: "photo",
      },
    ],
    materials: [
      { name: "Marble-look tabletop", note: "Pale, easy-to-clean dining surface" },
      { name: "Floor-length curtains", note: "Soft, full enclosure" },
      { name: "Wood-plank flooring", note: "Warm base for the room" },
    ],
    details: [{ label: "Imagery", value: "Video stills & walkthrough video" }],
    finalImages: [],
    video: {
      src: "/images/projects/dining-room/walkthrough.mp4",
      poster: "/videos/posters/dining-room-walkthrough.jpg",
      caption: "Walkthrough of the dining room",
      width: 478,
      height: 850,
    },
    isSample: false,
  },
  {
    slug: "wardrobe-utility",
    title: "Wardrobe & Utility",
    category: "Bedrooms",
    description: "A dressing area with a lit glass-front wardrobe, full-height storage and a compact utility counter.",
    location: null,
    cover: {
      src: P("wardrobe-utility", "walk-in-wardrobe"),
      alt: "3D visualisation of a dressing area with a lit glass-front wardrobe, full-height storage and a vanity mirror",
      kind: "render",
    },
    introduction:
      "A dressing and utility zone planned for storage: a glass-fronted wardrobe with internal lighting, full-height cabinets and a compact counter for everyday tasks.",
    concept: {
      heading: "Storage, made to glow.",
      body: "Glass shutters and internal lighting turn everyday storage into a display, while flush white cabinets keep the rest of the room quiet.",
    },
    gallery: [
      {
        src: P("wardrobe-utility", "wardrobe-and-utility"),
        alt: "3D visualisation of full-height white cabinets beside the lit glass wardrobe and a utility counter",
        caption: "Wardrobe & storage",
        kind: "render",
      },
      {
        src: P("wardrobe-utility", "utility-counter"),
        alt: "3D visualisation of an L-shaped utility counter with flush white cabinets and a dark door",
        caption: "Utility counter",
        kind: "render",
      },
    ],
    materials: [
      { name: "Glass-front shutters", note: "Lit wardrobe display" },
      { name: "Flush white cabinets", note: "Full-height storage" },
      { name: "Granite counter", note: "Utility worktop" },
    ],
    details: [{ label: "Imagery", value: "3D visualisations" }],
    finalImages: [],
    isSample: false,
  },
  {
    slug: "mint-kitchen-terrazzo-bath",
    title: "Mint Kitchen & Terrazzo Bath",
    category: "Kitchens",
    description: "Mint-green kitchens with open spice shelving, and a sage-tiled bathroom with terrazzo and brass details.",
    location: null,
    cover: {
      src: P("mint-kitchen-terrazzo-bath", "mint-kitchen"),
      alt: "3D visualisation of a straight kitchen with mint-green lower cabinets, lit open spice shelves and a stainless steel hob",
      kind: "render",
    },
    introduction:
      "Fresh, compact spaces in mint and sage: kitchens with open lit shelving and a galley layout, paired with a bathroom in sage tiles, terrazzo and brushed brass.",
    concept: {
      heading: "Colour that feels fresh.",
      body: "Mint cabinets and sage tiles bring calm colour into hard-working rooms, while terrazzo, brass and warm lighting add character.",
    },
    gallery: [
      {
        src: P("mint-kitchen-terrazzo-bath", "galley-kitchen"),
        alt: "3D visualisation of a galley kitchen with mint cabinets, white gloss uppers and a window at the end",
        caption: "Galley kitchen",
        kind: "render",
      },
      {
        src: P("mint-kitchen-terrazzo-bath", "bath-shower"),
        alt: "3D visualisation of a bathroom with sage tiles, terrazzo walls, a glass shower partition and a terracotta vanity",
        caption: "Terrazzo bathroom",
        kind: "render",
      },
      {
        src: P("mint-kitchen-terrazzo-bath", "bath-vanity"),
        alt: "3D visualisation of the shower and wall-hung terracotta vanity with brass fittings",
        caption: "Shower & vanity",
        kind: "render",
      },
    ],
    materials: [
      { name: "Mint matte shutters", note: "Kitchen lower cabinets" },
      { name: "Sage stack-bond tiles", note: "Bathroom walls" },
      { name: "Terrazzo", note: "Floor and upper walls" },
      { name: "Brushed brass", note: "Fittings and frames" },
    ],
    details: [{ label: "Imagery", value: "3D visualisations" }],
    finalImages: [],
    isSample: false,
  },
  {
    slug: "open-kitchen-dining",
    title: "Open Kitchen & Dining",
    category: "Kitchens",
    description: "A bright open kitchen and dining space with timber accents, a breakfast bar and mint-upholstered seating.",
    location: null,
    cover: {
      src: P("open-kitchen-dining", "kitchen-bar"),
      alt: "3D visualisation of an open kitchen with a timber-slat breakfast bar, mint bar chairs and a dining table beyond",
      kind: "render",
    },
    introduction:
      "A white-and-timber open plan: the kitchen, breakfast bar and dining table share one bright room, tied together by timber cladding, a suspended planter shelf and mint upholstery. A matching bathroom completes the set.",
    concept: {
      heading: "One room, many rituals.",
      body: "Cooking, quick breakfasts and family meals flow around a single timber-clad column, with a ring chandelier marking the dining table.",
    },
    gallery: [
      {
        src: P("open-kitchen-dining", "dining-and-kitchen"),
        alt: "3D visualisation of a dining table with mint chairs under a ring chandelier, beside a timber-clad column and the kitchen",
        caption: "Dining & kitchen",
        kind: "render",
      },
      {
        src: P("open-kitchen-dining", "kitchen-counter"),
        alt: "3D visualisation of the kitchen's white counters, built-in ovens and the timber-slat breakfast bar",
        caption: "Kitchen counter",
        kind: "render",
      },
      {
        src: P("open-kitchen-dining", "bathroom"),
        alt: "3D visualisation of a grey bathroom with a backlit mirror, lit niche shelving and a blue-tiled shower",
        caption: "Bathroom",
        kind: "render",
      },
    ],
    materials: [
      { name: "Timber cladding", note: "Column, bar and ceiling band" },
      { name: "White matte shutters", note: "Kitchen cabinetry" },
      { name: "Mint upholstery", note: "Dining and bar chairs" },
    ],
    details: [{ label: "Imagery", value: "3D visualisations" }],
    finalImages: [],
    isSample: false,
  },
  {
    slug: "boardroom",
    title: "Boardroom",
    category: "Commercial",
    description: "A boardroom with a long marble-look table, leather chairs and a sculptural petal chandelier.",
    location: null,
    cover: {
      src: P("boardroom", "conference-room"),
      alt: "3D visualisation of a boardroom with a long marble-look table with a timber inlay, brown leather chairs and a petal chandelier",
      kind: "render",
    },
    introduction:
      "A boardroom designed for long meetings in comfort: a single marble-look table with a timber inlay, deep leather chairs, a credenza and gallery-lit artwork.",
    concept: {
      heading: "Presence without heaviness.",
      body: "Light walls and a sculptural chandelier keep a large table and leather seating feeling open rather than formal.",
    },
    gallery: [],
    materials: [
      { name: "Marble-look table top", note: "With a timber inlay" },
      { name: "Leather seating", note: "Executive chairs" },
      { name: "Petal chandelier", note: "Feature ceiling light" },
    ],
    details: [{ label: "Imagery", value: "3D visualisation" }],
    finalImages: [],
    isSample: false,
  },
];

/** Projects visible on the site. Samples are hidden when preview mode is off. */
export function getProjects(preview: boolean): Project[] {
  return allProjects.filter((p) => preview || !p.isSample);
}

export function getFeaturedProjects(preview: boolean): Project[] {
  const list = getProjects(preview);
  const featured = list.filter((p) => p.featured);
  return (featured.length ? featured : list).slice(0, 4);
}

export function getProject(slug: string, preview: boolean): Project | undefined {
  return getProjects(preview).find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string, preview: boolean) {
  const list = getProjects(preview);
  const i = list.findIndex((p) => p.slug === slug);
  const next = list[(i + 1) % list.length];
  const current = list[i];
  const related = list
    .filter((p) => p.slug !== slug)
    .sort((a, b) => Number(b.category === current?.category) - Number(a.category === current?.category))
    .slice(0, 2);
  return { next, related };
}

/** Every image of a project, cover first. */
export function projectImages(p: Project): ProjectImage[] {
  return [p.cover, ...p.gallery, ...p.finalImages];
}

export const imageKindLabel: Record<ImageKind, string | null> = {
  photo: null,
  render: "3D visualisation",
  site: "On site",
};
