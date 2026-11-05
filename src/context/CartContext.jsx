import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "billflow_cart_items";
const SALES_STORAGE_KEY = "billflow_sales_history";

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Initialize sales history from localStorage
  const [sales, setSales] = useState(() => {
    try {
      const saved = localStorage.getItem(SALES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [justAddedBarcode, setJustAddedBarcode] = useState(null);

  // Sync cart changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  // Sync sales history changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SALES_STORAGE_KEY, JSON.stringify(sales));
    } catch (e) {
      console.error("Failed to save sales to localStorage", e);
    }
  }, [sales]);

  // Fetch sales from API if available on load
  useEffect(() => {
    const fetchRemoteSales = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/sales`);
        if (response.data && response.data.sales && response.data.sales.length > 0) {
          // Merge with local sales without duplicates
          setSales((prev) => {
            const remoteMap = new Map();
            response.data.sales.forEach((s) => remoteMap.set(s.invoiceNumber, s));
            prev.forEach((s) => {
              if (!remoteMap.has(s.invoiceNumber)) {
                remoteMap.set(s.invoiceNumber, s);
              }
            });
            return Array.from(remoteMap.values());
          });
        }
      } catch {
        // Backend offline or unreachable, local storage handles it flawlessly
      }
    };

    fetchRemoteSales();
  }, []);

  // Add a product to the cart
  const addToCart = (product, qty = 1) => {
    if (!product || !product.barcode) return;

    const barcode = product.barcode;
    const price =
      product.mrp !== null && product.mrp !== undefined && Number(product.mrp) > 0
        ? Number(product.mrp)
        : 50.0; // fallback standard price if not set

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.barcode === barcode);

      if (existingIndex > -1) {
        // Increment quantity of existing item
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      } else {
        // Add new item to cart
        return [
          {
            id: barcode,
            barcode: barcode,
            productName: product.productName || "Product Item",
            brand: product.brand || "Retail Item",
            price: price,
            quantity: qty,
            imageUrl: product.imageUrl || "",
          },
          ...prevCart,
        ];
      }
    });

    // Trigger bounce feedback
    setJustAddedBarcode(barcode);
    setTimeout(() => setJustAddedBarcode(null), 1500);
  };

  // Update item quantity (+1 or -1)
  const updateQuantity = (barcode, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.barcode === barcode) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Remove a product from cart
  const removeFromCart = (barcode) => {
    setCart((prevCart) => prevCart.filter((item) => item.barcode !== barcode));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Compute total items count in cart
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Compute total amount in cart
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Compute today's sales metrics
  const isToday = (dateString) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const todaySalesList = sales.filter((s) => isToday(s.date || s.createdAt));

  const todayTotalSales = todaySalesList.reduce(
    (sum, s) => sum + (Number(s.totalAmount) || 0),
    0
  );

  const todayBillsCount = todaySalesList.length;

  const todayItemsCount = todaySalesList.reduce(
    (sum, s) => sum + (Number(s.itemsCount) || 1),
    0
  );

  // Checkout and record completed bill
  const checkout = async ({
    paymentMethod = "Cash",
    customerName = "Walk-in Customer",
    customerPhone = "",
  }) => {
    if (cart.length === 0) return null;

    const invNum = `INV-${Date.now().toString().slice(-6)}`;
    const now = new Date();

    const saleRecord = {
      id: invNum,
      invoiceNumber: invNum,
      items: cart.map((item) => ({
        barcode: item.barcode,
        productName: item.productName,
        brand: item.brand,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
      totalAmount: cartTotal,
      itemsCount: cartCount,
      paymentMethod,
      customerName: customerName.trim() || "Walk-in Customer",
      customerPhone: customerPhone.trim() || "",
      date: now.toISOString(),
      formattedTime: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // 1. Immediately update local sales state
    setSales((prev) => [saleRecord, ...prev]);

    // 2. Clear the cart
    clearCart();

    // 3. Set the receipt modal
    setLastReceipt(saleRecord);

    // 4. Close cart drawer
    setIsCartOpen(false);

    // 5. Asynchronously persist to backend if available
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/sales`, saleRecord);
    } catch {
      // Local copy already saved
    }

    return saleRecord;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        sales,
        todaySalesList,
        todayTotalSales,
        todayBillsCount,
        todayItemsCount,
        checkout,
        lastReceipt,
        setLastReceipt,
        justAddedBarcode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

