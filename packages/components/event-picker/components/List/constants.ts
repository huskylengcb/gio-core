export const iconMap: { [key: string]: string } = {
  recentlyUsed: 'recently-used',
  prepared: 'global-metric',
  unknown: 'uncategorized'
};

export const iconStyle = { width: '20px', height: '20px' };

export const initialState = {
  targetGroupId: null,
  isLoading: false,
  dataCache: { prepared: [], recentlyUsed: [] }
};
