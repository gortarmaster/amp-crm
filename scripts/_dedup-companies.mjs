const BASE = 'https://ttinjczehnhzamgpruxe.supabase.co/rest/v1'
const KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0aW5qY3plaG5oemFtZ3BydXhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTAzNzQwMSwiZXhwIjoyMDk0NjEzNDAxfQ.REd3Ox1Yj9X-IRtUeDDCYX7banZRZuHh1PQ3kzlZ72E'
const H    = { apikey: KEY, Authorization: 'Bearer '+KEY, 'Content-Type': 'application/json' }

async function sb(method, table, filter, body) {
  const url = `${BASE}/${table}?${filter}`
  const res = await fetch(url, { method, headers: H, body: body ? JSON.stringify(body) : undefined })
  if (!res.ok) throw new Error(`${method} ${table} -> ${res.status}: ${await res.text()}`)
}

// [keep (May 17 original), delete (May 18 duplicate)]
const PAIRS = [
  ['042dd586-b99c-4c58-8539-b4bbe16839f7', '642706b9-bb5b-45b9-886a-b27fcb883686'], // Baker Barrios
  ['53c43d60-fa0f-41f5-80f4-729180be3146', '90dfc93a-b88d-41da-9aa1-1687ae7945d9'], // Balfour Beatty
  ['444eeb4c-b542-442e-82fd-3ce15a018218', 'ce9a890e-640a-486c-a58e-55297479ee19'], // Brasfield & Gorrie
  ['f2ff381f-f53d-40f0-b430-461fcffbafe4', 'd96fcd7e-e4f4-44d7-93f2-3df1086010f1'], // Clune Construction
  ['608456c1-9700-41b7-aeec-4fb9baca1741', '97d2d8dc-4093-4644-870e-1896bb3f025b'], // DLR Group
  ['fc28b875-6067-4da8-a5ff-26c3b5bf37d4', 'b7346206-7466-45b3-8ab9-bb39bd9dc157'], // Forum Architecture
  ['9de5a023-de10-4643-b815-ac34ebdaedc9', '4995663c-2940-427c-9dad-c5170a9b9d2a'], // Goettsch Partners
  ['62d0a687-7718-49fd-b037-3c8aeda548f9', '99be0a09-b0c9-4aa5-a476-fa6fbc253d1f'], // HuntonBrady Architects
  ['1a61689f-b583-4c19-b5f0-2f691cbdb4a1', '5c5ee3c1-31a5-42dc-98c7-45677c55069c'], // M. A. Mortenson
  ['588c37b5-44f4-4264-854e-79952cca8437', '50dd4e4a-c493-4714-be7a-b6e56163f3f0'], // MAKE Design Studio
  ['1512a689-921b-4c01-aabd-a3f6c6b818c2', 'dd88d7d7-6257-47d0-b074-b0543c5024e1'], // Perkins & Will
  ['7385f21e-df90-4f40-ab5b-41f200b12850', 'e30bad80-0714-4c5f-a6bc-871e0311adbc'], // Power Construction
  ['b0b5862c-d4e9-41ab-8265-b1328eeed239', 'e8cb0a4f-7393-48b4-99f7-ed0f84f4a9ce'], // SCB
  ['6d8090f7-e7bb-4a5e-a16e-a6e8e9f0199a', 'f4985347-db5a-44f9-9b20-4a88e6c024c5'], // SchenkelShultz
  ['2e6e6546-d717-4e97-b3d3-dcaa8c1a03e4', 'b704fd85-97fa-442c-b33f-8ab095013a1e'], // Wharton-Smith
]

;(async () => {
  for (const [keep, del] of PAIRS) {
    await sb('PATCH', 'contacts',  `company_id=eq.${del}`, { company_id: keep })
    await sb('PATCH', 'projects',  `company_id=eq.${del}`, { company_id: keep })
    await sb('DELETE', 'companies', `id=eq.${del}`)
    process.stdout.write('.')
  }
  console.log('\n✅  Done — 15 duplicates removed, all contacts & projects re-linked')
})().catch(e => { console.error('\n❌', e.message); process.exit(1) })
