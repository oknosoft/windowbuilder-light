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
}

