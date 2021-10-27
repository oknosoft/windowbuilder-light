// @flow

import React from 'react';
import {MarkdownDocs} from 'metadata-react/Markdown/MarkdownDocsLight';
import markdown from './NotFound.md';

export default function Page(props) {
  return <MarkdownDocs markdown={markdown} {...props} subtitle="Заказ дилера" />;
}
