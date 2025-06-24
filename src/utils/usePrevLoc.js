import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PrevLocContext = createContext(undefined);

export const PrevLocProvider = ({ children }) => {
  const location = useLocation();
  const [path, setPath] = useState(null);

  useEffect(() => {
    return () => {
      const temp = location;
      setPath(temp);
    };
  }, [location]);

  return (
    <PrevLocContext.Provider value={{ path }}>
      {children}
    </PrevLocContext.Provider>
  );
};

export const usePrevLocContext = () => {
  const prevLocContext = useContext(PrevLocContext);
  return prevLocContext;
};
