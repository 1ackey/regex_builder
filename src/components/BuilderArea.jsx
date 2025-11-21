import React from 'react';
import Block from './Block';

const BuilderArea = ({ blocks, setBlocks, onHover }) => {
  
  const updateBlock = (id, updated) => {
    setBlocks(blocks.map(b => b.id === id ? updated : b));
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index, direction) => {
    const newBlocks = [...blocks];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 min-h-[500px] shadow-sm relative">
        
      {/* 排序提示 */}
      {blocks.length > 1 && (
        <div className="absolute top-2 right-4 text-[10px] text-gray-300 uppercase font-bold">
            使用卡片右侧箭头排序
        </div>
      )}

      {blocks.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl p-12 bg-gray-50/50 transition-colors hover:bg-gray-50 hover:border-blue-200 group cursor-default">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-3xl group-hover:scale-110 transition-transform">🧩</div>
          <p className="text-lg font-medium mb-1 text-gray-500 group-hover:text-blue-500">这里还啥也没有呢</p>
          <p className="text-sm">按顺序排列单位，形成要查找的语言结构</p>
        </div>
      ) : (
        <div className="max-w-xl mx-auto flex flex-col gap-0 pb-20">
          {blocks.map((block, index) => (
            <Block
              key={block.id}
              index={index}
              total={blocks.length}
              block={block}
              updateBlock={updateBlock}
              removeBlock={removeBlock}
              moveBlock={moveBlock}
              onHover={onHover}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuilderArea;