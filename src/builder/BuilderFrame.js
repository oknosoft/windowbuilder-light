import React from 'react';
import { useTheme } from '@mui/material/styles';
import {Resize, ResizeHorizon} from '@oknosoft/ui/Resize';
import {useTitleContext} from '../aggregate/App';
import {useLoadingContext} from '../aggregate/Metadata';
import {contentWidth} from '../aggregate/styles/muiTheme';
import MainToolbar from './Toolbar/Main';
import ProductStructure from './Structure';
import Controls from './Controls';
import Builder from './Builder';

export default function BuilderFrame({useBuilderContext}) {
  const {description, title, setTitle} = useTitleContext();
  const context = useBuilderContext();
  const {handleIfaceState, ifaceState: {drawerOpen}} = useLoadingContext();
  const theme = useTheme();
  const width = contentWidth(drawerOpen);
  const resizeStop = (inf) => {
    const {editor} = context;
    if (editor) {
      const {offsetWidth, offsetHeight} = editor.view.element.parentNode;
      editor.project.resizeCanvas(offsetWidth, offsetHeight);
    }
  };

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
    <Resize handleWidth="6px" handleColor={theme.palette.grey[300]} onResizeStop={resizeStop}  onResizeWindow={resizeStop}>
      <ResizeHorizon width={`${(width / 6).toFixed()}px`} minWidth="200px">
        <ProductStructure context={context} />
      </ResizeHorizon>
      <ResizeHorizon width={`${(width * 7 / 12).toFixed()}px`} minWidth="600px">
        <Builder context={context} />
      </ResizeHorizon>
      <ResizeHorizon overflow="hidden auto" width={`${(width * 3 / 12).toFixed()}px`} minWidth="280px">
        <Controls context={context} />
      </ResizeHorizon>
    </Resize>
  </div>;
}
