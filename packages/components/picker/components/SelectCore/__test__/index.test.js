test('', () => {})
/*
import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Tab from '../Tab';

const TabOptions = [
  { tabKey: 'events', name: '选择事件', placeholder: '搜索事件',  options: [{ groupId: 'events', groupName: '选择事件', id: 'a', name: 'a' }]},
  { tabKey: 'variables', name: '选择变量', placeholder: '搜索变量',  options: [{ groupId: 'variables', groupName: '选择变量', id: 'a', name: 'a' }]}
]

describe('SelectCoreTab unit test', () => {
  const Component = (
    <Tab
      value={[]}
      onChange={jest.fn}
      tabOptions={TabOptions}
      valueKey={'id'}
      isMultiple={true}
      onSelect={jest.fn}
      handleChange={jest.fn}
      handleTabChange={jest.fn}
      height={450}
      emptyPlaceholder='没有找到相关结果'
      searchableFields={['name']}
    />
  )
  describe('SelectCoreTab snapshot ', () => {
    it('renders correctly', () => {
      const wrapper = shallow(Component);
      expect(toJSON(wrapper)).toMatchSnapshot();
    });
  })
});

*/