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

// モックデータを返す関数
function getMockReview(): ReviewResponse {
  return {
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
  };
}

// OpenAI APIを使ってレビューを取得する関数
async function getOpenAIReview(text: string): Promise<ReviewResponse> {
  const OpenAI = (await import('openai')).default;
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "あなたはTEDトークの専門家です。プレゼン内容を5つの観点で評価し、JSON形式で回答してください。"
      },
      {
        role: "user",
        content: `以下のプレゼン内容を5つの観点で評価してください：

【プレゼン内容】
${text}

【評価観点】
1. Emotion（感情を揺さぶる度）- 聴衆の心に響く内容かどうか
2. Novelty（驚き・意外性）- 新しい視点や驚きがあるか
3. Memorability（記憶に残る度）- 印象的で覚えやすい内容か
4. Storytelling（ストーリー性）- 物語として構成されているか
5. Time（18分以内の構成）- TED流の時間感覚に適しているか

【回答形式】
各観点を1-10点で評価し、改善ポイントを具体的に提示してください。
また、全体的なコメントも添えてください。

必ずJSON形式で以下の構造で回答してください：
{
  "reviews": [
    {
      "aspect": "Emotion（感情を揺さぶる度）",
      "score": 数値,
      "feedback": "具体的な改善ポイント"
    },
    {
      "aspect": "Novelty（驚き・意外性）",
      "score": 数値,
      "feedback": "具体的な改善ポイント"
    },
    {
      "aspect": "Memorability（記憶に残る度）",
      "score": 数値,
      "feedback": "具体的な改善ポイント"
    },
    {
      "aspect": "Storytelling（ストーリー性）",
      "score": 数値,
      "feedback": "具体的な改善ポイント"
    },
    {
      "aspect": "Time（18分以内の構成）",
      "score": 数値,
      "feedback": "具体的な改善ポイント"
    }
  ],
  "overall": "全体的なコメント"
}`
      }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" }
  });

  const reviewText = completion.choices[0].message.content;
  
  if (!reviewText) {
    throw new Error('OpenAI APIからの応答が空です');
  }

  const reviewData: ReviewResponse = JSON.parse(reviewText);
  
  // OpenAI APIからの結果であることを明記
  reviewData.overall += " （※OpenAI APIによる分析結果）";
  
  return reviewData;
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

    // APIキーの有無を確認
    const hasApiKey = process.env.OPENAI_API_KEY && 
                      process.env.OPENAI_API_KEY.trim() !== '' && 
                      process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';

    if (hasApiKey) {
      console.log('Using OpenAI API for review');
      try {
        const reviewData = await getOpenAIReview(text);
        return NextResponse.json(reviewData);
      } catch (apiError) {
        console.error('OpenAI API Error:', apiError);
        console.log('Falling back to mock data');
        // API呼び出しに失敗した場合はモックデータにフォールバック
        const mockData = getMockReview();
        mockData.overall += " （※OpenAI API呼び出しに失敗したため、モックデータを表示）";
        return NextResponse.json(mockData);
      }
    } else {
      console.log('API key not configured, using mock data');
      return NextResponse.json(getMockReview());
    }
    
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { error: 'レビューの処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}