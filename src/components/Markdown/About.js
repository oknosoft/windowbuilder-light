// @flow

import React from 'react';
import {MarkdownDocs} from 'metadata-react/Markdown/MarkdownDocsLight';
import markdown from './About.md';
import {description} from '../App/menu';

export default function Page(props) {
  return <MarkdownDocs key="text" markdown={markdown} {...props} descr={description} canonical="/about"/>;
}
