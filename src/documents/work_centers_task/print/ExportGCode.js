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
    .then(async files => {
      for(const {name, text} of files) {
        const link = exportFile(name, text);
        await utils.sleep(100);
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
    });
}

const glob = {

  start(nom, len, width) {
    this.flip = 'y';
    this.p1 = {};
    this.p2 = {};
    this.posUp = true;
    this.borderYExported = false;

    this.border = {
      x: nom._extra('edgeLeft') || nom._extra('edgeRight') || 0,
      y: nom._extra('edgeBottom') || nom._extra('edgeTop') || 0,
      x1: nom._extra('edgeRight') || 0,
      y1: nom._extra('edgeTop') || 0,
    }
    if(!this.border.x1) {
      this.border.x1 = 5;
    }
    if(!this.border.y1) {
      this.border.y1 = 5;
    }

    this.max = {
      x: len,
      y: width,
      mx: len - this.border.x1,
      my: width - this.border.y1,
    };

    return `G90\nM100\nT2 M6\nM-70\nG00 A90\n`;
  },

  fin() {
    return `${this.up()}G00 X0 Y0\nM94\nM30`;
  },

  flipY() {
    if(this.flip !== 'y') {
      this.flip = 'y';
      return `${this.up()}G00 A90\n`;
    }
    return '';
  },

  flipX() {
    if(this.flip !== 'x') {
      this.flip = 'x';
      return `${this.up()}G00 A0\n` + this.borderY();
    }
    return '';
  },

  up() {
    if(!this.posUp) {
      this.posUp = true;
      return 'M-70\n';
    }
    return '';
  },

  down() {
    if(this.posUp) {
      this.posUp = false;
      return 'M70\n';
    }
    return '';
  },

  borderY() {
    const {max, border: {x, y, x1, y1}} = this;
    if(y > 0 && !this.borderYExported) {
      this.borderYExported = true;
      return `${this.up()}G00 X${max.x - x1} Y${y}\n${this.down()}G01 X1\n`;
    }
    return '';
  },

  borderX() {
    const {max, border: {x, y, x1, y1}} = this;
    const text = this.flipY();
    if(x > 0) {
      this.p2 = {x, y: max.y - y1};
      return text + `G00 X${x} Y1\n${this.down()}G01 Y${this.p2.y}\n`;
    }
    return text;
  },

};

function exportNom(row, number_doc) {
  const {nom, stick, len, width, dop} = row;
  let text = `;  Лист ${stick.pad(2)}, Задание ${number_doc}, ${nom.name}, ${len.round()}x${width.round()}\n`;
  text += glob.start(nom, len, width);
  text += exportRows(dop.rez);
  text += glob.fin()
  return text;
}

function exportRows(rows) {
  let text = glob.borderX();
  for(const row of rows) {
    text += exportRez(row);
  }
  return text;
}

function exportRez(row) {
  let text = '';
  let p1, p2;
  const {border: {x, y}, max: {mx, my}} = glob;
  if(row.x1 === row.x2) {
    // вертикальные резы
    text += glob.flipY();
    // сверху вниз
    if(row.y1 > row.y2) {
      p1 = {x: row.x1 + x, y: row.y1 + y - 1};
      p2 = {x: row.x2 + x, y: row.y2 ? row.y2 + y + 1 : 1};
    }
    // снизу вверх
    else {
      p1 = {x: row.x1 + x, y: row.y1 ? row.y1 + y + 1 : 1};
      p2 = {x: row.x2 + x, y: row.y2 + y - 1};
    }
  }
  else if(row.y1 === row.y2) {
    // горизонтальные резы
    text += glob.flipX();
    // справа налево
    if(row.x1 > row.x2) {
      p1 = {x: row.x1 + x - 1, y: row.y1 + y};
      p2 = {x: row.x2 + x + 1, y: row.y2 + y};
    }
    // слева направо
    else {
      p1 = {x: row.x1 + x + 1, y: row.y1 + y};
      p2 = {x: row.x2 + x - 1, y: row.y2 + y};
    }
  }
  if(p1.x > mx) {
    p1.x = mx;
  }
  if(p2.x > mx) {
    p2.x = mx;
  }
  if(p1.y > my) {
    p1.y = my;
  }
  if(p2.y > my) {
    p2.y = my;
  }

  if(p1.x !== glob.p2.x && p1.y !== glob.p2.y) {
    text += `${glob.up()}G00 X${p1.x} Y${p1.y}\n`;
  }
  else if(p1.x !== glob.p2.x) {
    text += `${glob.up()}G00 X${p1.x}\n`;
  }
  else if(p1.y !== glob.p2.y) {
    text += `${glob.up()}G00 Y${p1.y}\n`;
  }

  if(row.x1 === row.x2 && p2.y !== p1.y) {
    text += `${glob.down()}G01 Y${p2.y}\n`;
  }
  else if(row.y1 === row.y2 && p2.x !== p1.x) {
    text += `${glob.down()}G01 X${p2.x}\n`;
  }
  else {
    text += `M70\G01 X${row.x2 + x} Y${row.y2 + y}\n`;
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
  return link;
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
