import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddBoxOutlined';
import CopyIcon from '@mui/icons-material/PostAdd';
import EditIcon from '@mui/icons-material/DriveFileRenameOutline';
import {useNavigate} from 'react-router-dom';
import {Toolbar, HtmlTooltip} from '../../../components/App/styled';

export default function ListToolbar({selectedRows, mgr}) {
  const navigate = useNavigate();
  const create = () => {
    mgr.create().then(({ref}) => navigate(ref));
  };
  const clone = async () => {
    if(selectedRows.size) {
      const proto = mgr.get(Array.from(selectedRows)[0]);
      if(proto.is_new()) {
        await proto.load();
      }
      mgr.clone(proto.toJSON()).then(({ref}) => navigate(ref));
    }
    else {
      //dialogs.alert({title: 'Форма объекта', text: 'Не указана текущая строка'});
    }
  };
  const open = () => {
    if(selectedRows.size) {
      navigate(Array.from(selectedRows)[0]);
    }
    else {
      //dialogs.alert({title: 'Форма объекта', text: 'Не указана текущая строка'});
    }
  };
  return <Toolbar disableGutters>
    <HtmlTooltip title="Создать документ">
      <IconButton onClick={create}><AddIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Создать документ копированием текущего">
      <IconButton onClick={clone}><CopyIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Изменить документ">
      <IconButton onClick={open}><EditIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>;
}
