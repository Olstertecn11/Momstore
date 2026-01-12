export const CART_ACTIONS = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  SET_QTY: "SET_QTY",
  CLEAR: "CLEAR",
};

export function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD: {
      const item = action.payload; // {id, name, price, image, ...}
      const existing = state.items.find((x) => x.id === item.id);

      let items;
      if (existing) {
        items = state.items.map((x) =>
          x.id === item.id ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        items = [...state.items, { ...item, qty: 1 }];
      }

      return { ...state, items };
    }

    case CART_ACTIONS.REMOVE: {
      const id = action.payload;
      const items = state.items.filter((x) => x.id !== id);
      return { ...state, items };
    }

    case CART_ACTIONS.SET_QTY: {
      const { id, qty } = action.payload;
      const safeQty = Math.max(1, Number(qty) || 1);

      const items = state.items.map((x) =>
        x.id === id ? { ...x, qty: safeQty } : x
      );

      return { ...state, items };
    }

    case CART_ACTIONS.CLEAR:
      return { ...state, items: [] };

    default:
      return state;
  }
}
