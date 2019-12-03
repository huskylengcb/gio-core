import React, {  cloneElement } from 'react';
import classnames from 'classnames';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import reactDnd from 'react-dnd';
import flow from 'lodash/flow';
import './index.less';

export interface ItemWithId {
  id: string | number;
}

export interface SortableItemProps {
  template: React.ReactElement<any>;
  index: number;
  position: number;
  sortData: ItemWithId;
  className?: string;
  onDrop: () => any;
  onCancel: () => any;
  onHover: ( sourcePosition: number, targetPosition: number ) => any;
}

export interface WrappedSortableItemProps extends SortableItemProps {
  connectDragSource: reactDnd.ConnectDragSource;
  connectDropTarget: reactDnd.ConnectDropTarget;
  isDragging: boolean;
  isOver: boolean;
}

const dragSource = {
  beginDrag(props: SortableItemProps, monitor, component) {
    return {
      position: props.position
    };
  },

  endDrag(props: SortableItemProps, monitor: reactDnd.DragSourceMonitor) {
    if (monitor.didDrop()) {
      props.onDrop();
    } else {
      props.onCancel();
    }
  }
};

const dropTarget = {
  hover(props: SortableItemProps, monitor: reactDnd.DropTargetMonitor) {
    const sourcePosition = (monitor.getItem() as SortableItemProps).position;
    const targetPosition = props.position;

    if (sourcePosition !== targetPosition) { props.onHover(sourcePosition, targetPosition); }
  }
};

function collectSource(connect: reactDnd.DragSourceConnector, monitor: reactDnd.DragSourceMonitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

function collectTarget(connect: reactDnd.DropTargetConnector, monitor: reactDnd.DropTargetMonitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class Item extends React.PureComponent<WrappedSortableItemProps, {}> {

  public state = {
    hovered: false
  }

  public componentDidMount() {
    const ref = this._createRef();
    const { connectDragSource, connectDropTarget } = this.props;
    const domNode = findDOMNode(this.refs[ref]) as any as React.ReactElement<{}>;
    connectDragSource(domNode);
    connectDropTarget(domNode);
  }

  public render() {
    const isOver = this.props.isOver;
    const isDragging = this.props.isDragging;
    return cloneElement(this.props.template, {
      sortData: this.props.sortData,
      index: this.props.index,
      isOver,
      isDragging,
      ref: this._createRef(),
      onMouseEnter: this._onMouseEnter,
      onMouseLeave: this._onMouseLeave,
      onDragStart: this._onDragStart,
      className: classnames(this.props.className, 'gio-sortable-item', { 'is-over': isOver, 'is-dragging': isDragging, 'is-hovered': this.state.hovered })
    });
  }

  private _onDragStart  = () => {
    this.setState({
      hovered: false
    });
  }

  private _onMouseEnter = () => {
    this.setState({
      hovered: true
    });
  }

  private _onMouseLeave = () => {
    this.setState({
      hovered: false
    });
  }

  private _createRef() {
    const position = this.props.position;
    const id = this.props.sortData.id;
    return `${id}${position}`;
  }
}

export default () => {
  const type = 'item';
  return DragSource(type, dragSource, collectSource)(DropTarget(type, dropTarget, collectTarget)(Item))
  // return flow(
  //   DropTarget(type, dropTarget, collectTarget),
  //   DragSource(type, dragSource, collectSource)
  // )(Item);
};
