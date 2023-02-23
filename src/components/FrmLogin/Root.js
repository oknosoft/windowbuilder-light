import React from 'react';
import { styled } from '@mui/material/styles';

export const LoginRoot = styled('div')(({theme}) => ({
  [theme.breakpoints.up('md')]: {
    marginLeft: '10vw',
    marginTop: '10vh',
    width: 540,
  },
}));
