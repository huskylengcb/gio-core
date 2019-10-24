/**
 * BEM className构造器
 *
 * 接受一个blockName作为参数，返回一个闭包函数function(elemName, modifierName)
 * block为全局唯一的，如果监测到有相同的两个block会throw Error
 *
 * @Example
 * const bem = bemClsFactor('block');
 * bem() => output: block
 * bem('elemName') => output: block__elemName
 * bem('elemName', 'modifierName') => output: block__elemName--modifierName
 *
 * @param  {String} blockName BEM方法论中, Block的名字，Block应该是全剧唯一的
 * @return {Function(String, String)}
 */
var bemClsFactor = (blockName) => (elemName, modifierName) => {
  elemName = elemName ? `__${elemName}` : '';
  modifierName = modifierName ? `--${modifierName}` : '';
  return `${blockName}${elemName}${modifierName}`;
};

export default bemClsFactor;
