const pinyinMatch = require('pinyin-match').default;

export default function isContain(target: string = '', source: string = ''): boolean {
  if (!target) {
    target = ''
  }
  if (!source) {
    source = ''
  }
  return !!pinyinMatch.match(target, source);
};
