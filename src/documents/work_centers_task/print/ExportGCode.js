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
    const num = number_doc.slice(-4);
    const files = [];
    for(const [nom, rows] of noms) {
      for(const row of rows) {
        files.push({
          name: `${num}-${(nom.article || nom.name).replace(/\s/g, '-')}-${row.stick.pad(2)}`,
          text: exportNom(row, num),
        });
      }
      //break;
    }
    return files;
  })
    .then(files => {
      for(const {name, text} of files) {
        exportFile(name, text);
      }
    });
}

const glob = {flip: 'y', p1: {}, p2: {}};

function exportNom(row, number_doc) {
  const {nom, stick, len, width, dop} = row;
  let text = `;  Лист ${stick.pad(2)}, Задание ${number_doc}, ${nom.name}, ${len.round()}x${width.round()}\n`;
  text += `G90\nM100\nT2 M6\nM-70\nG00 A90\n`;
  text += exportRows(nom, dop.rez, len, width);

  return text;
}

function exportRows(nom, rows, len, width) {
  const max = {x: width, y: len};
  // for(const {x1, y1, x2, y2} of rows) {
  //   if(x1 > max.x) {
  //     max.x = x1;
  //   }
  //   if(x2 > max.x) {
  //     max.x = x2;
  //   }
  //   if(y1 > max.y) {
  //     max.y = y1;
  //   }
  //   if(y2 > max.y) {
  //     max.y = y2;
  //   }
  // }
  const border = {
    x: nom._extra('edgeLeft') || nom._extra('edgeRight') || 0,
    y: nom._extra('edgeBottom') || nom._extra('edgeTop') || 0,
    x1: nom._extra('edgeRight') || 0,
    y1: nom._extra('edgeTop') || 0,
  }
  if(border.x > 10) {
    border.x -= 2;
  }
  if(border.y > 10) {
    border.y -= 2;
  }
  glob.flip = 'y';
  let text = exportBorderX(border, max);
  for(const row of rows) {
    text += exportRez(row, border);
  }
  text += exportBorderY(border, max);
  return text;
}

function exportBorderX({x, y, x1, y1}, max) {
  return x > 0 ? `${flipY()}G00 X${x} Y1\nM70\nG01 Y${max.y - 1}\n` : flipY();
}

function exportBorderY({x, y}, max) {
  let text = y > 0 ? `M-70\n${flipX()}G00 X${max.x - 1} Y${y}\nM70\nG01 X1\n` : '';
  text += `M-70\nG00 X0 Y0\nM94\nM30`;
  return text;
}

function flipY() {
  if(glob.flip !== 'y') {
    glob.flip = 'y';
    return 'M-70\nG00 A90\n';
  }
  return '';
}

function flipX() {
  if(glob.flip !== 'x') {
    glob.flip = 'x';
    return 'M-70\nG00 A0\n';
  }
  return '';
}

function exportRez(row, border) {
  let text = '';
  let p1, p2;
  if(row.x1 === row.x2) {
    // вертикальные резы
    text += flipY();
    // сверху вниз
    if(row.y1 > row.y2) {
      p1 = {x: row.x1 + border.x, y: row.y1 + border.y - 1};
      p2 = {x: row.x2 + border.x, y: row.y2 + border.y + 1};
    }
    // снизу вверх
    else {
      p1 = {x: row.x1 + border.x, y: row.y1 + border.y + 1};
      p2 = {x: row.x2 + border.x, y: row.y2 + border.y - 1};
    }
  }
  else if(row.y1 === row.y2) {
    // горизонтальные резы
    text += flipX();
    // справа налево
    if(row.x1 > row.x2) {
      p1 = {x: row.x1 + border.x - 1, y: row.y1 + border.y};
      p2 = {x: row.x2 + border.x + 1, y: row.y2 + border.y};
    }
    // слева направо
    else {
      p1 = {x: row.x1 + border.x + 1, y: row.y1 + border.y};
      p2 = {x: row.x2 + border.x - 1, y: row.y2 + border.y};
    }
  }

  if(p1.x !== glob.p2.x && p1.y !== glob.p2.y) {
    text += `M-70\nG00 X${p1.x} Y${p1.y}\n`;
  }
  else if(p1.x !== glob.p2.x) {
    text += `M-70\nG00 X${p1.x}\n`;
  }
  else if(p1.y !== glob.p2.y) {
    text += `M-70\nG00 Y${p1.y}\n`;
  }

  if(row.x1 === row.x2 && p2.y !== p1.y) {
    text += `M70\nG01 Y${p2.y}\n`;
  }
  else if(row.y1 === row.y2 && p2.x !== p1.x) {
    text += `M70\nG01 X${p2.x}\n`;
  }
  else {
    text += `M70\G01 X${row.x2 + border.x} Y${row.y2 + border.y}\n`;
  }
  Object.assign(glob, {p1, p2});
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
