import Lazy from 'metadata-react/DumbLoader/Lazy';

export default class Templates extends Lazy {
  componentDidMount() {
    import('./Frame').then((module) => this.setState({Component: module.default}));
  }
}
