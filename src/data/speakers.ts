export interface SpeakerType {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  keywords: string[];
}

export const speakerTypes: SpeakerType[] = [
  {
    id: 'sinek',
    name: 'サイモン・シネック型',
    description: 'WHYから始める理念重視のリーダーシップスタイル',
    characteristics: [
      '目的や理念を明確に示す',
      '「なぜ」を問いかける',
      '組織やチームの使命感を重視',
      'インスピレーションを与える'
    ],
    keywords: ['なぜ', '理由', '目的', '使命', 'ミッション', 'ビジョン', '信念', '価値観']
  },
  {
    id: 'jobs',
    name: 'スティーブ・ジョブズ型',
    description: '革新的でシンプルな変革者スタイル',
    characteristics: [
      'シンプルで分かりやすい表現',
      '革新的なアイデアを提示',
      '製品やサービスの変革を語る',
      '未来への明確なビジョン'
    ],
    keywords: ['革新', '変える', 'シンプル', '未来', '変革', 'イノベーション', '新しい', 'デザイン']
  },
  {
    id: 'cuddy',
    name: 'エイミー・カディ型',
    description: '科学的根拠に基づく実証的スタイル',
    characteristics: [
      '科学的データや研究結果を活用',
      '身体的・心理的変化を重視',
      '実験や実証に基づく説明',
      'パワーポーズなど具体的手法'
    ],
    keywords: ['身体', '姿勢', '変化', '実験', '研究', 'データ', '科学', '証明', 'ホルモン']
  },
  {
    id: 'brown',
    name: 'ブレネー・ブラウン型',
    description: '脆弱性と勇気を語る共感型スタイル',
    characteristics: [
      '人間の弱さや脆弱性を受け入れる',
      '勇気と恥の概念を探求',
      '深い人間関係とつながりを重視',
      '個人的な体験談を交える'
    ],
    keywords: ['弱さ', '勇気', '恥', 'つながり', '脆弱性', '共感', '人間関係', '感情']
  }
];

export function diagnoseSpeakerType(text: string): SpeakerType {
  const lowerText = text.toLowerCase();
  const scores: { [key: string]: number } = {};
  
  speakerTypes.forEach(speaker => {
    let score = 0;
    speaker.keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score += 1;
      }
    });
    scores[speaker.id] = score;
  });
  
  // 最高スコアのスピーカータイプを返す
  const bestMatch = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );
  
  return speakerTypes.find(speaker => speaker.id === bestMatch) || speakerTypes[0];
}