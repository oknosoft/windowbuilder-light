import React from 'react';
import MuiListSubheader from '@mui/material/ListSubheader';
import Grid from '@mui/material/Unstable_Grid2';
import {styled} from '@mui/material/styles';

export const ListSubheader = styled(MuiListSubheader)(({ theme }) => ({
  paddingLeft: 0,
  paddingRight: 0,
}));

export const Root = styled('div')(({ theme }) => ({
  height: 'calc(100vh - 51px)',
  overflow: 'auto',
}));

export const GlassesDetail = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'selected',
})(({ theme, selected }) => ({
  paddingTop: theme.spacing(),
  ...(!selected && {pointerEvents: `none`}),
}));
