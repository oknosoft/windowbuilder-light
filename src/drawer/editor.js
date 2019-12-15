/**
 * Рисовалка react
 *
 * @module Editor
 *
 * Created by Evgeniy Malyarov on 23.05.2018.
 */

import paper from 'paper/dist/paper-core';
import drawer from 'windowbuilder/public/dist/drawer';
import tools from './tools';
import filling from './filling';

export default function ($p) {

  // формируем в $p конструктор стандартной рисовалки
  drawer({$p, paper});

  const {EditorInvisible} = $p;
  class Editor extends EditorInvisible {

    constructor(canvas) {
      super();
      this._canvas = canvas;
      new EditorInvisible.Scheme(this._canvas, this, typeof window === 'undefined');
      //this.create_scheme();
      this.project._dp.value_change = this.dp_value_change.bind(this);
      this._recalc_timer = 0;
      this.eve.on('coordinates_calculated', this.coordinates_calculated);
      this._canvas.addEventListener('touchstart', this.canvas_touchstart, false);
    }

    coordinates_calculated = () => {
      const {ox, _dp} = this.project;
      _dp._data._silent = true;
      _dp.len = ox.x;
      _dp.height = ox.y;
      _dp._data._silent = false;
    };

    canvas_touchstart = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      const touch = evt.touches.length && evt.touches[0];
      const {view, tool} = this;
      const point = view.viewToProject([touch.clientX, touch.clientY]).add([-50, -158]);
      const event = {point, modifiers: {}};
      tool.hitTest(event);
      tool.mousedown(event);
    };

    deffered_recalc() {
      const {project} = this;
      clearTimeout(this._recalc_timer);
      project.register_change(true);
      this._recalc_timer = setTimeout(() => {
        project.zoom_fit();
        project.save_coordinates({});
      }, 500);
    }

    dp_value_change(field, type, value) {
      const {project} = this;
      if(project._attr._loading || project._dp._data._silent) {
        return;
      }
      let redraw;
      if(field === 'len') {
        const {bottom} = project.l_dimensions;
        const x = parseFloat(value).round(-1);
        if(x > 300 && x < 3000 && bottom.size != x) {
          bottom._move_points({name: 'right', size: x}, 'x');
          redraw = true;
        }
      }
      else if(field === 'height') {
        const {right} = project.l_dimensions;
        const y = parseFloat(value).round(-1);
        if(y > 300 && y < 3000 && right.size != y) {
          right._move_points({name: 'top', size: y}, 'y');
          redraw = true;
        }
      }
      if(redraw) {
        this.deffered_recalc();
      }
    }

    /**
     * Надевает шаблон на текущее изделие
     * @param base_block {cat.characteristics}
     * @param template {cat.templates}
     */
    apply_template(base_block, template) {
      base_block = template;
    }

    unload() {
      this.project._dp._manager.off('update');
      this._canvas.removeEventListener("touchstart", this.canvas_touchstart);
      super.unload();
      clearTimeout(this._recalc_timer);
    }

  }
  $p.Editor = Editor;

  if(typeof window !== 'undefined') {
    tools(Editor);
    filling(EditorInvisible.Filling);
  }
}
