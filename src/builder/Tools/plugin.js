
import {ToolSelect} from '@oknosoft/wb/core/src/geometry/tools/ToolSelect';
import {ToolPen} from '@oknosoft/wb/core/src/geometry/tools/ToolPen';
import {ToolPan} from '@oknosoft/wb/core/src/geometry/tools/ToolPan';
import PenWnd from './PenWnd';
import CursorIcon from '../../aggregate/styles/icons/Cursor';
import PenIcon from '../../aggregate/styles/icons/Pen';
import WavingHandOutlinedIcon from '@mui/icons-material/WavingHandOutlined';

export default function pluginTools($p) {
  ToolPen.ToolWnd = PenWnd;

  ToolSelect.Icon = CursorIcon;
  ToolPen.Icon = PenIcon;
  ToolPan.Icon = WavingHandOutlinedIcon;
}
