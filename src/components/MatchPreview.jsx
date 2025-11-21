import React, { useState, useMemo } from 'react';

const escapeHtml = (str) => {
  const htmlMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return str.replace(/[&<>"']/g, (c) => htmlMap[c]);
};

const MatchPreview = ({ regexData, flags, hoveredBlockId }) => {
  const [text, setText] = useState(
    "The quick brown fox jumps over the lazy dog. The slow red turtle crawls under the fence. \nShe runs quickly. He ran slowly."
  );
  const [viewMode, setViewMode] = useState('FULL'); // 'FULL' or 'KWIC'

  // 构建正则表达式对象
  const regex = useMemo(() => {
    try {
      const flagStr = Object.keys(flags).filter((k) => flags[k]).join('');
      return regexData.pattern ? new RegExp(regexData.pattern, flagStr) : null;
    } catch (e) {
      return null;
    }
  }, [regexData.pattern, flags]);

  // FULL 模式渲染
  const renderFullText = () => {
    if (!regex) return <div className="text-gray-400 p-4"></div>;

    // 为安全起见，克隆正则并确保 global
    const safeFlags = regex.flags.includes('g') ? regex.flags : regex.flags + 'g';
    const safeRegex = new RegExp(regex.source, safeFlags);

    const elements = [];
    let cursor = 0;
    let match;
    let safetyCounter = 0;

    while ((match = safeRegex.exec(text)) !== null && safetyCounter < 5000) {
      safetyCounter++;

      // 添加匹配前的文本
      if (match.index > cursor) {
        elements.push(<span key={`text-${cursor}`}>{escapeHtml(text.slice(cursor, match.index))}</span>);
      }

      // 匹配文本高亮 + hoveredBlockId 生效
      const isHovered = hoveredBlockId === safetyCounter;
      elements.push(
        <span
          key={`match-${cursor}-${safetyCounter}`}
          className={`bg-yellow-200 text-yellow-900 rounded border-b-2 border-yellow-300 font-medium mx-0.5 px-0.5 box-decoration-clone ${
            isHovered ? 'ring-2 ring-blue-400' : ''
          }`}
        >
          {escapeHtml(match[0])}
        </span>
      );

      cursor = match.index + match[0].length;

      // zero-width 匹配安全
      if (match[0].length === 0) safeRegex.lastIndex++;
    }

    if (cursor < text.length) {
      elements.push(<span key={`text-end`}>{escapeHtml(text.slice(cursor))}</span>);
    }

    return (
      <div className="whitespace-pre-wrap leading-loose text-gray-700 text-sm font-sans p-4">
        {elements.length > 0 ? elements : escapeHtml(text)}
      </div>
    );
  };

  // KWIC 模式渲染
  const renderKWIC = () => {
    if (!regex) return <div className="text-gray-400 italic p-8 text-center"></div>;

    const matches = [];
    const safeFlags = regex.flags.includes('g') ? regex.flags : regex.flags + 'g';
    const safeRegex = new RegExp(regex.source, safeFlags);
    let match;
    let safetyCounter = 0;
    const contextSize = 30;

    while ((match = safeRegex.exec(text)) !== null && safetyCounter < 5000) {
      safetyCounter++;

      // 使用 Array.from 确保 UTF-8 / emoji 安全
      const chars = Array.from(text);
      const matchChars = Array.from(match[0]);

      const leftStart = Math.max(0, match.index - contextSize);
      const rightEnd = Math.min(chars.length, match.index + matchChars.length + contextSize);

      const leftText = chars.slice(leftStart, match.index).join('');
      const rightText = chars.slice(match.index + matchChars.length, rightEnd).join('');

      matches.push({
        left: leftText,
        match: match[0],
        right: rightText,
        id: safetyCounter,
      });

      if (match[0].length === 0) safeRegex.lastIndex++;
    }

    if (matches.length === 0)
      return <div className="text-gray-400 italic p-8 text-center">未找到匹配项</div>;

    return (
      <div className="flex flex-col text-xs w-full">
        <div className="flex font-bold text-gray-400 border-b pb-2 mb-2 px-2">
          <div className="flex-1 text-right">Left</div>
          <div className="w-4"></div>
          <div className="w-auto text-center text-black">hit</div>
          <div className="w-4"></div>
          <div className="flex-1 text-left">Right</div>
        </div>
        {matches.map((row) => {
          const isHovered = hoveredBlockId === row.id;
          return (
            <div
              key={`kwic-${row.id}`}
              className={`flex items-center hover:bg-blue-50 py-1 px-2 rounded cursor-default group border-b border-transparent hover:border-blue-100 transition-colors ${
                isHovered ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              <div className="flex-1 text-right font-mono text-gray-500 whitespace-pre overflow-hidden text-ellipsis direction-rtl">
                {escapeHtml(row.left)}
              </div>

              <div className="mx-2 font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded min-w-fit text-center group-hover:bg-blue-600 group-hover:text-white">
                {escapeHtml(row.match)}
              </div>

              <div className="flex-1 text-left font-mono text-gray-500 whitespace-pre overflow-hidden text-ellipsis">
                {escapeHtml(row.right)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm mt-0 flex flex-col h-[450px]">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center shrink-0">
        <h3 className="font-bold text-gray-700 text-sm">样例测试</h3>
        <div className="flex bg-gray-200 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('FULL')}
            className={`px-3 py-1 text-[10px] rounded-md font-bold transition-all ${
              viewMode === 'FULL' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            全文视图
          </button>
          <button
            onClick={() => setViewMode('KWIC')}
            className={`px-3 py-1 text-[10px] rounded-md font-bold transition-all ${
              viewMode === 'KWIC' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            KWIC 索引行
          </button>
        </div>
      </div>

      <textarea
        className="w-full p-3 border-b border-gray-100 text-sm focus:outline-none resize-none bg-slate-50 text-gray-600 h-24 shrink-0 placeholder:text-gray-300"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="在此输入或粘贴您的语料文本..."
        spellCheck="false"
      />

      <div className="flex-1 overflow-auto bg-white custom-scrollbar">
        {viewMode === 'FULL' ? renderFullText() : renderKWIC()}
      </div>
    </div>
  );
};

export default MatchPreview;
