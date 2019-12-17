test('', () => {})
/*
import React from 'react';
import { mount } from 'enzyme';
import SelectList from './';

describe('SelectList', () => {
  describe('renderItem', () => {
    it('should render one option when given one string option', () => {
      const wrapper = mount(<SelectList options={['Item-1']} />);
      const item = wrapper.find('.gio-select-option');
      expect(item).toHaveLength(1);
      expect(item.text()).toBe('Item-1');
    });

    const wrapper = mount(
      <SelectList
        valueKey='id'
        value={2}
        options={[
          { id: 1, name: 'Item-1' },
          { id: 2, name: 'Item-2' }
        ]}
      />
    );

    it('should render two options when given two object options', () => {
      const items = wrapper.find('.gio-select-option');
      expect(items).toHaveLength(2);
    });

    it('should render options with selected one when given correspoding value', () => {
      const selectedItem = wrapper.find('.gio-select-option.selected');
      expect(selectedItem).toHaveLength(1);
      expect(selectedItem.text()).toBe('Item-2')
    });
  })

  describe('labelRenderer', () => {
    it('should render label by labelRenderer if given labelRenderer prop', () => {
      const wrapper = mount(
        <SelectList
          options={['foo', 'bar']}
          labelRenderer={(option) => (
            <span className='customized-label'>{`customized-${option}`}</span>
          )}
        />
      );
      const item = wrapper.find('.customized-label');
      expect(item).toHaveLength(2);
      expect(item.first().text()).toBe('customized-foo');
    })

    it('should pass isGroup to labelRender if option\'s type was groupName', () => {
      const wrapper = mount(
        <SelectList
          options={[{ name: 'group', type: 'groupName' }]}
          labelRenderer={(option, isGroup) => (
            <span className='customized-label'>{`customized-${option.name}-${isGroup}`}</span>
          )}
        />
      );
      const item = wrapper.find('.customized-label');
      expect(item.first().text()).toBe('customized-group-true');
    })
  })
});
*/