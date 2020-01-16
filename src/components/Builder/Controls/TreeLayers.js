import React from 'react';
import PropTypes from 'prop-types';
import TreeView from '@material-ui/lab/TreeView';
import Divider from '@material-ui/core/Divider';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import CustomTreeItem from './CustomTreeItem';

function addLayers(contours, activeLayer) {
  return contours.length ?
    contours.map((contour) => {
      const key = `l-${contour.cnstr}`;
      return <CustomTreeItem
        key={key}
        nodeId={key}
        labelText={`${contour.layer ? 'Створка' : 'Рама'} №${contour.cnstr}`}
        checked={activeLayer === contour}
      >
        {addLayers(contour.contours, activeLayer)}
      </CustomTreeItem>;
    })
    :
    null;
}


export default function TreeLayers(props) {
  const {contours, ox, activeLayer} = props.editor.project;
  const defaultExpanded = ['root'];
  contours.forEach(({cnstr}) => defaultExpanded.push(`l-${cnstr}`));

  return <TreeView
    expanded={defaultExpanded}
    defaultCollapseIcon={<ArrowDropDownIcon />}
    defaultExpandIcon={<ArrowRightIcon />}
    defaultEndIcon={<div style={{ width: 24 }} />}
  >
    <CustomTreeItem nodeId="root" labelText={ox.prod_name(true)} LabelIcon={AccountTreeIcon}>
      {addLayers(contours, activeLayer)}
    </CustomTreeItem>

    <Divider/>
    <CustomTreeItem nodeId="auto_lines" labelText="Авторазмерные линии" checked={true} />
    <CustomTreeItem nodeId="custom_lines" labelText="Доп. размерные линии" checked={true} />
    <CustomTreeItem nodeId="cnns" labelText="Соединители" checked={true} />
    <CustomTreeItem nodeId="visualization" labelText="Визуализация" checked={true} />
    <CustomTreeItem nodeId="txts" labelText="Комментарии" checked={true} />
  </TreeView>;
}

TreeLayers.propTypes = {
  editor: PropTypes.object.isRequired,
};

