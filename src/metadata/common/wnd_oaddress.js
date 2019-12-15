/**
 * Поле ввода адреса связанная с ним форма ввода адреса
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2018
 *
 * @module  wnd_oaddress
 */

/* global google */

export default function ($p) {

  function get_aatributes(ca){
    if(ca.attributes && ca.attributes.length == 2){
      return {[ca.attributes[0].value]: ca.attributes[1].value};
    }
  }

  class WndAddressData {

    constructor(owner){
      this.owner = owner;
      this.country = "Россия";
      this.region = "";
      this.city = "";
      this.street =	"";
      this.postal_code = "";
      this.marker = null;
      this.poly_area = null;
      this.poly_direction = null;
      this.flat = "";

      this._house = "";
      this._housing = "";

      // если координаты есть в Расчете, используем их
      const {coordinates} = this;
      this.latitude = coordinates.length ? coordinates[0] : 0;
      this.longitude = coordinates.length ? coordinates[1] : 0;
    }

    get delivery_area() {
      return this.owner.obj.delivery_area;
    }
    set delivery_area(v) {
      this.owner.pgrid_on_select(v);
    }

    get house() {
      return this._house + (this._housing ? " " + this._housing : "");
    }
    set house(v) {
      this._house = v;
    }

    get coordinates() {
      const {latitude, longitude, owner: {obj}} = this;
      const {coordinates} = obj;
      return coordinates ? JSON.parse(coordinates) : (latitude && longitude ? [latitude, longitude] : []);
    }

    init_map(map, position) {
      const {maps} = window.google || {};
      if(maps) {
        this.marker = new maps.Marker({
          map,
          draggable: true,
          animation: maps.Animation.DROP,
          position
        });
        this.poly_area = new maps.Polygon(
          {
            map,
            strokeColor     : '#80aa80',
            strokeOpacity   : 0.4,
            strokeWeight    : 2,
            fillColor       : "#c0d0e0",
            fillOpacity     : 0.3,
            geodesic        : true
          });
        this.poly_direction = new maps.Polygon(
          {
            map,
            strokeColor     : '#aa80ff',
            strokeOpacity   : 0.4,
            strokeWeight    : 1,
            fillColor       : "#ccaaff",
            fillOpacity     : 0.2,
            geodesic        : true
          });
        this.refresh_coordinates();
        this._marker_toggle_bounce = maps.event.addListener(this.marker, 'click', this.marker_toggle_bounce.bind(this));
        this._marker_dragend = maps.event.addListener(this.marker, 'dragend', this.marker_dragend.bind(this));
      }
    }

    ulisten() {
      const {maps} = window.google || {};
      if(maps) {
        maps.event.removeListener(this._marker_toggle_bounce);
        maps.event.removeListener(this._marker_dragend);
      }
    }

    /**
     * Сворачивает все поля адреса в строку
     * @return {string}
     */
    assemble_addr(with_flat){
      const {region, city, street, house, flat} = this;
      const res = (region && region !== city ? (region + ', ') : '') +
        (city ? (city + ', ') : '') +
        (street ? (street.replace(/,/g, ' ') + ', ') : '') +
        (house ? (house + ', ') : '') +
        (with_flat && flat ? (flat + ', ') : '');
      return res.endsWith(', ') ? res.substr(0, res.length - 2) : res;
    }

    /**
     * Устанавливает поля адреса в документе
     */
    assemble_address_fields(without_flat){

      const {fias} = WndAddressData;
      const {obj} = this.owner;
      const v = this;

      obj.shipping_address = this.assemble_addr(!without_flat);

      let fields = '<КонтактнаяИнформация  \
				xmlns="http://www.v8.1c.ru/ssl/contactinfo" \
				xmlns:xs="http://www.w3.org/2001/XMLSchema" \
				xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"   \
				Представление="%1">   \
					<Комментарий/>  \
					<Состав xsi:type="Адрес" Страна="РОССИЯ">   \
						<Состав xsi:type="АдресРФ">'.replace('%1', obj.shipping_address);

      if(v.region){
        fields += '\n<СубъектРФ>' + v.region + '</СубъектРФ>';
      }

      if(v.city){
        if(v.city.indexOf('г.') != -1 || v.city.indexOf('г ') != -1 || v.city.indexOf(' г') != -1)
          fields += '\n<Город>' + v.city + '</Город>';
        else
          fields += '\n<НаселПункт>' + v.city + '</НаселПункт>';
      }

      if(v.street){
        fields += '\n<Улица>' + (v.street.replace(/,/g," ")) + '</Улица>';
      }

      let index, house_type, flat_type;

      let house = v.house;
      if(house){
        // отделяем улицу от дома, корпуса и квартиры
        for(let i in fias){
          if(fias[i].type == 1){
            for(let syn of fias[i].syn){
              if((index = house.indexOf(syn.trimLeft())) != -1){
                house_type = i;
                house = house.substr(index + syn.trimLeft().length).trim();
                break;
              }
            }
            if(house_type)
              break;
          }
        }
        if(!house_type){
          house_type = "1010";
          if((index = house.indexOf(" ")) != -1){
            house = house.substr(index);
          }
        }
        fields += '\n<ДопАдрЭл><Номер Тип="' + house_type +  '" Значение="' + house.trim() + '"/></ДопАдрЭл>';
      }

      // квартира и тип квартиры (офиса)
      let flat = v.flat;
      if(flat){
        for(let i in fias){
          if(fias[i].type == 3){
            for(let syn of fias[i].syn){
              if((index = flat.indexOf(syn)) != -1){
                flat_type = i;
                flat = flat.substr(index + syn.length);
                break;
              }
            }
            if(flat_type)
              break;
          }
        }
        if(!flat_type){
          flat_type = "2010";
          if((index = flat.indexOf(" ")) != -1){
            flat = flat.substr(index);
          }
        }
        fields += '\n<ДопАдрЭл><Номер Тип="' + flat_type +  '" Значение="' + flat.trim() + '"/></ДопАдрЭл>';
      }

      if(v.postal_code)
        fields += '<ДопАдрЭл ТипАдрЭл="10100000" Значение="' + v.postal_code + '"/>';

      fields += '</Состав> \
					</Состав></КонтактнаяИнформация>';

      obj.address_fields = fields;
    }

    /**
     * обновляет текст координат и полигоны
     * @param [wnd]
     * @param [latitude]
     * @param [longitude]
     */
    refresh_coordinates(latitude, longitude){
      const v = this;
      const {wnd} = this.owner;
      if(latitude && longitude) {
        v.latitude = latitude;
        v.longitude = longitude;
      }
      // если форма уже существует
      if(wnd && wnd.elmnts && wnd.elmnts.map) {
        v.latitude && wnd.elmnts.toolbar.setValue('coordinates', `${v.latitude.toFixed(8)} ${v.longitude.toFixed(8)}`);
        // перерисовывает полигоны
        const {delivery_area, poly_area, poly_direction} = v;
        const {LatLng} = google.maps;
        for(const poly of [poly_area, poly_direction]) {
          poly.getPath().clear();
        }
        if(delivery_area.coordinates.count() > 2) {
          poly_area.setPath(delivery_area.coordinates._obj.map((v) => new LatLng(v.latitude, v.longitude)));
        }
        $p.cat.delivery_directions.forEach(({composition, coordinates}) => {
          if(composition.find({elm: delivery_area})) {
            poly_direction.setPath(coordinates._obj.map((v) => new LatLng(v.latitude, v.longitude)));
            return false;
          }
        });
      }
    }

    /**
     * Заполняет структуру адреса v по данным полей адреса документа
     * @return {Promise.<TResult>}
     */
    process_address_fields(){

      const v = this;
      const {obj} = this.owner;
      const {fias} = WndAddressData;

      if(obj.address_fields){
        v.xml = ( new DOMParser() ).parseFromString(obj.address_fields, "text/xml");
        let tmp = {}, res = {},
          nss = "СубъектРФ,Округ,СвРайМО,СвРайМО,ВнутригРайон,НаселПункт,Улица,Город,ДопАдрЭл,Адрес_по_документу,Местоположение".split(",");

        for(let i in nss){
          tmp[nss[i]] = v.xml.getElementsByTagName(nss[i]);
        }
        for(let i in tmp){
          for(let j in tmp[i]){
            if(j == 'length' || !tmp[i].hasOwnProperty(j)) {
              continue;
            }
            const tattr = get_aatributes(tmp[i][j]);
            if(tattr){
              if(!res[i])
                res[i] = [];
              res[i].push(tattr);
            }
            else if(tmp[i][j].childNodes.length){
              for(let k in tmp[i][j].childNodes){
                if(k == 'length' || !tmp[i][j].childNodes.hasOwnProperty(k)) {
                  continue;
                }
                const tattr = get_aatributes(tmp[i][j].childNodes[k]);
                if(tattr){
                  if(!res[i])
                    res[i] = [];
                  res[i].push(tattr);
                }else if(tmp[i][j].childNodes[k].nodeValue){
                  if(!res[i])
                    res[i] = tmp[i][j].childNodes[k].nodeValue;
                  else
                    res[i] += " " + tmp[i][j].childNodes[k].nodeValue;
                }
              }
            }
          }
        }
        for(let i in res["ДопАдрЭл"]){
          for(let j in fias){
            if(j.length != 4)
              continue;
            if(res["ДопАдрЭл"][i][j])
              if(fias[j].type == 1){
                v._house = fias[j].name + " " + res["ДопАдрЭл"][i][j];
              }
              else if(fias[j].type == 2){
                v._housing = fias[j].name + " " + res["ДопАдрЭл"][i][j];
              }
              else if(fias[j].type == 3){
                v.flat = fias[j].name + " " + res["ДопАдрЭл"][i][j];
              }
          }

          if(res["ДопАдрЭл"][i]["10100000"])
            v.postal_code = res["ДопАдрЭл"][i]["10100000"];
        }

        v.address_fields = res;

        //
        v.region = res["СубъектРФ"] || res["Округ"] || "";
        v.city = res["Город"] || res["НаселПункт"] || "";
        v.street = (res["Улица"] || "");
      }

      const fake_ip = {lat:55.635924, lon: 37.6066379};
      return fetch('//api.sypexgeo.net/')
        .then(response => response.json())
        .then(({city, region, country}) => {
          const o = city || region || country || fake_ip;
          v.latitude = o.lat;
          v.longitude = o.lon;
        })
        .catch(() => {
          v.latitude = fake_ip.lat;
          v.longitude = fake_ip.lon;
        });
    }

    /**
     * Parse a string containing a latitude, longitude pair and return them as an object.
     * @function toLatLng
     * @param {String} Str
     * @return {{lat: Number, lng: Number}}
     */
    assemble_lat_lng(str) {
      //simple coordinates
      const simpleMatches = [];
      simpleMatches[0] = /^\s*?(-?[0-9]+\.?[0-9]+?)\s*,\s*(-?[0-9]+\.?[0-9]+?)\s*$/.exec(str);
      simpleMatches[2] = /^\s*?(-?[0-9]+[,.]?[0-9]+?)\s*;?\s*(-?[0-9]+[,.]?[0-9]+?)\s*$/.exec(str);
      const simpleMatch = simpleMatches.find(match => match && match.length === 3);
      //complex coordinates
      const otherMatches = [];
      otherMatches[0] = /^\s*([0-9]+)°([0-9]+)'([0-9.,]*)"?\s*[NS]\s*([0-9]+)°([0-9]+)'([0-9.,]*)"?\s*[WE]\s*$/.exec(str);
      otherMatches[1] = /^\s*[NS]\s*([0-9]+)°([0-9]+)'([0-9.,]*)"?\s*[EW]\s*([0-9]+)°([0-9]+)'([0-9.,]*)"?\s*$/.exec(str);
      const otherMatch = otherMatches.find(match => match && match.length === 7);
      if (simpleMatch) {
        const lat = parseFloat(simpleMatch[1].replace(',', '.'));
        const lng = parseFloat(simpleMatch[2].replace(',', '.'));

        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { lat, lng };
        }

      } else if (otherMatch) {
        const latDeg = parseFloat(otherMatch[1]);
        const latMin = parseFloat(otherMatch[2]);
        const latSec = parseFloat(otherMatch[3].replace(',', '.'));
        const lngDeg = parseFloat(otherMatch[4]);
        const lngMin = parseFloat(otherMatch[5]);
        const lngSec = parseFloat(otherMatch[6].replace(',', '.'));

        const lat = (latDeg + latMin / 60 + latSec / 3600) * (str.indexOf('S') !== -1 ? -1 : 1);
        const lng = (lngDeg + lngMin / 60 + lngSec / 3600) * (str.indexOf('W') !== -1 ? -1 : 1);

        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { lat, lng };
        }
      }

    }

    marker_toggle_bounce() {
      if (this.marker.getAnimation() != null) {
        this.marker.setAnimation(null);
      }
      else {
        this.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => this.marker.setAnimation(null), 1500);
      }
    }

    marker_dragend(e) {
      const {ipinfo} = $p;
      ipinfo.ggeocoder && ipinfo.ggeocoder.geocode({'latLng': e.latLng}, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          const v = this;
          const {wnd} = this.owner;
          if (results[0]) {
            const addr = results[0];
            wnd.setText(addr.formatted_address);
            ipinfo.components(v, addr.address_components);
            v.refresh_coordinates(e.latLng.lat(), e.latLng.lng());

            this.owner.refresh_grid && this.owner.refresh_grid();

            const zoom = v.street ? 15 : 12;
            if(wnd.elmnts.map.getZoom() != zoom){
              wnd.elmnts.map.setZoom(zoom);
              wnd.elmnts.map.setCenter(e.latLng);
            }

          }
        }
      });
    }

  }

  /**
   *  строки ФИАС адресного классификатора
   */
  WndAddressData.fias = {
    types: ["владение", "здание", "помещение"],

    // Код, Наименование, Тип, Порядок, КодФИАС
    "1010": {name: "дом",			type: 1, order: 1, fid: 2, syn: [" д.", " д ", " дом"]},
    "1020": {name: "владение",		type: 1, order: 2, fid: 1, syn: [" вл.", " вл ", " влад.", " влад ", " владен.", " владен ", " владение"]},
    "1030": {name: "домовладение",	type: 1, order: 3, fid: 3, syn: [" домовлад"]},

    "1050": {name: "корпус",		type: 2, order: 1, syn: [" к.", " к ", " корп.", " корп ", "корпус"]},
    "1060": {name: "строение",	type: 2, order: 2, fid: 1, syn: [" стр.", " стр ", " строен.", " строен ", "строение"]},
    "1080": {name: "литера",		type: 2, order: 3, fid: 3, syn: [" л.", " л ", " лит.", " лит ", "литера"]},
    "1070": {name: "сооружение",	type: 2, order: 4, fid: 2, syn: [" соор.", " соор ", " сооруж.", " сооруж ", "сооружение"]},
    "1040": {name: "участок",	type: 2, order: 5, syn: [" уч.", " уч ", "участок"]},

    "2010": {name: "квартира",	type: 3, order: 1, syn: ["кв.", "кв ", "кварт.", "кварт ", "квартира", "-"]},
    "2030": {name: "офис",		type: 3, order: 2, syn: ["оф.", "оф ", "офис", "-"]},
    "2040": {name: "бокс",		type: 3, order: 3, syn: ["бокс", "бкс"]},
    "2020": {name: "помещение",	type: 3, order: 4, syn: ["помещение", "пом", "помещ"]},
    "2050": {name: "комната",	type: 3, order: 5, syn: ["комн.", "комн ", "комната"]},

    // Уточняющие объекты
    "10100000": {name: "Почтовый индекс"},
    "10200000": {name: "Адресная точка"},
    "10300000": {name: "Садовое товарищество"},
    "10400000": {name: "Элемент улично-дорожной сети, планировочной структуры дополнительного адресного элемента"},
    "10500000": {name: "Промышленная зона"},
    "10600000": {name: "Гаражно-строительный кооператив"},
    "10700000": {name: "Территория"},

  };

  /**
   * Конструктор структуры адреса
   * @type {WndAddressData}
   */
  $p.classes.WndAddressData = WndAddressData;
}




