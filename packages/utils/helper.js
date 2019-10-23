import segmentationTypes from '@gio-core/constants/segmentationTypes';

export function getUserGroupName(userGroupId, segmentations) {
  let userGroupName = 'segmentations.has_been_deleted';
  if (segmentationTypes[userGroupId]) {
    userGroupName = segmentationTypes[userGroupId];
  } else {
    const userGroup = segmentations.find(segmentation => {
      return segmentation.id === userGroupId;
    });
    if (userGroup) {
      userGroupName = userGroup.name;
    }
  }
  return userGroupName;
}

export const getObjectAttr = (obj, camelCaseKey) => {
  if (typeof(obj) !== 'object' || !camelCaseKey) {
    return undefined;
  }
  const snakeCaseKey = camelCaseKey.replace(/([A-Z])/g, '_$1').toLowerCase();
  return obj[camelCaseKey] || obj[snakeCaseKey];
};

export const charsLength = (string) => {
  let len = 0;
  for (let i = 0; i < string.length; i++) {
    if (string.charCodeAt(i) > 126) {
      len += 2;
    } else {
      len++;
    }
  }
  return len;
};
