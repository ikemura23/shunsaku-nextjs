'use client';

import { useState } from 'react';

interface ReviewResult {
  reviews: {
    aspect: string;
    score: number;
    feedback: string;
  }[];
  overall: string;
}

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('プレゼン内容を入力してください');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('レビューの取得に失敗しました');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-ted-red">
          TED式 プレゼン指南所
        </h1>
        <p className="text-xl text-ted-gray">
          あなたの資料を&quot;世界最高のプレゼン基準&quot;で添削
        </p>
      </div>

      {/* テキスト入力エリア */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-ted-dark">
          プレゼン内容を入力してください
        </h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-ted-red focus:border-ted-red"
          placeholder="ここにプレゼンの内容を入力してください。&#10;&#10;例：&#10;「今日は人工知能がいかに私たちの生活を変えているかについてお話しします。私が10年前に開発したAIアシスタントは、当初は簡単な質問にしか答えられませんでした。しかし今では...」"
        />
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            文字数: {text.length}
          </span>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-ted-red hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            {loading ? 'レビュー中...' : 'TED基準でレビュー'}
          </button>
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
          {error}
        </div>
      )}

      {/* 結果表示エリア */}
      {result && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-ted-dark text-center mb-8">
            レビュー結果
          </h2>
          
          {/* 5つの観点別カード */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.reviews.map((review, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-ted-red">
                <h3 className="text-lg font-semibold mb-3 text-ted-dark">
                  {review.aspect}
                </h3>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl font-bold text-ted-red mr-2">
                      {review.score}
                    </span>
                    <span className="text-gray-500">/ 10</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-ted-red h-2 rounded-full transition-all duration-500"
                      style={{ width: `${review.score * 10}%` }}
                    ></div>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed">
                  {review.feedback}
                </p>
              </div>
            ))}
          </div>

          {/* 全体コメント */}
          <div className="bg-ted-dark text-white rounded-lg p-8 mt-8">
            <h3 className="text-xl font-semibold mb-4">
              全体的なコメント
            </h3>
            <p className="leading-relaxed">
              {result.overall}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}