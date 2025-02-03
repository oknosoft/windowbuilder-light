import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Dialog from '@oknosoft/ui/App/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import {Toolbar} from '../../aggregate/App/styled';
import {HtmlTooltip} from '../../aggregate/App/styled';
import TabularSection from '../../aggregate/TabularSection';

import {NumberFormatter} from '@oknosoft/ui/DataField/Number';
import {TextFormatter} from '@oknosoft/ui/DataField/Text';
import {PresentationFormatter} from '@oknosoft/ui/DataField/RefField';
const columns = [
  {key: "elm", name: "Элемент", width: 90, renderCell: TextFormatter},
  {key: "nom", name: "Номенклатура", renderCell: PresentationFormatter},
  {key: "clr", name: "Цвет", width: 120, renderCell: PresentationFormatter},
  {key: "len", name: "Длина", width: 90, renderCell: NumberFormatter},
  {key: "width", name: "Ширина", width: 90, renderCell: NumberFormatter},
  {key: "s", name: "Площадь", width: 90, renderCell: NumberFormatter},
  {key: "qty", name: "Штук", width: 90, renderCell: NumberFormatter},
  {key: "totqty", name: "Количество", width: 90, renderCell: NumberFormatter},
];

const tabContent = {
  Head({obj}) {

  },
  Composition({obj, tabRef}) {
    return <TabularSection obj={obj} tabRef={tabRef} ts="composition" columns={columns}/>;
  },
  Procedures({obj}) {

  }
}

export function SpecificationsObj({obj}) {

  const [tab, setTab] = React.useState('Composition');
  const handleChange = (event, newValue) => setTab(newValue);
  const tabRef = React.useRef(null);
  const Content = tabContent[tab];

  return <>
    <Tabs value={tab} onChange={handleChange}>
      <Tab value="Head" label="Реквизиты" />
      <Tab value="Composition" label="Состав" />
      <Tab value="Procedures" label="Операции" />
    </Tabs>
    <Box ref={tabRef} sx={{ width: 'calc(80vw)', p: 1 }}>
      <Content obj={obj} tabRef={tabRef}/>
    </Box>
  </>;

}

function dialogTitle(open, onClose) {
  return open ? <Toolbar disableGutters>
    Спецификация
    <Box sx={{ flex: 1}} />
    <IconButton onClick={onClose}><CloseIcon/></IconButton>
  </Toolbar> : null;
}

export function SpecificationsButton({project}) {
  const [open, setOpen] = React.useState(false);
  const onClose = () => setOpen(false);
  const calculate = () => {
    try {
      project.calculateSpec();
      setOpen(true);
    }
    catch (e) {
      project.root.ui.dialogs.alert({
        title: 'Ошибка при расчёте',
        text: e.message,
      })
    }
  }

  return <>
    <HtmlTooltip title="Спецификация">
      <IconButton onClick={calculate}><i className="fa fa-table" /></IconButton>
    </HtmlTooltip>
    <Dialog open={open} onClose={onClose} title={dialogTitle(open, onClose)} actions={[]} raw>
      <SpecificationsObj obj={open ? project.specification : null}/>
    </Dialog>
  </>;
}
