
import { useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import axios from "axios";

function BarcodeScanner() {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const processingRef = useRef(false);

  const [isScanning, setIsScanning] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  // MRP states
  const [mrpInput, setMrpInput] = useState("");
  const [savingMRP, setSavingMRP] = useState(false);

  // Start barcode scanning
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
        async (result, scanError, controls) => {
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

  // Stop barcode scanning
  const stopScanning = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setIsScanning(false);
  };

  // Save MRP to MongoDB
  const saveMRP = async () => {
    if (!mrpInput || !Number.isFinite(Number(mrpInput)) || Number(mrpInput) <= 0) {
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
        {
          mrp: Number(mrpInput),
        }
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
    <div style={{ maxWidth: "500px", margin: "30px auto", padding: "20px" }}>
      <h2>Barcode Scanner</h2>

      <video
        ref={videoRef}
        style={{ width: "100%", borderRadius: "10px" }}
        autoPlay
        muted
        playsInline
      />

      {!isScanning ? (
        <button onClick={startScanning}>
          Start Barcode Scan
        </button>
      ) : (
        <button onClick={stopScanning}>
          Stop Scanning
        </button>
      )}

      {barcode && <p>Barcode: {barcode}</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {product && (
        <div style={{ marginTop: "20px" }}>
          <h3>Product Details</h3>

          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.productName}
              style={{ width: "150px" }}
            />
          )}

          <p>
            <strong>Name:</strong>{" "}
            {product.productName || "Not available"}
          </p>

          <p>
            <strong>Brand:</strong>{" "}
            {product.brand || "Not available"}
          </p>

          <p>
            <strong>Quantity:</strong>{" "}
            {product.quantity || "Not available"}
          </p>

          {/* MRP Display or Entry */}
          {product.mrp !== null && product.mrp !== undefined ? (
            <p>
              <strong>MRP:</strong> ₹{product.mrp}
            </p>
          ) : (
            <div style={{ marginTop: "15px" }}>
              <p>
                <strong>MRP is not available.</strong>
              </p>

              <label htmlFor="mrp">
                Enter MRP printed on product package:
              </label>

              <input
                id="mrp"
                type="number"
                placeholder="Enter MRP"
                min="0.01"
                step="0.01"
                value={mrpInput}
                onChange={(e) => setMrpInput(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  marginTop: "8px",
                  marginBottom: "10px",
                  boxSizing: "border-box",
                }}
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
                {savingMRP ? "Saving..." : "Save MRP"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BarcodeScanner;
