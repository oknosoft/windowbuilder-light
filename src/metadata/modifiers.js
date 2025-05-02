// модификаторы объектов и менеджеров данных

// общие модули
//import common from './common';

// модификаторы перечислений
//import enums from "./enums";

// модификаторы справочников
import catalogs from "./cat";

// модификаторы документов
import documents from "./doc";

// модификаторы планов видов характеристик
//import chartscharacteristics from "./chartscharacteristics";

// модификаторы отчетов
//import reports from "./reports";

import ui from 'metadata-ui';
import './aggregate/rubles';
import scale_svg from './aggregate/scale_svg';
import wss from './aggregate/wss';


export default function ($p) {
  ui($p);
  catalogs($p);
  documents($p);
  Object.assign($p.utils, {scale_svg});
  wss($p);
}
