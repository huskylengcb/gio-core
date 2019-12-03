import React from 'react';
import update from 'immutability-helper';
import createSortableItem, { ItemWithId } from '../SortableItem';
import _ from 'lodash';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

export interface SortableCollectionProps {
  type: string;
  container: string;
  collection: ItemWithId[];
  onSorted: (collection: ItemWithId[]) => any;
  getId?: (item: ItemWithId, index: number) => string;
  template: React.ReactElement<any>
}

export interface SortableCollectionState {
  collection: ItemWithId[];
  SortableItemClass: React.Component
}

export default class SortableCollection extends React.PureComponent<SortableCollectionProps, {}> {
  public static defaultProps = { container: 'div' };

  public state = {
    collection: this.props.collection,
    SortableItemClass: createSortableItem()
  };

  public componentWillReceiveProps(nextProps: SortableCollectionProps) {
    this.setState({ collection: nextProps.collection });
  }

  public render() {
    const SortableItem = this.state.SortableItemClass;

    const children = this.state.collection.map((props, i) => {
      const originalPosition = this.props.collection.indexOf(props);
      const key = this.props.getId ? this.props.getId(props, i) : props.id;
      return (
        <SortableItem
          sortData={props}
          index={i}
          key={key}
          position={originalPosition}
          onHover={this._handleHover}
          onDrop={this._handleDrop}
          onCancel={this._handleCancel}
          template={this.props.template}
        />
      );
    });

    return (
      <DndProvider backend={HTML5Backend}>
        {
          React.createElement(this.props.container, _.omit(this.props, ['collection', 'container', 'onSorted', 'template']), children)
        }
      </DndProvider>
    )
  }

  private _handleHover = (originalSourcePosition: number, originalTargetPosition: number) => {
    const source                = this.props.collection[originalSourcePosition];
    const currentSourcePosition = this.state.collection.indexOf(source);
    const target                = this.props.collection[originalTargetPosition];
    const currentTargetPosition = this.state.collection.indexOf(target);
    if (source) {
      this.setState(update(this.state, {
        collection: { $splice: [
          [currentSourcePosition, 1],
          [currentTargetPosition, 0, source]
        ] }
      }));
    }
  }

  private _handleDrop = () => {
    if (this.props.collection !== this.state.collection) {
      this.props.onSorted(this.state.collection);
    }
  }

  private _handleCancel = () => {
    this.setState({ collection: this.props.collection });
  }
}
