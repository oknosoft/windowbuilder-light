import React from 'react';

export function ExportGCode(obj, $p) {
  const {wsql, utils, enm: {debit_credit_kinds}, cat: {nom: nomMgr}} = $p;

  return Promise.resolve(obj).then(({cuts, number_doc}) => {
    const noms = new Map();
    cuts.find_rows({record_kind: debit_credit_kinds.debit}, (row) => {
      if(row.dop.rez?.length) {
        if(!noms.has(row.nom)) {
          noms.set(row.nom, []);
        }
        noms.get(row.nom).push(row);
      }
    });
    for(const [nom, rows] of noms) {
      noms.set(nom, {
        name: `${number_doc}-${nom.article || nom.name}`,
        text: exportNom(nom, rows, number_doc),
      });
    }
    return Array.from(noms.values());
  })
    .then(noms => {
      for(const {name, text} of noms) {
        exportFile(name, text);
      }
    });
}

const glob = {flip: 'y'};

function exportNom(nom, rows, number_doc) {
  let text = '';
  for(const row of rows) {
    text += `%  Лист ${row.stick.pad(2)}, Задание ${number_doc}, ${nom.name}, ${row.len.round()}x${row.width.round()}\n`;
    text += `G90\nG71 T2 M6\nG54\nM90\nM91\n`;
    text += exportRows(nom, row.dop.rez);
  }

  return text;
}

function exportRows(nom, rows) {
  const max = {x: 0, y: 0};
  for(const {x1, y1, x2, y2} of rows) {
    if(x1 > max.x) {
      max.x = x1;
    }
    if(x2 > max.x) {
      max.x = x2;
    }
    if(y1 > max.y) {
      max.y = y1;
    }
    if(y2 > max.y) {
      max.y = y2;
    }
  }
  const border = {
    x: nom._extra('edgeLeft') || nom._extra('edgeRight') || 0,
    y: nom._extra('edgeBottom') || nom._extra('edgeTop') || 0,
  }
  let text = exportBorderX(border, max);
  glob.flip = 'y';
  for(const row of rows) {
    text += exportRez(row, border);
  }
  text += exportBorderY(border, max);
  return text;
}

function exportBorderX({x, y}, max) {
  return x > 0 ? `G04 F250\nG00 Z0 M-70\n${flipY()}G00 X${x} Y${y}\nG04 F100\nG01 Z1 M70\nG04 F250\nG01 Y${max.y + y}\n` : flipY();
}

function exportBorderY({x, y}, max) {
  let text = y > 0 ? `G04 F250\nG00 Z0 M-70\n${
    glob.flip !== 'x' ? flipX() : ''
  }G00 X${max.x} Y${y}\nG04 F100\nG01 Z1 M70\nG04 F250\nG01 X${x}\n` : '';
  text += `G00 Z0 M-70\nG00 X0 Y0\nG04 F100\nM94\n`;
  return text;
}

function flipY() {
  return 'G04 F200\nG00 A90\n'
}

function flipX() {
  return 'G04 F200\nG00 A0\n'
}

function exportRez(row, border) {
  let text = '';
  if(row.x1 === row.x2 && glob.flip !== 'y') {
    text += flipY();
    glob.flip = 'y';
  }
  else if(row.y1 === row.y2 && glob.flip !== 'x') {
    text += flipX();
    glob.flip = 'x';
  }
  text += `G04 F250\nG00 Z0 M-70\nG04 F200\nG00 X${
    row.x1 + border.x} Y${row.y1 + border.y}\nG04 F100\nG01 Z1 M70\nG04 F250\n`;
  if(row.x1 === row.x2) {
    text += `G01 Y${row.y2 + border.y}\n`;
  }
  else if(row.y1 === row.y2) {
    text += `G01 X${row.x2 + border.x}\n`;
  }
  else {
    text += `G01 X${row.x2 + border.x} Y${row.y2 + border.y}\n`;
  }
  return text;
}

function exportFile(name, text) {

  // Кодируем строку в UTF-8 байты
  //const utf8Bytes = new TextEncoder().encode(text);

  // Декодируем байты в кодировке Windows-1251
  const bytes = encodeCP1251(text);
  //const win1251String = new TextDecoder('windows-1251').decode(bytes);

  // Создаем файл и генерируем ссылку на него
  const fileName = `${name}.txt`;
  const blob = new File([bytes], fileName, { type: "text/plain; charset=windows-1251"});
  const url = URL.createObjectURL(blob);

  // Автоматически скачиваем файл
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

const cp1251 = `ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬*®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя`;
const isKyr = (str) => /[а-я]/i.test(str);
const encodeChar = (c) => isKyr(c) ? cp1251.indexOf(c) + 128 : c.charCodeAt(0);
function encodeCP1251(string) {
  const res = [];
  for (let i = 0; i < string.length; i++) {
    res.push(encodeChar(string.charAt(i))); //ну или string[i]
  }
  return new Uint8Array(res);
}

ExportGCode.ref = '019e7d75-e94e-7047-a052-114a137190e7';
ExportGCode.destination = 'doc.work_centers_task';
ExportGCode.title = 'Экспорт GCode';
ExportGCode.allowModified = true;
