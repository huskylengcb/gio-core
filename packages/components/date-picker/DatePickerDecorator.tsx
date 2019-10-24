import React from 'react';
import moment, { Moment } from 'moment';
import DatePicker from './common/DatePicker';
import Label from './common/Label'
import './index.less';

interface HOCDatePickerProps {
    value: string,
    onChange: (value: string) => void,
    labelComponent?: (labelProps: {
        label: string,
        onClick: () => void,
        focus: boolean
    }) => React.ReactNode | React.ClassType<any, any, any>,
    className?: string,
    format: string,
    overlayType?: 'dropdown' | 'popover',
    locale: string,
    disabledDate?: (current: Moment) => boolean,
}

interface HOCDatePickerState {
    visible: boolean,
    value: Moment
}

const DatePickerDecorator = (options = {}) => (Component: React.ClassType<any, any, any>) =>
class HOCDatePicker extends React.Component<HOCDatePickerProps, HOCDatePickerState> {
    public static Range: any
    public static CompareDatePicker: any
    public static defaultProps: {
        format: string,
        locale: string
    } = {
        format: 'YYYY/MM/DD',
        locale: 'zh'
    }
    public static displayName = `HOCDatePicker-${Component.displayName || 'Component'}`
    constructor(props: HOCDatePickerProps) {
        super(props);
        let value = moment().startOf('day');
        if ('value' in props && value) {
            value = moment(props.value, props.format).startOf('day')
        }
        this.state = {
            visible: false,
            value
        }
    }
    public componentWillReceiveProps(nextProps: HOCDatePickerProps) {
        if ('value' in nextProps) {
            this.setState((prevState) => ({
                ...prevState,
                value: nextProps.value ? moment(nextProps.value, nextProps.format).startOf('day') : moment().startOf('day')
            }))
        }
    }
    public handleClick = () => {
        this.setState((prevState) => ({ visible: !prevState.visible }))
    }
    public hide = () => {
        this.setState(() => ({ visible: false }))
    }
    public handleVisibleChange = (visible: boolean) => {
        if (visible !== this.state.visible) {
            this.setState(() => ({ visible }))
        }
    }
    public handleChange = (value: Moment) => {
        const { onChange, format } = this.props
        onChange(value.format(format))
        if (this.state.value.date() !== value.date()) {
            this.hide()
        }
    }
    public render() {
        return (
            <Component
                content={this.renderContent()}
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
                overlayType={this.props.overlayType}
            >
                {this.renderLable()}
            </Component>
        )
    }
    public renderContent(): React.ReactNode {
        return (
            <DatePicker
                onChange={this.handleChange}
                value={this.props.value ? moment(this.props.value, this.props.format).startOf('day') : moment()}
                calendarClassName='gio-datepicker-calendar'
                locale={this.props.locale}
                disabledDate={this.props.disabledDate}
            />
        )
    }
    public renderLable(): React.ReactNode {
        if (this.props.labelComponent) {
            return this.props.labelComponent({
                label: this.props.value || '请选择',
                onClick: this.handleClick,
                focus: this.state.visible
            })
        }
        return Label({
            label: this.props.value || '请选择',
            onClick: this.handleClick,
            className: this.props.className,
            focus: this.state.visible
        })
    }
}

export default DatePickerDecorator;
