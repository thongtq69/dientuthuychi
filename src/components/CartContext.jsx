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
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  // Load from localStorage on init
  useEffect(() => {
    const savedCart = localStorage.getItem('thuychi_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage');
      }
    }
  }, []);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('thuychi_cart', JSON.stringify(cartItems));
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

  // Merge logic when user logs in
  useEffect(() => {
    if (user) {
      const fetchServerCart = async () => {
        try {
          const res = await fetch(`/api/carts?where[customer][equals]=${user.id}`);
          const data = await res.json();
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
            
            // Basic merge: server items take priority for same ID, plus local items not on server
            setCartItems(prev => {
              const merged = [...serverItems];
              prev.forEach(localItem => {
                if (!merged.find(m => m.id === localItem.id)) {
                  merged.push(localItem);
                }
              });
              return merged;
            });
          } else {
            // No server cart, upload local one
            syncWithServer(cartItems);
          }
        } catch (err) {
          console.error('Failed to fetch server cart:', err);
        }
      };
      fetchServerCart();
    }
  }, [user, syncWithServer]);

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
      syncWithServer(newItems);
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
