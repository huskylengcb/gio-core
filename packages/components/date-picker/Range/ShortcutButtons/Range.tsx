import React from 'react';
import { getTooltipFromKey, getKeyFromRange, i18nRange, getText } from '../util/shortcutRange';

interface Props {
    label: string,
    value: string,
    onClick: (value: string) => void,
    active: boolean,
    locale: string
}

// const Tooltip = require('antd/lib/tooltip');
import Tooltip from '@gio-design/components/lib/tooltip';

export default class Range extends React.PureComponent<Props> {
    public handleClick = () => {
        const { label, onClick, value, active } = this.props;
        if (active) {
            return
        }
        onClick(value)
    }
    public render() {
        const { label, value, active } = this.props
        const tooltip = getTooltipFromKey(label)
        return (
            <li className={`range ${active && 'active'}`} onClick={this.handleClick}>
                {tooltip ? this.renderTooltip(tooltip) : this.renderLabel()}
            </li>
        )
    }
    public renderTooltip(tooltip: string) {
        const { value } = this.props
        return (
            <Tooltip title={tooltip} placement='bottom'>
                {this.renderLabel()}
            </Tooltip>
        )
    }
    public renderLabel(): JSX.Element | string {
        const { label, locale } = this.props
        const key = getKeyFromRange(label)
        const isSince = key === 'since'
        return isSince ? this.renderSinceLabel() : getText(label, locale === 'en' ? 'en' : 'cn')
    }
    public renderSinceLabel(): JSX.Element {
        const { locale } = this.props
        return (
            <span className='since'>
                {i18nRange('since', locale === 'en' ? 'en' : 'cn')}
            </span>
        )
    }
}
