
export default function ({cat, doc, utils}) {
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
}
