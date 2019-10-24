import React from 'react';
import { getAllRanges, getIcludeRanges } from '../util/shortcutRange';
import Range from './Range';
import './index.less';

const defaultRanges = getAllRanges() as {
    [key: string]: string
};

interface Props {
    range: string,
    onClick: (value: string) => void,
    includes: string[],
    locale: string
}
export default class ShortcutButtons extends React.Component<Props> {
    public render() {
        const { includes } = this.props
        return (
            <ul className='gio-datepicker-shortcut-buttons'>
                {this.renderDefaultRanges()}
                {this.renderIcludeRanges()}
            </ul>
        )
    }
    public renderDefaultRanges(): React.ReactNode[] {
        const { includes, onClick, range, locale } = this.props
        if (Array.isArray(includes)) {
            return null
        }
        const labels = Object.keys(defaultRanges)
        return labels.map((label: string) => {
            const value = defaultRanges[label];
            const active = this.isActiveRange(value);
            return (
                <Range
                    key={label}
                    label={label}
                    value={value}
                    onClick={onClick}
                    active={active}
                    locale={locale}
                />
            )
        })
    }
    public renderIcludeRanges(): React.ReactNode[] {
        const { includes, onClick, locale } = this.props
        if (!Array.isArray(includes) || includes.length === 0) {
            return null
        }
        const includeRanges = getIcludeRanges(includes);
        const labels = Object.keys(includeRanges)
        return labels.map((label: string) => {
            const value = includeRanges[label];
            const active = this.isActiveRange(value);
            return (
                <Range
                    key={label}
                    label={label}
                    value={value}
                    onClick={onClick}
                    active={active}
                    locale={locale}
                />
            )
        })
    }
    public isActiveRange(value: string): boolean {
        let active: boolean = false
        const { range } = this.props
        if (range === value) {
            active = true
        }
        if (/since/.test(value) && /since/.test(range)) {
            active = true
        }
        return active
    }
}
