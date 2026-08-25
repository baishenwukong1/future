window.FUNCTIONS = window.FUNCTIONS || [];

/* ---------- 通用数学小工具（供所有数据文件与绘图引擎使用） ---------- */
function f2(n){ return Math.round(n * 100) / 100; }
function toFrac(v, eps){
  if (Number.isInteger(v)) return { num: v, den: 1 };
  if (!Number.isFinite(v)) return null;
  eps = eps || 1e-6;
  let best = null, bestErr = Infinity;
  for (let d = 1; d <= 64; d++) {
    const n = Math.round(v * d);
    const err = Math.abs(v - n / d);
    if (err < bestErr) { bestErr = err; best = { num: n, den: d }; }
    if (bestErr < eps) break;
  }
  return bestErr < eps ? best : null;
}
function powSigned(x, a){
  if (x > 0) return Math.pow(x, a);
  if (x === 0) {
    if (a > 0) return 0;
    if (a < 0) return Infinity;
    return 1;
  }
  if (Number.isInteger(a)) return Math.pow(x, a);
  const r = toFrac(a, 1e-6);
  if (r && r.den % 2 === 1) return Math.sign(x) * Math.pow(Math.abs(x), a);
  return NaN;
}
function gcdInt(a, b){
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = a % b; a = b; b = t; }
  return a;
}
function mulberry32(seed){
  let a = seed | 0;
  return function(){
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
window.f2 = f2;
window.toFrac = toFrac;
window.powSigned = powSigned;
window.gcdInt = gcdInt;
window.mulberry32 = mulberry32;

/* ==================== 初中篇 ==================== */
(function(){

FUNCTIONS.push({
  id: 'const',
  stage: 'junior',
  order: 1,
  name: '常数函数',
  en: 'Constant function',
  formula: 'y = c',
  formulaFn: (p) => 'y = ' + f2(p.c),
  tagline: '最"平"的函数：无论 x 怎么变，y 永远不变。',
  view: { xMin: -5, xMax: 5, yMin: -4, yMax: 4 },
  params: [{ key: 'c', label: '常数 c', min: -3, max: 3, step: 0.5, def: 2 }],
  curves: [{
    kind: 'fn',
    label: 'y = c',
    color: 'primary',
    f: (x, p) => p.c,
    df: () => 0
  }],
  asymptotes: null,
  inverseName: '不存在（非一一对应）',
  inverseNote: '每个 y 对应无穷多个 x',
  props: {
    domain: '(−∞, +∞)',
    range: '{c}（单点集）',
    monotonic: '既单调不减，又单调不增；不是严格单调',
    parity: 'c≠0 时为偶函数；c=0 时是唯一既奇又偶的函数',
    period: '任意非零实数都是周期（没有最小正周期）',
    bounded: '有界',
    asymptote: '无（图像本身就是一条水平直线）',
    continuity: '处处连续、处处可导，且 f′(x)=0',
    inverse: '不存在反函数（每个 y 对应无穷多个 x，非一一对应）',
    derivative: '(c)′ = 0',
    integral: '∫ c dx = c·x + C'
  },
  exam: {
    points: [
      '唯一既奇又偶的函数是 f(x) ≡ 0',
      '常函数是"有界、连续、可导"的最简单例子',
      '周期问题中的万能构造素材：任何非零实数都是它的周期'
    ],
    pitfalls: [
      '不能说常数函数"单调递增"——它不是严格单调',
      '"周期函数一定有最小正周期"是错的，常函数就是反例'
    ],
    examples: [
      '证明：若 f(x) 既奇又偶，则 f(x) ≡ 0',
      'f(x)=1+sin x 的周期仍为 2π：常数项不影响周期性'
    ]
  }
});

FUNCTIONS.push({
  id: 'linear',
  stage: 'junior',
  order: 2,
  name: '一次函数',
  en: 'Linear function',
  formula: 'y = kx + b',
  formulaFn: (p) => {
    let s = 'y = ';
    const k = f2(p.k);
    if (k === 1) s += 'x';
    else if (k === -1) s += '−x';
    else s += k + 'x';
    if (p.b !== 0) s += (p.b > 0 ? ' + ' : ' − ') + Math.abs(f2(p.b));
    return s;
  },
  tagline: '最简单的函数，一切直线的通用形式。',
  view: { xMin: -6, xMax: 6, yMin: -6, yMax: 6 },
  params: [
    { key: 'k', label: '斜率 k', min: -3, max: 3, step: 0.1, def: 1 },
    { key: 'b', label: '截距 b', min: -3, max: 3, step: 0.1, def: 1 }
  ],
  curves: [{
    kind: 'fn',
    label: 'y = kx + b',
    color: 'primary',
    f: (x, p) => p.k * x + p.b,
    df: (x, p) => p.k,
    inverse: {
      label: 'y = (x − b)/k',
      f: (x, p) => (x - p.b) / p.k,
      df: (x, p) => 1 / p.k
    }
  }],
  asymptotes: null,
  inverseName: 'y = (x−b)/k（仍为一次函数）',
  inverseNote: '图像关于 y=x 对称',
  props: {
    domain: '(−∞, +∞)',
    range: '(−∞, +∞)（k≠0 时）',
    monotonic: 'k>0 单调递增；k&lt;0 单调递减；k=0 为常数函数',
    parity: 'b=0 且 k≠0 时为奇函数；b≠0 时非奇非偶',
    period: '无周期（k≠0）',
    bounded: '无界',
    asymptote: '无',
    continuity: '处处连续、处处可导，f′(x)=k',
    inverse: 'y = (x−b)/k，仍是一次函数；图像关于 y=x 对称',
    derivative: '(kx+b)′ = k',
    integral: '∫(kx+b)dx = ½kx² + bx + C'
  },
  exam: {
    points: [
      'k 是斜率，几何意义是直线倾斜程度；k>0 增、k&lt;0 减',
      '一次函数是"连续、可导、无界"的最基本模型',
      '两直线垂直 ⇔ k₁k₂ = −1（斜率乘积为 −1）'
    ],
    pitfalls: [
      'k=0 时退化为常数函数，讨论单调性、奇偶性要单独说',
      '直线 y=kx+b 本身不是渐近线，不要把两者混淆'
    ],
    examples: [
      '已知 f(f(x)) = 4x + 3，用待定系数法求 f(x)',
      '一次函数反函数求法：解出 x 再交换 x、y'
    ]
  }
});

FUNCTIONS.push({
  id: 'reciprocal',
  stage: 'junior',
  order: 3,
  name: '反比例函数',
  en: 'Inverse proportional function',
  formula: 'y = k/x',
  formulaFn: (p) => 'y = ' + f2(p.k) + '/x',
  tagline: '等轴双曲线：一个量增大多少倍，另一个量就缩小多少倍。',
  view: { xMin: -6, xMax: 6, yMin: -6, yMax: 6 },
  params: [{ key: 'k', label: '系数 k', min: -3, max: 3, step: 0.5, def: 1 }],
  curves: [{
    kind: 'fn',
    label: 'y = k/x',
    color: 'primary',
    f: (x, p) => (x === 0 ? NaN : p.k / x),
    df: (x, p) => -p.k / (x * x),
    inverse: {
      label: '反函数 = 自身',
      f: (x, p) => (x === 0 ? NaN : p.k / x),
      df: (x, p) => -p.k / (x * x)
    }
  }],
  asymptotes: { v: [0], h: [0] },
  inverseName: '自身（y = k/x）',
  inverseNote: '自反函数：f(f(x)) = x',
  props: {
    domain: '(−∞, 0) ∪ (0, +∞)',
    range: '(−∞, 0) ∪ (0, +∞)',
    monotonic: 'k>0 时在 (−∞,0) 和 (0,+∞) 上分别单调递减；不能笼统说"整个定义域内单调递减"',
    parity: '奇函数，图像关于原点对称',
    period: '无',
    bounded: '无界',
    asymptote: 'x = 0（垂直渐近线）与 y = 0（水平渐近线）',
    continuity: '定义域内处处连续可导；x=0 处无定义（无穷间断）',
    inverse: '反函数是它自身 y = k/x（自反函数）',
    derivative: '(k/x)′ = −k/x²',
    integral: '∫(k/x)dx = k·ln|x| + C'
  },
  exam: {
    points: [
      '"在定义域内单调递减"是经典错误说法——必须分区间',
      '自反函数模型 f(f(x)) = x，图像关于 y=x 对称',
      '无穷间断点与渐近线结合考查'
    ],
    pitfalls: [
      '判断单调性必须分 (−∞,0) 与 (0,+∞) 两个区间',
      'x=0 是间断点，不在定义域内'
    ],
    examples: [
      '比较 f(−1) 与 f(1)：f(−1)=−k，f(1)=k，说明不能整体单调',
      '|xy| = |k|：双曲线上任意一点与坐标轴围成的矩形面积恒为 |k|'
    ]
  }
});

FUNCTIONS.push({
  id: 'quadratic',
  stage: 'junior',
  order: 4,
  name: '二次函数',
  en: 'Quadratic function',
  formula: 'y = ax² + bx + c',
  formulaFn: (p) => {
    const a = f2(p.a);
    let s = 'y = ';
    if (a === 1) s += 'x²';
    else if (a === -1) s += '−x²';
    else s += a + 'x²';
    if (p.b !== 0) s += (p.b > 0 ? ' + ' : ' − ') + Math.abs(f2(p.b)) + 'x';
    if (p.c !== 0) s += (p.c > 0 ? ' + ' : ' − ') + Math.abs(f2(p.c));
    return s;
  },
  inversePair: true,
  tagline: '抛物线：a 决定开口方向与开口大小。',
  view: { xMin: -6, xMax: 6, yMin: -6, yMax: 6 },
  params: [
    { key: 'a', label: '二次项 a', min: -2, max: 2, step: 0.1, def: 1, note: 'a≠0' },
    { key: 'b', label: '一次项 b', min: -4, max: 4, step: 0.1, def: 0 },
    { key: 'c', label: '常数项 c', min: -3, max: 3, step: 0.1, def: -1 }
  ],
  curves: [
    {
      kind: 'fn',
      label: 'y = ax² + bx + c',
      color: 'primary',
      f: (x, p) => p.a * x * x + p.b * x + p.c,
      df: (x, p) => 2 * p.a * x + p.b
    },
    {
      kind: 'fn',
      label: '反函数左支',
      color: 'inv',
      f: (x, p) => {
        const d = p.c - p.b * p.b / (4 * p.a);
        const inside = (x - d) / p.a;
        return inside < 0 ? NaN : -p.b / (2 * p.a) - Math.sqrt(inside);
      },
      df: (x, p) => {
        const inside = (x - (p.c - p.b * p.b / (4 * p.a))) / p.a;
        return inside <= 0 ? null : -1 / (2 * p.a * Math.sqrt(inside));
      }
    },
    {
      kind: 'fn',
      label: '反函数右支',
      color: 'inv',
      f: (x, p) => {
        const d = p.c - p.b * p.b / (4 * p.a);
        const inside = (x - d) / p.a;
        return inside < 0 ? NaN : -p.b / (2 * p.a) + Math.sqrt(inside);
      },
      df: (x, p) => {
        const inside = (x - (p.c - p.b * p.b / (4 * p.a))) / p.a;
        return inside <= 0 ? null : 1 / (2 * p.a * Math.sqrt(inside));
      }
    }
  ],
  asymptotes: null,
  inverseName: '两支：y = −b/(2a) ± √((x−d)/a)，d = c − b²/(4a)',
  inverseNote: '整个 R 上无反函数；限制在对称轴一侧后可求',
  props: {
    domain: '(−∞, +∞)',
    range: 'a>0 时 [y₀, +∞)；a&lt;0 时 (−∞, y₀]，其中 y₀ = (4ac−b²)/(4a)',
    monotonic: 'a>0 时在 (−∞, −b/(2a)] 递减、[−b/(2a), +∞) 递增；a&lt;0 相反',
    parity: 'b=0 时为偶函数（对称轴为 y 轴）',
    period: '无',
    bounded: 'a>0 时有下界；a&lt;0 时有上界',
    asymptote: '无（抛物线）',
    continuity: '处处连续可导；顶点 (−b/(2a), y₀) 是极值点',
    inverse: '整个 R 上无反函数（非一一对应）；限制在对称轴一侧后反函数为两支半抛物线',
    derivative: '(ax²+bx+c)′ = 2ax + b',
    integral: '∫(ax²+bx+c)dx = (a/3)x³ + (b/2)x² + cx + C'
  },
  exam: {
    points: [
      '顶点、对称轴、判别式、韦达定理是基本功，贯穿到大学',
      '二次函数是"限制定义域构造反函数"的典型例子',
      'a 的符号决定开口方向与值域方向'
    ],
    pitfalls: [
      'a≠0 是二次函数的隐含前提',
      '求反函数必须先限制定义域（对称轴一侧）并注明',
      '判别式 Δ 决定图像与 x 轴交点个数'
    ],
    examples: [
      'f(x)=x² 限制在 [0,+∞) 上，反函数为 √x',
      'y = x² + 2x 配方为 (x+1)² − 1，对称轴 x = −1'
    ]
  }
});

FUNCTIONS.push({
  id: 'abs',
  stage: 'junior',
  order: 5,
  name: '绝对值函数',
  en: 'Absolute value function',
  formula: 'y = |x|',
  tagline: '一个"尖点"包罗万象：连续但不可导的经典例子。',
  view: { xMin: -6, xMax: 6, yMin: -2, yMax: 6 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = |x|',
    color: 'primary',
    f: (x) => Math.abs(x),
    df: (x) => (x > 0 ? 1 : (x < 0 ? -1 : null))
  }],
  asymptotes: null,
  inverseName: '不存在（非一一对应）',
  inverseNote: '|x| 是偶函数，处处不满足一一对应',
  props: {
    domain: '(−∞, +∞)',
    range: '[0, +∞)',
    monotonic: '(−∞, 0] 单调递减，[0, +∞) 单调递增',
    parity: '偶函数，图像关于 y 轴对称',
    period: '无',
    bounded: '有下界无上界',
    asymptote: '无',
    continuity: '处处连续；x=0 处不可导（左导数 −1，右导数 1）',
    inverse: '不存在反函数（非一一对应）',
    derivative: 'x≠0 时 (|x|)′ = sgn(x)；x=0 处不可导',
    integral: '∫|x|dx = ½x|x| + C'
  },
  exam: {
    points: [
      '|x| 是"连续但不可导"的第一号例子',
      'f(x) = |x−a| 在 x=a 处不可导——判断可导性的高频考法',
      '处理绝对值的基本功：按 x≥0 与 x&lt;0 分段'
    ],
    pitfalls: [
      'x=0 处是"尖点"：左右导数不相等，不能只写 ±1',
      '|x| 不是单调函数，是"先减后增"'
    ],
    examples: [
      '研究 f(x) = x|x|：处处连续可导，但二阶导数在 0 处不存在',
      '证明 ||x|−|y|| ≤ |x−y|（绝对值三角不等式）'
    ]
  }
});

})();
