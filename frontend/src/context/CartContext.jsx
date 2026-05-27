import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Persist cart items to localStorage on state change
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  // Add item to cart
  const addToCart = (product, qty = 1) => {
    const existItem = cartItems.find((x) => x.product === product._id);

    if (existItem) {
      const updated = cartItems.map((x) =>
        x.product === product._id
          ? { ...x, qty: Math.min(x.countInStock, existItem.qty + qty) }
          : x
      );
      saveCart(updated);
    } else {
      const newItem = {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: Math.min(product.countInStock, qty),
      };
      saveCart([...cartItems, newItem]);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updated = cartItems.filter((x) => x.product !== productId);
    saveCart(updated);
  };

  // Update item quantity
  const updateQuantity = (productId, qty) => {
    const updated = cartItems.map((x) =>
      x.product === productId ? { ...x, qty: Number(qty) } : x
    );
    saveCart(updated);
  };

  // Clear all items in cart
  const clearCart = () => {
    saveCart([]);
  };

  // Calculate pricing metrics
  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  // Free shipping over $100, else $9.99
  const shippingPrice = itemsCount > 0 && itemsPrice >= 100 ? 0 : itemsCount > 0 ? 9.99 : 0;
  
  // 8% tax rate
  const taxPrice = itemsPrice * 0.08;
  
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemsCount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for consuming cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
