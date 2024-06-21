import React from 'react';
import {Toolbar, HtmlTooltip} from '../../../aggregate/App/styled';
import IconButton from '@mui/material/IconButton';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import FolderOffOutlinedIcon from '@mui/icons-material/FolderOffOutlined';
import {useBuilderContext} from '../../Context';

// style={{fontFamily: 'GOST type B'}}

export default function RootToolbar() {
  const {editor, setContext} = useBuilderContext();
  const addPlane = () => {
    const project = new editor.Scheme(editor.view.element, $p);
    editor.refreshTools();
    setContext({stamp: project.props.stamp, tool: editor.tool});
  };
  const removePlane = () => {
    const {project} = editor;
    for(const curr of editor.projects) {
      if(curr !== project) {
        curr.activate();
        editor.refreshTools();
        setContext({stamp: curr.props.stamp, tool: editor.tool});
        break;
      }
    }
    project.remove();
  };
  return <Toolbar disableGutters>
    <HtmlTooltip title="Добавить плоскость">
      <IconButton onClick={addPlane}><CreateNewFolderOutlinedIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Удалить плоскость">
      <IconButton onClick={removePlane} disabled={!editor || editor.projects.length < 2}><FolderOffOutlinedIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>
}
