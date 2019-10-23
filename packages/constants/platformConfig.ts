import { cloneDeep, filter } from 'lodash';

interface PlatformConfig {
  value: string,
  label: string,
  icon: string,
  colorIcon?: string,
  sortWeight: number
}

// Android, iOS, web 是无埋点指标的 platform 字段
// 对应应用的 android，ios，js
const productSpecilized = ['android', 'ios', 'js'];
const eventSpecilized = ['Android', 'iOS', 'web'];

// 小程序产品支持的平台
export const minpPlatformGroup = ['minp', 'wechat', 'minigame', 'wxwv', 'alip', 'wxoa', 'baidup', 'qq', 'bytedance', 'quickapp'];

export const notSupportCircle = ['minigame', 'wxoa'];

export const webPlatformGroup = ['js'];
export const appPlatformGroup = ['android', 'ios'];

// 平台参数
export const platformMap: { [key: string]: PlatformConfig } = {
    js: {
      value: 'web', label: 'Web', sortWeight: 1,  icon: 'gicon-PC', colorIcon: 'gicon-pc'
    },
    web: {
      value: 'web', label: 'Web', sortWeight: 1,  icon: 'gicon-PC', colorIcon: 'gicon-pc'
    },
    wechat: {
      value: 'web', label: '旧版内嵌页', sortWeight: 1, icon: 'gicon-Wechat',
    },
    wxwv: {
      value: 'wxwv', label: '微信内嵌页', sortWeight: 4, icon: 'gicon-Wechat'
    },
    ios: {
      value: 'iOS', label: 'iOS', sortWeight: 3, icon: 'gicon-iOS',  colorIcon: 'gicon-ios'
    },
    iOS: {
      value: 'iOS', label: 'iOS', sortWeight: 3, icon: 'gicon-iOS', colorIcon: 'gicon-ios'
    },
    Android: {
      value: 'Android', label: 'Android', sortWeight: 2, icon: 'gicon-Android', colorIcon: 'gicon-android'
    },
    android: {
      value: 'Android', label: 'Android', sortWeight: 2, icon: 'gicon-Android', colorIcon: 'gicon-android'
    },
    minp: {
      value: 'minp', label: '微信小程序', sortWeight: 5, icon: 'gicon-mini-program', colorIcon: 'gicon-mini-program-2'
    },
    MINA: {
      value: 'minp', label: '微信小程序', sortWeight: 5, icon: 'gicon-mini-program', colorIcon: 'gicon-mini-program-2'
    },
    minigame: {
      value: 'MiniGame', label: '微信小游戏', sortWeight: 6, icon: 'gicon-MiniGame'
    },
    alip: {
      value: 'alip', label: '支付宝小程序', sortWeight: 7, icon: 'gicon-alipay-stroke'
    },
    wxoa: {
      value: 'wxoa', label: '微信公众号', sortWeight: 7, icon: 'gicon-gzh'
    },
    baidup: {
      value: 'baidup', label: '百度小程序', sortWeight: 7, icon: 'gicon-baidu-minip'
    },
    qq: {
      value: 'qq', label: 'QQ小程序', sortWeight: 7, icon: 'gicon-qq-minip'
    },
    bytedance: {
      value: 'bytedance', label: '字节跳动小程序', sortWeight: 7, icon: 'gicon-bytedance-minip'
    },
    quickapp: {
      value: 'quickapp', label: '快应用', sortWeight: 7, icon: 'gicon-quickapp'
    }
};

// 模块支持的平台，默认为支持全部
const moduleSupportedPlatform = {
  inAppMessage: ['ios', 'android', 'minp'],
  pageflow: ['minp', 'ios', 'android'],
  minpCode: ['minp'],
  minpShare: ['minp', 'minigame', 'alip', 'baidup', 'qq', 'bytedance', 'quickapp']
}

// 判断模块是否支持平台
export const isSupportedPlatform = (moduleName: string, platform: string) => {
  if (!moduleSupportedPlatform[moduleName]) {
    return true;
  }
  return moduleSupportedPlatform[moduleName].indexOf(platform) >= 0;
}

// 平台的圈选路径
export const getCirclePath = (product: any) => {
  let circleLink = `circle/${product.id}?type=${product.platform}`;

  if (['minp', 'alip', 'baidup', 'qq', 'bytedance', 'quickapp'].includes(product.platform)) {
    circleLink = `minp/circle-page/${product.id}?type=${product.platform}`;
  }
  if (product.platform === 'wxwv') {
    circleLink = `minp/circle/${product.id}/debugger-user?type=${product.platform}`;
  }
  return circleLink;
}
// 获取当前项目集成的所以平台
export function getProductPlatformList() {
  const unOrderPlatformList = window.products.map((p) => p.platform);
  const platformList = getProductPlatfroms().filter((p) => {
    return unOrderPlatformList.includes(p as Platform);
  });
  return platformList;
}

// 应用的所有平台
export const getProductPlatfroms = (supportCircle: boolean = false) => Object.keys(platformMap)
.filter((p) => eventSpecilized.indexOf(p) < 0 && (supportCircle ? notSupportCircle.indexOf(p) < 0 : true))

// 指标的所有平台
export const getEventPlatfroms = (supportCircle: boolean = false) => Object.keys(platformMap)
.filter((p) => productSpecilized.indexOf(p) < 0 && (supportCircle ? notSupportCircle.indexOf(p) < 0 : true))

export const getEventPlatfromMap = (supportCircle: boolean = false) => filter(
  cloneDeep(platformMap),
  (value, key) => productSpecilized.indexOf(key) < 0 && (supportCircle ? notSupportCircle.indexOf(key) < 0 : true)
)

export const checkPlatformIntergrated = (type: string | string[]) => {
  if (!(window as any).productPlatforms) {
    return false;
  }
  if (typeof type === 'string' && type.length > 0) {
    return (window as any).productPlatforms.indexOf(type) > -1;
  } else if (Array.isArray(type)) {
    return type.some((typeName) => {
      return (window as any).productPlatforms.indexOf(typeName) > -1;
    });
  }
  return false;
};

export const isMiniGameOnly = () => {
  return (window as any).productPlatforms && (window as any).productPlatforms === 'minigame';
}
