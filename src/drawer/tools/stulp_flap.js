/**
 * ### Добавдение штульповых створок
 *
 * Created 25.08.2015
 *
 * @module tools
 * @submodule stulp_flap
 */

import StulpFlapWnd from '../../components/Builder/ToolWnds/StulpFlapWnd';

export default function stulp_flap (Editor, {classes: {BaseDataObj}, dp: {builder_pen}, cat: {characteristics}, utils}) {

  const {ToolElement, Filling} = Editor;

  class FakeStulpFlap extends BaseDataObj {

    constructor() {
      //inset, furn1, furn2
      super({}, builder_pen, false, true);
      this._data._is_new = false;

      this._meta = utils._clone(builder_pen.metadata());
      this._meta.fields.inset.synonym = 'Штульп';
      const {furn} = characteristics.metadata('constructions').fields;
      const furn1 = this._meta.fields.furn1 = utils._clone(furn);
      const furn2 = this._meta.fields.furn2 = utils._clone(furn);
      furn1.synonym += ' лев';
      furn2.synonym += ' прав';

    }


    _metadata(fld) {
      return fld ? this._meta.fields[fld] : this._meta;
    }

    get inset() {
      return this._getter('inset');
    }
    set inset(v) {
      this._setter('inset', v);
    }

    get furn1() {
      return this._getter('furn1');
    }
    set furn1(v) {
      this._setter('furn1', v);
    }

    get furn2() {
      return this._getter('furn2');
    }
    set furn2(v) {
      this._setter('furn2', v);
    }

    /**
     * Заполняет умолчания по системе и корректируем отбор в метаданных
     * @param sys
     */
    by_sys(sys) {

    }
  }

  Editor.ToolStulpFlap = class ToolStulpFlap extends ToolElement {

    constructor() {

      super();

      Object.assign(this, {
        options: {name: 'stulp_flap'},
        ToolWnd: StulpFlapWnd,
      });

      this.on({

        activate: this.on_activate,

        deactivate: this.on_deactivate,

        mousedown: this.mousedown,

        mousemove: this.hitTest,

      });

    }

    on_activate() {
      super.on_activate('cursor-text-select');
      this._obj = new FakeStulpFlap();
    }

    on_deactivate() {
      this._obj = null;
    }

    hitTest(event) {

      this.hitItem = null;

      // Hit test items.
      if(event.point) {
        this.hitItem = this.project.hitTest(event.point, {fill: true, class: paper.Path});
      }

      if(this.hitItem && this.hitItem.item.parent instanceof Filling) {
        this._scope.canvas_cursor('cursor-stulp-flap');
        this.hitItem = this.hitItem.item.parent;
      }
      else {
        this._scope.canvas_cursor('cursor-text-select');
        this.hitItem = null;
      }

      return true;
    }

    mousedown(event) {

    }


  };

}

