import React from 'react';

const styles = require('./index.less');
interface Props {
    type: 'start' | 'end',
    value: any,
    locale?: string
}

const HeaderLabel = ({
    type,
    value,
    locale
}: Props) => (
    <h4 className='gio-datepicker-header'>
        <label>
            {type === 'start' ?  startText(locale) : endText(locale)}
        </label>
        <span>{value}</span>
    </h4>
)

const startText = (locale: string) => locale === 'en' ? 'start：' : '开始时间：';
const endText = (locale: string) => locale === 'en' ? 'end：' : '结束时间：';
export default HeaderLabel;
