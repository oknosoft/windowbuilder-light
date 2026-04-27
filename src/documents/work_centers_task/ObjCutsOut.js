import React from 'react';
import ObjTabular from '../../aggregate/FrmObj/ObjTabular';
import {columns} from './ObjCutsIn';

const record_kind = $p.enm.debit_credit_kinds.credit;

export default function ObjCutsOut({tabRef, obj, selSel}) {
  return <ObjTabular
    tabRef={tabRef}
    tabular={obj.cuts}
    columns={columns}
    selection={{record_kind}}
    selSel={selSel}
  />;
}
