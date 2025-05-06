
export const mdm = {
  dkey: new Date().toJSON().substring(0, 10),
  stamp: Date.now(),
  channel: new BroadcastChannel('channel4'),
  delimiter: '/couchdb/mdm/',
  ids: {
    "cat.params_links": "prl",
    "prl": "cat.params_links",
    "cat.partner_bank_accounts": "ba",
    "ba": "cat.partner_bank_accounts",
    "cat.work_center_kinds": "sg",
    "sg": "cat.work_center_kinds",
    "cat.property_values_hierarchy": "vh",
    "vh": "cat.property_values_hierarchy",
    "cat.banks_qualifier": "bn",
    "bn": "cat.banks_qualifier",
    "cat.destinations": "ds",
    "ds": "cat.destinations",
    "cat.countries": "cou",
    "cou": "cat.countries",
    "cat.formulas": "f",
    "f": "cat.formulas",
    "cat.elm_visualization": "vz",
    "vz": "cat.elm_visualization",
    "cat.charges_discounts": "dm",
    "dm": "cat.charges_discounts",
    "cat.http_apis": "pa",
    "pa": "cat.http_apis",
    "cat.project_categories": "prk",
    "prk": "cat.project_categories",
    "cat.branches": "br",
    "br": "cat.branches",
    "cat.users": "u",
    "u": "cat.users",
    "cat.property_values": "v",
    "v": "cat.property_values",
    "cat.currencies": "cr",
    "cr": "cat.currencies",
    "cat.contact_information_kinds": "cik",
    "cik": "cat.contact_information_kinds",
    "cat.nom_kinds": "nk",
    "nk": "cat.nom_kinds",
    "cat.contracts": "cn",
    "cn": "cat.contracts",
    "cat.nom_units": "nu",
    "nu": "cat.nom_units",
    "cat.meta_ids": "mi",
    "mi": "cat.meta_ids",
    "cat.cashboxes": "cb",
    "cb": "cat.cashboxes",
    "cat.units": "uc",
    "uc": "cat.units",
    "cat.partners": "ka",
    "ka": "cat.partners",
    "cat.nom": "n",
    "n": "cat.nom",
    "cat.organizations": "og",
    "og": "cat.organizations",
    "cat.inserts": "ins",
    "ins": "cat.inserts",
    "cat.parameters_keys": "k",
    "k": "cat.parameters_keys",
    "cat.production_params": "sys",
    "sys": "cat.production_params",
    "cat.delivery_areas": "da",
    "da": "cat.delivery_areas",
    "cat.cnns": "cnn",
    "cnn": "cat.cnns",
    "cat.furns": "frn",
    "frn": "cat.furns",
    "cat.clrs": "clr",
    "clr": "cat.clrs",
    "cat.color_price_groups": "clg",
    "clg": "cat.color_price_groups",
    "cat.divisions": "dep",
    "dep": "cat.divisions",
    "cat.projects": "pt",
    "pt": "cat.projects",
    "cat.stores": "str",
    "str": "cat.work_shifts",
    "cat.work_shifts": "str",
    "cat.cash_flow_articles": "mpt",
    "mpt": "cat.cash_flow_articles",
    "cat.nom_prices_types": "prc",
    "prc": "cat.nom_prices_types",
    "cat.individuals": "ip",
    "ip": "cat.individuals",
    "cat.characteristics": "cx",
    "cx": "cat.characteristics",
    "cat.price_groups": "pg",
    "pg": "cat.price_groups",
    "cat.production_kinds": "pk",
    "pk": "cat.production_kinds",
    "cat.lead_src": "ls",
    "ls": "cat.lead_src",
    "cat.leads": "ld",
    "ld": "cat.leads",
    "cat.nom_groups": "ng",
    "ng": "cat.nom_groups",
    "cat.values_options": "pvv",
    "pvv": "cat.values_options",
    "cat.abonents": "abn",
    "abn": "cat.abonents",
    "cat.insert_bind": "isl",
    "isl": "cat.insert_bind",
    "cat.templates": "tm",
    "tm": "cat.templates",
    "cat.choice_params": "sp",
    "sp": "cat.choice_params",
    "cat.delivery_directions": "dd",
    "dd": "cat.delivery_directions",
    "cat.project_stages": "psg",
    "psg": "cat.project_stages",
    "cat.work_centers": "wpl",
    "wpl": "cat.work_centers",
    "cat.planning_keys": "pb",
    "pb": "cat.planning_keys",
    "cat.product_fragments": "pf",
    "pf": "cat.product_fragments",
    "cat.products": "p",
    "p": "cat.products",
    "cat.margin_coefficients": "mc2",
    "mc2": "cat.margin_coefficients",
    "cat.specifications": "sx",
    "sx": "cat.specifications",
    "doc.purchase_order": "po",
    "po": "doc.purchase_order",
    "doc.work_centers_task": "wt",
    "wt": "doc.work_centers_task",
    "doc.calc_order": "co",
    "co": "doc.calc_order",
    "doc.work_centers_performance": "wp",
    "wp": "doc.work_centers_performance",
    "cch.predefined_elmnts": "pe",
    "pe": "cch.predefined_elmnts",
    "cch.properties": "pr",
    "pr": "cch.properties"
  },

  parentZone() {
    return new Promise((resolve, reject) => {
      const {channel} = this;
      const receiver = (event) => {
        if(event.data.type === 'zone') {
          clearTimeout(timer);
          channel.removeEventListener('message', receiver);
          this.zone = event.data.zone;
          this.branch = event.data.branch;
          resolve(this.zone);
        }
      };
      channel.addEventListener('message', receiver);
      channel.postMessage({type: 'zone'});
      const timer = setTimeout(() => {
        channel.removeEventListener('message', receiver);
        reject('timeout');
      }, 5000);
    });
  },

  openCache() {
    return (this.zone ? Promise.resolve() : this.parentZone())
      .then(() => this.cache || caches.open('mdm.v1').then((cache) => this.cache = cache));
  },

  refresh() {
    return this.openCache()
      .then(() => {
        if(this.slice && Date.now() - this.stamp < 20000) {
          return Promise.resolve(this.slice);
        }

      return this.parentZone()
        .then(zone => {
          const manifestURL = `/couchdb/mdm/${zone}/manifest`;
          if(navigator.onLine) {
            return fetch(`/couchdb/mdm/${zone}/common`, {method: 'HEAD'})
              .then((res) => {
                return this.cache.put(manifestURL, res)
                  .then(() => {
                    return res;
                  });
              });
          }
          return this.cache.match(manifestURL);
        })
        .then(res => {
          this.stamp = Date.now();
          this.slice = JSON.parse(res.headers.get('manifest'));
          this.channel.postMessage({type: 'manifest', value: this.slice});
          return this.slice;
        });
    });
  },

  respond(event) {
    const {request} = event;
    const url = new URL(request.url);
    const key = url.pathname.split(this.delimiter)[1];
    event.respondWith(this.refresh()
      .then(() => this.cache.match(request, {ignoreVary: true}))
      .then((resp) => {
        if(resp) {
          const raw = resp.headers.get('manifest');
          if(raw) {
            const slice = JSON.parse(raw);

            if(key.includes('common')) {
              if(this.slice.common[0] === slice.common?.[0]) {
                return {resp, cached: true};
              }
            }
            else {
              const type = url.search.split('=')[1];
              const id = type && (this.ids[type] || type);
              if(id && this.slice[id] && this.slice[id][0] === slice[id]?.[0]) {
                return {resp, cached: true};
              }
              else if(slice?.other && this.slice.other[0] === slice.other[0]) {
                return {resp, cached: true};
              }
            }
          }
        }
        return fetch(request)
          .then((resp) => ({resp, cached: false}));
      })
      .then(({resp, cached}) => {
        return cached ? resp : this.cache.put(request, resp.clone()).then(() => resp);
      })
      .catch((err) => {
        throw err;
      })
    );
  },

  match(url) {
    return url.includes(this.delimiter);
  },
};
