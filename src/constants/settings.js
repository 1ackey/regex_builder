// 语料库标签集设置
export const TAGSETS = {
  UNDERSCORE: { id: 'UNDERSCORE', label: '_NN', separator: '_', format: (tag) => `_${tag}` },
  SLASH: { id: 'SLASH', label: '/NN', separator: '/', format: (tag) => `/${tag}` },
  XML: { id: 'XML', label: 'XML格式 (<w type="NN">)', separator: '', format: (tag) => `(?<=type="${tag}">)[^<]+` },
};

// 词性选项 (全中文)
export const POS_OPTIONS = [
  { label: '名词 (Noun)', value: 'NN', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { label: '动词 (Verb)', value: 'VB', color: 'bg-red-50 border-red-200 text-red-700' },
  { label: '形容词 (Adj)', value: 'JJ', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { label: '副词 (Adv)', value: 'RB', color: 'bg-teal-50 border-teal-200 text-teal-700' },
  { label: '介词 (Prep)', value: 'IN', color: 'bg-gray-50 border-gray-200 text-gray-700' },
  { label: '代词/限定词 (Det)', value: 'DT', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { label: '数词 (Num)', value: 'CD', color: 'bg-purple-50 border-purple-200 text-purple-700' },
];

// Flags 配置与说明
export const FLAGS_CONFIG = {
  g: { label: '全局 (g)', desc: '查找所有匹配项，而不只是第一个' },
  i: { label: '忽略大小写 (i)', desc: '匹配时不区分大小写 (如 The = the)' },
  s: { label: '单行模式 (s)', desc: '让点号 (.) 可以匹配换行符' },
  m: { label: '多行模式 (m)', desc: '让 ^ 和 $ 匹配每一行的行首和行尾' },
  u: { label: 'Unicode (u)', desc: '启用 Unicode 匹配' },
  y: { label: '粘性 (y)', desc: '匹配从 lastIndex 位置开始' },
};
