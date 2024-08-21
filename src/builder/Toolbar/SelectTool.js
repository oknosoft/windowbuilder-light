import React from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import {styled} from '@mui/material/styles';
import CursorIcon from '../../aggregate/styles/icons/Cursor';
import PenIcon from '../../aggregate/styles/icons/Pen';
import ZoomFitIcon from '../../aggregate/styles/icons/ZoomFit';
import WavingHandOutlinedIcon from '@mui/icons-material/WavingHandOutlined';
import {HtmlTooltip} from '../../aggregate/App/styled';
import {useBuilderContext} from '../Context';
import SelectMode from './SelectMode';

const Vertical = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  width: 50,
  backgroundColor: theme.palette.grey['50'],
  paddingTop: theme.spacing(),
  height: '100%',
}));

export default function SelectTool({view, setView, show3d, toggle3D}) {
  const {editor, tool, setContext} = useBuilderContext();

  const handleChange = (event, newValue) => {
    const tool = editor.tools[newValue];
    tool?.activate?.();
    setContext({tool});
  };

  return editor ? <Vertical>
    <HtmlTooltip title="Вписать в окно (масштаб)" placement="right">
      <IconButton sx={{ml: 1}} onClick={() => editor.project.zoomFit()}><ZoomFitIcon/></IconButton>
    </HtmlTooltip>
    <Tabs value={tool ? editor.tools.indexOf(tool) : 0} orientation="vertical" onChange={handleChange} >
      <Tab value={0} accent="true" icon={<HtmlTooltip title="Выделить и сдвинуть" placement="right"><CursorIcon /></HtmlTooltip>} aria-label="select" />
      <Tab value={1} accent="true" icon={<HtmlTooltip title="Панорама и сдвиг" placement="right"><WavingHandOutlinedIcon /></HtmlTooltip>} aria-label="draw" />
      <Tab value={2} accent="true" icon={<HtmlTooltip title="Нарисовать элемент" placement="right"><PenIcon /></HtmlTooltip>} aria-label="draw" />
    </Tabs>
    <Divider flexItem/>
    <SelectMode view={view} show3d={show3d} toggle3D={toggle3D} editor={editor} />
  </Vertical> : null;
}
