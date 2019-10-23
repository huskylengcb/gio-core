import React, { Component } from 'react';
import _ from 'lodash';
import http from '@gio-core/utils/http';

interface IncomingProperty {
  checkedTagId: any[]; // 该事件绑定的标签，数组中的一个对象可能只包含一个id字段，或者checkedTagId是一个字符串数组
  tagList: Label[]; // 所有可用标签的列表，数组中的每个对象都包含一个tag的全部信息
};

interface InnerState {
  tagList: any[];
}

interface Label {
  id: string;
  name: string;
  color: string;
  description?: string;
  creator: string;
  createdAt: number | string;
  updater: string;
  updatedAt: number | string;
}

class Tags extends Component<IncomingProperty, InnerState> {

  constructor(props) {
    super(props);
    this.state = {
      tagList: this.getTaglist(props),
    };
  }

  public render() {
    const checkedTagId = this.props.checkedTagId;
    const tagList = this.state.tagList;
    const checkedTags = this.renderCheckedTags(checkedTagId, tagList);

    return (
      <React.Fragment>
        <span className='tagTitle'>业务标签</span>
        {checkedTags}
      </React.Fragment>
    );
  }

  private getTaglist = (props) => {
    if (props.tagList && !_.isEmpty(props.tagList)) {
      // 如果props中存在所有可用标签的列表，就不用调用接口获取
      return props.tagList;
    } else {
      http.get(`/v3/projects/${window.project.id}/labels`).then((res) => {
        this.setState({ tagList: res });
      }).catch((error) => {
        _.noop();
      });
      return [];
    }
  }

  private renderCheckedTags = (checkedTagId: any[], tagList: Label[]) => {
    const array = [];
    if (!Array.isArray(checkedTagId)) {
      return array;
    }
    checkedTagId.map((item) => {
      let result;
      if (typeof item === 'string') {
        // item即为tag的id
        result = _.find(tagList, { id: item });
      } else {
        // item为{ id: xxx }
        result = _.clone(_.find(tagList, { id: item.id }));
      }
      if (result) {
        array.push(<div className='tag' key={item}>{result.name}</div>);
      }
    });
    return array;
  }
}

export default Tags;
