import { useEffect, useMemo, useState } from 'react';
import { createPoll, createPost, fetchPolls, fetchPosts, likePost, commentPost, votePoll, deletePost, deletePoll, updatePost } from './api';
import {
  dict,
  initialPollForm,
  initialPostForm,
  landingArtists,
  landingDrops,
  landingPillars,
  defaultArtists,
  defaultProducts,
} from './siteContent';
import { createStudioId, normalizeArtist } from './studioUtils';
import LandingView from './components/LandingView';
import ShopView from './components/ShopView';
import ArtistDirectoryView from './components/ArtistDirectoryView';
import AdminPanel from './components/AdminPanel';
import './styles.css';

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
          <LandingView
            strings={strings}
            heroVideoUrl={heroVideoUrl}
            getHeroBackgroundMedia={getHeroBackgroundMedia}
            landingPillars={landingPillars}
            landingDrops={landingDrops}
            posts={posts}
            featureList={featureList}
            openPostDetail={openPostDetail}
            setActiveView={setActiveView}
            setMenuOpen={setMenuOpen}
          />
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
          <ArtistDirectoryView
            artistSearch={artistSearch}
            setArtistSearch={setArtistSearch}
            artistCraftGroups={artistCraftGroups}
            openArtistDetail={openArtistDetail}
          />
        </div>

        <div id="shop" className={activeView === 'shop' ? 'view active' : 'view'}>
          <ShopView filteredProducts={filteredProducts} shopFilter={shopFilter} setShopFilter={setShopFilter} />
        </div>

        <div id="admin" className={activeView === 'admin' ? 'view active' : 'view'}>
          <AdminPanel
            strings={strings}
            user={user}
            nav={nav}
            activeAdminTab={activeAdminTab}
            setActiveAdminTab={setActiveAdminTab}
            postForm={postForm}
            setPostForm={setPostForm}
            publish={publish}
            editingPostId={editingPostId}
            cancelEdit={cancelEdit}
            posts={posts}
            editPost={editPost}
            deletePostItem={deletePostItem}
            heroVideoInput={heroVideoInput}
            setHeroVideoInput={setHeroVideoInput}
            saveHeroVideoBackground={saveHeroVideoBackground}
            productForm={productForm}
            setProductForm={setProductForm}
            createNewProduct={createNewProduct}
            editingProductId={editingProductId}
            resetProductForm={resetProductForm}
            products={products}
            editProduct={editProduct}
            removeProduct={removeProduct}
            artistForm={artistForm}
            setArtistForm={setArtistForm}
            createNewArtist={createNewArtist}
            artists={artists}
            expandedAdminArtistId={expandedAdminArtistId}
            setExpandedAdminArtistId={setExpandedAdminArtistId}
            editingArtistId={editingArtistId}
            startEditingArtist={startEditingArtist}
            removeArtist={removeArtist}
            editArtistForm={editArtistForm}
            setEditArtistForm={setEditArtistForm}
            saveArtistEdits={saveArtistEdits}
            setEditingArtistId={setEditingArtistId}
            newMediaForm={newMediaForm}
            setNewMediaForm={setNewMediaForm}
            addMediaToArtist={addMediaToArtist}
            removeMediaFromArtist={removeMediaFromArtist}
            newLinkForm={newLinkForm}
            setNewLinkForm={setNewLinkForm}
            addLinkToArtist={addLinkToArtist}
            removeLinkFromArtist={removeLinkFromArtist}
            pollForm={pollForm}
            setPollForm={setPollForm}
            addPollOption={addPollOption}
            removePollOption={removePollOption}
            createNewPoll={createNewPoll}
            polls={polls}
            removePoll={removePoll}
          />
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
