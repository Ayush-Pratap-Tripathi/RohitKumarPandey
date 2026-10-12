// Everything the portfolio says lives here, so copy edits never require touching components.
// Text wrapped in *asterisks* renders as the italic serif accent.

export const profile = {
  name: 'Rohit Kumar Pandey',
  firstName: 'Rohit',
  title: 'UI/UX Designer & Video Editor',
  location: 'India',
  timeZone: 'Asia/Kolkata',
  timeZoneLabel: 'IST',
  email: 'rohituiux45@gmail.com',
  phone: '+91 62051 92103',
  phoneHref: 'tel:+916205192103',
  linkedin: 'https://www.linkedin.com/in/rohit-pandey-5544a819',
  linkedinLabel: 'in/rohit-pandey-5544a819',
  resume: '/Rohit-Kumar-Pandey-Resume.pdf',
  portrait: '/media/rohit-kumar-pandey.webp',
  portraitSmall: '/media/rohit-kumar-pandey-640.webp',
  availability: ['Full-time', 'Remote', 'Open to relocation'],
  languages: ['English', 'Hindi'],
}

export const nav = [
  { id: 'work', label: 'Work' },
  { id: 'process', label: 'Process' },
  { id: 'design', label: 'Design' },
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'experience', label: 'Experience' },
]

export const hero = {
  statement: 'I design interfaces people understand — and cut films people watch to the last frame.',
  sub: 'UI/UX designer and AI-assisted video editor. Six years across product design, motion and the edit.',
  meta: [
    { label: 'Experience', value: '6 years' },
    { label: 'Disciplines', value: 'UI/UX · Video · Motion' },
    { label: 'Based in', value: 'India · IST' },
    { label: 'Status', value: 'Open to work', live: true },
  ],
}

export const marquee = [
  'User flows',
  'Wireframes',
  'Hi-fi prototypes',
  'Video editing',
  'Motion titles',
  'AI-generated films',
  'Reels & shorts',
  'Figma',
  'Premiere Pro',
  'After Effects',
  'Design handoff',
  'Brand visuals',
]

export const about = {
  statement:
    "I'm Rohit — I think in *frames*. For nearly three years at Condigence LLP I turned business requirements into user flows, wireframes and high-fidelity Figma prototypes. Before that, three years of freelance work taught me logos, motion and *the edit*. Today I bring both crafts to the table: product thinking for interfaces, story and rhythm for video — and AI to move faster in between.",
  disciplines: [
    {
      id: 'design',
      index: 'A',
      title: 'Product design',
      body: 'User flows, information architecture, wireframes, high-fidelity prototypes and reusable components — handed off cleanly to developers.',
      tools: ['Figma', 'FigJam', 'Adobe XD'],
    },
    {
      id: 'edit',
      index: 'B',
      title: 'Video editing',
      body: 'Story-led cuts, motion titles, lower-thirds, punch-ins and speed ramps — delivered for every screen, from cinema-wide to vertical.',
      tools: ['Premiere Pro', 'After Effects', 'Photoshop'],
    },
    {
      id: 'ai',
      index: 'C',
      title: 'AI in the loop',
      body: 'AI-generated scenes with consistent characters, faster clean-up passes, and front-end prototypes built alongside AI coding tools.',
      tools: ['AI video & image', 'Claude Code', 'Copilot'],
    },
  ],
}

// Durations/fps come from ffprobe; chapter times were placed by reviewing the film frame by frame.
export const videos = [
  {
    id: 'wedding-film',
    title: 'Wedding Invitation Film',
    kicker: 'AI film · Edit · Motion titles',
    summary: 'A cinematic invite that walks guests through every ceremony — from the first blessing to the wedding dinner.',
    description:
      'AI-generated scenes with the same couple held consistent across fifteen beats, hand-built calligraphy titles, a date-and-venue lower-third system, and cuts timed to the music.',
    format: '16:9',
    resolution: '1080p',
    width: 1920,
    height: 1080,
    duration: 101.9,
    fps: 30,
    sources: [
      { src: '/media/wedding-film-1080.mp4', minWidth: 1100 },
      { src: '/media/wedding-film-720.mp4', minWidth: 0 },
    ],
    preview: '/media/wedding-film-preview.mp4',
    previewSmall: '/media/wedding-film-preview-sm.mp4',
    poster: '/media/wedding-film-poster.webp',
    posterSmall: '/media/wedding-film-poster-900.webp',
    role: ['AI scene direction', 'Edit', 'Motion design'],
    tags: ['AI-generated scenes', 'Character consistency', 'Motion typography', 'Lower-thirds', 'Music-led cut'],
    chapters: [
      { t: 0, title: 'Blessings', thumb: '/media/scenes/scene-01.webp' },
      { t: 3, title: 'Two hearts', thumb: '/media/scenes/scene-02.webp' },
      { t: 6, title: 'The couple', thumb: '/media/scenes/scene-03.webp' },
      { t: 16, title: 'Two families', thumb: '/media/scenes/scene-04.webp' },
      { t: 20, title: 'Mata Ki Chowki', thumb: '/media/scenes/scene-05.webp' },
      { t: 27, title: 'Mehandi', thumb: '/media/scenes/scene-06.webp' },
      { t: 35, title: 'Haldi', thumb: '/media/scenes/scene-07.webp' },
      { t: 43, title: 'Ring ceremony', thumb: '/media/scenes/scene-08.webp' },
      { t: 49, title: 'Ghudchadi', thumb: '/media/scenes/scene-09.webp' },
      { t: 55, title: 'Phere', thumb: '/media/scenes/scene-10.webp' },
      { t: 62, title: 'Baraat', thumb: '/media/scenes/scene-11.webp' },
      { t: 72, title: 'Grand celebration', thumb: '/media/scenes/scene-12.webp' },
      { t: 77, title: 'Wedding dinner', thumb: '/media/scenes/scene-13.webp' },
      { t: 84, title: 'With love', thumb: '/media/scenes/scene-14.webp' },
      { t: 96, title: 'End card', thumb: '/media/scenes/scene-15.webp' },
    ],
  },
  {
    id: 'talking-head-reel',
    title: 'Talking-Head Podcast Reel',
    kicker: 'Short-form · Retention edit',
    summary:
      'Built to hold attention: multi-angle cuts, punch-ins on key lines and formula overlays that illustrate the point as it is spoken.',
    format: '9:16',
    resolution: '850p',
    width: 478,
    height: 850,
    duration: 42.3,
    fps: 60,
    sources: [{ src: '/media/talking-head-reel.mp4', minWidth: 0 }],
    preview: '/media/talking-head-reel-preview.mp4',
    poster: '/media/talking-head-reel-poster.webp',
    tags: ['Multi-angle', 'Punch-ins', 'Motion graphics'],
  },
  {
    id: 'night-run-spec-ad',
    title: 'Night Run — Sneaker Spec Ad',
    kicker: 'Spec commercial · AI-generated',
    summary:
      'A rain-soaked city, slow-motion splashes, speed-ramped strides and a clean product hero to close. Concept piece, not a commissioned brand spot.',
    format: '9:16',
    resolution: '850p',
    width: 478,
    height: 850,
    duration: 24.2,
    fps: 60,
    sources: [{ src: '/media/night-run-spec-ad.mp4', minWidth: 0 }],
    preview: '/media/night-run-spec-ad-preview.mp4',
    poster: '/media/night-run-spec-ad-poster.webp',
    tags: ['Spec ad', 'AI generation', 'Speed ramps', 'Product hero'],
  },
  {
    id: 'activewear-fit-check',
    title: 'Activewear Fit Check',
    kicker: 'E-commerce · Cinema-wide',
    summary: 'A five-second product spot in 2.39:1 — lifestyle framing and kinetic captions that sell the fit fast.',
    format: '2.39:1',
    resolution: '544p',
    width: 1280,
    height: 544,
    duration: 4.9,
    fps: 24,
    sources: [{ src: '/media/activewear-fit-check.mp4', minWidth: 0 }],
    preview: '/media/activewear-fit-check-preview.mp4',
    poster: '/media/activewear-fit-check-poster.webp',
    tags: ['E-commerce', 'AI-assisted', 'Kinetic type'],
  },
]

// The AI-assisted video pipeline, rendered as a scroll-scrubbed edit timeline.
// `span` is the clip's share of the timeline (sums to 100).
export const pipeline = [
  {
    id: 'brief',
    title: 'Brief & script',
    span: 14,
    body: 'Pin down the story, the audience and where it will play — an invite, a launch, a thirty-second reel.',
    ai: 'Hooks, script drafts and shot lists sketched with AI, then rewritten by hand.',
    tools: ['Script', 'Shot list'],
    visual: 'script',
  },
  {
    id: 'generate',
    title: 'Generate',
    span: 19,
    body: 'Build the world: scenes, characters and B-roll that match the brief — and each other.',
    ai: 'AI image & video generation, with characters held consistent from shot to shot.',
    tools: ['AI video', 'AI image'],
    visual: 'generate',
  },
  {
    id: 'assemble',
    title: 'Assembly cut',
    span: 18,
    body: 'Lay the story to music, find the rhythm, and cut anything that does not earn its seconds.',
    tools: ['Premiere Pro'],
    visual: 'assemble',
  },
  {
    id: 'motion',
    title: 'Motion & type',
    span: 18,
    body: 'Title cards, lower-thirds, punch-ins, speed ramps and transitions — motion that serves the story.',
    tools: ['After Effects', 'Premiere Pro'],
    visual: 'motion',
  },
  {
    id: 'polish',
    title: 'Polish',
    span: 16,
    body: 'Colour, sound and a frame-by-frame pass for anything that breaks the illusion.',
    ai: 'AI upscaling, denoise, speech clean-up and auto-captions.',
    tools: ['Colour', 'Sound', 'Captions'],
    visual: 'polish',
  },
  {
    id: 'deliver',
    title: 'Deliver',
    span: 15,
    body: 'Versions for every placement — cinema-wide, landscape and vertical, each framed on purpose.',
    ai: 'AI-assisted reframing, re-checked shot by shot.',
    tools: ['16:9', '9:16', '2.39:1'],
    visual: 'deliver',
  },
]

export const caseStudies = [
  {
    id: 'maacko',
    index: '01',
    name: 'Maacko',
    tagline: 'Hyperlocal multi-vendor marketplace',
    org: 'Condigence LLP',
    role: 'UI/UX Designer',
    scope: 'Customer · Vendor · Admin',
    summary:
      'End-to-end customer, vendor and admin experience for a hyperlocal marketplace spanning electronics, e-scooters, women’s clothing and ornaments.',
    deliverables: [
      'Workflow mapping',
      'Wireframes',
      'Dashboards',
      'Product & order flows',
      'Profile screens',
      'Responsive hi-fi UI',
    ],
    outcome: 'Streamlined the product-buying journey using feedback from prototype reviews.',
    categories: ['Electronics', 'E-scooters', 'Women’s clothing', 'Ornaments'],
    board: 'Flow map',
    lanes: [
      { role: 'Customer', tone: 'lilac', steps: ['Browse', 'Product', 'Cart', 'Checkout', 'Track order'] },
      { role: 'Vendor', tone: 'peach', steps: ['Dashboard', 'Products', 'Orders', 'Profile'] },
      { role: 'Admin', tone: 'mint', steps: ['Dashboard', 'Vendors', 'Catalogue', 'Orders'] },
    ],
  },
  {
    id: 'neerseva',
    index: '02',
    name: 'NeerSeva',
    tagline: 'Water management & service platform',
    org: null,
    role: 'UI/UX Designer',
    scope: 'Service requests · Monitoring',
    summary:
      'Complete UI, user flows, wireframes and high-fidelity prototypes for a platform built around service requests and monitoring.',
    deliverables: ['User flows', 'Wireframes', 'Complete UI', 'Hi-fi prototypes'],
    outcome: 'Usability and accessibility first: simple navigation, clear hierarchy and intuitive interactions.',
    principles: ['Simple navigation', 'Clear hierarchy', 'Intuitive interactions', 'Accessibility'],
    statuses: ['Submitted', 'In review', 'In progress', 'Resolved'],
    board: 'Service flow',
    lanes: [
      { role: 'Requests', tone: 'sky', steps: ['Raise request', 'Track status', 'Resolved', 'Feedback'] },
      { role: 'Monitoring', tone: 'lilac', steps: ['Overview', 'Alerts', 'History'] },
    ],
  },
]

export const designProcess = [
  { title: 'Discover', note: 'Requirement calls, user research', tone: 'lilac' },
  { title: 'Map', note: 'User flows, IA, journeys', tone: 'peach' },
  { title: 'Wireframe', note: 'Structure before style', tone: 'mint' },
  { title: 'Prototype', note: 'Hi-fi, responsive, clickable', tone: 'sky' },
  { title: 'Test', note: 'Reviews & usability rounds', tone: 'lilac' },
  { title: 'Hand off', note: 'Specs, components, QA', tone: 'peach' },
]

export const tools = [
  { mono: 'Fi', name: 'Figma', use: 'UI, components & prototypes', group: 'Design' },
  { mono: 'Fj', name: 'FigJam', use: 'Flows, journeys & workshops', group: 'Design' },
  { mono: 'Xd', name: 'Adobe XD', use: 'Wireframes & prototypes', group: 'Design' },
  { mono: 'Pr', name: 'Premiere Pro', use: 'Video editing & storytelling', group: 'Video' },
  { mono: 'Ae', name: 'After Effects', use: 'Animation & motion titles', group: 'Video' },
  { mono: 'Ps', name: 'Photoshop', use: 'Banners, templates & photo work', group: 'Visual' },
  { mono: 'Ai', name: 'Illustrator', use: 'Logos & vector artwork', group: 'Visual' },
  { mono: 'Gn', name: 'AI video & image', use: 'Scenes, B-roll & clean-up', group: 'AI' },
  { mono: 'Cc', name: 'Claude Code', use: 'AI pair-programming', group: 'AI' },
  { mono: 'Co', name: 'Copilot', use: 'AI code assistance', group: 'AI' },
  { mono: '</>', name: 'HTML · CSS · JS', use: 'Designs that build cleanly', group: 'Code' },
  { mono: 'Fl', name: 'Flutter & Dart', use: 'Currently learning', group: 'Code', learning: true },
]

export const skills = [
  {
    title: 'UX design',
    items: [
      'User research',
      'Usability testing',
      'User flows',
      'Information architecture',
      'Wireframing',
      'Prototyping',
      'Journey mapping',
    ],
  },
  {
    title: 'UI design',
    items: [
      'Responsive design',
      'Visual hierarchy',
      'Typography',
      'Colour theory',
      'Interaction design',
      'Accessibility',
      'Reusable components',
    ],
  },
  {
    title: 'Visual & motion',
    items: ['Video editing', 'AI-assisted production', 'Animation', 'Logo design', 'Banner design', 'Template design'],
  },
  {
    title: 'Collaboration',
    items: ['Design handoff', 'Developer collaboration', 'Requirement analysis', 'Agile', 'Documentation'],
  },
]

// Career timeline. `from`/`to` are fractional years for placing clips on the track.
export const experience = [
  {
    id: 'condigence',
    role: 'UI/UX Designer',
    org: 'Condigence LLP',
    note: 'Software agency',
    period: 'Nov 2023 — Aug 2026',
    from: 2023.84,
    to: 2026.62,
    track: 'Work',
    points: [
      'Designed UI/UX for the agency’s client web and app products — turning business and user requirements into user flows, wireframes, high-fidelity screens and interactive Figma prototypes.',
      'Built reusable Figma components and patterns that kept responsive layouts consistent across products.',
      'Worked with developers and stakeholders through requirement discussions, design reviews, handoff and implementation feedback, using front-end fundamentals to keep designs practical to build.',
      'Simplified complex workflows through user-focused problem analysis and prototype iteration.',
    ],
  },
  {
    id: 'freelance',
    role: 'Freelance Designer & Video Editor',
    org: 'Self-employed',
    note: 'Graphic, UI & video',
    period: 'Aug 2020 — Oct 2023',
    from: 2020.6,
    to: 2023.8,
    track: 'Work',
    points: [
      'Designed UI screens for client projects and owned each engagement from brief to final delivery.',
      'Created logos, banners and templates for multiple clients in Illustrator and Photoshop.',
      'Edited videos in Premiere Pro and produced animations in After Effects.',
    ],
  },
  {
    id: 'education',
    role: 'Bachelor of Arts (B.A.)',
    org: 'J.N. College, Dhurwa',
    note: 'Ranchi University',
    period: '2017 — 2020',
    from: 2017.5,
    to: 2020.5,
    track: 'Study',
    points: [],
  },
]
