import React, { useState } from 'react';

const AIExplainer = ({ regexString, flags }) => {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExplain = async () => {
    if (!regexString) return;
    
    setLoading(true);
    setError('');
    setExplanation('');

    try {
      const flagStr = Object.keys(flags).filter(k => flags[k]).join('');
      const fullRegex = `/${regexString}/${flagStr}`;
      
      const prompt = `作为一名计算语言学助教，请用最简洁的中文向语言学学生解释以下正则表达式的含义。
请分步骤说明它匹配什么样的词汇结构、词性和模式。不要堆砌术语，要注重解释其语言学意义，输出尽可能短。

正则表达式: ${fullRegex}

请重点分析：
1. 这个模式在语料库中会匹配什么样的语言单位（单词、短语、句子结构）
2. 涉及哪些词法、句法特征
3. 在语言学研究中的可能应用场景`;

      const response = await fetch(
        'https://api.deepseek.com/v1/chat/completions',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${'sk-38143bce546745a68fc52f013d800544'}`
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: '你是一名专业的计算语言学助教，擅长用简洁明了的中文解释复杂的正则表达式模式，特别关注其在语料库语言学和语言研究中的应用。'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.3, // 降低随机性，确保解释准确
            max_tokens: 500,  // 控制输出长度
            stream: false
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
      }
      
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      
      if (text) {
        setExplanation(text);
      } else {
        throw new Error('未生成有效的解释内容');
      }
      
    } catch (err) {
      console.error('DeepSeek API调用错误:', err);
      setError(err.message.includes('API密钥') 
        ? '请配置正确的DeepSeek API密钥' 
        : `AI服务暂时不可用: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setExplanation('');
    handleExplain();
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-indigo-100 flex justify-between items-center bg-white/50">
        <h3 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
          <span className="text-lg">?</span> 我看不懂上面的这些玩意求解释 orz 
        </h3>
        {!explanation && !loading && (
          <button 
            onClick={handleExplain}
            disabled={!regexString}
            className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
          >
            generate
          </button>
        )}
      </div>
      
      <div className="p-4 min-h-[80px]">
        {loading && (
          <div className="flex items-center gap-2 text-indigo-600 text-sm animate-pulse">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            正在分析语言模式...
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-xs bg-red-50 p-2 rounded border border-red-200">
            {error}
          </div>
        )}

        {!loading && !explanation && !error && (
          <div className="text-center py-4">
            <p className="text-indigo-400 text-xs italic mb-2">
              使用大模型分析当前构建的正则表达
            </p>
            <p className="text-indigo-300 text-[10px]">
              DeepSeek can be biased, please check the important info
            </p>
          </div>
        )}

        {explanation && (
          <div className="space-y-3">
            <div className="bg-white/60 rounded-lg p-3 border border-indigo-100">
              <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                {explanation}
              </div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-indigo-400">使用大模型会为本页面后端服务器产生一定网络压力，并产生费用，请使用同学保持不宜过多的使用频率</span>
              <button 
                onClick={handleRetry}
                className="text-indigo-500 hover:text-indigo-700 hover:underline font-medium"
              >
                重新生成
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIExplainer;