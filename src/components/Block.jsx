import React from 'react';
import { POS_OPTIONS } from '../constants/settings';

const Block = ({ block, index, total, updateBlock, removeBlock, moveBlock, onHover }) => {
  
  const handleChange = (key, value) => {
    updateBlock(block.id, { ...block, [key]: value });
  };

  const handleOptionChange = (optKey, value) => {
    const newOptions = { ...(block.options || {}), [optKey]: value };
    updateBlock(block.id, { ...block, options: newOptions });
  };

  const inputClass = "w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow";
  
  // 数量输入组件
  const renderQuantifierInputs = (label = "数量") => (
    <div className="flex items-center gap-1 text-xs text-gray-600 bg-white/50 p-1 rounded border border-gray-200 mt-2">
      <span className="font-medium text-gray-500 px-1">{label}:</span>
      <input 
        type="number" min="0" max="99" placeholder="Min"
        value={block.min ?? 1} 
        onChange={(e) => handleChange('min', e.target.value)}
        className="w-10 text-center border rounded py-0.5"
        title="最少出现次数"
      />
      <span>-</span>
      <input 
        type="number" min="0" max="99" placeholder="Max"
        value={block.max ?? ''} 
        onChange={(e) => handleChange('max', e.target.value)}
        className="w-10 text-center border rounded py-0.5"
        title="最多出现次数 (留空代表不限)"
      />
    </div>
  );

  const renderContent = () => {
    switch (block.type) {
      case 'WORD':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={block.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="请输入单词 (e.g. apple)"
              className={inputClass}
            />
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-blue-600">
              <input 
                type="checkbox" 
                checked={block.options?.ignoreCase || false}
                onChange={(e) => handleOptionChange('ignoreCase', e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              忽略大小写
            </label>
          </div>
        );

      case 'LEMMA':
        return (
          <div className="space-y-1">
            <input
              type="text"
              value={block.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="输入原形 (e.g. go)"
              className={inputClass}
            />
            <div className="text-[10px] text-indigo-600 opacity-80">
              匹配所有词形 (go, went, gone...)
            </div>
          </div>
        );

      case 'RAW_TEXT':
        return (
          <div className="space-y-1">
            <input
              type="text"
              value={block.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="输入正则 (e.g. \d+ or [.,?!])"
              className={`${inputClass} font-mono text-slate-600`}
            />
            <div className="text-[10px] text-slate-500">
              用于匹配数字、标点或复杂结构
            </div>
          </div>
        );

      case 'AFFIX':
        return (
          <div className="flex flex-col gap-2">
            <select 
              value={block.subType} 
              onChange={(e) => handleChange('subType', e.target.value)}
              className="text-xs border rounded p-1 bg-white"
            >
              <option value="PREFIX">前缀 (Starts with)</option>
              <option value="SUFFIX">后缀 (Ends with)</option>
              <option value="INFIX">包含 (Contains)</option>
            </select>
            <input
              type="text"
              value={block.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="输入词缀..."
              className={inputClass}
            />
          </div>
        );

      case 'POS':
        return (
          <div className="space-y-2">
            <select
              value={block.content}
              onChange={(e) => handleChange('content', e.target.value)}
              className={`${inputClass} bg-white`}
            >
              <option value="" disabled>选择词性...</option>
              {POS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1 cursor-pointer text-xs">
                <input 
                  type="checkbox" 
                  checked={block.options?.negate || false}
                  onChange={(e) => handleOptionChange('negate', e.target.checked)}
                />
                <span className="text-red-600 font-bold">非 (NOT)</span>
              </label>
            </div>
            {renderQuantifierInputs('连续次数')}
          </div>
        );

      case 'GAP':
        return (
          <div className="flex flex-col gap-1">
             <div className="text-xs text-gray-500 mb-1 text-center">间隔 N 个词</div>
             {renderQuantifierInputs('间隔数量')}
          </div>
        );
        
      // ANCHOR 移除

      case 'WILDCARD':
        return (
             <div>
                <div className="text-xs text-gray-500 mb-1 text-center">匹配 N 个任意单词</div>
                {renderQuantifierInputs('单词数量')}
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-blue-600 mt-2 bg-white/50 p-1 rounded border border-gray-200">
                  <input 
                    type="checkbox" 
                    checked={block.options?.nonGreedy || false}
                    onChange={(e) => handleOptionChange('nonGreedy', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  非贪婪匹配 (Lazy)
                </label>
             </div>
        );
      
      case 'CHOICE':
         return (
           <input
            type="text"
            value={block.content}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="选项1|选项2" 
            className={inputClass}
          />
         )

      default: return null;
    }
  };

  // 颜色配置
  const styles = {
    WORD: 'bg-blue-50 border-blue-200 text-blue-900',
    LEMMA: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    AFFIX: 'bg-cyan-50 border-cyan-200 text-cyan-900',
    POS: 'bg-orange-50 border-orange-200 text-orange-900',
    GAP: 'bg-purple-50 border-purple-200 text-purple-900',
    WILDCARD: 'bg-green-50 border-green-200 text-green-900',
    // ANCHOR style removed
    CHOICE: 'bg-pink-50 border-pink-200 text-pink-900',
    RAW_TEXT: 'bg-slate-100 border-slate-300 text-slate-800',
  }[block.type] || 'bg-gray-50 border-gray-200';

  return (
    <div 
      className="relative group"
      onMouseEnter={() => onHover(block.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={`p-3 rounded-xl border-l-4 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] ${styles} ${styles.replace('bg-', 'border-l-')}`}>
        <div className="flex justify-between items-center mb-2 border-b border-black/5 pb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-70">
            {block.type === 'RAW_TEXT' ? '原始正则' : 
             block.type === 'LEMMA' ? '词元' :
             block.type === 'POS' ? '词性' : 
             block.type === 'WILDCARD' ? '任意词' : 
             block.type}
          </span>
          
          <div className="flex items-center gap-1">
            <button 
                onClick={() => moveBlock(index, -1)} 
                disabled={index === 0}
                className="p-1 rounded hover:bg-black/10 disabled:opacity-20 text-xs"
                title="上移"
            >
                ▲
            </button>
            <button 
                onClick={() => moveBlock(index, 1)} 
                disabled={index === total - 1}
                className="p-1 rounded hover:bg-black/10 disabled:opacity-20 text-xs"
                title="下移"
            >
                ▼
            </button>
            <div className="w-[1px] h-3 bg-black/20 mx-1"></div>
            <button 
                onClick={() => removeBlock(block.id)} 
                className="text-gray-400 hover:text-red-500 font-bold px-1 rounded transition-colors"
                title="删除"
            >
                ×
            </button>
          </div>
        </div>
        {renderContent()}
      </div>
      {index < total - 1 && (
        <div className="h-3 w-0.5 bg-gray-300 mx-auto opacity-50"></div>
      )}
    </div>
  );
};

export default Block;