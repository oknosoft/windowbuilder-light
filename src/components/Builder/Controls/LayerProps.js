
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import LayerToolbar from './Toolbar/LayerToolbar';
import Bar from './Bar';
import PropField from 'metadata-react/DataField/PropField';
import LinkedProps from 'wb-forms/dist/Common/LinkedProps';
import FieldFurn from 'wb-forms/dist/CatFurns/Editor';
import FieldFlipped from 'wb-forms/dist/CatClrs/FieldFlipped';

export default function LayerProps(props) {
  const {layer, ox} = props;
  const {blank} = $p.utils;
  return <>
    <LayerToolbar {...props}/>
    <Bar>{layer.info}</Bar>
    {layer.own_sys ?
      <>
        <PropField _obj={layer} _fld="sys" />
        <FieldFlipped _obj={layer} />
        <LinkedProps ts={layer.prms} cnstr={layer.cnstr} inset={blank.guid} layer={layer}/>
      </>
      :
      (layer.layer ?
      <>
        <FieldFurn _obj={layer} _fld="furn" fullWidth />
        <PropField _obj={layer} _fld="direction" />
        <PropField _obj={layer} _fld="h_ruch" />
        <FieldFlipped _obj={layer} />
        <LinkedProps ts={ox.params} cnstr={layer.cnstr} inset={blank.guid} layer={layer}/>
      </>
          :
        <>
          <FieldFlipped _obj={layer} />
          <Typography>Рамный слой не имеет свойств фурнитуры</Typography>
        </>
      )
    }
  </>;
}

LayerProps.propTypes = {
  layer: PropTypes.object.isRequired,
  ox: PropTypes.object.isRequired,
};
