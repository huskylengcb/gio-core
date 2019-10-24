import moment from 'moment';

const str = 'YYYY/MM/DD';
const format = (v: number, formatStr: string = str) => v ? moment(v).format(formatStr) : ''

export default format
