import {createContext, useContext} from 'react';

export const initialBackdrop = {
  backdropOpen: false,
  setBackdrop() {
    return Promise.resolve();
  },

  snack: '',
  setSnack() {
    return Promise.resolve();
  },
};

export const initialSnack = {

};

export const BackdropContext = createContext(initialBackdrop);
export const useBackdropContext = () => useContext(BackdropContext);

