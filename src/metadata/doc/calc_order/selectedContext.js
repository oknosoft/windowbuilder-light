import React from 'react';

export const SelectedContext = React.createContext({skey: 0, rows: []});
export const useSelectedContext = () => React.useContext(SelectedContext);
