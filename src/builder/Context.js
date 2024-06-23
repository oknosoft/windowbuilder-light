import React from 'react';
/**
 * @typedef {Object} MainContext
 * @property {Editor} editor - графический редактор
 * @property {BuilderElement|Array.<BuilderElement>} elm - текущий выделенный элемент
 * @property {Contour} layer - активный слой редактора
 * @property {Tool} tool - текущий инструмент редактора
 * @property {DocCalcOrder} calcOrder - расчёт-заказ покупателя
 * @property {DocCalcOrderProductionRow} orderRow - текущая строка расчёта
 * @property {Boolean} history - включен просмотр истории
 * @property {Boolean} clipboard - открыта форма буфера обмена
 * @property {String} type - тип выделения в дереве структуры изделия
 * @property {String} mode - текущий режим (рисовалка, заказ, раскрой и т.д)
 */
const defaultContext = {
  editor: null,
  project: null,
  elm: null,
  node: '',
  layer: null,
  tool: null,
  calcOrder: null,
  orderRow: null,
  history: false,
  clipboard: false,
  sketchView: false,
  type: 'root',
  mode: 'editor',
  css: {},
  stamp: 0,
};


const BuilderContext = React.createContext(defaultContext);
export const useBuilderContext = () => React.useContext(BuilderContext);

export default function BuilderContextProvider({children}) {
  const [context, rawSetContext] = React.useState(defaultContext);
  const setContext = React.useMemo(() => (newState) => rawSetContext(prevState => ({...prevState, ...newState})), []);

  return <BuilderContext.Provider value={{ ...context, setContext}}>{children}</BuilderContext.Provider>;
}
