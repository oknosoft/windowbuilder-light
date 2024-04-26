import React from 'react';
import { useTheme } from '@mui/material/styles';
import {Resize, ResizeHorizon} from 'metadata-ui/Resize';
import Loading from '../App/Loading';
import {useTitleContext} from '../App';
import {useLoadingContext} from '../Metadata';
import {contentWidth} from '../../styles/muiTheme';
import {RmdHead} from './Head';
import {title} from './data';
import Remainders from './Remainders';
import Task from './Task';
import {checkTgt} from './data';

export default function RMD (props) {

  const {setTitle} = useTitleContext();
  const {handleIfaceState, ifaceState: {menu_open, rmd}} = useLoadingContext();
  const theme = useTheme();
  const width = contentWidth(menu_open);

  // при создании компонента, подготовим общие данные
  React.useEffect(() => {
    checkTgt(handleIfaceState, rmd || {});
    if(menu_open) {
      handleIfaceState({menu_open: false});
      return () => handleIfaceState({menu_open: true});
    }
  }, []);
  React.useEffect(() => {
    setTitle({title, appTitle: <RmdHead handleIfaceState={handleIfaceState} rmd={rmd} />});
  }, [rmd]);

  const handleColor = theme.palette.grey[300];

  return rmd?.tgt ? <div style={{position: 'relative', height: 'calc(100vh - 50px)'}}>
    <Resize handleWidth="6px" handleColor={handleColor}>
      <ResizeHorizon width={`${(width * 3/4).toFixed()}px`} minWidth="600px">
        <Remainders />
      </ResizeHorizon>
      <ResizeHorizon width={`${(width * 1/4).toFixed()}px`} minWidth="200px">
        <Task />
      </ResizeHorizon>
    </Resize>
  </div> : <Loading />;
}
