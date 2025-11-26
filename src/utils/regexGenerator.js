import { TAGSETS, POS_OPTIONS} from '../constants/settings';
import { LEMMA_DB } from '../constants/LEMMA_DB';
/**
 * 生成量词后缀
 * @param {number|string} min 最小次数
 * @param {number|string} max 最大次数 ('' 代表无穷大)
 * @returns {string} 正则量词, e.g., "*", "+", "{2,5}"
 */
const getQuantifier = (min, max) => {
  const nMin = parseInt(min, 10) || 0;
  const nMax = max === '' ? '' : (parseInt(max, 10) || '');

  if (nMin === 1 && (nMax === 1 || nMax === '')) return '';
  if (nMin === 0 && nMax === 1) return '?';
  if (nMin === 0 && nMax === '') return '*';
  if (nMin === 1 && nMax === '') return '+';
  if (nMax === '') return `{${nMin},}`;
  if (nMin === nMax) return `{${nMin}}`;
  return `{${nMin},${nMax}}`;
};

export const generateRegexData = (blocks, tagsetKey = 'UNDERSCORE') => {
  if (!blocks || blocks.length === 0) return { pattern: '', parts: [] };

  const tagset = TAGSETS[tagsetKey] || TAGSETS.UNDERSCORE;
  const parts = [];

  blocks.forEach((block, index) => {
    let regexPart = '';

    const prevBlock = index > 0 ? blocks[index - 1] : null;
    const skipSpacing =
      prevBlock?.type === 'ANCHOR' ||
      prevBlock?.type === 'RAW_TEXT' ||
      block.type === 'ANCHOR' ||
      block.type === 'RAW_TEXT';

    if (index > 0 && !skipSpacing) {
      parts.push({ text: '\\s+', blockId: null });
    }

    switch (block.type) {
      case 'WORD': {
        const word = block.content.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (!word) break;

        let finalWord = word;
        if (block.options?.ignoreCase && /^[a-z]/.test(word)) {
          finalWord = `[${word[0].toUpperCase()}${word[0].toLowerCase()}]${word.slice(1)}`;
        }
        regexPart = `\\b${finalWord}\\b`;
        break;
      }

      case 'LEMMA': {
        const lemmaKey = block.content.trim().toLowerCase();
        if (!lemmaKey) break;
        const forms = LEMMA_DB[lemmaKey] || [lemmaKey];
        regexPart = `\\b(?:${forms.join('|')})\\b`;
        break;
      }

      case 'RAW_TEXT': {
        regexPart = block.content || '';
        break;
      }

      case 'AFFIX': {
        const txt = block.content.trim();
        if (!txt) break;
        if (block.subType === 'PREFIX') regexPart = `\\b${txt}\\w+`;
        else if (block.subType === 'SUFFIX') regexPart = `\\w+${txt}\\b`;
        else regexPart = `\\w+${txt}\\w+`;
        break;
      }

      case 'POS': {
        const pos = POS_OPTIONS.find(p => p.value === block.content);
        const suffix = pos ? tagset.format(pos.value) : tagset.format('\\w+');
        let core = `\\S+${suffix}`;
        if (block.options?.negate) {
          core = `(?!\\S+${suffix})\\S+${tagset.format('\\w+')}`;
        }
        const quant = getQuantifier(block.min || 1, block.max || 1);
        regexPart = quant ? `(?:${core})${quant}` : core;
        break;
      }

      case 'WILDCARD': {
        // 最少匹配单词数
        let nMin = parseInt(block.min, 10);
        if (isNaN(nMin)) nMin = 0;

        // 最大匹配数：空字符串或 null 表示无限
        let nMaxVal = block.max === '' || block.max === null ? '' : parseInt(block.max, 10);

        const nonGreedy = block.options?.nonGreedy ? '?' : '';

        const coreWord = '\\S+';

        if (nMin === 0) {
          // 0 到 nMax，非贪婪匹配
          if (nMaxVal === '') {
            regexPart = `(?:${coreWord}(?:\\s+${coreWord})*?)${nonGreedy}?`;
          } else {
            const repeat = nMaxVal - 1;
            regexPart = `(?:${coreWord}(?:\\s+${coreWord}){0,${repeat}}?)${nonGreedy}?`;
          }
        } else {
          // 至少 nMin 个单词
          const minGroup = nMin - 1;
          const maxGroup = nMaxVal === '' ? '' : nMaxVal - 1;
          regexPart = `${coreWord}(?:\\s+${coreWord})${getQuantifier(minGroup, maxGroup)}${nonGreedy}?`;
        }
        break;
      }

      case 'GAP': {
        const min = block.min || 0;
        const max = block.max || 3;
        const quant = getQuantifier(min, max);
        regexPart = `(?:\\s+\\S+)${quant}`;
        break;
      }

      case 'CHOICE': {
        const opts = block.content.split('|').map(s => s.trim()).filter(Boolean);
        regexPart = opts.length ? `(?:${opts.join('|')})` : '';
        break;
      }

      case 'ANCHOR': {
        if (block.subType === 'START') regexPart = '^';
        else if (block.subType === 'END') regexPart = '$';
        else if (block.subType === 'WB') regexPart = '\\b';
        break;
      }

      default:
        break;
    }

    if (regexPart) {
      parts.push({ text: regexPart, blockId: block.id });
    }
  });

  return {
    pattern: parts.map(p => p.text).join(''),
    parts
  };
};
