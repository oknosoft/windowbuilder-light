import React from 'react';

export function StickerCut({row, cssName}) {
  const {nom, len, width} = row;
  return <article>
    <div className="partner nowrap">{nom.name}</div>
    <div className="cut">{len}</div>
    <div className="cut">{width}</div>
  </article>;
}
