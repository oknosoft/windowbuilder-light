// модификаторы документов

// расчет-заказ
import doc_calc_order from "./doc_calc_order";
import doc_calc_order_invisible from "./doc_calc_order_invisible";

export default function ($p) {
	doc_calc_order($p);
	doc_calc_order_invisible($p);
}
