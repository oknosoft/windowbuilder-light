import {registerPrintComponents} from '../../../aggregate/Metadata/registerPrintForms';
import {GroupedProducts} from './GroupedProducts';
import {Stickers40} from './Stickers40';
import {Stickers60} from './Stickers60';
import {PlaningDates} from './PlaningDates';
import {Cut2D} from './Cut2D';
import {CutsBalance} from './CutsBalance';

export function registerPrintForms($p) {
  return registerPrintComponents($p, [GroupedProducts, Stickers40, Stickers60, PlaningDates, Cut2D, CutsBalance]);
}
