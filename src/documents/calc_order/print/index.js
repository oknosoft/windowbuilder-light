import {PlaningDates} from './PlaningDates';

export function registerPrintForms({cat: {formulas}}) {

  // после загрузки данных, регистрируем печатные формы
  const proto = {
    parent: formulas.predefined('printing_plates'),
  };
  const components = [];
  for(const Component of [PlaningDates]) {
    const formula = formulas.create(Object.assign({}, proto, {
      ref: Component.ref,
      name: Component.title,
      jsx: Component.jsx,
      params: Component.destination.split(',').map((value) => ({param: 'destination', value})),
    }), false, true);
    formula._data._formula = Component;
    formula._set_loaded(Component.ref);
    components.push(formula);
  }

  formulas.load_formulas(components);
}
