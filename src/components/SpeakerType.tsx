import { SpeakerType } from '@/data/speakers';

interface SpeakerTypeProps {
  speakerType: SpeakerType;
}

export default function SpeakerTypeDisplay({ speakerType }: SpeakerTypeProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case 'sinek':
        return '🎯';
      case 'jobs':
        return '💡';
      case 'cuddy':
        return '🔬';
      case 'brown':
        return '❤️';
      default:
        return '⭐';
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-6 rounded-lg">
      <div className="flex items-center mb-4">
        <span className="text-4xl mr-3">{getIcon(speakerType.id)}</span>
        <div>
          <h3 className="text-xl font-bold text-purple-800">あなたのTEDトーカータイプ</h3>
          <h4 className="text-2xl font-bold text-purple-900">{speakerType.name}</h4>
        </div>
      </div>
      
      <p className="text-purple-700 mb-4 text-lg">{speakerType.description}</p>
      
      <div>
        <h5 className="font-bold text-purple-800 mb-2">特徴:</h5>
        <ul className="list-disc list-inside space-y-1">
          {speakerType.characteristics.map((characteristic, index) => (
            <li key={index} className="text-purple-700">
              {characteristic}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}