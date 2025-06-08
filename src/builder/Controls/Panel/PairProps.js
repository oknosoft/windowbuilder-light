import React from 'react';
import Typography from '@mui/material/Typography';
import ManyProps from './ManyProps';
import FieldInsetProfileGrp from '../../DataField/InsetProfileGrp';
import {fields} from './ProfileProps';
import CurrentParams from './CurrentParams';

export default function PairProps(props) {
  const {elm, layer, editor, project} = props;
  let [elm1, elm2] = elm;
  const children = [];
  // у пары заполнений, команды такие же, как у кучи
  if(elm1 instanceof editor.Filling && elm2 instanceof editor.Filling) {
    return <ManyProps {...props}/>;
  }
  if(elm1.is('GeneratrixElement') && elm2.is('GeneratrixElement')) {
    // это пара профилей
    if(elm2.nearest === elm1) {
      [elm1, elm2] = [elm2, elm1];
    }
    if((elm1.nearest === elm2) || (elm2.is('GeneratrixElement.Adjoining') && elm2.isNearest(elm1))) {
      children.push(<Typography key="title">{`Примыкание ${elm1.index} к ${elm2.index}`}</Typography>);
      const params = elm1.params.cnnII(elm2);
    }
    let node1, node2;
    for(const node of 'be') {
      if(!node1 && elm1[node].profile === elm2 || elm1[node].profileOuter === elm2) {
        node1 = node;
      }
      if(!node2 && elm2[node].profile === elm1 || elm2[node].profileOuter === elm1) {
        node2 = node;
      }
    }
    if(!children.length) {
      if(node1 && node2) {
        children.push(<Typography key="title">{`Угловое соединение профилей`}</Typography>);
        children.push(<FieldInsetProfileGrp key="inset" obj={elm} fld="inset" meta={fields.inset}/>);
      }
      else if(node1 || node2) {
        children.push(<Typography key="title">{`T-образное соединение профилей`}</Typography>);
        children.push(<FieldInsetProfileGrp key="inset" obj={elm} fld="inset" meta={fields.inset}/>);
      }
      else {
        children.push(<Typography key="title">{`Профили без соединений`}</Typography>);
        children.push(<FieldInsetProfileGrp key="inset" obj={elm} fld="inset" meta={fields.inset}/>);
      }
    }
  }
  else if(elm2 instanceof editor.Filling) {
    [elm1, elm2] = [elm2, elm1];
    const rib = elm1.rib(elm2);
    if(rib) {
      children.push(<Typography key="title">{`Ребро заполнения`}</Typography>);
      children.push(<CurrentParams key="rib" params={rib.params} />);
    }
    else {
      children.push(<Typography key="title">{`Профиль и заполнение`}</Typography>);
      children.push(<Typography key="no" variant="overline">{`Нет соединений между элементами`}</Typography>);
    }
  }
  return children;
}
