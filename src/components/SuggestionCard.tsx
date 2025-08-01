interface SuggestionCardProps {
  suggestions: string[];
}

export default function SuggestionCard({ suggestions }: SuggestionCardProps) {
  if (suggestions.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-2 text-green-800">素晴らしいプレゼンです！</h3>
        <p className="text-green-700">
          すべての要素がバランス良く含まれています。このまま自信を持ってプレゼンテーションを行ってください。
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-blue-800">改善提案</h3>
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
              {index + 1}
            </div>
            <p className="text-blue-800">{suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}