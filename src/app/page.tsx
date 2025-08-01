'use client';

import { useState } from 'react';
import InputForm from '@/components/InputForm';
import ScoreDisplay from '@/components/ScoreDisplay';
import SuggestionCard from '@/components/SuggestionCard';
import SpeakerTypeDisplay from '@/components/SpeakerType';
import { analyzePresentation, AnalysisResult } from '@/utils/analyzer';
import { diagnoseSpeakerType, SpeakerType } from '@/data/speakers';

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [speakerType, setSpeakerType] = useState<SpeakerType | null>(null);

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    
    // プロトタイプなので簡単な遅延で分析中を演出
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysisResult = analyzePresentation(text);
    const speakerResult = diagnoseSpeakerType(text);
    
    setResult(analysisResult);
    setSpeakerType(speakerResult);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setResult(null);
    setSpeakerType(null);
  };

  return (
    <div className="space-y-8 pb-8">
      <InputForm onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
      
      {result && speakerType && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-ted-dark">分析結果</h2>
            <button
              onClick={handleReset}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              リセット
            </button>
          </div>
          
          <ScoreDisplay result={result} />
          <SuggestionCard suggestions={result.suggestions} />
          <SpeakerTypeDisplay speakerType={speakerType} />
        </div>
      )}
    </div>
  );
}