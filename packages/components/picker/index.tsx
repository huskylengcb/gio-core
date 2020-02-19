import React from 'react';
import { findDOMNode } from 'react-dom';
import Dropdown from 'antd/lib/dropdown';
import Popover, { PropsType as PopoverPropsType } from '@gio-design/components/lib/popover';
import Button from '@gio-design/components/lib/button';
import noop from 'lodash/noop';
import SelectCore, { Props as SelectCoreProps} from './components/SelectCore';
import SelectCoreTab, { TabOption, Props as SelectCoreTabProps } from './components/SelectCore/Tab';
import classnames from 'classnames';
import Trigger from './components/Trigger';
import Tooltip from '@gio-design/components/lib/tooltip';

import './style.less';

interface Props {
  type?: 'dropdown' | 'popover',
  visible?: boolean,
  className?: string,
  placement?: PopoverPropsType['placement'],
  subPanel?: React.ReactNode,
  subPanelStyle?: React.CSSProperties,
  onVisibleChange?: (visible: boolean) => void,
  getPopupContainer?: () => HTMLElement,
  onOk?: (e: React.MouseEvent<any>, value: any) => void;
  onCancel?: (e: React.MouseEvent<any>) => void;
  tabOptions?: TabOption[],
  footer?: JSX.Element | boolean | string,
  mode?: 'tab' | 'normal',
  tabKey?: string,
  disabled?: boolean,
  disabledTitle?: string,
  render?: (props: SelectCoreProps) => JSX.Element
  onChange?: (value: any) => void
}

interface State {
  visible: boolean,
  value: any
}

const getDefaultTrigger = ({
  value,
  placeholder = '请选择',
  selectKey = 'id',
  options = [],
  disabled
} : {
  value: any;
  placeholder?: string;
  selectKey?: string;
  options?: any[];
  disabled?: boolean
}) => {
  const { name } = (options.find((o: any) => o[selectKey] === value) || { name: placeholder });
  return (
    <span>
      <Trigger disabled={disabled}>{name}</Trigger>
    </span>
  );
}

class Picker extends React.Component<Props & (SelectCoreProps | SelectCoreTabProps), State> {
  public static defaultProps: Partial<Props> = {
    footer: false,
    onCancel: noop,
    onOk: noop,
    tabOptions: [],
    mode: 'normal',
    type: 'dropdown',
    onChange: noop,
  }

  public state: State = {
    visible: false,
    value: null
  }

  public picker: Element

  public setRef = (node: Element) => this.picker = node

  public render() {
    const {
      value,
      options,
      placeholder,
      selectKey,
      disabled,
      disabledTitle
    } = this.props;
    const children = this.props.children || getDefaultTrigger({ value, options, placeholder, selectKey, disabled });
    const visible = this.props.visible || this.state.visible;
    const onVisibleChange = this.props.onVisibleChange || this.handleVisibleChange;
    const isDropdown = this.props.type === 'dropdown';
    const placement = this.props.placement || (isDropdown ? 'bottom' : 'right');
    const getPopupContainer = this.props.getPopupContainer || this.getPopupContainer;
    const renderedChilren = typeof children === 'function' ? children({
      visible
    }) : children
    if (disabled) {
      return (
        <Tooltip title={disabledTitle}>
          <div ref={this.setRef} className='gio-picker-wrapper'>
            {children}
          </div>
        </Tooltip>
      )
    }
    return (
      <div ref={this.setRef} className='gio-picker-wrapper'>
        {
          isDropdown ? (
            <Dropdown
              visible={visible}
              trigger={['click']}
              onVisibleChange={disabled ? undefined : onVisibleChange}
              overlay={this.renderOverlay()}
              getPopupContainer={getPopupContainer}
              prefixCls='gio-picker dropdown ant-dropdown'
            >
              {renderedChilren}
            </Dropdown>
          ) : (
            <Popover
              visible={visible}
              trigger={'click'}
              content={this.renderOverlay()}
              onVisibleChange={disabled ? undefined : onVisibleChange}
              getPopupContainer={getPopupContainer}
              prefixCls='gio-picker ant-popover'
              placement={placement}
            >
              {renderedChilren}
            </Popover>
          )
        }
      </div>
    );
  }

  private handleVisibleChange  = (visible: boolean) => {
    this.setState((prevState: State) => ({
      ...prevState, visible
    }));
  }

  private renderFooter = () => {
    const { footer } = this.props
    return footer === true
      ? (
        <div className='footer'>
          <Button onClick={this.onComfirmClick}>确定</Button>
          <Button type='gray' onClick={this.onCancelClick}>取消</Button>
        </div>
      ) : footer
  }

  private onComfirmClick = (e: React.MouseEvent<any>) => {
    this.props.onOk(e, this.state.value)
    this.handleVisibleChange(false);
  }

  private onCancelClick = (e: React.MouseEvent<any>) => {
    this.props.onCancel(e)
    this.handleVisibleChange(false);
  }

  private renderSelectCore = (props: SelectCoreProps | SelectCoreTabProps) => {
    switch (this.props.mode) {
      case 'tab':
        return <SelectCoreTab {...(props as SelectCoreTabProps)} />
      case 'normal':
      default:
        return <SelectCore {...(props as SelectCoreProps)} />
    }
  }

  private handleChange = (value: any) => {
    const { isMultiple, footer } = this.props
    this.setState({ value });
    this.props.onChange(value);

    if (!footer && !isMultiple && this.props.subPanel === undefined) {
      this.handleVisibleChange(false);
      if (this.props.onVisibleChange) {
        this.props.onVisibleChange(false);
      }
    }
  }

  private renderOverlay = () => {
    const {
      type,
      visible,
      className,
      placement,
      subPanel,
      subPanelStyle,
      tabKey,
      footer,
      mode,
      render,
      children,
      onVisibleChange,
      getPopupContainer,
      onOk,
      onCancel,
      ...selectCoreProps
    } = this.props;

    return  (
      <div className={classnames('gio-picker__overlay', className)}>
        {
          render ? render({
            ...(selectCoreProps as SelectCoreProps),
            onChange: this.handleChange
          }) : this.renderSelectCore({
            ...selectCoreProps,
            onChange: this.handleChange
          })
        }
        {this.renderSubPanel()}
        {this.renderFooter()}
      </div>
    )
  }

  private renderSubPanel = () => (
    <div className='gio-picker__sub-panel' style={this.props.subPanelStyle}>
      {this.props.subPanel}
    </div>
  );

  private getPopupContainer = (): HTMLElement =>  {
    return findDOMNode(this.picker) as HTMLElement;
  }

}

export default Picker;
