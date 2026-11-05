import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAuth } from "../authentication/AuthContext";
import { useCart } from "../context/CartContext";

const Products = () => {
  const { user } = useAuth();
  const { addToCart, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const openScanner = outletContext?.openScanner;
  const [query, setQuery] = useState("");

  const sampleProducts = [
    {
      id: 1,
      name: "Cotton Casual Shirt",
      brand: "Kudanthai Trends",
      barcode: "8901030865421",
      mrp: 799,
      stock: 24,
      category: "Apparel",
    },
    {
      id: 2,
      name: "Denim Slim Jeans",
      brand: "Urban Wear",
      barcode: "8901030912384",
      mrp: 1299,
      stock: 12,
      category: "Apparel",
    },
    {
      id: 3,
      name: "Linen Formal Trousers",
      brand: "Classic Fit",
      barcode: "8901234567890",
      mrp: 999,
      stock: 18,
      category: "Apparel",
    },
    {
      id: 4,
      name: "Printed Silk Scarf",
      brand: "Kudanthai Heritage",
      barcode: "8909876543210",
      mrp: 450,
      stock: 35,
      category: "Accessories",
    },
  ];

  const filtered = sampleProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.barcode.includes(query) ||
      p.brand.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page-container products-page">
      <div className="page-header-row">
        <div>
          <span className="page-tag">INVENTORY</span>
          <h2>Products & Stock</h2>
          <p className="page-subtext">{sampleProducts.length} items cataloged • {user?.shopName || "Store"}</p>
        </div>
        <button
          className="scan-shortcut-btn"
          onClick={() => {
            if (openScanner) openScanner();
            else navigate("/new-bill");
          }}
          title="Open Camera Scanner"
        >
          ⚡ Scan
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-box-wrap">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search by product name, barcode or brand..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="clear-search-btn" onClick={() => setQuery("")}>
            ✕
          </button>
        )}
      </div>

      {/* Product list */}
      <div className="products-list">
        {filtered.map((item) => (
          <div key={item.id} className="product-card">
            <div className="product-card-top">
              <div className="product-category-tag">{item.category}</div>
              <span className="product-stock-tag in-stock">
                {item.stock} in stock
              </span>
            </div>
            <h4>{item.name}</h4>
            <div className="product-meta-row">
              <span className="brand-text">{item.brand}</span>
              <span className="barcode-chip">#{item.barcode}</span>
            </div>
            <div className="product-card-footer">
              <span className="product-price">₹{item.mrp.toFixed(2)}</span>
              <button
                className="add-to-bill-btn"
                onClick={() => {
                  addToCart({
                    barcode: item.barcode,
                    productName: item.name,
                    brand: item.brand,
                    mrp: item.mrp,
                  }, 1);
                }}
              >
                + Add to Cart
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty-search-box">
            <p>No products found matching "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

