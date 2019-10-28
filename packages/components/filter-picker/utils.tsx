import Filter from '@gio-core/types/Filter';

export const handleRemove = (
  index: number,
  filter: Filter,
  onChange: (filter: Filter) => void
) => () => {
  const exprs = [
    ...filter.exprs.slice(0, index),
    ...filter.exprs.slice(index + 1)
  ];
  onChange(
    exprs.length ? { ...filter, exprs } : null
  );
};
