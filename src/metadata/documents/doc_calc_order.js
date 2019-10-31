/**
 * ### Модуль менеджера и документа Расчет
 */

//import {handleIfaceState} from '../../redux';
import FrmObj from '../../components/CalcOrder/FrmObj/FrmObj';
import FrmList from '../../components/CalcOrder/FrmList/DirectList';

export default function ($p) {
  /* eslint-disable-next-line */
  const {doc: {calc_order}, wsql} = $p;
  calc_order.FrmObj = FrmObj;
  calc_order.FrmList = FrmList;
}
