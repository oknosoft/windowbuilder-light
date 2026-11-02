import React from 'react';
import Dialog from 'metadata-ui/App/Dialog';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import AddLinkIcon from '@mui/icons-material/AddLink';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import {Toolbar, HtmlTooltip} from '../App/styled';
import {alert} from './ObjToolbar';

export function AttachmentsDialog({obj, open, setClose}) {

  const [selected, setSelected] = React.useState('');
  const inputRef = React.createRef();

  function handleSelect(name) {
    setSelected(name);
  }

  function handleDownload(name) {
    if(obj?._attachments[name]?.content_type === 'application/internet-shortcut') {
      setClose();
      return obj.get_attachment(name, 1);
    }
    const url = `${obj._manager.pouch_db.name}/${obj.class_name}|${obj.ref}/${name}`;
    window.open(url, '_blank');
  }

  function handleDelete() {
    $p.ui.dialogs.alert({
      title: 'Удалить вложение?',
      text: `Подтвердите удаление файла '${selected}'`,
    })
      .then(async (e) => {
        if(!e && selected) {
          await obj.delete_attachment(selected);
          setSelected('');
          setClose();
        }
      })
      .catch(e => null);
  }

  function handleUpload(e) {
    inputRef.current?.showPicker(e);
  }

  function handleFileChange({target}) {
    if(target.files.length) {
      const {utils, job_prm, msg, ui} = $p;

      if(obj._modified) {
        throw new Error('Перед добавлением вложения, запишите документ');
      }
      let res;
      (utils.mime_lookup ? Promise.resolve() : import('metadata-core/lib/mime.min').then((module) => {
        module.default.constructor.call($p);
      }))
        .then(() => {
          let file;
          for(let i = 0; i < target.files.length; i++) {
            file = target.files[i];
            if(file.size > job_prm.attachment_max_size) {
              throw new Error(msg.file_size + (job_prm.attachment_max_size / 1000000).round() + 'Mb');
            }
            if(res) {
              res = res.then(() => obj.save_attachment(file.name, file, utils.mime_lookup(file.name.substring(file.name.lastIndexOf('.') + 1))));
            }
            else {
              res = obj.save_attachment(file.name, file, utils.mime_lookup(file.name.substring(file.name.lastIndexOf('.') + 1)));
            }
          }
          return res ? res
            .then(() => obj.load())
            .then(() => file.name): '';
        })
        .then((name) => setSelected(name))
        .catch((err) => {
          ui.dialogs.alert({
            title: 'Ошибка записи',
            text: err?.message || err,
          });
        });
    }
  }


  return <Dialog open={open} onClose={setClose} onOk={setClose} maxWidth="lg" title="Вложения">
    <AttachmentsToolbar selected={selected} handleDownload={handleDownload} handleUpload={handleUpload} handleDelete={handleDelete}/>
    <AttachmentsList obj={obj} handleSelect={handleSelect} handleDownload={handleDownload} />
    <input ref={inputRef} type="file" onChange={handleFileChange} style={{display: 'none'}} />
  </Dialog>;
}

function AttachmentsList ({obj, handleSelect, handleDownload}) {
  const list = [];
  if(obj._attachments){
    for(const name in obj._attachments) {
      const att = obj._attachments[name];
      const dot = name.lastIndexOf('.');
      list.push(
        <MenuItem key={name}
                  onClick={() => handleSelect(name)}
                  onDoubleClick={() => handleDownload(name)}
        >
          <ListItemIcon><Avatar>{name.substring(dot + 1)}</Avatar></ListItemIcon>
          <ListItemText inset
                        primary={name.substring(0, dot)}
                        secondary={`${(att.length/1000).round(2)}Kb, ${att.content_type}`}
          />
        </MenuItem>
      );
    }
  }
  else {
    list.push(
      <MenuItem key="empty">
        <ListItemIcon><Avatar>X</Avatar></ListItemIcon>
        <ListItemText>Нет вложенных файлов</ListItemText>
      </MenuItem>
    );
  }

  return <MenuList>{list}</MenuList>;
}


function AttachmentsToolbar({selected, handleDownload, handleUpload, handleDelete}) {
  return <Toolbar disableGutters>
    <HtmlTooltip title="Добавить файл">
      <IconButton onClick={handleUpload}><UploadIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Добавить ссылку">
      <IconButton onClick={null}><AddLinkIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Скачать файл">
      <IconButton disabled={!selected} onClick={() => handleDownload(selected)}><DownloadIcon/></IconButton>
    </HtmlTooltip>
    <HtmlTooltip title="Удалить вложение">
      <IconButton disabled={!selected} onClick={handleDelete}><DeleteIcon/></IconButton>
    </HtmlTooltip>
  </Toolbar>;
}

