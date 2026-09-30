export const dict = {
  en: {
    sub: 'An editorial space for art, sound, fashion, and lifestyle. Curated by VYN. Engaged by the movement.',
    issue: 'ISSUE 01 — EST. 2026',
    latest: 'The Latest',
    events: 'Gatherings',
    shop: 'Objects & Tickets',
    admin: 'Editorial Desk',
    login: 'Access VYN',
    enter: 'Enter',
    fTitle: 'Title',
    fCat: 'Category',
    fImg: 'Media URL',
    fCopy: 'Copy',
    fBtn: 'Publish to Journal',
    ev1Date: 'JUL 12 • LILONGWE',
    ev1Title: 'Sound & Canvas Live',
    ev1Price: 'Free / VIP MWK 5,000',
    ev2Date: 'AUG 03 • BLANTYRE',
    ev2Title: 'Afro-Modern Showcase',
    ev2Price: 'MWK 3,500',
    merch1Cat: 'APPAREL',
    merch1Title: 'Heritage Tee',
    merch2Cat: 'MUSIC',
    merch2Title: 'Roots & Resonance',
    pollTab: 'Polls',
    archiveTab: 'Archive',
  },
  ny: {
    sub: 'Malo olembedwa a zojambula, nyimbo, mafashoni, ndi moyo. Opangidwa ndi VYN. Olowa mu kampani.',
    issue: 'CHAP 01 — EST. 2026',
    latest: 'Zatsopano',
    events: 'Misonkhano',
    shop: 'Zinthu ndi Matikiti',
    admin: 'Desiki ya Editor',
    login: 'Lowani ku VYN',
    enter: 'Lowani',
    fTitle: 'Mutu',
    fCat: 'Gulu',
    fImg: 'URL ya Chithunzi',
    fCopy: 'Kufotokozera',
    fBtn: 'Sindikiza ku Journal',
    ev1Date: 'JUL 12 • LILONGWE',
    ev1Title: 'Sound & Canvas Live',
    ev1Price: 'Free / VIP MWK 5,000',
    ev2Date: 'AUG 03 • BLANTYRE',
    ev2Title: 'Afro-Modern Showcase',
    ev2Price: 'MWK 3,500',
    merch1Cat: 'ZOVALA',
    merch1Title: 'Heritage Tee',
    merch2Cat: 'NYIMBO',
    merch2Title: 'Roots & Resonance',
    pollTab: 'Mavoti',
    archiveTab: 'Archive',
  },
};

export const initialPostForm = {
  title: '',
  category: 'Art',
  mediaType: 'image',
  mediaUrl: '',
  caption: '',
  spotlight: false,
};

export const initialPollForm = {
  title: '',
  category: 'Awards',
  options: ['Best Visuals', 'Best Sound'],
  newOption: '',
};

export const landingPillars = [
  { letter: 'A', name: 'Art', desc: 'Studio space, materials, and mentorship for visual artists turning raw ideas into shown work.' },
  { letter: 'M', name: 'Music', desc: 'Studio time, collabs, and release support for artists building a sound worth chasing.' },
  { letter: 'F', name: 'Fashion', desc: 'Apparel and capsules shaped by the artists in our community, not a boardroom trend report.' },
  { letter: 'L', name: 'Lifestyle', desc: 'Events, drops, and a community built around one rule: show up for the thrill of it.' },
];

export const landingDrops = [
  { tag: 'New', title: 'Pulse Bomber', meta: 'Fashion Capsule', price: 'MWK 185,000', desc: 'Reflective panels, tour-jacket cut, built for the walk from studio to stage.' },
  { tag: 'Limited', title: 'Frequency Tee', meta: 'Music x Fashion', price: 'MWK 58,000', desc: 'Heavyweight cotton, waveform graphic pulled from an unreleased VYN artist track.' },
  { tag: 'Drop 004', title: 'Afterglow Cap', meta: 'Lifestyle', price: 'MWK 42,000', desc: 'Curved brim, embroidered eyebrow mark, made for load-in and load-out alike.' },
];

export const landingArtists = [
  { name: 'Nia Okoro', role: 'Painter · Studio Class of ’25' },
  { name: 'Marlo Reign', role: 'Producer · VYN Sound' },
  { name: 'Delphine Cruz', role: 'Designer · Fashion Capsule 03' },
  { name: 'Theo Vance', role: 'Photographer · Lifestyle' },
];

export const defaultArtists = [
  {
    id: 'artist-nia-okoro',
    name: 'Nia Okoro',
    role: 'Painter · Studio Class of ’25',
    mediaUrl: 'https://placehold.co/400x520/FAFAF7/111?text=Nia',
    bio: 'Immersive painter combining ritual colour and city pulse. Nia works across installation, portrait, and performance pieces.',
    media: [
      { id: 'nia-1', type: 'image', url: 'https://placehold.co/900x600/111111/FAFAF7?text=Studio+Shot', caption: 'Studio moodboard' },
      { id: 'nia-2', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Process film clip' },
    ],
    links: [
      { label: 'Spotify', url: 'https://spotify.com' },
      { label: 'TikTok', url: 'https://tiktok.com' },
      { label: 'YouTube', url: 'https://youtube.com' },
    ],
    likes: 84,
    comments: [{ id: 'comment-1', author: 'Adele', body: 'Nia’s visual language is wild and exact.' }],
  },
  {
    id: 'artist-marlo-reign',
    name: 'Marlo Reign',
    role: 'Producer · VYN Sound',
    mediaUrl: 'https://placehold.co/400x520/FAFAF7/111?text=Marlo',
    bio: 'Beat architect and sub-bass storyteller. Marlo produces immersive sessions and cinematic sound worlds across projects.',
    media: [
      { id: 'marlo-1', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Studio session' },
      { id: 'marlo-2', type: 'image', url: 'https://placehold.co/900x600/111111/FAFAF7?text=Sound+Desk', caption: 'Live production set' },
    ],
    links: [
      { label: 'Spotify', url: 'https://spotify.com' },
      { label: 'TikTok', url: 'https://tiktok.com' },
      { label: 'YouTube', url: 'https://youtube.com' },
    ],
    likes: 112,
    comments: [{ id: 'comment-2', author: 'Theo', body: 'The textures here feel next-level.' }],
  },
  {
    id: 'artist-delphine-cruz',
    name: 'Delphine Cruz',
    role: 'Designer · Fashion Capsule 03',
    mediaUrl: 'https://placehold.co/400x520/FAFAF7/111?text=Delphine',
    bio: 'Designer of sculptural wearables and stage-ready tailoring. Delphine balances craft with rhythm in every seam.',
    media: [
      { id: 'delphine-1', type: 'image', url: 'https://placehold.co/900x600/111111/FAFAF7?text=Collection+Preview', caption: 'Capsule preview' },
      { id: 'delphine-2', type: 'image', url: 'https://placehold.co/900x600/111111/FAFAF7?text=Runway+Shot', caption: 'Runway look' },
    ],
    links: [
      { label: 'Spotify', url: 'https://spotify.com' },
      { label: 'TikTok', url: 'https://tiktok.com' },
      { label: 'YouTube', url: 'https://youtube.com' },
    ],
    likes: 67,
    comments: [{ id: 'comment-3', author: 'Nia', body: 'Delphine’s direction is always sharp and soulful.' }],
  },
  {
    id: 'artist-theo-vance',
    name: 'Theo Vance',
    role: 'Photographer · Lifestyle',
    mediaUrl: 'https://placehold.co/400x520/FAFAF7/111?text=Theo',
    bio: 'Visual storyteller for underground scenes and after-dark rituals. Theo captures the in-between spaces where culture lives.',
    media: [
      { id: 'theo-1', type: 'image', url: 'https://placehold.co/900x600/111111/FAFAF7?text=Night+Portrait', caption: 'Portrait study' },
      { id: 'theo-2', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Photo walk through' },
    ],
    links: [
      { label: 'Spotify', url: 'https://spotify.com' },
      { label: 'TikTok', url: 'https://tiktok.com' },
      { label: 'YouTube', url: 'https://youtube.com' },
    ],
    likes: 92,
    comments: [{ id: 'comment-4', author: 'Delphine', body: 'Theo’s eye makes every moment feel cinematic.' }],
  },
];

export const defaultProducts = [
  { id: 'product-tee', title: 'Heritage Tee', category: 'Merch', mediaUrl: 'https://placehold.co/400x400/FAFAF7/111?text=HERITAGE+TEE', price: 'MWK 8,500', description: 'Limited release with VYN studio branding and a soft heavyweight cotton finish.', badge: 'New drop', availability: 'Limited', type: 'merch' },
  { id: 'product-vinyl', title: 'Roots & Resonance', category: 'Art', mediaUrl: 'https://placehold.co/400x400/FAFAF7/111?text=VINYL+ART', price: 'MWK 12,000', description: 'A collector edition pairing sound, visual art and a printed liner note.', badge: 'Studio pick', availability: 'Pre-order', type: 'art' },
  { id: 'product-print', title: 'Afterglow Print', category: 'Art', mediaUrl: 'https://placehold.co/400x400/FAFAF7/111?text=AFTERGLOW+PRINT', price: 'MWK 6,000', description: 'Signed digital print inspired by live performance and late-night city light.', badge: 'Edition 12/24', availability: 'In stock', type: 'art' },
  { id: 'product-bomber', title: 'Pulse Bomber', category: 'Merch', mediaUrl: 'https://placehold.co/400x400/FAFAF7/111?text=PULSE+BOMBER', price: 'MWK 24,000', description: 'A statement jacket with reflective trim and a sculptural silhouette.', badge: 'Launch', availability: 'Limited', type: 'merch' },
];
