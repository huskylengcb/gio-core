import { format } from '../date';

describe('date utils', () => {
  test('format', () => {
    expect(format(1576646656343)).toBe('2019/12/18 13:24:16')
  })
})