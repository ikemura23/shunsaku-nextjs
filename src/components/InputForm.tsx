'use client';

import { useState } from 'react';

interface InputFormProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export default function InputForm({ onAnalyze, isAnalyzing }: InputFormProps) {
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    
    if (inputText.trim().length === 0) {
      setError('プレゼン内容を入力してください');
      return;
    }
    
    if (inputText.trim().length < 50) {
      setError('最低50文字以上入力してください');
      return;
    }
    
    onAnalyze(inputText.trim());
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-ted-dark">プレゼン内容を入力してください</h2>
      <textarea
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
          setError('');
        }}
        placeholder="あなたのプレゼン内容をここに入力してください...&#10;&#10;例：&#10;皆さん、今日は来ていただいてありがとうございます。私は10年間、人々のコミュニケーションを研究してきました。そして驚くべき発見をしました。実は、私たちが思っている以上に、身体の姿勢が私たちの気持ちや行動に大きな影響を与えているのです..."
        className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-ted-red focus:border-transparent"
        disabled={isAnalyzing}
      />
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
      
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          文字数: {inputText.length} / 最低50文字
        </p>
        <button
          onClick={handleSubmit}
          disabled={inputText.length < 50 || isAnalyzing}
          className="bg-ted-red text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? '分析中...' : '分析開始'}
        </button>
      </div>
    </div>
  );
}