import React from 'react';
import DatePickerDecorator from './DatePickerDecorator';
import OverlayType from './common/OverlayType'
import Range, { RangeDatePickerProps } from './Range';
import CompareDatePicker from './CompareDatePicker';

const DatePicker = DatePickerDecorator()(OverlayType)
DatePicker.Range = Range
DatePicker.CompareDatePicker = CompareDatePicker
export default DatePicker

export { RangeDatePickerProps }
