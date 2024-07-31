import pluginBuilder from './builder/plugin';
import pluginCat from './catalogs/plugin';
import {plugin as pluginUI} from '@oknosoft/ui/dialogs';

export default function plugins(...args) {
  for(const plugin of [...pluginCat, ...pluginBuilder, pluginUI]) {
    plugin(...args);
  }
};
