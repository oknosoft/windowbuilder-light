
export function rowKeyGetter(row) {
  return row.ref;
}

export function preventDefault(event) {
  event.preventGridDefault();
  event.preventDefault();
}
