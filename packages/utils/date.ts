import { format as formatDate } from 'date-fns';

export enum DateFormat {
  default = 'yyyy/MM/dd HH:mm:ss'
}

export const format = (
  date: Date | number,
  fmt: string = DateFormat.default
): string => formatDate(date, fmt)