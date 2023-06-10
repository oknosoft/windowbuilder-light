import React from 'react';

export const SelectedContext = React.createContext(0);
export const useSelectedContext = () => React.useContext(SelectedContext);
