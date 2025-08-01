import { NextRequest, NextResponse } from 'next/server';

interface ReviewRequest {
  text: string;
}

interface ReviewResponse {
  reviews: {
    aspect: string;
    score: number;
    feedback: string;
  }[];
  overall: string;
}

export async function POST(request: NextRequest) {
  try {
    const { text }: ReviewRequest = await request.json();
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'プレゼン内容を入力してください' },
        { status: 400 }
      );
    }

    // デバッグ用ログ
    console.log('API Key status:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
    console.log('Using mock data for testing');

    // 常にモックデータを返す（テスト用）
    return NextResponse.json({
      reviews: [
        {
          aspect: "Emotion（感情を揺さぶる度）",
          score: 7,
          feedback: "個人的な体験談を冒頭に追加することで、聴衆との感情的なつながりを強化できます。現在の内容は論理的ですが、もう少し感情に訴える要素があると良いでしょう。"
        },
        {
          aspect: "Novelty（驚き・意外性）",
          score: 6,
          feedback: "予想外の統計データや事例を提示することで、聴衆の注意を引くことができます。「実は...」から始まる驚きの事実を1つ2つ追加してみてください。"
        },
        {
          aspect: "Memorability（記憶に残る度）",
          score: 8,
          feedback: "記憶に残りやすい比喩やキーフレーズを使用しており、良い構成です。さらに強化するために、3つのポイントをシンプルなキーワードでまとめると効果的です。"
        },
        {
          aspect: "Storytelling（ストーリー性）",
          score: 5,
          feedback: "現在は情報提供が中心です。「問題→解決→変化」の流れでストーリー構造を作ると、より引き込まれる内容になります。具体的な人物やシーンを描写してみてください。"
        },
        {
          aspect: "Time（18分以内の構成）",
          score: 9,
          feedback: "内容量は18分以内で話せる適切な長さです。各セクションの時間配分も良好で、TED形式に適した構成になっています。"
        }
      ],
      overall: "全体的に論理的で整理された内容ですが、感情に訴える要素とストーリー性を強化することで、より印象的なTEDトークになるでしょう。特に冒頭での個人的体験談の追加と、明確な問題解決のストーリー構造の導入をお勧めします。（※これはモックデータによるテスト結果です）"
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { error: 'レビューの処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}