import { createContext, useContext, useState, useCallback } from "react";

const KeyboardContext = createContext();

export function KeyboardProvider({ children }) {
  const [activeField, setActiveFieldState] = useState(null); // { value, onChange, label }

  const setActiveField = useCallback((field) => setActiveFieldState(field), []);
  const clearActiveField = useCallback(() => setActiveFieldState(null), []);

  return (
    <KeyboardContext.Provider value={{ activeField, setActiveField, clearActiveField }}>
      {children}
    </KeyboardContext.Provider>
  );
}

export function useKeyboard() {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error("useKeyboard KeyboardProvider ichida ishlatilishi kerak");
  }
  return context;
}
