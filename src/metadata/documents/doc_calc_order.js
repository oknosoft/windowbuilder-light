/**
 * ### Модуль менеджера и документа Расчет
 */

//import {handleIfaceState} from '../../redux';
import FrmObj from '../../components/CalcOrder/FrmObj/FrmObj';
import FrmList from 'wb-forms/dist/CalcOrder/FrmList/FrmList';
import RepParams from 'wb-forms/dist/CalcOrder/FrmList/Params';

export default function ($p) {
  /* eslint-disable-next-line */
  const {doc: {calc_order}} = $p;
  calc_order.FrmObj = FrmObj;
  calc_order.FrmList = FrmList;
  calc_order.RepParams = RepParams;
}

