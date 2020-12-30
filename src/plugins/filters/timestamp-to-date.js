import moment from 'moment';

export function timestampToDate(timestamp, format = 'DD.MM.YY HH:mm') {
  return moment.unix(timestamp).format(format);
}
