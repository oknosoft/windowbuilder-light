import React from 'react';
import Typography from '@mui/material/Typography';
import GroupedProductsTabular from './GroupedProductsTabular';

export function GroupedProducts(props) {
  const {attr, obj, print} = props;
  const page = [<Typography key="title" variant="h5">{obj.presentation}</Typography>]
  const fake = obj._manager.create(null, false, true);
  fake.cutting.load(obj.cutting, false);
  fake.cutting.group_by(['nom'], []);
  const noms = fake.cutting.unload_column('nom');
  for(const nom of noms) {
    page.push(<div key={nom.ref} style={{margin: 8}}>
      <Typography key="title" variant="h6">{nom.name}</Typography>
      <GroupedProductsTabular nom={nom} obj={obj}/>
    </div>);
  }
  fake.unload();

  React.useEffect(() => {
    setTimeout(print, 100);
  }, []);
  return page;
}

GroupedProducts.ref = '7d116d90-29bc-11f0-bf4b-21bb35fe82a7';
GroupedProducts.destination = 'doc.work_centers_task';
GroupedProducts.title = 'Изделия с группировкой';
