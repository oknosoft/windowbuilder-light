/**
 * Выполняет запросы к внешним сервисам, рассчитывает цены заказной продукции и создаёт характеристики
 *
 * @module handleCalck
 *
 * Created by Evgeniy Malyarov on 13.03.2020.
 */

export default function handleCalck(obj) {
  let res = Promise.resolve();
  obj.orders.forEach((row) => {
    res = res.then(() => processOrder(row, obj));
  });
  return res;
}

function processOrder({is_supplier: {_manager: {adapter}, ref, nom}, invoice}, calc_order) {
  return adapter.fetch(`/adm/api/supplier/${ref}`, {
    method: 'POST',
    body: JSON.stringify(invoice),
    headers: new Headers({zone: adapter.props.zone}),
  })
    .then((res) => res.json())
    .then((doc) => {
      // чистим строки продукции, созданные текущим заказом поставщику
      const adel = [];
      const acx = [];
      calc_order.production.forEach((row) => {
        if(row.ordn == invoice || row.characteristic.origin == invoice) {
          adel.push(row);
        }
      });
      adel.forEach((row) => {
        if(!row.characteristic.empty() && row.characteristic.calc_order == calc_order) {
          acx.push(row.characteristic);
        }
        calc_order.production.del(row);
      });

      // бежим по ответу сервиса, заполняем табчасти заказа поставщику и документа Расчет
      doc.production.forEach((srow, index) => {
        const nrow = nom.find({identifier: srow.nom});
        const row = invoice.goods.get(index);
        row.nom = nrow.nom;
        row.unit = nrow.nom.storage_unit;
        row.price = srow.price;
        row.quantity = srow.quantity;
        row.amount = srow.amount;
        row.vat_rate = srow.vat_rate;
        row.vat_amount = srow.vat_amount;

        const attr = {first_cost: row.price};
        // для продукций создаём характеристики
        let cx;
        if(nrow.params.length > 3) {
          if(acx.length) {
            cx = acx.pop();
            cx.origin = invoice;
          }
          else {
            cx = $p.cat.characteristics.create({calc_order, origin: invoice}, false, true)._set_loaded();
          }
          attr.characteristic = cx;
          attr.qty = row.quantity;
          cx.owner = row.nom;
          cx.x = srow.len;
          cx.y = srow.width;
          cx.s = srow.s;
        }
        Object.assign(attr, {
          nom: row.nom,
          unit: row.unit,
          len: srow.len,
          width: srow.width,
          s: srow.s,
        });
        calc_order._data._loading = true;
        const orow = calc_order.production.add(attr, true);
        calc_order._data._loading = false;
        orow.quantity = row.quantity;
        if(cx) {
          cx.product = orow.row;
          cx.name = cx.prod_name();
        }
      });

      return invoice.save();
    });
}
