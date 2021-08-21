// модификаторы справочников

import CharacteristicsFrmObj from 'wb-forms/dist/CatCharacteristics/FrmObj';
import SpecFragment from 'wb-forms/dist/CatCharacteristics/Spec';
import select_template from 'wb-core/dist/select_template';

export default function ($p) {
  $p.cat.characteristics.FrmObj = CharacteristicsFrmObj;
  $p.cat.characteristics.SpecFragment = SpecFragment;
  select_template($p);
}
