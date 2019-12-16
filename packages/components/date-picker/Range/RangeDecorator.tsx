import React from 'react';
import moment from 'moment';
import Content from './Content';
import Label from '../common/Label'
import { getMomentsFromRange, i18nRange } from './util/shortcutRange';
import flattenDate from '../flattenDate';

export interface RangeDecoratorProps {
    value: string,
    className?: string,
    shortcutIncludes?: string[],
    onChange?: (value: string, start: moment.Moment, end: moment.Moment) => void,
    labelComponent?: (labelProps: {
        label: string,
        onClick: () => void,
        className?: string,
        focus?: boolean
    }) => React.ReactNode,
    locale?: string,
    block?: string,
    overlayType?: 'dropdown' | 'popover',
    placeholder: string,
    minDate?: moment.Moment,
    maxDate?: moment.Moment,
    disabled?: boolean,
    overlayPlacement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom',
    getPopupContainer?: (triggerNode: Element) => HTMLElement,
    supportRelativeRange?: boolean
    inputLabelType?: 'normal' | 'now' | 'compare'
    visible?: boolean
    onVisibleChange?: (visible: boolean) => void
    errorMessage?: string
    validate?: (start: moment.Moment, end: moment.Moment) => ({ showError: boolean, errorMsg: string })
}

export interface RangeDecoratorState {
    visible: boolean
}

const RangeDecorator = (options: {}) => (Component: React.ClassType<any, any, any>) =>
class HOCRange extends React.Component<RangeDecoratorProps, RangeDecoratorState> {
    public static displayName = `HOCRange-${Component.displayName || 'Component'}`
    public static defaultProps: Partial<RangeDecoratorProps> = {
        onChange: () => ({}),
        placeholder: '时间范围',
        locale: 'zh',
        disabled: false,
        supportRelativeRange: true,
        inputLabelType: 'normal'
    }

    constructor(props: RangeDecoratorProps) {
        super(props)
        this.state = { visible: false }
    }

    public handleClick = () => {
        if (this.props.disabled) {
            return;
        }
        if (this.props.onVisibleChange) {
            this.props.onVisibleChange(false)
        } else {
            this.setState((prevState) => ({ visible: !prevState.visible }))
        }
    }
    public hide = () => {
        if (this.props.onVisibleChange) {
            this.props.onVisibleChange(false)
        } else {
            this.setState(() => ({ visible: false }))
        }
    }

    public handleVisibleChange = (visible: boolean) => {
        if (this.props.disabled) {
            return;
        }
        if (this.props.onVisibleChange) {
            this.props.onVisibleChange(visible)
        } else if (visible !== this.state.visible) {
            this.setState(() => ({ visible }))
        }
    }

    public handleOk = (value: string, start: moment.Moment, end: moment.Moment) => {
        const { onChange } = this.props
        onChange && onChange(value, start, end)
        this.hide()
    }

    public handleCancel = () => {
        this.hide()
    }

    public render() {
        return (
            <Component
                content={this.renderContent()}
                visible={this.props.visible || this.state.visible}
                onVisibleChange={this.handleVisibleChange}
                overlayType={this.props.overlayType}
                getPopupContainer={this.props.getPopupContainer}
                placement={this.props.overlayPlacement}
            >
                {this.renderLable()}
            </Component>
        )
    }
    public renderContent(): React.ReactNode {
        return (
            <Content
                block={this.props.block}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                value={this.props.value}
                shortcutIncludes={this.props.shortcutIncludes}
                supportRelativeRange={this.props.supportRelativeRange}
                locale={this.props.locale}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                inputLabelType={this.props.inputLabelType}
                validate={this.props.validate}
            />
        )
    }
    public renderLable(): React.ReactNode {
        const label = this.getLabelText()
        const visible = this.props.visible || this.state.visible
        if (this.props.labelComponent) {
            return this.props.labelComponent({
                label,
                onClick: this.handleClick,
                className: this.props.className,
                focus: visible
            })
        }
        return Label({
            label,
            onClick: this.handleClick,
            className: this.props.className,
            focus: visible
        })
    }
    private getLabelText(): string {
        const { value, placeholder, block } = this.props
        if (!value) {
            return placeholder
        }
        const replacedValue = value.replace(/\s/, '');
        if (replacedValue === 'auto') {
            return '上一周期';
        }
        if (!(/(since)|(day)|(week)|(month)|(year)|(abs)/.test(replacedValue))) {
            return placeholder
        }
        if (/since/.test(replacedValue)) {
            const date = moment(parseInt(replacedValue.replace(/since\:/, ''), 10)).format('YYYY-MM-DD');
            if (this.props.locale === 'en') {
                return `Since ${date}`;
            }
            return `${date} - 至今`
        }
        if (/abs:/.test(replacedValue)) {
            const ranges = this.formatValueToRangeTime(replacedValue)
            return `${ranges[0].format('YYYY/MM/DD')} - ${ranges[1].format('YYYY/MM/DD')}`
        }
        return i18nRange(replacedValue, this.props.locale === 'en' ? 'en' : 'cn');
    }
    private formatValueToRangeTime(value: string): moment.Moment[] {
        if (!(/abs/.test(value))) {
            const ranges = getMomentsFromRange(value)
            if (ranges.length === 0) {
                return [
                    moment().startOf('day'),
                    moment().endOf('day')
                ]
            }
            return ranges
        }
        const absRangeTimeStamp = value.replace('abs:', '').split(',').map((t: string) => parseInt(t, 10))
        return [
            moment(absRangeTimeStamp[0]).startOf('day'),
            moment(absRangeTimeStamp[1]).endOf('day')
        ]
    }
}

export default RangeDecorator
