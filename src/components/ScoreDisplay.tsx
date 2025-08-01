import { AnalysisResult } from '@/utils/analyzer';

interface ScoreDisplayProps {
  result: AnalysisResult;
}

const StarRating = ({ score }: { score: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-2xl ${
            star <= score ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default function ScoreDisplay({ result }: ScoreDisplayProps) {
  const categories = [
    { name: 'Emotion (感情への訴求)', key: 'emotion' as keyof AnalysisResult, description: '聴衆の感情を動かす力' },
    { name: 'Novelty (新規性)', key: 'novelty' as keyof AnalysisResult, description: '意外性や新しい視点' },
    { name: 'Memorability (記憶に残る)', key: 'memorability' as keyof AnalysisResult, description: '印象に残りやすさ' },
    { name: 'Storytelling (物語性)', key: 'storytelling' as keyof AnalysisResult, description: 'ストーリーの構成力' }
  ];

  return (
    <div className="space-y-6">
      {/* 総合スコア */}
      <div className="bg-ted-red text-white p-6 rounded-lg text-center">
        <h3 className="text-2xl font-bold mb-2">総合評価</h3>
        <div className="flex justify-center mb-2">
          <StarRating score={result.overall} />
        </div>
        <p className="text-lg">{result.overall}/5 点</p>
      </div>

      {/* 詳細スコア */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-ted-dark">詳細スコア</h3>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.key} className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div>
                <h4 className="font-semibold text-ted-dark">{category.name}</h4>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <StarRating score={result[category.key] as number} />
                <span className="font-bold text-ted-dark">
                  {result[category.key]}/5
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}