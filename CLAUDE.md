# retro-board

Cloudflare Worker 專案：Vite + React 前端與 Worker API 共用同一份 `wrangler` 設定，透過 `@cloudflare/vite-plugin` 讓本機開發環境盡量貼近正式的 Workers runtime。

## Technical Stack

- Node.js 22（見 `.nvmrc`）
- pnpm（見 `package.json` 的 `packageManager` 欄位）
- Vite + React + TypeScript（前端）
- Cloudflare Workers + Wrangler（後端／部署）
- `@cloudflare/vite-plugin`：讓 `vite dev` 直接跑在 `workerd` 上

## 目錄結構

```
src/                  React 前端（Vite 進入點）
worker/               Cloudflare Worker（/api/* 由這裡處理，其餘走靜態資產 + SPA fallback）
wrangler.jsonc        Worker 設定（name、compatibility_date、assets 路由）
tsconfig.app.json     前端 TS 設定
tsconfig.worker.json  Worker TS 設定（含 @cloudflare/workers-types）
tsconfig.node.json    vite.config.ts 用
```

`worker/index.ts` 目前只放了一個示範用的 `GET /api/ping` 端點，之後要加新的 API route 直接在這裡擴充就好；不屬於 `/api/*` 的請求一律交給靜態資產處理（`wrangler.jsonc` 的 `assets.run_worker_first` 已限定只有 `/api/*` 開頭的請求才會先進 Worker）。

## 常用指令

```
pnpm dev          # 啟動開發伺服器（前端 + Worker，跑在 workerd 上）
pnpm build        # 型別檢查 + build 出 dist/client（靜態資產）與 dist/<worker>（部署用設定）
pnpm preview      # 用 build 產物本地預覽
pnpm lint         # eslint
pnpm deploy       # build 後執行 wrangler deploy
pnpm cf-typegen   # 依 wrangler.jsonc 重新產生 worker-configuration.d.ts（Env 型別）
```

改了 `wrangler.jsonc`（例如新增 binding）之後記得重跑 `pnpm cf-typegen`，`Env` 型別才會同步更新。`worker-configuration.d.ts` 是自動產生的檔案，已加進 `.gitignore`，不用手動維護或提交。

## 部署設定備註

- `assets.directory` 不用手動填：`vite build` 時 `@cloudflare/vite-plugin` 會自動算好寫進 `dist/<worker>/wrangler.json`（部署用的解析後設定），`wrangler deploy` 會自動改讀這份檔案，而不是專案根目錄的 `wrangler.jsonc`。
- `compatibility_date` 不能晚於目前安裝的 `workerd` 套件版本所支援的日期，不然 `pnpm dev` 會直接噴 `ERR_FUTURE_COMPATIBILITY_DATE`；之後升級 `wrangler`／`workerd` 再視情況調整即可。
