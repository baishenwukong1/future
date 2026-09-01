# 考研 · DeepSeek 对话整理

一个纯静态的个人知识库，把 DeepSeek 里对自己有帮助的对话按科目和单词归档，方便随时查阅。整个站点是单文件网页，离线可用，托管在 GitHub Pages 上，手机电脑打开同一个网址即可访问。

> 页面内容由 AI 生成，仅供参考。

## 在线地址

GitHub Pages 开启后访问：

```
https://baishenwukong1.github.io/word/
```

## 目录结构

```
word/
├── index.html            # 主页面（按单词归档的知识库）
├── template.html         # 主页面模板（源代码）
├── build.py              # 生成脚本：解析 raw/ 数据 → 重新生成 index.html
├── raw/                  # 原始对话数据（DeepSeek 分享接口抓取的 JSON）
│   └── deepseek_share_*.json
└── README.md
```

## 如何添加新的对话

DeepSeek 目前不开放个人历史对话接口，只能通过分享链接读取内容。有两种方式：

### 方式一：把分享链接交给 Codex

直接把 DeepSeek 对话的分享链接发给 Codex，它会自动抓取内容、按单词归档合并、重新生成页面并提交。

### 方式二：手动更新

1. 把对话 JSON 放入 `raw/` 文件夹，命名为 `deepseek_share_<分享ID>.json`（可以从分享页接口 `https://chat.deepseek.com/api/v0/share/content?share_id=<ID>` 获取）。
2. 运行生成脚本：

```bash
python build.py
```

3. 提交并推送：

```bash
git add -A
git commit -m "添加新对话"
git push
```

## 合并与去重规则

- 页面按单词归档：同一科目的所有对话合并到一个科目下，同一个单词的所有讲解合并到同一个词条。
- 重复内容自动去重：完全相同的问答（用户提问 + AI 回复）只保留一条；同词的新讲解自动追加在词条后面，显示「N 条讲解」。
- 用户消息里的单词会被自动识别为词条（如 `addict`、`predictable`）；语法类问题归入对应主题词条；开篇引导语归入「导学」。

## 安全提示

- 本仓库只包含网页源码与对话数据，**不包含任何 API 密钥或 Token**（例如 Notion Integration Token 保存在本地 `.notion/` 中，不会被提交）。
- 如果后续把 Notion 或其它服务接入网页，请务必把密钥放在服务端，不要写进前端文件。
