import React from 'react';
import ButtonImitation from './ProfileImitation';
import InsetSelection from './InsetSelection';


export default function ProfileToolbar(props) {
  return <>
    <ButtonImitation {...props} />
    <InsetSelection {...props} />
  </>;
}
