import React from 'react';
import Autocomplete from '@oknosoft/ui/DataField/Autocomplete';

export default function InsetProfileGrp({obj, fld, onChange, fullWidth=true, enterTab, ...other}) {

  const elm = obj[0];
  // если разные типы элементов
  const readOnly = obj.some(({elmType}) => elmType !== elm.elmType);

  const [value, setValue] = React.useState(readOnly ? 'Разные типы элементов' : elm.inset);

  const options = readOnly ? [value] : elm.layer.sys.inserts({elm});

  return <Autocomplete
    readOnly={readOnly}
    options={options}
    onChange={(event, newValue, reason, details) => {
      const {project} = elm;
      project.props.loading = true;
      for(const elm of obj) {
        elm.inset = newValue;
      }
      for(const elm of obj) {
        for(const cnnPoint of [elm.b, elm.e]) {
          const {cnns, cnnsOuter} = cnnPoint;
          if(cnns?.length && !cnns.includes(cnnPoint.cnn)) {
            cnnPoint.cnn = cnns[0];
          }
          if(cnnsOuter?.length && !cnnsOuter.includes(cnnPoint.cnnOuter)) {
            cnnPoint.cnnOuter = cnnsOuter[0];
          }
        }
      }
      project.props.loading = false;
      setValue(elm.inset);
      project.redraw();
    }}
    value={value}
    label="Материал"
    fullWidth={fullWidth}
    disableClearable
    placeholder="Нет"
    {...other}
  />;
}
