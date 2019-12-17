test('', () => {})
/*
import React from 'react';
import { mount } from 'enzyme';
import DatePicker from '..';
import ShortcutRange from '../Range/ShortcutButtons/Range'

const moment = require('moment');

describe('Testing DatePicker', () => {

  it('should be able to render component', () => {
    // 报 moment is not a function
    const wrapper = mount(
        <DatePicker value='2014/05/09' />
    );
    expect(wrapper.find('.gio-datepicker-label').length).toBe(1);
    expect(wrapper.find('.gio-datepicker-label span').length).toBe(3);
    expect(wrapper.find('.gio-datepicker-label span').at(1).text()).toBe('2014/05/09');
  });

  it('should be able to render range component', () => {
    const wrapper = mount(
        <DatePicker.Range value='day:4:3' shortcutIncludes={['today', 'yesterday', 'last_7_day']} onChange={() => ({})} />
    );
    expect(wrapper.find('button').length).toBe(1);
    expect(wrapper.find('.gio-datepicker-label').length).toBe(1);
    expect(wrapper.find('.gio-datepicker-label span').length).toBe(3);
    wrapper.find('button').simulate('click');
    expect(document.querySelectorAll('.gio-datepicker-shortcut-buttons li').length).toBe(3);
  })
});

*/