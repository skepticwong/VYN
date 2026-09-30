export default function LandingView({
  strings,
  heroVideoUrl,
  getHeroBackgroundMedia,
  landingPillars,
  landingDrops,
  posts,
  featureList,
  openPostDetail,
  setActiveView,
  setMenuOpen,
}) {
  return (
    <div id="journal" className="view active">
      <header className="hero landing-hero reveal">
        {heroVideoUrl ? getHeroBackgroundMedia() : null}
        <div className="hero-glow" />
        <div className="hero-content">
          <p className="hero-eyebrow"><span className="pulse-dot" />VYN Presents</p>
          <h1 className="display">VIDBES <span className="line2">YOU NEED</span></h1>
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
              <div className="drop-meta">{drop.meta}</div>
              <div className="drop-price">{drop.price}</div>
              <p>{drop.desc}</p>
            </div>
          ))}
        </div>
      </section>

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
          </article>
        ))}
      </div>
    </div>
  );
}
