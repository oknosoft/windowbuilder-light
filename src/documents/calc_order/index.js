
export default function calc_order({cat, doc, adapters}) {
  doc.calc_order.setMaxListeners(200);

  adapters.pouch.once('pouch_doc_ram_loaded', () => import('./print')
    .then(({registerPrintForms}) => registerPrintForms({cat})));
}
