export default function ArtistDirectoryView({ artistSearch, setArtistSearch, artistCraftGroups, openArtistDetail }) {
  return (
    <div id="artists-directory" className="view active">
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
  );
}
