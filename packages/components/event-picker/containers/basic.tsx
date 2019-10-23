import { connect } from 'react-redux';
import EventSelect from '../components/EventSelect';
import {
  resources,
  basicSelector,
  mapDispatchToProps
} from './constants';

const resourceInjector = require('store/data/injector').default;

resourceInjector(EventSelect, resources);

export default connect(basicSelector, mapDispatchToProps)(EventSelect as any);
