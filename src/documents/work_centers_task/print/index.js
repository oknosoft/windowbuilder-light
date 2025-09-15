import {registerPrintComponents} from '../../../aggregate/Metadata/registerPrintForms';
import {GroupedProducts} from './GroupedProducts';
import {Stickers} from './Stickers';
import {PlaningDates} from './PlaningDates';

export function registerPrintForms($p) {
  return registerPrintComponents($p, [GroupedProducts, Stickers, PlaningDates]);
}
