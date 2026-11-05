
import { useRef, useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import axios from "axios";
import "./BarcodeScanner.css";

function BarcodeScanner() {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const processingRef = useRef(false);

  const [isScanning, setIsScanning] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [mrpInput, setMrpInput] = useState("");
  const [savingMRP, setSavingMRP] = useState(false);

  useEffect(() => {
    return () => {
      controlsRef.current?.stop();
    };
  }, []);

  const startScanning = async () => {
    setError("");
    setProduct(null);
    setBarcode("");
    setMrpInput("");
    processingRef.current = false;

    try {
      const reader = new BrowserMultiFormatReader();

      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        async (result) => {
          if (result && !processingRef.current) {
            processingRef.current = true;

            const scannedBarcode = result.getText();
            setBarcode(scannedBarcode);

            controls.stop();
            controlsRef.current = null;
            setIsScanning(false);

            try {
              const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/products/${encodeURIComponent(
                  scannedBarcode
                )}`
              );

              setProduct(response.data.product);
            } catch (apiError) {
              setError(
                apiError.response?.data?.message ||
                  "Unable to fetch product details"
              );
            }
          }
        }
      );

      controlsRef.current = controls;
      setIsScanning(true);
    } catch (scanError) {
      console.error("Camera error:", scanError);
      setError("Unable to access camera. Please allow camera permission.");
    }
  };

  const stopScanning = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setIsScanning(false);
  };

  const saveMRP = async () => {
    if (
      !mrpInput ||
      !Number.isFinite(Number(mrpInput)) ||
      Number(mrpInput) <= 0
    ) {
      setError("Please enter a valid MRP");
      return;
    }

    try {
      setSavingMRP(true);
      setError("");

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/products/${encodeURIComponent(
          barcode
        )}/mrp`,
        { mrp: Number(mrpInput) }
      );

      setProduct(response.data.product);
      setMrpInput("");
    } catch (apiError) {
      setError(
        apiError.response?.data?.message || "Unable to save MRP"
      );
    } finally {
      setSavingMRP(false);
    }
  };

  return (
    <div className="scanner-page">
      <div className="scanner-heading">
        <div>
          <span className="scanner-eyebrow">BILLING MANAGEMENT</span>
          <h2>Barcode Scanner</h2>
          <p>Scan a product barcode to retrieve its details.</p>
        </div>

        <div className="scanner-heading-icon">
          <span>▥</span>
        </div>
      </div>

      <div className="scanner-card">
        <div className="scanner-card-header">
          <div>
            <h3>Scan Product</h3>
            <p>Position the barcode inside the camera frame.</p>
          </div>

          <span className={`scanner-status ${isScanning ? "active" : ""}`}>
            <span className="status-dot"></span>
            {isScanning ? "Scanning" : "Ready"}
          </span>
        </div>

        <div className={`camera-container ${isScanning ? "camera-active" : ""}`}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
          />

          {!isScanning && (
            <div className="camera-placeholder">
              <div className="camera-icon">▦</div>
              <h4>Camera is ready</h4>
              <p>Start scanning to open your camera.</p>
            </div>
          )}

          {isScanning && (
            <div className="scan-overlay">
              <div className="scan-frame">
                <span className="corner top-left"></span>
                <span className="corner top-right"></span>
                <span className="corner bottom-left"></span>
                <span className="corner bottom-right"></span>
                <div className="scan-line"></div>
              </div>
              <span className="scan-hint">Align barcode within the frame</span>
            </div>
          )}
        </div>

        <div className="scanner-actions">
          {!isScanning ? (
            <button className="scan-button" onClick={startScanning}>
              <span>▦</span> Start Barcode Scan
            </button>
          ) : (
            <button className="stop-button" onClick={stopScanning}>
              Stop Scanning
            </button>
          )}
        </div>

        {barcode && (
          <div className="barcode-result">
            <span className="barcode-result-icon">✓</span>
            <div>
              <small>SCANNED BARCODE</small>
              <strong>{barcode}</strong>
            </div>
          </div>
        )}

        {error && (
          <div className="scanner-error">
            <span>!</span>
            {error}
          </div>
        )}
      </div>

      {product && (
        <div className="product-card">
          <div className="product-card-header">
            <div>
              <span className="scanner-eyebrow">PRODUCT INFORMATION</span>
              <h3>Product Details</h3>
            </div>
            <span className="product-found">Product Found</span>
          </div>

          <div className="product-details">
            <div className="product-image">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.productName || "Product"}
                />
              ) : (
                <span>▧</span>
              )}
            </div>

            <div className="product-info">
              <h4>{product.productName || "Unknown Product"}</h4>

              <p>
                <span>Brand</span>
                <strong>{product.brand || "Not available"}</strong>
              </p>

              <p>
                <span>Quantity</span>
                <strong>{product.quantity || "Not available"}</strong>
              </p>

              <p>
                <span>Barcode</span>
                <strong>{barcode}</strong>
              </p>
            </div>
          </div>

          <div className="mrp-section">
            {product.mrp !== null && product.mrp !== undefined ? (
              <div className="mrp-display">
                <div>
                  <span>PRODUCT MRP</span>
                  <h2>₹{Number(product.mrp).toFixed(2)}</h2>
                </div>
                <span className="mrp-saved">✓ Saved</span>
              </div>
            ) : (
              <div className="mrp-entry">
                <div>
                  <h4>MRP not available</h4>
                  <p>Enter the MRP printed on the product package.</p>
                </div>

                <label htmlFor="mrp">Product MRP (₹)</label>
                <input
                  id="mrp"
                  type="number"
                  placeholder="Enter product MRP"
                  min="0.01"
                  step="0.01"
                  value={mrpInput}
                  onChange={(e) => setMrpInput(e.target.value)}
                />

                <button
                  onClick={saveMRP}
                  disabled={
                    savingMRP ||
                    !mrpInput ||
                    !Number.isFinite(Number(mrpInput)) ||
                    Number(mrpInput) <= 0
                  }
                >
                  {savingMRP ? "Saving MRP..." : "Save MRP"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BarcodeScanner;
