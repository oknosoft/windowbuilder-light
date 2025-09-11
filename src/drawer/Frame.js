import React from 'react';
import { useTheme } from '@mui/material/styles';
import {Resize, ResizeHorizon} from 'metadata-ui/Resize';
import {useTitleContext} from '../aggregate/App';
import {useLoadingContext} from '../aggregate/Metadata';
import {contentWidth} from '../styles/muiTheme';
import MainToolbar from './Toolbar';
import Builder from './Builder';

export default function BuilderFrame({useBuilderContext}) {
  const {description, title, setTitle} = useTitleContext();
  const context = useBuilderContext();
  const {handleIfaceState, ifaceState: {menu_open, innerWidth}} = useLoadingContext();
  const theme = useTheme();
  const width = contentWidth(menu_open, innerWidth);
  const resizeStop = (inf) => {
    const {editor} = context;
    if (editor) {
      const {offsetWidth, offsetHeight} = editor.view.element.parentNode;
      editor.project.resize_canvas(offsetWidth, offsetHeight);
    }
  };

  React.useEffect(() => {
    if(menu_open) {
      handleIfaceState({menu_open: false});
      return () => handleIfaceState({menu_open: true});
    }
  }, []);

  React.useEffect(() => {
    const title = {
      title: 'Редактор изделия',
      appTitle: <MainToolbar context={context} />
    };
    setTitle(title);
  }, [context.editor]);

  const handleColor = theme.palette.grey[300];

  return <div style={{position: 'relative', height: 'calc(100vh - 50px)'}}>
    <Resize handleWidth="6px" handleColor={handleColor} onResizeStop={resizeStop} onResizeWindow={resizeStop}>
      <ResizeHorizon width={`${(width / 6).toFixed()}px`} minWidth="200px">
        ProductStructure
      </ResizeHorizon>
      <ResizeHorizon width={`${(width * 7 / 12).toFixed()}px`} minWidth="600px">
        <Builder context={context} width={width} />
      </ResizeHorizon>
      <ResizeHorizon overflow="hidden auto" width={`${(width * 3 / 12).toFixed()}px`} minWidth="280px">
        Controls
      </ResizeHorizon>
    </Resize>
  </div>;
}
