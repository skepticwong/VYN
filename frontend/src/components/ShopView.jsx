export default function ShopView({ filteredProducts, shopFilter, setShopFilter }) {
  return (
    <div id="shop" className="view active">
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
  );
}
