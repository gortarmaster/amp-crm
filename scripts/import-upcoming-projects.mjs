/**
 * Upcoming Projects Importer — amp-crm
 * Run with: node scripts/import-upcoming-projects.mjs
 *
 * Inserts recon-sourced upcoming projects (status: 'lead') into the
 * projects table, links them to companies, connects relevant contacts,
 * and records sources in project_sources.
 *
 * Only projects NOT yet open/delivered as of May 2026 are included.
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
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text}`)
  return text ? JSON.parse(text) : null
}

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ─── Upcoming projects (not yet open as of May 2026) ─────────────────────────
//
// Fields:
//   company      → matches the name in your companies table
//   contacts     → email addresses of contacts to link (already in your CRM)
//   category     → Higher Education | K-12 Education | Multifamily | Hospitality |
//                   Commercial | Civic | Religious | Mixed-Use | Brewery
//   shoot_date   → null if unknown, otherwise first day of expected window (YYYY-MM-DD)
//   sources      → [{ label, url }] — clickable research sources

const PROJECTS = [
  // ── Balfour Beatty ─────────────────────────────────────────────────────────
  {
    title:        'Rollins College East End — Student Housing',
    company:      'Balfour Beatty',
    location:     'Winter Park, FL',
    category:     'Higher Education',
    description:  '$54M student housing project for Rollins College on the East End neighborhood. 2026 delivery.',
    shoot_date:   '2026-09-01',
    internal_notes: 'Expected completion Fall 2026. $54M project. Strong visual candidate — campus residential. Reach out to Genevieve Woodrow or Martin Driscoll.',
    contacts:     ['gwoodrow@balfourbeattyus.com', 'mdriscoll@balfourbeattyus.com'],
    sources: [
      { label: 'Balfour Beatty — Rollins College project announcement', url: 'https://www.balfourbeattyus.com/our-work/news/balfour-beatty-breaks-ground-on-rollins-college-student-housing' },
      { label: 'Balfour Beatty Florida projects overview', url: 'https://www.balfourbeattyus.com/our-work/projects' },
    ],
  },
  {
    title:        'Crooked Can Brewery — Minneola',
    company:      'Balfour Beatty',
    location:     'Minneola, FL',
    category:     'Hospitality',
    description:  'New 40,000 SF brewery for Crooked Can. Completing Spring 2026.',
    shoot_date:   '2026-06-01',
    internal_notes: 'Expected completion Spring 2026 (may be finishing now). 40,000 SF new construction brewery. Great hospitality shoot.',
    contacts:     ['gwoodrow@balfourbeattyus.com', 'mdriscoll@balfourbeattyus.com'],
    sources: [
      { label: 'Balfour Beatty — Florida $70M projects news', url: 'https://www.balfourbeattyus.com/our-work/news' },
      { label: 'Crooked Can Brewing Company', url: 'https://www.crookedcan.com' },
    ],
  },
  {
    title:        'Asana Partners — Minnesota Row Business Center',
    company:      'Balfour Beatty',
    location:     'Winter Park, FL',
    category:     'Commercial',
    description:  'Adaptive reuse of 6-building center into mixed-use office, retail, and F&B. Expected Spring 2026.',
    shoot_date:   '2026-06-01',
    internal_notes: 'Expected completion Spring 2026 (may be finishing now). Six-building adaptive reuse — office, retail, food & beverage. Strong architectural + commercial interiors shoot.',
    contacts:     ['gwoodrow@balfourbeattyus.com', 'mdriscoll@balfourbeattyus.com'],
    sources: [
      { label: 'Balfour Beatty — Florida $70M projects news', url: 'https://www.balfourbeattyus.com/our-work/news' },
      { label: 'Asana Partners — Minnesota Row', url: 'https://www.asanapartners.com' },
    ],
  },

  // ── SchenkelShultz ─────────────────────────────────────────────────────────
  {
    title:        'Booker Visual & Performing Arts Center',
    company:      'SchenkelShultz Architecture',
    location:     'Sarasota, FL',
    category:     'K-12 Education',
    description:  'Renovation of Booker High School\'s Visual Performing Arts Center for Sarasota County Schools. In progress.',
    shoot_date:   null,
    internal_notes: 'In progress as of early 2026. No confirmed completion date yet. AIA 2025 award winner for related work — firm is active and shooting. Reach out to Aaron Jacobson or Patrick Rauch for timeline.',
    contacts:     ['ajacobson@schenkelshultz.com', 'prauch@schenkelshultz.com'],
    sources: [
      { label: 'SchenkelShultz — Projects', url: 'https://www.schenkelshultz.com/projects' },
      { label: 'SchenkelShultz — News & Awards', url: 'https://www.schenkelshultz.com/news' },
    ],
  },
  {
    title:        'Palmetto High School Addition',
    company:      'SchenkelShultz Architecture',
    location:     'Palmetto, FL',
    category:     'K-12 Education',
    description:  'Addition for Palmetto High School, School District of Manatee County. In progress.',
    shoot_date:   null,
    internal_notes: 'In progress as of early 2026. No confirmed date. SchenkelShultz expanding Sarasota team — active pipeline in the region.',
    contacts:     ['ajacobson@schenkelshultz.com', 'prauch@schenkelshultz.com'],
    sources: [
      { label: 'SchenkelShultz — Projects', url: 'https://www.schenkelshultz.com/projects' },
      { label: 'Learning By Design — Palmetto HS coverage', url: 'https://www.learningbydesign.com' },
    ],
  },
  {
    title:        'Orangewood Church & Christian School Expansion',
    company:      'SchenkelShultz Architecture',
    location:     'Orlando, FL',
    category:     'Religious',
    description:  'Significant expansion and renovation of Orangewood Church and Christian School campus. Selected February 2025.',
    shoot_date:   null,
    internal_notes: 'Just selected Feb 2025 — early design phase. Long lead. Good relationship-building opportunity now.',
    contacts:     ['ajacobson@schenkelshultz.com', 'prauch@schenkelshultz.com'],
    sources: [
      { label: 'SchenkelShultz — Orangewood Church press release (Feb 2025)', url: 'https://www.schenkelshultz.com/news' },
      { label: 'Orangewood Church', url: 'https://www.orangewood.org' },
    ],
  },

  // ── Wharton-Smith ──────────────────────────────────────────────────────────
  {
    title:        'Marion County High School — New Campus',
    company:      'Wharton-Smith',
    location:     'Marion County, FL',
    category:     'K-12 Education',
    description:  'First new Marion County high school since 2003. 3-building complex, tilt wall construction. 346,000 SF. Opens August 2026.',
    shoot_date:   '2026-08-01',
    internal_notes: 'Grand opening August 2026. First new HS in Marion County in 23 years — major milestone project, high-profile ribbon cutting. 346,000 SF across 3 building complexes. Reach out now to be on their radar.',
    contacts:     ['d.winters@whartonsmith.com', 'mpassarella@whartonsmith.com'],
    sources: [
      { label: 'Wharton-Smith — Marion County High School news (Jan 2025)', url: 'https://www.whartonsmith.com/news' },
      { label: 'Wharton-Smith — Projects', url: 'https://www.whartonsmith.com/projects' },
    ],
  },
  {
    title:        'AAA High School Campus',
    company:      'Wharton-Smith',
    location:     'Florida',
    category:     'K-12 Education',
    description:  '9-building, 346,000 SF campus. Topped out August 2025, expected opening 2026.',
    shoot_date:   '2026-07-01',
    internal_notes: 'Topped out August 2025, opens 2026. 9 permanent buildings, 346,000 SF. Strong documentation opportunity.',
    contacts:     ['d.winters@whartonsmith.com', 'mpassarella@whartonsmith.com', 'churst@whartonsmith.com'],
    sources: [
      { label: 'Wharton-Smith — News', url: 'https://www.whartonsmith.com/news' },
    ],
  },

  // ── Forum Architecture ─────────────────────────────────────────────────────
  {
    title:        'Northhaven — Multifamily',
    company:      'Forum Architecture & Interior Design',
    location:     'Sanford, FL',
    category:     'Multifamily',
    description:  'Multifamily residential development in Sanford, FL. In progress.',
    shoot_date:   null,
    internal_notes: 'In progress. Exact completion unknown. Forum has 90% repeat client rate and active FL pipeline. Contact Bethany Sciortino (BD Director) for timeline.',
    contacts:     ['bsciortino@forumarchitecture.com', 'jblack@forumarchitecture.com'],
    sources: [
      { label: 'Forum Architecture — Projects', url: 'https://www.forumarchitecture.com/projects' },
      { label: 'Forum Architecture — Northhaven', url: 'https://www.forumarchitecture.com/projects/northhaven' },
    ],
  },
  {
    title:        'Heritage Oaks — Multifamily',
    company:      'Forum Architecture & Interior Design',
    location:     'Largo, FL',
    category:     'Multifamily',
    description:  'Multifamily residential development in Largo, FL. In progress.',
    shoot_date:   null,
    internal_notes: 'In progress. Exact completion unknown. Forum specializes in multifamily across FL and Southeast. Contact Bethany Sciortino for timeline.',
    contacts:     ['bsciortino@forumarchitecture.com', 'afroelicher@forumarchitecture.com'],
    sources: [
      { label: 'Forum Architecture — Projects', url: 'https://www.forumarchitecture.com/projects' },
      { label: 'Forum Architecture — Heritage Oaks', url: 'https://www.forumarchitecture.com/projects/heritage-oaks' },
    ],
  },
]

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍  Looking up user ID…')
  const profiles = await sb('GET', `profiles?email=eq.${encodeURIComponent(USER_EMAIL)}&select=id`)
  if (!profiles?.length) throw new Error(`No profile found for ${USER_EMAIL}`)
  const userId = profiles[0].id
  console.log(`✅  User: ${userId}`)

  // Fetch all companies for this user
  console.log('🏢  Fetching companies…')
  const companies = await sb('GET', `companies?user_id=eq.${userId}&select=id,name`)
  const companyMap = {}
  for (const c of companies || []) companyMap[c.name] = c.id
  console.log(`✅  ${Object.keys(companyMap).length} companies loaded`)

  // Fetch all contacts for this user (to build email → id map)
  console.log('👤  Fetching contacts…')
  const contacts = await sb('GET', `contacts?user_id=eq.${userId}&select=id,email`)
  const contactMap = {}
  for (const c of contacts || []) if (c.email) contactMap[c.email] = c.id
  console.log(`✅  ${Object.keys(contactMap).length} contacts loaded`)

  // Insert projects
  console.log('\n📋  Inserting projects…')
  let inserted = 0, skipped = 0

  for (const p of PROJECTS) {
    const companyId = companyMap[p.company] || null
    if (!companyId) console.warn(`  ⚠️  No company found for "${p.company}" — inserting without company link`)

    const slug = slugify(`${p.title}-${Date.now()}`)

    const row = {
      user_id:           userId,
      title:             p.title,
      status:            'lead',
      company_id:        companyId,
      location:          p.location || null,
      category:          p.category || null,
      description:       p.description || null,
      shoot_date:        p.shoot_date || null,
      internal_notes:    p.internal_notes || null,
      slug,
      portfolio_visible: false,
      client_gallery_enabled: false,
    }

    let projectId = null
    try {
      const result = await sb('POST', 'projects', [row])
      projectId = result?.[0]?.id
      process.stdout.write('.')
      inserted++
    } catch (err) {
      if (err.message.includes('duplicate') || err.message.includes('unique')) {
        process.stdout.write('s')
        skipped++
        continue
      }
      console.error(`\n⚠️  "${p.title}": ${err.message}`)
      skipped++
      continue
    }

    // Link contacts via project_contacts junction table
    if (projectId && p.contacts?.length) {
      for (const email of p.contacts) {
        const contactId = contactMap[email]
        if (!contactId) { process.stdout.write('?'); continue }
        try {
          await sb('POST', 'project_contacts', [{ project_id: projectId, contact_id: contactId, role: 'key contact' }])
        } catch {
          // ignore duplicate junction rows
        }
      }
    }

    // Insert sources
    if (projectId && p.sources?.length) {
      const sourceRows = p.sources.map(s => ({
        project_id: projectId,
        label: s.label,
        url: s.url || null,
      }))
      try {
        await sb('POST', 'project_sources', sourceRows)
      } catch (err) {
        console.error(`\n⚠️  Sources for "${p.title}": ${err.message}`)
      }
    }
  }

  console.log(`\n\n🎉  Done! ${inserted} projects inserted, ${skipped} skipped.`)
  console.log(`\n👉  View them at https://amp-crm.us/dashboard/projects`)
}

main().catch(err => {
  console.error('\n❌  Error:', err.message)
  process.exit(1)
})
