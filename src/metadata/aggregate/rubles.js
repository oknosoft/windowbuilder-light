(function() {
  const words = [
    [
      '', 'один', 'два', 'три', 'четыре', 'пять', 'шесть',
      'семь', 'восемь', 'девять', 'десять', 'одиннадцать',
      'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать',
      'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'
    ],
    [
      '', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят',
      'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'
    ],
    [
      '', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот',
      'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'
    ]
  ];

  const wordsUk = [
    [
      '', 'одна', 'дві', 'три', 'чотири', "п'ять", 'шість',
      'сім', 'вісім', "дев'ять", 'десять', 'одинадцять',
      'дванадцять', 'тринадцять', 'чотирнадцять', "п'ятнадцать",
      'шістнадцять', 'сімнадцять', 'вісімнадцять', "дев'ятнадцять"
    ],
    [
      '', '', 'двадцять', 'тридцять', 'сорок', "п'ятдесят",
      'шістдесят', 'сімдесят', 'вісімдесят', "дев'яносто"
    ],
    [
      '', 'сто', 'двісті', 'триста', 'чотириста', "п'ятсот",
      'шістсот', 'сімсот', 'вісімсот', "дев'ятсот"
    ]
  ];

  const rusRubles = ['рубль', 'рубля', 'рублей'];

  const belRubles = ['белорусский рубль', 'белорусских рубля', 'белорусских рублей'];

  const ukRubles = ['гривня', 'гривні', 'гривень'];

  const toFloat = function(number) {
    return parseFloat(number);
  };

  const plural = function(count, options) {
    if (options.length !== 3) {
      return false;
    }

    count = Math.abs(count) % 100;
    const rest = count % 10;

    if (count > 10 && count < 20) {
      return options[2];
    }

    if (rest > 1 && rest < 5) {
      return options[1];
    }

    if (rest === 1) {
      return options[0];
    }

    return options[2];
  };

  const parseNumber = function(number, count, currCode) {
    let first;
    let second;
    let numeral = '';
    let localizedWords;
    let locReplace = [{from:"один", to:"одна"},{from:"два", to:"дві"}];
    let loc1000 = ['тисяча ', 'тисячі ', 'тисяч '];
    let loc1000000 = ['мільйон ', 'мільйона ', 'мільйонів '];
    let loc1000000000 = ['мільярд ', 'мільярда ', 'мільярдів '];

    localizedWords = currCode==="UAH" ? wordsUk : words;

    if (number.length === 3) {
      first = number.substr(0, 1);
      number = number.substr(1, 3);
      numeral = '' + localizedWords[2][first] + ' ';
    }

    if (number < 20) {
      numeral = numeral + localizedWords[0][toFloat(number)] + ' ';
    } else {
      first = number.substr(0, 1);
      second = number.substr(1, 2);
      numeral = numeral + localizedWords[1][first] + ' ' + localizedWords[0][second] + ' ';
    }

    if (count === 0) {
      switch (currCode) {
        case 'BYN': {
          numeral = numeral + plural(number, belRubles);
          break;
        }
        case 'UAH': {
          numeral = numeral + plural(number, ukRubles);
          locReplace = [{from:"один", to:"одна"}, {from:"два", to:"дві"}];
          loc1000 = ['тисяча ', 'тисячі ', 'тисяч '];
          loc1000000 = ['мільйон ', 'мільйона ', 'мільйонів '];
          loc1000000000 = ['мільярд ', 'мільярда ', 'мільярдів '];
          break;
        }
        case 'RU':  {
          numeral = numeral + plural(number, rusRubles);
          locReplace = [{from:"один", to:"одна"}, {from:"два", to:"дві"}];
          loc1000 = ['тысяча ', 'тысячи ', 'тысяч '];
          loc1000000 = ['миллион ', 'миллиона ', 'миллионов '];
          loc1000000000 = ['миллиард ', 'миллиарда ', 'миллиардов '];
          break;
        }
        default: {
          numeral = numeral + plural(number, ukRubles);
        }
      }
    } else if (count === 1) {
      if (numeral !== '  ') {
        numeral = numeral + plural(number, loc1000);
        locReplace.forEach(item=> numeral = numeral.replace(item.from,item.to));
      }
    } else if (count === 2) {
      if (numeral !== '  ') {
        numeral = numeral + plural(number, loc1000000);
      }
    } else if (count === 3) {
      numeral = numeral + plural(number, loc1000000000);
    }

    return numeral;
  };

  var parseDecimals = function (number, curr) {
    let text = curr === 'UAH' ? plural(number, ['копійка', 'копійки', 'копійок']) : plural(number, ['копейка', 'копейки', 'копеек']);

    if (number === 0) {
      number = '00';
    } else if (number < 10) {
      number = '0' + number;
    }

    return ' ' + number + ' ' + text;
  };

  var rubles = function(number, currCode) {
    if (!number) {
      return false;
    }

    if (!currCode) {
      if(navigator.languages && navigator.languages[0].includes('ru') || navigator.language && navigator.language.includes('ru')) {
        currCode = 'RU';
      }
      else {
        currCode = 'UAH';
      }
    }

    var type = typeof number;
    if (type !== 'number' && type !== 'string') {
      return false;
    }

    if (type === 'string') {
      number = toFloat(number.replace(',', '.'));

      if (isNaN(number)) {
        return false;
      }
    }

    if (number <= 0) {
      return false;
    }

    var splt;
    var decimals;

    number = number.toFixed(2);
    if (number.indexOf('.') !== -1) {
      splt = number.split('.');
      number = splt[0];
      decimals = splt[1];
    }

    var numeral = '';
    var length = number.length - 1;
    var parts = '';
    var count = 0;
    var digit;

    while (length >= 0) {
      digit = number.substr(length, 1);
      parts = digit + parts;

      if ((parts.length === 3 || length === 0) && !isNaN(toFloat(parts))) {
        numeral = parseNumber(parts, count, currCode) + numeral;
        parts = '';
        count++;
      }

      length--;
    }

    numeral = numeral.replace(/\s+/g, ' ');

    if (decimals) {
      numeral = numeral + parseDecimals(toFloat(decimals), currCode);
    }

    return numeral;
  };

  Number.prototype.in_words = function(lang) {
    return rubles(Number(this), lang);
  };

})();
