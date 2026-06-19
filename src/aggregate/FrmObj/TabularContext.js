import React from 'react';

const defaultContext = {
  selectedRows: new Set(),
};


const TabularContext = React.createContext(defaultContext);
export const useTabularContext = () => React.useContext(TabularContext);

export function TabularContextProvider({children}) {
  const [context, rawSetContext] = React.useState(defaultContext);
  const setContext = React.useMemo(() => (newState) => rawSetContext(prevState => ({...prevState, ...newState})), []);

  return <TabularContext.Provider value={{ ...context, setContext}}>{children}</TabularContext.Provider>;
}
