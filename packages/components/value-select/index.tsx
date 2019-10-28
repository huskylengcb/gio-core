import React, { ReactNode } from 'react';
import { findDOMNode } from 'react-dom';
import Checkbox from 'antd/lib/checkbox';
import Select from '@gio-design/components/lib/select';
import Tooltip from '@gio-design/components/lib/tooltip';
import classnames from 'classnames';

import './style.less';

export interface ValueSelectProps {
  value: string,
  options: any[],
  mode?: string,
  keyword?: string,
  groupName?: string,
  onChange: (value: any) => any,
  [key: string]: any
};

class ValueSelect extends React.Component<ValueSelectProps, {}> {
  private node: Element

  public componentDidMount() {
    this.bindOnPaste();
  }

  public componentDidUpdate(prevProps: ValueSelectProps) {
    if (prevProps.mode !== this.props.mode) {
      this.bindOnPaste();
    }
  }

  public render() {
    const {
      value,
      options,
      mode,
      keyword,
      groupName,
      onChange,
      showSearch,
      ...props
    } = this.props;

    return (
      <Select
        mode={mode}
        className={classnames('gio-value-select', { 'gio-value-select--multiple': isMultipleMode(mode) })}
        showSearch={showSearch}
        value={value ? value.split(',').filter((v: string) => !!v) : []}
        onChange={onSelectChange(onChange)}
        optionLabelProp={'value'}
        dropdownClassName={'gio-value-select-dropdown'}
        tokenSeparators={[',', '\n', '\r', '\t']}
        getPopupContainer={this.getPopupContainer}
        ref={this.setRef}
        {...props}
      >
        {
          [
            this.renderFreeInputGroup(),
            this.renderOptions()
          ].filter((element: ReactNode) => !!element)
        }
      </Select>
    );
  }

  private setRef = (node: any) => this.node = node;

  private getPopupContainer = () => findDOMNode(this);

  private renderOptions = (
    options = this.props.options,
    groupName = this.props.groupName
  ) => {
    if (!options.length) {
      return null;
    }
    const { value, mode } = this.props;
    const OptionList = options.map((option: any) =>
      // typeof option === 'object' ?
      // (
      //   <Select.Option className='gio-select-dropdown-menu-item-multiple' value={option.key}>
      //     {option.label}
      //   </Select.Option>
      // ) :
      (
        <Select.Option className='gio-select-dropdown-menu-item-multiple' key={option} value={option} disabled={!(option && option.trim())}>
          {isMultipleMode(mode) ? <Checkbox checked={(value ? value.split(',') : []).indexOf(option) > -1} /> : null}
          {option}
        </Select.Option>
      ));
    return groupName ? (
      <Select.OptGroup key='group' label={groupName}>
        {OptionList}
      </Select.OptGroup>
    ) : OptionList
  };

  private renderFreeInputGroup = () => {
    const {
      options,
      keyword,
      freeInputTooltip
    } = this.props;

    let label: string | ReactNode = '';
    if (options.length) {
      label = '自由输入';
    } else {
      label = (
        <span>
          自由输入（
          <Tooltip title={freeInputTooltip}>
            <span
              style={{
                textDecoration: freeInputTooltip ? 'underline' : 'none'
              }}
            >
              没有匹配结果
            </span>
          </Tooltip>
          ，仍然尝试）
      </span>
      );
    }

    return keyword && keyword.trim() && options.indexOf(keyword) === -1 ? (
      <Select.OptGroup key='free-input' label={label}>
        {this.renderOptions([keyword], '')}
      </Select.OptGroup>) : null;
  };

  private bindOnPaste = (props = this.props) => {
    const input: HTMLInputElement = (findDOMNode(this.node) as Element).querySelector('.ant-select-search__field');
    if (!input) {
      return;
    }
    input.onpaste = (event: ClipboardEvent) => {
      if (!isMultipleMode(props.mode)) {
        return;
      }
      const str = event.clipboardData.getData('text/plain');
      const arr = [this.props.value, str]
          .join(',')
          .split(/,|\n|\r|\t/)
          .map((s: string) => s && s.trim())
          .filter((s: string) => !!s);
      if (arr.length === 1) {
        return;
      }
      const value = Array.from(new Set(arr)).join(',');
      this.props.onChange(value);
      return false;
    };
  }
};

const isMultipleMode = (mode?: string): boolean => /tags|multiple/.test(mode);

const onSelectChange = (onChange: (value: string | string[]) => void) => ((key: string | string[]) => {
  const value: string = convert2StringValue(key);
  onChange(value);
})

const convert2StringValue = (value: string | string[]): string => (
  Array.isArray(value) ? (value as string[])
    .map((s: string) => s.trim())
    .filter((s: string) => !!s)
    .join(',') : value && value.trim()
);

export default ValueSelect;
