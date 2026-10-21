import Link from 'next/link'
import ContactButton from './ContactButton'
import { services, faqs } from '@/lib/content'

export default function StudioContent() {
  return <div className="mx-auto max-w-[1280px] px-5 sm:px-6 md:px-10">
    <section className="py-16 md:py-24" aria-labelledby="services-heading">
      <h2 id="services-heading" className="font-serif text-4xl tracking-tight md:text-5xl">Life happens. We keep the frames.</h2>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute">Photography and films for people, celebrations and brands. Based in Chennai and Coimbatore. Available across Tamil Nadu.</p>
      <div className="mt-10 grid gap-x-12 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(s => <article key={s.id}><h3 className="font-serif text-2xl"><Link className="hover:text-accent" href={`/services#${s.id}`}>{s.title}</Link></h3><p className="mt-3 text-sm leading-relaxed text-mute">{s.text}</p></article>)}
      </div>
      <Link className="btn-ghost mt-8 inline-flex" href="/services">Explore our services</Link>
    </section>
    <section className="py-12 md:py-20" aria-labelledby="booking-heading">
      <h2 id="booking-heading" className="font-serif text-3xl md:text-4xl">Start with a date. Tell us the rest.</h2>
      <ol className="mt-8 grid gap-8 md:grid-cols-3">
        <li><h3 className="font-serif text-xl">01. Share your plans</h3><p className="mt-3 text-sm leading-relaxed text-mute">Your date, location and the kind of shoot you have in mind.</p></li>
        <li><h3 className="font-serif text-xl">02. Make a plan together</h3><p className="mt-3 text-sm leading-relaxed text-mute">Discuss availability, coverage, deliverables and a quote.</p></li>
        <li><h3 className="font-serif text-xl">03. Make it yours</h3><p className="mt-3 text-sm leading-relaxed text-mute">Confirm the details, share your ideas and get ready for your shoot.</p></li>
      </ol>
      <div className="mt-8"><ContactButton label="Check your date" /></div>
    </section>
    <section className="py-16 md:py-24" aria-labelledby="questions-heading">
      <h2 id="questions-heading" className="font-serif text-3xl md:text-4xl">A few things you might be wondering.</h2>
      <dl className="mt-8 grid gap-8 md:grid-cols-2">{faqs.slice(0,4).map(f => <div key={f.q}><dt className="font-serif text-xl">{f.q}</dt><dd className="mt-3 text-sm leading-relaxed text-mute">{f.a}</dd></div>)}</dl>
      <Link href="/faq" className="btn-ghost mt-8 inline-flex">More questions, answered</Link>
    </section>
  </div>
}
