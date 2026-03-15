'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext({
  cartItems: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isCartOpen: false,
  setIsCartOpen: () => {},
  totalCount: 0,
  totalPrice: 0,
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    const savedCart = window.localStorage.getItem('thuychi_cart');

    if (!savedCart) {
      return [];
    }

    try {
      return JSON.parse(savedCart);
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, status } = useAuth();
  const isInitialized = React.useRef(false);

  // Sync with localStorage ALWAYS for persistence
  useEffect(() => {
    if (cartItems.length > 0 || isInitialized.current) {
        localStorage.setItem('thuychi_cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Server Sync Logic
  const syncWithServer = useCallback(async (items) => {
    if (!user) return;
    try {
      await fetch('/api/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: user.id,
          items: items.map(item => ({
            productSlug: item.slug,
            productName: item.name,
            variant: item.variant,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        }),
      });
    } catch (err) {
      console.error('Failed to sync cart with server:', err);
    }
  }, [user]);

  // Initial load and merge when user LOGS IN
  useEffect(() => {
    if (status === 'authenticated' && user && !isInitialized.current) {
      const fetchAndMergeCart = async () => {
        try {
          const res = await fetch(`/api/carts?where[customer][equals]=${user.id}`);
          if (!res.ok) return;
          const data = await res.json();
          
          let finalItems = [...cartItems];
          
          if (data.docs && data.docs.length > 0) {
            const serverItems = data.docs[0].items.map(item => ({
              id: `${item.productSlug}-${item.variant || 'default'}`,
              slug: item.productSlug,
              name: item.productName,
              variant: item.variant,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            }));
            
            // Merge: server items + local items not on server
            const merged = [...serverItems];
            cartItems.forEach(localItem => {
              if (!merged.find(m => m.id === localItem.id)) {
                merged.push(localItem);
              }
            });
            finalItems = merged;
          }
          
          setCartItems(finalItems);
          syncWithServer(finalItems);
          isInitialized.current = true;
        } catch (err) {
          console.error('Failed to fetch/merge server cart:', err);
        }
      };
      fetchAndMergeCart();
    } else if (status === 'unauthenticated') {
      isInitialized.current = false;
    }
  }, [status, user, syncWithServer]); // Remove cartItems dependency

  const addItem = (product, quantity = 1, variant = null) => {
    const cartId = `${product.slug}-${variant || 'default'}`;
    
    setCartItems(prev => {
      const existing = prev.find(item => item.id === cartId);
      let newItems;
      if (existing) {
        newItems = prev.map(item => 
          item.id === cartId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        newItems = [...prev, {
          id: cartId,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          variant: variant,
          quantity: quantity,
        }];
      }
      if (user) syncWithServer(newItems);
      return newItems;
    });
    setIsCartOpen(true);
  };

  const removeItem = (cartId) => {
    setCartItems(prev => {
      const newItems = prev.filter(item => item.id !== cartId);
      syncWithServer(newItems);
      return newItems;
    });
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev => {
      const newItems = prev.map(item => 
        item.id === cartId ? { ...item, quantity } : item
      );
      syncWithServer(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    syncWithServer([]);
  };

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      totalCount,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
