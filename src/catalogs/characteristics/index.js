import spreading from './spreading';

export default function cat_characteristics($p) {
  spreading($p);
  $p.adapters.pouch.once('pouch_doc_ram_loaded', () => import('./print')
    .then(({registerPrintForms}) => registerPrintForms($p)));
}
