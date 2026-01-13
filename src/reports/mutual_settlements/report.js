import SettlementsGrid from './Grid';

export function MutualSettlements(obj, {adapters, ui, CatPartners, utils: {moment}}) {
  const partner = obj instanceof CatPartners ? obj : obj.partner;
  const title = `Взаиморасчёты с контрагентом '${partner.toString()}'`;
  adapters.pouch
    .fetch(`/r/partners`, {
      method: 'POST',
      body: JSON.stringify({
        partner: partner.ref,
        mode: 'sheet'
      })
    })
    .then(res => res.json())
    .then(({rows}) => {
      for(const row of rows) {
        row.period = moment(row.period).format('DD.MM.YY');
        row.register.date = row.period;
        row.trans.date = row.trans.date ? moment(row.trans.date).format('DD.MM.YY') : '';
      }
      ui.dialogs.alert({
        title,
        Component: SettlementsGrid,
        props: {rows},
        initFullScreen: true,
        large: true,
        //maxWidth: 'xl',
        timeout: 10e6,
      });
    })
    .catch((err) => ui.dialogs.alert({title, text: err.message || err}));

  return Promise.resolve();
}

MutualSettlements.ref = '019b63f0-ccfa-7393-8135-e309d1bf19b4';
MutualSettlements.destination = 'doc.calc_order,cat.partners';
MutualSettlements.title = 'Взаиморасчёты';
MutualSettlements.jsx = false;
