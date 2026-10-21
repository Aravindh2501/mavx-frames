import { services, faqs } from '@/lib/content'
import { site } from '@/lib/site'
import Footer from '@/components/Footer'
import ContactButton from '@/components/ContactButton'
import JsonLd from '@/components/JsonLd'
import { pageMetadata, SITE_URL } from '@/lib/seo'

export const metadata = pageMetadata("Photography & Booking FAQs", "Answers about MAVX Frames photography, booking, pricing, travel and delivery. Based in Chennai and Coimbatore, serving all of Tamil Nadu.", '/faq')
export default function Page() { return <main><JsonLd data={[{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Faq', item: `${SITE_URL}/faq` }] }, { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }]} /><article className="mx-auto max-w-[1000px] px-5 pb-24 pt-32 sm:px-6 md:px-10 md:pt-40"><h1 className="font-serif text-5xl leading-tight md:text-6xl">Good questions. Clear answers.</h1><p className="mt-6 text-lg leading-relaxed text-mute">A little clarity before you plan your shoot.</p><dl className="mt-12 space-y-9">{faqs.map(f => <div key={f.q}><dt className="font-serif text-2xl">{f.q}</dt><dd className="mt-3 max-w-2xl text-base leading-relaxed text-mute">{f.a}</dd></div>)}</dl><div className="mt-12"><ContactButton label="Ask about your shoot" /></div></article><Footer variant="simple" /></main> }
