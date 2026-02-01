
export default function calc_order({cat, doc, adapters, DocCalc_order}) {
  doc.calc_order.setMaxListeners(200);

  DocCalc_order.prototype.beforePost = function () {
    return new Promise((resolve, reject) => {
      if(!$p.current_user.role_available('СогласованиеРасчетовЗаказов')) {
        reject(new Error('Текущему пользователю запрещено проводить заказы'));
      }
      const {obj_delivery_state} = this;
      if(obj_delivery_state.is('Отклонен') || obj_delivery_state.is('Отозван')) {
        this.obj_delivery_state = 'Отправлен';
      }
      resolve(this);
    });
  };

  adapters.pouch.once('pouch_doc_ram_loaded', () => import('./print')
    .then(({registerPrintForms}) => registerPrintForms({cat})));
}
