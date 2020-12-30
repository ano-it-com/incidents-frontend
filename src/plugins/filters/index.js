export * from './timestamp-to-date';

export function oncePad(value) {
  // eslint-disable-next-line
  let s = value + '';
  // eslint-disable-next-line
  while (s.length < 2) s = '0' + s;
  return s;
}
