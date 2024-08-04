import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function getStyles(curr, value, theme) {
  return {
    fontWeight: value === curr ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular,
  };
}

export default function FieldCnnType({CnnPoint}) {
  const theme = useTheme();
  const {vertex} = CnnPoint;
  const {cnnType, cnnTypes} = vertex;
  const [index, setIndex] = React.useState(0);

  const handleChange = ({target}) => {
    vertex.cnnType = target.value;
    setIndex(index + 1);
  };

  return <FormControl fullWidth>
    <InputLabel>{`Тип соедин (${vertex.value})`}</InputLabel>
    <Select
      displayEmpty
      value={cnnType}
      onChange={handleChange}
      input={<OutlinedInput />}
      renderValue={(curr) => {
        return curr.empty() ? <em>Не задан</em> : curr.synonym;
      }}
    >
      <MenuItem disabled value={null}>
        <em>Доступные типы</em>
      </MenuItem>
      {cnnTypes.map((curr) => (
        <MenuItem
          key={curr.valueOf()}
          value={curr}
          style={getStyles(curr, cnnType, theme)}
        >
          {curr.synonym}
        </MenuItem>
      ))}
    </Select>
  </FormControl>;
}
