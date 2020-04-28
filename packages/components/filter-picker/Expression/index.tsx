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
  showSearch?: boolean,
  dimensionsSearchPath?: string
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
      placeholder,
      dimensionsSearchPath,
    } = this.props;

    let {
      key: property = '',
      op: operator,
      values,
      name: propertyName,
      valueType
    } = expression;
    if (operator === 'relativeTime') {
      const value: string = values[0].slice('relativeTime:'.length) || '';
      // values[0] = value;
      const values1 = value.split(',').map((v: string) => Number(v));
      if (values1.length === 1) {
        operator = 'relativeNow'
      } else {
        operator = (values1[0] === 0 || values1[1] === 0) ? 'relativeNow' : 'relativeBetween'
      }
    }
    if (operator === '!=' && values[0] === ' ') {
      operator = 'isNotNaN'
    }
    if (operator === '=' && values && values[0] === ' ') {
      operator = 'isNaN'
    }

    const type = property.split('_')[0]

    const valueSelectMode = multipleModeOperators.indexOf(operator) > -1 ? 'tags' : undefined;

    return (
      <div className={'gio-expression'} ref={this.setRef}>
        <CircularIcon style={{
          marginRight: '8px',
          float: 'left',
          marginTop: '10px'
        }}>{index + 1}</CircularIcon>
        <div className='gio-expression-selectors'>
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
              values,
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
              dimensionsSearchPath,
              type,
              valueType
            })
          }
        </div>
        {
          allowRemove && (
            <span className='gio-expression-btn-remove'>
              <Icon
                type='close'
                width='16'
                height='16'
                onClick={this.handleExpressionRemove}
                disabled={!index && !(property || (values && values.length))}
              />
            </span>
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
      valueType: option.valueType,
      values: [],
      op: '='
    });

  private handleOperatorSelectChange = (op: string): void => {
    const props = this.props;
    const values = props.expression.values || [];
    // 由多选切换到单选时，保留第一个已选值
    if (props.multipleModeOperators.indexOf(op) === -1 && values.length > 1) {
      this.handleChange({ op, values: [values[0]] });
    } else {
      this.handleChange({  op, values: []  });
    }
  };

  private handleValueSelectChange = (values: string): void => this.handleChange({ values });

  private handleExpressionRemove = (): void => this.props.onRemove(this.props.index);

  private getPopupContainer = (): HTMLElement => findDOMNode(this.node) as HTMLElement;
}
