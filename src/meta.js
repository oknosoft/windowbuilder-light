
import {meta as coreMeta, classes as coreClasses, exclude as coreExclude} from '@oknosoft/wb/core/src';

export const meta = {
  enm: {...coreMeta.enm},
  cat: {...coreMeta.cat},
  dp: {...coreMeta.dp},
};

export const classes = [...coreClasses];

export const exclude = [...coreExclude];
