// модификаторы объектов и менеджеров данных

// общие модули
import editor from './editor';

// модификаторы документов
import doc_calc_order_invisible from '../metadata/documents/doc_calc_order_invisible';

export default function ($p) {
  editor($p);
  doc_calc_order_invisible($p);
}
