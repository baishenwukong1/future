#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate a standalone offline flashcard app (word-family first) as HTML."""
import json
import os

from teacher_rhymes import TEACHER_ALIKE, TEACHER_FAMILY, TEACHER_THEME

HERE = os.path.dirname(os.path.abspath(__file__))
GROUPS = json.load(open(os.path.join(HERE, "groups.json"), encoding="utf-8"))
OUT = os.path.normpath(os.path.join(HERE, "..", "index.html"))

POEMS = [
    {"zh": "床前明月光，疑是地上霜。", "en": "Before my bed the bright moonlight, like frost upon the ground.", "src": "李白《静夜思》"},
    {"zh": "举头望明月，低头思故乡。", "en": "I raise my head to watch the moon, then lower it, homesick.", "src": "李白《静夜思》"},
    {"zh": "海内存知己，天涯若比邻。", "en": "A bosom friend afar brings a distant land near.", "src": "王勃《送杜少府之任蜀州》"},
    {"zh": "野火烧不尽，春风吹又生。", "en": "Wildfire cannot burn it out; spring breeze brings it back to life.", "src": "白居易《赋得古原草送别》"},
    {"zh": "春眠不觉晓，处处闻啼鸟。", "en": "In spring one sleeps and wakes not till dawn; everywhere birds sing.", "src": "孟浩然《春晓》"},
    {"zh": "欲穷千里目，更上一层楼。", "en": "To see a thousand miles further, climb one story higher.", "src": "王之涣《登鹳雀楼》"},
    {"zh": "白日依山尽，黄河入海流。", "en": "The sun sets behind the mountains; the Yellow River flows into the sea.", "src": "王之涣《登鹳雀楼》"},
    {"zh": "独在异乡为异客，每逢佳节倍思亲。", "en": "Alone, a stranger in a foreign land, I miss my kin twice as much on festivals.", "src": "王维《九月九日忆山东兄弟》"},
    {"zh": "劝君更尽一杯酒，西出阳关无故人。", "en": "Drink one more cup before you go; west of the pass no friend you will know.", "src": "王维《送元二使安西》"},
    {"zh": "大漠孤烟直，长河落日圆。", "en": "Over the desert a lone smoke rises straight; on the long river the setting sun is round.", "src": "王维《使至塞上》"},
    {"zh": "会当凌绝顶，一览众山小。", "en": "When I stand atop the highest peak, all other mountains look small.", "src": "杜甫《望岳》"},
    {"zh": "国破山河在，城春草木深。", "en": "The country is broken, mountains remain; spring fills the city with grass.", "src": "杜甫《春望》"},
    {"zh": "烽火连三月，家书抵万金。", "en": "War fires burn three months on end; a letter from home is worth ten thousand gold.", "src": "杜甫《春望》"},
    {"zh": "随风潜入夜，润物细无声。", "en": "It steals in with the wind by night, moistening things gently and silently.", "src": "杜甫《春夜喜雨》"},
    {"zh": "无边落木萧萧下，不尽长江滚滚来。", "en": "Endless leaves rustle down; the boundless Yangtze rolls on.", "src": "杜甫《登高》"},
    {"zh": "山重水复疑无路，柳暗花明又一村。", "en": "Hills and streams leave no road in doubt, then willows and flowers reveal another village.", "src": "陆游《游山西村》"},
    {"zh": "落红不是无情物，化作春泥更护花。", "en": "Fallen petals are not heartless; they turn to spring soil to guard the flowers.", "src": "龚自珍《己亥杂诗》"},
    {"zh": "横看成岭侧成峰，远近高低各不同。", "en": "A ridge from one side, a peak from another; near, far, high, low, none alike.", "src": "苏轼《题西林壁》"},
    {"zh": "不识庐山真面目，只缘身在此山中。", "en": "I cannot see the true face of Lushan, for I am standing in its midst.", "src": "苏轼《题西林壁》"},
    {"zh": "但愿人长久，千里共婵娟。", "en": "May we all live long, sharing the same moon a thousand miles apart.", "src": "苏轼《水调歌头》"},
    {"zh": "月落乌啼霜满天，江枫渔火对愁眠。", "en": "The moon sets, crows cry, frost fills the sky; riverside maples and fishing lights face a sleepless grief.", "src": "张继《枫桥夜泊》"},
    {"zh": "姑苏城外寒山寺，夜半钟声到客船。", "en": "From Hanshan Temple outside Gusu, the midnight bell reaches the travelers boat.", "src": "张继《枫桥夜泊》"},
    {"zh": "停车坐爱枫林晚，霜叶红于二月花。", "en": "I stop my cart, loving the maple woods at dusk; frost-red leaves outshine spring flowers.", "src": "杜牧《山行》"},
    {"zh": "商女不知亡国恨，隔江犹唱后庭花。", "en": "The song girls know not the grief of a fallen state; they still sing across the river.", "src": "杜牧《泊秦淮》"},
    {"zh": "千里莺啼绿映红，水村山郭酒旗风。", "en": "A thousand miles of orioles, green and red; wine flags flutter over riverside villages.", "src": "杜牧《江南春》"},
    {"zh": "春蚕到死丝方尽，蜡炬成灰泪始干。", "en": "Spring silkworms spin till death; candles weep till they burn to ash.", "src": "李商隐《无题》"},
    {"zh": "夕阳无限好，只是近黄昏。", "en": "The setting sun is infinitely fine, but dusk is drawing near.", "src": "李商隐《登乐游原》"},
    {"zh": "何当共剪西窗烛，却话巴山夜雨时。", "en": "When shall we trim the candle by the west window, and talk of the night rain at Bashan?", "src": "李商隐《夜雨寄北》"},
    {"zh": "两个黄鹂鸣翠柳，一行白鹭上青天。", "en": "Two golden orioles sing in the green willows; a row of white egrets climbs the blue sky.", "src": "杜甫《绝句》"},
    {"zh": "好雨知时节，当春乃发生。", "en": "The good rain knows its season; it comes when spring arrives.", "src": "杜甫《春夜喜雨》"},
    {"zh": "采菊东篱下，悠然见南山。", "en": "Picking chrysanthemums by the eastern hedge, I leisurely glimpse the southern hills.", "src": "陶渊明《饮酒》"},
    {"zh": "落霞与孤鹜齐飞，秋水共长天一色。", "en": "Sunset clouds fly with a lone wild duck; autumn waters merge with the sky.", "src": "王勃《滕王阁序》"},
    {"zh": "天生我材必有用，千金散尽还复来。", "en": "Heaven gave me talents for a purpose; gold spent will come again.", "src": "李白《将进酒》"},
    {"zh": "长风破浪会有时，直挂云帆济沧海。", "en": "There will come a time to ride the wind and waves, and sail across the open sea.", "src": "李白《行路难》"},
    {"zh": "举杯邀明月，对影成三人。", "en": "I raise my cup to invite the moon; with my shadow we make three.", "src": "李白《月下独酌》"},
    {"zh": "少壮不努力，老大徒伤悲。", "en": "If one wastes his youth, old age brings only sorrow.", "src": "汉乐府《长歌行》"},
    {"zh": "百川东到海，何时复西归。", "en": "A hundred rivers flow east to the sea; when will they ever turn back west?", "src": "汉乐府《长歌行》"},
    {"zh": "人生自古谁无死，留取丹心照汗青。", "en": "Since ancient times none escape death; let my loyal heart shine bright in history.", "src": "文天祥《过零丁洋》"},
    {"zh": "千磨万击还坚劲，任尔东西南北风。", "en": "Ground and struck a thousand times, it stands firm, braving winds from every side.", "src": "郑燮《竹石》"},
    {"zh": "不畏浮云遮望眼，自缘身在最高层。", "en": "I fear no clouds that veil my sight, for I stand upon the highest height.", "src": "王安石《登飞来峰》"},
    {"zh": "等闲识得东风面，万紫千红总是春。", "en": "Once you know the face of the east wind, a thousand blossoms all spell spring.", "src": "朱熹《春日》"},
    {"zh": "问渠那得清如许，为有源头活水来。", "en": "Ask the stream why it stays so clear; living water keeps flowing from its source.", "src": "朱熹《观书有感》"},
    {"zh": "旧时王谢堂前燕，飞入寻常百姓家。", "en": "Swallows that nested in noble halls now fly into common homes.", "src": "刘禹锡《乌衣巷》"},
    {"zh": "沉舟侧畔千帆过，病树前头万木春。", "en": "By the sunken boat a thousand sails pass; before the ailing tree, ten thousand thrive.", "src": "刘禹锡《酬乐天扬州初逢席上见赠》"},
    {"zh": "会挽雕弓如满月，西北望，射天狼。", "en": "I will draw my bow like the full moon, aim northwest, and shoot the Sirius star.", "src": "苏轼《江城子·密州出猎》"},
    {"zh": "大江东去，浪淘尽，千古风流人物。", "en": "The great river flows east, its waves washing away the heroes of all time.", "src": "苏轼《念奴娇·赤壁怀古》"},
    {"zh": "竹外桃花三两枝，春江水暖鸭先知。", "en": "A few peach blossoms beyond the bamboo; ducks first know the warming spring river.", "src": "苏轼《惠崇春江晚景》"},
    {"zh": "莫愁前路无知己，天下谁人不识君。", "en": "Grieve not that the road ahead has no friend; who in the world does not know you?", "src": "高适《别董大》"},
]


def trim(s, n):
    if not s:
        return ""
    s = " ".join(str(s).split())
    return s if len(s) <= n else s[: n - 1] + "…"


def build_data():
    idx = {}
    words = []
    for w in GROUPS["families"]:
        for x in w["words"]:
            pass
    # collect words in canonical order: families -> themes -> alikes -> leftover
    order = []
    for g in GROUPS["families"]:
        for x in g["words"]:
            if x["word"].lower() not in idx:
                idx[x["word"].lower()] = len(order)
                order.append(x)
    for g in GROUPS["themes"]:
        for x in g["rows"]:
            if x["word"].lower() not in idx:
                idx[x["word"].lower()] = len(order)
                order.append(x)
    for g in GROUPS["alikes"]:
        for x in g["words"]:
            if x["word"].lower() not in idx:
                idx[x["word"].lower()] = len(order)
                order.append(x)
    for x in GROUPS["leftover"]:
        if x["word"].lower() not in idx:
            idx[x["word"].lower()] = len(order)
            order.append(x)

    def wrec(x):
        ex = x.get("kaoyan_ex")
        app = x.get("example")
        return {
            "w": x["word"],
            "p": x.get("phonetic", ""),
            "d": trim(render_def(x["definition"]), 130),
            "fr": x.get("kaoyan_freq", 0),
            "yr": sorted(int(y) for y in (x.get("kaoyan_years") or {}).keys())[:6],
            "ex": {"y": ex["year"], "s": ex["section"], "t": trim(ex["text"], 150)} if ex else None,
            "nt": trim(x.get("kaoyan_note"), 80),
            "mn": trim(x.get("mnemonic"), 70),
            "e": app[0] if app and app[0] else "",
            "ez": app[1] if app and app[1] else "",
        }

    W = [wrec(x) for x in order]

    def group(g, kind):
        if kind == "family":
            rhyme = TEACHER_FAMILY.get(g["id"]) or ""
            return {"id": g["id"], "t": g["id"].upper(), "n": len(g["members"]), "r": rhyme,
                    "ws": [idx[m] for m in g["members"] if m in idx]}
        if kind == "theme":
            rhyme = TEACHER_THEME.get(g["id"]) or ""
            return {"id": g["id"], "t": g["name"], "n": len(g["rows"]), "r": rhyme,
                    "ws": [idx[x["word"].lower()] for x in g["rows"]]}
        if kind == "alike":
            rep = g["members"][0]
            rhyme = TEACHER_ALIKE.get(rep) or ""
            return {"id": rep, "t": rep, "n": len(g["members"]), "r": rhyme,
                    "ws": [idx[m] for m in g["members"] if m in idx]}

    families = [group(g, "family") for g in GROUPS["families"]]
    themes = [group(g, "theme") for g in GROUPS["themes"]]
    alikes = [group(g, "alike") for g in GROUPS["alikes"]]

    leftover = {}
    for x in GROUPS["leftover"]:
        leftover.setdefault(x["word"][0].upper(), []).append(idx[x["word"].lower()])
    leftover_blocks = [{"L": k, "n": len(v), "ws": v} for k, v in sorted(leftover.items())]

    return {"W": W, "fam": families, "th": themes, "al": alikes, "lo": leftover_blocks, "poems": POEMS}


def render_def(defn, cap=130):
    parts = []
    for pos, senses in defn[:4]:
        if not senses:
            continue
        joined = "，".join(senses[:5])
        if len(senses) > 5:
            joined += "…"
        parts.append((pos + ". " if pos else "") + joined)
    text = "；".join(parts)
    return text if len(text) <= cap else text[:cap] + "…"


APP_HTML = r"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>考研词根记忆卡片</title>
<style>
:root{
  --bg:#f6f7f9; --card:#ffffff; --ink:#1a1a1a; --muted:#6b7280;
  --line:#e3e6ea; --blue:#1f4e79; --blue-bg:#eaf2fb; --green:#2e6b34; --green-bg:#eaf5e8;
  --orange:#a85d12; --orange-bg:#fdf1e3; --red:#c00000; --gray-bg:#f0f0f0;
}
*{box-sizing:border-box; margin:0; padding:0}
body{background:var(--bg); color:var(--ink); font-family:-apple-system,"PingFang SC","Microsoft YaHei",sans-serif; padding:14px; line-height:1.5}
.wrap{max-width:760px; margin:0 auto}
header{display:flex; align-items:baseline; justify-content:space-between; flex-wrap:wrap; gap:6px; margin-bottom:10px}
h1{font-size:20px}
h1 small{color:var(--muted); font-weight:400; font-size:12px}
.stats{font-size:12px; color:var(--muted)}
.tabs{display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px}
.tabs button{flex:1; min-width:110px; padding:8px 4px; border:1px solid var(--line); background:var(--card); border-radius:8px; cursor:pointer; font-size:13px}
.tabs button.on{background:var(--blue); color:#fff; border-color:var(--blue)}
.panel{display:none}
.panel.on{display:block}
.search{margin-bottom:10px}
.search input{width:100%; padding:9px 12px; border:1px solid var(--line); border-radius:8px; font-size:14px; background:var(--card)}
.glist{display:flex; flex-direction:column; gap:8px}
.gcard{border:1px solid var(--line); background:var(--card); border-radius:10px; padding:10px 12px; cursor:pointer}
.gcard .gt{font-weight:600; font-size:14px}
.gcard .gr{font-size:12px; color:var(--muted); margin-top:3px}
.gcard .meta{display:flex; justify-content:space-between; font-size:12px; color:var(--muted); margin-top:6px}
.gcard .done{color:var(--green)}
.fam{border-left:4px solid var(--blue)}
.th{border-left:4px solid var(--green)}
.al{border-left:4px solid var(--orange)}
.lo{border-left:4px solid #888}
.cardstage{position:relative; min-height:300px}
.card{background:var(--card); border:1px solid var(--line); border-radius:14px; padding:22px 18px; box-shadow:0 2px 8px rgba(0,0,0,.05)}
.groupbar{background:var(--blue-bg); border:1px solid var(--blue); border-radius:10px; padding:10px 12px; margin-bottom:10px}
.groupbar .gt{font-weight:600; color:var(--blue); font-size:14px}
.groupbar .gr{font-size:12px; color:#333; margin-top:4px}
.progress{height:6px; background:var(--line); border-radius:3px; margin:8px 0}
.progress i{display:block; height:6px; background:var(--blue); border-radius:3px}
.front{text-align:center; padding:28px 6px 14px}
.front .word{font-size:34px; font-weight:700; letter-spacing:.5px}
.front .ph{color:var(--muted); font-size:15px; margin-top:6px}
.front .hint{color:var(--muted); font-size:12px; margin-top:18px}
.spk{border:none;background:none;cursor:pointer;font-size:22px;line-height:1;padding:2px;vertical-align:2px}
.spk:hover{opacity:.7}
.back{margin-top:14px; border-top:1px dashed var(--line); padding-top:12px}
.back .pos{font-size:13px; color:#333}
.back .freq{color:var(--red); font-weight:600; font-size:13px}
.back .ex{font-size:12.5px; color:#333; margin-top:8px}
.back .ex b{color:var(--blue); font-weight:600}
.back .mn{font-size:12px; color:var(--muted); margin-top:8px}
.flip{text-align:center; margin-top:14px}
.flip .btn{min-width:120px}
.actions{display:flex; gap:8px; margin-top:14px}
.actions button{flex:1; padding:11px 4px; border-radius:10px; border:1px solid var(--line); background:var(--card); cursor:pointer; font-size:14px}
.actions .a1{border-color:#d8c1c1; color:#a33}
.actions .a2{border-color:#d8cfb8; color:#8a6d1d}
.actions .a3{border-color:#c4d8c4; color:var(--green)}
.actions .a4{border-color:#c9d3e8; color:var(--blue)}
.actions button:disabled{opacity:.35; cursor:default}
.meta-line{display:flex; justify-content:space-between; font-size:12px; color:var(--muted); margin-top:8px}
.kbd{color:var(--muted); font-size:11px}
.end{text-align:center; padding:30px 10px}
.end .big{font-size:40px}
.end p{color:var(--muted); margin-top:8px; font-size:14px}
.end button{margin-top:14px}
.btn{padding:10px 16px; border-radius:10px; border:1px solid var(--line); background:var(--card); cursor:pointer; font-size:14px}
.btn.primary{background:var(--blue); color:#fff; border-color:var(--blue)}
.hide{display:none}
.notice{background:#fff8e6; border:1px solid #e6d9a8; border-radius:10px; padding:10px 12px; font-size:12.5px; color:#6b5b1d; margin-bottom:12px}
.bar{height:10px;background:var(--line);border-radius:5px;overflow:hidden;margin-top:4px}
.bar i{display:block;height:10px;border-radius:5px}
.statrow{margin-bottom:12px}
.statrow:last-child{margin-bottom:0}
.statrow .lab{display:flex;justify-content:space-between;font-size:13px;gap:8px}
.statrow .lab b{font-weight:600}
.grid2{display:flex;gap:10px;flex-wrap:wrap}
.pcard{flex:1;min-width:230px;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}
.pcard h3{font-size:14px;margin-bottom:10px}
.legend{display:flex;gap:14px;font-size:11px;color:var(--muted);margin-top:8px;flex-wrap:wrap}
.sw{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:3px;vertical-align:-1px}
svg text{font-size:10px;fill:var(--muted)}
.ranges{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}
.rangebtn{padding:5px 10px;border:1px solid var(--line);background:var(--card);border-radius:7px;cursor:pointer;font-size:12px;color:var(--muted)}
.rangebtn.on{background:var(--blue);color:#fff;border-color:var(--blue)}
.lv{display:inline-block;font-size:11px;padding:1px 7px;border-radius:999px;border:1px solid currentColor;margin-left:6px;vertical-align:2px}
.lv1{color:#c0392b;background:#fbeae7}
.lv2{color:#b8860b;background:#fbf3e0}
.lv3{color:#2e6b34;background:#eaf5e8}
.lv4{color:#1f4e79;background:#eaf2fb}
.card.lv1{border-color:#d8a7a0}
.card.lv2{border-color:#d8c48f}
.card.lv3{border-color:#a8cfa8}
.card.lv4{border-color:#9db7d8}
.navrow{display:flex;gap:8px;justify-content:center;margin-top:10px}
.navrow button{padding:8px 16px;border-radius:9px;border:1px solid var(--line);background:var(--card);cursor:pointer;font-size:13px}
.resume{background:#fff4ec;border:1px solid #e8c9ae;border-left:4px solid #c77f3a;border-radius:10px;padding:10px 12px;margin-bottom:10px;font-size:13px}
.resume b{color:#a85d12}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.35);display:none;align-items:center;justify-content:center;padding:18px;z-index:50}
.modal.on{display:flex}
.modal .box{background:#fff;max-width:430px;width:100%;border-radius:14px;padding:22px 20px;box-shadow:0 8px 30px rgba(0,0,0,.18)}
.poem .zh{font-size:20px;font-weight:600;line-height:1.5}
.poem .en{font-size:14px;color:#333;margin-top:10px;line-height:1.6}
.poem .src{font-size:12px;color:var(--muted);margin-top:10px;text-align:right}
.modal .row{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:14px}
.bmform{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.bmform input{flex:1;min-width:140px;padding:9px 10px;border:1px solid var(--line);border-radius:8px;font-size:13px;background:var(--card)}
.sitelist .site{display:flex;justify-content:space-between;gap:10px;align-items:center;border:1px solid var(--line);background:var(--card);border-radius:10px;padding:10px 12px;margin-bottom:8px}
.sitelist .site a{color:var(--blue);text-decoration:none;font-weight:600;font-size:14px;word-break:break-all}
.sitelist .site .del{border:none;background:none;color:var(--muted);cursor:pointer;font-size:13px}
.sec-title{font-size:15px;font-weight:600;margin:16px 0 8px}
.poem-list .pitem{border-left:3px solid #d8c48f;background:#fffaf3;border-radius:0 8px 8px 0;padding:9px 12px;margin-bottom:8px}
.poem-list .pitem .zh{font-size:14px;font-weight:600}
.poem-list .pitem .en{font-size:12px;color:#333;margin-top:3px}
.poem-list .pitem .src{font-size:11px;color:var(--muted);margin-top:3px;text-align:right}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>考研词根记忆卡片 <small>2017—2026 真题频率 · 例句 · 老师口诀</small></h1>
    <div class="stats" id="stats"></div>
  </header>

  <div class="tabs">
    <button id="tab-fam" class="on" onclick="showTab('fam')">词根家族</button>
    <button id="tab-th" onclick="showTab('th')">主题近义</button>
    <button id="tab-al" onclick="showTab('al')">形近辨析</button>
    <button id="tab-lo" onclick="showTab('lo')">基础词汇</button>
    <button id="tab-rev" onclick="showTab('rev')">今日复习</button>
    <button id="tab-bm" onclick="showTab('bm')">收藏</button>
    <button id="tab-st" onclick="showTab('st')">统计</button>
  </div>

  <div class="notice">用法：选一组 → 看口诀 → 翻卡片回忆 → 按“不熟/模糊/认识”自评。记错的词稍后会再出现；今天学的词明天进入“今日复习”。空格翻面，1/2/3 评分。</div>

  <div class="search"><input id="q" type="text" placeholder="搜单词（如 predict、rental）" oninput="onSearch()"></div>

  <div id="p-fam" class="panel on"></div>
  <div id="p-th" class="panel"></div>
  <div id="p-al" class="panel"></div>
  <div id="p-lo" class="panel"></div>
  <div id="p-rev" class="panel"></div>
  <div id="p-bm" class="panel"></div>
  <div id="p-st" class="panel"></div>
  <div id="p-study" class="panel"></div>
  <div id="p-search" class="panel"></div>
</div>

<div class="modal" id="poemmodal">
  <div class="box poem" id="poembox"></div>
</div>

<script>
const DATA = __DATA__;
const KEY = "ky_kaoyan_words_v1";
let state = { rate: {}, due: {}, n: 0, days: {}, sites: [], poems: [], lastPos: {}, lastPoemDate: "" };
let session = { list: [], i: 0, flipped: false, mode: 1, title: "", rhyme: "", total: 0 };
let curTab = 'fam';
let trendRange = 14;

function load(){
  try{ const s = JSON.parse(localStorage.getItem(KEY) || "{}");
    state = {
      rate: s.rate||{}, due: s.due||{}, n: s.n||0, days: s.days||{},
      sites: s.sites||[], poems: s.poems||[], lastPos: s.lastPos||{}, lastPoemDate: s.lastPoemDate||""
    };
  }catch(e){}
}
function save(){
  localStorage.setItem(KEY, JSON.stringify({rate:state.rate, due:state.due, n:state.n, days:state.days, sites:state.sites, poems:state.poems, lastPos:state.lastPos, lastPoemDate:state.lastPoemDate}));
}

const NOW = Date.now();
const DAY = 86400000;

function dueTs(lvl){
  if(lvl<=1) return NOW + 10*60000;       // 不熟：10分钟后
  if(lvl===2) return NOW + DAY;            // 模糊：明天
  if(lvl===3) return NOW + 3*DAY;          // 认识：3天后
  return NOW + 7*DAY;                      // 很熟：7天后
}

function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function frBadge(fr){
  return '<span class="freq">真题 ' + fr + ' 次</span>';
}

function levelName(l){ return ['','不熟','模糊','认识','很熟'][l||0]; }
function levelBadge(i){
  const l = state.rate[i] || 0;
  if(!l) return '';
  return '<span class="lv lv'+l+'">'+levelName(l)+'</span>';
}

function wordCard(i){
  const w = DATA.W[i];
  return '<div class="front"><div class="word">'+esc(w.w)+' '+spkBtn(w.w)+'</div>'+
    (w.p?'<div class="ph">'+esc(w.p)+'</div>':'')+
    '<div class="hint">先回忆意思，再翻面（空格）</div></div>';
}

function spkBtn(word){
  return '<button class="spk" onclick="event.stopPropagation();speak(\''+esc(word)+'\')" title="点击发音">🔊</button>';
}
function speak(text){
  try{
    if(!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.9;
    speechSynthesis.speak(u);
  }catch(e){}
}

function wordBack(i){
  const w = DATA.W[i];
  let h = '<div class="pos">'+esc(w.d)+'</div>';
  h += '<div class="freq">'+frBadge(w.fr)+(w.yr&&w.yr.length?'（'+w.yr.join('、')+'）':'')+'</div>';
  if(w.ex){
    h += '<div class="ex"><b>真题例句（'+w.ex.y+'·'+w.ex.s+'）</b>：'+esc(w.ex.t)+'</div>';
    if(w.nt) h += '<div class="ex"><b>讲解</b>：'+esc(w.nt)+'</div>';
  }else if(w.e){
    h += '<div class="ex"><b>例句</b>：'+esc(w.e)+(w.ez?'（'+esc(w.ez)+'）':'')+'</div>';
  }
  if(w.mn) h += '<div class="mn">联想：'+esc(w.mn)+'</div>';
  return h;
}

function showTab(t){
  curTab = t;
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('on'));
  document.getElementById('tab-'+t).classList.add('on');
  document.getElementById('p-'+t).classList.add('on');
  document.getElementById('q').value='';
  if(t==='fam'){ renderGroups('fam', DATA.fam, '词根词缀家族', renderFam); renderResume('fam'); }
  if(t==='th'){ renderGroups('th', DATA.th, '主题近义词', renderTh); renderResume('th'); }
  if(t==='al'){ renderGroups('al', DATA.al, '形近辨析', renderAl); renderResume('al'); }
  if(t==='lo'){ renderGroups('lo', DATA.lo, '基础词汇', renderLo); renderResume('lo'); }
  if(t==='rev') renderReview();
  if(t==='bm') renderBookmarks();
  if(t==='st') renderStatsPage();
  renderStats();
}

function renderFam(g){ return '<div class="gt">词根「'+esc(g.t)+'」 · '+g.n+' 词</div>'+(g.r?'<div class="gr">'+esc(g.r)+'</div>':'')+progressMeta(g); }
function renderTh(g){ return '<div class="gt">'+esc(g.t)+' · '+g.n+' 词</div>'+(g.r?'<div class="gr">'+esc(g.r)+'</div>':'')+progressMeta(g); }
function renderAl(g){ return '<div class="gt">形近 · '+esc(g.t)+' 等 '+g.n+' 词</div>'+(g.r?'<div class="gr">'+esc(g.r)+'</div>':'')+progressMeta(g); }
function renderLo(g){ return '<div class="gt">'+esc(g.L)+' · '+g.n+' 词</div><div class="gr">基础词，逐个记忆；长句讲解在卡片背面。</div>'+progressMeta(g); }

function progressMeta(g){
  const done = g.ws.filter(i=>state.rate[i]>=3).length;
  return '<div class="meta"><span>'+(done?'<span class="done">已掌握 '+done+'/'+g.ws.length+'</span>':'待学习 '+g.ws.length+' 词')+'</span><span>点击开始</span></div>';
}

function renderGroups(t, groups, title, fn){
  const el = document.getElementById('p-'+t);
  let h = '';
  for(const g of groups){
    h += '<div class="gcard '+t+' '+(t==='lo'?'lo':'')+'" onclick="startGroup(\''+t+'\','+groups.indexOf(g)+')">'+fn(g)+'</div>';
  }
  el.innerHTML = h || '<p style="color:var(--muted)">暂无分组</p>';
}

function startGroup(t, gi){
  let g, title, rhyme;
  if(t==='fam'){ g=DATA.fam[gi]; title='词根「'+g.t+'」'; rhyme=g.r; }
  else if(t==='th'){ g=DATA.th[gi]; title=g.t; rhyme=g.r; }
  else if(t==='al'){ g=DATA.al[gi]; title='形近 · '+g.t; rhyme=g.r; }
  else { g=DATA.lo[gi]; title='基础词汇 · '+g.L; rhyme=''; }
  startSession(g.ws, title, rhyme, 1, t, gi, 0);
}

function groupTitle(t, gi){
  if(t==='fam') return '词根「'+DATA.fam[gi].t+'」';
  if(t==='th') return DATA.th[gi].t;
  if(t==='al') return '形近 · '+DATA.al[gi].t;
  return '基础词汇 · '+DATA.lo[gi].L;
}

function renderResume(t){
  const p = state.lastPos[t];
  if(!p) return;
  const el = document.getElementById('p-'+t);
  const pos = (p.w||0)+1;
  el.innerHTML = '<div class="resume">上次学到：<b>'+esc(groupTitle(t, p.g))+'</b> · 第 '+pos+' 张 '+
    '<button class="btn" style="margin-left:8px" onclick="continueLast(\''+t+'\')">继续学习</button></div>' + el.innerHTML;
}

function continueLast(t){
  const p = state.lastPos[t];
  if(!p) return;
  startGroup(t, p.g);
  session.i = Math.min(p.w||0, session.list.length-1);
  renderCard();
}

function startSession(list, title, rhyme, mode, tab, gi, from){
  session = { list: list.slice(), i: from || 0, flipped: false, mode: mode, title: title, rhyme: rhyme || '', total: list.length, tab: tab || '', gi: gi };
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('on'));
  document.getElementById('p-study').classList.add('on');
  renderCard();
}

function renderCard(){
  if(session.i >= session.list.length){ renderEnd(); return; }
  const idx = session.list[session.i];
  const w = DATA.W[idx];
  const lv = state.rate[idx]||0;
  const el = document.getElementById('p-study');
  const progress = Math.round(session.i/session.list.length*100);
  if(session.tab){ state.lastPos[session.tab] = {g: session.gi, w: session.i}; save(); }
  el.innerHTML =
    '<div class="groupbar"><div class="gt">'+esc(session.title)+'</div>'+
    (session.rhyme?'<div class="gr">口诀：'+esc(session.rhyme)+'</div>':'')+
    '</div>'+
    '<div class="progress"><i style="width:'+progress+'%"></i></div>'+
    '<div class="cardstage"><div class="card'+(lv?' lv'+lv:'')+'" id="card">'+
    '<div id="front">'+wordCard(idx)+'</div>'+
    '<div id="back" class="hide">'+wordBack(idx)+'</div>'+
    '</div></div>'+
    '<div class="flip"><button class="btn" onclick="flip()">翻面（空格）</button></div>'+
    '<div class="actions">'+
      '<button class="a1" onclick="rate(1)">不熟</button>'+
      '<button class="a2" onclick="rate(2)">模糊</button>'+
      '<button class="a3" onclick="rate(3)">认识</button>'+
      '<button class="a4" onclick="rate(4)">很熟</button>'+
    '</div>'+
    '<div class="navrow"><button onclick="prevCard()">← 上一个</button><button onclick="nextCard()">下一个 →</button></div>'+
    '<div class="meta-line"><span>'+esc(w.w)+' '+levelBadge(idx)+' · '+frBadge(w.fr)+'</span><span class="kbd">第 '+(session.i+1)+' / '+session.total+' 张</span></div>';
  session.flipped = false;
}

function prevCard(){ if(session.i > 0){ session.i--; renderCard(); } }
function nextCard(){ if(session.i < session.list.length-1){ session.i++; renderCard(); } }

function flip(){
  if(session.i >= session.list.length) return;
  const el = document.getElementById('p-study');
  const front = document.getElementById('front');
  const back = document.getElementById('back');
  if(!session.flipped){
    front.classList.add('hide'); back.classList.remove('hide');
    session.flipped = true;
  }else{
    front.classList.remove('hide'); back.classList.add('hide');
    session.flipped = false;
  }
}

function rate(lvl){
  if(session.i >= session.list.length) return;
  const idx = session.list[session.i];
  const first = !(idx in state.rate);
  state.rate[idx] = lvl;
  state.due[idx] = dueTs(lvl);
  state.n++;
  addDay(first ? 'n' : 'r');
  save();
  if(lvl<=1){
    session.list.splice(session.i+1, 0, idx);   // 不熟：本组内稍后再现
    session.total++;
  }
  session.i++;
  renderCard();
  renderStats();
}

function renderEnd(){
  const el = document.getElementById('p-study');
  const done = session.list.filter(i=>(state.rate[i]||0)>=3).length;
  el.innerHTML = '<div class="end"><div class="big">🎉</div><h2>本组完成</h2>'+
    '<p>这组共 '+session.total+' 张，自评“认识及以上” '+done+' 张；</p>'+
    '<p>明天“今日复习”会提醒你巩固。</p>'+
    '<button class="btn primary" onclick="backHome()">返回分组</button></div>';
}

function backHome(){ showTab('fam'); }

function renderReview(){
  const el = document.getElementById('p-rev');
  const due = [];
  for(const k in state.due){
    if(state.due[k] <= NOW) due.push(parseInt(k));
  }
  due.sort((a,b)=>state.due[a]-state.due[b]);
  if(!due.length){
    el.innerHTML = '<div class="end"><div class="big">✅</div><h2>今天没有待复习的词</h2>'+
      '<p>先去“词根家族”学一组新词吧。</p><button class="btn primary" onclick="showTab(\'fam\')">去学新词</button></div>';
    return;
  }
  el.innerHTML = '<div class="groupbar"><div class="gt">今日复习 · '+due.length+' 词</div>'+
    '<div class="gr">先回忆再翻面，答错的词会排到后面再考一次。</div></div>'+
    '<div style="text-align:center;margin-top:12px"><button class="btn primary" onclick="startReview()">开始复习</button></div>';
  session._review = due;
}

function startReview(){
  const due = session._review || [];
  startSession(due, '今日复习 · '+due.length+' 词', '温故而知新，优先复习红色高频词。', 1, 'rev', 0, 0);
}

function onSearch(){
  const q = document.getElementById('q').value.trim().toLowerCase();
  if(!q){ document.getElementById('p-search').classList.remove('on'); document.getElementById('p-study').classList.remove('on'); return; }
  const hits = [];
  for(let i=0;i<DATA.W.length;i++){
    if(DATA.W[i].w.toLowerCase().includes(q)) hits.push(i);
  }
  const el = document.getElementById('p-search');
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('on'));
  el.classList.add('on');
  if(!hits.length){ el.innerHTML = '<p style="color:var(--muted)">没找到，换个拼写试试。</p>'; return; }
  let h = '<div class="glist">';
  for(const i of hits.slice(0,30)){
    const w = DATA.W[i];
    h += '<div class="gcard" onclick="startSession(['+i+'], \''+esc(w.w)+'\', \'\', 1, \'\', 0, 0)">'+
      '<div class="gt">'+esc(w.w)+' '+spkBtn(w.w)+' <span style="color:var(--muted);font-weight:400">'+esc(w.p)+'</span></div>'+
      '<div class="gr">'+frBadge(w.fr)+' '+levelBadge(i)+' ｜ '+esc(w.d)+'</div></div>';
  }
  h += hits.length>30 ? '<p style="color:var(--muted);margin-top:8px">只显示前 30 条，继续输入可精确查找。</p>' : '';
  h += '</div>';
  el.innerHTML = h;
}

function dateKeyOf(d){
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function dateKey(){ return dateKeyOf(new Date()); }
function addDay(ty){
  const k = dateKey();
  if(!state.days[k]) state.days[k] = {n:0, r:0};
  state.days[k][ty]++;
}
function streakDays(){
  const set = new Set(Object.keys(state.days));
  const d = new Date();
  if(!set.has(dateKeyOf(d))) d.setDate(d.getDate()-1);
  let s = 0;
  while(set.has(dateKeyOf(d))){ s++; d.setDate(d.getDate()-1); }
  return s;
}
function sectionStats(gs){
  let done = 0, tot = 0;
  for(const g of gs){ for(const i of g.ws){ tot++; if(state.rate[i]>=3) done++; } }
  return {done:done, tot:tot};
}
function rangeDays(range){
  if(range === 'all'){
    const keys = Object.keys(state.days).sort();
    return keys.map(k => ({k:k, n:state.days[k].n||0, r:state.days[k].r||0}));
  }
  const arr = [];
  const d = new Date();
  for(let i=range-1;i>=0;i--){
    const x = new Date(d);
    x.setDate(d.getDate()-i);
    const k = dateKeyOf(x);
    const v = state.days[k] || {n:0, r:0};
    arr.push({k:k, n:v.n||0, r:v.r||0});
  }
  return arr;
}
function trendSvg(range){
  const arr = rangeDays(range);
  if(!arr.length){
    return '<p style="color:var(--muted);font-size:12px">还没有学习记录，学一组词后这里会出现柱状图。</p>';
  }
  const max = Math.max(1, ...arr.map(x=>x.n+x.r));
  const W = 680, H = 150, top = 16, base = 118, Hbar = base - top, slot = W/arr.length;
  let s = '<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="近14天新学与复习数量">';
  s += '<line x1="0" y1="'+base+'" x2="'+W+'" y2="'+base+'" stroke="#d8d8d8" stroke-width="1"/>';
  s += '<line x1="0" y1="'+top+'" x2="'+W+'" y2="'+top+'" stroke="#efefef" stroke-width="1"/>';
  s += '<text x="4" y="'+(top-4)+'">'+max+'</text>';
  const step = Math.max(1, Math.ceil(arr.length/8));
  arr.forEach((x, i)=>{
    const x0 = i*slot + slot*0.1, w = slot*0.8;
    const totalH = (x.n+x.r)/max*Hbar, newH = x.n/max*Hbar, revH = x.r/max*Hbar;
    if(revH > 0) s += '<rect x="'+x0.toFixed(1)+'" y="'+(base-totalH).toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+revH.toFixed(1)+'" fill="#2e6b34" rx="2"><title>'+x.k+' 复习 '+x.r+'</title></rect>';
    if(newH > 0) s += '<rect x="'+x0.toFixed(1)+'" y="'+(base-newH).toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+newH.toFixed(1)+'" fill="#1f4e79" rx="2"><title>'+x.k+' 新学 '+x.n+'</title></rect>';
    if(i % step === 0 || i === arr.length-1){
      const label = x.k.slice(5).replace('-','/');
      s += '<text x="'+(x0+w/2).toFixed(1)+'" y="'+(base+14)+'" text-anchor="middle">'+label+'</text>';
    }
  });
  s += '</svg>';
  return s;
}
function setRange(r){
  trendRange = r;
  renderTrendCard();
  renderStats();
}
function renderTrendCard(){
  const card = document.getElementById('trendcard');
  if(!card) return;
  const arr = rangeDays(trendRange);
  let sumN = 0, sumR = 0, activeDays = 0;
  for(const x of arr){ sumN += x.n; sumR += x.r; if(x.n+x.r > 0) activeDays++; }
  const btns = [[7,'近 7 天'],[14,'近 14 天'],[30,'近 30 天'],['all','全部']];
  let b = '<div class="ranges">';
  for(const item of btns){
    const on = trendRange === item[0] ? ' on' : '';
    b += '<button class="rangebtn'+on+'" onclick="setRange('+(item[0]==='all'?"'all'":item[0])+')">'+item[1]+'</button>';
  }
  b += '</div>';
  card.innerHTML = '<h3>学习趋势</h3>'+b+trendSvg(trendRange)+
    '<div class="legend"><span><span class="sw" style="background:#1f4e79"></span>新学</span>'+
    '<span><span class="sw" style="background:#2e6b34"></span>复习</span>'+
    '<span>本区间：新学 '+sumN+' · 复习 '+sumR+' · 活跃 '+activeDays+' 天</span>'+
    '<span>连续坚持 '+streakDays()+' 天</span></div>';
}
function renderStatsPage(){
  const el = document.getElementById('p-st');
  const secs = [
    {n:'词根家族', c:'#1f4e79', s:sectionStats(DATA.fam)},
    {n:'主题近义', c:'#2e6b34', s:sectionStats(DATA.th)},
    {n:'形近辨析', c:'#a85d12', s:sectionStats(DATA.al)},
    {n:'基础词汇', c:'#888888', s:sectionStats(DATA.lo)},
  ];
  let h = '<div class="grid2">';
  h += '<div class="pcard"><h3>各分区完成进度</h3>';
  for(const x of secs){
    const pct = x.s.tot ? Math.round(x.s.done/x.s.tot*100) : 0;
    h += '<div class="statrow"><div class="lab"><span>'+x.n+'</span><b>'+x.s.done+' / '+x.s.tot+'（'+pct+'%）</b></div>'+
         '<div class="bar"><i style="width:'+pct+'%;background:'+x.c+'"></i></div></div>';
  }
  h += '</div>';
  const lv = [0,0,0,0,0];
  let rated = 0;
  for(const k in state.rate){ lv[state.rate[k]]++; rated++; }
  const dist = [
    ['未学', 5258-rated, '#d8d8d8'],
    ['不熟', lv[1], '#c0392b'],
    ['模糊', lv[2], '#b8860b'],
    ['认识', lv[3], '#2e6b34'],
    ['很熟', lv[4], '#1f4e79'],
  ];
  h += '<div class="pcard"><h3>掌握等级分布</h3>';
  for(const item of dist){
    const pct = Math.round(item[1]/5258*100);
    h += '<div class="statrow"><div class="lab"><span>'+item[0]+'</span><b>'+item[1]+' 词（'+pct+'%）</b></div>'+
         '<div class="bar"><i style="width:'+pct+'%;background:'+item[2]+'"></i></div></div>';
  }
  h += '</div></div>';
  let hfT=0, hfD=0, midT=0, midD=0;
  for(let i=0;i<DATA.W.length;i++){
    const fr = DATA.W[i].fr;
    if(fr >= 5){ hfT++; if(state.rate[i]>=3) hfD++; }
    else if(fr >= 1){ midT++; if(state.rate[i]>=3) midD++; }
  }
  const hfPct = hfT ? Math.round(hfD/hfT*100) : 0;
  const midPct = midT ? Math.round(midD/midT*100) : 0;
  h += '<div class="pcard" style="margin-top:10px"><h3>真题词掌握情况</h3>';
  h += '<div class="statrow"><div class="lab"><span>高频（真题 ≥5 次）</span><b>'+hfD+' / '+hfT+'（'+hfPct+'%）</b></div>'+
       '<div class="bar"><i style="width:'+hfPct+'%;background:#c00000"></i></div></div>';
  h += '<div class="statrow"><div class="lab"><span>中频（真题 1–4 次）</span><b>'+midD+' / '+midT+'（'+midPct+'%）</b></div>'+
       '<div class="bar"><i style="width:'+midPct+'%;background:#c0392b"></i></div></div>';
  h += '</div>';
  h += '<div class="pcard" id="trendcard" style="margin-top:10px"></div>';
  h += '<div class="pcard" style="margin-top:10px"><h3>进度备份</h3>'+
       '<div class="ranges">'+
       '<button class="btn" onclick="exportProgress()">导出进度</button>'+
       '<button class="btn" onclick="document.getElementById(\'importfile\').click()">导入进度</button>'+
       '<input type="file" id="importfile" accept=".json,application/json" style="display:none" onchange="importProgress(this.files[0])">'+
       '</div>'+
       '<div class="legend"><span>导出的文件可以发到手机或其他浏览器；换个设备后点“导入进度”即可接着学。</span></div></div>';
  el.innerHTML = h;
  renderTrendCard();
}
function renderBookmarks(){
  const el = document.getElementById('p-bm');
  let h = '<h3 class="sec-title">学习网站</h3>';
  h += '<div class="bmform"><input id="sitename" placeholder="名称（如 每日英语听力）"><input id="siteurl" placeholder="网址（https://…）"><button class="btn" onclick="addSite()">添加</button></div>';
  h += '<div class="sitelist">';
  for(let i=0;i<state.sites.length;i++){
    const s = state.sites[i];
    h += '<div class="site"><a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.name)+'</a>'+
         '<button class="del" onclick="delSite('+i+')">删除</button></div>';
  }
  h += '</div>';
  h += '<h3 class="sec-title">诗词收录（每天自动记一句）</h3><div class="poem-list">';
  const plist = state.poems.slice().reverse();
  if(!plist.length){
    h += '<p style="color:var(--muted);font-size:13px">还没有收录，今天首次打开会弹出第一句并自动收录。</p>';
  }
  for(const p of plist){
    h += '<div class="pitem"><div class="zh">'+esc(p.zh)+'</div><div class="en">'+esc(p.en)+'</div>'+
         '<div class="src">'+esc(p.src)+' · '+esc(p.date)+'</div></div>';
  }
  h += '</div>';
  el.innerHTML = h;
}
function addSite(){
  const n = document.getElementById('sitename').value.trim();
  let u = document.getElementById('siteurl').value.trim();
  if(!n || !u){ alert('请填写名称和网址'); return; }
  if(!/^https?:\/\//i.test(u)) u = 'https://' + u;
  state.sites.push({name:n, url:u});
  save();
  renderBookmarks();
}
function delSite(i){ state.sites.splice(i, 1); save(); renderBookmarks(); }
function showDailyPoem(){
  const today = dateKey();
  if(state.lastPoemDate === today) return;
  const p = DATA.poems[Math.floor(NOW/DAY) % DATA.poems.length];
  if(!state.poems.some(x => x.date === today)){
    state.poems.push({date:today, zh:p.zh, en:p.en, src:p.src});
  }
  state.lastPoemDate = today;
  save();
  document.getElementById('poembox').innerHTML =
    '<div class="poem"><div class="zh">'+esc(p.zh)+'</div><div class="en">'+esc(p.en)+'</div><div class="src">—— '+esc(p.src)+'</div></div>'+
    '<div class="row"><span style="font-size:12px;color:var(--muted)">已自动收录到「收藏」</span><button class="btn primary" onclick="closePoem()">开始学习</button></div>';
  document.getElementById('poemmodal').classList.add('on');
}
function closePoem(){ document.getElementById('poemmodal').classList.remove('on'); }
function exportProgress(){
  const data = {ver:2, date:dateKey(), rate:state.rate, due:state.due, days:state.days, n:state.n, sites:state.sites, poems:state.poems, lastPos:state.lastPos, lastPoemDate:state.lastPoemDate};
  const blob = new Blob([JSON.stringify(data, null, 1)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '考研词根记忆卡片-进度-'+dateKey()+'.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function(){ URL.revokeObjectURL(url); }, 2000);
}
function importProgress(file){
  if(!file) return;
  const fr = new FileReader();
  fr.onload = function(){
    try{
      const s = JSON.parse(fr.result);
      if(!s || !s.rate || !s.due || !s.days) throw new Error('bad');
      state = {rate:s.rate, due:s.due, n:s.n||0, days:s.days||{}, sites:s.sites||[], poems:s.poems||[], lastPos:s.lastPos||{}, lastPoemDate:s.lastPoemDate||""};
      save();
      renderStatsPage();
      renderStats();
      let learned = 0;
      for(const k in state.rate){ if(state.rate[k]>=3) learned++; }
      alert('导入成功：已掌握 '+learned+' 词，继续加油！');
    }catch(e){
      alert('导入失败：文件格式不对，请选择“导出进度”生成的 JSON 文件。');
    }
  };
  fr.readAsText(file);
}
function renderStats(){
  let learned = 0, due = 0;
  for(const k in state.rate){ if(state.rate[k]>=3) learned++; }
  for(const k in state.due){ if(state.due[k] <= NOW) due++; }
  const today = state.days[dateKey()] || {n:0, r:0};
  let txt;
  if(curTab==='fam' || curTab==='th' || curTab==='al' || curTab==='lo'){
    const gs = curTab==='fam' ? DATA.fam : curTab==='th' ? DATA.th : curTab==='al' ? DATA.al : DATA.lo;
    const name = {fam:'词根家族', th:'主题近义', al:'形近辨析', lo:'基础词汇'}[curTab];
    const st = sectionStats(gs);
    txt = name+' 已掌握 '+st.done+'/'+st.tot;
  } else if(curTab==='rev'){
    txt = '今日待复习 '+due+' 词 ｜ 已掌握 '+learned+' 词';
  } else {
    txt = '已掌握 '+learned+' 词 ｜ 今日新学 '+today.n+' · 复习 '+today.r+' ｜ 连续 '+streakDays()+' 天';
  }
  document.getElementById('stats').innerHTML = txt;
}

document.addEventListener('keydown', e=>{
  if(e.target.tagName==='INPUT') return;
  if(e.key===' ' || e.key==='Enter'){ e.preventDefault(); if(session.list.length) flip(); }
  else if(e.key==='ArrowLeft'){ e.preventDefault(); prevCard(); }
  else if(e.key==='ArrowRight'){ e.preventDefault(); nextCard(); }
  else if(e.key==='1') rate(1);
  else if(e.key==='2') rate(2);
  else if(e.key==='3') rate(3);
  else if(e.key==='4') rate(4);
});

load();
showTab('fam');
showDailyPoem();
</script>
</body>
</html>
"""


def main():
    data = build_data()
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    html = APP_HTML.replace("__DATA__", payload)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(html)
    print("written:", OUT, "size:", len(html))


if __name__ == "__main__":
    main()
