// модификаторы справочников

import CharacteristicsFrmObj from 'windowbuilder-forms/dist/CatCharacteristics/FrmObj';
import SpecFragment from 'windowbuilder-forms/dist/CatCharacteristics/Spec';

export default function ({cat}) {
  cat.forEach((mgr) => {
    if(mgr.cachable === 'doc' && mgr.class_name !== 'cat.characteristics') {
      mgr._cachable = 'ram';
    }
  });

  cat.characteristics.FrmObj = CharacteristicsFrmObj;
  cat.characteristics.SpecFragment = SpecFragment;
}
