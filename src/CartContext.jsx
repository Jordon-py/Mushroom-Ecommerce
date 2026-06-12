import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AnalyticsContext from './AnalyticsContext.jsx';

const CART_STORAGE_KEY = 'cart:v1';

const CartContext = createContext(null);

function parsePrice(price) {
  if (typeof price === 'number') {
    return Number.isFinite(price) ? price : 0;
  }

  const parsed = Number.parseFloat(String(price ?? '').replace(/[^0-9.-]+/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getProductId(product) {
  return product?.id ?? product?.name;
}

function normalizeProduct(product) {
  const id = getProductId(product);

  if (!id) {
    throw new Error('Cannot add a product to the cart without an id or name.');
  }

  return {
    id: String(id),
    name: product.name ?? 'Untitled product',
    image: product.image ?? '',
    price: parsePrice(product.price),
  };
}

function normalizeQuantity(quantity) {
  const nextQuantity = Number(quantity);
  return Number.isFinite(nextQuantity) ? Math.max(0, Math.floor(nextQuantity)) : 0;
}

function readStoredCart() {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart);
    return Array.isArray(parsedCart)
      ? parsedCart
          .map((item) => ({
            ...normalizeProduct(item),
            quantity: Math.max(1, normalizeQuantity(item.quantity)),
          }))
          .filter((item) => item.quantity > 0)
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { recordEvent } = useContext(AnalyticsContext);
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback(
    (product) => {
      const productToAdd = normalizeProduct(product);

      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.id === productToAdd.id);

        if (existingItem) {
          return currentItems.map((item) =>
            item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }

        return [...currentItems, { ...productToAdd, quantity: 1 }];
      });

      recordEvent('cart_add', productToAdd.name, {
        productId: productToAdd.id,
        price: productToAdd.price,
      });
    },
    [recordEvent],
  );

  const removeItem = useCallback(
    (productId) => {
      const safeProductId = String(productId);
      const removedItem = items.find((item) => item.id === safeProductId);

      setItems((currentItems) => currentItems.filter((item) => item.id !== safeProductId));

      recordEvent('cart_remove', removedItem?.name ?? safeProductId, {
        productId: safeProductId,
      });
    },
    [items, recordEvent],
  );

  const updateQuantity = useCallback(
    (productId, quantity) => {
      const safeProductId = String(productId);
      const safeQuantity = normalizeQuantity(quantity);
      const changedItem = items.find((item) => item.id === safeProductId);

      setItems((currentItems) => {
        if (safeQuantity <= 0) {
          return currentItems.filter((item) => item.id !== safeProductId);
        }

        return currentItems.map((item) => (item.id === safeProductId ? { ...item, quantity: safeQuantity } : item));
      });

      recordEvent('quantity_change', changedItem?.name ?? safeProductId, {
        productId: safeProductId,
        quantity: safeQuantity,
      });
    },
    [items, recordEvent],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totals = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return { itemCount, subtotal };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      itemCount: totals.itemCount,
      subtotal: totals.subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [addItem, clearCart, items, removeItem, totals.itemCount, totals.subtotal, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider.');
  }

  return context;
}

export default CartContext;
