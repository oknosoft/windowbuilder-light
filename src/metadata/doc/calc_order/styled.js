import React from 'react';
import MuiListSubheader from '@mui/material/ListSubheader';
import MuiToolbar from '@mui/material/Toolbar';
import {styled} from '@mui/material/styles';

export const ListSubheader = styled(MuiListSubheader)(({ theme }) => ({
  paddingLeft: 0,
  paddingRight: 0,
}));

export const Root = styled('div')(({ theme }) => ({
  height: 'calc(100vh - 51px)',
  overflow: 'auto',
}));

export const GlassesDetail = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(),
  lineHeight: 'initial',
}));
