import React from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CursorIcon from '../../aggregate/styles/icons/Cursor';
import PenIcon from '../../aggregate/styles/icons/Pen';
import ZoomFitIcon from '../../aggregate/styles/icons/ZoomFit';
import VideoSettingsIcon from '@mui/icons-material/VideoSettings';
import {Toolbar, HtmlTooltip} from '../../aggregate/App/styled';
import {useBuilderContext} from '../Context';

export default function SelectTool() {
  const [tool, setTool] = React.useState(0);
  const {editor} = useBuilderContext();

  const handleChange = (event, newValue) => {
    setTool(newValue);
  };
  return <Toolbar>
    <HtmlTooltip title="Вписать в окно (масштаб)">
      <IconButton onClick={() => editor.project.zoomFit()}><ZoomFitIcon/></IconButton>
    </HtmlTooltip>
    <Tabs value={tool} onChange={handleChange} >
      <Tab value={0} icon={<HtmlTooltip title="Выделить и сдвинуть"><CursorIcon /></HtmlTooltip>} aria-label="select" />
      <Tab value={1} icon={<HtmlTooltip title="Нарисовать профиль"><PenIcon /></HtmlTooltip>} aria-label="draw" />
    </Tabs>
    <Typography sx={{flex: 1}}></Typography>
    <HtmlTooltip title="Настройки отображения">
      <IconButton onClick={null}><VideoSettingsIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>
}
