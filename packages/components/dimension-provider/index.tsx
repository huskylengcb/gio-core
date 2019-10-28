import React from 'react';
import hash from 'object-hash';
import { pick } from 'lodash';
import Dimension from '@gio-core/types/Dimension';
import Metric from '@gio-core/types/Metric';

const http = require('@gio-core/utils/http').default;


export interface RenderProps {
  dimensions: Dimension[],
  isLoading: boolean,
  fetchDimensions: (props?: Props) => void,
  visible?: boolean
}

type childrenType = (props: RenderProps) => JSX.Element;

interface Props {
  type?: 'funnels' | 'retentions' | 'charts' | string,
  autoFetch?: boolean,
  metrics?: Metric[],
  targetUsers?: string[],
  children: childrenType
  dataSource?: 'realtime' | 'funnel' | 'retention'
  version?: string,
  visible?: boolean,
  uri?: string,
}

interface State {
  cache: { [key: string]: Dimension[] },
  isLoading: boolean
}

class DimensionProvider extends React.PureComponent<Props, {}> {
  public static defaultProps: Partial<Props> = {
    autoFetch: false,
    metrics: [],
    targetUsers: [],
    uri: `/projects/{(window as any).project.id}/dimensions/search`
  }

  public state: State = {
    cache: {},
    isLoading: false
  }

  public componentDidMount() {
    if (this.props.autoFetch) {
      this.fetchDimensions();
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.autoFetch) {
      this.fetchDimensions(nextProps);
    }
  }

  public render() {
    const { children } = this.props;
    return (children as childrenType)({
      dimensions: this.getDimensions() || [],
      fetchDimensions: this.fetchDimensions,
      isLoading: this.state.isLoading,
      visible: this.props.visible
    });
  }

  public fetchDimensions = (props = this.props) => {
    // if (this.getDimensions(props)) {
    //   return;
    // }
    const { metrics, targetUsers, uri } = props;
    this.setIsLoading(true);
    let dimensionPromise;
    const data = { measurements: metrics, targetUsers };
    dimensionPromise = http.post(uri, { data }, true);
    dimensionPromise
      .then((dimensions: Dimension[]) => {
        this.setDimensions(props, dimensions);
      })
      .catch(() => {
        this.setDimensions(props);
      })
      .finally(() => {
        this.setIsLoading(false);
      });
  }

  private setIsLoading = (isLoading: boolean)  => {
    this.setState((prevState: State) => ({
      ...prevState, isLoading
    }));
  }

  private generateCacheKey = (props: Props) => hash({
    metrics: props.metrics.map((metric: Metric) => pick(metric, 'id', 'level')),
    targetUsers: props.targetUsers
  }, { respectFunctionProperties: false });

  private getDimensions = (props = this.props) => this.state.cache[this.generateCacheKey(props)]

  private setDimensions = (props: Props, dimensions?: Dimension[]) => this.setState((prevState: State) => ({
    ...prevState,
    cache: {
      ...this.state.cache,
      [this.generateCacheKey(props)]: dimensions
    }
  }))
}

export default DimensionProvider;
