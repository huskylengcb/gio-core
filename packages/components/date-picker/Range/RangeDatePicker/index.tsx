import React from 'react';
import { Moment } from 'moment';
import DatePicker from '../../common/DateRangePicker';
import './index.less';

const moment = require('moment');
export interface RangeDatePickerProps {
    startTime?: Moment,
    endTime?: Moment,
    onChange: (startTime: Moment, endTime: Moment) => void,
    minDate?: Moment,
    maxDate?: Moment,
    locale: string
}

interface RangeDatePickerState {
    start: Moment,
    end: Moment
}

export default class RangeDatePicker extends React.PureComponent<RangeDatePickerProps, RangeDatePickerState> {
    constructor(props: RangeDatePickerProps) {
        super(props);
        let start = moment().startOf('day');
        let end = moment().endOf('day');
        if ('startTime' in props && props.startTime) {
            start = props.startTime;
        }
        if ('endTime' in props && props.endTime) {
            end = props.endTime;
        }
        this.state = {
            start,
            end
        }
    }
    public componentWillReceiveProps(nextProps: RangeDatePickerProps) {
        const nextStartTime = nextProps.startTime
        const nextEndTime = nextProps.endTime
        if (!('startTime' in nextProps) || !('endTime' in nextProps)) {
            return
        }
        if (
            nextStartTime &&
            nextEndTime &&
            nextStartTime.isSame(this.state.start) &&
            nextEndTime.isSame(this.state.end)
        ) {
            return
        }
        this.setState(() => ({
            start: nextProps.startTime,
            end: nextProps.endTime
        }))
    }

    public render() {
        const { minDate, maxDate, locale } = this.props;
        const { start, end } = this.state;
        return (
            <div className='gio-datepicker-range-date'>
                <DatePicker
                    className='gio-datepicker-range-date-child'
                    value={[start, end]}
                    onChange={this.onChange}
                    disabledDate={this.disabledDate}
                    locale={locale}
                />
            </div>
        )
    }

    private onChange = ([startMoment, endMoment]) => {
        if ('startTime' in this.props && 'endTime' in this.props) {
            const { onChange } = this.props
            onChange(startMoment, endMoment)
        } else {
            this.setState(() => ({
                start: startMoment,
                end: endMoment
            }))
        }
    }

    private disabledDate = (current: any): boolean => {
        const { minDate, maxDate } = this.props;
        let isDisabledDate = false;
        if (minDate && !maxDate) {
            isDisabledDate = moment(current).isBefore(minDate);
        }
        if (!minDate && maxDate) {
            isDisabledDate = moment(maxDate).isBefore(current);
        }
        if (minDate && maxDate) {
            isDisabledDate = moment(maxDate).isBefore(current) || moment(current).isBefore(minDate);
        }
        return isDisabledDate;
    }
}
