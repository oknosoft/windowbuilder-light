// @flow

import React from 'react';
import {MarkdownDocs} from 'metadata-react/Markdown/MarkdownDocsLight';
import markdown from './Help.md';
import {description} from '../App/menu';

export default function Page(props) {
  return <MarkdownDocs markdown={markdown} {...props} descr={description} canonical="/help"/>;
}
