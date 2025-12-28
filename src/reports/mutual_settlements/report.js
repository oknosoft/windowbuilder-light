import SettlementsFrame from './Frame';

export function MutualSettlements(obj, {adapters, ui, CatPartners}) {
  const partner = obj instanceof CatPartners ? obj : obj.partner;
  return ui.dialogs.alert({
    title: `Взаиморасчёты с контрагентом '${partner.toString()}'`,
    Component: SettlementsFrame,
    props: {partner},
    initFullScreen: true,
    large: true,
    maxWidth: 'lg',
    timeout: 10e6,
  });
}

MutualSettlements.ref = '019b63f0-ccfa-7393-8135-e309d1bf19b4';
MutualSettlements.destination = 'doc.calc_order,cat.partners';
MutualSettlements.title = 'Взаиморасчёты';
MutualSettlements.jsx = false;
