
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
  Object.defineProperties(CatCharacteristics.prototype, {
    imaterial: {
      get () {
        const row = this.params.find({cnstr: 0, region: 0, param: job_prm.properties.imaterial});
        return row?.value;
      }
    },
    iedge: {
      get () {
        const values = [];
        this.params.find_rows({param: job_prm.properties.iedge}, ({value}) => {
          if(!value.empty() && value.name !== 'Нет' && !values.includes(value)) {
            values.push(value);
          }
        });
        return values.length > 0;
      }
    },
    ihole: {
      get () {
        const row = this.params.find_rows({cnstr: 0, region: 0, param: job_prm.properties.ihole});
        const values = [];
        this.params.find_rows({param: {in: job_prm.properties.ihole}}, ({param, value}) => {
          if(value && !values.includes(param)) {
            values.push(param);
          }
        });
        return values.length > 0;
      }
    }
  });

}
