/**
 * 数据格式化有关的工具函数
 */

export const subString = (str, len, hasDot, min) => {
  let length = 0;
  let newStr = '';
  let oldLength = str.length;
  for (let i = 0; i < len; i++) {
    if (str.charCodeAt(i) > 255) {
      length += 2;
    } else {
      length++;
    }
    if (length > len || i > oldLength) {
      break;
    }
    newStr += str.charAt(i);
  }
  if (hasDot && newStr.length < oldLength) {
    newStr += '...';
    if (newStr.length === 3 && min) {
      return str.slice(0, min) + newStr;
    }
  }
  return newStr;
};
export const isBigger = (str, len) => {
  return str.replace(/[\u0391-\uFFE5]/g, 'aa').length > len;
};
export const encodeHTML = (str) => (
  typeof str !== 'string' ?
    str :
    str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
);

export default subString;
