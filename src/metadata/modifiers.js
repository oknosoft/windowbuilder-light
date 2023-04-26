// модификаторы объектов и менеджеров данных

// общие модули
//import common from './common';

// модификаторы перечислений
//import enums from "./enums";

// модификаторы справочников
//import catalogs from "./catalogs";

// модификаторы документов
//import documents from "./documents";

// модификаторы планов видов характеристик
//import chartscharacteristics from "./chartscharacteristics";

// модификаторы отчетов
//import reports from "./reports";

import qs from 'qs';
import ui from '../packages/ui';


export default function ($p) {
  ui($p);
  $p.utils.prm = function prm() {
    return qs.parse(location.search.replace('?',''));
  };
}
