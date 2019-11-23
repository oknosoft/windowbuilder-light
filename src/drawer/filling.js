/**
 * Изменяем визуализацию выделения заполнений
 *
 * @module Filling
 *
 * Created by Evgeniy Malyarov on 28.10.2019.
 */

export default function (Filling) {
  const {setSelection} = Filling.prototype;
  Filling.prototype.setSelection = function setSelectionWithProfiles(selection) {
    setSelection.call(this, selection);
    for(const profile of this.layer.profiles) {
      profile.selected = selection;
    }
  };
}
