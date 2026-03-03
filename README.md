# Vibe Requirements — 需求探索助手

> 魔法是想像的世界，無法想像的東西就無法用魔法實現。

一個 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 的 Skill，幫助 Vibe Coder 從模糊的產品想法，一步步釐清需求，最終產出可以直接交給 AI 開發的完整需求文件。

## 解決什麼問題？

Vibe Coding 的最大瓶頸不是寫程式，而是**不知道要寫什麼**。

很多人帶著「我想做一個 XXX」的模糊想法，就直接開始請 AI 寫程式，結果做出來的東西跟想像的完全不一樣。這個 Skill 就是那個「先想清楚再動手」的過程——用互動對話的方式，把你腦中的想法變成結構化的需求文件。

## 工作流程

```
接住想法 → 判斷複雜度 → 分層思考 → 撰寫 User Story → EARS 品質檢查
```

| 階段 | 做什麼 | 使用的框架 |
|------|--------|-----------|
| 接住想法 | 用對話理解你的核心想法 | [CARNET 訪談框架](references/carnet.md) |
| 判斷複雜度 | 定位產品的系統複雜度 | [五層級模型](references/complexity-levels.md) |
| 分層思考 | 從戰略到表現逐層釐清 | [產品五層思考](references/product-layers.md) |
| 撰寫 Story | 產出可執行的 User Story | SKILL.md 內建指引 |
| 品質檢查 | 確保需求不模糊、不遺漏 | [EARS 語法](references/ears.md) |

## 安裝方式

將此資料夾放入你的 Claude Code skills 目錄：

```bash
# 在此專案根目錄下執行，複製到 skills 目錄
cp -r . ~/.claude/skills/vibe-requirements

# 或直接用 git clone 安裝到 skills 目錄
git clone https://github.com/tboydar/vibe-requirements-soking1010.git ~/.claude/skills/vibe-requirements
```

## 使用方式

在 Claude Code 中，當你說出以下類似的話，Skill 就會自動啟動：

- 「我想做一個 ___」
- 「我有一個 idea」
- 「幫我想想這個產品」
- 「這個東西該怎麼做？」

也可以提到關鍵字來觸發：vibe coding、需求釐清、產品規劃、User Story、EARS。

## 最終產出

探索結束後，你會得到一份結構化的 Markdown 需求文件，包含：

1. **產品概述** — 一段話描述問題與解法
2. **複雜度評估** — 屬於哪個層級，為什麼
3. **核心 User Stories** — 3-7 個，含驗收標準
4. **系統架構建議** — 基於複雜度和設計原則
5. **Edge Cases 清單** — 可能的異常情境
6. **EARS 格式需求** — 關鍵需求的精確描述

完整的產出範例請參考 [`examples/sample-output.md`](examples/sample-output.md)。

## 參考資料

| 檔案 | 說明 |
|------|------|
| [`references/carnet.md`](references/carnet.md) | CARNET 需求訪談框架 |
| [`references/complexity-levels.md`](references/complexity-levels.md) | 數位空間複雜度五層級 |
| [`references/product-layers.md`](references/product-layers.md) | 數位產品五層思考模型 |
| [`references/ears.md`](references/ears.md) | EARS 需求語法說明 |
| [`references/architecture.md`](references/architecture.md) | 軟體架構與設計原則 |

## 授權

MIT License
