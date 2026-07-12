/**
 * SITE CONTENT — the per-client "words" layer.
 * Components read from here; a new client edits this + tokens.css + brand-kit.
 * Photo keys map to src/assets/photos/*.jpg via src/lib/photos.ts.
 */
export const site = {
  name: "Global Emerging Leaders Forum on Democracy",
  shortName: "GELFD · 2026",
  dates: "July 27–30, 2026",
  location: "Goa, India",
  nominateEmail: "sudhanshu@centreforyouthpolicy.org",

  ctaLabel: "Nominate",
  ctaHref: "/#nominate",
  nav: [
    { label: "About", href: "/#about" },
    { label: "Why", href: "/#why" },
    { label: "Themes", href: "/#themes" },
    { label: "Format", href: "/#format" },
    { label: "Journal", href: "/blog" },
  ],
  partners: ["cyp", "kas", "fathom"] as const,

  hero: {
    lockup: "Centre for Youth Policy · Inaugural Edition · 2026",
    pill: "July 27–30, 2026 · Goa, India",
    title: "Global Emerging Leaders Forum",
    subtitle: "A closed-door retreat on the future of democracy",
    description:
      "A closed-door retreat for the next generation of democratic leaders — young elected officials, party leaders, and members of government — to think seriously and candidly about the future of democratic governance.",
    meta: [
      { value: "30", key: "Young Leaders" },
      { value: "4", key: "Days" },
      { value: "Goa", key: "Inaugural Host" },
    ],
  },

  about: {
    tag: "About the Forum",
    title: "A Different Kind of Conversation",
    body: [
      "Across democracies, there is no shortage of conferences about democracy. What is missing is a space for the people already in the room — elected officials, party leaders, members of government — to think together, off the record, across borders.",
      "The Global Emerging Leaders Forum on Democracy is that space. It is a small, curated, four-day retreat built around candid conversation rather than panels and speeches.",
      "The forum is exclusively for those already in positions of responsibility — elected representatives, party leaders, and government officials — who will shape democratic governance for decades to come.",
    ],
    tags: ["By invitation", "Off the record", "Dialogue-first", "Cross-border", "Non-partisan", "Global South", "Annual Forum"],
    asides: [
      { quote: "The people already in the room — elected officials, party leaders, members of government — rarely get to think together, off the record, across borders.", attr: "— Forum Rationale", tone: "blue" },
      { quote: "Democracy is not just under pressure in one country. The next generation of democratic leaders deserves a space to think about that — together, across borders.", attr: "— Centre for Youth Policy", tone: "pale" },
    ],
  },

  why: {
    tag: "Why This Matters",
    title: "Democracy is not inheriting itself.",
    heroPhoto: { name: "photo-89cf5da0", alt: "Young delegates in conversation at a democracy convening" },
    body: [
      "The average age of a head of government globally is over 60. In most national legislatures, power skews decades older than the populations those bodies represent.",
      "This is not simply a symbolic problem. It shapes which issues get prioritised, which time horizons feel urgent, and which futures feel possible to the people making decisions.",
      "At the same time, young people are neither passive nor disengaged. The uprisings and movements of the past decade — from Bangladesh to Chile — show a generation demanding a stake in how it is governed.",
      "The Global Emerging Leaders Forum on Democracy exists because the answer to that question should be built by the people who will live with it longest.",
    ],
    pull: "When young people in power are connected to one another and to the best available thinking, the quality of democratic decisions improves.",
    stats: [
      { num: "60+", label: "Average age of world leaders", note: "The global median age of a head of government — in a world where half the population is under 30." },
      { num: "2×", label: "The representation gap", note: "The median parliamentarian is typically twice the median age of the citizens they represent." },
      { num: "16", label: "Heads of government under 35", note: "Out of 193 UN member states — tracked by CYP's Global Youth Tracker across 220 countries." },
    ],
    statPhoto: { name: "photo-d43bec8a", alt: "Delegates at the Youth & Democracy Conference" },
    statCaption: "Youth & Democracy Conference 2026 · Marwadi University",
  },

  mosaic: {
    tag: "From Our Work",
    title: "What This Looks Like in Practice",
    lead: "The forum grows out of CYP's existing convening work — including the annual Youth & Democracy Conference, co-hosted with Konrad-Adenauer-Stiftung.",
    tiles: [
      { name: "photo-21511553", alt: "Conference plenary", tall: true },
      { name: "photo-b98562d3", alt: "Delegates in discussion" },
      { name: "photo-dd7ad9a5", alt: "Speaker addressing the room" },
      { name: "photo-b8f07b2e", alt: "Roundtable conversation" },
      { name: "photo-08d30e90", alt: "Participants networking" },
      { name: "photo-f147dba4", alt: "Panel session" },
      { name: "photo-345752b5", alt: "Delegates outdoors", tall: true },
      { name: "photo-89cf5da0", alt: "Group of young leaders" },
    ],
    caption: "Youth & Democracy Conference 2026 · Marwadi University, India · Co-hosted with Konrad-Adenauer-Stiftung",
  },

  who: {
    tag: "Participants",
    title: "Who Is in the Room",
    lead: "The forum brings together 30–35 young leaders who are already in positions of democratic responsibility — chosen for the seat they hold, not the title they aspire to.",
    cards: [
      { icon: "🏛️", title: "Elected Representatives", desc: "Young parliamentarians, legislators, mayors, and municipal leaders from democracies around the world.", eg: "Parliamentarians · Legislators · Mayors · Local Officials" },
      { icon: "🎯", title: "Political Party Leaders", desc: "Young leaders within political parties — secretaries-general, youth wing leaders, and parliamentary group figures.", eg: "Party Officials · Youth Wing Leaders · Political Strategists · Parliamentary Group Leaders" },
      { icon: "⚖️", title: "Government Officials", desc: "Young ministers, deputy ministers, senior advisers, and officials working inside government.", eg: "Junior Ministers · Government Advisers · Senior Officials · Parliamentary Secretaries" },
    ],
  },

  themes: {
    tag: "Discussion Themes",
    title: "What We Talk About",
    lead: "Each session is built around a question that young democratic leaders actually face — not an abstract theme, but a live problem.",
    items: [
      { title: "Pathways to Political Leadership", body: "What does it actually take to enter and sustain a democratic political career — and what stands in the way?" },
      { title: "Youth, Trust & Legitimacy", body: "Why are young people disengaging from formal political participation across democracies, and what rebuilds trust?" },
      { title: "Technology, Media & Democracy", body: "How is digital communication reshaping democratic discourse globally — and what should leaders do about it?" },
      { title: "Institutions Under Pressure", body: "How do democratic institutions hold up under strain across different systems? What makes them resilient?" },
      { title: "India & the Democratic World", body: "What can emerging leaders from the Global South, Europe, and beyond learn from each other's democracies?" },
      { title: "What Leadership Looks Like Now", body: "What does democratic leadership mean for a generation that will shape governance for the next fifty years?" },
    ],
  },

  format: {
    tag: "How It Works",
    title: "The Format",
    lead: "Four days. No lecterns. No speeches. Thirty people from across the democratic world, in one room, talking honestly.",
    days: [
      { label: "Mon", theme: "Arrival & Opening", text: "Welcome tea · Opening dinner conversation: <em>Why Democracy Needs This Generation</em> · Cultural programme" },
      { label: "Tue", theme: "Democracy in Practice", text: "Roundtables on political leadership pathways and youth participation · Afternoon working sessions" },
      { label: "Wed", theme: "Democratic Futures", text: "University engagement session with 500+ students · Cross-border Democracy Lab · Evening dialogue" },
      { label: "Thu", theme: "Reflection & Departure", text: "Roundtable: <em>What we take back</em> · Drafting a joint participant communiqué · Departures by noon" },
    ],
    principles: [
      { icon: "🔒", title: "Chatham House Rule", text: "All sessions operate under strict confidentiality. Ideas travel; attributions don't." },
      { icon: "🪑", title: "Facilitated, Not Chaired", text: "No panels, no speeches. Every participant is a contributor, not an audience member." },
      { icon: "🌐", title: "International Perspective, Indian Centre", text: "Participants come from across the democratic world, convened in India — a bridge between the Global South and beyond." },
      { icon: "✍️", title: "A Communiqué You Write", text: "The forum closes with participants drafting a shared statement in their own words." },
    ],
  },

  location: {
    tag: "Venue · Inaugural Edition",
    title: "Goa, India · July 27–30, 2026",
    lead: "The inaugural edition of the Global Emerging Leaders Forum on Democracy is hosted in Goa — a residential retreat away from the noise of the capital.",
    cards: [
      { badge: "Format", name: "Closed-door retreat", text: "Residential format — participants stay together for the full four days, sharing meals and conversation.", accent: "cyan" },
      { badge: "An Annual Forum", name: "Rotating host cities", text: "Each edition will be hosted in a different democratic city, building a network that spans continents.", accent: "amber" },
    ],
  },

  outcomes: {
    tag: "What This Produces",
    title: "From the Forum",
    lead: "The forum is designed to produce things that outlast the four days — records, relationships, and a network that keeps working.",
    items: [
      { title: "Forum Report", text: "A published report documenting key discussions and cross-border insights, co-produced with our partners." },
      { title: "Joint Communiqué", text: "A participant-authored statement on democratic governance — drafted on the final day, in their own words." },
      { title: "A Peer Network", text: "30–35 emerging democratic leaders from across the world with lasting relationships and open channels." },
      { title: "Campus Reach", text: "A Saturday session at a host-city university, connecting 500+ young citizens directly to the conversation." },
      { title: "An Annual Forum", text: "The 2026 forum is the inaugural edition of what we intend to be an annual gathering, in a new city each year." },
      { title: "A Dedicated Growth Team", text: "Each participant receives bespoke support from our in-house production team — profiles, media, and follow-through that extend the forum's impact past the four days." },
    ],
  },

  nominate: {
    tag: "Nominations",
    title: "Know Someone Who Belongs in This Room?",
    lead: "The forum is by invitation — but nominations are open. If you know a young leader who should be here, tell us why.",
    criteria: [
      { icon: "🏛️", title: "Elected Representatives", text: "Young parliamentarians, legislators, mayors, and local officials from any country, party, or region." },
      { icon: "📚", title: "Democracy Scholars", text: "Early- and mid-career academics working on democratic governance, elections, and institutions." },
      { icon: "🌱", title: "Civil Society Leaders", text: "Practitioners from think tanks, civic organisations, journalism, and movements strengthening democracy." },
    ],
    selection: {
      eyebrow: "Selection Criteria",
      text: "Participants are selected for their emerging leadership potential, commitment to democratic values, and the perspective they bring from their own political context.",
    },
  },

  contact: {
    tag: "Get Involved",
    title: "Be Part of This",
    body: [
      "The forum is by invitation, and exclusively for those already in positions of democratic responsibility. If that's you — or someone you know — we want to hear from you.",
      "We are open to conversations with organisations, universities, and government partners who share the mission of strengthening democracy across generations.",
    ],
    links: [
      { icon: "✉️", label: "Email us", val: "forum@centreforyouthpolicy.org", href: "mailto:forum@centreforyouthpolicy.org" },
      { icon: "🌐", label: "Website", val: "centreforyouthpolicy.org", href: "https://centreforyouthpolicy.org" },
    ],
    knowledgePartner: {
      eyebrow: "Knowledge Partner",
      logo: "kas",
      text: "The Global Emerging Leaders Forum is organised in partnership with Konrad-Adenauer-Stiftung.",
      tagline: "Shaping. Democracy. Together.",
    },
    convener: {
      logo: "cyp",
      text: "The Centre for Youth Policy is an independent, non-partisan research institution dedicated to youth participation in democratic life.",
    },
  },

  footer: {
    address: "Centre for Youth Policy · Washington, D.C.",
    edition: "Global Emerging Leaders Forum on Democracy · Inaugural Edition 2026",
    fine: "By invitation · Off the record · Non-partisan.",
  },
} as const;

export const LOGO_META: Record<string, { src: string; alt: string }> = {
  cyp: { src: "/logos/cyp.svg", alt: "Centre for Youth Policy" },
  kas: { src: "/logos/kas.svg", alt: "Konrad-Adenauer-Stiftung" },
  fathom: { src: "/logos/fathom.svg", alt: "Fathom" },
};
