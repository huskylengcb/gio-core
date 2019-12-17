test('date-filter', () => {
})
/*
import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import DataFilter, { Props } from '.';
import 'jest';

describe('DataFilter', () => {
  const mockData = [
    { id: 1, name: 'a' },
    { id: 2, name: 'b' },
    { id: 3, name: 'c' }
  ];

  describe('render children', () => {
    it('should render children component with parent data', () => {
      const wrapper = getDataFilterWrapper({ data: mockData });
      expect(findContent(wrapper)).toBe('1,2,3');
    })
  });

  describe('filter data', () => {
    it('should ignore if filter value and match were undefined', () => {
      const wrapper = getDataFilterWrapper({
        data: mockData,
        filters: { id: {}, name: {} }
      });
      expect(findContent(wrapper)).toEqual('1,2,3');
    })

    it('should filter data with default equal filter', () => {
      const wrapper = getDataFilterWrapper({
        data: mockData,
        filters: { name: { value: 'b' } }
      });
      expect(findContent(wrapper)).toEqual('2');
    })

    it('should filter data with given filter', () => {
      const value = 1;
      const wrapper = getDataFilterWrapper({
        data: mockData,
        filters: {
          id: {
            value,
            match: (item: any, key: string, value: any) => {
              return item[key] > value
            }
          }
        }
      });
      expect(findContent(wrapper)).toEqual('2,3');
    })

    it('should filter data by predicate if provided', () => {
      const value = 1;
      const wrapper = getDataFilterWrapper({
        data: mockData,
        filters: {
          id: {
            value,
            match: (item: any, key: string, value: any) => {
              return item[key] > value // 2,3
            }
          }
        },
        predicate: (filterValues: any, item: any) => item.id > 2 // 3
      });
      expect(findContent(wrapper)).toEqual('3');
    });

    it('should update state if value changed', () => {
      const wrapper = getDataFilterWrapper({
        data: mockData,
        filters: { id: { value: 0 } }
      });
      (wrapper.instance() as any).handleValueChange({ id: 1 });
      expect(wrapper.state().filterValues.id).toBe(1);
      expect(findContent(wrapper)).toBe('1');
    })

    it('should add filter to state if not exist', () => {
      const wrapper = getDataFilterWrapper({
        data: mockData,
        filters: {}
      });
      (wrapper.instance() as any).handleValueChange({ name: 'c' });
      expect(wrapper.state().filterValues.name).toBe('c');
      expect(findContent(wrapper)).toBe('3');
    })
  })
});

const render = ({ data }: { data: any }) => (
  <span>{data.map((d: any) => d.id).join(',')}</span>
);

const getDataFilterWrapper = ({ data, filters, children = render, predicate }: Partial<Props>) => {
  return shallow<typeof DataFilter>(
    <DataFilter data={data} filters={filters} predicate={predicate}>
      {children}
    </DataFilter>
  );
}

const findContent = (wrapper: ShallowWrapper) => wrapper.find('span').text()
*/