import { orientationOf } from './imageRatio'
import type { Orientation } from './imageRatio'

export interface Tile {
  index: number
  kind: Orientation
  ratio: number
  area: string
  lift: number
  full: boolean
}

export function layoutGallery(ratios: number[]): Tile[] {
  const kinds = ratios.map(orientationOf)
  const tiles: Tile[] = []
  let row = 0

  const place = (index: number, start: number, span: number, lift = 0) => {
    tiles.push({
      index,
      kind: kinds[index],
      ratio: ratios[index],
      area: `${start} / span ${span}`,
      lift,
      full: false
    })
  }

  const placeArea = (index: number, area: string) => {
    tiles.push({ index, kind: kinds[index], ratio: ratios[index], area, lift: 0, full: false })
  }

  const lone = ['1 / span 12', '2 / span 10', '1 / span 12', '3 / span 9', '1 / span 10']

  let i = 0
  while (i < kinds.length) {
    const a = kinds[i]
    const b = kinds[i + 1]
    const c = kinds[i + 2]
    const bFlat = b !== undefined && b !== 'landscape'
    const cFlat = c !== undefined && c !== 'landscape'

    if (a === 'landscape') {
      if (bFlat && row % 2 === 0) {
        place(i, 1, 8)
        place(i + 1, 9, 4, 1)
        i += 2
      } else {
        placeArea(i, lone[row % lone.length])
        i += 1
      }
    } else if (bFlat && cFlat && row % 2 === 0) {
      place(i, 1, 4)
      place(i + 1, 5, 4, 2)
      place(i + 2, 9, 4, 1)
      i += 3
    } else if (bFlat) {
      if (row % 2 === 0) {
        place(i, 1, 5)
        place(i + 1, 7, 6, 1)
      } else {
        place(i, 1, 6)
        place(i + 1, 8, 5, 2)
      }
      i += 2
    } else if (b === 'landscape') {
      place(i, 1, 4)
      place(i + 1, 5, 8, 1)
      i += 2
    } else {
      place(i, row % 2 === 0 ? 2 : 6, 5)
      i += 1
    }
    row += 1
  }

  for (let t = 0; t < tiles.length; t++) {
    const tile = tiles[t]
    if (tile.full) continue
    const next = tiles[t + 1]
    if (tile.kind === 'landscape' || !next || next.kind === 'landscape') {
      tile.full = true
    } else {
      next.full = false
      t += 1
    }
  }

  return tiles
}
