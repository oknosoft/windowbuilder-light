import pluginBuilder from './builder/plugin';
import pluginCat from './catalogs/plugin'

export default function plugins(...args) {
  for(const plugin of [...pluginCat, ...pluginBuilder]) {
    plugin(...args);
  }
};
