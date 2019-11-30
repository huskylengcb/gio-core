import React, { ComponentType } from 'react';
import { get, groupBy } from 'lodash';

type GetDisplayName = (x: ComponentType) => string;
export const getDisplayName: GetDisplayName = (Component) => Component.displayName || Component.name || 'Component';

const getGroupedOptions = (options: any[]) => {
  if (!options.some((option: any) => option && option.groupName)) {
    return options;
  }
  const groupedOptions = groupBy(options, 'groupName');
  return Object.keys(groupedOptions).reduce((opts: any[], groupKey: string) => {
    const group = get(groupedOptions, `${groupKey}.0.group`);
    const groupId = get(groupedOptions, `${groupKey}.0.groupId`);
    return opts.concat([
      {
        id: groupId || groupKey,
        name: groupKey,
        type: 'groupName',
        group
      },
      ...groupedOptions[groupKey]
    ]);
  }, []);
}

interface Props {
  options: any[],
  groups?: any[],
  originalOptions?: any[]
};

const withGroupedOptions = <P extends object>(
  Component: ComponentType<Partial<P> & Props>, getGroupedFunc = getGroupedOptions
): ComponentType<Partial<P> & Props> => {
  class HOC extends React.PureComponent<Partial<P> & Props> {
    public static displayName: string
    public render() {
      const groupedOptions = getGroupedOptions(this.props.options);
      let groups
      if (getGroupedFunc ===  getGroupedOptions) {
        groups = groupedOptions
      } else {
        groups = getGroupedFunc(this.props.options)
      }
      return (
        <span>
          <Component {...this.props} options={groupedOptions} groups={groups} originalOptions={this.props.options} />
        </span>
      )
    }
  }
  HOC.displayName = `GroupedOptionsProvider(${getDisplayName(Component)})`;
  return HOC;
}

export default withGroupedOptions;
