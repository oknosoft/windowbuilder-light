
export default function ({cat, doc, utils, job_prm, CatCharacteristics}) {
  cat.characteristics.on({
    update(obj) {
      if(utils.is_tabular(obj)) {
        const {calc_order_row} = obj._owner._owner;
        if(calc_order_row) {
          const calc_order = calc_order_row._owner._owner;
          calc_order._modified = true;
          doc.calc_order.emit('update', calc_order, {});
        }
      }
    }
  });
  Object.defineProperty(CatCharacteristics.prototype, 'imaterial', {
    get () {
      const row = this.params.find({cnstr: 0, region: 0, param: job_prm.properties.imaterial});
      return row?.value;
    }
  });
}
