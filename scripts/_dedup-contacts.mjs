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
  ['7fbbe686-356f-43af-88bf-bc48772c4e48', '32f1a643-121f-42c3-a004-ecac39af81a6'], // Margarita Abramova
  ['f3af9525-9643-49c0-8ad4-25d3de171804', '794e21be-e23b-4d16-8337-b70542906612'], // Raj Achan
  ['e3dc0fd3-bdcb-4d94-a8b4-9f15b62fa0b4', '37161a9d-c7ca-496d-8fed-2329ccfc90a4'], // Michael Amron
  ['29bc45b3-a283-40a4-87e7-76e412ca5773', '01882300-ec72-441a-b6e4-7f05d821d20f'], // James Black
  ['a76a2db0-66b3-4d6a-89d7-80cc6e60771f', '761b0580-63ea-41ad-a955-c4e82228e4b8'], // Wendy Brache
  ['f6f5759a-45e6-4dc4-af5d-8e6b4e74bdc0', 'a466b9bd-5cb8-4a77-aec9-58e8f8f9d369'], // Martin Driscoll
  ['c4857222-fd9c-4dd5-a5a7-fe9a6a1ee353', 'b0662289-aa1b-4447-ae42-1d19cd6ab72d'], // James Eastman
  ['e55d871c-345c-4b27-ad39-bd633cc7b5a9', '9f651b58-147a-4c54-822b-bc24be236191'], // Arielle Eatherton
  ['2a7f8a8f-037f-4845-8049-244d83118c9d', '77d094ae-eef9-43fd-aadc-be9585a59c7f'], // Steven Eskildsen
  ['59ac44c7-a679-43d4-b065-b851e71d98a3', 'd1970b7b-4059-47a5-ac7c-a2d1a9bd241c'], // Amanda Froelicher
  ['fbd39eb5-b023-4952-9bd8-5a5cc479ebfe', '2687adca-5977-4ee4-8943-4d32aa550e82'], // Mellissa Gorman
  ['c0e7cf6f-098a-49d9-b87a-a969a24f8558', '37a66ec5-354b-4a60-bbf7-e693c9a23abc'], // Cass Hurst
  ['164ac6e3-d425-4b48-8495-8a697abcce49', '9469bfaf-c9b6-4c29-9719-a2f696b71893'], // Aaron Jacobson
  ['689c6834-3607-4d3c-bbac-7f3f87808473', '6ed795db-d2ab-4d51-9504-0259b704537f'], // Mia Kirby
  ['cb6f6ab1-1e19-45c0-954e-b7a76da8da84', '9905d419-9717-456f-95bc-497dd0a801f5'], // Katie Long
  ['3a2fc0f7-2795-4a05-978a-d0f840669e2d', '27990b7e-a25d-4eeb-a5ec-20750139e3c5'], // Maurizio Maso
  ['5360b665-18c1-464d-b0b8-da3c60813e53', '2d9b4d74-f53f-4091-971d-d04d1e4b104d'], // Penny Moody
  ['22880f47-600f-4468-ad79-0c9bf75e8e05', '4e6a7c22-f843-4ff9-aff4-e99bdd9f446f'], // Jonathan Nobles
  ['f61bc288-d8ea-4911-9e1c-d91cb0977213', '7902fb54-2f2e-4967-aaa2-b0a7ecd8c97c'], // Colin O'Connell
  ['d001886e-2f53-4929-ada1-13855a66c9b8', '59d7d35a-9046-4fde-9d7b-68145ce64101'], // Sylvia Obiedzinski
  ['457231b6-3478-4a88-a535-a49fce3b03cb', 'ed3cd1b9-5f60-46eb-93ef-5e093ed26927'], // Matt Passarella
  ['aef5325a-1d3d-4455-a4f6-7a03928cd965', '56e37405-d2c1-4dba-a6b9-63bd8765ad90'], // Stephanie Pelzer
  ['4f8a0dc8-c099-4eaf-8e53-f4c28faa6187', 'c96f46c1-c79b-4572-b310-1e5684ff895f'], // Patrick Rauch
  ['f3b012f6-14ec-4b23-b6bb-87d1e6b468aa', '60882828-43dc-43cc-8dcc-2d14f1f3d9c0'], // Eric Ryder
  ['c7a6f179-3934-49bc-ae49-4c8507b34d05', '5ef45c9a-4bb2-4372-a199-c1fee1e76cf9'], // Bethany Sciortino
  ['e814372e-add9-4a0c-bd82-e2e604639985', 'd563605f-c4d4-413a-bbf9-ffa7446981d9'], // Nicole Taylor
  ['bc3c7358-66d3-4c65-924c-49b577800535', 'd1f29493-b307-4dbe-b116-0e329190e38a'], // Kara Wallace
  ['c7ef0e79-2dd3-4b04-a338-b77116bbb204', '4d90e782-01fb-41c8-b685-9b19176bc745'], // Hannah Wickham
  ['da22ec8f-32fd-4456-8ab5-16bfe4d56b63', 'f9a1e9fa-aded-4963-9247-35980f9caed7'], // David Winters
  ['01ae6a99-720a-4bb1-a94a-8acb5e78a1a2', 'cbd83219-1ea9-45b3-b023-0457d9042a17'], // Genevieve Woodrow
]

;(async () => {
  for (const [keep, del] of PAIRS) {
    // reassign any project_contacts from the duplicate to the canonical
    await sb('PATCH', 'project_contacts', `contact_id=eq.${del}`, { contact_id: keep })
      .catch(() => {}) // ignore if already canonical or no rows
    // delete the duplicate contact
    await sb('DELETE', 'contacts', `id=eq.${del}`)
    process.stdout.write('.')
  }
  console.log('\n✅  Done — 30 duplicate contacts removed')
})().catch(e => { console.error('\n❌', e.message); process.exit(1) })
