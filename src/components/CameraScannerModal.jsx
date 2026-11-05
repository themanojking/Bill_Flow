import React, { useRef, useState, useEffect, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import axios from "axios";
import { useCart } from "../context/CartContext";

const CameraScannerModal = ({ isOpen, onClose }) => {
  const { addToCart, cartCount, cartTotal, setIsCartOpen } = useCart();
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const processingRef = useRef(false);

  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState(null);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [mrpInput, setMrpInput] = useState("");
  const [savingMRP, setSavingMRP] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [showManual, setShowManual] = useState(false);

  // Play retail barcode beep chime
  const playBeep = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Audio autoplay might be restricted, ignore silently
    }
  };

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
      } catch (e) {
        console.error("Error stopping ZXing controls:", e);
      }
      controlsRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      try {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      } catch (e) {
        console.error("Error stopping video stream tracks:", e);
      }
    }

    setIsScanning(false);
    processingRef.current = false;
  }, []);

  // Fetch product information by barcode
  const fetchProduct = useCallback(async (code) => {
    setFetchingProduct(true);
    setCameraError("");
    setProduct(null);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/${encodeURIComponent(code)}`
      );
      const fetchedProduct = response.data.product;
      setProduct(fetchedProduct);
      if (fetchedProduct) {
        addToCart(fetchedProduct, 1);
      }
    } catch (err) {
      console.error("Product lookup error:", err);
      setCameraError(
        err.response?.data?.message || "Product not found in database"
      );
    } finally {
      setFetchingProduct(false);
    }
  }, []);

  // Start barcode camera scanner
  const startCamera = useCallback(async () => {
    setCameraError("");
    processingRef.current = false;

    // Small delay to ensure the modal DOM element videoRef is ready
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (!videoRef.current) return;

    try {
      const reader = new BrowserMultiFormatReader();

      const controls = await reader.decodeFromVideoDevice(
        undefined, // default back or active camera
        videoRef.current,
        async (result) => {
          if (result && !processingRef.current) {
            processingRef.current = true;
            const scannedCode = result.getText();

            playBeep();
            setBarcode(scannedCode);
            stopCamera();
            await fetchProduct(scannedCode);
          }
        }
      );

      controlsRef.current = controls;
      setIsScanning(true);
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError(
        "Camera access denied or unavailable. Please grant camera permission or use manual barcode entry."
      );
      setIsScanning(false);
    }
  }, [fetchProduct, stopCamera]);

  // Handle modal open/close lifecycle
  useEffect(() => {
    if (isOpen) {
      setBarcode("");
      setProduct(null);
      setCameraError("");
      setMrpInput("");
      setShowManual(false);
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  // Restart scanner for next item
  const handleScanNext = () => {
    setBarcode("");
    setProduct(null);
    setCameraError("");
    setMrpInput("");
    setShowManual(false);
    startCamera();
  };

  // Handle manual code submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const code = manualInput.trim();
    setBarcode(code);
    playBeep();
    stopCamera();
    fetchProduct(code);
  };

  // Save MRP update
  const handleSaveMRP = async () => {
    if (!mrpInput || Number(mrpInput) <= 0) return;

    try {
      setSavingMRP(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/products/${encodeURIComponent(
          barcode
        )}/mrp`,
        { mrp: Number(mrpInput) }
      );
      const updatedProduct = response.data.product;
      setProduct(updatedProduct);
      setMrpInput("");
      if (updatedProduct) {
        addToCart(updatedProduct, 0);
      }
    } catch (err) {
      setCameraError(err.response?.data?.message || "Failed to update MRP");
    } finally {
      setSavingMRP(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="camera-modal-backdrop" onClick={onClose}>
      <div
        className="camera-modal-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="scanner-modal-title"
      >
        {/* Header */}
        <div className="camera-modal-header">
          <div className="camera-modal-title-wrap">
            <span className="camera-modal-tag">LIVE POS SCANNER</span>
            <h3 id="scanner-modal-title">Barcode Scanner</h3>
          </div>
          <button
            className="camera-modal-close"
            onClick={onClose}
            aria-label="Close camera scanner"
          >
            ✕
          </button>
        </div>

        {/* Camera Viewport or Result */}
        <div className="camera-modal-body">
          {!barcode && (
            <div className="camera-viewfinder-wrap">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-live-feed"
              />

              {isScanning && (
                <div className="viewfinder-overlay">
                  <div className="viewfinder-frame">
                    <span className="frame-corner top-left"></span>
                    <span className="frame-corner top-right"></span>
                    <span className="frame-corner bottom-left"></span>
                    <span className="frame-corner bottom-right"></span>
                    <div className="laser-beam"></div>
                  </div>
                  <span className="viewfinder-hint">
                    Point camera at barcode to scan
                  </span>
                </div>
              )}

              {!isScanning && !cameraError && (
                <div className="camera-init-overlay">
                  <div className="camera-spinner"></div>
                  <p>Starting camera...</p>
                </div>
              )}
            </div>
          )}

          {/* Camera Error / Permission Banner */}
          {cameraError && (
            <div className="camera-modal-alert">
              <span>⚠️</span>
              <p>{cameraError}</p>
              {!isScanning && !barcode && (
                <button className="retry-camera-btn" onClick={startCamera}>
                  Retry Camera
                </button>
              )}
            </div>
          )}

          {/* Loading Product State */}
          {fetchingProduct && (
            <div className="product-fetching-box">
              <div className="camera-spinner"></div>
              <h4>Scanning: {barcode}</h4>
              <p>Fetching product details from database...</p>
            </div>
          )}

          {/* Product Scanned Result Card */}
          {product && (
            <div className="scanned-product-result">
              <div className="scanned-success-badge">
                <span>✓</span> Added to Cart • Basket: {cartCount} items (₹{cartTotal.toFixed(2)})
              </div>

              <div className="scanned-product-card">
                <div className="scanned-product-img">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.productName} />
                  ) : (
                    <span>📦</span>
                  )}
                </div>

                <div className="scanned-product-info">
                  <h4>{product.productName || "Product Found"}</h4>
                  <p className="scanned-brand">Brand: {product.brand || "Standard"}</p>
                  <p className="scanned-barcode">#{barcode}</p>
                </div>
              </div>

              {/* Price / MRP Section */}
              <div className="scanned-price-box">
                {product.mrp !== null && product.mrp !== undefined ? (
                  <div className="price-display-row">
                    <div>
                      <small>PRODUCT MRP</small>
                      <h3>₹{Number(product.mrp).toFixed(2)}</h3>
                    </div>
                    <span className="mrp-saved-pill">✓ Saved</span>
                  </div>
                ) : (
                  <div className="price-entry-box">
                    <label>Set MRP for this Product (₹)</label>
                    <div className="mrp-input-group">
                      <input
                        type="number"
                        placeholder="e.g. 150.00"
                        value={mrpInput}
                        onChange={(e) => setMrpInput(e.target.value)}
                        min="0.01"
                        step="0.01"
                      />
                      <button
                        className="save-mrp-btn"
                        onClick={handleSaveMRP}
                        disabled={savingMRP || !mrpInput}
                      >
                        {savingMRP ? "Saving..." : "Save MRP"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="scanned-actions-column">
                <button
                  className="cart-checkout-direct-btn"
                  onClick={() => {
                    onClose();
                    setIsCartOpen(true);
                  }}
                >
                  🛒 View Cart ({cartCount}) • ₹{cartTotal.toFixed(2)} →
                </button>

                <div className="scanned-actions-row">
                  <button className="scan-again-btn" onClick={handleScanNext}>
                    ⚡ Scan Next Item
                  </button>
                  <button className="done-btn" onClick={onClose}>
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Manual Input Toggle when camera is active */}
          {!barcode && (
            <div className="manual-barcode-section">
              {!showManual ? (
                <button
                  type="button"
                  className="manual-toggle-btn"
                  onClick={() => setShowManual(true)}
                >
                  ⌨️ Enter Barcode Manually
                </button>
              ) : (
                <form onSubmit={handleManualSubmit} className="manual-form">
                  <input
                    type="text"
                    placeholder="Enter barcode number (e.g. 8901030...)"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="manual-submit-btn">
                    Search
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraScannerModal;

