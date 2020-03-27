import React from 'react';
import moment from 'moment';
import { getRangeFromKey, getMomentsFromRange } from '../util/shortcutRange'
import RangeDatePicker from '../RangeDatePicker';
import ShortcutButtons from '../ShortcutButtons';
import Button from '@gio-design/components/lib/button';
import Gap from '@gio-design/components/lib/gap';
import Input from '@gio-design/components/lib/input';
import Icon from '@gio-design/icon';
import InputLabel from '../InputLabel';
import bemClsFactor from '../../../../utils/bemClsFactor';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { ValidInputElement } from 'antd/lib/auto-complete';
import './index.less';
import flattenDate from '../../flattenDate';

const cls = bemClsFactor('gio-datepicker-range')

export interface DateRangeContentPickerProps {
    value?: string,
    block?: string,
    onOk?: (value: string, start: moment.Moment, end: moment.Moment) => void,
    shortcutIncludes?: string[],
    supportRelativeRange?: boolean
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
    end: moment.Moment,
    lastN: number
}

const defaultValue = getRangeFromKey('last_7_day')

export default class DateRangeContent extends React.Component<DateRangeContentPickerProps, DateRangeContentState> {
    public static defaultProps: Partial<DateRangeContentPickerProps> = {
        // errorMessage: '已超出时间范围，对比的时间天数要相同',
        validate: (start, end) => ({ showError: false, errorMsg: '' })
    }

    private lastNRef;

    constructor(props: DateRangeContentPickerProps) {
        super(props);
        const { start, end, lastN } = this.getStateFromProps(props)
        this.lastNRef = React.createRef();
        const { value } = props.value ? this.getStateFromProps(props) : { value: defaultValue }
        this.state = {
            value,
            start,
            end,
            lastN
        }
    }

    public componentWillReceiveProps(nextProps: DateRangeContentPickerProps) {
        if (!('value' in nextProps) && nextProps.value === this.props.value) {
            return
        }
        if (this.props !== nextProps) {
            const nextState = this.getStateFromProps(nextProps)
            this.setState(() => nextState)
        }
    }

    public handleChange = (start: moment.Moment, end: moment.Moment) => {
        if (this.props.block) {
            const flattenBlock = flattenDate(this.props.block)
            const flattenTimeRange = flattenBlock.endTime - flattenBlock.startTime
            const selectEndMoment = start.endOf('day')
            const selectStartMoment = moment(start.valueOf() - flattenTimeRange + 1).startOf('day')
            this.setState({
                value: '',
                start: selectStartMoment,
                end: selectEndMoment
            }, () => {
                if (this.props.block) {
                    this.handleOk()
                }
            })
            return;
        }
        this.setState(() => ({
            value: '',
            start,
            end
        }))
    }

    public handleRangeClick = (value: string) => {
        const ranges = this.getRangeFromPropsValue({ value, startTime: this.state.start })

        if (value === 'last:n') {
            setTimeout(() => {
                if (this.lastNRef) {
                    (ReactDOM.findDOMNode(this.lastNRef) as HTMLInputElement).focus();
                }
            }, 300)
        }
        this.setState(() => ({
            value: /since/.test(value) ? `${value}:${ranges[0].valueOf()}` : value,
            start: ranges[0],
            end: ranges[1],
            lastN: undefined
        }), () => {
            if (value !== 'last:n') {
                this.handleOk()
            }
        })
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
            if (value === 'last:n') {
                onOk(`day:${this.state.lastN + 1},1`, startOfDay, endOfDay)
            } else {
                onOk(value, startOfDay, endOfDay)
            }
        } else {
            onOk(`abs:${startOfDay.valueOf()},${endOfDay.valueOf()}`, startOfDay, endOfDay)
        }
    }

    public render() {
        const { start, end, value } = this.state
        const { showError, errorMsg } = this.props.validate(start, end)
        const isLastN = !!(value === 'last:n' || this.state.lastN);
        const lastNError = isLastN && this.state.lastN <= 0;
        const lastNEmpty = !this.state.lastN;
        return (
            <div>
                <InputLabel type={this.props.inputLabelType} />
                {
                    isLastN && (
                        <span className='last-n-input'>
                            过去&nbsp;
                            <Input ref={(element) => { this.lastNRef = element }} type='number' min={1} placeholder='N' value={this.state.lastN} onChange={this.handleLastNChange} />
                            &nbsp;天&nbsp;&nbsp;
                            {
                                lastNError && (<span className='error'>请输入正确天数</span>)
                            }
                        </span>
                    )
                }
                <div className={cn(cls('content'), this.props.inputLabelType, {
                    'last-n': isLastN
                })}>
                    {
                        <RangeDatePicker
                            startTime={start}
                            endTime={end}
                            onChange={this.handleChange}
                            minDate={this.props.minDate}
                            maxDate={this.props.maxDate}
                            locale={this.props.locale}
                        />
                    }
                    <div className='operate'>
                        <ShortcutButtons
                            range={isLastN ? 'last:n' : this.state.value}
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
                        <Gap width={10} />
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

    private handleLastNChange = (e: React.FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.valueAsNumber;
        this.setState({
            lastN: value
        })
    }

    private handleCancel = () => {
        if (this.props.onCancel) { this.props.onCancel() }
        const propsState = this.getStateFromProps(this.props)
        this.setState(() => propsState)
    }

    private getStateFromProps = (props) => {
        const ranges = this.getRangeFromPropsValue({
            value: props.value,
            defaultValue
        })
        const lastNRegex = /day:([0-9]*),1/;
        const lastNMatch = props.value && props.value.match(lastNRegex);
        const day = lastNMatch ? (parseInt(lastNMatch[1], 10) - 1) : undefined;
        const lastN = this.props.shortcutIncludes.map((s => getRangeFromKey(s))).indexOf(props.value) < 0 ? day : undefined;
        return {
            value: lastN ? 'last:n' : props.value,
            start: ranges[0],
            end: ranges[1],
            lastN
        }
    }
    private getRangeFromPropsValue = (props: {
        value?: string,
        defaultValue?: string,
        startTime?: moment.Moment,
    }): moment.Moment[] => {
        const { value, defaultValue, startTime } = props
        if (!value) {
            return getMomentsFromRange(defaultValue)
        }
        if (value === 'auto') {
            const block = this.props.block;
            const origin = flattenDate(block);
            const blockLast = Math.ceil((origin.endTime - origin.startTime) / 6048e5) * 6048e5;
            return [
                moment(origin.startTime - blockLast),
                moment(origin.endTime - blockLast)
            ]
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
