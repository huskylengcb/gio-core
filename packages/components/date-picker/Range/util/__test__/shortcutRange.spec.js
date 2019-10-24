import {
    getAllRanges
} from '../shortcutRange';

test('queryRangesHandle getAllRangeValues testing', () => {
    const allRanges = getAllRanges()
    const keys = Object.keys(allRanges)
    keys.forEach((key) => {
        expect(typeof key === 'string').toBe(true)
        expect(typeof allRanges[key] === 'string').toBe(true)
    })
})