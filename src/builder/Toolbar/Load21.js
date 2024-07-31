import React from 'react';
import TextField from '@mui/material/TextField';
import {onKeyUp} from '@oknosoft/ui/DataField/enterTab';

export default function load21({editor, setContext, handleClose}) {
  handleClose();
  const {utils, ui, adapters} = $p;
  const stub = {
    uid: location.pathname.replace('/builder/', ''),
    onChange(v) {
      if(utils.is.guid(v)) {
        this.uid = v;
      }
    },
  }
  $p.ui.dialogs.alert({
    timeout: 0,
    title: 'Изделие из старой базы',
    Component: Load21,
    props: {editor, setContext, stub},
    //initFullScreen: true,
    hide_btn: true,
    onOk() {
      const {uid} = stub;
      if(utils.is.guid(uid)) {
        adapters.fetch(`/couchdb/wb_${sessionStorage.zone}_doc/cat.characteristics|${uid}`)
          .then(res => res.json())
          .then(raw => {
            if(raw.error) {
              throw new Error(`${raw.error} ${raw.reason}`);
            }
            editor.project.load21(raw);
          })
          .catch(err => alert(err.message || err));
      }
      else {
        alert(`Значение "${uid}" не соответствует маске идентификатора`);
      }
    },
  })
}

function Load21({stub}) {
  return <TextField
    ref={(el) => {
      const input = el?.querySelector('input');
      setTimeout(() => {
        input?.focus?.();
        input?.select?.();
      });
    }}
    defaultValue={stub.uid}
    onKeyUp={onKeyUp}
    onBlur={({target}) => {
      stub.onChange(target.value);
    }}
  />;
}
