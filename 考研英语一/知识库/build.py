# -*- coding: utf-8 -*-
import json, os, re, glob

BASE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(BASE, "raw")

# 对话元信息：share_id -> (科目, 标题)
CONFIG = {
    "7ryvo1w3ee7yvo7lvn": (
        "英语",
        "词根词缀趣味讲解：上瘾家族 & predict 家族（英语一）",
    ),
}

def classify(share_id, first_user):
    if share_id in CONFIG:
        return CONFIG[share_id]
    if any(k in first_user for k in ("英语", "单词", "词根")):
        return ("英语", "英语对话")
    return ("未分类", "对话")

def classify_msg(text):
    """把一条用户消息归到一个词条：单词 / 语法疑问 / 导学"""
    s = text.strip()
    compact = re.sub(r"\s+", "", s)
    if re.fullmatch(r"[A-Za-z][A-Za-z'\-]{0,30}", compact):
        return ("word", compact.lower(), compact)
    if any(k in s for k in ("be动词", "为什么", "没有be")):
        return ("topic", "be动词疑问", "be动词疑问")
    return ("guide", "导学", "开篇 · 词根词缀怎么学")

def load_share(path):
    d = json.load(open(path, encoding="utf-8"))
    msgs = d["data"]["biz_data"]["messages"]
    return [{"role": m["role"], "content": m["content"]} for m in msgs]

def build_entries(messages):
    entries = {}
    order = []
    cur = None
    for m in messages:
        if m["role"] == "USER":
            kind, key, label = classify_msg(m["content"])
            if key not in entries:
                entries[key] = {"key": key, "label": label, "kind": kind, "cards": []}
                order.append(key)
            card = {"q": m["content"], "a": []}
            entries[key]["cards"].append(card)
            cur = card
        else:
            if cur is not None:
                cur["a"].append(m["content"])
    # 完全重复的问答去重（跨对话也适用）
    for e in entries.values():
        seen, out = set(), []
        for c in e["cards"]:
            sig = c["q"] + "\x00" + "\x00".join(c["a"])
            if sig not in seen:
                seen.add(sig)
                out.append(c)
        e["cards"] = out
    guides = [k for k in order if entries[k]["kind"] == "guide"]
    words = sorted((k for k in order if entries[k]["kind"] == "word"), key=lambda k: entries[k]["label"].lower())
    topics = sorted((k for k in order if entries[k]["kind"] == "topic"), key=lambda k: entries[k]["label"])
    return [entries[k] for k in guides + words + topics]

subjects = {}
for f in sorted(glob.glob(os.path.join(RAW, "*.json"))):
    share_id = os.path.splitext(os.path.basename(f))[0].replace("deepseek_share_", "")
    messages = load_share(f)
    user_texts = [m["content"] for m in messages if m["role"] == "USER"]
    subject, title = classify(share_id, user_texts[0] if user_texts else "")
    entries = build_entries(messages)
    subj = subjects.get(subject)
    if subj is None:
        subj = {"name": subject, "entries": []}
        subjects[subject] = subj
    existing = {e["key"]: e for e in subj["entries"]}
    for e in entries:
        if e["key"] in existing:
            existing[e["key"]]["cards"].extend(e["cards"])
        else:
            subj["entries"].append(e)
    # 合并后再次去重
    for e in subj["entries"]:
        seen, out = set(), []
        for c in e["cards"]:
            sig = c["q"] + "\x00" + "\x00".join(c["a"])
            if sig not in seen:
                seen.add(sig)
                out.append(c)
        e["cards"] = out

payload = {"subjects": [subjects[k] for k in sorted(subjects)]}
payload_json = json.dumps(payload, ensure_ascii=False).replace("</", "<\\/")

tmpl = open(os.path.join(BASE, "template.html"), encoding="utf-8").read()
assert "__DATA__" in tmpl, "placeholder not found"
out = tmpl.replace("__DATA__", payload_json)
dest = os.path.join(BASE, "index.html")
with open(dest, "w", encoding="utf-8") as fh:
    fh.write(out)

print("subjects:", [(k, len(v["entries"])) for k, v in subjects.items()])
print("entries:", [e["label"] for s in subjects.values() for e in s["entries"]])
print("wrote:", dest, len(out), "chars")
