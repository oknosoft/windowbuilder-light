/**
 * Возвращает шестисимвольный id продукции или заказа
 *
 * @module ids
 *
 * Created by Evgeniy Malyarov on 10.01.2019.
 */

import rnds from 'uuid/dist/rng-browser';

const symbols = '123456789ADEFJGKLMNQRSTUVXYZ';
let counter = 0;
let rnds16;

// случайное число с помощью Crypto
function random() {
  if(counter === 0) {
    rnds16 = rnds();
  }
  let rnd = rnds16[counter];
  counter++;
  if(counter > 15) {
    counter = 0;
  }
  return rnd / 255;
}

// случайное число в диапазоне
function randomInt(min = 0, max) {
  if(!max) {
    max = symbols.length - 1;
  }
  let res = Math.floor(random() * (max - min + 1)) + min;
  return res > max ? max : res;
}

// случайная строка идентификатора
export default function randomId() {
  let res = symbols[randomInt(9)];
  for(let i = 0; i < 5; i++) {
    let tmp = symbols[randomInt()];
    while (res.endsWith(tmp)){
      tmp = symbols[randomInt()];
    }
    res += tmp;
  }
  return res;
}
