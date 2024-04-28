import React from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {styled} from '@mui/material/styles';
import CursorIcon from '../../aggregate/styles/icons/Cursor';
import PenIcon from '../../aggregate/styles/icons/Pen';
import ZoomFitIcon from '../../aggregate/styles/icons/ZoomFit';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import {HtmlTooltip} from '../../aggregate/App/styled';
import {useBuilderContext} from '../Context';

const Show3dIcon = styled(VerticalAlignBottomIcon, {
  shouldForwardProp: (prop) => prop !== 'show3d',
})(({ theme, show3d }) => ({
  ...(!show3d && {transform: 'rotate(180deg)'}),
}));

const Vertical = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  width: 50,
  backgroundColor: theme.palette.grey['50'],
  paddingTop: theme.spacing(),
  height: '100%',
}));

export default function SelectTool({show3d, toggle3D}) {
  const [tool, setTool] = React.useState(0);
  const {editor, setContext} = useBuilderContext();

  const handleChange = (event, newValue) => {
    setTool(newValue);
    const tool = editor.tools[newValue];
    tool?.activate?.();
    setContext({tool});
  };

  return <Vertical>
    <HtmlTooltip title="Вписать в окно (масштаб)" placement="right">
      <IconButton sx={{ml: 1}} onClick={() => editor.project.zoomFit()}><ZoomFitIcon/></IconButton>
    </HtmlTooltip>
    <Tabs value={tool} orientation="vertical" onChange={handleChange} >
      <Tab value={0} accent icon={<HtmlTooltip title="Выделить и сдвинуть" placement="right"><CursorIcon /></HtmlTooltip>} aria-label="select" />
      <Tab value={1} accent icon={<HtmlTooltip title="Нарисовать элемент" placement="right"><PenIcon /></HtmlTooltip>} aria-label="draw" />
    </Tabs>
    <Box sx={{flex: 1}} />
    <HtmlTooltip title={show3d ? 'Скрыть вид 3D' : 'Показать вид 3D'} placement="right">
      <IconButton sx={{ml: 1}} onClick={toggle3D}><Show3dIcon show3d={show3d}/></IconButton>
    </HtmlTooltip>
  </Vertical>
}
