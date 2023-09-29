import React from 'react';
import { useTheme } from '@mui/material/styles';
import {Resize, ResizeHorizon} from '@oknosoft/ui/dist/Resize';
import {useTitleContext} from '../_common/App';
import {useLoadingContext} from '../_common/Metadata';
import MainToolbar from './Toolbar/Main';
import ProductStructure from './Structure';
import Controls from './Controls';
import Builder from './Builder';

export default function BuilderFrame({useBuilderContext}) {
  const {description, title, setTitle} = useTitleContext();
  const context = useBuilderContext();
  const {handleIfaceState, ifaceState: {drawerOpen}} = useLoadingContext();
  const theme = useTheme();

  React.useEffect(() => {
    const title = {
      title: 'Редактор изделия',
      appTitle: <MainToolbar context={context} />
    };
    setTitle(title);
    if(drawerOpen) {
      handleIfaceState({drawerOpen: false});
      return () => handleIfaceState({drawerOpen: true});
    }
  }, []);

  return <div style={{position: 'relative', height: 'calc(100vh - 50px)'}}>
    <Resize handleWidth="6px" handleColor={theme.palette.grey?.[300]} onResizeStop={null}  onResizeWindow={null}>
      <ResizeHorizon width={`${(innerWidth / 6).toFixed()}px`} minWidth="200px">
        <ProductStructure context={context} />
      </ResizeHorizon>
      <ResizeHorizon width={`${(innerWidth * 7 / 12).toFixed()}px`} minWidth="600px">
        <Builder context={context} />
      </ResizeHorizon>
      <ResizeHorizon overflow="hidden auto" width={`${(innerWidth * 3 / 12).toFixed()}px`} minWidth="280px">
        <Controls context={context} />
      </ResizeHorizon>
    </Resize>
  </div>;
}
