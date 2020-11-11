// export const isSame = (ax:string, bx:string) => boolean={

// };
const isSame = function(ax: string, bx: string): boolean {
  if (_getFrame(ax) != _getFrame(bx)) return false;
  let s1 = ax.split("/|\\.|#");
  let s2 = bx.split("/|\\.|#");
  if (s1.length != s2.length) {
    return false;
  }
  for (let n in s1) {
    if (s1[n] != "*" && s2[n] != "*" && s1[n] != s2[n]) {
      return false;
    }
  }

  return true;
};
function _getFrame(xpath: string) {
  let res = "";
  let chs = xpath.split("");
  for (let f of chs) {
    if (f == "/" || f == "#" || f == ".") res += f;
  }
  return res;
}
function _expTest(ax: string, bx: string) {
  let axs = ax.split("/");
  let bxs = bx.split("/");
  if (axs.length != bxs.length) {
    return false;
  }
  for (let i in axs) {
    if (!_test(axs[i], bxs[i])) {
      return false;
    }
  }
  return true;
}
function _test(likePattern: string, str: string) {
  let pattern = likePattern.replace(/(\*)+/g, ".*");
  if (pattern == ".*") {
    return true;
  }
  if (pattern.includes(".*")) {
    return new RegExp(`^${pattern}$`).test(str);
  }
  return pattern == str;
}
/**
 * //   # 判断两个xpath是否绝对相对，同时支持如果有带 * 的匹配
 * @param ax xpath1
 * @param bx xpath2
 */
export const isSameWithRegular = function(ax: string, bx: string): boolean {
  return isSame(ax, bx) || _expTest(ax, bx) || _expTest(bx, ax);
};

/**
   * // class GrSameXpath
  //   @isSame: (ax, bx) =>
  //     if @_getFrame(ax) != @_getFrame(bx)
  //       return false
  
  //     s1 = ax.split("/|\\.|#")
  //     s2 = bx.split("/|\\.|#")
  
  //     if s1.length != s2.length
  //       return false
  
  //     for m, n in s1
  //       if s1[n] != "*" && s2[n] != "*" && s1[n] != s2[n]
  //         return false
  
  //     return true
  
  //   @_getFrame: (xpath) =>
  //     res = ''
  
  //     chs = xpath.split('')
  //     for f in chs
  //       if f == '/' || f == '#' || f == '.'
  //         res += f
  
  //     res
  
  //   # 判断两个xpath是否绝对相对，同时支持如果有带 * 的匹配
  //   @isSameWithRegular: (ax, bx) =>
  //     @isSame(ax, bx) || @expTest(ax, bx) || @expTest(bx, ax)
  
  //   # 分段进行匹配，避免长正则导致异常慢的问题
  //   @expTest: (ax, bx) =>
  //     axs = ax.split('/')
  //     bxs = bx.split('/')
  //     return false if axs.length != bxs.length
  //     for aItem, i in axs
  //       bItem = bxs[i]
  //       return false if !@_test(aItem, bItem)
  //     return true
  
  //   @_test: (likePattern, str) =>
  //     pattern = likePattern.replace(/(\*)+/g, '.*')
  //     return true if pattern == '.*'
  //     return new RegExp("^#{pattern}$").test(str) if pattern.includes('.*')
  //     return pattern == str
  
  //   # 判断两个xpath骨架是否相等
  //   #  ax 已经是骨架
  //   #  bx 是full xpath
  //   @isSameWithSkeleton: (ax, bx) =>
  //     return true if ax is bx
  //     return false if !bx
  
  //     chrs = bx.split('/').map (y) ->
  //       y.replace(/[\.|\#].*$/i, '')
  
  //     ax == chrs.join('/')
  
   */
