import React from 'react';
import {styled} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {stat} from './CuttingProgress1D';

const FragmentNom = styled('div')(({ theme }) => ({marginTop: theme.spacing(2)}));


export default function CuttingReport1D({obj}) {
  const res = [];
  const {debit_credit_kinds} = $p.enm;
  const _top = 10e6;

  // бежим по свёрнутой табчасти раскроя
  const fragments = obj.fragments1D(true);
  fragments.forEach((characteristics, nom) => {
    for(const [characteristic] of characteristics) {
      const crows = obj.cutting.find_rows({_top, nom, characteristic});
      const cuts_in = obj.cuts.find_rows({_top, record_kind: debit_credit_kinds.credit, nom, characteristic});
      const cuts_out = obj.cuts.find_rows({_top, record_kind: debit_credit_kinds.debit, nom, characteristic});

      const products_len = crows.reduce((sum, row) => sum + row.len, 0);
      const workpieces_len = cuts_in.reduce((sum, row) => sum + row.len, 0);
      const scraps_len = cuts_out.reduce((sum, row) => sum + row.len, 0);
      const knifewidth = nom.knifewidth || 7;
      const workpieces = cuts_in.map(({len, stick}) => {
        crows.forEach((row) => {
          if(stick === row.stick) {
            len -= (row.len + knifewidth);
          }
        });
        return len > 0 ? len : 0;
      });
      const scraps_percent = (workpieces_len - products_len - scraps_len - crows.length * knifewidth) * 100 / workpieces_len;

      const status = {
        rows: crows,
        cuts_in,
        workpieces,
        products_len,
        workpieces_len,
        scraps_len,
        scraps_percent: scraps_percent > 0 ? scraps_percent : 0,
        userData: {usefulscrap: 600, knifewidth}
      };

      res.push(<FragmentNom key={`${nom.ref}-${characteristic.ref}`}>
        <Typography variant="h6">{nom.name + (characteristic.empty() ? '' : ` ${characteristic.name}`)}</Typography>
        <Typography variant="subtitle1">{stat(status)}</Typography>
      </FragmentNom>);
    }
  });
  return res;
}
