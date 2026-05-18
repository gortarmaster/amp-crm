/**
 * ZoomInfo → amp-crm Contact Importer
 * Run with: node scripts/import-zoominfo-contacts.mjs
 *
 * What this does:
 *  1. Looks up your user ID in Supabase by email
 *  2. Inserts 15 target companies (architecture, construction, design)
 *  3. Inserts 30 enriched contacts with verified emails + company links
 */

const SUPABASE_URL = 'https://ttinjczehnhzamgpruxe.supabase.co'
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0aW5qY3plaG5oemFtZ3BydXhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTAzNzQwMSwiZXhwIjoyMDk0NjEzNDAxfQ.REd3Ox1Yj9X-IRtUeDDCYX7banZRZuHh1PQ3kzlZ72E'
const USER_EMAIL   = 'aaronjacobabercrombie@gmail.com'

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
}

async function sb(method, path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`Supabase ${method} ${path} → ${res.status}: ${text}`)
  return text ? JSON.parse(text) : null
}

// ─── Source data ─────────────────────────────────────────────────────────────

const COMPANIES = [
  { name: 'SchenkelShultz Architecture', website: 'https://www.schenkelshultz.com',   industry: 'Architecture, Engineering & Design' },
  { name: 'DLR Group',                   website: 'https://www.dlrgroup.com',           industry: 'Architecture, Engineering & Design' },
  { name: 'Baker Barrios',               website: 'https://www.bakerbarrios.com',        industry: 'Architecture, Engineering & Design' },
  { name: 'HuntonBrady Architects',      website: 'https://www.huntonbrady.com',         industry: 'Architecture, Engineering & Design' },
  { name: 'Forum Architecture & Interior Design', website: 'https://www.forumarchitecture.com', industry: 'Architecture, Engineering & Design' },
  { name: 'MAKE Design Studio',          website: 'https://www.makedesignstudiollc.com', industry: 'Architecture, Engineering & Design' },
  { name: 'Brasfield & Gorrie',          website: 'https://www.brasfieldgorrie.com',     industry: 'Commercial & Residential Construction' },
  { name: 'Balfour Beatty',             website: 'https://www.balfourbeattyus.com',      industry: 'Commercial & Residential Construction' },
  { name: 'Wharton-Smith',              website: 'https://www.whartonsmith.com',          industry: 'Commercial & Residential Construction' },
  { name: 'Power Construction',         website: 'https://www.powerconstruction.net',    industry: 'Commercial & Residential Construction' },
  { name: 'Clune Construction',         website: 'https://www.clunegc.com',              industry: 'Commercial & Residential Construction' },
  { name: 'SCB',                        website: 'https://www.scb.com',                  industry: 'Architecture, Engineering & Design' },
  { name: 'Goettsch Partners',          website: 'https://www.gpchicago.com',            industry: 'Architecture, Engineering & Design' },
  { name: 'Perkins & Will',            website: 'https://www.perkinswill.com',           industry: 'Architecture, Engineering & Design' },
  { name: 'M. A. Mortenson',           website: 'https://www.mortenson.com',             industry: 'Commercial & Residential Construction' },
]

// Contacts keyed by company name; emails + phones enriched via ZoomInfo
const CONTACTS_RAW = [
  // ── SchenkelShultz ─────────────────────────────────────────────────────────
  { first: 'Aaron',    last: 'Jacobson',    email: 'ajacobson@schenkelshultz.com',      phone: null,              mobile: '(559) 824-3429', title: 'Principal',                                       company: 'SchenkelShultz Architecture', tags: ['architecture', 'florida', 'principal'] },
  { first: 'Patrick',  last: 'Rauch',       email: 'prauch@schenkelshultz.com',          phone: '(407) 246-0770',  mobile: null,             title: 'Principal',                                       company: 'SchenkelShultz Architecture', tags: ['architecture', 'florida', 'principal'] },

  // ── DLR Group ──────────────────────────────────────────────────────────────
  { first: 'Penny',    last: 'Moody',       email: 'pmoody@dlrgroup.com',                phone: '(407) 316-2186',  mobile: '(407) 325-5133', title: 'Principal, Business Development Leader',          company: 'DLR Group',                   tags: ['architecture', 'florida', 'business-development', 'principal'] },

  // ── Baker Barrios ──────────────────────────────────────────────────────────
  { first: 'Mia',      last: 'Kirby',       email: 'mkirby@bakerbarrios.com',            phone: null,              mobile: '(407) 756-6677', title: 'Business Development Manager',                    company: 'Baker Barrios',               tags: ['architecture', 'florida', 'business-development'] },
  { first: 'Eric',     last: 'Ryder',       email: 'eryder@bakerbarrios.com',            phone: null,              mobile: '(424) 387-1721', title: 'Director, Design',                                company: 'Baker Barrios',               tags: ['architecture', 'florida', 'design-director'] },

  // ── HuntonBrady ────────────────────────────────────────────────────────────
  { first: 'Margarita',last: 'Abramova',    email: 'mabramova@huntonbrady.com',          phone: null,              mobile: '(813) 545-0786', title: 'Manager, Marketing',                              company: 'HuntonBrady Architects',      tags: ['architecture', 'florida', 'marketing'] },
  { first: 'Jonathan', last: 'Nobles',      email: 'jnobles@huntonbrady.com',            phone: null,              mobile: '(407) 415-4592', title: 'Business Development Manager',                    company: 'HuntonBrady Architects',      tags: ['architecture', 'florida', 'business-development'] },
  { first: 'Maurizio', last: 'Maso',        email: 'mmaso@huntonbrady.com',              phone: null,              mobile: '(407) 758-8711', title: 'Design Principal',                                company: 'HuntonBrady Architects',      tags: ['architecture', 'florida', 'design-director', 'principal'] },

  // ── Forum Architecture ─────────────────────────────────────────────────────
  { first: 'Bethany',  last: 'Sciortino',   email: 'bsciortino@forumarchitecture.com',   phone: null,              mobile: null,             title: 'Director, Business Development',                  company: 'Forum Architecture & Interior Design', tags: ['architecture', 'florida', 'business-development', 'interior-design'] },
  { first: 'James',    last: 'Black',       email: 'jblack@forumarchitecture.com',        phone: null,              mobile: '(407) 927-7218', title: 'Founding Principal',                              company: 'Forum Architecture & Interior Design', tags: ['architecture', 'florida', 'principal', 'interior-design'] },
  { first: 'Amanda',   last: 'Froelicher',  email: 'afroelicher@forumarchitecture.com',   phone: null,              mobile: '(334) 303-5252', title: 'Studio Director',                                 company: 'Forum Architecture & Interior Design', tags: ['architecture', 'florida', 'studio-director', 'interior-design'] },

  // ── MAKE Design Studio ─────────────────────────────────────────────────────
  { first: 'Nicole',   last: 'Taylor',      email: 'nicole@makedesignstudiollc.com',      phone: null,              mobile: null,             title: 'Principal',                                       company: 'MAKE Design Studio',          tags: ['interior-design', 'florida', 'restaurant', 'principal'] },

  // ── Brasfield & Gorrie ─────────────────────────────────────────────────────
  { first: 'Katie',    last: 'Long',        email: 'klong@brasfieldgorrie.com',            phone: '(407) 562-4574',  mobile: '(407) 234-8522', title: 'Regional Director, Marketing',                    company: 'Brasfield & Gorrie',          tags: ['construction', 'florida', 'marketing'] },
  { first: 'Hannah',   last: 'Wickham',     email: 'hwickham@brasfieldgorrie.com',         phone: '(407) 562-4570',  mobile: '(407) 310-0344', title: 'Business Development',                            company: 'Brasfield & Gorrie',          tags: ['construction', 'florida', 'business-development'] },

  // ── Balfour Beatty ─────────────────────────────────────────────────────────
  { first: 'Genevieve',last: 'Woodrow',     email: 'gwoodrow@balfourbeattyus.com',         phone: null,              mobile: '(813) 743-5260', title: 'Business Development Director',                   company: 'Balfour Beatty',             tags: ['construction', 'florida', 'business-development'] },
  { first: 'Martin',   last: 'Driscoll',    email: 'mdriscoll@balfourbeattyus.com',        phone: '(954) 585-4230',  mobile: '(954) 325-9700', title: 'Director, Business Development',                  company: 'Balfour Beatty',             tags: ['construction', 'florida', 'business-development'] },

  // ── Wharton-Smith ──────────────────────────────────────────────────────────
  { first: 'David',    last: 'Winters',     email: 'd.winters@whartonsmith.com',           phone: '(407) 328-4744',  mobile: '(407) 402-0239', title: 'Director, Business Development',                  company: 'Wharton-Smith',              tags: ['construction', 'florida', 'business-development'] },
  { first: 'Matt',     last: 'Passarella',  email: 'mpassarella@whartonsmith.com',         phone: '(321) 208-8170',  mobile: '(321) 243-8105', title: 'Business Development Manager',                    company: 'Wharton-Smith',              tags: ['construction', 'florida', 'business-development'] },
  { first: 'Cass',     last: 'Hurst',       email: 'churst@whartonsmith.com',              phone: null,              mobile: '(689) 278-0986', title: 'Business Development Executive',                  company: 'Wharton-Smith',              tags: ['construction', 'florida', 'business-development'] },

  // ── SCB (Chicago) ──────────────────────────────────────────────────────────
  { first: 'Arielle',  last: 'Eatherton',   email: 'arielle.eatherton@scb.com',            phone: '(312) 896-1154',  mobile: '(630) 363-6032', title: 'Director, Aviation Marketing',                    company: 'SCB',                        tags: ['architecture', 'chicago', 'marketing', 'aviation'] },
  { first: 'Sylvia',   last: 'Obiedzinski', email: 'sylvia.obiedzinski@scb.com',           phone: '(312) 896-1290',  mobile: '(630) 742-1131', title: 'Associate Principal, Design Director',            company: 'SCB',                        tags: ['architecture', 'chicago', 'design-director', 'principal'] },

  // ── Goettsch Partners ──────────────────────────────────────────────────────
  { first: 'Raj',      last: 'Achan',       email: 'rachan@gpchicago.com',                 phone: '+971 2 613 5153', mobile: '+971 50 594 3991',title: 'General Manager & Business Development Director', company: 'Goettsch Partners',          tags: ['architecture', 'chicago', 'business-development'] },
  { first: 'Stephanie',last: 'Pelzer',      email: 'stephanie.pelzer@gpchicago.com',       phone: null,              mobile: '(612) 310-0752', title: 'Associate Director, Marketing & Graphics',        company: 'Goettsch Partners',          tags: ['architecture', 'chicago', 'marketing'] },

  // ── Perkins & Will ─────────────────────────────────────────────────────────
  { first: 'James',    last: 'Eastman',     email: 'james.eastman@perkinswill.com',        phone: '(212) 251-7121',  mobile: null,             title: 'Director, Marketing',                             company: 'Perkins & Will',            tags: ['architecture', 'chicago', 'marketing'] },

  // ── Power Construction ─────────────────────────────────────────────────────
  { first: 'Mellissa', last: 'Gorman',      email: 'mgorman@powerconstruction.net',        phone: '(847) 214-6733',  mobile: '(773) 682-1897', title: 'Senior Manager, Marketing & Communication',       company: 'Power Construction',         tags: ['construction', 'chicago', 'marketing'] },

  // ── Clune Construction ─────────────────────────────────────────────────────
  { first: 'Michael',  last: 'Amron',       email: 'mamron@clunegc.com',                   phone: '(646) 569-2917',  mobile: '(917) 913-0266', title: 'SVP, Director of Business Development',           company: 'Clune Construction',         tags: ['construction', 'chicago', 'business-development'] },
  { first: 'Colin',    last: "O'Connell",   email: 'coconnell@clunegc.com',                phone: '(415) 530-4895',  mobile: '(415) 741-6078', title: 'Director, Business Development & Vice President', company: 'Clune Construction',         tags: ['construction', 'chicago', 'business-development'] },

  // ── M. A. Mortenson ────────────────────────────────────────────────────────
  { first: 'Kara',     last: 'Wallace',     email: 'kara.wallace@mortenson.com',           phone: '(763) 287-5576',  mobile: '(612) 618-5963', title: 'Business Development VP, Strategic Marketing',    company: 'M. A. Mortenson',           tags: ['construction', 'chicago', 'business-development', 'marketing'] },
  { first: 'Wendy',    last: 'Brache',      email: 'wendy.brache@mortenson.com',           phone: null,              mobile: null,             title: 'Director, Sales & Marketing',                     company: 'M. A. Mortenson',           tags: ['construction', 'chicago', 'marketing'] },
  { first: 'Steven',   last: 'Eskildsen',   email: 'steve.eskildsen@mortenson.com',        phone: '(847) 472-8182',  mobile: '(218) 329-1332', title: 'Director, Business Development',                  company: 'M. A. Mortenson',           tags: ['construction', 'chicago', 'business-development'] },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍  Looking up user ID…')
  const profiles = await sb('GET', `profiles?email=eq.${encodeURIComponent(USER_EMAIL)}&select=id,email`)
  if (!profiles?.length) throw new Error(`No profile found for ${USER_EMAIL}`)
  const userId = profiles[0].id
  console.log(`✅  Found user: ${userId}`)

  // ── Insert companies ───────────────────────────────────────────────────────
  console.log('\n🏢  Inserting companies…')
  const companyRows = COMPANIES.map(c => ({
    user_id: userId,
    name:     c.name,
    website:  c.website,
    industry: c.industry,
  }))

  // Upsert on name to avoid duplicates if script is re-run
  const insertedCompanies = await sb(
    'POST',
    'companies?on_conflict=name,user_id',
    companyRows
  ).catch(async () => {
    // Fallback: insert one at a time, skipping duplicates
    const results = []
    for (const row of companyRows) {
      try {
        const r = await sb('POST', 'companies', [row])
        results.push(...(r || []))
        process.stdout.write('.')
      } catch {
        // Check if it already exists
        const existing = await sb('GET', `companies?user_id=eq.${userId}&name=eq.${encodeURIComponent(row.name)}&select=id,name`)
        if (existing?.length) results.push(existing[0])
        process.stdout.write('s')
      }
    }
    console.log('')
    return results
  })

  // Build name → id map
  const companyMap = {}
  for (const c of (insertedCompanies || [])) companyMap[c.name] = c.id

  // Also fetch any companies we might have skipped (already existed)
  const allCompanies = await sb('GET', `companies?user_id=eq.${userId}&select=id,name`)
  for (const c of (allCompanies || [])) companyMap[c.name] = c.id

  console.log(`✅  ${Object.keys(companyMap).length} companies ready`)

  // ── Insert contacts ────────────────────────────────────────────────────────
  console.log('\n👤  Inserting contacts…')
  let inserted = 0, skipped = 0
  for (const c of CONTACTS_RAW) {
    const companyId = companyMap[c.company] || null
    const row = {
      user_id:    userId,
      first_name: c.first,
      last_name:  c.last,
      email:      c.email || null,
      phone:      c.mobile || c.phone || null,
      title:      c.title || null,
      company_id: companyId,
      notes:      `Sourced from ZoomInfo ${new Date().toISOString().slice(0,10)}. Company: ${c.company}.`,
      tags:       c.tags || [],
    }
    try {
      await sb('POST', 'contacts', [row])
      process.stdout.write('.')
      inserted++
    } catch (err) {
      if (err.message.includes('duplicate') || err.message.includes('unique')) {
        process.stdout.write('s')
        skipped++
      } else {
        console.error(`\n⚠️  ${c.first} ${c.last}: ${err.message}`)
        skipped++
      }
    }
  }

  console.log(`\n\n🎉  Done! ${inserted} contacts inserted, ${skipped} skipped (duplicates).`)
  console.log(`\n👉  View them at https://amp-crm.us/dashboard/contacts`)
}

main().catch(err => {
  console.error('\n❌  Error:', err.message)
  process.exit(1)
})
