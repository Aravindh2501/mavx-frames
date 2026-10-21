import type { Metadata } from 'next'

// Set this to the final production origin before deploying (including www if used).
const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mavxframes.com')
if (!['https:', 'http:'].includes(origin.protocol)) throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTP(S) URL')
export const SITE_URL = origin.origin
export const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'


export const BRAND = {
  name: 'MAVX Frames',
  base: 'Chennai and Coimbatore',
  region: 'Tamil Nadu',
  tagline: 'Your moments. Beautifully kept.',
  description:
    'Wedding, portrait and brand photography in Chennai and Coimbatore. MAVX Frames creates photographs and films across Tamil Nadu. Enquire about your shoot.',
  ogImage: '/opengraph-image',
  logo: '/logo.png'
}

export type City = {
  slug: string
  name: string
  hours: number
  intro: string
  spots: { name: string; note: string }[]
  shoots: string[]
}

const WEDDING = ['Weddings', 'Pre-wedding shoots', 'Engagements', 'Portraits and events']

export const CITIES: City[] = [
  {
    slug: 'chennai',
    name: 'Chennai',
    hours: 0,
    intro:
      'Chennai is home base. We shoot weddings in temple mandapams, beach resorts and city banquet halls, and pre-wedding stories along the coast and in the old neighbourhoods.',
    spots: [
      { name: 'Marina and Elliot’s Beach', note: 'Soft sunrise light and open sand for couple portraits.' },
      { name: 'Mylapore and Kapaleeshwarar Temple', note: 'Colourful gopuram and street life for traditional frames.' },
      { name: 'Fort St George and Santhome', note: 'Colonial architecture and quiet corners for editorial shots.' },
      { name: 'East Coast Road', note: 'Resorts, casuarina groves and sea views a short drive from the city.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'mahabalipuram',
    name: 'Mahabalipuram',
    hours: 1.5,
    intro:
      'Mahabalipuram is one of the closest and most photogenic pre-wedding destinations from Chennai, with ancient rock-cut temples beside the Bay of Bengal.',
    spots: [
      { name: 'Shore Temple', note: 'Granite temple against the sea, best at sunrise.' },
      { name: 'Five Rathas', note: 'Monolithic stone chariots with warm, textured backdrops.' },
      { name: 'Arjuna’s Penance', note: 'Giant carved rock relief for dramatic wide frames.' },
      { name: 'ECR beachfront', note: 'Quiet stretches of sand and resort lawns for destination weddings.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'kanchipuram',
    name: 'Kanchipuram',
    hours: 2,
    intro:
      'Kanchipuram, the silk city and temple town, suits traditional weddings and pre-wedding shoots in silk sarees against some of the oldest temples in South India.',
    spots: [
      { name: 'Kailasanathar Temple', note: 'Sandstone Pallava temple with soft, warm tones.' },
      { name: 'Ekambareswarar Temple', note: 'Tall gopuram and long pillared corridors.' },
      { name: 'Kamakshi Amman Temple', note: 'Traditional ceremonies and festival atmosphere.' },
      { name: 'Silk weaving lanes', note: 'Handloom workshops for authentic cultural portraits.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'vellore',
    name: 'Vellore',
    hours: 3,
    intro:
      'Vellore combines a historic fort, a golden temple and nearby hills, giving couples and families varied backdrops within a morning’s drive of Chennai.',
    spots: [
      { name: 'Vellore Fort', note: 'Moat, stone ramparts and the Jalakandeswarar Temple inside.' },
      { name: 'Sripuram Golden Temple', note: 'Gold-clad sanctum with landscaped, star-shaped paths.' },
      { name: 'Yelagiri Hills', note: 'Cool hill scenery for pre-wedding and family shoots.' },
      { name: 'Amirthi forest area', note: 'Green, shaded settings for relaxed portraits.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'pondicherry',
    name: 'Pondicherry',
    hours: 3.5,
    intro:
      'Pondicherry (Puducherry) is a favourite for pre-wedding and destination shoots, with its French Quarter streets, seafront and beaches only a few hours from Chennai.',
    spots: [
      { name: 'White Town', note: 'Pastel colonial buildings and bougainvillea-lined lanes.' },
      { name: 'Promenade Beach', note: 'Seafront walks and golden-hour portraits.' },
      { name: 'Auroville', note: 'Open spaces and distinctive architecture for modern frames.' },
      { name: 'Paradise and Serenity Beach', note: 'Quieter beaches for couple and family shoots.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'tiruvannamalai',
    name: 'Tiruvannamalai',
    hours: 3.5,
    intro:
      'Tiruvannamalai sits at the foot of the sacred Arunachala hill, with a vast temple complex that works well for traditional weddings and cultural storytelling.',
    spots: [
      { name: 'Arunachaleswarar Temple', note: 'One of the largest temple complexes in Tamil Nadu.' },
      { name: 'Arunachala Hill', note: 'Rocky slopes and sunrise views over the town.' },
      { name: 'Girivalam path', note: 'Pilgrim walking route for documentary-style frames.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'cuddalore',
    name: 'Cuddalore',
    hours: 4,
    intro:
      'Cuddalore (Kadalur) offers coastline, backwaters and the Pichavaram mangroves, a rare and photogenic setting for pre-wedding and family shoots.',
    spots: [
      { name: 'Pichavaram Mangrove Forest', note: 'Boat-lined channels and green canopy, among the largest mangrove areas in India.' },
      { name: 'Silver Beach', note: 'Open beach for sunrise and golden-hour portraits.' },
      { name: 'Fort St David', note: 'Old fort ruins for textured, historic backdrops.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'chidambaram',
    name: 'Chidambaram',
    hours: 4.5,
    intro:
      'Chidambaram is a temple town known for the Nataraja Temple, and it sits close to the Pichavaram backwaters, so one trip can cover ceremony and a scenic couple shoot.',
    spots: [
      { name: 'Thillai Nataraja Temple', note: 'Ornate gopurams and a large temple tank.' },
      { name: 'Pichavaram backwaters', note: 'Mangrove channels a short drive from town.' },
      { name: 'Town streets and bazaars', note: 'Everyday life for candid, traditional frames.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'kumbakonam',
    name: 'Kumbakonam',
    hours: 5.5,
    intro:
      'Kumbakonam is a Cauvery-delta temple town surrounded by Chola-era monuments, well suited to traditional weddings and heritage pre-wedding shoots.',
    spots: [
      { name: 'Airavatesvara Temple, Darasuram', note: 'UNESCO-listed Chola temple with fine stone carving.' },
      { name: 'Mahamaham Tank', note: 'Large temple tank surrounded by shrines.' },
      { name: 'Sarangapani and Kumbeswarar temples', note: 'Towering gopurams in the town centre.' },
      { name: 'Cauvery river banks', note: 'Green delta fields and riverside light.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'trichy',
    name: 'Trichy (Tiruchirappalli)',
    hours: 5.5,
    intro:
      'Trichy, also called Tiruchi, has the Srirangam temple island, the Rockfort and the Cauvery river, giving us strong traditional and riverside backdrops for weddings.',
    spots: [
      { name: 'Srirangam Ranganathaswamy Temple', note: 'Huge temple complex with towering gopurams.' },
      { name: 'Rockfort Temple', note: 'Hilltop temple with panoramic views over the city.' },
      { name: 'Kallanai (Grand Anicut)', note: 'Ancient dam on the Cauvery for open, riverside frames.' },
      { name: 'Mukkombu', note: 'Quiet river spot for golden-hour portraits.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'thanjavur',
    name: 'Thanjavur',
    hours: 6,
    intro:
      'Thanjavur is home to the Brihadeeswarar Temple and the Maratha Palace, making it a natural choice for heritage weddings and classical pre-wedding shoots.',
    spots: [
      { name: 'Brihadeeswarar Temple', note: 'UNESCO-listed Chola temple with a monumental vimana.' },
      { name: 'Thanjavur Maratha Palace', note: 'Arched halls and courtyards for editorial portraits.' },
      { name: 'Saraswathi Mahal Library', note: 'Historic palace library within the palace complex.' },
      { name: 'Paddy fields around the delta', note: 'Green fields for relaxed couple shoots.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'karaikudi',
    name: 'Karaikudi (Chettinad)',
    hours: 7,
    intro:
      'Karaikudi is the centre of Chettinad, known for grand mansions, patterned tiles and heritage homes that give couples and families unusual, richly textured backdrops.',
    spots: [
      { name: 'Chettinad mansions', note: 'Wide courtyards, teak pillars and carved doors.' },
      { name: 'Athangudi tile workshops', note: 'Colourful handmade tiles for detail and portrait frames.' },
      { name: 'Kanadukathan Palace', note: 'Large Chettinad palace-style home.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'salem',
    name: 'Salem',
    hours: 5,
    intro:
      'Salem is a good base for weddings and hill-station pre-wedding shoots, with Yercaud and the Mettur backwaters close by.',
    spots: [
      { name: 'Yercaud', note: 'Cool hill scenery, coffee estates and a lake.' },
      { name: 'Lady’s Seat viewpoint', note: 'Sunrise and sunset views over the valley.' },
      { name: 'Mettur Dam', note: 'Large reservoir and open landscapes.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'erode',
    name: 'Erode',
    hours: 6,
    intro:
      'Erode lies on the Cauvery and Bhavani rivers, with dams, temples and green countryside that suit weddings and relaxed outdoor shoots.',
    spots: [
      { name: 'Bhavani Kooduthurai', note: 'River confluence with the Sangameswarar Temple.' },
      { name: 'Bhavanisagar Dam', note: 'Large dam with gardens and open views.' },
      { name: 'Kodiveri Dam', note: 'Shallow river and rocky banks for portraits.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'coimbatore',
    name: 'Coimbatore',
    hours: 8,
    intro:
      'Coimbatore (Kovai) is our western base for weddings, with the Western Ghats, tea and coconut country and hill temples close to the city.',
    spots: [
      { name: 'Marudhamalai Temple', note: 'Hilltop Murugan temple with views over the plains.' },
      { name: 'Perur Pateeswarar Temple', note: 'Old temple with ornate carved pillars.' },
      { name: 'Pollachi coconut farms', note: 'Lush green farmland for pre-wedding and family shoots.' },
      { name: 'Valparai tea estates', note: 'Misty hills and tea terraces in the Anamalai range.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'madurai',
    name: 'Madurai',
    hours: 8,
    intro:
      'Madurai, one of the oldest living cities in India, is built around the Meenakshi Amman Temple and offers heritage settings for traditional weddings.',
    spots: [
      { name: 'Meenakshi Amman Temple', note: 'Colourful gopurams and long pillared halls.' },
      { name: 'Thirumalai Nayakkar Mahal', note: 'Large arched palace for grand portraits.' },
      { name: 'Vandiyur Mariamman Teppakulam', note: 'Big temple tank, especially lovely at dusk.' },
      { name: 'Alagar Koil', note: 'Forested hill temple outside the city.' }
    ],
    shoots: WEDDING
  },
  {
    slug: 'ooty',
    name: 'Ooty (Udhagamandalam)',
    hours: 10,
    intro:
      'Ooty in the Nilgiri hills is one of Tamil Nadu’s favourite pre-wedding destinations, with tea gardens, pine forests and mist in cool weather.',
    spots: [
      { name: 'Government Botanical Garden', note: 'Terraced lawns and flower beds.' },
      { name: 'Doddabetta Peak', note: 'The highest point in the Nilgiris with wide valley views.' },
      { name: 'Ooty Lake and Pykara', note: 'Water, boats and forest edges for couple portraits.' },
      { name: 'Tea estates', note: 'Rolling green terraces in soft morning light.' }
    ],
    shoots: ['Pre-wedding shoots', 'Weddings', 'Engagements', 'Family and couple portraits']
  },
  {
    slug: 'kodaikanal',
    name: 'Kodaikanal',
    hours: 9.5,
    intro:
      'Kodaikanal is a hill-station favourite for pre-wedding shoots, with a star-shaped lake, pine forests and misty viewpoints in the Palani hills.',
    spots: [
      { name: 'Kodai Lake', note: 'Lakeside paths and boats for relaxed portraits.' },
      { name: 'Pine Forest', note: 'Tall, straight pines with soft, filtered light.' },
      { name: 'Coaker’s Walk', note: 'Cliff-edge path with valley views.' },
      { name: 'Pillar Rocks', note: 'Large granite pillars for dramatic wide frames.' }
    ],
    shoots: ['Pre-wedding shoots', 'Weddings', 'Engagements', 'Family and couple portraits']
  },
  {
    slug: 'rameswaram',
    name: 'Rameswaram',
    hours: 10,
    intro:
      'Rameswaram is a sacred island town with the Ramanathaswamy Temple, the Pamban Bridge and Dhanushkodi’s open sands, a dramatic setting for destination shoots.',
    spots: [
      { name: 'Ramanathaswamy Temple', note: 'Famous for its long pillared corridors.' },
      { name: 'Pamban Bridge', note: 'Sea bridge and open water for wide frames.' },
      { name: 'Dhanushkodi', note: 'Remote sandy tip with the sea on both sides.' }
    ],
    shoots: ['Pre-wedding shoots', 'Weddings', 'Engagements', 'Family and couple portraits']
  }
]

export const getCity = (slug: string) => CITIES.find((c) => c.slug === slug)

export const cityPath = (slug: string) => `/photographer-in/${slug}`

export const hoursLabel = (h: number) => {
  if (h === 0) return 'based in the city'
  const whole = Math.floor(h)
  const half = h - whole >= 0.5
  const n = half ? `${whole}.5` : `${whole}`
  return `about ${n} hours by road from Chennai`
}

export const cityTitle = (c: City) =>
  c.slug === 'chennai'
    ? `Wedding & Pre-Wedding Photographer in Chennai | ${BRAND.name}`
    : `Wedding & Pre-Wedding Photographer in ${c.name.split(' (')[0]} | ${BRAND.name}`

export const cityDescription = (c: City) => {
  const name = c.name.split(' (')[0]
  return `Wedding, pre-wedding and portrait photography in ${name} by MAVX Frames. Based in Chennai and Coimbatore, serving Tamil Nadu. Check your date.`
}

export const absUrl = (path: string) => new URL(path, `${SITE_URL}/`).href

export function pageMetadata(title: string, description: string, path: string, image = BRAND.ogImage): Metadata {
  const fullTitle = `${title} | ${BRAND.name}`
  return {
    title: { absolute: fullTitle }, description, alternates: { canonical: absUrl(path) },
    openGraph: { type: 'website', locale: 'en_IN', siteName: BRAND.name, title: fullTitle, description, url: absUrl(path), images: [{ url: absUrl(image), alt: fullTitle }] },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [absUrl(image)] }
  }
}
