export default function AdminPanel({
  strings,
  user,
  nav,
  activeAdminTab,
  setActiveAdminTab,
  postForm,
  setPostForm,
  publish,
  editingPostId,
  cancelEdit,
  posts,
  editPost,
  deletePostItem,
  heroVideoInput,
  setHeroVideoInput,
  saveHeroVideoBackground,
  productForm,
  setProductForm,
  createNewProduct,
  editingProductId,
  resetProductForm,
  products,
  editProduct,
  removeProduct,
  artistForm,
  setArtistForm,
  createNewArtist,
  artists,
  expandedAdminArtistId,
  setExpandedAdminArtistId,
  editingArtistId,
  startEditingArtist,
  removeArtist,
  editArtistForm,
  setEditArtistForm,
  saveArtistEdits,
  setEditingArtistId,
  newMediaForm,
  setNewMediaForm,
  addMediaToArtist,
  removeMediaFromArtist,
  newLinkForm,
  setNewLinkForm,
  addLinkToArtist,
  removeLinkFromArtist,
  pollForm,
  setPollForm,
  addPollOption,
  removePollOption,
  createNewPoll,
  polls,
  removePoll,
}) {
  return (
    <div id="admin" className="view active">
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
          <button type="button" className="btn btn-sm" onClick={saveHeroVideoBackground} style={{ marginBottom: 'var(--space)' }}>Save hero background</button>
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
          <div className="form-group"><label>Shop type</label><select value={productForm.type} onChange={(e) => setProductForm((prev) => ({ ...prev, type: e.target.value }))}><option value="merch">Merch</option><option value="art">Art</option></select></div>
          <div className="form-group"><label>Category</label><select value={productForm.category} onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}><option>Merch</option><option>Art</option></select></div>
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
                    <div className="form-group"><label>Type</label><select value={newMediaForm.type} onChange={(e) => setNewMediaForm((prev) => ({ ...prev, type: e.target.value }))}><option value="image">Image</option><option value="video">Video</option></select></div>
                    <div className="form-group"><label>URL</label><input type="url" value={newMediaForm.url} onChange={(e) => setNewMediaForm((prev) => ({ ...prev, url: e.target.value }))} placeholder="https://..." /></div>
                    <div className="form-group"><label>Caption</label><input type="text" value={newMediaForm.caption} onChange={(e) => setNewMediaForm((prev) => ({ ...prev, caption: e.target.value }))} placeholder="Short description" /></div>
                    <button className="btn btn-sm" type="button" onClick={addMediaToArtist} style={{ marginBottom: 'var(--space)' }}>Add media</button>
                    {artist.media && artist.media.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
                        {artist.media.map((item) => (
                          <div key={item.id} style={{ aspectRatio: '1', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg-muted)', overflow: 'hidden', position: 'relative' }}>
                            {item.type === 'video' ? <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <img src={item.url} alt={item.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                            <button type="button" onClick={() => removeMediaFromArtist(artist.id, item.id)} style={{ position: 'absolute', top: 0, right: 0, opacity: 0, transition: 'opacity 200ms', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', padding: '4px 6px', fontSize: '0.7rem', cursor: 'pointer' }}>✕</button>
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
                    {artist.mediaUrl && <div style={{ flex: '0 0 100px', height: '100px', overflow: 'hidden', borderRadius: 'var(--radius)', backgroundImage: `url(${artist.mediaUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
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
                        <div key={item.id} style={{ aspectRatio: '1', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg-muted)', overflow: 'hidden' }}>
                          {item.type === 'video' ? <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <img src={item.url} alt={item.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
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
          <div className="form-group"><label>Category</label><select value={pollForm.category} onChange={(e) => setPollForm((prev) => ({ ...prev, category: e.target.value }))}><option>Awards</option><option>Events</option><option>Music</option></select></div>
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
  );
}
