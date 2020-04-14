import React from 'react';
import { get, cloneDeep } from 'lodash';
import { getEventType } from '../../helper';
import Metric from '@gio-core/types/Metric';
import renderMap from './renderMap';
import Popover from 'antd/lib/popover';

import './style.less';

const delay = (delayTime) => {
  const delay = typeof delayTime === 'string' ? parseInt(delayTime, 10) : delayTime;
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

interface Props {
  target: any, // 被选中的事件或指标
  pages?: Metric[], // 所有页面型无埋点事件，用于元素型无埋点事件的预览展示
  labels?: any[], // 所有可用的标签
  style?: React.CSSProperties, // style会覆盖默认样式
  timeRange?: any,
  preparedMetrics?: any[],
  delay?: string | number,
}
interface State {
  screenshotModalVisible: boolean,
  cache: object,
  visible: boolean,
}
// 默认样式
const defaultStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  right: '-330px',
  overflowY: 'auto',
  width: '330px',
  height: '100%',
  padding: '0 15px 40px 15px',
  backgroundColor: '#fff',
  boxShadow: '0 1px 6px rgba(0, 0, 0, 0.2)',
}

const popoverStyle: React.CSSProperties = {
  position: 'static',
  boxShadow: 'none,'
}

class Preview extends React.PureComponent<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      screenshotModalVisible: false,
      cache: {},
      visible: !props.delay,
    };
  }

  public async componentDidUpdate(preProps: Props) {
    // 如果设置了delay属性，当鼠标是第一次移动到某一个可触发预览的元素上时，或者从一个这样的元素移动到另外一个这样的元素上时，都会进行计时
    // 计时结束后才会显示预览
    const firstEnter = !preProps.target && this.props.target;
    const changeTarget = this.props.target && preProps.target.id !== this.props.target.id;
    if (this.props.delay && (firstEnter || changeTarget)) {
      this.setState({ visible: false });
      await delay(this.props.delay);
      this.setState({ visible: true });
    }
  }

  public render() {
    if (!this.state.visible) { return null; }
    const { target, pages, timeRange, labels, preparedMetrics } = this.props;
    // 预定义指标中的任意行为不会展示预览
    if (!target || (target.type === 'prepared' && /^retentionuv$|^uv_[a-zA-Z]+$/.test(target.id) && /^任意行为/.test(target.name))) { return null; }
    // 如果taret没有id和definition，说明这个事件或指标已经被删除或没有权限查看
    // 未定义的元素没有id，但是会有definition，将会展示预览
    if (!target.id && !target.definition) { return null; }

    let { style } = this.props

    // 检测预览模块即将出现的位置，如果这个位置过于贴近屏幕边缘，就在另一侧生成预览面板
    if (this.needToMove()) {
      style = { ...style, right: '370px' }
    }

    // 预览组件的主体内容
    const previewType = target.type ? target.type : `${getEventType(target)}`;

    // 生成渲染函数所需的参数
    const params = {
      target,
      timeRange,
      labels,
      pages,
      preparedMetrics,
      cache: this.state.cache,
      setCache: this.setCache,
      deleteCache: this.deleteCache,
    };

    const previewContent = (
      <div className='event-preview-panel'>
        {target.type !== 'custom' && (
          <div className='event-preview-header'>
            <h1 title={get(target, 'name')}>{get(target, 'name')}</h1>
          </div>
        )}
        {/* 根据所要展示的事件或是指标的类型选择对应的渲染函数，并且执行它，生成预览的主体信息 */}
        {renderMap[previewType] && renderMap[previewType](params)}
      </div>
    );

    if (this.props.children) {
      const popContent = <div style={{...defaultStyle, ...popoverStyle, ...style}}>{previewContent}</div>;
      return (
        <Popover
          content={popContent}
          placement='right'
          overlayClassName='previewPop'
        >
          {this.props.children}
        </Popover>
      )
    } else {
      return <div style={{...defaultStyle, ...style}}>{previewContent}</div>;
    }
  }
  // 检测预览模块即将出现的位置
  private needToMove = () => {
    if (!document.getElementById('viewport') || !document.querySelector('.gio-picker.ant-popover-content')) { return false; }
    const viewPortRect = document.getElementById('viewport').getBoundingClientRect();
    const pickerRect = document.querySelector('.gio-picker.ant-popover-content').getBoundingClientRect();
    if (pickerRect.right + 370 > viewPortRect.width) {
      return true;
    }
    return false;
  };

  private setCache = (cacheId, data) => {
    this.setState({
      cache: { ...this.state.cache, [cacheId]: data }
    });
  }

  private deleteCache = (cacheId) => {
    const cache = cloneDeep(this.state.cache);
    delete cache[cacheId];
    this.setState({ cache });
  }
};

export default Preview;
