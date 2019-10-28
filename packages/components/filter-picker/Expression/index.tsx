import React from 'react';
import { findDOMNode } from 'react-dom';
import Icon from '@gio-design/icon';
import Filter from '@gio-core/types/Filter';
import FilterExpression from '@gio-core/types/FilterExpression';
import CircularIcon from '@gio-core/components/circular-icon';
import { Operator } from '@gio-core/constants/operator';

import './style.less';

export interface ExpressionProps {
  index: number,
  filter?: Filter,
  propertyOptions: any[],
  isPropertyOptionsLoading?: boolean,
  valueOptions?: any[],
  expression: FilterExpression,
  operators?: Operator[],
  placeholder?: string
  multipleModeOperators?: string[],
  className?: string,
  allowRemove?: boolean,
  render: (props: any) => JSX.Element | JSX.Element[],
  onChange: (expression: FilterExpression) => void,
  onRemove?: (index: number) => void,
  extraAttrs?: any
  operatorExclude?: Operator[]
  valueInclude?: any[]
  valueExclude?: any[]
  showSearch?: boolean
};

export default class Expression extends React.PureComponent<ExpressionProps, {}> {
  public static defaultProps: Partial<ExpressionProps> = {
    allowRemove: true,
    onChange: (v: any) => v,
    multipleModeOperators: ['in', 'not in'],
    operatorExclude: [],
    valueExclude: [],
  }

  private node: Element;

  public render() {
    const {
      index,
      filter,
      propertyOptions,
      isPropertyOptionsLoading = false,
      valueOptions,
      expression,
      multipleModeOperators,
      allowRemove,
      render,
      extraAttrs,
      operatorExclude,
      valueInclude = [],
      valueExclude = [],
      showSearch = true,
      placeholder
    } = this.props;

    const {
      key: property,
      op: operator,
      value,
      name: propertyName
    } = expression;

    const valueSelectMode = multipleModeOperators.indexOf(operator) > -1 ? 'tags' : undefined;

    return (
      <div className={'gio-expression'} ref={this.setRef}>
        <CircularIcon>{index + 1}</CircularIcon>
        {
          render({
            index,
            filter,
            property,
            propertyName,
            propertyOptions,
            isPropertyOptionsLoading,
            onPropertySelectChange: this.handlePropertySelectChange,
            operator,
            onOperatorSelectChange: this.handleOperatorSelectChange,
            value,
            valueOptions,
            valueSelectMode,
            placeholder,
            onValueSelectChange: this.handleValueSelectChange,
            getPopupContainer: this.getPopupContainer,
            extraAttrs,
            operatorExclude,
            valueInclude,
            valueExclude,
            showSearch,
          })
        }
        {
          allowRemove && (
            <Icon
              type='close'
              width='16'
              height='16'
              onClick={this.handleExpressionRemove}
              disabled={!index && !(property || value)}
              className=''
            />
          )
        }
      </div>
    );
  }

  private setRef = (node: Element) => this.node = node

  private handleChange = (attrs: Partial<FilterExpression>) => {
    return this.props.onChange({ ...this.props.expression, ...attrs });
  }

  private handlePropertySelectChange = (option: any): void =>
    this.handleChange({
      key: option.key,
      name: option.label,
      value: undefined
    });

  private handleOperatorSelectChange = (op: string): void => {
    const props = this.props;
    const values = props.expression.value && props.expression.value.split(',');
    // 由多选切换到单选时，保留第一个已选值
    if (props.multipleModeOperators.indexOf(op) === -1 && (values && values.length > 1)) {
      this.handleChange({ op, value: values[0] });
    } else {
      this.handleChange({ op });
    }
  };

  private handleValueSelectChange = (value: string): void => this.handleChange({ value });

  private handleExpressionRemove = (): void => this.props.onRemove(this.props.index);

  private getPopupContainer = (): HTMLElement => findDOMNode(this.node) as HTMLElement;
}
