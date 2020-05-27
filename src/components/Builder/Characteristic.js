
import React from 'react';
import Dialog from 'metadata-react/App/Dialog';
import FrmObj from 'windowbuilder-forms/dist/CatCharacteristics/FrmObj';

export default function ({editor, handleClose, windowHeight}) {

  const {_dp} = editor.project;
  const {_manager, ref, name} = _dp.characteristic;

  return <Dialog
    open
    noSpace
    title={name}
    onClose={handleClose}
    initFullScreen
  >
    <FrmObj
      _mgr={_manager}
      _acl="r"
      match={{params: {ref}}}
      handlers={{}}
      windowHeight={windowHeight}
    />
  </Dialog>
}
