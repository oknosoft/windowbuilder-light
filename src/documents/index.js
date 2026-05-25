
import calc_order from './calc_order';
import work_centers_task from './work_centers_task';
import inventory_cuts from './inventory_cuts';

export default function ($p) {
  calc_order($p);
  work_centers_task($p);
  inventory_cuts($p);
}
