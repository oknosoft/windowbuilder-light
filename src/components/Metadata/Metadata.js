/**
 * Невизуальный компонент, инициализирует метадату
 * и транслирует события адаптера в props потомков
 *
 * Created by Evgeniy Malyarov on 14.02.2021.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {ThemeProvider} from '@mui/material';  // провайдер тема material=ui
import theme from '../../styles/muiTheme';      // тема material=ui
import Loading from '../App/Loading';
import Alert from '../../packages/ui/App/Alert';

const LoadingContext = React.createContext(null);
export const useLoadingContext = () => React.useContext(LoadingContext);

function Metadata({App, initialText}) {
  const [ifaceState, setIfaceState] = React.useState(null);
  const [first, resetFirst] = React.useState(true);
  const handleIfaceState = React.useMemo(() => (newState) => {
    setIfaceState(prevState => ({...prevState, ...newState}));
  }, []);

  // инициализируем MetaEngine
  React.useEffect(() => {
    import('../../metadata/actions')
      .then(({actions, init_state}) => {
        if(first) {
          setIfaceState(init_state);
          resetFirst();
        }
        else {
          actions(handleIfaceState)
            .then(() => $p.ui.dialogs.init({handleIfaceState}));
        }
      });
  }, [first]);

  const loading = <Loading {...ifaceState} html={initialText} />;
  const {meta_loaded, alert} = ifaceState || {};

  return <ThemeProvider theme={theme}>
    <LoadingContext.Provider value={{ ifaceState, handleIfaceState }}>
      <React.Suspense fallback={loading}>
        {meta_loaded ? <App {...ifaceState}/> : loading }
        {alert?.open && <Alert {...alert}/>}
      </React.Suspense>
    </LoadingContext.Provider>
  </ThemeProvider>;

}


Metadata.propTypes = {
  App: PropTypes.elementType.isRequired,
};

export default Metadata;
