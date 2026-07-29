import React from 'react';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import WarehouseIcon from '@mui/icons-material/WarehouseOutlined';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {HtmlTooltip} from '../../aggregate/App/styled';

const {CatNom, job_prm, utils, ui, adapters} = $p;

function selectNom() {
  const list = job_prm.nom.glass._children()
    .filter(({is_pieces, is_procedure, is_service, cutting_optimization_type}) => {
      return !is_pieces && !is_procedure && !is_service &&
        !cutting_optimization_type.empty() && !cutting_optimization_type.is('Нет');
    })
    .sort(utils.sort('name'));
  return ui.dialogs.alert({
    title: `Укажите номенклатуру`,
    Component: NomList,
    props: {list},
    raw: true,
    //initFullScreen: true,
    //large: true,
    //timeout: 10e6,
  });
  // return ui.dialogs.input_value({
  //   title: `Укажите номенклатуру`,
  //   list,
  // });
}

function NomList({handleOk, list}) {
  const [nom, setNom] = React.useState(null)
  return <>
    <DialogContent>
      <List>
        {
          list.map(v => <ListItemButton
            selected={nom === v}
            onClick={() => setNom(v)}
            onDoubleClick={() => handleOk(v)}
          >
            <ListItemText primary={v.name} />
          </ListItemButton>)
        }
      </List>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => handleOk(nom)}>Ок</Button>
    </DialogActions>
  </>;
}

export default function BtnFill({obj, setBackdrop}) {

  const fill = () => {
    if(obj.posted) {
      return ui.dialogs.alert({
        title: 'Документ проведён',
        text: 'Перед заполнением остатками, отмените проведение документа',
      });
    }
    selectNom()
      .then((v) => {
        if(v instanceof CatNom) {
          if(obj.materials.find({nom: v})) {
            return ui.dialogs.alert({
              title: 'Номенклатура уже есть в документе',
              text: 'Дополнить остатками?',
            })
              .then((err) => {
                if(!err) {
                  return v;
                }
              });
          }
          return v;
        }
      })
      .then(v => {
        setBackdrop(true);
        return adapters.pouch
          .fetch('/adm/api/pgsql/cuts', {
            method: 'POST',
            body: JSON.stringify({nom: [v.ref]}),
          })
          .then(res => res.json())
          .then(({rows}) => {
            for(const row of rows) {
              obj.materials.add({
                nom: row.nom,
                len: parseFloat(row.len),
                width: parseFloat(row.width),
                qty: parseFloat(row.qty),
                quantity: parseFloat(row.quantity),
              });
            }
            setBackdrop(false);
          });
      })
      .catch(() => setBackdrop(false));
  };
  return <>
    <Divider orientation="vertical" flexItem sx={{m: 1}} />
    <HtmlTooltip title="Добавить из остатков">
      <IconButton onClick={fill}><WarehouseIcon/></IconButton>
    </HtmlTooltip>
  </>;
}
