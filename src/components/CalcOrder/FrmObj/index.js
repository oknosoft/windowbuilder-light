import Lazy from 'metadata-react/DumbLoader/Lazy';

export class FrmObj extends Lazy {
  componentDidMount() {
    import('./FrmObj').then((module) => this.setState({Component: module.default}));
  }
}

export class FrmObjCompact extends Lazy {
  componentDidMount() {
    import('./FrmObjCompact').then((module) => this.setState({Component: module.default}));
  }
}
