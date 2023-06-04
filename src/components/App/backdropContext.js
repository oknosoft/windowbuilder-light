import {createContext, useContext} from 'react';

export const initialBackdrop = {
  open: false,
  setOpen() {
    return Promise.resolve();
  },
};

export const BackdropContext = createContext(initialBackdrop);
export const useBackdropContext = () => useContext(BackdropContext);
