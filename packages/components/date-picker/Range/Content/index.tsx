import React from 'react';
import moment from 'moment';
import { getRangeFromKey, getMomentsFromRange } from '../util/shortcutRange'
import RangeDatePicker from '../RangeDatePicker';
import ShortcutButtons from '../ShortcutButtons';
import Button from '@gio-design/components/lib/button';
import Gap from '@gio-design/components/lib/gap';
import Icon from '@gio-design/icon';
import InputLabel from '../InputLabel';
import bemClsFactor from '../../bemClsFactor';
import './index.less';

const cls = bemClsFactor('gio-datepicker-range')

export interface DateRangeContentPickerProps {
    value?: string,
    onOk?: (value: string, start: moment.Moment, end: moment.Moment) => void,
    shortcutIncludes?: string[],
    locale: string,
    minDate?: moment.Moment,
    maxDate?: moment.Moment
    onCancel?: () => void
    inputLabelType?: 'normal' | 'now' | 'compare'
    // errorMessage?: string
    validate?: (start: moment.Moment, end: moment.Moment) => ({ showError: boolean, errorMsg: string })
}

interface DateRangeContentState {
    value: string,
    start: moment.Moment,
    end: moment.Moment
}

const defaultValue = getRangeFromKey('last_7_day')

export default class DateRangeContent extends React.Component<DateRangeContentPickerProps, DateRangeContentState> {
    public static defaultProps: Partial<DateRangeContentPickerProps> = {
        // errorMessage: '已超出时间范围，对比的时间天数要相同',
        validate: (start, end) => ({ showError: false, errorMsg: '' })
    }

    constructor(props: DateRangeContentPickerProps) {
        super(props);
        const ranges = getRangeFromPropsValue({
            value: props.value,
            defaultValue
        })
        this.state = {
            value: 'value' in props ? props.value : defaultValue,
            start: ranges[0],
            end: ranges[1]
        }
    }

    public componentWillReceiveProps(nextProps: DateRangeContentPickerProps) {
        if (!('value' in nextProps) && nextProps.value === this.props.value) {
            return
        }
        const nextState = this.getStateFromProps(nextProps)
        this.setState(() => nextState)
    }

    public handleChange = (start: moment.Moment, end: moment.Moment) => {
        this.setState(() => ({
            value: '',
            start,
            end
        }))
    }

    public handleRangeClick = (value: string) => {
        const ranges = getRangeFromPropsValue({ value, startTime: this.state.start })

        this.setState(() => ({
            value: /since/.test(value) ? `${value}:${ranges[0].valueOf()}` : value,
            start: ranges[0],
            end: ranges[1]
        }), () => this.handleOk())
    }

    public handleOk = () => {
        if (!this.props.onOk) {
            return
        }
        const { onOk } = this.props
        const { start, end, value } = this.state
        const startOfDay = start.clone().startOf('day')
        const endOfDay = end.clone().endOf('day')
        if (value) {
            onOk(value, startOfDay, endOfDay)
        } else {
            onOk(`abs:${startOfDay.valueOf()},${endOfDay.valueOf()}`, startOfDay, endOfDay)
        }
    }

    public render() {
        const { start, end, value } = this.state
        const { showError, errorMsg } = this.props.validate(start, end)
        return (
            <div>
                <InputLabel type={this.props.inputLabelType} />
                <div className={`${cls('content')} ${this.props.inputLabelType}`}>
                    <RangeDatePicker
                        startTime={start}
                        endTime={end}
                        onChange={this.handleChange}
                        minDate={this.props.minDate}
                        maxDate={this.props.maxDate}
                        locale={this.props.locale}
                    />
                    <div className='operate'>
                        <ShortcutButtons
                            range={this.state.value}
                            onClick={this.handleRangeClick}
                            includes={this.props.shortcutIncludes}
                            locale={this.props.locale}
                        />
                    </div>
                </div>
                <div className={cls('footer')}>
                    <div className={cls('footer-errMsg')}>
                        {showError ? <Icon type='information-circle' fill='#F55252' /> : undefined}
                        <Gap width={5} />
                        {showError ? errorMsg : undefined}
                    </div>
                    <div className={cls('footer-button-wrapper')}>
                        <Button
                            type='subtle'
                            onClick={this.handleCancel}
                            size='middle'
                        >
                            取消
                        </Button>
                        <Gap width={10}/>
                        <Button
                            type='secondary'
                            onClick={this.handleOk}
                            disabled={showError || !(start && end)}
                            size='middle'
                        >
                            {this.props.locale === 'en' ? 'confirm' : '确定'}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    private handleCancel = () => {
        if (this.props.onCancel) { this.props.onCancel() }
        const propsState = this.getStateFromProps(this.props)
        this.setState(() => propsState)
    }

    private getStateFromProps = (props) => {
        const ranges = getRangeFromPropsValue({
            value: props.value,
            defaultValue
        })
        return {
            value: props.value,
            start: ranges[0],
            end: ranges[1]
        }
    }
}

const getRangeFromPropsValue = (props: {
    value?: string,
    defaultValue?: string,
    startTime?: moment.Moment
}): moment.Moment[] => {
    const { value, defaultValue, startTime } = props
    if (!value) {
        return getMomentsFromRange(defaultValue)
    }
    if (/abs/.test(value)) {
        return getABSRange(value)
    }
    if (/^since\:\d+/.test(value)) {
        return getSinceRangeFromNumber(parseInt(value.replace('since:', ''), 10))
    }
    if (value === 'since') {
        return getSinceRangeFromMoment(startTime || moment().startOf('day'))
    }
    return getMomentsFromRange(value)
}
const getABSRange = (value: string): moment.Moment[] => {
    const absRangeTimeStamp = value.replace('abs:', '').split(',').map((t: string) => parseInt(t, 10))
    return [
        moment(absRangeTimeStamp[0]).startOf('day'),
        moment(absRangeTimeStamp[1]).startOf('day')
    ]
}

const getSinceRangeFromMoment = (startTime: moment.Moment) => {
    return [
        startTime,
        moment().startOf('day')
    ]
}

const getSinceRangeFromNumber = (startTime: number) => {
    return [
        moment(startTime),
        moment().startOf('day')
    ]
}
