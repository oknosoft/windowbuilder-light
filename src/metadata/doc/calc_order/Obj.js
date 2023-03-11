import React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import {useParams, useNavigate} from 'react-router-dom';
import {useTitleContext} from '../../../components/App';

const title = {title: 'Расчёт-заказ', appTitle: <Typography variant="h6" noWrap>Расчёт-заказ</Typography>};
export default function CalcOrderObj() {

  const [obj, setObj] = React.useState(null);
  const [error, setError] = React.useState(null);

  const params = useParams();
  const {setTitle} = useTitleContext();


  React.useEffect(() => {
    const {ref} = params;
    setTitle(title);
  }, []);

  return <List>
    <ListSubheader>
      Toolbar документа
    </ListSubheader>
    <ListItem>
      Шапка
    </ListItem>
    <ListSubheader>
      Варианты табчасти
    </ListSubheader>
    <ListItem>
      Табчасть
    </ListItem>
  </List>;
}
