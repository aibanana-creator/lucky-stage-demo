# Lucky Stage — Vercel デプロイ手順

このフォルダは、**Vercelへそのまま配置できるVite + React + TypeScriptの静的SPA**です。スロット、ルーレット、ガラガラのヒーロー画像は `public/images/` に同梱されており、Manusのストレージや外部画像URLには依存しません。

## 同梱内容

| 項目 | 内容 |
| --- | --- |
| `src/` | Reactアプリケーション本体 |
| `public/images/` | 型1・型2・型3のローカルWebPヒーロー画像 |
| `public/lucky-stage-mark.svg` | ロゴマーク |
| `vercel.json` | `/manage` を含むSPAの直接アクセス用リライトと画像キャッシュ設定 |
| `pnpm-lock.yaml` | 再現可能な依存関係ロック |
| `ASSET_NOTES.md` | 同梱画像の一覧とハッシュ |

## Vercelへ配置する方法

### 1. GitHub経由（推奨）

1. ZIPを解凍し、`lucky-stage-vercel` フォルダを新しいGitHubリポジトリとしてpushします。
2. Vercel Dashboardで **Add New → Project** を選び、対象リポジトリをImportします。
3. VercelがViteを検出します。設定が表示された場合は、以下を指定します。

| 設定 | 値 |
| --- | --- |
| Framework Preset | `Vite` |
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm build` |
| Output Directory | `dist` |
| Node.js | `22.x` |

4. **Deploy** を押します。環境変数は不要です。

### 2. Vercel CLI経由

Node.js 22とpnpm 11を用意したうえで、解凍したフォルダで実行します。

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm build
npx vercel@latest
# 本番公開する場合
npx vercel@latest --prod
```

## 公開後の確認

- `/` — 抽選ステージ
- `/manage` — 文章編集の管理画面。ブラウザURLに直接入力しても開けます。
- 型1、型2、型3を切り替え、画像が読み込まれることを確認してください。

`vercel.json` はVercel公式のVite SPA向けリライト形式を使用しています。`/manage` を直接開いても `index.html` を返し、React側で管理画面を表示します。

## 文章編集と保存について

管理画面の文章編集は、現在 **各ブラウザのlocalStorageに自動保存**されます。そのため、編集内容は同じブラウザ・同じ端末では維持されますが、他の端末や他の利用者には共有されません。全員共通の管理画面へ拡張する場合は、認証とデータベース／CMSを追加してください。

## 注意

- 本サンプルはデモ用の抽選体験です。決済、残高、当選権利の発行は実装していません。
- `public/images/` の画像はファイル名に内容ハッシュを付け、Vercelで長期キャッシュできるようにしています。画像を差し替える際は、新しいファイル名へ変え、`src/content/stageContent.ts` の該当パスも更新してください。
