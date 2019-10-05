/**
 * ### Модуль менеджера справочника шаблонов
 */

//import {handleIfaceState} from '../../redux';
import {FrmObj, FrmList} from '../../components/Templates';

export default function ({cat: {templates}}) {
  templates.FrmObj = FrmObj;
  templates.FrmList = FrmList;
}
