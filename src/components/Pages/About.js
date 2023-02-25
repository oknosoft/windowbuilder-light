
import React from 'react';
import MarkdownDocs from 'metadata-ui/Markdown/MarkdownDocs';
import markdown from './about.md';
import {useTitleContext} from '../App';

export default function Page(props) {
  const {description, title, setTitle} = useTitleContext();
  return <MarkdownDocs
    {...props}
    markdown={markdown}
    //subtitle="Окнософт"
    //descr={description}
    setTitle={setTitle}
    canonical="/about"
  />;
}
