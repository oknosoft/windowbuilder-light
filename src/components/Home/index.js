import React from 'react';
import Autocomplete from '../DataField/Autocomplete';

// Диаграммы заказов за неделю-месяц в сравнении с прошлыми периодами

const options = [{name: 'The Godfather', ref: 0}, {name: 'Pulp Fiction', ref: 1}];
export default function HomeView() {

  const [value, setValue] = React.useState(options[0]);
  const onChange = (event, value, reason, details) => {
    setValue(value);
  };
  return <Autocomplete options={options} value={value} onChange={onChange} label="Заголовок"/>;
}
