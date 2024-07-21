import React from 'react';
import {useBuilderContext} from '../Context';
import Product from './Product';

export default function Products() {
  const context = useBuilderContext();
  const {editor} = context;
  if(!editor) {
    return null;
  }
  return editor.projects.map((project, ind) => <Product key={`prod-${ind}`} editor={editor} project={project} />);
}
