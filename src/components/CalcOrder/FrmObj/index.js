import Lazy from 'metadata-react/DumbLoader/Lazy';

export default class MoneyDoc extends Lazy {
  componentDidMount() {
    import('./FrmObj')
      .then((module) => this.setState({Component: module.default}));
  }
}
