import React from 'react';
import { useTheme } from '@mui/material/styles';
import {Resize, ResizeHorizon} from 'metadata-ui/Resize';
import {useTitleContext} from '../App';
import {useLoadingContext} from '../Metadata';
import {contentWidth} from '../../styles/muiTheme';
import {RmdHead, title} from './Head';


export default function RMD (props) {

  const {setTitle} = useTitleContext();
  const {handleIfaceState, ifaceState: {menu_open}} = useLoadingContext();
  const theme = useTheme();
  const width = contentWidth(menu_open);

  React.useEffect(() => {
    setTitle({title, appTitle: <RmdHead />});
    if(menu_open) {
      handleIfaceState({menu_open: false});
      return () => handleIfaceState({menu_open: true});
    }
  }, []);

  const handleColor = theme.palette.grey[300];

  return <div style={{position: 'relative', height: 'calc(100vh - 50px)'}}>
    <Resize handleWidth="6px" handleColor={handleColor}>
      <ResizeHorizon width={`${(width * 3/4).toFixed()}px`} minWidth="600px">
        Left
      </ResizeHorizon>
      <ResizeHorizon width={`${(width * 1/4).toFixed()}px`} minWidth="200px">
        Right
      </ResizeHorizon>
    </Resize>
  </div>;
}
