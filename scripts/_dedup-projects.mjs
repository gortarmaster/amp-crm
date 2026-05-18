const BASE = 'https://ttinjczehnhzamgpruxe.supabase.co/rest/v1'
const KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0aW5qY3plaG5oemFtZ3BydXhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTAzNzQwMSwiZXhwIjoyMDk0NjEzNDAxfQ.REd3Ox1Yj9X-IRtUeDDCYX7banZRZuHh1PQ3kzlZ72E'
const H    = { apikey: KEY, Authorization: 'Bearer '+KEY, 'Content-Type': 'application/json' }

async function sb(method, table, filter, body) {
  const url = `${BASE}/${table}?${filter}`
  const res = await fetch(url, { method, headers: H, body: body ? JSON.stringify(body) : undefined })
  if (!res.ok) throw new Error(`${method} ${table} -> ${res.status}: ${await res.text()}`)
}

// [keep (earlier), delete (later duplicate)]
const PAIRS = [
  ['2eacb3eb-29f1-4686-b3aa-11d0b2f5ddd5', 'eef48c9a-bae5-4e31-a83d-c8384194f368'], // AAA High School Campus
  ['d2f2b9b0-7f10-43f6-a195-12ae0e85be51', 'b2877c03-cf98-486f-9f53-eaa1bdabf881'], // Asana Partners — Minnesota Row Business Center
  ['a6449806-0aba-4146-89f8-f3b53e3467da', '596782e1-42cd-4696-9530-e4194616c87a'], // Booker Visual & Performing Arts Center
  ['7dda1097-f451-4149-82b3-60fedcfe7cc8', '7709b1dd-dcc6-465c-8804-ffa0f27ca313'], // Crooked Can Brewery — Minneola
  ['a0fe0119-bec0-4172-8469-a64788858a12', 'fa28ee50-1627-45c4-be07-a0bbf8f5b801'], // Heritage Oaks — Multifamily
  ['3fdf04d3-6378-4cc2-8010-6107db795614', 'f37b7ce0-2301-414a-8d2b-ebf349e58cf5'], // Marion County High School — New Campus
  ['78161d68-72b7-4a48-b4e3-8fb91c3f6ece', 'aea3d1df-43d6-4333-810c-8eb5d0b9903d'], // Northhaven — Multifamily
  ['49793240-2bbc-418c-b29e-5502b5f4304f', 'f4bb540a-b1e5-4418-9070-8e6ac81fef57'], // Orangewood Church & Christian School Expansion
  ['95ca06b1-ba4d-4a88-b6fd-54a17df562ff', '46faded2-9dca-4b1d-b051-1cdb446b4cf0'], // Palmetto High School Addition
  ['00467462-7eae-46d5-8a37-253c58777fb9', 'e0497d5e-1991-4ee1-b00d-7578d3d3164d'], // Rollins College East End — Student Housing
]

;(async () => {
  for (const [keep, del] of PAIRS) {
    // reassign any project_contacts from the duplicate to the canonical
    await sb('PATCH', 'project_contacts', `project_id=eq.${del}`, { project_id: keep })
      .catch(() => {})
    // reassign any project_sources
    await sb('PATCH', 'project_sources', `project_id=eq.${del}`, { project_id: keep })
      .catch(() => {})
    // delete the duplicate
    await sb('DELETE', 'projects', `id=eq.${del}`)
    process.stdout.write('.')
  }
  console.log('\n✅  Done — 10 duplicate projects removed')
})().catch(e => { console.error('\n❌', e.message); process.exit(1) })
