import { emotionKeywords, noveltyKeywords, memorabilityKeywords, storytellingKeywords, KeywordConfig } from '@/data/keywords';

export interface AnalysisResult {
  emotion: number;
  novelty: number;
  memorability: number;
  storytelling: number;
  overall: number;
  suggestions: string[];
}

function calculateCategoryScore(text: string, keywords: KeywordConfig): number {
  const lowerText = text.toLowerCase();
  let score = 0;
  
  // 高スコアキーワードの検出 (3点)
  keywords.high.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      score += 3;
    }
  });
  
  // 中スコアキーワードの検出 (1点)
  keywords.medium.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      score += 1;
    }
  });
  
  // スコアを1-5の星評価に変換
  if (score >= 10) return 5;
  if (score >= 7) return 4;
  if (score >= 4) return 3;
  if (score >= 2) return 2;
  return score > 0 ? 1 : 0;
}

function generateSuggestions(scores: { emotion: number; novelty: number; memorability: number; storytelling: number }): string[] {
  const suggestions: string[] = [];
  
  if (scores.emotion <= 2) {
    suggestions.push('感情に訴える表現を増やしましょう。「感動」「驚き」「体験談」などの要素を加えてみてください。');
  }
  
  if (scores.novelty <= 2) {
    suggestions.push('意外性のある情報や新しい視点を提示しましょう。「実は」「しかし」「驚くべきことに」などの表現を使ってみてください。');
  }
  
  if (scores.memorability <= 2) {
    suggestions.push('具体的な数字やデータ、比喩表現を使って記憶に残りやすくしましょう。「たった○○で」「××倍」などの表現が効果的です。');
  }
  
  if (scores.storytelling <= 2) {
    suggestions.push('ストーリー性を高めましょう。時系列を意識し、「昔」「そして」「最終的に」などの表現で物語の流れを作ってください。');
  }
  
  return suggestions;
}

export function analyzePresentation(text: string): AnalysisResult {
  const scores = {
    emotion: calculateCategoryScore(text, emotionKeywords),
    novelty: calculateCategoryScore(text, noveltyKeywords),
    memorability: calculateCategoryScore(text, memorabilityKeywords),
    storytelling: calculateCategoryScore(text, storytellingKeywords),
  };
  
  const overall = Math.round((scores.emotion + scores.novelty + scores.memorability + scores.storytelling) / 4);
  const suggestions = generateSuggestions(scores);
  
  return {
    ...scores,
    overall,
    suggestions
  };
}