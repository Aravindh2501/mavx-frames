import Link from 'next/link'
import { CITIES, cityPath } from '@/lib/seo'

export default function Locations() {
  return (
    <nav aria-label="Cities we photograph in across Tamil Nadu" className="sr-only">
      <h2>Photographer in Chennai, travelling across Tamil Nadu</h2>
      <p>
        Based in Chennai, we travel for weddings, pre-wedding shoots and portraits to cities up to about ten hours
        away.
      </p>
      <ul>
        {CITIES.map((c) => (
          <li key={c.slug}>
            <Link href={cityPath(c.slug)}>Photographer in {c.name.split(' (')[0]}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
