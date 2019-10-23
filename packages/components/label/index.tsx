import React, { ReactNode, MouseEvent } from 'react';
import classnames from 'classnames';
import Icon from '@gio-design/icon';
import Tooltip from 'antd/lib/tooltip';

import './style.less';

interface Props {
  children: ReactNode,
  type?: 'dark' | 'light',
  title?: string,
  nowrap?: boolean,
  removable?: boolean,
  onRemove?: () => void
};

interface State {
  showTooltip: boolean
}

const handleClick = (onRemove: () => void) => (e: MouseEvent<HTMLElement>) => {
  e.stopPropagation();
  onRemove();
}

class Label extends React.Component<Props, State> {
  public state: State = {
    showTooltip: false
  }

  private label: HTMLSpanElement = null;

  public componentDidMount() {
    this.setShowTooltip();
  }

  public componentDidUpdate() {
    this.setShowTooltip();
  }

  public render() {
    const {
      children,
      type = 'light',
      title,
      nowrap = true,
      removable,
      onRemove
    } = this.props;

    return (
      <span className={classnames(`gio-label ${type}`, { removable, nowrap })} title={title} ref={this.createLabelRef}>
        <Tooltip title={this.state.showTooltip && children}>
          <span className={'gio-label-inner'}>{children}</span>
        </Tooltip>
        {
          removable ? (
            <Icon
              type='close'
              onClick={handleClick(onRemove)}
              size='small'
            />
          ) : null
        }
      </span>
    )
  }

  private createLabelRef = (label: HTMLSpanElement) => this.label = label;

  private setShowTooltip() {
    const label: HTMLSpanElement = this.label;
    const isEllipsis: boolean = label.scrollWidth > label.offsetWidth;
    if (!this.state.showTooltip && isEllipsis) {
      this.setState({ showTooltip: true });
    }
    if (this.state.showTooltip && !isEllipsis) {
      this.setState({ showTooltip: false });
    }
  }
};

export default Label;
