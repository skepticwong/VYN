import { useEffect, useMemo, useState } from 'react';
import { createPoll, createPost, fetchPolls, fetchPosts, likePost, commentPost, votePoll, deletePost, deletePoll, updatePost } from './api';
import './styles.css';

const dict = {
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

const initialPostForm = {
  title: '',
  category: 'Art',
  mediaType: 'image',
  mediaUrl: '',
  caption: '',
  spotlight: false,
};

const initialPollForm = {
  title: '',
  category: 'Awards',
  options: ['Best Visuals', 'Best Sound'],
  newOption: '',
};

const landingPillars = [
  { letter: 'A', name: 'Art', desc: 'Studio space, materials, and mentorship for visual artists turning raw ideas into shown work.' },
  { letter: 'M', name: 'Music', desc: 'Studio time, collabs, and release support for artists building a sound worth chasing.' },
  { letter: 'F', name: 'Fashion', desc: 'Apparel and capsules shaped by the artists in our community, not a boardroom trend report.' },
  { letter: 'L', name: 'Lifestyle', desc: 'Events, drops, and a community built around one rule: show up for the thrill of it.' },
];

const landingDrops = [
  { tag: 'New', title: 'Pulse Bomber', meta: 'Fashion Capsule', price: 'MWK 185,000', desc: 'Reflective panels, tour-jacket cut, built for the walk from studio to stage.' },
  { tag: 'Limited', title: 'Frequency Tee', meta: 'Music x Fashion', price: 'MWK 58,000', desc: 'Heavyweight cotton, waveform graphic pulled from an unreleased VYN artist track.' },
  { tag: 'Drop 004', title: 'Afterglow Cap', meta: 'Lifestyle', price: 'MWK 42,000', desc: 'Curved brim, embroidered eyebrow mark, made for load-in and load-out alike.' },
];

const landingArtists = [
  { name: 'Nia Okoro', role: 'Painter · Studio Class of ’25' },
  { name: 'Marlo Reign', role: 'Producer · VYN Sound' },
  { name: 'Delphine Cruz', role: 'Designer · Fashion Capsule 03' },
  { name: 'Theo Vance', role: 'Photographer · Lifestyle' },
];

const defaultArtists = [
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

const defaultProducts = [
  { id: 'product-tee', title: 'Heritage Tee', category: 'Merch', mediaUrl: 'https://placehold.co/400x400/FAFAF7/111?text=HERITAGE+TEE', price: 'MWK 8,500', description: 'Limited release with VYN studio branding and a soft heavyweight cotton finish.', badge: 'New drop', availability: 'Limited', type: 'merch' },
  { id: 'product-vinyl', title: 'Roots & Resonance', category: 'Art', mediaUrl: 'https://placehold.co/400x400/FAFAF7/111?text=VINYL+ART', price: 'MWK 12,000', description: 'A collector edition pairing sound, visual art and a printed liner note.', badge: 'Studio pick', availability: 'Pre-order', type: 'art' },
  { id: 'product-print', title: 'Afterglow Print', category: 'Art', mediaUrl: 'https://placehold.co/400x400/FAFAF7/111?text=AFTERGLOW+PRINT', price: 'MWK 6,000', description: 'Signed digital print inspired by live performance and late-night city light.', badge: 'Edition 12/24', availability: 'In stock', type: 'art' },
  { id: 'product-bomber', title: 'Pulse Bomber', category: 'Merch', mediaUrl: 'https://placehold.co/400x400/FAFAF7/111?text=PULSE+BOMBER', price: 'MWK 24,000', description: 'A statement jacket with reflective trim and a sculptural silhouette.', badge: 'Launch', availability: 'Limited', type: 'merch' },
];

const createStudioId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

export default function App() {
  const [activeView, setActiveView] = useState('journal');
  const [activeAdminTab, setActiveAdminTab] = useState('content');
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en');
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [polls, setPolls] = useState([]);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [artistCommentDrafts, setArtistCommentDrafts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [postForm, setPostForm] = useState(initialPostForm);
  const [editingPostId, setEditingPostId] = useState(null);
  const [pollForm, setPollForm] = useState(initialPollForm);
  const [productForm, setProductForm] = useState({ title: '', category: 'Merch', price: '', mediaUrl: '', description: '', badge: '', availability: '', type: 'merch' });
  const [editingProductId, setEditingProductId] = useState(null);
  const [artistForm, setArtistForm] = useState({ name: '', role: '', mediaUrl: '', bio: '' });
  const [expandedAdminArtistId, setExpandedAdminArtistId] = useState(null);
  const [editingArtistId, setEditingArtistId] = useState(null);
  const [editArtistForm, setEditArtistForm] = useState({ name: '', role: '', mediaUrl: '', bio: '' });
  const [newMediaForm, setNewMediaForm] = useState({ type: 'image', url: '', caption: '' });
  const [newLinkForm, setNewLinkForm] = useState({ label: '', url: '' });
  const [shopFilter, setShopFilter] = useState('all');
  const [artistSearch, setArtistSearch] = useState('');
  const normalizeArtist = (artist) => ({
    bio: artist.bio || 'Artist profile and creative work details are coming soon.',
    likes: typeof artist.likes === 'number' ? artist.likes : 0,
    comments: Array.isArray(artist.comments) ? artist.comments : [],
    links: Array.isArray(artist.links) ? artist.links : [],
    media: Array.isArray(artist.media) ? artist.media : [],
    ...artist,
  });

  const [products, setProducts] = useState(() => {
    if (typeof window === 'undefined') return defaultProducts;
    try {
      const stored = window.localStorage.getItem('vyn-products');
      return stored ? JSON.parse(stored) : defaultProducts;
    } catch {
      return defaultProducts;
    }
  });
  const [artists, setArtists] = useState(() => {
    if (typeof window === 'undefined') return defaultArtists;
    try {
      const stored = window.localStorage.getItem('vyn-artists');
      return stored ? JSON.parse(stored).map(normalizeArtist) : defaultArtists;
    } catch {
      return defaultArtists;
    }
  });
  const [heroVideoUrl, setHeroVideoUrl] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      return window.localStorage.getItem('vyn-hero-video-url') || '';
    } catch {
      return '';
    }
  });
  const [heroVideoInput, setHeroVideoInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('vyn-products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('vyn-artists', JSON.stringify(artists));
    }
  }, [artists]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('vyn-hero-video-url', heroVideoUrl);
    }
  }, [heroVideoUrl]);

  useEffect(() => {
    setHeroVideoInput(heroVideoUrl);
  }, [heroVideoUrl]);

  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeView, loading]);

  async function loadData() {
    setLoading(true);
    try {
      const [postsData, pollsData] = await Promise.all([fetchPosts(), fetchPolls()]);
      setPosts(postsData);
      setPolls(pollsData);
    } catch (err) {
      setError(err.message || 'Unable to load content');
    } finally {
      setLoading(false);
    }
  }

  const entries = useMemo(() => ({
    featured: posts[0],
    side: posts.slice(1, 3),
    rest: posts.slice(3),
  }), [posts]);

  const strings = dict[lang];
  const activePost = selectedPost ? posts.find((item) => item.id === selectedPost.id) || selectedPost : null;

  const getHeroBackgroundMedia = () => {
    if (!heroVideoUrl) return null;
    const url = heroVideoUrl.trim();

    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return (
        <iframe
          className="hero-bg-video hero-bg-iframe"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
          title="Hero background video"
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
        />
      );
    }

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      const videoId = vimeoMatch[1];
      return (
        <iframe
          className="hero-bg-video hero-bg-iframe"
          src={`https://player.vimeo.com/video/${videoId}?background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0`}
          title="Hero background video"
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
        />
      );
    }

    return (
      <video
        className="hero-bg-video"
        src={url}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        webkit-playsinline="true"
      />
    );
  };

  const nav = (view) => {
    if (view === 'admin' && user?.role !== 'editor') {
      window.alert('Editor access required.');
      return;
    }
    setActiveView(view);
  };

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'ny' : 'en'));
  const openModal = () => setShowAuth(true);
  const closeModal = () => setShowAuth(false);

  const handleLogin = (event) => {
    event.preventDefault();
    const role = event.target.role.value;
    setUser({ role });
    setShowAuth(false);
    setActiveView(role === 'editor' ? 'admin' : 'journal');
    setMessage(role === 'editor' ? 'Editor access granted' : 'Reader mode active');
  };

  const logout = () => {
    setUser(null);
    setActiveView('journal');
    setMessage('Logged out');
  };

  const postComment = async (postId) => {
    const draft = (commentDrafts[postId] || '').trim();
    if (!draft) return;
    try {
      const author = user?.role === 'editor' ? 'Editor' : 'Reader';
      const added = await commentPost(postId, { author, body: draft });
      setPosts((prev) => prev.map((item) => item.id === postId ? { ...item, comments: [...item.comments, added] } : item));
      setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      setError(err.message || 'Unable to post comment');
    }
  };

  const like = async (postId) => {
    try {
      const updated = await likePost(postId);
      setPosts((prev) => prev.map((item) => item.id === postId ? updated : item));
    } catch (err) {
      setError(err.message || 'Unable to like post');
    }
  };

  const vote = async (pollId, optionId) => {
    try {
      const updated = await votePoll(pollId, optionId);
      setPolls((prev) => prev.map((item) => item.id === pollId ? updated : item));
    } catch (err) {
      setError(err.message || 'Unable to submit vote');
    }
  };

  const openPostDetail = (post) => {
    setSelectedPost(post);
    setActiveView('watch');
  };

  const closePostDetail = () => {
    setSelectedPost(null);
    setActiveView('journal');
  };

  const openArtistDetail = (artist) => {
    setSelectedArtist(artist);
    setActiveView('artist');
  };

  const closeArtistDetail = () => {
    setSelectedArtist(null);
    setActiveView('journal');
  };

  const likeArtistMedia = (artistId, mediaId) => {
    setArtists((prev) => prev.map((artist) => {
      if (artist.id !== artistId) return artist;
      return {
        ...artist,
        media: artist.media.map((item) => item.id === mediaId ? { ...item, likes: (item.likes || 0) + 1 } : item),
      };
    }));
  };

  const likeArtistProfile = (artistId) => {
    setArtists((prev) => prev.map((artist) => artist.id === artistId ? { ...artist, likes: (artist.likes || 0) + 1 } : artist));
  };

  const postArtistComment = (artistId) => {
    const draft = (artistCommentDrafts[artistId] || '').trim();
    if (!draft) return;
    const author = user?.role === 'editor' ? 'Editor' : 'Reader';
    const comment = { id: `artist-comment-${Date.now()}`, author, body: draft };
    setArtists((prev) => prev.map((artist) => artist.id === artistId ? { ...artist, comments: [...artist.comments, comment] } : artist));
    setArtistCommentDrafts((prev) => ({ ...prev, [artistId]: '' }));
  };

  const publish = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        title: postForm.title,
        category: postForm.category,
        media_type: postForm.mediaType,
        media_url: postForm.mediaUrl || 'https://placehold.co/800x600/FAFAF7/111?text=NEW',
        caption: postForm.caption,
        spotlight: postForm.spotlight,
      };
      if (editingPostId) {
        const updated = await updatePost(editingPostId, payload);
        setPosts((prev) => prev.map((item) => item.id === editingPostId ? { ...updated, spotlight: postForm.spotlight } : item));
        setMessage('Post updated');
        setEditingPostId(null);
      } else {
        const created = await createPost(payload);
        setPosts((prev) => [{ ...created, spotlight: postForm.spotlight }, ...prev]);
        setMessage('Published successfully');
      }
      setPostForm(initialPostForm);
      setActiveAdminTab('content');
    } catch (err) {
      setError(err.message || (editingPostId ? 'Unable to update post' : 'Unable to publish post'));
    }
  };

  const editPost = (post) => {
    setPostForm({
      title: post.title,
      category: post.category,
      mediaType: post.media_type,
      mediaUrl: post.media_url,
      caption: post.caption || '',
      spotlight: post.spotlight || false,
    });
    setEditingPostId(post.id);
    setActiveAdminTab('content');
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setPostForm(initialPostForm);
  };

  const createNewPoll = async (event) => {
    event.preventDefault();
    if (!pollForm.title.trim() || pollForm.options.length === 0) {
      setError('Give the poll a title and at least one option.');
      return;
    }
    try {
      const created = await createPoll({
        title: pollForm.title,
        category: pollForm.category,
        options: pollForm.options.map((label) => ({ label })),
      });
      setPolls((prev) => [created, ...prev]);
      setPollForm(initialPollForm);
      setActiveAdminTab('polls');
      setMessage('Poll created');
    } catch (err) {
      setError(err.message || 'Unable to create poll');
    }
  };

  const addPollOption = () => {
    const value = pollForm.newOption.trim();
    if (!value) return;
    setPollForm((prev) => ({ ...prev, options: [...prev.options, value], newOption: '' }));
  };

  const removePollOption = (index) => {
    setPollForm((prev) => ({
      ...prev,
      options: prev.options.filter((_, idx) => idx !== index),
    }));
  };

  const deletePostItem = async (postId) => {
    if (!window.confirm('Remove this post from the feed?')) return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((item) => item.id !== postId));
      setMessage('Post removed');
    } catch (err) {
      setError(err.message || 'Unable to remove post');
    }
  };

  const resetProductForm = () => {
    setProductForm({ title: '', category: 'Merch', price: '', mediaUrl: '', description: '', badge: '', availability: '', type: 'merch' });
    setEditingProductId(null);
  };

  const createNewProduct = (event) => {
    event.preventDefault();
    if (!productForm.title.trim()) {
      setError('Give the product a title.');
      return;
    }
    const payload = {
      title: productForm.title.trim(),
      category: productForm.category,
      mediaUrl: productForm.mediaUrl || 'https://placehold.co/400x400/FAFAF7/111?text=PRODUCT',
      price: productForm.price.trim() || 'TBA',
      description: productForm.description.trim() || 'New VYN release.',
      badge: productForm.badge.trim(),
      availability: productForm.availability.trim() || 'Available now',
      type: productForm.type,
    };

    if (editingProductId) {
      setProducts((prev) => prev.map((item) => item.id === editingProductId ? { ...item, ...payload } : item));
      setMessage('Product updated in the shop.');
    } else {
      const newProduct = { id: createStudioId(), ...payload };
      setProducts((prev) => [newProduct, ...prev]);
      setMessage('Product published to the shop.');
    }

    resetProductForm();
    setActiveAdminTab('products');
  };

  const editProduct = (product) => {
    setProductForm({
      title: product.title,
      category: product.category,
      price: product.price,
      mediaUrl: product.mediaUrl,
      description: product.description,
      badge: product.badge || '',
      availability: product.availability || '',
      type: product.type || 'merch',
    });
    setEditingProductId(product.id);
    setActiveAdminTab('products');
  };

  const removeProduct = (productId) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
    setMessage('Product removed from the shop.');
  };

  const createNewArtist = (event) => {
    event.preventDefault();
    if (!artistForm.name.trim()) {
      setError('Add the artist name.');
      return;
    }
    const newArtist = {
      id: createStudioId(),
      name: artistForm.name.trim(),
      role: artistForm.role.trim() || 'Featured by VYN',
      mediaUrl: artistForm.mediaUrl,
      bio: artistForm.bio.trim() || 'New artist in the VYN studio.',
    };
    setArtists((prev) => [newArtist, ...prev]);
    setArtistForm({ name: '', role: '', mediaUrl: '', bio: '' });
    setActiveAdminTab('artists');
    setMessage('Artist added to the spotlight.');
  };

  const startEditingArtist = (artist) => {
    setEditingArtistId(artist.id);
    setEditArtistForm({ name: artist.name, role: artist.role, mediaUrl: artist.mediaUrl, bio: artist.bio });
    setNewMediaForm({ type: 'image', url: '', caption: '' });
    setNewLinkForm({ label: '', url: '' });
  };

  const saveArtistEdits = () => {
    if (!editArtistForm.name.trim()) {
      setError('Artist name is required.');
      return;
    }
    setArtists((prev) => prev.map((artist) => artist.id === editingArtistId ? { ...artist, name: editArtistForm.name, role: editArtistForm.role, mediaUrl: editArtistForm.mediaUrl, bio: editArtistForm.bio } : artist));
    setEditingArtistId(null);
    setMessage('Artist updated.');
  };

  const addMediaToArtist = () => {
    if (!newMediaForm.url.trim()) {
      setError('Media URL is required.');
      return;
    }
    const newMediaId = createStudioId();
    setArtists((prev) => prev.map((artist) => artist.id === editingArtistId ? { ...artist, media: [...(artist.media || []), { id: newMediaId, type: newMediaForm.type, url: newMediaForm.url, caption: newMediaForm.caption, likes: 0 }] } : artist));
    setNewMediaForm({ type: 'image', url: '', caption: '' });
    setMessage('Media added to artist.');
  };

  const removeMediaFromArtist = (artistId, mediaId) => {
    setArtists((prev) => prev.map((artist) => artist.id === artistId ? { ...artist, media: artist.media.filter((item) => item.id !== mediaId) } : artist));
    setMessage('Media removed from artist.');
  };

  const addLinkToArtist = () => {
    if (!newLinkForm.label.trim() || !newLinkForm.url.trim()) {
      setError('Link label and URL are required.');
      return;
    }
    setArtists((prev) => prev.map((artist) => artist.id === editingArtistId ? { ...artist, links: [...(artist.links || []), { label: newLinkForm.label, url: newLinkForm.url }] } : artist));
    setNewLinkForm({ label: '', url: '' });
    setMessage('Link added to artist.');
  };

  const removeLinkFromArtist = (artistId, linkLabel) => {
    setArtists((prev) => prev.map((artist) => artist.id === artistId ? { ...artist, links: artist.links.filter((item) => item.label !== linkLabel) } : artist));
    setMessage('Link removed from artist.');
  };

  const removeArtist = (artistId) => {
    if (!window.confirm('Remove this artist from the site?')) return;
    setArtists((prev) => prev.filter((item) => item.id !== artistId));
    setMessage('Artist removed from the site.');
  };

  const saveHeroVideoBackground = (event) => {
    event.preventDefault();
    setHeroVideoUrl(heroVideoInput.trim());
    setMessage(heroVideoInput.trim() ? 'Hero background video saved.' : 'Hero background video removed.');
  };

  const removePoll = async (pollId) => {
    if (!window.confirm('Remove this poll from the site?')) return;
    try {
      await deletePoll(pollId);
      setPolls((prev) => prev.filter((item) => item.id !== pollId));
      setMessage('Poll removed');
    } catch (err) {
      setError(err.message || 'Unable to remove poll');
    }
  };

  const featureList = entries;
  const filteredProducts = useMemo(() => {
    if (shopFilter === 'all') return products;
    return products.filter((product) => (product.type || product.category?.toLowerCase()).includes(shopFilter));
  }, [products, shopFilter]);
  const featuredArtists = useMemo(() => artists.slice(0, 5), [artists]);
  const artistCraftGroups = useMemo(() => {
    const query = artistSearch.trim().toLowerCase();
    const groups = {
      Art: [],
      Music: [],
      Fashion: [],
      Lifestyle: [],
    };

    artists.forEach((artist) => {
      const searchable = `${artist.name} ${artist.role} ${artist.bio}`.toLowerCase();
      if (query && !searchable.includes(query)) {
        return;
      }

      const role = artist.role?.toLowerCase() || '';
      if (role.includes('painter') || role.includes('photographer') || role.includes('designer')) {
        groups.Art.push(artist);
      } else if (role.includes('producer') || role.includes('sound')) {
        groups.Music.push(artist);
      } else if (role.includes('fashion') || role.includes('capsule')) {
        groups.Fashion.push(artist);
      } else {
        groups.Lifestyle.push(artist);
      }
    });

    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [artists, artistSearch]);

  return (
    <div>
      <nav>
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); setMenuOpen(false); nav('journal'); }}>
          VYN<span>.</span>
        </a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)}>☰</button>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#" className={activeView === 'journal' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setMenuOpen(false); nav('journal'); }}>
            Journal
          </a>
          <a href="#pillars" onClick={(e) => { e.preventDefault(); setMenuOpen(false); setActiveView('journal'); document.querySelector('#pillars')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Crafts
          </a>
          <a href="#drops" onClick={(e) => { e.preventDefault(); setMenuOpen(false); setActiveView('journal'); document.querySelector('#drops')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Drops
          </a>
          <a href="#artists" onClick={(e) => { e.preventDefault(); setMenuOpen(false); setActiveView('journal'); document.querySelector('#artists')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Artists
          </a>
          <a href="#join" onClick={(e) => { e.preventDefault(); setMenuOpen(false); setActiveView('journal'); document.querySelector('#join')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Studio
          </a>
          <a href="#" className={activeView === 'events' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setMenuOpen(false); nav('events'); }}>
            Events
          </a>
          <a href="#" className={activeView === 'spotlight' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setMenuOpen(false); nav('spotlight'); }}>
            Spotlight
          </a>
          <a href="#" className={activeView === 'shop' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setMenuOpen(false); nav('shop'); }}>
            Shop
          </a>
          <a href="#" className={activeView === 'admin' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setMenuOpen(false); nav('admin'); }} style={{ display: user?.role === 'editor' ? 'inline-flex' : 'none' }}>
            Studio
          </a>
        </div>
        <div className="nav-controls">
          <button className="lang-toggle" type="button" onClick={toggleLang}>{lang.toUpperCase()}</button>
          {user ? (
            <button className="btn btn-sm" type="button" onClick={logout}>{user.role === 'editor' ? 'Logout' : 'Logout'}</button>
          ) : (
            <button className="btn btn-sm" type="button" onClick={openModal}>{strings.login}</button>
          )}
        </div>
      </nav>

      <main>
        <div id="journal" className={activeView === 'journal' ? 'view active' : 'view'}>
          <header className="hero landing-hero reveal">
            {heroVideoUrl ? getHeroBackgroundMedia() : null}
            <div className="hero-glow" />
            <div className="hero-content">
              <p className="hero-eyebrow"><span className="pulse-dot" />VYN Presents</p>
              <h1 className="display">VIBES <span className="line2">YOU NEED</span></h1>
              <div className="rule" style={{ margin: 'var(--space) auto' }}></div>
              <p className="sub">{strings.sub}</p>
              <p className="issue">{strings.issue}</p>
              <div className="hero-actions">
                <button className="btn-pill" type="button" onClick={(e) => { e.preventDefault(); document.querySelector('#drops')?.scrollIntoView({ behavior: 'smooth' }); }}>Shop</button>
                <button className="btn-pill outline" type="button" onClick={(e) => { e.preventDefault(); document.querySelector('#pillars')?.scrollIntoView({ behavior: 'smooth' }); }}>Explore</button>
              </div>
            </div>
          </header>

          <section className="manifesto section reveal">
            <div className="manifesto-grid">
              <p className="manifesto-label">The Movement</p>
              <div className="manifesto-text">
                We don't design for a mood board. We design for the drop of the stomach before you go on —
                <em>the first bar of a new track, the last stitch on a finished piece, the walk-out before the show starts.</em>
                VYN exists to hand artists the tools, the platform, and the people to chase that feeling on purpose.
              </div>
            </div>
          </section>

          <section className="pillars section reveal" id="pillars">
            <div className="section-head">
              <div className="section-title display">Crafts</div>
            </div>
            <div className="pillars-grid">
              {landingPillars.map((pillar) => (
                <div className="pillar-card" key={pillar.name}>
                  <div className="pillar-num">{pillar.letter}</div>
                  <div>
                    <div className="pillar-name">{pillar.name}</div>
                    <div className="pillar-desc">{pillar.desc}</div>
                  </div>
                  <div className="pillar-glyph">{pillar.letter}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="drops section reveal" id="drops">
            <div className="section-head">
              <div className="section-title display">Wear the thrill</div>
              <a href="#" className="btn-ghost" onClick={(e) => { e.preventDefault(); setActiveView('shop'); setMenuOpen(false); }}>Shop the drop →</a>
            </div>
            <div className="drops-grid">
              {landingDrops.map((drop) => (
                <div className="drop-card" key={drop.title}>
                  <div className="drop-visual"><span className="drop-tag">{drop.tag}</span></div>
                  <div className="drop-title">{drop.title}</div>
                  <div className="pillar-desc">{drop.desc}</div>
                  <div className="drop-meta"><span>{drop.meta}</span><span className="drop-price">{drop.price}</span></div>
                </div>
              ))}
            </div>
          </section>

          <section className="artists section reveal" id="artists">
            <div className="section-head">
              <div className="section-title display">Discover Artists</div>
              <button className="btn-ghost" type="button" onClick={() => setActiveView('artists-directory')}>View full directory →</button>
            </div>
            <div className="artists-scroll">
              {featuredArtists.map((artist) => (
                <div className="artist-card" key={artist.id} onClick={() => openArtistDetail(artist)}>
                  <div className="artist-photo" style={artist.mediaUrl ? { backgroundImage: `url(${artist.mediaUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} />
                  <div className="artist-info">
                    <div className="artist-name">{artist.name}</div>
                    <div className="artist-role">{artist.role}</div>
                  </div>
                  <div className="meta" style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>View profile →</div>
                </div>
              ))}
            </div>
          </section>

          <section className="join reveal" id="join">
            <div className="wrap">
              <div className="manifesto-label">Join In</div>
              <h2 className="display">To be thrilled</h2>
              <p>Early access to drops, studio calls, and shows — straight from the artists building VYN, no algorithm in between.</p>
              <form className="join-form" onSubmit={(event) => { event.preventDefault(); const button = event.currentTarget.querySelector('button'); if (button) button.textContent = "You're in →"; }}>
                <input type="email" placeholder="you@email.com" required />
                <button type="submit" className="btn-primary">Notify me →</button>
              </form>
            </div>
          </section>

          <h2>{strings.latest}</h2>
          {loading ? (
            <p className="meta">Loading feed…</p>
          ) : (
            <div className="feed-grid">
              <div id="feat">
                {featureList.featured ? (
                  <article className="post" style={{ border: 'none', marginBottom: 'var(--space-xl)' }}>
                        <div className="media-click" onClick={() => openPostDetail(featureList.featured)}>
                      {featureList.featured.media_type === 'video' ? (
                        <video controls src={featureList.featured.media_url} style={{ width: '100%', borderRadius: 'var(--radius)' }} />
                      ) : (
                        <img src={featureList.featured.media_url} alt={featureList.featured.title} />
                      )}
                    </div>
                    <div className="meta">{featureList.featured.category}</div>
                    <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw + 0.5rem, 2.2rem)' }}>{featureList.featured.title}</h3>
                      <p className="meta" style={{ textTransform: 'none', marginTop: 4 }}>{featureList.featured.caption}</p>
                  </article>
                ) : (
                  <p className="meta">No posts available.</p>
                )}
              </div>
              <aside id="side">
                {featureList.side.map((post) => (
                  <article className="post" key={post.id}>
                    <div className="media-click" onClick={() => openPostDetail(post)}>
                      {post.media_type === 'video' ? (
                        <video controls src={post.media_url} style={{ width: '100%', borderRadius: 'var(--radius)' }} />
                      ) : (
                        <img src={post.media_url} alt={post.title} />
                      )}
                    </div>
                    <div className="meta">{post.category}</div>
                    <h3>{post.title}</h3>
                    <p className="meta" style={{ textTransform: 'none' }}>{post.caption}</p>
                    {/* interactions moved to post detail modal */}
                  </article>
                ))}
              </aside>
            </div>
          )}
          <section className="spotlight-panel">
            <h2>VYN Spotlight</h2>
            <div className="spotlight-grid">
              {posts.slice(1, 4).map((post) => (
                <article className="post" key={post.id}>
                  <div className="media-click" onClick={() => openPostDetail(post)}>
                    {post.media_type === 'video' ? (
                      <video controls src={post.media_url} style={{ width: '100%', borderRadius: 'var(--radius)' }} />
                    ) : (
                      <img src={post.media_url} alt={post.title} />
                    )}
                  </div>
                  <div className="meta">{post.category}</div>
                  <h3>{post.title}</h3>
                  <p className="meta" style={{ textTransform: 'none' }}>{post.caption}</p>
                </article>
              ))}
            </div>
          </section>
          <div id="feed" style={{ marginTop: 'var(--space-xl)' }}>
            {featureList.rest.map((post) => (
              <article className="post" key={post.id}>
                {post.media_type === 'video' ? (
                  <video controls src={post.media_url} style={{ width: '100%', borderRadius: 'var(--radius)' }} />
                ) : (
                  <img src={post.media_url} alt={post.title} />
                )}
                <div className="meta">{post.category}</div>
                <h3>{post.title}</h3>
                <p className="meta" style={{ textTransform: 'none' }}>{post.caption}</p>
                {/* interactions moved to post detail modal */}
              </article>
            ))}
          </div>
        </div>

        <div id="events" className={activeView === 'events' ? 'view active' : 'view'}>
          <h2>{strings.events}</h2>
          <div className="grid-3">
            <div className="card">
              <img src="https://placehold.co/600x420/FAFAF7/111?text=Sound+%26+Canvas" alt="Sound & Canvas Live" />
              <div className="card-body">
                <div className="meta">{strings.ev1Date}</div>
                <h3>{strings.ev1Title}</h3>
                <p className="meta" style={{ marginTop: 4 }}>{strings.ev1Price}</p>
                <button className="btn btn-sm">Secure Pass</button>
              </div>
            </div>
            <div className="card">
              <img src="https://placehold.co/600x420/FAFAF7/111?text=Afro+Modern+Showcase" alt="Afro-Modern Showcase" />
              <div className="card-body">
                <div className="meta">{strings.ev2Date}</div>
                <h3>{strings.ev2Title}</h3>
                <p className="meta" style={{ marginTop: 4 }}>{strings.ev2Price}</p>
                <button className="btn btn-sm">Secure Pass</button>
              </div>
            </div>
          </div>
        </div>

        <div id="artists-directory" className={activeView === 'artists-directory' ? 'view active' : 'view'}>
          <section className="shop-hero">
            <div>
              <p className="manifesto-label">Artist Directory</p>
              <h2 style={{ marginBottom: 'var(--space-sm)' }}>Craft-led artists, grouped by practice</h2>
              <p className="meta" style={{ textTransform: 'none', marginBottom: 'var(--space)' }}>
                Explore the full VYN roster across visual art, sound, fashion, and lifestyle.
              </p>
            </div>
            <div className="shop-hero-card">
              <div className="meta">Featured focus</div>
              <h3>Crafts as culture</h3>
              <p className="meta" style={{ textTransform: 'none' }}>Every artist page holds work, links, and conversation — built for deeper discovery.</p>
            </div>
          </section>

          <div className="artist-search-row">
            <input
              className="artist-search"
              type="text"
              value={artistSearch}
              onChange={(e) => setArtistSearch(e.target.value)}
              placeholder="Search artists by name or craft"
            />
            {artistSearch ? <button className="btn btn-sm" type="button" onClick={() => setArtistSearch('')}>Clear</button> : null}
          </div>

          <div className="artist-directory-list">
            {artistCraftGroups.map(([craft, items]) => (
              <div className="artist-directory-group" key={craft}>
                <h3>{craft}</h3>
                <div className="artists-scroll directory-scroll">
                  {items.map((artist) => (
                    <div className="artist-card" key={artist.id} onClick={() => openArtistDetail(artist)}>
                      <div className="artist-photo" style={artist.mediaUrl ? { backgroundImage: `url(${artist.mediaUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} />
                      <div className="artist-info">
                        <div className="artist-name">{artist.name}</div>
                        <div className="artist-role">{artist.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="shop" className={activeView === 'shop' ? 'view active' : 'view'}>
          <section className="shop-hero">
            <div>
              <p className="manifesto-label">VYN Shop</p>
              <h2 style={{ marginBottom: 'var(--space-sm)' }}>Collect the movement</h2>
              <p className="meta" style={{ textTransform: 'none', marginBottom: 'var(--space)' }}>
                Wearables, signed prints, and artist-led objects designed for the studio, the stage, and the street.
              </p>
            </div>
            <div className="shop-hero-card">
              <div className="meta">Featured release</div>
              <h3>Pulse Bomber</h3>
              <p className="meta" style={{ textTransform: 'none' }}>Reflective panels, tour-ready shape, and a limited run for the next drop.</p>
              <div className="price">MWK 24,000</div>
            </div>
          </section>

          <div className="shop-filter-row">
            <button className={`chip ${shopFilter === 'all' ? 'active' : ''}`} type="button" onClick={() => setShopFilter('all')}>All</button>
            <button className={`chip ${shopFilter === 'merch' ? 'active' : ''}`} type="button" onClick={() => setShopFilter('merch')}>Merch</button>
            <button className={`chip ${shopFilter === 'art' ? 'active' : ''}`} type="button" onClick={() => setShopFilter('art')}>Art</button>
          </div>

          <div className="grid-3">
            {filteredProducts.map((product) => (
              <div className="card shop-card" key={product.id}>
                <img src={product.mediaUrl} alt={product.title} />
                <div className="card-body">
                  <div className="shop-meta-row">
                    <span className="meta">{product.category}</span>
                    {product.badge ? <span className="shop-badge">{product.badge}</span> : null}
                  </div>
                  <h3>{product.title}</h3>
                  <p className="meta" style={{ textTransform: 'none', marginTop: 4 }}>{product.description}</p>
                  <div className="price">{product.price}</div>
                  <div className="shop-actions">
                    <span className="shop-availability">{product.availability || 'Available now'}</span>
                    <button className="btn btn-sm">Buy now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="admin" className={activeView === 'admin' ? 'view active' : 'view'}>
          <div className="admin-header">
            <div>
              <h2>Studio</h2>
              <p className="meta">Only editors can publish the site’s content, products, and artists.</p>
            </div>
            <button className="btn btn-sm" type="button" onClick={() => nav('journal')}>Exit</button>
          </div>
          <div className="tabs">
            <button className={`tab ${activeAdminTab === 'content' ? 'active' : ''}`} type="button" onClick={() => setActiveAdminTab('content')}>Content</button>
            <button className={`tab ${activeAdminTab === 'products' ? 'active' : ''}`} type="button" onClick={() => setActiveAdminTab('products')}>Products</button>
            <button className={`tab ${activeAdminTab === 'artists' ? 'active' : ''}`} type="button" onClick={() => setActiveAdminTab('artists')}>Artists</button>
            <button className={`tab ${activeAdminTab === 'polls' ? 'active' : ''}`} type="button" onClick={() => setActiveAdminTab('polls')}>Polls</button>
          </div>

          <div className={`panel ${activeAdminTab === 'content' ? 'active' : ''}`}>
            <form className="pub-form" onSubmit={publish}>
              <div className="form-group"><label>{strings.fTitle}</label><input type="text" value={postForm.title} onChange={(e) => setPostForm((prev) => ({ ...prev, title: e.target.value }))} required /></div>
              <div className="form-group"><label>{strings.fCat}</label><select value={postForm.category} onChange={(e) => setPostForm((prev) => ({ ...prev, category: e.target.value }))}>
                <option>Art</option>
                <option>Music</option>
                <option>Fashion</option>
                <option>Lifestyle</option>
              </select></div>
              <div className="form-group"><label>{strings.fImg}</label><input type="url" value={postForm.mediaUrl} onChange={(e) => setPostForm((prev) => ({ ...prev, mediaUrl: e.target.value }))} placeholder="https://..." /></div>
              <div className="media-preview-card">
                <div className="media-preview-label">{editingPostId ? 'Live preview for the post you are editing' : 'Live preview'}</div>
                {postForm.mediaUrl ? (
                  postForm.mediaType === 'video' ? (
                    <video className="media-preview" controls src={postForm.mediaUrl} />
                  ) : (
                    <img className="media-preview" src={postForm.mediaUrl} alt={postForm.title || 'Content preview'} />
                  )
                ) : (
                  <div className="media-preview placeholder">Add an image or video URL to preview it here.</div>
                )}
              </div>
              <div className="form-group"><label>{strings.fCopy}</label><input type="text" value={postForm.caption} onChange={(e) => setPostForm((prev) => ({ ...prev, caption: e.target.value }))} placeholder="Short editorial caption..." /></div>
              <div className="form-group"><label>Media type</label><select value={postForm.mediaType} onChange={(e) => setPostForm((prev) => ({ ...prev, mediaType: e.target.value }))}>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select></div>
              <div className="form-group"><label>Hero background video URL</label><input type="url" value={heroVideoInput} onChange={(e) => setHeroVideoInput(e.target.value)} placeholder="Direct MP4/WebM or YouTube/Vimeo link" /></div>
              <button type="button" className="btn btn-sm" onClick={saveHeroVideoBackground} style={{ marginBottom: 'var(--space)' }}>
                Save hero background
              </button>
              <div className="form-group" style={{ alignItems: 'center', display: 'flex' }}>
                <label style={{ marginRight: 12 }}><input type="checkbox" checked={postForm.spotlight} onChange={(e) => setPostForm((prev) => ({ ...prev, spotlight: e.target.checked }))} /> Spotlight</label>
                <span className="meta">Mark this content for Spotlight promotion.</span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                <button type="submit" className="btn">{editingPostId ? 'Update post' : strings.fBtn}</button>
                {editingPostId ? <button type="button" className="btn btn-sm" onClick={cancelEdit}>Cancel</button> : null}
              </div>
            </form>
            <div className="post-list">
              {posts.length === 0 ? <p className="meta">No published posts yet.</p> : posts.map((post) => (
                <div className="p-item" key={post.id}>
                  <div>
                    <strong>{post.title}</strong>
                    <span className="meta" style={{ display: 'inline', marginLeft: 6 }}>{post.category}</span>
                    {post.spotlight ? <span className="meta" style={{ marginLeft: 8, color: '#f59e0b' }}>Spotlight</span> : null}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <button className="btn btn-sm" type="button" onClick={() => editPost(post)}>Edit</button>
                    <button className="btn btn-sm" type="button" onClick={() => deletePostItem(post.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`panel ${activeAdminTab === 'products' ? 'active' : ''}`}>
            <form className="pub-form" onSubmit={createNewProduct}>
              <div className="form-group"><label>Product title</label><input type="text" value={productForm.title} onChange={(e) => setProductForm((prev) => ({ ...prev, title: e.target.value }))} required /></div>
              <div className="form-group"><label>Shop type</label><select value={productForm.type} onChange={(e) => setProductForm((prev) => ({ ...prev, type: e.target.value }))}>
                <option value="merch">Merch</option>
                <option value="art">Art</option>
              </select></div>
              <div className="form-group"><label>Category</label><select value={productForm.category} onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}>
                <option>Merch</option>
                <option>Art</option>
              </select></div>
              <div className="form-group"><label>Price</label><input type="text" value={productForm.price} onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="MWK 8,500" /></div>
              <div className="form-group"><label>Media URL</label><input type="url" value={productForm.mediaUrl} onChange={(e) => setProductForm((prev) => ({ ...prev, mediaUrl: e.target.value }))} placeholder="https://..." /></div>
              <div className="form-group"><label>Badge</label><input type="text" value={productForm.badge} onChange={(e) => setProductForm((prev) => ({ ...prev, badge: e.target.value }))} placeholder="New drop" /></div>
              <div className="form-group"><label>Availability</label><input type="text" value={productForm.availability} onChange={(e) => setProductForm((prev) => ({ ...prev, availability: e.target.value }))} placeholder="Available now" /></div>
              <div className="form-group"><label>Description</label><input type="text" value={productForm.description} onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Short product description" /></div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                <button type="submit" className="btn">{editingProductId ? 'Update product' : 'Publish product'}</button>
                {editingProductId ? <button type="button" className="btn btn-sm" onClick={resetProductForm}>Cancel</button> : null}
              </div>
            </form>
            <div className="post-list">
              {products.map((product) => (
                <div className="p-item" key={product.id}>
                  <div><strong>{product.title}</strong> <span className="meta" style={{ display: 'inline', marginLeft: 6 }}>{product.category}</span></div>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <button className="btn btn-sm" type="button" onClick={() => editProduct(product)}>Edit</button>
                    <button className="btn btn-sm" type="button" onClick={() => removeProduct(product.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`panel ${activeAdminTab === 'artists' ? 'active' : ''}`}>
            <form className="pub-form" onSubmit={createNewArtist}>
              <div className="form-group"><label>Artist name</label><input type="text" value={artistForm.name} onChange={(e) => setArtistForm((prev) => ({ ...prev, name: e.target.value }))} required /></div>
              <div className="form-group"><label>Role</label><input type="text" value={artistForm.role} onChange={(e) => setArtistForm((prev) => ({ ...prev, role: e.target.value }))} placeholder="Painter · Studio Class" /></div>
              <div className="form-group"><label>Photo URL</label><input type="url" value={artistForm.mediaUrl} onChange={(e) => setArtistForm((prev) => ({ ...prev, mediaUrl: e.target.value }))} placeholder="https://..." /></div>
              <div className="form-group"><label>Bio</label><input type="text" value={artistForm.bio} onChange={(e) => setArtistForm((prev) => ({ ...prev, bio: e.target.value }))} placeholder="Short profile note" /></div>
              <button type="submit" className="btn">Add artist</button>
            </form>
            <div className="post-list">
              {artists.map((artist) => (
                <div className="p-item" key={artist.id} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-sm)', cursor: 'pointer' }} onClick={() => setExpandedAdminArtistId(expandedAdminArtistId === artist.id ? null : artist.id)}>
                  <div style={{ display: 'flex', gap: 'var(--space)', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div><strong>{artist.name}</strong> <span className="meta" style={{ display: 'inline', marginLeft: 6 }}>{artist.role}</span></div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-sm" type="button" onClick={(e) => { e.stopPropagation(); startEditingArtist(artist); }}>Edit</button>
                      <button className="btn btn-sm" type="button" onClick={(e) => { e.stopPropagation(); removeArtist(artist.id); }}>Remove</button>
                    </div>
                  </div>
                  {expandedAdminArtistId === artist.id && editingArtistId === artist.id && (
                    <>
                      <div style={{ width: '100%', paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--border)' }}>
                        <div className="form-group"><label>Name</label><input type="text" value={editArtistForm.name} onChange={(e) => setEditArtistForm((prev) => ({ ...prev, name: e.target.value }))} /></div>
                        <div className="form-group"><label>Role</label><input type="text" value={editArtistForm.role} onChange={(e) => setEditArtistForm((prev) => ({ ...prev, role: e.target.value }))} /></div>
                        <div className="form-group"><label>Photo URL</label><input type="url" value={editArtistForm.mediaUrl} onChange={(e) => setEditArtistForm((prev) => ({ ...prev, mediaUrl: e.target.value }))} /></div>
                        <div className="form-group"><label>Bio</label><input type="text" value={editArtistForm.bio} onChange={(e) => setEditArtistForm((prev) => ({ ...prev, bio: e.target.value }))} /></div>
                        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space)' }}>
                          <button className="btn btn-sm" type="button" onClick={saveArtistEdits}>Save</button>
                          <button className="btn btn-sm" type="button" onClick={() => setEditingArtistId(null)}>Cancel</button>
                        </div>
                      </div>
                      <div style={{ width: '100%', paddingTop: 'var(--space)', borderTop: '1px solid var(--border)' }}>
                        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: '0.9rem' }}>Media</h4>
                        <div className="form-group"><label>Type</label><select value={newMediaForm.type} onChange={(e) => setNewMediaForm((prev) => ({ ...prev, type: e.target.value }))}>
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select></div>
                        <div className="form-group"><label>URL</label><input type="url" value={newMediaForm.url} onChange={(e) => setNewMediaForm((prev) => ({ ...prev, url: e.target.value }))} placeholder="https://..." /></div>
                        <div className="form-group"><label>Caption</label><input type="text" value={newMediaForm.caption} onChange={(e) => setNewMediaForm((prev) => ({ ...prev, caption: e.target.value }))} placeholder="Short description" /></div>
                        <button className="btn btn-sm" type="button" onClick={addMediaToArtist} style={{ marginBottom: 'var(--space)' }}>Add media</button>
                        {artist.media && artist.media.length > 0 && (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
                            {artist.media.map((item) => (
                              <div key={item.id} style={{ aspectRatio: '1', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg-muted)', overflow: 'hidden', position: 'relative' }} onMouseEnter={(e) => { e.currentTarget.querySelector('.media-remove')?.style.setProperty('opacity', '1'); }} onMouseLeave={(e) => { e.currentTarget.querySelector('.media-remove')?.style.setProperty('opacity', '0'); }}>
                                {item.type === 'video' ? (
                                  <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <img src={item.url} alt={item.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )}
                                <button className="media-remove" type="button" onClick={() => removeMediaFromArtist(artist.id, item.id)} style={{ position: 'absolute', top: 0, right: 0, opacity: 0, transition: 'opacity 200ms', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', padding: '4px 6px', fontSize: '0.7rem', cursor: 'pointer' }}>✕</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ width: '100%', paddingTop: 'var(--space)', borderTop: '1px solid var(--border)' }}>
                        <h4 style={{ marginBottom: 'var(--space-sm)', fontSize: '0.9rem' }}>Links</h4>
                        <div className="form-group"><label>Label</label><input type="text" value={newLinkForm.label} onChange={(e) => setNewLinkForm((prev) => ({ ...prev, label: e.target.value }))} placeholder="Spotify" /></div>
                        <div className="form-group"><label>URL</label><input type="url" value={newLinkForm.url} onChange={(e) => setNewLinkForm((prev) => ({ ...prev, url: e.target.value }))} placeholder="https://..." /></div>
                        <button className="btn btn-sm" type="button" onClick={addLinkToArtist} style={{ marginBottom: 'var(--space)' }}>Add link</button>
                        {artist.links && artist.links.length > 0 && (
                          <div className="c-list">
                            {artist.links.map((link) => (
                              <div className="c-item" key={link.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span><strong>{link.label}</strong></span>
                                <button className="btn btn-sm" type="button" onClick={() => removeLinkFromArtist(artist.id, link.label)}>Remove</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {expandedAdminArtistId === artist.id && editingArtistId !== artist.id && (
                    <>
                      <div style={{ width: '100%', display: 'flex', gap: 'var(--space)', alignItems: 'flex-start', paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--border)' }}>
                        {artist.mediaUrl && (
                          <div style={{ flex: '0 0 100px', height: '100px', overflow: 'hidden', borderRadius: 'var(--radius)', backgroundImage: `url(${artist.mediaUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <p className="meta" style={{ fontSize: '0.8rem', textTransform: 'none', marginBottom: '0.4rem', lineHeight: 1.5 }}>{artist.bio}</p>
                          <div className="meta" style={{ fontSize: '0.7rem' }}>
                            {artist.media && artist.media.length > 0 ? `${artist.media.length} media item${artist.media.length !== 1 ? 's' : ''}` : 'No media yet'}
                            {artist.links && artist.links.length > 0 && ` • ${artist.links.length} link${artist.links.length !== 1 ? 's' : ''}`}
                          </div>
                        </div>
                      </div>
                      {artist.media && artist.media.length > 0 && (
                        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem', paddingTop: '0.5rem' }}>
                          {artist.media.map((item) => (
                            <div key={item.id} style={{ aspectRatio: '1', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg-muted)', overflow: 'hidden', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                              {item.type === 'video' ? (
                                <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <img src={item.url} alt={item.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={`panel ${activeAdminTab === 'polls' ? 'active' : ''}`}>
            <form className="pub-form" onSubmit={createNewPoll}>
              <div className="form-group"><label>Poll title</label><input type="text" value={pollForm.title} onChange={(e) => setPollForm((prev) => ({ ...prev, title: e.target.value }))} required /></div>
              <div className="form-group"><label>Category</label><select value={pollForm.category} onChange={(e) => setPollForm((prev) => ({ ...prev, category: e.target.value }))}>
                <option>Awards</option>
                <option>Events</option>
                <option>Music</option>
              </select></div>
              <div className="form-group"><label>Options</label>
                <div className="c-input-row">
                  <input className="c-input" value={pollForm.newOption} onChange={(e) => setPollForm((prev) => ({ ...prev, newOption: e.target.value }))} placeholder="Add an option" />
                  <button className="btn btn-sm" type="button" onClick={addPollOption}>Add</button>
                </div>
                <div className="c-list">
                  {pollForm.options.map((option, idx) => (
                    <div className="c-item" key={idx}>
                      <strong>{option}</strong>
                      <button className="btn btn-sm" type="button" style={{ marginLeft: 8 }} onClick={() => removePollOption(idx)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn">Create Poll</button>
            </form>
            <div className="post-list">
              {polls.length === 0 ? <p className="meta">No polls yet.</p> : polls.map((poll) => (
                <div className="p-item" key={poll.id}>
                  <div><strong>{poll.title}</strong> <span className="meta" style={{ display: 'inline', marginLeft: 6 }}>{poll.category}</span></div>
                  <button className="btn btn-sm" type="button" onClick={() => removePoll(poll.id)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div id="spotlight" className={activeView === 'spotlight' ? 'view active' : 'view'}>
        <header className="hero">
          <h1>VYN Spotlight</h1>
          <p className="sub">Promoted shows, supported artists, and featured projects curated by VYN.</p>
        </header>
        <div className="spotlight-grid" style={{ marginTop: 'var(--space-lg)' }}>
          {posts.filter((post) => post.spotlight).length > 0 ? posts.filter((post) => post.spotlight).map((post) => (
            <article className="post" key={post.id} style={{ border: 'none' }}>
              <div className="media-click" onClick={() => openPostDetail(post)}>
                {post.media_type === 'video' ? (
                  <video controls src={post.media_url} style={{ width: '100%', borderRadius: 'var(--radius)' }} />
                ) : (
                  <img src={post.media_url} alt={post.title} />
                )}
              </div>
              <div className="meta">{post.category}</div>
              <h3>{post.title}</h3>
              <p className="meta" style={{ textTransform: 'none' }}>{post.caption}</p>
            </article>
          )) : posts.slice(0, 6).map((post) => (
            <article className="post" key={post.id} style={{ border: 'none' }}>
              <div className="media-click" onClick={() => openPostDetail(post)}>
                {post.media_type === 'video' ? (
                  <video controls src={post.media_url} style={{ width: '100%', borderRadius: 'var(--radius)' }} />
                ) : (
                  <img src={post.media_url} alt={post.title} />
                )}
              </div>
              <div className="meta">{post.category}</div>
              <h3>{post.title}</h3>
              <p className="meta" style={{ textTransform: 'none' }}>{post.caption}</p>
            </article>
          ))}
        </div>
      </div>

      <div id="artist" className={activeView === 'artist' ? 'view active' : 'view'}>
        {selectedArtist ? (
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <button className="btn btn-sm" type="button" onClick={closeArtistDetail} style={{ marginBottom: 'var(--space)' }}>← Back to artists</button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-xl)', alignItems: 'start' }}>
              <div>
                <div className="meta">Artist Profile</div>
                <h2 style={{ marginTop: 6 }}>{selectedArtist.name}</h2>
                <div className="meta" style={{ marginBottom: 'var(--space)' }}>{selectedArtist.role}</div>
                <p style={{ maxWidth: 760, marginBottom: 'var(--space)' }}>{selectedArtist.bio}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space)' }}>
                  {selectedArtist.media.map((item) => (
                    <div key={item.id} className="media-preview-card">
                      <div className="media-preview-label">{item.caption}</div>
                      {item.type === 'video' ? (
                        <video controls src={item.url} className="media-preview" />
                      ) : (
                        <img src={item.url} alt={item.caption} className="media-preview" />
                      )}
                      <button className="btn btn-sm" type="button" onClick={() => likeArtistMedia(selectedArtist.id, item.id)} style={{ marginTop: '0.75rem' }}>
                        ♥ {item.likes || 0} Likes
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <aside style={{ position: 'relative' }}>
                <div className="media-preview-card" style={{ marginBottom: 'var(--space)' }}>
                  <div className="media-preview-label">Join the conversation</div>
                  <button className="btn btn-sm" type="button" onClick={() => likeArtistProfile(selectedArtist.id)} style={{ marginBottom: 'var(--space)' }}>Like Artist ♥ {selectedArtist.likes || 0}</button>
                  <div className="comment-box">
                    <div className="c-input-row">
                      <input className="c-input" placeholder="Leave a comment" value={artistCommentDrafts[selectedArtist.id] || ''} onChange={(e) => setArtistCommentDrafts((prev) => ({ ...prev, [selectedArtist.id]: e.target.value }))} />
                      <button className="btn btn-sm" type="button" onClick={() => postArtistComment(selectedArtist.id)}>Post</button>
                    </div>
                    <div className="c-list">
                      {selectedArtist.comments.map((comment) => (
                        <div className="c-item" key={comment.id}><strong>{comment.author}:</strong> {comment.body}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="media-preview-card">
                  <div className="media-preview-label">Links</div>
                  {selectedArtist.links.length > 0 ? selectedArtist.links.map((link) => (
                    <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="btn btn-sm" style={{ display: 'inline-flex', width: '100%', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>{link.label}</span>
                      <span>↗</span>
                    </a>
                  )) : <p className="meta">No external links yet.</p>}
                </div>
              </aside>
            </div>
          </div>
        ) : (
          <p className="meta">Choose an artist from the main page to explore their work.</p>
        )}
      </div>
      <div id="watch" className={activeView === 'watch' ? 'view active' : 'view'}>
        {activePost ? (
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <button className="btn btn-sm" type="button" onClick={() => { setActiveView('journal'); setSelectedPost(null); }} style={{ marginBottom: 'var(--space)' }}>← Back to feed</button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-xl)' }}>
              <div>
                <div className="meta">{activePost.category}</div>
                <h2 style={{ marginTop: 6 }}>{activePost.title}</h2>
                <div className="modal-media" style={{ marginTop: 'var(--space)' }}>
                  {activePost.media_type === 'video' ? (
                    <video controls src={activePost.media_url} style={{ width: '100%', borderRadius: 'var(--radius)' }} />
                  ) : (
                    <img src={activePost.media_url} alt={activePost.title} style={{ width: '100%', borderRadius: 'var(--radius)' }} />
                  )}
                </div>
                <p className="meta" style={{ textTransform: 'none', marginTop: 'var(--space)' }}>{activePost.caption}</p>
              </div>
              <aside style={{ position: 'relative' }}>
                <div className="actions" style={{ marginTop: 0 }}>
                  <button className={`act-btn ${activePost.liked ? 'liked' : ''}`} type="button" onClick={() => like(activePost.id)}>♥ {activePost.likes}</button>
                  <button className="act-btn" type="button">＋ {activePost.follows || 0}</button>
                </div>
                <div className="comment-box">
                  <div className="c-input-row">
                    <input className="c-input" placeholder="Add a note..." value={commentDrafts[activePost.id] || ''} onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [activePost.id]: e.target.value }))} />
                    <button className="btn btn-sm" type="button" onClick={() => postComment(activePost.id)}>Post</button>
                  </div>
                  <div className="c-list">
                    {activePost.comments?.map((comment) => (
                      <div className="c-item" key={comment.id}><strong>{comment.author}:</strong> {comment.body}</div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        ) : (
          <p className="meta">No post selected.</p>
        )}
      </div>

      <footer className="site-footer wrap">
        <div className="footer-top">
          <div>
            <div className="footer-logo">VYN.</div>
            <p className="footer-tag">A creative brand blending art, music, fashion, and lifestyle — built to be thrilled, on purpose.</p>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <a href="#pillars" onClick={(e) => { e.preventDefault(); document.querySelector('#pillars')?.scrollIntoView({ behavior: 'smooth' }); }}>Crafts</a>
            <a href="#drops" onClick={(e) => { e.preventDefault(); document.querySelector('#drops')?.scrollIntoView({ behavior: 'smooth' }); }}>Drops</a>
            <a href="#artists" onClick={(e) => { e.preventDefault(); document.querySelector('#artists')?.scrollIntoView({ behavior: 'smooth' }); }}>Artists</a>
          </div>
          <div className="footer-col">
            <h4>Studio</h4>
            <a href="#join" onClick={(e) => { e.preventDefault(); document.querySelector('#join')?.scrollIntoView({ behavior: 'smooth' }); }}>Apply</a>
            <a href="#">Mentorship</a>
            <a href="#">Collabs</a>
          </div>
          <div className="footer-col">
            <h4>Follow</h4>
            <a href="#">Instagram</a>
            <a href="#">TikTok</a>
            <a href="#">Spotify</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 VYN. To be thrilled.</span>
          <span>Made for artists, by artists.</span>
        </div>
      </footer>
      <div className="demo-badge">DEMO MODE • UI ONLY</div>

      {/* watch view modal replaced by a full-page `watch` view inside <main> */}

      {showAuth ? (
        <div className="modal active" id="authModal">
          <div className="modal-box">
            <button style={{ float: 'right' }} onClick={closeModal}>×</button>
            <h3 style={{ marginBottom: 'var(--space)' }}>{strings.login}</h3>
            <form onSubmit={handleLogin}>
              <div className="form-group"><label><input type="radio" name="role" value="reader" defaultChecked /> Reader</label></div>
              <div className="form-group"><label><input type="radio" name="role" value="editor" /> Editor</label></div>
              <div className="form-group"><label>Email</label><input type="email" required /></div>
              <div className="form-group"><label>Password</label><input type="password" required /></div>
              <button type="submit" className="btn" style={{ width: '100%' }}>{strings.enter}</button>
            </form>
          </div>
        </div>
      ) : null}

      {error ? <div className="modal active" style={{ alignItems: 'start', paddingTop: '4rem', background: 'rgba(0,0,0,0.15)' }}><div className="modal-box"><p style={{ color: '#C54040' }}>{error}</p><button className="btn btn-sm" type="button" onClick={() => setError('')}>Dismiss</button></div></div> : null}
      {message ? <div className="modal active" style={{ alignItems: 'start', paddingTop: '4rem', background: 'rgba(0,0,0,0.15)' }}><div className="modal-box"><p>{message}</p><button className="btn btn-sm" type="button" onClick={() => setMessage('')}>Dismiss</button></div></div> : null}
    </div>
  );
}
