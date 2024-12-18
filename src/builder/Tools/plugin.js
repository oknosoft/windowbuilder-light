
import {ToolSelect} from '@oknosoft/wb/core/src/geometry/tools/ToolSelect';
import {ToolPen} from '@oknosoft/wb/core/src/geometry/tools/ToolPen';
import {ToolPan} from '@oknosoft/wb/core/src/geometry/tools/ToolPan';
import {ToolGrid} from '@oknosoft/wb/core/src/geometry/tools/ToolGrid';
import PenWnd from './PenWnd';
import GridWnd from './GridWnd';
import CursorIcon from '../../aggregate/styles/icons/Cursor';
import PenIcon from '../../aggregate/styles/icons/Pen';
import GridIcon from '../../aggregate/styles/icons/Grid';
import WavingHandOutlinedIcon from '@mui/icons-material/WavingHandOutlined';

export default function pluginTools($p) {
  ToolPen.ToolWnd = PenWnd;
  ToolGrid.ToolWnd = GridWnd;

  ToolSelect.Icon = CursorIcon;
  ToolPen.Icon = PenIcon;
  ToolGrid.Icon = GridIcon;
  ToolPan.Icon = WavingHandOutlinedIcon;
}
