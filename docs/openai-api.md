# OpenAI API 呼び出しガイド

## 概要
このドキュメントでは、プロジェクト内で使用されているOpenAI API呼び出しの実装パターンと、他プロジェクトでの再利用方法について説明します。

## 実装パターン

### 基本的な API 呼び出し構造

```typescript
import { NextRequest, NextResponse } from 'next/server';

// OpenAI APIを使用したレビュー取得関数
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
        content: "システムプロンプト"
      },
      {
        role: "user", 
        content: `ユーザーからの入力: ${text}`
      }
    ],
    temperature: 0.7
  });

  const responseText = completion.choices[0].message.content;
  
  if (!responseText) {
    throw new Error('OpenAI APIからの応答が空です');
  }

  // JSONレスポンスのクリーニング処理
  const cleanedText = responseText
    .replace(/```json\n?/g, '')
    .replace(/\n?```/g, '')
    .trim();

  return JSON.parse(cleanedText);
}
```

### 重要な実装ポイント

#### 1. 動的インポート
```typescript
const OpenAI = (await import('openai')).default;
```
- サーバーサイドでのみOpenAIライブラリを読み込む
- 静的ビルド時のエラーを回避

#### 2. 環境変数の管理
```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```
- `.env.local`に`OPENAI_API_KEY`を設定
- 本番環境では環境変数として設定

#### 3. エラーハンドリングとフォールバック
```typescript
// APIキーの有無を確認
const hasApiKey = process.env.OPENAI_API_KEY && 
                  process.env.OPENAI_API_KEY.trim() !== '' && 
                  process.env.OPENAI_API_KEY !== 'your_openai_api_key_here';

if (hasApiKey) {
  try {
    const reviewData = await getOpenAIReview(text);
    return NextResponse.json(reviewData);
  } catch (apiError) {
    console.error('OpenAI API Error:', apiError);
    // モックデータにフォールバック
    const mockData = getMockReview();
    return NextResponse.json(mockData);
  }
} else {
  // APIキーが設定されていない場合はモックデータを返す
  return NextResponse.json(getMockReview());
}
```

#### 4. JSON レスポンスのクリーニング
```typescript
const cleanedText = responseText
  .replace(/```json\n?/g, '')
  .replace(/\n?```/g, '')
  .trim();
```
- OpenAI APIが返すマークダウン形式のコードブロックを除去
- 純粋なJSONデータを抽出

### プロンプト設計のベストプラクティス

#### システムプロンプト
```typescript
{
  role: "system",
  content: "あなたはTEDトークの専門家です。プレゼン内容を5つの観点で評価し、必ず有効なJSON形式で回答してください。JSON以外の文字は一切含めないでください。"
}
```

#### ユーザープロンプト
```typescript
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
以下のJSON構造で回答してください（この形式以外は回答しないでください）：
{
  "reviews": [...],
  "overall": "全体的なコメント"
}`
}
```

### モック データの実装

```typescript
function getMockReview(): ReviewResponse {
  return {
    reviews: [
      {
        aspect: "Emotion（感情を揺さぶる度）",
        score: 7,
        feedback: "具体的なフィードバック内容"
      },
      // ... 他の評価項目
    ],
    overall: "全体的なコメント（※これはモックデータによるテスト結果です）"
  };
}
```

## 他プロジェクトでの再利用方法

### 1. 必要な依存関係
```bash
npm install openai
npm install @types/node  # TypeScript使用時
```

### 2. 環境変数の設定
```bash
# .env.local
OPENAI_API_KEY=your_actual_api_key_here
```

### 3. 基本テンプレート
```typescript
// lib/openai-client.ts
export async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  model: string = "gpt-4"
) {
  const OpenAI = (await import('openai')).default;
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7
  });

  const responseText = completion.choices[0].message.content;
  
  if (!responseText) {
    throw new Error('OpenAI APIからの応答が空です');
  }

  return responseText;
}
```

### 4. API ルートでの使用例
```typescript
// app/api/your-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '@/lib/openai-client';

export async function POST(request: NextRequest) {
  try {
    const { input } = await request.json();
    
    const systemPrompt = "あなたの役割を定義";
    const userPrompt = `ユーザー入力: ${input}`;
    
    const response = await callOpenAI(systemPrompt, userPrompt);
    
    return NextResponse.json({ result: response });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'エラーが発生しました' },
      { status: 500 }
    );
  }
}
```

## 設定のカスタマイズ

### モデルの選択
- `gpt-4` - 高品質だが低速・高コスト
- `gpt-4-turbo` - バランスの取れた選択肢
- `gpt-3.5-turbo` - 高速・低コスト

### パラメータの調整
```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [...],
  temperature: 0.7,        // 創造性（0-2）
  max_tokens: 1000,        // 最大トークン数
  top_p: 1,               // 多様性制御
  frequency_penalty: 0,    // 繰り返し制御
  presence_penalty: 0      // 新しい話題への誘導
});
```

## セキュリティ考慮事項

1. **APIキーの管理**
   - 環境変数を使用し、コードに直接記載しない
   - `.env.local`を`.gitignore`に追加

2. **レート制限**
   - OpenAI APIのレート制限を考慮
   - 必要に応じてリトライロジックを実装

3. **コスト管理**
   - 使用量監視の実装
   - 適切なmax_tokensの設定

4. **入力検証**
   - ユーザー入力のサニタイズ
   - 適切な文字数制限

## トラブルシューティング

### よくあるエラーと解決方法

#### 1. `Module not found: Can't resolve 'openai'`
```bash
npm install openai
```

#### 2. `API key not provided`
```bash
# 環境変数を確認
echo $OPENAI_API_KEY
```

#### 3. `JSON.parse() エラー`
- レスポンスのクリーニング処理を確認
- プロンプトでJSON形式を明確に指定

#### 4. `Rate limit exceeded`
- リクエスト頻度を制限
- 適切な待機時間を設定

## 関連ドキュメント
- [OpenAI API公式ドキュメント](https://platform.openai.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [プロジェクト設計書](./design.md)