import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import UTurnRightIcon from '@mui/icons-material/UTurnRight';
import Divider from '@mui/material/Divider';
import {Toolbar, HtmlTooltip} from '../../aggregate/App/styled';
import RefField from 'metadata-ui/DataField/RefField';
import Text from 'metadata-ui/DataField/Text';
import {dp, query, filter} from './data';

const slot = {
  input: {
    min: `${new Date().getFullYear() - 1}-01-01`,
    max: `${new Date().getFullYear()}-12-31`,
  },
};
const style={minWidth: 200};
const labelProps = {style: {textAlign: 'center', top: -2}};

export default function RemaindersToolbar({rmd, scheme, selectedRows, setSelectedRows, handleIfaceState, tunes, setTunes}) {

  const include = () => {
    const {tgt} = rmd;
    const {ui: {dialogs}, adapters: {pouch}, enm: {debit_credit_kinds}} = $p;
    if(tgt.posted) {
      return dialogs.alert({
        title: tgt.presentation,
        text: 'Нельзя редактировать проведённое задание',
        timeout: 10000,
      });
    }
    for(const index of selectedRows) {
      const src = rmd.rows.find(row => row.row === index);
      const row = tgt.set.add(src);
      row.record_kind = -1;
      row.phase = dp.phase;
    }
    tgt.fill_by_keys({c2d: true});
    const nom = new Set();
    for(const row of tgt.cutting) {
      if(row.len && row.width) {
        nom.add(row.nom);
      }
    }

    pouch.fetch('/couchdb/pgsql/cuts', {
      method: 'POST',
      body: JSON.stringify({nom: Array.from(nom).map(v => v.ref)}),
    })
      .then(res => res.json())
      .then(({rows}) => {
        for(const {nom, len, width, qty} of rows) {
          tgt.cuts.clear();
          tgt.cuts.add({
            record_kind: debit_credit_kinds.debit,
            nom,
            len,
            width,
            quantity: qty,
          });
        }
      })
      .catch(() => null)
      .then(() => {
        setSelectedRows(new Set());
        filter({rmd, scheme, handleIfaceState});
      });
  };

  return <Toolbar disableGutters>
    <Text
      key={scheme.ref + 'from'}
      obj={scheme}
      fld="date_from"
      label="Период"
      labelProps={labelProps}
      inputProps={{type: "date"}}
      fullWidth={false}
      slotProps={slot}
      style={style}
    />
    <Text
      key={scheme.ref + 'till'}
      obj={scheme}
      fld="date_till"
      label="по"
      labelProps={labelProps}
      inputProps={{type: "date"}}
      fullWidth={false}
      slotProps={slot}
      style={style}
    />
    <RefField
      key={scheme.ref + 'phase'}
      obj={dp}
      fld="phase"
      fullWidth={false}
      label="Фаза"
      labelProps={labelProps}
    />
    <Typography sx={{flex: 1}}></Typography>
    <HtmlTooltip title="Освежить данные">
      <IconButton onClick={() => query({rmd, scheme, handleIfaceState})}><CloudSyncIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Уточнить фильтр">
      <IconButton onClick={() => setTunes(!tunes)}><FilterAltOutlinedIcon/></IconButton>
    </HtmlTooltip>
    <Divider orientation="vertical" flexItem sx={{m: 1}} />
    <HtmlTooltip title="Включить в задание">
      <IconButton disabled={!selectedRows.size} onClick={include}><UTurnRightIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>;
}
