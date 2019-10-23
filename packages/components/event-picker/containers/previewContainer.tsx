import Preview from '../components/EventPreview';
/*
import { connect } from 'react-redux';
import resourceInjector from 'store/data/injector';
import { pagesSelector } from 'store/data/pages/selectors';
import { preparedMetricsSelector } from 'store/data/preparedMetrics/selectors';

resourceInjector(Preview, [
  'pages',
  'preparedMetrics',
]);

const mapStateToProps = (state, props) => {
  return {
    pages: pagesSelector(state),
    preparedMetrics: preparedMetricsSelector(state),
  };
};

export default connect(mapStateToProps)(Preview);
*/
export default Preview;
