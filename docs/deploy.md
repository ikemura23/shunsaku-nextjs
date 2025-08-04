# デプロイメント手順書

## 概要
このドキュメントでは、TED式プレゼン指南所をCloudflare Pagesに手動デプロイする手順を説明します。

### 前提条件
- Node.js環境がセットアップ済み
- Cloudflareアカウントを持っている
- プロジェクトファイルが準備済み

## 事前準備

### 1. 静的エクスポート用の設定確認
`next.config.js`が以下の設定になっていることを確認：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

### 2. プロダクションビルドの実行

#### APIルートの一時的な無効化
静的エクスポートではAPIルートが使用できないため、一時的に無効化します：

```bash
# APIルートをバックアップ
mkdir -p /tmp/backup
cp -r src/app/api /tmp/backup/

# APIルートを削除
rm -rf src/app/api
```

#### ビルド実行
```bash
npm run build
```

#### APIルートの復元
```bash
# APIルートを復元
cp -r /tmp/backup/api src/app/
```

### 3. デプロイファイルの作成
```bash
# outディレクトリから静的ファイルをzip化
cd out
zip -r ../cloudflare-deploy.zip .
cd ..
```

## Cloudflare Pages手動アップロード手順

### 1. Cloudflare Dashboardにアクセス
1. [dash.cloudflare.com](https://dash.cloudflare.com) にログイン
2. 左サイドバーから **「Pages」** をクリック

### 2. 新しいプロジェクト作成
1. **「プロジェクトを作成」** ボタンをクリック
2. **「アセットをアップロード」** タブを選択（Gitタブではなく）

### 3. プロジェクト設定
1. **プロジェクト名** を入力
   - 例：`ted-presentation-advisor-plan2`
   - 英数字とハイフンのみ使用可能
2. **本番環境ブランチ名** はデフォルトのまま（`production`）

### 4. ファイルアップロード
1. **「フォルダーを選択するかファイルをドロップ」** エリアに
2. `cloudflare-deploy.zip` をドラッグ&ドロップ
3. または **「参照」** ボタンでファイル選択

### 5. デプロイ実行
1. **「サイトをデプロイ」** ボタンをクリック
2. アップロードとデプロイが自動実行される
3. 完了すると **`https://[プロジェクト名].pages.dev`** のURLが発行される

### 6. デプロイ確認
- デプロイ完了後、発行されたURLでサイトが表示されるか確認
- レスポンシブデザインが正しく動作するかテスト

## 重要な注意事項

### API機能について
- **現在の制限**: 静的エクスポートではAPIルート（`/api/review`）が動作しません
- **影響**: OpenAI APIを使用したプレゼン添削機能は利用不可
- **表示**: フロントエンドのUIのみ表示されます

### 環境変数について
- **静的サイト**: `.env.local`の環境変数はビルド時に埋め込まれません
- **セキュリティ**: APIキーなどの機密情報は露出しません

## 代替ソリューション

### APIが必要な場合の選択肢
1. **Vercel**: Next.js APIルートをサポート
2. **Netlify Functions**: サーバーレス関数として実装
3. **Cloudflare Workers**: 別途APIを構築
4. **外部API**: 専用のAPIサーバーを構築

## トラブルシューティング

### よくある問題と解決方法

#### ビルドエラー
```
Error: Static generation failed
```
**解決方法**: APIルートが残っていないか確認し、完全に削除してから再ビルド

#### アップロードエラー
```
File too large
```
**解決方法**: zipファイルサイズを確認（25MB制限）、不要なファイルを除外

#### 表示エラー
```
404 Not Found
```
**解決方法**: 
- `index.html`がzipのルートにあるか確認
- `trailingSlash: true`設定を確認

#### CSS/JSが読み込まれない
**解決方法**: 
- `_next`フォルダが正しく含まれているか確認
- ブラウザキャッシュをクリア

## 更新手順

サイトを更新する場合：

1. コードを修正
2. 事前準備の手順を再実行
3. 新しい`cloudflare-deploy.zip`を作成
4. Cloudflare Pages Dashboardで**「新しいデプロイ」**から新しいzipをアップロード

## 関連ドキュメント
- [仕様書](./spec.md)
- [設計書](./design.md)
- [作業タスク](./task.md)