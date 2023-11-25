/**
 * Рисовалка react
 *
 * @module Editor
 *
 * Created by Evgeniy Malyarov on 23.05.2018.
 */

import paper from 'paper/dist/paper-core';
import drawer from 'wb-core/dist/drawer';
import StableZoom from './StableZoom';

export default function ($p) {

  // формируем в $p конструктор стандартной рисовалки
  $p.paper = paper;
  drawer({$p, paper});

  const {EditorInvisible} = $p;
  class Editor extends EditorInvisible {

    constructor(canvas) {
      super();
      this._canvas = canvas;
      const scheme = new EditorInvisible.Scheme(this._canvas, this, typeof window === 'undefined');

      this._stable_zoom = new StableZoom(this);
      // this._deformer = new Deformer(this);
      // this._mover = new Mover(this);
      // this._undo = new UndoRedo(this);
      //
      // //scheme._use_skeleton = true;
      // scheme.magnetism = new Magnetism(scheme);
      this._recalc_timer = 0;

      this.eve.on('coordinates_calculated', this.coordinates_calculated);
      this._canvas.addEventListener('touchstart', this.canvas_touchstart, false);
      this._canvas.addEventListener('mousewheel', this._stable_zoom.mousewheel, false);
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
      let {element} = view;
      const offsets = {x: element.offsetLeft, y: element.offsetTop};
      while (element.offsetParent) {
        element = element.offsetParent;
        offsets.x += element.offsetLeft;
        offsets.y += element.offsetTop;
      }
      const point = view.viewToProject([touch.pageX - offsets.x, touch.pageY - offsets.y]);
      const event = {point, modifiers: {}};
      tool.hitTest(event);
      tool.mousedown(event);
    };

    deffered_recalc() {
      const {project} = this;
      clearTimeout(this._recalc_timer);
      this._recalc_timer = setTimeout(() => {
        project.save_coordinates({});
      }, 600);
    }

    deffered_zoom_fit() {
      const {project} = this;
      project.register_change(true);
      clearTimeout(this._fit_timer);
      this._fit_timer = setTimeout(() => project.zoom_fit(), 400);
    }





    /**
     * Create pixel perfect dotted rectable for drag selections
     * @param p1
     * @param p2
     * @return {paper.CompoundPath}
     */
    drag_rect(p1, p2) {
      const {view} = this;
      const half = new paper.Point(0.5 / view.zoom, 0.5 / view.zoom);
      const start = p1.add(half);
      const end = p2.add(half);
      const rect = new paper.CompoundPath();

      rect.moveTo(start);
      rect.lineTo(new paper.Point(start.x, end.y));
      rect.lineTo(end);
      rect.moveTo(start);
      rect.lineTo(new paper.Point(end.x, start.y));
      rect.lineTo(end);
      rect.strokeColor = 'black';
      rect.strokeWidth = 1.0 / view.zoom;
      rect.dashOffset = 0.5 / view.zoom;
      rect.dashArray = [1.0 / view.zoom, 1.0 / view.zoom];
      rect.removeOn({
        drag: true,
        up: true
      });
      rect.guide = true;
      return rect;
    }




    unload() {
      this.project._dp._manager.off('update');
      this._canvas.removeEventListener("touchstart", this.canvas_touchstart);
      this._canvas.removeEventListener('mousewheel', this._stable_zoom.mousewheel);
      super.unload();
      clearTimeout(this._recalc_timer);
    }

  }

  $p.Editor = Editor;

  // tools(Editor, $p);
  // align(Editor, $p);
  // debugPrices(Editor, $p);
}
