/**
 * ### Модуль менеджера и документа Расчет
 */

//import {handleIfaceState} from '../../redux';
import FrmObj from '../../components/CalcOrder/FrmObj';

export default function ($p) {

  const {DocCalc_order: {prototype}, doc: {calc_order}} = $p;

  calc_order.FrmObj = FrmObj;

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
