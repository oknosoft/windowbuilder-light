import React from 'react';
import Loading from '../../aggregate/App/Loading';
import {useTitleContext, useBackdropContext} from '../../aggregate/App';
import {useLoadingContext} from '../../aggregate/Metadata';
import {contentWidth} from '../../styles/muiTheme';
import Head from './Head';
import {title} from './data';

export default function Paperless() {
  const {setTitle} = useTitleContext();
  const {setBackdrop} = useBackdropContext();
  const {handleIfaceState, ifaceState: {menu_open, innerWidth, paperless}} = useLoadingContext();
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
    setTitle({title, appTitle: <Head handleIfaceState={handleIfaceState} paperless={paperless} />});
  }, [paperless]);

  return 'Paperless';
}
