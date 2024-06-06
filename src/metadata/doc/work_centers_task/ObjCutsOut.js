import React from 'react';
import ObjTabular from './ObjTabular';
import {columns} from './ObjCutsIn';

export default function ObjCutsOut({tabRef, obj}) {
  return <ObjTabular
    tabRef={tabRef}
    tabular={obj.cuts}
    columns={columns}
    selection={{record_kind: 'credit'}}
  />;
}
