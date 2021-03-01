import React from 'react';
import Button from '@gio-design-old/components/lib/button';
import Tooltip from '@gio-design-old/components/lib/tooltip';
import Icon from '@gio-design/icon';
import { getPercent, getStepId } from './helper';
import Sortable from './Sortable';
import StepItem from './StepItem';
import './index.less';

const cls = (klass: string = '') => ['funnel-preview', klass].filter((s: string) => s).join('__');

export interface Props {
  steps: any[]
  totalRate: number
  totalConversionRate: number,
  max: number
  onCancel: () => void
  onConfirm: () => void
  confirmDisabled: boolean
};

class StepsPreview extends React.PureComponent<Props> {
  defaultProps = {
    steps: [],
    totalConversionRate: 0,
    onCancel: () => {}
  }

  _handleSort = (steps) => {
    this.props.handleStepsChange(steps);
  }

  render() {
    const props = this.props;
    const { steps = [], totalConversionRate, events } = props;
    const collection = steps.map((event, index) => ({ ...event, renderKey: event.id + index }));
    return (
      <div className={cls()}>
        <div className={cls('header')}>
          <div className={cls('summary')}>
            漏斗步骤 { `${steps.length}/${props.max}` }
          </div>
          <div className={cls('total-rate')}>
            {
              props.isLoadingTotalConversionRate ? (
                <Icon type='loading' className={cls('loading')} />
              ) : null
            }
            总转化率: <span className={cls('num')}>{ getPercent(totalConversionRate) }</span>
          </div>
        </div>
        <div className={cls('step-list')}>
          <Sortable
            collection={collection}
            onSorted={this._handleSort}
            getId={getStepId}
            template={<StepItem
              events={events}
              removeStep={props.removeStep}
              timeRange={this.props.timeRange}
              needPreview={false}
            />}
          />
        </div>
        <div className={cls('footer')}>
          <Button type='gray' onClick={props.onCancel}>取消</Button>
          {
            props.stepSelectVisible && props.confirmDisabled  ? (
              <Tooltip title='请至少选择两步'>
                { this.renderConfirmButton() }
              </Tooltip>
            ) : this.renderConfirmButton()
          }
        </div>
      </div>
    );
  }

  renderConfirmButton() {
    const props = this.props;
    return (
      <Button
        type='primary'
        onClick={props.onConfirm}
        disabled={props.confirmDisabled}
      >
        确定
      </Button>
    );
  }
}

export default StepsPreview;
