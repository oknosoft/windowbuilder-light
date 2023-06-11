
const {cat: {inserts}, enm: {inserts_types}, dp: {buyers_order}}  = $p;

// доступные типы вставок
export const itypes = [inserts_types.glass, inserts_types.composite];

// доступные вставки
const ioptions = [];
inserts.find_rows({insert_type: {in: itypes}, available: true}, (o) => {
  ioptions.push(o);
});
export {ioptions};

export class RowProxy {
  #row;
  #editor = null;

  constructor(row) {
    this.#row = row;
  }

  get row() {
    return this.#row.row;
  }

  get characteristic() {
    return this.#row.characteristic;
  }

  get editor() {
    return this.#editor;
  }

  async createEditor() {
    const {characteristic} = this;
    this.#editor = new $p.EditorInvisible();
    const project = this.#editor.create_scheme();
    await project.load(characteristic, true, characteristic.calc_order);
    project.redraw();
  }

  unloadEditor() {
    if(this.#editor) {
      this.#editor.unload();
      this.#editor = null;
    }
  }

  get inset() {
    return this.glassRow.inset;
  }
  set inset(v) {
    const {glassRow, editor} = this;
    if(editor) {
      const glass = editor.elm(glassRow.elm);
      glass.set_inset(v, false, true);
    }
  }

  recalcFin() {
    const {project, eve} = this.editor;
    return $p.utils.sleep(20)
      .then(() => {
        if(eve?._async?.move_points?.timer) {
          return this.recalcFin();
        }
        project.redraw();
        return project.save_coordinates({});
      });
  }

  get len() {
    const {editor} = this;
    if(editor) {
      return editor.project.bounds.width.round();
    }
    const {x1, x2} = this.glassRow;
    return Math.abs(x2 - x1);
  }
  set len(v) {
    const {editor} = this;
    if(editor) {
      const {project, eve} = editor;
      const szLine = project?.l_dimensions?.bottom;
      szLine.sizes_wnd({
        wnd: szLine,
        size: parseFloat(v),
        name: 'auto',
      });
      this.recalcFin();
    }
  }

  get height() {
    const {editor} = this;
    if(editor) {
      return editor.project.bounds.height.round();
    }
    const {y1, y2} = this.glassRow;
    return Math.abs(y2 - y1);
  }
  set height(v) {
    const {editor} = this;
    if(editor) {
      const {project, eve} = editor;
      const szLine = project?.l_dimensions?.right;
      szLine.sizes_wnd({
        wnd: szLine,
        size: parseFloat(v),
        name: 'auto',
      });
      this.recalcFin();
    }
  }

  get glassRow() {
    const {coordinates} = this.#row.characteristic;
    for(const grow of coordinates) {
      if(itypes.includes(grow.inset.insert_type)) {
        return grow;
      }
    }
    const grow = coordinates.add({
      inset: inserts.find({insert_type: itypes[0], available: true, priority: 10}),
    });
    return grow;
  }

  _metadata(fld) {
    return buyers_order.metadata(fld);
  }

  get calc_order_row() {
    return this.#row;
  }

  get quantity() {
    return this.#row.quantity;
  }
  set quantity(v) {
    this.#row.quantity = v;
  }

  get discount_percent_internal() {
    return this.#row.discount_percent_internal;
  }
  set discount_percent_internal(v) {
    this.#row.discount_percent_internal = v;
  }

  get price_internal() {
    return this.#row.price_internal;
  }
  set price_internal(v) {
    this.#row.price_internal = v;
  }

  get amount_internal() {
    return this.#row.amount_internal;
  }
  set amount_internal(v) {
    this.#row.amount_internal = v;
  }
}
