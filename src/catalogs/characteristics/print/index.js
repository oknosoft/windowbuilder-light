import {PlaningDates} from './PlaningDates';
import {registerPrintComponents} from '../../../aggregate/Metadata/registerPrintForms';

export function registerPrintForms($p) {
  return registerPrintComponents($p, [PlaningDates]);
}
