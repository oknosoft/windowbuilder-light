import React from 'react';
import RefFieldEx from 'metadata-ui/DataField/RefFieldEx';
import ContractsObj from './Obj';

export default function ContractField({obj, organization, partner, ...other}) {

  const {contract} = obj;
  const [open, setOpen] = React.useState(false);
  const closeDialog = () => setOpen(false);
  const contractEdit = contract.empty() ? null : () => {
    setOpen(true);
  };
  const contractAdd = contract.empty() ? () => {
    const {ui: {dialogs}, job_prm: {pricing}, cat: {contracts}} = $p;
    if(partner.empty() || organization.empty()) {
      return dialogs.alert({
        title: 'Добавление договора',
        text: 'Не указан контрагент или организация'
      });
    }
    let v = contracts.find({owner: partner, organization}), fin = Promise.resolve();
    if(!v) {
      v = contracts.create({
        owner: partner.ref,
        organization: organization.ref,
        name: `Основной ${organization.name.split(' ')[0]}`,
        mutual_settlements: "ПоЗаказам",
        contract_kind: "СПокупателем",
        settlements_currency: pricing?.main_currency?.ref,
      }, false, true);
      if(organization.individual_legal.is('ЮрЛицо')) {
        v.vat_consider = true;
        v.vat_included = true;
      }
      fin = fin.then(() => v.save());
    }
    obj.contract = v;
    fin.then(() => setOpen(true));
  } : null;

  return <>
    <RefFieldEx obj={obj} fld="contract" contract={contract} onAdd={contractAdd} onEdit={contractEdit} {...other}/>
    <ContractsObj open={open} onClose={closeDialog} obj={contract} />
  </>;
}
