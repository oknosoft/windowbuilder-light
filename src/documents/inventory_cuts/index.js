
export default function inventory_cuts({cat, doc, adapters, DocInventory_cuts, DocInventory_cutsMaterialsRow}) {

  DocInventory_cutsMaterialsRow.prototype.value_change = function (field, type, value) {
    if('len,width,qty'.includes(field)) {
      const {_obj} = this;
      _obj[field] = parseFloat(value) || 0;
      this.quantity = ((_obj.len * _obj.width * _obj.qty || 0) / 1e6).round(3);
    }
  };

  // adapters.pouch.once('common_loaded', () => {
  //   const {fields} = doc.inventory_cuts.metadata('materials');
  //   const {nom_kinds} = cat;
  //   fields.nom.choice_params = [{
  //     name: 'nom_kind',
  //     path: [nom_kinds.by_name('Профиль'), nom_kinds.by_name('Заполнение')],
  //   }];
  // });
  //   .then(({registerPrintForms}) => registerPrintForms({cat})));
  // fields.key.type.types.splice(0, 1);
  // fields.recipient.type.types.splice(0, 1);
  // adapters.pouch.once('pouch_doc_ram_loaded', () => import('./print')
  //   .then(({registerPrintForms}) => registerPrintForms({cat})));
}
