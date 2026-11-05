
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

  const startScanning = async () => {
    setError("");
    setProduct(null);
    setBarcode("");
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
                `http://localhost:5000/api/products/${encodeURIComponent(scannedBarcode)}`
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
      setError("Unable to access camera. Please allow camera permission.");
    }
  };

  const stopScanning = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setIsScanning(false);
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

          <p><strong>Name:</strong> {product.productName || "Not available"}</p>
          <p><strong>Brand:</strong> {product.brand || "Not available"}</p>
          <p><strong>Quantity:</strong> {product.quantity || "Not available"}</p>
          <p>
            <strong>MRP:</strong>{" "}
            {product.mrp !== null && product.mrp !== undefined
              ? `₹${product.mrp}`
              : "Not available"}
          </p>
        </div>
      )}
    </div>
  );
}

export default BarcodeScanner;
