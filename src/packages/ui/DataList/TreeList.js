import React from 'react';
import {useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {Resize, ResizeHorizon} from 'metadata-ui/Resize';
import {Content, Relative} from '../../../components/App/styled';
import {useTitleContext} from '../../../components/App';
import Toolbar from './Toolbar';


export default function TreeList(props) {

  // const width = frameRect?.width || window.innerWidth * .5;
  // const height = frameRect?.height || window.innerHeight * .6;
  const width = 900;
  const theme = useTheme();

  const {setTitle} = useTitleContext();

  React.useEffect(() => {
    const listName = 'Справочник (список)';
    const title =  {title: listName, appTitle: <Typography variant="h6" noWrap>{listName}</Typography>};
    setTitle(title);
  }, []);

  return <Content>
    <Toolbar />
    <Relative>
      <Resize handleWidth="6px" handleColor={theme.palette.grey[200]}>
        <ResizeHorizon width={`${(width /3).toFixed()}px`} minWidth="200px">
          Tree
        </ResizeHorizon>
        <ResizeHorizon width={`${(width * 2/3).toFixed()}px`} minWidth="400px">
          List
        </ResizeHorizon>
      </Resize>
    </Relative>
  </Content>;
}
