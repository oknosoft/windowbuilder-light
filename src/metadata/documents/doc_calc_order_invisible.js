/**
 * ### Модуль менеджера и документа Расчет
 */


export default function ($p) {
  /* eslint-disable-next-line */
  const {DocCalc_order: {prototype}, doc: {calc_order}, utils} = $p;

  calc_order.by_num = function (key) {
    return this.pouch_db.query('number_internal', {key, include_docs: true, limit: 1})
      .then(({rows}) => {
        if(!rows.length) {
          throw {error: 'not_found', reason: 'missing'};
        }
        this.adapter.load_changes({rows}, {});
        return this.by_ref[rows[0].doc.ref];
      });
  };

  // Подписка на события
  const {after_create} = prototype;
  prototype.after_create = function after_create_quick() {
    return after_create.call(this)
      .then(() => {
        if(!this.number_internal) {
          this.number_internal = utils.randomId();
        }
        if(this.purpose.empty()) {
          this.purpose = $p.current_user.department._extra('purpose');
        }
        return this;
      });
  };

  Object.defineProperties(prototype, {
    presentation: {
      get() {
        const {moment} = utils;
        const number = this.number_internal || this.number_doc || this.ref;
        const {date, obj_delivery_state, sending_stage, _modified} = this;
        const info = sending_stage.empty() ? obj_delivery_state : sending_stage;
        return `Заказ ${number} от ${moment(date).format(moment._masks.date_time)} (${info})${_modified ? ' *' : ''}`;
      },
      /* eslint-disable-next-line */
      set(v) {
      }
    },

    // назначение использования
    purpose: {
      get() {
        const {cat: {templates}, cch: {properties}} = $p;
        const property = properties.predefined('purpose');
        if(property && !property.empty()) {
          const row = this.extra_fields.find(property.ref, 'property');
          return row ? row.value : templates.get();
        }
        else {
          return templates.get();
        }
      },
      set(value) {
        const {cch: {properties}} = $p;
        const property = properties.predefined('purpose');
        if(property && !property.empty()) {
          const row = this.extra_fields.find(property.ref, 'property');
          if(row) {
            row.value = value;
          }
          this.extra_fields.add({property, value});
        }
      }
    },

    /**
     * Возвращает строку доставки текущего заказа
     * @param add - если истина и строки нет в заказе - добавляет
     */
    delivery: {
      value(add) {
        let delivery;
        this.production.forEach((row) => {
          if(row.nom) {
            delivery = row;
            return false;
          }
        });
        if(!delivery && add) {
          delivery = this.production.add();
        }
        return delivery;
      }
    },

  });


}
