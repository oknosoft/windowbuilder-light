
import React from 'react';
import MarkdownDocs from 'metadata-ui/Markdown/MarkdownDocs';
import {useMatches } from 'react-router';
import {useTitleContext} from '../App';
import {postprocessing} from './postprocessing';

export default function Page(props) {
  const {description, title, setTitle} = useTitleContext();
  const matches = useMatches();
  const {pathname} = matches[matches.length-1];
  const [markdown, setMarkdown] = React.useState('');

  React.useEffect(() => {
    import(`.${pathname}.md`)
      .then((module) => postprocessing(pathname, module.default))
      .then(setMarkdown);
  }, [pathname]);

  return <MarkdownDocs
    {...props}
    markdown={markdown}
    //subtitle="Окнософт"
    //descr={description}
    setTitle={setTitle}
  />;
}
