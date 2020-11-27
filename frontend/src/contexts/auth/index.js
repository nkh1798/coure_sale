import React, { createContext, useReducer } from "react";

const initialStates = {
  isAuth:
    localStorage.getItem("isAuth") || sessionStorage.getItem("isAuth") || false,
  accessToken:
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken") ||
    null,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null,
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const reducer = (state, action) => {
    switch (action.type) {
      case "login":
        return {
          isAuth: true,
          accessToken: action.payload.accessToken,
          user: action.payload.user,
        };

      case "logout":
        localStorage.clear();
        sessionStorage.clear();
        return { isAuth: false, accessToken: null, user: {} };

      default: {
        return { ...initialStates };
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, initialStates);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
