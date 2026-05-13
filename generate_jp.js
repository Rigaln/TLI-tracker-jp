const fs = require('fs');
const path = require('path');

const TRANSLATIONS_PATH = path.join(__dirname, '_extracted', 'translations.json');
const OUTPUT_PATH = path.join(__dirname, '_extracted', 'translations_jp.json');

// 主要な用語マッピング
const termMap = {
    // UI - Categories
    "topBar": { "物品": "アイテム", "正在记录": "記録中", "易火 ETor": "易火 ETor" },
    "tabs": { "背包": "バッグ", "仓库": "倉庫", "拾取历史": "獲得履歴" },
    "sidebarMenu": {
        "总览": "概要",
        "价格库": "価格データベース",
        "历史记录": "履歴",
        "策略分析": "戦略分析",
        "排行榜": "ランキング",
        "小窗模式": "ミニウィンドウ"
    },
    "itemCategories": {
        "主类型": "メインタイプ",
        "全部": "全て",
        "技能": "スキル",
        "消火症": "消火症", // ゲーム内名称確認
        "其他": "その他",
        "通货": "通貨",
        "装备": "装備",
        "子类型": "サブタイプ",
        "请选择主类型": "メインタイプを選択"
    },
    "currency": {
        "火/分钟": "火/分",
        "成本:0🔥": "コスト:0🔥",
        "拾取:0🔥": "獲得:0🔥"
    },
    // Data - Common Items
    "itemNames": {
        "初火源质": "原初の火の源",
        "初火灵砂": "初火の霊砂",
        "神聖化石": "神聖な化石",
        "遺忘之水": "忘却の水",
        "エネルギーコア": "エネルギーコア"
    }
};

// TODO: 残りの翻訳データを追加するロジックを実装

function main() {
    if (!fs.existsSync(TRANSLATIONS_PATH)) {
        console.error('translations.json not found!');
        return;
    }

    const data = JSON.parse(fs.readFileSync(TRANSLATIONS_PATH, 'utf8'));
    const jpData = {};

    for (const category in data) {
        jpData[category] = {};
        for (const zhKey in data[category]) {
            // マッピングがあればそれを使用、なければ英語（元の値）を維持
            const mappedCategory = termMap[category];
            if (mappedCategory && mappedCategory[zhKey]) {
                jpData[category][zhKey] = mappedCategory[zhKey];
            } else {
                // デフォルトは英語のまま（未翻訳として後で処理）
                jpData[category][zhKey] = data[category][zhKey];
            }
        }
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(jpData, null, 2), 'utf8');
    console.log(`Generated: ${OUTPUT_PATH}`);
}

main();
