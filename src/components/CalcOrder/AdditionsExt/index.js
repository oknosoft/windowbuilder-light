import Lazy from 'metadata-react/DumbLoader/Lazy';

export default class CalcOrderAdditions extends Lazy {
  componentDidMount() {
    import('./Parametric')
      .then((module) => this.setState({Component: module.default}));
  }
}
