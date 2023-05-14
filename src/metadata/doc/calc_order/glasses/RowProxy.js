
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

  constructor(row) {
    this.#row = row;
  }

  get row() {
    return this.#row.row;
  }

  get characteristic() {
    return this.#row.characteristic;
  }

  get inset() {
    return this.glassRow.inset;
  }
  set inset(v) {
    this.glassRow.inset = v;
  }

  get len() {
    const {x1, x2} = this.glassRow;
    return Math.abs(x2 - x1);
  }
  set len(v) {
    const grow = this.glassRow;
    grow.x2 = parseFloat(v) + grow.x1;
  }

  get height() {
    const {y1, y2} = this.glassRow;
    return Math.abs(y2 - y1);
  }
  set height(v) {
    const grow = this.glassRow;
    grow.y2 = parseFloat(v) + grow.y1;
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
}
