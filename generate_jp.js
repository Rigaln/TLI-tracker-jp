const fs = require('fs');
const path = require('path');

const TRANSLATIONS_PATH = path.join(__dirname, '_extracted', 'translations.json');
const OUTPUT_PATH = path.join(__dirname, '_extracted', 'translations_jp.json');
const TARGET_PATHS = [
    path.join(__dirname, '_extracted', 'translations.json'),
    path.join(__dirname, '_extracted', 'build', 'obf-app', 'translations.json')
];

// 主要な用語マッピング
const termMap = {
    "topBar": { "物品": "アイテム", "正在记录": "記録中", "易火 ETor": "易火 ETor" },
    "tabs": { "背包": "バッグ", "仓库": "倉庫", "拾取历史": "獲得履歴" },
    "sidebarMenu": {
        "总览": "概要", "价格库": "価格データベース", "历史记录": "履歴",
        "策略分析": "戦略分析", "排行榜": "ランキング", "小窗模式": "ミニウィンドウ"
    },
    "itemCategories": {
        "主类型": "メインタイプ", "全部": "全て", "技能": "スキル", "消火症": "消火症",
        "其他": "その他", "通货": "通貨", "装备": "装備", "子类型": "サブタイプ", "请选择主类型": "メインタイプを選択"
    },
    "searchAndFilters": {
        "搜索物品": "アイテム検索", "搜索物品名称": "アイテム名検索", "搜索Items名称": "アイテム名検索",
        "搜索策略/物品": "戦略/アイテム検索", "搜索策略/Items": "戦略/アイテム検索",
        "价格过滤": "価格フィルター", "未设置": "未設定", "价格低→高": "価格: 安い順", "价格高→低": "価格: 高い順",
        "更新时间 新→旧": "更新: 新しい順", "更新时间 旧→新": "更新: 古い順", "最低价格": "最低価格", "最高价格": "最高価格"
    },
    "stats": {
        "件物品": "個のアイテム", "总价值": "合計価値", "背包价值": "バッグ内価値", "Backpack价值": "バッグ内価値",
        "总价值: 0火": "合計価値: 0 火", "Total Value: 0火": "合計価値: 0 火",
        "Items: 0 件": "アイテム: 0個", "物品: 0 件": "アイテム: 0個", "0 件Items": "0 個のアイテム", "0 件物品": "0 個のアイテム", "0 条": "0 件"
    },
    "currency": { "火/分钟": "火/分", "0 火/分钟": "0 火/分", "0/分钟": "0/分", "成本:0🔥": "コスト:0🔥", "拾取:0🔥": "獲得:0🔥" },
    "mapStats": {
        "地图 / 时间": "マップ / 時間", "地图日志": "マップログ", "地图记录": "マップ記録", "地图次数": "周回数",
        "地图内时长累加": "合計マップ内時間", "地图效率": "マップ効率", "图内时长": "マップ内時間", "时长": "時間",
        "实际": "実数値", "实际时长": "実働時間", "总时长": "合計時間", "效率": "効率", "平均效率": "平均効率"
    },
    "profit": {
        "收益": "収益", "总收益(扣税)": "合計収益(税引後)", "成本": "コスト", "拾取": "獲得",
        "每分钟收益": "分間収益", "收益趋势": "収益トレンド"
    },
    "messages": {
        "暂无拾取记录": "獲得履歴なし", "暂无记录": "履歴なし", "暂无アイテム": "アイテムなし", "暂无物品": "アイテムなし",
        "暂无Items": "アイテムなし", "暂无价格数据": "価格データなし", "暂无数据": "データなし", "暂无历史日期": "履歴データなし",
        "暂无策略数据，请先刷图或调整筛选条件": "戦略データがありません。周回するかフィルターを調整してください",
        "暂无赛季信息": "シーズン情報なし", "未检测角色": "キャラクター未検出",
        "先在游戏设置内点击开启日志，然后重新选择角色进入游戏": "設定でログを有効にし、キャラを選択し直してください",
        "注：传奇均为未鉴定价格": "注: レジェンダリーは未鑑定価格です",
        "○ 等待进入": "○ 入場待機中", "点击Items查看波动图": "クリックで価格推移を表示", "点击物品查看波动图": "クリックで価格推移を表示",
        "仅展示 K1 - 深空 的进入记录": "K1 - 深空 の入場記録のみ表示"
    },
    "windows": { "关闭": "閉じる", "最大化": "最大化", "最小化": "最小化", "切换显示": "表示切替" },
    "actions": { "清除数据": "データ削除", "清空": "クリア", "重置": "リセット", "刷新": "更新", "刷新数据": "データ更新" },
    "lists": { "Items列表": "アイテムリスト", "物品列表": "アイテムリスト" },
    "timeRanges": {
        "今日": "今日", "本周": "今週", "本月": "今月", "近7天": "直近7日間", "近30天": "直近30日間",
        "当前会话": "現在のセッション", "日期选择": "日付選択"
    },
    "modes": { "全部轮次": "全周回", "All轮次": "全周回", "轮次模式": "周回モード", "跟随地图": "マップに追従", "仅最新版本": "最新バージョンのみ" },
    "filters": {
        "角色": "キャラクター", "选择角色": "キャラクター選択", "All主天赋": "全メイン天賦", "全部主天赋": "全メイン天賦",
        "All区域": "全エリア", "全部区域": "全エリア", "All成本Items": "全コストアイテム", "全部成本物品": "全コストアイテム",
        "All时刻": "全時刻", "全部时刻": "全時刻", "All玩法": "全コンテンツ", "全部玩法": "全コンテンツ",
        "All英雄": "全ヒーロー", "全部英雄": "全ヒーロー"
    },
    "heroes": {
        "冰1": "氷1(ジェマ)", "冰2": "氷2(ジェマ)", "冰3": "氷3(ジェマ)",
        "召唤1": "召喚1(モト)", "召唤2": "召喚2(モト)",
        "宾1": "ビン1", "宾2": "ビン2",
        "时空1": "時空1(ユガ)", "时空2": "時空2(ユガ)", "时空3": "時空3(ユガ)",
        "月1": "月1(シア)", "月2": "月2(シア)", "月3": "月3(シア)",
        "枪1": "銃1(カリーノ)", "枪2": "銃2(カリーノ)", "枪3": "銃3(カリーノ)",
        "深空": "深空", "狂1": "狂1(リグ)", "狂2": "狂2(リグ)",
        "猫1": "猫1(エリカ)", "猫2": "猫2(エリカ)", "猫3": "猫3(エリカ)",
        "罗莎1": "ロサ1", "罗莎2": "ロサ2",
        "魔灵1": "魔霊1(アイリス)", "魔灵2": "魔霊2(アイリス)", "魔灵3": "魔霊3(アイリス)"
    },
    "typeLabels": {
        "辅助技能": "補強スキル", "主动技能": "アクティブスキル", "被动技能": "パッシブスキル", "触媒技能": "トリガースキル",
        "崇高辅助技能": "崇高補強スキル", "华贵辅助技能": "華麗補強スキル", "记忆荧光": "記憶の蛍光", "传奇装备": "レジェンダリー装備",
        "小型": "小型", "中型": "中型", "大型": "大型", "小型节点": "小ノード", "中型节点": "中ノード", "大型节点": "大ノード"
    },
    "ui": {
        "上一页": "前へ", "下一页": "次へ", "分页": "ページ", "件物品": "個のアイテム", "件Items": "個のアイテム",
        "单价": "単価", "未记录": "未記録", "预备": "準備中", "未知惊喜": "未知のサプライズ",
        "召唤雷霆之灵": "雷の精霊召喚", "渴饮症": "渇飲症"
    },
    "itemNames": {
        "初火源质": "原初の火の源", "初火灵砂": "初火の霊砂", "神聖化石": "神聖な化石", "遺忘之水": "忘却の水",
        "能量核心": "エネルギーコア", "珍身灰烬": "貴重な残り火", "奇迹之魔方": "欲望の魔方", "欲念骸化石": "欲望の骸化石",
        "升华之匙": "昇華の鍵", "異界回響": "異界の残響"
    }
};

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
    // スキル
    { pattern: /Rain of Arrows/g, replacement: "アローレイン" },
    { pattern: /箭雨/g, replacement: "アローレイン" },
    { pattern: /Whirlwind/g, replacement: "ワールウィンド" },
    { pattern: /旋风斩/g, replacement: "ワールウィンド" },
    { pattern: /Blizzard/g, replacement: "ブリザード" },
    { pattern: /暴风雪/g, replacement: "ブリザード" },
    { pattern: /Lightning Storm/g, replacement: "ライトニングストーム" },
    { pattern: /闪电风暴/g, replacement: "ライトニングストーム" },
    { pattern: /Flame Jet/g, replacement: "フレイムジェット" },
    { pattern: /烈焰释放/g, replacement: "フレイムジェット" },
    { pattern: /Leap Attack/g, replacement: "リープアタック" },
    { pattern: /跃击/g, replacement: "リープアタック" },
    { pattern: /Berserking Blade/g, replacement: "バーサーキングブレード" },
    { pattern: /暴走之刃/g, replacement: "バーサーキングブレード" },
    { pattern: /冰环术/g, replacement: "アイスリング" },
    { pattern: /冰锥术/g, replacement: "アイスパイク" },
    { pattern: /电火花/g, replacement: "スパーク" },
    { pattern: /召唤雷霆之灵/g, replacement: "雷の精霊召喚" },
    { pattern: /召唤火焰之灵/g, replacement: "火の精霊召喚" },
    { pattern: /召唤寒冰之灵/g, replacement: "氷の精霊召喚" },
    { pattern: /召唤机械警卫/g, replacement: "マシンガード召喚" }
];

function main() {
    const rawData = fs.readFileSync(TRANSLATIONS_PATH, 'utf8');
    const data = JSON.parse(rawData);
    const jpData = {};

    for (const category in data) {
        jpData[category] = {};
        const mappedCat = termMap[category];
        
        for (const zhKey in data[category]) {
            let translated = null;

            // 1. マッピング確認
            if (mappedCat) {
                if (mappedCat[zhKey]) {
                    translated = mappedCat[zhKey];
                } else {
                    // 曖昧一致 (记->記)
                    const normKey = zhKey.replace(/记/g, '記').replace(/图/g, '図');
                    for (const k in mappedCat) {
                        if (k.replace(/记/g, '記').replace(/图/g, '図') === normKey) {
                            translated = mappedCat[k];
                            break;
                        }
                    }
                }
            }

            // 2. 共通ルール
            if (!translated) {
                let temp = zhKey;
                let changed = false;

                // スキルパターン
                const skillMatch = temp.match(/^(.*)：(.*)（崇高）$/);
                if (skillMatch) {
                    let s = skillMatch[1];
                    let v = skillMatch[2];
                    for (const r of commonRules) {
                        if (r.pattern.test(s)) { s = s.replace(r.pattern, r.replacement); changed = true; }
                    }
                    if (changed) temp = `${s}：${v}（崇高）`;
                }

                for (const r of commonRules) {
                    if (r.pattern.test(temp)) {
                        temp = temp.replace(r.pattern, r.replacement);
                        changed = true;
                    }
                }
                if (changed) translated = temp;
            }

            jpData[category][zhKey] = translated || data[category][zhKey];
        }
    }

    const output = JSON.stringify(jpData, null, 2);
    TARGET_PATHS.forEach(p => {
        if (fs.existsSync(p)) {
            fs.writeFileSync(p, output, 'utf8');
            console.log(`Updated: ${p}`);
        }
    });
    fs.writeFileSync(OUTPUT_PATH, output, 'utf8');
}

main();
