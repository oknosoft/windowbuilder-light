import {registerPrintComponents} from '../../aggregate/Metadata/registerPrintForms';

export default function work_centers_task($p) {
  $p.adapters.pouch.once('pouch_doc_ram_loaded', () => import('./report')
    .then(({MutualSettlements}) => registerPrintComponents($p, [MutualSettlements])));
}
