import isContain from '@gio-core/utils/pinyinHelper';
import { platformMap } from '@gio-core/constants/platformConfig'

const { getObjectAttr } = require('@gio-core/utils/helper');

export const tabs = [
  { id: 'all', label: '全部' },
  { id: 'mine', label: '我创建的' },
  { id: 'favorites', label: '我的收藏' }
];

let { productPlatforms } = window as any;
if (/wechat/.test(productPlatforms)) {
  if (/web|js/.test(productPlatforms)) {
    productPlatforms = productPlatforms.replace(/,wechat|wechat,|wechat/, '');
  } else {
    productPlatforms = productPlatforms.replace(/wechat/, 'js');
  }
}
export const platforms = (productPlatforms ? productPlatforms.split(',') : []).map((p: string) => {
  const platform = platformMap[p];
  return {
    id: platform.value,
    name: platform.label
  }
});

export const types = [
  { id: 'prepared', name: '预定义指标' },
  { id: 'custom', name: '埋点事件' },
  { id: 'page', name: '页面浏览', shortName: '浏览' },
  { id: 'clck', name: '元素点击', shortName: '点击' },
  { id: 'imp', name: '元素浏览', shortName: '浏览' },
  { id: 'chng', name: '输入框修改', shortName: '修改' },
  { id: 'sbmt', name: '表单提交', shortName: '提交'},
  { id: 'merged', name: '合并事件' },
  { id: 'complex', name: '计算指标' }
];

export const defaultFilters = {
  type: {
    value: [] as any,
    match: (option: any, key: string, value: any[]) => {
      return !value.length || value.some((type: any) => {
        if (['prepared', 'custom', 'merged', 'complex'].includes(type)) {
          return type === option.type;
        }
        return type === option.action;
      })
    }
  },
  platform: {
    value: [] as any,
    match: (option: any, key: string, value: any[]) => {
      return !value.length || value.some((platform: any) => !option.platforms || option.platforms.includes(platform));
    }
  },
  keyword: {
    value: '',
    match: (option: any, key: string, value: string) => {
      return isContain(option.name, value);
    }
  },
  scope: {
    value: 'all',
    match: (item: any, key: string, value: any) => {
      if (value === 'all') {
        return true;
      }
      if (value === 'mine') {
        return (
          getObjectAttr(item, 'creatorId') === window.currentUser.id
          || item.creator === window.currentUser.name
        );
      }
      if (value === 'subscribed') {
        return item.subscribed;
      }
    }
  }
}

export const groups: { [key: string]: string } = {
  recentlyUsed : '最近使用',
  globalMetric: '预定义指标',
  uncategorized: '未分类'
};
