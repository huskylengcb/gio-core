import React from 'react';
import Icon from '@gio-design/icon';
import './index.less';

interface  Props {
    label: string,
    onClick: () => void,
    className?: string,
    focus: boolean,
    placeholder?: string
}

const Label = (props: Props) => (
    <button
        className={`gio-datepicker-label ${props.className || ''} ${props.focus ? 'focus' : ''}`}
        onClick={props.onClick}
        type='button'
    >
        <Icon className='icon calendar' type='calendar' fill='#7F7583' />
        {props.label && (<span className='text' title={props.label}>{props.label}</span>)}
        <Icon className={`icon arrow_down ${props.focus ? 'focus' : ''}`} type='down' fill='#666' />
    </button>
);

export default Label
