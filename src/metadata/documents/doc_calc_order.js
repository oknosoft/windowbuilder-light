/**
 * ### Модуль менеджера и документа Расчет
 */

//import {handleIfaceState} from '../../redux';
import {FrmObj, FrmObjCompact} from '../../components/CalcOrder/FrmObj';
import ListQuick from '../../components/CalcOrder/FrmList/Quick';

export default function ($p) {

  const {DocCalc_order: {prototype}, doc: {calc_order}, wsql} = $p;

  if(wsql.get_user_param('iface_kind') === 'quick') {
    calc_order.FrmObj = FrmObjCompact;
    calc_order.FrmList = ListQuick;
  }
  else {
    calc_order.FrmObj = FrmObj;
  }

  /**
   * Обработчик при изменении реквизита
   */
  // DocCalc_orderProductionRow.prototype.value_change = function value_change(field, type, value) {
  //
  // };

  // Подписка на события

  // prototype.after_create = function after_create() {
  //   console.log('created');
  //   return this;
  // }

  // prototype.before_save = function before_save() {
  //   console.log('saved');
  //   return this;
  // }

}
