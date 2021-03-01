import React, { PureComponent } from 'react';
import { noop } from 'lodash';
import cn from 'classnames';
import GIOButton from '@gio-design-old/components/lib/button';
import Input from '@gio-design-old/components/lib/input';
import GIOIcon from '@gio-design/icon';
import message from '@gio-design-old/components/lib/message';
import Gap from '@gio-design-old/components/lib/gap';
import bemClsFactor from '@gio-core/utils/bemClsFactor';
import './index.less';

interface NameEditProps {
  style?: React.CSSProperties
  onOk?: (value: string) => void | Promise<any>
  onCancel?: (value: string) => void
  value: string
  placeholder?: string
  maxLength?: number
  editable?: boolean
  blurToSave?: boolean
  pressEnterToSave?: boolean
  shouldShowButton?: boolean
  onChange?: (value: string) => void
}

interface State {
  editing: boolean,
  value: string,
  error: any,
  status: 'value' | 'error'
}

class NameEdit extends PureComponent<NameEditProps, State> {
  public static defaultProps = {
    style: {},
    onOk: noop,
    value: '',
    placeholder: '',
    maxLength: 25,
    editable: false,
    onCancel: noop,
    onChange: noop,
    blurToSave: false,
    pressEnterToSave: true,
    shouldShowButton: true
  };

  private block = 'gr-editable-name'
  private cls = bemClsFactor(this.block)
  private canBlurToSave = true;

  public state = {
    editing: false,
    value: this.props.value,
    error: null,
    status: 'value'
  } as State

  public componentDidUpdate(prevProps: NameEditProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        value: this.props.value,
        error: null,
        status: 'value'
      });
    }
  }

  private toggleEdit = () => {
    this.setState((state) => {
      return {
        editing: !state.editing
      };
    });
  }
  private handleChange = (e) => {
    const value = e.target.value.trim()
    this.props.onChange && this.props.onChange(value);
    this.setState({
      value: value,
      status: 'value'
    });
  }
  private handleCancel = () => {
    this.props.onCancel && this.props.onCancel(this.state.value);
    this.setState({
      value: this.props.value,
      editing: false,
      status: 'value'
    });
  }
  private handlePressEnter = () => {
    if (this.props.pressEnterToSave) {
      this.handleOk();
    }
  }
  private handleBlur = () => {
    if (this.props.value === this.state.value) {
      this.handleCancel();
      return;
    }
    if (
      this.props.blurToSave
      && this.canBlurToSave
    ) {
      this.handleOk();
    }
  }

  private handleOk = () => {
    const value = this.state.value.trim();
    if (!value) {
      message.error('名称不能为空');
      return;
    }
    const r = this.props.onOk && this.props.onOk(value);
    if (r && r.then) {
      r.
        then(() => {
          this.setState({
            editing: false
          });
        }).
        catch((x) => {
          this.setState({
            status: 'error',
            error: x
          });
        });
    }
  }
  private handleMouseDown = () => {
    this.canBlurToSave = false;
  }
  private handleMouseUp = () => {
    this.canBlurToSave = true;
  }
  private stopPropagation = (e: any) => e.stopPropagation();
  private renderButton = () => (
    <div style={{ display: 'inline-block' }}>
      <GIOButton
        long
        type='primary'
        onClick={this.handleOk}
        size='middle'
        disabled={this.state.status === 'error'}
      >
        保存
      </GIOButton>
      <Gap width={15} />
      <GIOButton
        long
        type='default'
        onClick={this.handleCancel}
        size='middle'
        disabled={this.state.status === 'error'}
        className={this.cls('cancel')}
      >
        取消
      </GIOButton>
    </div>
  )
  public render() {
    const {
      cls, props, state
    } = this;

    const blockCls = cn(cls());
    return (
      <div className={blockCls}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
      >
        {
          props.editable && state.editing &&
            <div className={cls('edit-name')} title={props.value}>
              <Input
                value={state.value}
                placeholder={props.placeholder}
                onChange={this.handleChange}
                onMouseDown={this.stopPropagation}
                onMouseUp={this.stopPropagation}
                onPressEnter={this.handlePressEnter}
                maxLength={props.maxLength}
                autoFocus='autofocus'
                onBlur={this.handleBlur}
                style={{
                  marginRight: 25
                }}
              />
              { props.shouldShowButton ? this.renderButton() : null }
            </div>
        }
        {
          !state.editing && props.editable &&
              <h4
                className={cls('name')}
                onClick={this.toggleEdit}
                title={props.value}
              >
                {props.value}
                <GIOIcon
                  className='btn-edit'
                  name='gicon-edit'
                  svgStyle={{
                    verticalAlign: 0
                  }}
                />
              </h4>
        }
        {
          !props.editable &&
            <h4
              className={cls('uneditable-name')}
              onClick={this.toggleEdit}
              title={props.value}
            >
              {props.value}
              <GIOIcon
                className='btn-edit'
                name='gicon-edit'
              />
            </h4>
        }
        {
          state.status === 'error' && state.error &&
          <p
            style={{
              color: '#BA3C3C'
            }}
          >
            <GIOIcon
              name='gicon-detail'
              size='small'
              style={{
                fill: '#BA3C3C',
                marginLeft: 4,
                marginRight: 4
              }}
            />
            {state.error}
          </p>
        }
      </div>
    );
  }
}

export default NameEdit;
