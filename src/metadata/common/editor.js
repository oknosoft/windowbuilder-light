/**
 * Рисовалка react
 *
 * @module Editor
 *
 * Created by Evgeniy Malyarov on 23.05.2018.
 */

import paper from 'paper/dist/paper-core';
import drawer from 'windowbuilder/public/dist/drawer';

export default function ($p) {

  drawer({$p, paper});

  $p.Editor = class Editor extends $p.EditorInvisible {

    constructor(canvas) {
      super();
      this._canvas = canvas;
      this.create_scheme();
    }

    canvas_cursor() {

    }
  };
}
