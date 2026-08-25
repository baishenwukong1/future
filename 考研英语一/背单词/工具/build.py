# -*- coding: utf-8 -*-
import json, os

BASE = os.path.dirname(os.path.abspath(__file__))
PARENT = os.path.dirname(BASE)

CLEAN_WORDS = [
    ["popularize", "v. 使流行，通俗化"],
    ["paternity", "n. 父亲身份"],
    ["superfluous", "adj. 多余的"],
    ["altruistic", "adj. 利他的"],
    ["sustainably", "adv. 可持续地，持久地"],
    ["existential", "adj. 生存意义的，存在主义的"],
    ["submission", "n. 服从，提交，陈述"],
    ["paternal", "adj. 父亲的，父系的"],
    ["allocate", "v. 分配"],
    ["flaw", "n. 缺陷，缺点，瑕疵"],
    ["sustainability", "n. 可持续性，持久性"],
    ["genetically", "adv. 从基因上"],
    ["attribute", "v. 归因于，把…归于 n. 属性"],
    ["overlook", "v. 忽略，忽视，俯瞰"],
    ["distribution", "n. 分布，分发，配送"],
    ["designate", "v. 正式命名，任命，标记"],
    ["neglect", "v. 忽视，疏忽，遗忘 n. 疏忽"],
    ["lineage", "n. 血统"],
    ["redistribution", "n. 再分配"],
    ["allocation", "n. 分配额度，分配"],
    ["ignorant", "adj. 无知的，不了解的，粗鲁的"],
    ["superb", "adj. 极好的"],
    ["sustain", "v. 维持，保持，遭受，支持"],
    ["gene", "n. 基因"],
    ["prioritize", "v. 优先处理，优先考虑"],
    ["genetic", "adj. 遗传的"],
    ["devote", "v. 投入，献给"],
    ["dedicate", "v. 致力于，题献，奉献"],
    ["maintenance", "n. 维修，维持，生活费"],
    ["sustainable", "adj. 可持续的"],
    ["genome", "n. 基因组"],
    ["popularity", "n. 人气，流行"],
    ["genetics", "n. 遗传学"],
    ["supreme", "adj. 最高级别的，极度的"],
    ["stickiness", "n. 粘性，黏腻感，用户粘性"],
    ["academically", "adv. 学术上，理论上"],
    ["esteem", "n. 敬重，尊重 v. 尊敬，看待"],
    ["scholarly", "adj. 博学的，学术的"],
    ["dignity", "n. 尊严"],
    ["forge", "v. 努力建立，伪造，锻造"],
    ["respectable", "adj. 体面的，值得骄傲的"],
    ["prevailing", "adj. 最普遍的，盛行的"],
    ["disadvantage", "n. 不利条件 v. 使处于不利地位"],
    ["academic", "adj. 学术的，理论性的 n. 学者"],
    ["conjunction", "n. 连词，联合，结合"],
    ["cling", "vi. 紧紧抓住，粘附，依赖"],
    ["asset", "n. 资产"],
    ["disrespect", "n. 不尊重 v. 不尊重"],
    ["adhere", "v. 粘附，坚持，遵循"],
    ["intellect", "n. 智力，智者"],
    ["realistic", "adj. 务实的，切实可行的，逼真的"],
    ["prevalent", "adj. 普遍的，盛行的"],
    ["attachment", "n. 附件，连接，依恋，信奉"],
    ["hygiene", "n. 卫生"],
    ["manufacture", "v. 批量生产，捏造，生成 n. 制造"],
    ["functional", "adj. 实用的，功能型的，可用的"],
    ["academy", "n. 专科学校，学会，研究院"],
    ["scholar", "n. 学者，奖学金获得者"],
    ["intellectual", "adj. 智力的，聪明的 n. 知识分子"],
    ["decent", "adj. 尚可的，正派的，得体的"],
    ["pandemic", "n. 大流行病 adj. 全国性的"],
    ["mock", "v. 嘲笑，蔑视 adj. 虚假的，模拟的"],
    ["manufacturer", "n. 制造商"],
    ["manufacturing", "n. 制造"],
]

raw = json.load(open(os.path.join(PARENT, "vocab_data.json"), encoding="utf-8"))

def split_day02(entry):
    text = entry.get("en", "")
    title = "数字时代中人际联系的意外价值"
    i = text.find(title)
    if i >= 0:
        return text[:i].strip(), text[i:].strip()
    return text.strip(), ""

readings = []
r1 = raw["readings"][0]
readings.append({"day": "DAY01", "en": r1["en"], "cn": r1["cn"]})
r2 = raw["readings"][1]
en2, cn2 = split_day02(r2)
readings.append({"day": "DAY02", "en": en2, "cn": cn2})

payload = {"words": CLEAN_WORDS, "readings": readings}
payload_json = json.dumps(payload, ensure_ascii=False)

tmpl = open(os.path.join(BASE, "template.html"), encoding="utf-8").read()
assert "__DATA__" in tmpl, "placeholder not found"
out = tmpl.replace("__DATA__", payload_json)

dest = os.path.join(PARENT, "背单词.html")
with open(dest, "w", encoding="utf-8") as fh:
    fh.write(out)

print("words:", len(CLEAN_WORDS))
print("readings:", [(r["day"], len(r["en"]), len(r["cn"])) for r in readings])
print("wrote:", dest, len(out), "chars")
