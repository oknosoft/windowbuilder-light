import React from 'react';
import MUIGrid from '@mui/material/Grid';
import {useTitleContext, useBackdropContext} from '../../aggregate/App';
import {useLoadingContext} from '../../aggregate/Metadata';
import {contentWidth} from '../../styles/muiTheme';
import Head from './Head';
import Info from './Info';
import Builder from './Builder';
import {title, initScheme} from './data';
import {styled} from '@mui/material/styles';

export const Grid = styled(MUIGrid)(({theme}) => ({
  height: 'calc(100vh - 62px)',
}));

export default function Paperless() {
  const {setTitle} = useTitleContext();
  const {setBackdrop} = useBackdropContext();
  const {handleIfaceState, ifaceState: {menu_open, innerWidth, paperless}} = useLoadingContext();
  const tab = paperless?.scheme?.ref || initScheme;
  const width = contentWidth(menu_open, innerWidth);

  // при создании компонента, подготовим общие данные
  React.useEffect(() => {
    //checkTgt(handleIfaceState, paperless || {}, setBackdrop);
    if(menu_open) {
      handleIfaceState({menu_open: false});
      return () => handleIfaceState({menu_open: true});
    }
  }, []);
  React.useEffect(() => {
    setTitle({title, appTitle: <Head handleIfaceState={handleIfaceState} setBackdrop={setBackdrop} tab={tab} />});
  }, [tab]);

  return paperless ? <Grid container spacing={1}>
    <Grid size={6}>
      <Builder paperless={paperless} />
    </Grid>
    <Grid size={6}>
      <Info paperless={paperless} />
    </Grid>
  </Grid> : null;
}
