import React from 'react';
import classnames from 'classnames';
import { get } from 'lodash';
import Icon from '@gio-design/icon';
import Popover from '@gio-design-old/components/lib/popover';
import FilterDropdown from '../../../filter-picker/FilterDropdown'
import DimensionProvider from '../../../dimension-provider';
import FilterLabelList from '../../../filter-picker/FilterLabelList';
import { getMeasurementName } from '../../../event-picker/helper';
// import Preview from 'modules/core/components/EventPicker/containers/previewContainer';

const Preview = () => <span>Preview</span>;

const cls = (klass: string = '') => ['funnel-preview', klass].filter((s: string) => s).join('__');

class StepItem extends React.PureComponent {
  state = {
    hoverDisabled: false
  }

  handleConfirm = (filter) => {
    const { index, onStepFilterChange } = this.props;
    onStepFilterChange(filter, index);
  }

  handleCrossClick = () => {
    const { index, removeStep } = this.props;
    removeStep(index);
  }

  handlePropsExistFilterDimensionFilterConfirm = (filter) => {
    const { index, onStepFilterChange } = this.props;
    this.setHoverDisabled();
    onStepFilterChange(filter, index);
  }

  handleMouseEnter = () => {
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter();
    }
    this.setHoverDisabled();
  }

  render() {
    const { index, showNumBg, sortData } = this.props;
    const className = classnames(
      cls('step-item'),
      { [cls('step-item--error')]: false }
    );
    const popContent = this.props.needPreview ? <Preview target={sortData} style={{ position: 'static', height: '487px', boxShadow: 'none', padding: '0px 8px 32px 8px' }} /> : null;
    return (
      <DimensionProvider
        type='funnels'
        version='v3'
        metrics={[this.props.sortData]}
        targetUsers={[this.props.targetUser]}
      >
        {
          (renderProps) => {
            const content = (
              <div
                className={classnames(
                  className,
                  this.props.className,
                  { hoverDisabled: this.state.hoverDisabled }
                )}
              >
                <div
                  className={cls('step-item-inner')}
                  onMouseEnter={this.handleMouseEnter}
                  onMouseLeave={this.props.onMouseLeave}
                >
                  <div className={cls('icon-wrapper')}>
                    <Icon type='sequence' className='fnl-icon-draggable' style={{ padding: 0, left: 10 }} />
                    <span
                      className={classnames(
                        cls('step-num'),
                        { 'fnl-icon-op': showNumBg }
                      )}
                    >
                      { index + 1 }
                    </span>
                  </div>
                  {this.renderStepName()}
                  {this.renderDropdown(renderProps)}
                  <Icon
                    type='close'
                    className={cls('btn-remove')}
                    onClick={this.handleCrossClick}
                  />
                </div>
                {this.renderFilterLabelList(renderProps)}
              </div>
            );
            const isDeleted = !sortData.id && !sortData.definition;
            // 预定义指标中的任意行为不会展示预览
            if (!this.props.needPreview || isDeleted || sortData.type === 'prepared' && /^retentionuv$|^uv_[a-zA-Z]+$/.test(sortData.id) && /^任意行为/.test(sortData.name)) {
              return content;
            }
            return (
              <Popover
                content={popContent}
                placement='right'
                overlayClassName='funnelPreviewPop'
              >
                {content}
              </Popover>
            );
          }
        }
      </DimensionProvider>
    );
  }

  renderStepName = () =>
    // TODO: remove events
    (<span>{getMeasurementName(this.props.sortData)}</span>)

  renderDropdown = ({ dimensions, fetchDimensions }) => {
    const {
      showFilter,
      sortData: step
    } = this.props;

    return showFilter ? (
      <FilterDropdown
        title={null}
        metrics={[step]}
        propertyOptions={dimensions}
        filter={step.filter}
        onConfirm={this.handleConfirm}
        beforeOpen={fetchDimensions}
      >
        <Icon type='filter' className={cls('icon-filter')} />
      </FilterDropdown>
    ) : null;
  }

  renderFilterLabelList = ({
    dimensions,
    fetchDimensions
  }) => {
    const { sortData:step, showFilter } = this.props;
    return (showFilter && get(step, 'filter.exprs.length')) ? (
      <FilterLabelList
        editable
        removable
        nowrap={false}
        filter={step.filter}
        propertyOptions={dimensions}
        metrics={[step]}
        onChange={this.handlePropsExistFilterDimensionFilterConfirm}
        beforeDropdownOpen={fetchDimensions}
      />
    ) : null;
  }

  setHoverDisabled = () => this.setState((prevState) => ({
    ...prevState,
    hoverDisabled: false
  }))

  setHoverEnable = () => this.setState((prevState) => ({
    ...prevState,
    hoverDisabled: true
  }))

  setDimensionToState = ($$dimensions) => {
    this.setState((prevState) => ({
      ...prevState,
      dimensions: $$dimensions
    }));
  }
}

export default StepItem;
