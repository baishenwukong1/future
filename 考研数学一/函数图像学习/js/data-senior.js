(function(){
var F = window.FUNCTIONS;
var PI = Math.PI;
var HALF = PI / 2;

/* ==================== 高中篇 ==================== */

F.push({
  id: 'power',
  stage: 'senior',
  order: 1,
  name: '幂函数',
  en: 'Power function',
  formula: 'y = x<sup>a</sup>',
  formulaFn: (p) => 'y = x<sup>' + f2(p.a) + '</sup>',
  tagline: '一个底数，千变万化的指数：抛物、开方、双曲都是它。',
  view: { xMin: -5, xMax: 5, yMin: -5, yMax: 5 },
  params: [{ key: 'a', label: '指数 a', min: -3, max: 4, step: 0.1, def: 2 }],
  curves: [{
    kind: 'fn',
    label: 'y = x^a',
    color: 'primary',
    f: (x, p) => powSigned(x, p.a),
    df: (x, p) => (x === 0 ? null : p.a * powSigned(x, p.a - 1)),
    inverse: {
      label: 'y = x^(1/a)',
      f: (x, p) => (p.a === 0 ? null : powSigned(x, 1 / p.a)),
      df: (x, p) => (p.a === 0 || x === 0 ? null : (1 / p.a) * powSigned(x, 1 / p.a - 1))
    }
  }],
  asymptotes: (p) => (p.a < 0 ? { v: [0], h: [0] } : null),
  inverseName: 'y = x<sup>1/a</sup>（仍是幂函数）',
  inverseNote: '幂函数族的反函数仍在幂函数族内',
  props: {
    domain: '随 a 变化：正整数 → R；负整数 → x≠0；分数需按定义讨论（x&gt;0 时总有意义）',
    range: '随 a 变化（a&gt;0 偶指数时 [0,+∞)，奇指数时 R 等）',
    monotonic: 'a&gt;0 时在 (0,+∞) 单调递增；a&lt;0 时在 (0,+∞) 单调递减',
    parity: 'a 为偶数 → 偶函数；a 为奇数 → 奇函数；其他情形按定义讨论',
    period: '无',
    bounded: '一般无界（a&gt;0 时 x→+∞ 无上界）',
    asymptote: 'a&lt;0 时有 x=0 与 y=0 两条渐近线',
    continuity: '定义域内连续可导，f′(x) = ax<sup>a−1</sup>',
    inverse: 'y = x<sup>1/a</sup>，仍是幂函数；图像关于 y=x 对称',
    derivative: '(x<sup>a</sup>)′ = a·x<sup>a−1</sup>',
    integral: '∫x<sup>a</sup>dx = x<sup>a+1</sup>/(a+1) + C（a≠−1）'
  },
  exam: {
    points: [
      '所有幂函数都过点 (1, 1)',
      'a&gt;1 与 0&lt;a&lt;1 的图像形态对比（凸凹方向不同）是常考点',
      '幂指函数 x<sup>x</sup> 的处理套路：x<sup>x</sup> = e<sup>x ln x</sup>'
    ],
    pitfalls: [
      'x<sup>a</sup> 的定义域必须分类讨论（如 x<sup>1/2</sup> 只在 x≥0 有意义）',
      'a=−1 时积分要用 ln|x|，公式 x<sup>a+1</sup>/(a+1) 失效'
    ],
    examples: [
      '比较 2<sup>√2</sup> 与 √2 的大小（取对数处理）',
      'x<sup>1/x</sup> 在 x=e 处取最大值——经典考题'
    ]
  }
});

F.push({
  id: 'exp',
  stage: 'senior',
  order: 2,
  name: '指数函数',
  en: 'Exponential function',
  formula: 'y = a<sup>x</sup>',
  formulaFn: (p) => 'y = ' + f2(p.a) + '<sup>x</sup>',
  tagline: '增长之王：a>1 时增长越来越快，图像永远在 x 轴上方。',
  view: { xMin: -6, xMax: 6, yMin: -2, yMax: 8 },
  params: [{ key: 'a', label: '底数 a', min: 0.2, max: 4, step: 0.1, def: 2 }],
  curves: [{
    kind: 'fn',
    label: 'y = a^x',
    color: 'primary',
    f: (x, p) => Math.pow(p.a, x),
    df: (x, p) => Math.pow(p.a, x) * Math.log(p.a),
    inverse: {
      label: 'y = log_a(x)',
      f: (x, p) => (x > 0 && p.a !== 1 ? Math.log(x) / Math.log(p.a) : null),
      df: (x, p) => (x > 0 && p.a !== 1 ? 1 / (x * Math.log(p.a)) : null)
    }
  }],
  asymptotes: { v: [], h: [0] },
  inverseName: 'y = log<sub>a</sub> x',
  inverseNote: '定义域 (0,+∞) 与值域 R 互换',
  props: {
    domain: '(−∞, +∞)',
    range: '(0, +∞)',
    monotonic: 'a&gt;1 时严格递增；0&lt;a&lt;1 时严格递减',
    parity: '非奇非偶',
    period: '无',
    bounded: '有下界 0，无上界',
    asymptote: 'y = 0（水平渐近线）',
    continuity: '处处连续可导，f′(x) = a<sup>x</sup>·ln a',
    inverse: 'y = log<sub>a</sub>x；指数函数的值域 (0,+∞) 就是反函数的定义域',
    derivative: '(a<sup>x</sup>)′ = a<sup>x</sup>·ln a；特别地 (e<sup>x</sup>)′ = e<sup>x</sup>',
    integral: '∫a<sup>x</sup>dx = a<sup>x</sup>/ln a + C'
  },
  exam: {
    points: [
      'e = lim(1+1/n)<sup>n</sup>，e<sup>x</sup> 是考研最重要的函数',
      'e<sup>x</sup> − 1 ~ x（x→0）——高频等价无穷小',
      '指数增长快于任何幂函数：a<sup>x</sup> 最终大于任意 x<sup>n</sup>'
    ],
    pitfalls: [
      '底数 a 必须满足 a&gt;0 且 a≠1',
      'a<sup>x</sup> 恒为正，值域永远不含 0 与负数'
    ],
    examples: [
      'lim<sub>x→0</sub> (e<sup>x</sup>−1)/x = 1',
      'e<sup>ln x</sup> = x 与 ln(e<sup>x</sup>) = x 的互逆使用'
    ]
  }
});

F.push({
  id: 'log',
  stage: 'senior',
  order: 3,
  name: '对数函数',
  en: 'Logarithmic function',
  formula: 'y = log<sub>a</sub>x',
  formulaFn: (p) => 'y = log<sub>' + f2(p.a) + '</sub>x',
  tagline: '指数的"解药"：把乘除变成加减，把幂变成倍数。',
  view: { xMin: -1, xMax: 8, yMin: -4, yMax: 4 },
  params: [{ key: 'a', label: '底数 a', min: 0.2, max: 4, step: 0.1, def: 2 }],
  curves: [{
    kind: 'fn',
    label: 'y = log_a(x)',
    color: 'primary',
    f: (x, p) => (x > 0 && p.a !== 1 ? Math.log(x) / Math.log(p.a) : null),
    df: (x, p) => (x > 0 && p.a !== 1 ? 1 / (x * Math.log(p.a)) : null),
    inverse: {
      label: 'y = a^x',
      f: (x, p) => Math.pow(p.a, x),
      df: (x, p) => Math.pow(p.a, x) * Math.log(p.a)
    }
  }],
  asymptotes: { v: [0], h: [] },
  inverseName: 'y = a<sup>x</sup>',
  inverseNote: '定义域 (0,+∞) 与值域 R 互换',
  props: {
    domain: '(0, +∞)',
    range: '(−∞, +∞)',
    monotonic: 'a&gt;1 时严格递增；0&lt;a&lt;1 时严格递减',
    parity: '非奇非偶',
    period: '无',
    bounded: '无界（上、下都无界）',
    asymptote: 'x = 0（垂直渐近线）',
    continuity: '定义域内处处连续可导，f′(x) = 1/(x·ln a)',
    inverse: 'y = a<sup>x</sup>；对数函数的值域 R 就是反函数的定义域',
    derivative: '(log<sub>a</sub>x)′ = 1/(x·ln a)；特别地 (ln x)′ = 1/x',
    integral: '∫ln x dx = x·ln x − x + C'
  },
  exam: {
    points: [
      'ln(1+x) ~ x（x→0）——高频等价无穷小',
      '对数恒等式 a<sup>log<sub>a</sub>N</sup> = N',
      '换底公式 log<sub>a</sub>b = ln b / ln a'
    ],
    pitfalls: [
      '真数必须为正：x=0 是垂直渐近线，不在定义域内',
      'ln(xy) = ln x + ln y 要求 x、y 同号，使用时注意定义域',
      '对数增长慢于任何幂函数：ln x 最终小于任意 x<sup>ε</sup>（ε&gt;0）'
    ],
    examples: [
      'lim<sub>x→+∞</sub> ln x / x = 0',
      '解 log₂x + log₂(x−1) = 1 必须先写定义域 x&gt;1'
    ]
  }
});

F.push({
  id: 'sin',
  stage: 'senior',
  order: 4,
  name: '正弦函数',
  en: 'Sine',
  formula: 'y = sin x',
  tagline: '最标准的周期函数：有界、光滑、上下起伏。',
  view: { xMin: -7, xMax: 7, yMin: -2.4, yMax: 2.4 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = sin x',
    color: 'primary',
    f: (x) => Math.sin(x),
    df: (x) => Math.cos(x),
    inverse: {
      label: 'y = arcsin x',
      f: (x) => (Math.abs(x) <= 1 ? Math.asin(x) : null),
      df: (x) => (Math.abs(x) < 1 ? 1 / Math.sqrt(1 - x * x) : null)
    }
  }],
  asymptotes: null,
  inverseName: 'y = arcsin x（sin 限制在 [−π/2, π/2]）',
  inverseNote: '反函数是大学内容，这里先直观对照',
  props: {
    domain: '(−∞, +∞)',
    range: '[−1, 1]',
    monotonic: '在 [−π/2+2kπ, π/2+2kπ] 递增，[π/2+2kπ, 3π/2+2kπ] 递减',
    parity: '奇函数，图像关于原点对称',
    period: '最小正周期 2π',
    bounded: '有界，|sin x| ≤ 1',
    asymptote: '无',
    continuity: '处处连续可导，(sin x)′ = cos x',
    inverse: '整个 R 上无反函数；限制在 [−π/2, π/2] 上反函数为 arcsin x',
    derivative: '(sin x)′ = cos x',
    integral: '∫sin x dx = −cos x + C'
  },
  exam: {
    points: [
      'sin x ~ x（x→0）——最重要的等价无穷小',
      'sin x 在 x=0 处泰勒展开：x − x³/6 + …',
      '有界性 |sin x| ≤ 1 常与夹逼准则联用求极限'
    ],
    pitfalls: [
      'sin x 在整个 R 上不是一一对应，必须先限制定义域才有反函数',
      '说"sin x 单调递增"是错的——要在每个周期区间内说'
    ],
    examples: [
      'lim<sub>x→0</sub> sin x / x = 1',
      'x − sin x ~ x³/6（x→0）'
    ]
  }
});

F.push({
  id: 'cos',
  stage: 'senior',
  order: 5,
  name: '余弦函数',
  en: 'Cosine',
  formula: 'y = cos x',
  tagline: '正弦的孪生兄弟：相位差 π/2，偶函数。',
  view: { xMin: -7, xMax: 7, yMin: -2.4, yMax: 2.4 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = cos x',
    color: 'primary',
    f: (x) => Math.cos(x),
    df: (x) => -Math.sin(x),
    inverse: {
      label: 'y = arccos x',
      f: (x) => (Math.abs(x) <= 1 ? Math.acos(x) : null),
      df: (x) => (Math.abs(x) < 1 ? -1 / Math.sqrt(1 - x * x) : null)
    }
  }],
  asymptotes: null,
  inverseName: 'y = arccos x（cos 限制在 [0, π]）',
  inverseNote: '反函数是大学内容，这里先直观对照',
  props: {
    domain: '(−∞, +∞)',
    range: '[−1, 1]',
    monotonic: '在 [2kπ, π+2kπ] 递减，[π+2kπ, 2π+2kπ] 递增',
    parity: '偶函数，图像关于 y 轴对称',
    period: '最小正周期 2π',
    bounded: '有界，|cos x| ≤ 1',
    asymptote: '无',
    continuity: '处处连续可导，(cos x)′ = −sin x',
    inverse: '整个 R 上无反函数；限制在 [0, π] 上反函数为 arccos x',
    derivative: '(cos x)′ = −sin x',
    integral: '∫cos x dx = sin x + C'
  },
  exam: {
    points: [
      '1 − cos x ~ x²/2（x→0）——高频等价无穷小',
      'cos x 是偶函数：cos(−x) = cos x',
      '倍角公式 cos 2x = 1 − 2sin²x 在积分中反复使用'
    ],
    pitfalls: [
      'cos x 的导数是 −sin x，符号别丢',
      'cos x 与 sin x 互为"移相"关系：cos x = sin(x + π/2)'
    ],
    examples: [
      'lim<sub>x→0</sub> (1−cos x)/x² = 1/2',
      '∫cos²x dx 用降幂公式 (1+cos 2x)/2'
    ]
  }
});

F.push({
  id: 'tan',
  stage: 'senior',
  order: 6,
  name: '正切函数',
  en: 'Tangent',
  formula: 'y = tan x',
  tagline: '一堵堵"墙"：每隔 π 就有一条垂直渐近线。',
  view: { xMin: -7, xMax: 7, yMin: -6, yMax: 6 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = tan x',
    color: 'primary',
    f: (x) => {
      const c = Math.cos(x);
      return Math.abs(c) < 1e-10 ? NaN : Math.sin(x) / c;
    },
    df: (x) => {
      const c = Math.cos(x);
      return Math.abs(c) < 1e-10 ? null : 1 / (c * c);
    },
    inverse: {
      label: 'y = arctan x',
      f: (x) => Math.atan(x),
      df: (x) => 1 / (1 + x * x)
    }
  }],
  asymptotes: (view) => {
    const out = [];
    const k0 = Math.ceil(view.xMin / PI - 0.5);
    const k1 = Math.floor(view.xMax / PI - 0.5);
    for (let k = k0; k <= k1; k++) out.push((k + 0.5) * PI);
    return { v: out, h: [] };
  },
  inverseName: 'y = arctan x（tan 限制在 (−π/2, π/2)）',
  inverseNote: '反函数是大学内容，这里先直观对照',
  props: {
    domain: 'x ≠ π/2 + kπ（k 为整数）',
    range: '(−∞, +∞)',
    monotonic: '在每个区间 (−π/2+kπ, π/2+kπ) 内严格递增',
    parity: '奇函数，图像关于原点对称',
    period: '最小正周期 π',
    bounded: '无界',
    asymptote: 'x = π/2 + kπ（垂直渐近线）',
    continuity: '定义域内连续可导，(tan x)′ = sec²x',
    inverse: '限制在 (−π/2, π/2) 上反函数为 arctan x',
    derivative: '(tan x)′ = sec²x = 1 + tan²x',
    integral: '∫tan x dx = −ln|cos x| + C'
  },
  exam: {
    points: [
      'tan x ~ x（x→0）——高频等价无穷小',
      '垂直渐近线 x = π/2 + kπ 是"无定义点"的标准案例',
      'tan x 在 (−π/2, π/2) 内严格递增，值域为全体实数'
    ],
    pitfalls: [
      'tan x 的定义域要挖掉所有 π/2 + kπ，一个都不能漏',
      'tan(π/2) 不存在——"正无穷"不是函数值'
    ],
    examples: [
      'lim<sub>x→0</sub> tan x / x = 1',
      'tan x − x ~ x³/3（x→0）'
    ]
  }
});

F.push({
  id: 'cot',
  stage: 'senior',
  order: 7,
  name: '余切函数',
  en: 'Cotangent',
  formula: 'y = cot x',
  tagline: '正切的"另一半"：渐近线搬到了整数倍的 π。',
  view: { xMin: -7, xMax: 7, yMin: -6, yMax: 6 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = cot x',
    color: 'primary',
    f: (x) => {
      const s = Math.sin(x);
      return Math.abs(s) < 1e-10 ? NaN : Math.cos(x) / s;
    },
    df: (x) => {
      const s = Math.sin(x);
      return Math.abs(s) < 1e-10 ? null : -1 / (s * s);
    },
    inverse: {
      label: 'y = arccot x',
      f: (x) => {
        if (x > 0) return Math.atan(1 / x);
        if (x < 0) return Math.atan(1 / x) + Math.PI;
        return Math.PI / 2;
      },
      df: (x) => -1 / (1 + x * x)
    }
  }],
  asymptotes: (view) => {
    const out = [];
    const k0 = Math.ceil(view.xMin / PI);
    const k1 = Math.floor(view.xMax / PI);
    for (let k = k0; k <= k1; k++) out.push(k * PI);
    return { v: out, h: [] };
  },
  inverseName: 'y = arccot x（cot 限制在 (0, π)）',
  inverseNote: '反函数是大学内容，这里先直观对照',
  props: {
    domain: 'x ≠ kπ（k 为整数）',
    range: '(−∞, +∞)',
    monotonic: '在每个区间 (kπ, π+kπ) 内严格递减',
    parity: '奇函数，图像关于原点对称',
    period: '最小正周期 π',
    bounded: '无界',
    asymptote: 'x = kπ（垂直渐近线）',
    continuity: '定义域内连续可导，(cot x)′ = −csc²x',
    inverse: '限制在 (0, π) 上反函数为 arccot x',
    derivative: '(cot x)′ = −csc²x = −(1 + cot²x)',
    integral: '∫cot x dx = ln|sin x| + C'
  },
  exam: {
    points: [
      'cot x = 1/tan x = cos x/sin x',
      'cot x 在 (0, π) 内严格递减，值域为全体实数',
      '垂直渐近线在 x = kπ 处'
    ],
    pitfalls: [
      'cot x 的定义域挖掉 kπ，与 tan 恰好错开 π/2',
      'cot x 的导数带负号，积分结果是 ln|sin x|（正号）'
    ],
    examples: [
      '∫cot x dx = ln|sin x| + C 的推导（令 u = sin x）',
      'cot(π/4) = 1，与 tan(π/4) = 1 呼应'
    ]
  }
});

F.push({
  id: 'sec',
  stage: 'senior',
  order: 8,
  name: '正割函数',
  en: 'Secant',
  formula: 'y = sec x = 1/cos x',
  tagline: '余弦的"大倒影"：开口向上和向下的两瓣曲线。',
  view: { xMin: -7, xMax: 7, yMin: -6, yMax: 6 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = sec x',
    color: 'primary',
    f: (x) => {
      const c = Math.cos(x);
      return Math.abs(c) < 1e-10 ? NaN : 1 / c;
    },
    df: (x) => {
      const c = Math.cos(x);
      const s = Math.sin(x);
      return Math.abs(c) < 1e-10 ? null : s / (c * c);
    },
    inverse: {
      label: 'y = arcsec x',
      f: (x) => (Math.abs(x) >= 1 ? Math.acos(1 / x) : null),
      df: (x) => (Math.abs(x) > 1 ? 1 / (Math.abs(x) * Math.sqrt(x * x - 1)) : null)
    }
  }],
  asymptotes: (view) => {
    const out = [];
    const k0 = Math.ceil(view.xMin / PI - 0.5);
    const k1 = Math.floor(view.xMax / PI - 0.5);
    for (let k = k0; k <= k1; k++) out.push((k + 0.5) * PI);
    return { v: out, h: [] };
  },
  inverseName: 'y = arcsec x',
  inverseNote: '反函数是大学内容，这里先直观对照',
  props: {
    domain: 'x ≠ π/2 + kπ',
    range: '(−∞, −1] ∪ [1, +∞)',
    monotonic: '在 (0, π/2)、(π/2, π) 等区间内分别单调',
    parity: '偶函数，图像关于 y 轴对称',
    period: '最小正周期 2π',
    bounded: '无界（|sec x| ≥ 1）',
    asymptote: 'x = π/2 + kπ（垂直渐近线）',
    continuity: '定义域内连续可导，(sec x)′ = sec x·tan x',
    inverse: '反函数为 arcsec x，定义域 (−∞,−1]∪[1,+∞)',
    derivative: '(sec x)′ = sec x·tan x',
    integral: '∫sec x dx = ln|sec x + tan x| + C'
  },
  exam: {
    points: [
      '恒等式 sec²x = 1 + tan²x',
      '∫sec x dx = ln|sec x + tan x|——考研必背公式',
      'sec x 与 cos x 互为倒数：图像在 cos 接近 0 处冲向 ±∞'
    ],
    pitfalls: [
      'sec x 的值域是 (−∞,−1]∪[1,+∞)，中间 (−1,1) 没有值',
      'sec x 是偶函数，但 tan x 是奇函数，乘积的奇偶性别搞混'
    ],
    examples: [
      '用 t = tan(x/2) 的万能代换求 ∫sec x dx',
      'lim<sub>x→0</sub> sec x = 1'
    ]
  }
});

F.push({
  id: 'csc',
  stage: 'senior',
  order: 9,
  name: '余割函数',
  en: 'Cosecant',
  formula: 'y = csc x = 1/sin x',
  tagline: '正弦的"大倒影"：渐近线在整数倍的 π 处。',
  view: { xMin: -7, xMax: 7, yMin: -6, yMax: 6 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = csc x',
    color: 'primary',
    f: (x) => {
      const s = Math.sin(x);
      return Math.abs(s) < 1e-10 ? NaN : 1 / s;
    },
    df: (x) => {
      const s = Math.sin(x);
      const c = Math.cos(x);
      return Math.abs(s) < 1e-10 ? null : -c / (s * s);
    },
    inverse: {
      label: 'y = arccsc x',
      f: (x) => (Math.abs(x) >= 1 ? Math.asin(1 / x) : null),
      df: (x) => (Math.abs(x) > 1 ? -1 / (Math.abs(x) * Math.sqrt(x * x - 1)) : null)
    }
  }],
  asymptotes: (view) => {
    const out = [];
    const k0 = Math.ceil(view.xMin / PI);
    const k1 = Math.floor(view.xMax / PI);
    for (let k = k0; k <= k1; k++) out.push(k * PI);
    return { v: out, h: [] };
  },
  inverseName: 'y = arccsc x',
  inverseNote: '反函数是大学内容，这里先直观对照',
  props: {
    domain: 'x ≠ kπ',
    range: '(−∞, −1] ∪ [1, +∞)',
    monotonic: '在 (0, π/2)、(π/2, π) 等区间内分别单调',
    parity: '奇函数，图像关于原点对称',
    period: '最小正周期 2π',
    bounded: '无界（|csc x| ≥ 1）',
    asymptote: 'x = kπ（垂直渐近线）',
    continuity: '定义域内连续可导，(csc x)′ = −csc x·cot x',
    inverse: '反函数为 arccsc x，定义域 (−∞,−1]∪[1,+∞)',
    derivative: '(csc x)′ = −csc x·cot x',
    integral: '∫csc x dx = ln|csc x − cot x| + C'
  },
  exam: {
    points: [
      '恒等式 csc²x = 1 + cot²x',
      '∫csc x dx = ln|csc x − cot x|——考研必背公式',
      'csc x 与 sin x 互为倒数：图像在 sin 接近 0 处冲向 ±∞'
    ],
    pitfalls: [
      'csc x 的导数带负号，与 sec x 的导数符号不同',
      'csc x 是奇函数，图像经过原点附近但不经过原点'
    ],
    examples: [
      '用万能代换求 ∫csc x dx',
      'lim<sub>x→π/2</sub> csc x = 1'
    ]
  }
});

})();
