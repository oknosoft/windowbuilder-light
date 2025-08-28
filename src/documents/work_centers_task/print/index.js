import {GroupedProducts} from './GroupedProducts';
import {Stickers} from './Stickers';

export function registerPrintForms({cat: {formulas}}) {

  // после загрузки данных, регистрируем печатные формы
  const proto = {
    jsx: true,
    parent: formulas.predefined('printing_plates'),
  };
  const components = [];
  for(const Component of [GroupedProducts, Stickers]) {
    const formula = formulas.create(Object.assign({}, proto, {
      ref: Component.ref,
      name: Component.title,
      params: Component.destination.split(',').map((value) => ({param: 'destination', value})),
    }), false, true);
    formula._data._formula = Component;
    formula._set_loaded(Component.ref);
    components.push(formula);
  }

  formulas.load_formulas(components);
}
