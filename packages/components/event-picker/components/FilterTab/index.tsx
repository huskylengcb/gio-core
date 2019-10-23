import React from 'react';
import classnames from 'classnames';

import './style.less';

interface Props {
  tabs: any[],
  onChange: (activedTab: string) => void,
  defaultActivedTab?: string
}

interface State {
  activedTab: string
}

class FilterTab extends React.PureComponent<Props, State> {
  public static defaultProps: Partial<Props> = {
    defaultActivedTab: ''
  }

  public state: State = {
    activedTab: this.props.defaultActivedTab
  }

  public render() {
    return (<div className='filter-tab-list'>{this.props.tabs.map(this.renderTab)}</div>);
  }

  private renderTab = (tab: any) => (
    <div
      key={tab.id}
      className={classnames(
        'filter-tab-list-item',
        {
          actived: this.state.activedTab === tab.id,
          disabled: tab.disabled
        }
      )}
      onClick={!tab.disabled && this.handleChange(tab.id)}
    >
      {tab.label}
    </div>
  );

  private handleChange = (activedTab: string) => (e: React.MouseEvent<HTMLLIElement>) => {
    this.setState({ activedTab });
    this.props.onChange(activedTab);
  }
}

export default FilterTab;
