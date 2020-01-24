/**
 * ### Модуль менеджера и документа Расчет
 */

//import {handleIfaceState} from '../../redux';
import FrmObj from '../../components/CalcOrder/FrmObj/FrmObj';
import FrmList from '../../components/CalcOrder/FrmList/DirectList';
import RepParams from '../../components/CalcOrder/FrmList/Params';

export default function ($p) {
  /* eslint-disable-next-line */
  const {doc: {calc_order}, cat, DocCalc_order, adapters: {pouch}} = $p;
  calc_order.FrmObj = FrmObj;
  calc_order.FrmList = FrmList;
  calc_order.RepParams = RepParams;

  // метод загрузки продукций заказа
  DocCalc_order.prototype.load_templates = function load_templates() {
    if(this._data._templates_loaded) {
      return Promise.resolve();
    }
    else if(this.obj_delivery_state == 'Шаблон') {
      return fetch(`/couchdb/mdm/${pouch.props.zone}/templates/${this.ref}`, {
        headers: pouch.remote.doc.getBasicAuthHeaders({prefix: pouch.auth_prefix(), ...pouch.remote.doc.__opts.auth}),
      })
        .then((res) => res.json())
        .then(({rows}) => {
          cat.characteristics.load_array(rows);
          this._data._templates_loaded = true;
        })
        .catch(console.log);
    }
    return this.load_production();
  };

  calc_order.direct_load = function (force) {
    if(this._direct_loaded && !force) {
      return Promise.resolve();
    }

    return this.adapter.find_rows(this, {
      _mango: true,
      limit: 8000,
      selector: {
        $and: [
          {class_name: this.class_name},
          {date: {$gte: moment().subtract(5, 'month').format()}},
          {date: {$lte: moment().add(1, 'month').format()}},
          {search: {$gt: null}},
        ]
      },
      sort: [{class_name: 'desc'}, {date: 'desc'}],
    }, this.adapter.local.doc)
      .then(() => this._direct_loaded = true);
  };


}

