import React, { useState, useMemo } from 'react';
import Toolbar from './components/Toolbar';
import BuilderArea from './components/BuilderArea';
import RegexOutput from './components/RegexOutput';
import MatchPreview from './components/MatchPreview';
import AIExplainer from './components/AIExplainer'; // 新增
import { generateRegexData } from './utils/regexGenerator';
import { TAGSETS } from './constants/settings';

function App() {
  const [blocks, setBlocks] = useState([]);
  const [tagset, setTagset] = useState('UNDERSCORE'); 
  const [hoveredBlockId, setHoveredBlockId] = useState(null); 
  const [flags, setFlags] = useState({ g: true, i: false, s: false, m: false }); 

  const regexData = useMemo(() => generateRegexData(blocks, tagset), [blocks, tagset]);

  const addBlock = (tool) => {
    const newBlock = {
      id: Date.now() + Math.random(),
      type: tool.type,
      subType: tool.subType || null,
      content: '',
      options: {}, 
      min: (tool.type === 'POS' || tool.type === 'WILDCARD') ? 1 : (tool.type === 'GAP' ? 0 : null),
      max: (tool.type === 'GAP') ? 3 : (tool.type === 'POS' || tool.type === 'WILDCARD') ? 1 : null,
    };
    if (newBlock.type === 'WILDCARD') newBlock.max = null;

    setBlocks([...blocks, newBlock]);
  };

  const toggleFlag = (flag) => {
      setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 selection:bg-blue-200">
      <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-30 shadow-sm/50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-blue-200 shadow-lg">R</div>
             <div>
                <h1 className="font-bold text-slate-800 leading-tight text-lg">Regex Builder <span className="text-slate-400 font-normal">for Linguistics</span></h1>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">可视化构建工具 v0.5 (AI 增强版)</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            <span className="text-xs text-gray-500 font-bold">语料库格式:</span>
            <select 
                value={tagset} 
                onChange={(e) => setTagset(e.target.value)}
                className="text-xs border-none bg-transparent outline-none focus:ring-0 text-gray-700 font-medium cursor-pointer hover:text-blue-600"
            >
                {Object.values(TAGSETS).map(ts => (
                    <option key={ts.id} value={ts.id}>{ts.label}</option>
                ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-7 flex flex-col">
          <Toolbar onAddBlock={addBlock} />
          <BuilderArea 
            blocks={blocks} 
            setBlocks={setBlocks} 
            onHover={setHoveredBlockId} 
          />
        </div>

        <div className="lg:col-span-5 space-y-6 sticky top-28 h-fit">
          <RegexOutput 
            regexData={regexData} 
            flags={flags} 
            toggleFlag={toggleFlag}
            hoveredBlockId={hoveredBlockId} 
          />
          
          {/* 新增: AI 解释器 */}
          <AIExplainer 
            regexString={regexData.pattern} 
            flags={flags} 
          />

          <MatchPreview 
            regexData={regexData} 
            flags={flags}
            hoveredBlockId={hoveredBlockId}
          />
        </div>
      </main>
    </div>
  );
}

export default App;