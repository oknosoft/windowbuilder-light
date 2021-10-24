/**
 * Отложенная загрузка и конструкторы в контекст
 *
 * @module lazy
 *
 * Created by Evgeniy Malyarov on 20.12.2019.
 */
import withStyles from 'metadata-react/styles/paper600';

const stub = () => null;

export const lazy = {
  DataList: stub,
  DataTree: stub,
  DataObj: stub,
  FrmReport: stub,
};

import('metadata-react/DynList/DynList')
  .then(module => {
    lazy.DataList = module.DynList;
    return import('metadata-react/DataTree');
  })
  .then(module => {
    lazy.DataTree = module.default;
    return import('metadata-react/FrmObj/DataObj');
  })
  .then(module => {
    lazy.DataObj = withStyles(module.default);
    return import('metadata-react/FrmReport');
  })
  .then(module => {
    lazy.FrmReport = module.default;
    import('metadata-react/styles/react-data-grid.css');
    import('metadata-react/styles/indicator/index.css');
  });
