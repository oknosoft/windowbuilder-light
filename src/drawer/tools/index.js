/**
 *
 *
 * @module index
 *
 * Created by Evgeniy Malyarov on 15.12.2019.
 */

import tool_element from './tool_element';
import select_node from './select_node';
import pan from './pan';
import pen from './pen';
import arc from './arc';
import cut from './cut';
import stulp_flap from './stulp_flap';

export default function tools (Editor, $p) {
  tool_element(Editor);
  select_node(Editor);
  pan(Editor);
  pen(Editor);
  arc(Editor);
  cut(Editor);
  stulp_flap(Editor, $p);

  Editor.prototype.create_tools = function create_tools() {
    new Editor.ToolSelectNode();
    new Editor.ToolPan();
    new Editor.ToolPen();
    new Editor.ToolArc();
    new Editor.ToolCut();
    new Editor.ToolStulpFlap();
    this.tools[0].activate();
  };
}

