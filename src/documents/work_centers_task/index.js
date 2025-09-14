
export default function work_centers_task({cat, doc, adapters}) {
  //const {fields} = doc.work_centers_task.metadata();
  // fields.key.type.types.splice(0, 1);
  // fields.recipient.type.types.splice(0, 1);
  adapters.pouch.once('pouch_doc_ram_loaded', () => import('./print')
    .then(({registerPrintForms}) => registerPrintForms({cat})));
}
