/**
 * ### Модуль менеджера справочника шаблонов
 */

//import {handleIfaceState} from '../../redux';
import {FrmObj, FrmList} from '../../components/Templates';

export default function ($p) {

  const {templates} = $p.cat;

  templates.FrmObj = FrmObj;
  templates.FrmList = FrmList;

}
