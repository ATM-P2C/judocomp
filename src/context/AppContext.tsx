import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AppContextType {
  appName: string;
  appLogo: string | null;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const defaultContext: AppContextType = {
  appName: 'JudoComp',
  appLogo: null,
  primaryColor: 'indigo',
  setPrimaryColor: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState<string>(defaultContext.primaryColor);

  // Les valeurs de appName et appLogo sont maintenant fixes et ne peuvent plus être modifiées
  const appName = defaultContext.appName;
  const appLogo = defaultContext.appLogo;

  return (
    <AppContext.Provider
      value={{
        appName,
        appLogo,
        primaryColor,
        setPrimaryColor,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};