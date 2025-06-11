// context/SizeGuideContext.tsx
"use client";
import { createContext, useContext, useState } from 'react';

const SizeGuideContext = createContext({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function SizeGuideProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SizeGuideContext.Provider
      value={{
        isOpen,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
      }}
    >
      {children}
    </SizeGuideContext.Provider>
  );
}

export const useSizeGuide = () => useContext(SizeGuideContext);