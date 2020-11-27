import { createContext, useReducer } from "react";

const initialStates = {
  cart: [],
};

const CardContext = createContext();

export const CartProvider = ({ children }) => {
  const reducer = (state, { type, payload }) => {
    switch (type) {
      case "addItem":
        const oldCart = [...state.cart];
        const isExistInCart = oldCart.some(
          (cartItem) => cartItem.id === payload._id
        );

        if (!isExistInCart) {
          return {
            cart: [
              ...oldCart,
              {
                id: payload._id,
                cover: payload.cover,
                name: payload.name,
                price: payload.price,
                quantity: 1,
              },
            ],
          };
        }

        const newCart = oldCart.map((cartItem) => {
          if (cartItem.id === payload._id) {
            return {
              ...cartItem,
              quantity: cartItem.quantity++,
            };
          }

          return cartItem;
        });

        return {
          cart: newCart,
        };

      case "removeItem":
        return {
          cart: [...state.cart].filter((cartItem) => cartItem.id !== payload),
        };

      case "clearCart":
        return {
          cart: [],
        };

      default: {
        return { ...initialStates };
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, initialStates);

  return (
    <CardContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CardContext.Provider>
  );
};

export default CardContext;
