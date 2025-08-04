// модификаторы объектов и менеджеров данных

// общие модули
//import common from './common';

// модификаторы перечислений
//import enums from "./enums";

// модификаторы справочников
import catalogs from "../../catalogs";

// модификаторы документов
import documents from "../../documents";

// модификаторы планов видов характеристик
//import chartscharacteristics from "./chartscharacteristics";

// модификаторы отчетов
//import reports from "./reports";

import ui from 'metadata-ui';
import './rubles';
import scale_svg from './scale_svg';
import wss from './wss';


export default function ($p) {
  ui($p);
  catalogs($p);
  documents($p);
  Object.assign($p.utils, {scale_svg});
  wss($p);
}
