const fs = require('fs');
const path = require('path');

const TRANSLATIONS_PATH = path.join(__dirname, '_extracted', 'translations.json');
const OUTPUT_PATH = path.join(__dirname, '_extracted', 'translations_jp.json');

// 主要な用語マッピング
const termMap = {
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
        "消火症": "消火症",
        "其他": "その他",
        "通货": "通貨",
        "装备": "装備",
        "子类型": "サブタイプ",
        "请选择主类型": "メインタイプを選択"
    },
    "searchAndFilters": {
        "搜索物品": "アイテム検索",
        "搜索物品名称": "アイテム名検索",
        "搜索Items名称": "アイテム名検索",
        "搜索策略/物品": "戦略/アイテム検索",
        "搜索策略/Items": "戦略/アイテム検索",
        "价格过滤": "価格フィルター",
        "未设置": "未設定",
        "价格低→高": "価格: 安い順",
        "价格高→低": "価格: 高い順",
        "更新时间 新→旧": "更新: 新しい順",
        "更新时间 旧→新": "更新: 古い順",
        "最低价格": "最低価格",
        "最高价格": "最高価格"
    },
    "stats": {
        "件物品": "個のアイテム",
        "总价值": "合計価値",
        "背包价值": "バッグ内価値",
        "Backpack价值": "バッグ内価値",
        "总价值: 0火": "合計価値: 0 火",
        "Total Value: 0火": "合計価値: 0 火",
        "Items: 0 件": "アイテム: 0個",
        "物品: 0 件": "アイテム: 0個",
        "0 件Items": "0 個のアイテム",
        "0 件物品": "0 個のアイテム",
        "0 条": "0 件"
    },
    "currency": {
        "火/分钟": "火/分",
        "0 火/分钟": "0 火/分",
        "0/分钟": "0/分",
        "成本:0🔥": "コスト:0🔥",
        "拾取:0🔥": "獲得:0🔥"
    },
    "mapStats": {
        "地图 / 时间": "マップ / 時間",
        "地图日志": "マップログ",
        "地图记录": "マップ記録",
        "地图次数": "周回数",
        "地图内时长累加": "合計マップ内時間",
        "地图效率": "マップ効率",
        "图内时长": "マップ内時間",
        "时长": "時間",
        "实际": "実数値",
        "实际时长": "実働時間",
        "总时长": "合計時間",
        "效率": "効率",
        "平均效率": "平均効率"
    },
    "profit": {
        "收益": "収益",
        "总收益(扣税)": "合計収益(税引後)",
        "成本": "コスト",
        "拾取": "獲得",
        "每分钟收益": "分間収益",
        "收益趋势": "収益トレンド"
    },
    "actions": {
        "清除数据": "データ削除",
        "清空": "クリア",
        "重置": "リセット",
        "刷新": "更新",
        "刷新数据": "データ更新"
    },
    "messages": {
        "暂无拾取记录": "獲得履歴なし",
        "暂无记录": "履歴なし",
        "暂无アイテム": "アイテムなし",
        "暂无物品": "アイテムなし",
        "暂无Items": "アイテムなし",
        "暂无价格数据": "価格データなし",
        "暂无数据": "データなし",
        "暂无历史日期": "履歴データなし",
        "未检测角色": "キャラクター未検出",
        "注：传奇均为未鉴定価格": "注: レジェンダリーは未鑑定価格です",
        "○ 等待进入": "○ 入場待機中",
        "点击Items查看波动図": "アイテムクリックで価格推移を表示",
        "点击物品查看波动図": "アイテムクリックで価格推移を表示"
    },
    "itemNames": {
        "初火源质": "原初の火の源",
        "初火灵砂": "初火の霊砂",
        "神聖化石": "神聖な化石",
        "遺忘之水": "忘却の水",
        "能量核心": "エネルギーコア",
        "珍身灰烬": "貴重な残り火",
        "奇迹之魔方": "欲望の魔方",
        "欲念骸化石": "欲望の骸化石",
        "升华之匙": "昇華の鍵",
        "異界回響": "異界の残響"
    }
};

// 共通置換ルール (ゲーム内公式準拠)
const commonRules = [
    { pattern: /灰烬/g, replacement: "残り火" },
    { pattern: /罗盘/g, replacement: "コンパス" },
    { pattern: /宿命/g, replacement: "宿命" },
    { pattern: /天命/g, replacement: "天命" },
    { pattern: /时刻/g, replacement: "時刻" },
    { pattern: /信标/g, replacement: "ビーコン" },
    { pattern: /器官/g, replacement: "機関" },
    { pattern: /（崇高）/g, replacement: "（崇高）" },
    { pattern: /\(Noble\)/g, replacement: "（崇高）" },
    // スキル名 (標準的な公式カタカナ表記)
    { pattern: /Rain of Arrows/g, replacement: "アローレイン" },
    { pattern: /Whirlwind/g, replacement: "ワールウィンド" },
    { pattern: /Blizzard/g, replacement: "ブリザード" },
    { pattern: /Lightning Storm/g, replacement: "ライトニングストーム" },
    { pattern: /Flame Jet/g, replacement: "フレイムジェット" },
    { pattern: /Leap Attack/g, replacement: "リープアタック" },
    { pattern: /Berserking Blade/g, replacement: "バーサーキングブレード" },
    { pattern: /Marked Rain of Arrows/g, replacement: "マークアローレイン" }
];

const TARGET_PATHS = [
    path.join(__dirname, '_extracted', 'translations.json'),
    path.join(__dirname, '_extracted', 'build', 'obf-app', 'translations.json')
];

function main() {
    if (!fs.existsSync(TRANSLATIONS_PATH)) {
        console.error('Source translations.json not found!');
        return;
    }

    const data = JSON.parse(fs.readFileSync(TRANSLATIONS_PATH, 'utf8'));
    const jpData = {};

    for (const category in data) {
        jpData[category] = {};
        for (const zhKey in data[category]) {
            let translated = null;

            const mappedCategory = termMap[category];
            if (mappedCategory && mappedCategory[zhKey]) {
                translated = mappedCategory[zhKey];
            }

            if (!translated && (category === 'itemNames' || category === 'gameContent' || zhKey.includes('宿命'))) {
                let temp = zhKey;
                let matched = false;
                for (const rule of commonRules) {
                    if (rule.pattern.test(temp)) {
                        temp = temp.replace(rule.pattern, rule.replacement);
                        matched = true;
                    }
                }
                if (matched) translated = temp;
            }

            jpData[category][zhKey] = translated || data[category][zhKey];
        }
    }

    const jsonContent = JSON.stringify(jpData, null, 2);
    
    // 全てのターゲットパスを上書き
    TARGET_PATHS.forEach(targetPath => {
        if (fs.existsSync(targetPath)) {
            fs.writeFileSync(targetPath, jsonContent, 'utf8');
            console.log(`Updated: ${targetPath}`);
        } else {
            console.warn(`Target not found: ${targetPath}`);
        }
    });

    // 念のため translations_jp.json も出力しておく
    fs.writeFileSync(OUTPUT_PATH, jsonContent, 'utf8');
}

main();
