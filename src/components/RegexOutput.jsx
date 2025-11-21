import React from 'react';
import { FLAGS_CONFIG } from '../constants/settings';

const RegexOutput = ({ regexData, flags, toggleFlag, hoveredBlockId }) => {
  const fullRegex = regexData.pattern;
  
  const copyToClipboard = () => {
    const flagStr = Object.keys(flags).filter(k=>flags[k]).join('');
    navigator.clipboard.writeText(`/${fullRegex}/${flagStr}`);
  };

  return (
    // 修复：移除 overflow-hidden，防止 Tooltip 被遮挡
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header with Flags */}
      {/* 修复：添加 rounded-t-xl 以保持顶部圆角 */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center rounded-t-xl">
        <div className="flex gap-4 items-center">
            <h3 className="font-bold text-gray-700 text-sm">生成的正则表达式</h3>
            {/* Flags Toggles */}
            <div className="flex gap-1">
                {Object.keys(FLAGS_CONFIG).map(flag => (
                    <div key={flag} className="relative group/tooltip">
                        <button
                            onClick={() => toggleFlag(flag)}
                            className={`text-xs font-mono w-6 h-6 flex items-center justify-center rounded border transition-all ${
                                flags[flag] 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                : 'bg-white text-gray-400 border-gray-300 hover:border-blue-300'
                            }`}
                        >
                            {flag}
                        </button>
                        {/* Tooltip */}
                        {/* z-index 提高到 50 确保在最上层 */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-max px-2 py-1 bg-gray-800 text-white text-[10px] rounded shadow-lg z-50 whitespace-nowrap">
                            {FLAGS_CONFIG[flag].label}: {FLAGS_CONFIG[flag].desc}
                            {/* 小三角 */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <button 
            onClick={copyToClipboard} 
            className="text-xs font-medium text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors border border-transparent hover:border-blue-100"
        >
            复制
        </button>
      </div>
      
      {/* Code Display with Highlight */}
      {/* 修复：添加 rounded-b-xl 以保持底部圆角 */}
      <div className="p-4 bg-slate-900 min-h-[100px] flex items-center flex-wrap font-mono text-sm break-all leading-relaxed rounded-b-xl">
        <span className="text-gray-500 select-none mr-0.5">/</span>
        {regexData.parts.map((part, idx) => (
             <span 
                key={idx}
                className={`transition-all duration-200 border-b-2 border-transparent ${
                    part.blockId === hoveredBlockId 
                    ? 'bg-blue-600 text-white rounded-sm px-0.5 shadow-[0_0_15px_rgba(37,99,235,0.6)] border-white scale-105 z-10' 
                    : 'text-green-400 hover:text-green-200'
                }`}
             >
                 {part.text}
             </span>
        ))}
        <span className="text-gray-500 select-none ml-0.5">/
            <span className="text-purple-400">{Object.keys(flags).filter(k=>flags[k]).join('')}</span>
        </span>
      </div>
    </div>
  );
};

export default RegexOutput;