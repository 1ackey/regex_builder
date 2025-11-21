import React from 'react';

const Toolbar = ({ onAddBlock }) => {
  const tools = [
    { label: '特定单词', type: 'WORD', icon: 'Abc', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { label: '词元 (Lemma)', type: 'LEMMA', icon: '', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', desc: '自动匹配 run, ran, running' },
    { label: '指定词性', type: 'POS', icon: '', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { label: '原始正则', type: 'RAW_TEXT', icon: '', color: 'bg-slate-200 text-slate-700 border-slate-300', desc: '输入 \\d+ 或 [.,?!] 等' },
    { label: '任意词', type: 'WILDCARD', icon: '✱', color: 'bg-green-100 text-green-700 border-green-200', desc: '匹配 N 个未知单词' },
    { label: '距离/间隔', type: 'GAP', icon: '↔', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { label: '词缀/词法', type: 'AFFIX', icon: 'Fix', color: 'bg-cyan-100 text-cyan-700 border-cyan-200', subType: 'PREFIX' },
    { label: '多选一', type: 'CHOICE', icon: '', color: 'bg-pink-100 text-pink-700 border-pink-200' },
    // Anchor 已删除
  ];

  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3"></h3>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => onAddBlock(tool)}
            title={tool.desc || tool.label}
            className={`flex flex-col items-center justify-center w-24 h-20 p-2 rounded-lg border-2 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:scale-95 ${tool.color.replace('bg-', 'hover:bg-opacity-80 bg-opacity-50 ')}`}
          >
            <span className="text-2xl mb-1">{tool.icon}</span>
            <span className="text-xs font-bold text-center leading-tight">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;