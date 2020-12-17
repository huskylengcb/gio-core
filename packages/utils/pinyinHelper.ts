import pinyinMatch from 'pinyin-match';

export default function isContain(target: string = '', source: string = ''): boolean {
  if (!target) {
    target = ''
  }
  if (!source) {
    source = ''
  }
  return !!pinyinMatch.match(target, source);
};
