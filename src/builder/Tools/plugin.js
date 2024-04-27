
import {ToolPen} from '@oknosoft/wb/core/src/geometry/tools/ToolPen';
import PenWnd from './PenWnd';

export default function pluginTools($p) {
  ToolPen.ToolWnd = PenWnd;
}
