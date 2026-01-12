import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { cartReducer, CART_ACTIONS } from "./cart.reducer";

const CartContext = createContext(null);

const STORAGE_KEY = "app_cart_v1";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    if (!parsed?.items) return { items: [] };
    return parsed;
  } catch {
    return { items: [] };
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totals = useMemo(() => {
    const itemsCount = state.items.reduce((acc, x) => acc + x.qty, 0);
    const subtotal = state.items.reduce((acc, x) => acc + x.qty * Number(x.price || 0), 0);
    return { itemsCount, subtotal };
  }, [state.items]);

  const api = useMemo(
    () => ({
      items: state.items,
      totals,
      addItem: (item) => dispatch({ type: CART_ACTIONS.ADD, payload: item }),
      removeItem: (id) => dispatch({ type: CART_ACTIONS.REMOVE, payload: id }),
      setQty: (id, qty) => dispatch({ type: CART_ACTIONS.SET_QTY, payload: { id, qty } }),
      clear: () => dispatch({ type: CART_ACTIONS.CLEAR }),
    }),
    [state.items, totals]
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider />");
  return ctx;
}
