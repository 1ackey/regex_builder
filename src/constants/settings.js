// 语料库标签集设置
export const TAGSETS = {
  UNDERSCORE: { id: 'UNDERSCORE', label: '标准 (_NN)', separator: '_', format: (tag) => `_${tag}` },
  SLASH: { id: 'SLASH', label: 'Brown语料库 (/NN)', separator: '/', format: (tag) => `/${tag}` },
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
};

// 模拟词元数据库 (Lemma Dictionary)
// 在实际生产环境中，这应该是一个 API 调用
export const LEMMA_DB = {
  be: ['be', 'is', 'am', 'are', 'was', 'were', 'been', 'being'],
  have: ['have', 'has', 'had', 'having'],
  do: ['do', 'does', 'did', 'done', 'doing'],
  go: ['go', 'goes', 'went', 'gone', 'going'],
  make: ['make', 'makes', 'made', 'making'],
  run: ['run', 'runs', 'ran', 'running'],
  eat: ['eat', 'eats', 'ate', 'eaten', 'eating'],
  study: ['study', 'studies', 'studied', 'studying'],
  // ... 可以扩展更多
};