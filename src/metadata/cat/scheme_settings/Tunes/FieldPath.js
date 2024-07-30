import React from 'react';

export function PathEditor() {

}

export function PathFormatter({row, column, onRowChange, onClose}) {
  return <div>{row[column.key]}</div>;
}
