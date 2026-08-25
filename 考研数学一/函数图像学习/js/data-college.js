(function(){
var F = window.FUNCTIONS;
var PI = Math.PI;

/* ==================== 大学篇 · 反三角函数 ==================== */

F.push({
  id: 'arcsin',
  stage: 'college',
  order: 1,
  name: '反正弦函数',
  en: 'Arcsine',
  formula: 'y = arcsin x',
  tagline: 'sin 被"剪"到 [−π/2, π/2] 后再翻过来看。',
  view: { xMin: -2.4, xMax: 2.4, yMin: -2.4, yMax: 2.4 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = arcsin x',
    color: 'primary',
    f: (x) => (Math.abs(x) <= 1 ? Math.asin(x) : null),
    df: (x) => (Math.abs(x) < 1 ? 1 / Math.sqrt(1 - x * x) : null),
    inverse: {
      label: 'y = sin x（参考）',
      f: (x) => Math.sin(x),
      df: (x) => Math.cos(x)
    }
  }],
  asymptotes: null,
  inverseName: 'y = sin x（限制在 [−π/2, π/2]）',
  inverseNote: '定义域 [−1,1] 正是 sin 的值域',
  props: {
    domain: '[−1, 1]',
    range: '[−π/2, π/2]',
    monotonic: '严格递增',
    parity: '奇函数',
    period: '无',
    bounded: '有界',
    asymptote: '无',
    continuity: '(−1,1) 内连续可导；x=±1 处导数趋于 ∞（不可导）',
    inverse: '原函数 sin x 限制在 [−π/2, π/2]；定义域与值域互换',
    derivative: '(arcsin x)′ = 1/√(1−x²)，x∈(−1,1)',
    integral: '∫arcsin x dx = x·arcsin x + √(1−x²) + C'
  },
  exam: {
    points: [
      'arcsin x ~ x（x→0）——等价无穷小',
      '恒等式 arcsin x + arccos x = π/2',
      '导数分母 √(1−x²) 提示 x=±1 是端点，导数为无穷'
    ],
    pitfalls: [
      '值域必须写 [−π/2, π/2]，不能和 arccos 的 [0, π] 搞混',
      'arcsin x 只在 [−1,1] 有定义，|x|&gt;1 直接无意义'
    ],
    examples: [
      '∫dx/√(1−x²) = arcsin x + C',
      '证明 arcsin(−x) = −arcsin x（奇函数）'
    ]
  }
});

F.push({
  id: 'arccos',
  stage: 'college',
  order: 2,
  name: '反余弦函数',
  en: 'Arccosine',
  formula: 'y = arccos x',
  tagline: 'cos 被"剪"到 [0, π] 后再翻过来看——单调递减。',
  view: { xMin: -2.4, xMax: 2.4, yMin: -0.6, yMax: 3.8 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = arccos x',
    color: 'primary',
    f: (x) => (Math.abs(x) <= 1 ? Math.acos(x) : null),
    df: (x) => (Math.abs(x) < 1 ? -1 / Math.sqrt(1 - x * x) : null),
    inverse: {
      label: 'y = cos x（参考）',
      f: (x) => Math.cos(x),
      df: (x) => -Math.sin(x)
    }
  }],
  asymptotes: null,
  inverseName: 'y = cos x（限制在 [0, π]）',
  inverseNote: '单调性与原函数一致：都递减',
  props: {
    domain: '[−1, 1]',
    range: '[0, π]',
    monotonic: '严格递减',
    parity: '非奇非偶',
    period: '无',
    bounded: '有界',
    asymptote: '无',
    continuity: '(−1,1) 内连续可导；x=±1 处导数趋于 −∞',
    inverse: '原函数 cos x 限制在 [0, π]；值域 [0, π] 是反函数的定义域',
    derivative: '(arccos x)′ = −1/√(1−x²)，x∈(−1,1)',
    integral: '∫arccos x dx = x·arccos x − √(1−x²) + C'
  },
  exam: {
    points: [
      'arcsin x + arccos x = π/2（对一切 x∈[−1,1]）',
      'arccos x 是减函数，arcsin x 是增函数',
      '导数与 arcsin 只差一个负号——成对记忆'
    ],
    pitfalls: [
      '值域是 [0, π]，不是 [−π/2, π/2]',
      'arccos(−1) = π，arccos(1) = 0，别把端点值写反'
    ],
    examples: [
      '计算 arccos(−1/2) = 2π/3',
      '由 arcsin x + arccos x = π/2 两边求导验证导数关系'
    ]
  }
});

F.push({
  id: 'arctan',
  stage: 'college',
  order: 3,
  name: '反正切函数',
  en: 'Arctangent',
  formula: 'y = arctan x',
  tagline: '把整个实数轴"压缩"到两条水平渐近线之间。',
  view: { xMin: -8, xMax: 8, yMin: -3, yMax: 3 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = arctan x',
    color: 'primary',
    f: (x) => Math.atan(x),
    df: (x) => 1 / (1 + x * x),
    inverse: {
      label: 'y = tan x（参考）',
      f: (x) => {
        const c = Math.cos(x);
        return Math.abs(c) < 1e-10 ? NaN : Math.sin(x) / c;
      },
      df: (x) => {
        const c = Math.cos(x);
        return Math.abs(c) < 1e-10 ? null : 1 / (c * c);
      }
    }
  }],
  asymptotes: { v: [], h: [PI / 2, -PI / 2] },
  inverseName: 'y = tan x（限制在 (−π/2, π/2)）',
  inverseNote: '水平渐近线 y=±π/2 对应 tan 的垂直渐近线',
  props: {
    domain: '(−∞, +∞)',
    range: '(−π/2, π/2)',
    monotonic: '严格递增',
    parity: '奇函数',
    period: '无',
    bounded: '有界',
    asymptote: 'y = π/2 与 y = −π/2（水平渐近线）',
    continuity: '处处连续可导，f′(x) = 1/(1+x²)',
    inverse: '原函数 tan x 限制在 (−π/2, π/2)',
    derivative: '(arctan x)′ = 1/(1+x²)',
    integral: '∫arctan x dx = x·arctan x − ½ln(1+x²) + C'
  },
  exam: {
    points: [
      'arctan x ~ x（x→0）——等价无穷小',
      'lim<sub>x→±∞</sub> arctan x = ±π/2——水平渐近线考点',
      '1/(1+x²) 的原函数是 arctan x——积分常客'
    ],
    pitfalls: [
      '值域是开区间 (−π/2, π/2)，取不到 ±π/2',
      'arctan x + arccot x = π/2（定义域 R）'
    ],
    examples: [
      '∫dx/(1+x²) = arctan x + C',
      '证明 arctan(−x) = −arctan x'
    ]
  }
});

F.push({
  id: 'arccot',
  stage: 'college',
  order: 4,
  name: '反余切函数',
  en: 'Arccotangent',
  formula: 'y = arccot x',
  tagline: 'arctan 的"镜像伴侣"：值域搬到 (0, π)，整体递减。',
  view: { xMin: -8, xMax: 8, yMin: -1, yMax: 4 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = arccot x',
    color: 'primary',
    f: (x) => {
      if (x > 0) return Math.atan(1 / x);
      if (x < 0) return Math.atan(1 / x) + PI;
      return PI / 2;
    },
    df: (x) => -1 / (1 + x * x),
    inverse: {
      label: 'y = cot x（参考）',
      f: (x) => {
        const s = Math.sin(x);
        return Math.abs(s) < 1e-10 ? NaN : Math.cos(x) / s;
      },
      df: (x) => {
        const s = Math.sin(x);
        return Math.abs(s) < 1e-10 ? null : -1 / (s * s);
      }
    }
  }],
  asymptotes: { v: [], h: [0, PI] },
  inverseName: 'y = cot x（限制在 (0, π)）',
  inverseNote: '水平渐近线 y=0 与 y=π',
  props: {
    domain: '(−∞, +∞)',
    range: '(0, π)',
    monotonic: '严格递减',
    parity: '非奇非偶',
    period: '无',
    bounded: '有界',
    asymptote: 'y = 0 与 y = π（水平渐近线）',
    continuity: '处处连续可导，f′(x) = −1/(1+x²)',
    inverse: '原函数 cot x 限制在 (0, π)',
    derivative: '(arccot x)′ = −1/(1+x²)',
    integral: '∫arccot x dx = x·arccot x + ½ln(1+x²) + C'
  },
  exam: {
    points: [
      'arctan x + arccot x = π/2（x∈R）',
      'arccot x 是减函数，导数与 arctan 只差负号',
      'lim<sub>x→+∞</sub> arccot x = 0，lim<sub>x→−∞</sub> arccot x = π'
    ],
    pitfalls: [
      '值域是 (0, π)，不是 (−π/2, π/2)',
      'arccot 0 = π/2，arccot(±∞) 趋近 π 或 0'
    ],
    examples: [
      '证明 arctan x + arccot x = π/2（两边求导 + 取特殊点）',
      '∫dx/(1+x²) 的原函数也可写作 −arccot x + C'
    ]
  }
});

F.push({
  id: 'arcsec',
  stage: 'college',
  order: 5,
  name: '反正割函数',
  en: 'Arcsecant',
  formula: 'y = arcsec x',
  tagline: '只在 |x| ≥ 1 处存在：值域分成两段。',
  view: { xMin: -6, xMax: 6, yMin: -1, yMax: 4 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = arcsec x',
    color: 'primary',
    f: (x) => (Math.abs(x) >= 1 ? Math.acos(1 / x) : null),
    df: (x) => (Math.abs(x) > 1 ? 1 / (Math.abs(x) * Math.sqrt(x * x - 1)) : null),
    inverse: {
      label: 'y = sec x（参考）',
      f: (x) => {
        const c = Math.cos(x);
        return Math.abs(c) < 1e-10 ? NaN : 1 / c;
      },
      df: (x) => {
        const c = Math.cos(x);
        return Math.abs(c) < 1e-10 ? null : Math.sin(x) / (c * c);
      }
    }
  }],
  asymptotes: null,
  inverseName: 'y = sec x',
  inverseNote: '定义域 (−∞,−1]∪[1,+∞) 正是 sec 的值域',
  props: {
    domain: '(−∞, −1] ∪ [1, +∞)',
    range: '[0, π/2) ∪ (π/2, π]',
    monotonic: 'x≥1 上递增，x≤−1 上递增（各段内）',
    parity: '非奇非偶',
    period: '无',
    bounded: '有界',
    asymptote: '无',
    continuity: '定义域内连续可导，导数带绝对值',
    inverse: '原函数 sec x（限制后）；arcsec x = arccos(1/x)',
    derivative: '(arcsec x)′ = 1/(|x|·√(x²−1))',
    integral: '∫arcsec x dx = x·arcsec x − sign(x)·ln|x + √(x²−1)| + C'
  },
  exam: {
    points: [
      '导数公式里的绝对值是高频易错点：1/(|x|√(x²−1))',
      '定义域 |x|≥1，与 sec 的值域对应',
      'arcsec x = arccos(1/x) 可用于快速取值'
    ],
    pitfalls: [
      'arcsec x 不是奇函数也不是偶函数',
      'x=±1 处导数不存在（分母为零）'
    ],
    examples: [
      '求 arcsec(2) = π/3',
      '∫dx/(|x|√(x²−1)) = arcsec x + C'
    ]
  }
});

F.push({
  id: 'arccsc',
  stage: 'college',
  order: 6,
  name: '反余割函数',
  en: 'Arccosecant',
  formula: 'y = arccsc x',
  tagline: 'arcsec 的奇函数兄弟：值域关于原点对称。',
  view: { xMin: -6, xMax: 6, yMin: -2.6, yMax: 2.6 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = arccsc x',
    color: 'primary',
    f: (x) => (Math.abs(x) >= 1 ? Math.asin(1 / x) : null),
    df: (x) => (Math.abs(x) > 1 ? -1 / (Math.abs(x) * Math.sqrt(x * x - 1)) : null),
    inverse: {
      label: 'y = csc x（参考）',
      f: (x) => {
        const s = Math.sin(x);
        return Math.abs(s) < 1e-10 ? NaN : 1 / s;
      },
      df: (x) => {
        const s = Math.sin(x);
        return Math.abs(s) < 1e-10 ? null : -Math.cos(x) / (s * s);
      }
    }
  }],
  asymptotes: null,
  inverseName: 'y = csc x',
  inverseNote: '定义域 (−∞,−1]∪[1,+∞) 正是 csc 的值域',
  props: {
    domain: '(−∞, −1] ∪ [1, +∞)',
    range: '[−π/2, 0) ∪ (0, π/2]',
    monotonic: 'x≥1 上递减，x≤−1 上递减（各段内）',
    parity: '奇函数',
    period: '无',
    bounded: '有界',
    asymptote: '无',
    continuity: '定义域内连续可导，导数带绝对值',
    inverse: '原函数 csc x（限制后）；arccsc x = arcsin(1/x)',
    derivative: '(arccsc x)′ = −1/(|x|·√(x²−1))',
    integral: '∫arccsc x dx = x·arccsc x + sign(x)·ln|x + √(x²−1)| + C'
  },
  exam: {
    points: [
      'arccsc x = arcsin(1/x)，是奇函数',
      '导数带负号和绝对值：−1/(|x|√(x²−1))',
      '与 arcsec 的导数只差负号'
    ],
    pitfalls: [
      'x=0 处无定义，x=±1 处导数不存在',
      '值域不含 0：arccsc x 永远不等于 0'
    ],
    examples: [
      '求 arccsc(2) = π/6',
      '证明 arccsc x 是奇函数'
    ]
  }
});

/* ==================== 大学篇 · 双曲函数 ==================== */

F.push({
  id: 'sinh',
  stage: 'college',
  order: 7,
  name: '双曲正弦',
  en: 'Hyperbolic sine',
  formula: 'y = sinh x = (e<sup>x</sup> − e<sup>−x</sup>)/2',
  tagline: 'e 的奇函数组合：像 sin，但"越陡越陡"。',
  view: { xMin: -4, xMax: 4, yMin: -4, yMax: 4 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = sinh x',
    color: 'primary',
    f: (x) => Math.sinh(x),
    df: (x) => Math.cosh(x),
    inverse: {
      label: 'y = arsinh x',
      f: (x) => Math.asinh(x),
      df: (x) => 1 / Math.sqrt(1 + x * x)
    }
  }],
  asymptotes: null,
  inverseName: 'y = arsinh x = ln(x + √(x²+1))',
  inverseNote: '图像关于 y=x 对称',
  props: {
    domain: '(−∞, +∞)',
    range: '(−∞, +∞)',
    monotonic: '严格递增',
    parity: '奇函数',
    period: '无',
    bounded: '无界',
    asymptote: '无',
    continuity: '处处连续可导，(sinh x)′ = cosh x',
    inverse: 'arsinh x = ln(x + √(x²+1))，R → R',
    derivative: '(sinh x)′ = cosh x',
    integral: '∫sinh x dx = cosh x + C'
  },
  exam: {
    points: [
      '恒等式 cosh²x − sinh²x = 1——双曲"勾股定理"',
      'arsinh x = ln(x + √(x²+1))：反函数与对数的桥梁',
      '双曲代换：√(x²+a²) 型积分令 x = a·sinh t'
    ],
    pitfalls: [
      'sinh x 不是周期函数，别和 sin x 混淆',
      'sinh 0 = 0，图像经过原点'
    ],
    examples: [
      '∫dx/√(x²+1) = arsinh x + C = ln(x+√(x²+1)) + C',
      '求 sinh 的奇偶性（用定义直接验证）'
    ]
  }
});

F.push({
  id: 'cosh',
  stage: 'college',
  order: 8,
  name: '双曲余弦',
  en: 'Hyperbolic cosine',
  formula: 'y = cosh x = (e<sup>x</sup> + e<sup>−x</sup>)/2',
  tagline: '悬链线：一根绳子自然下垂的形状。',
  view: { xMin: -4, xMax: 4, yMin: -0.6, yMax: 6 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = cosh x',
    color: 'primary',
    f: (x) => Math.cosh(x),
    df: (x) => Math.sinh(x),
    inverse: {
      label: 'y = arcosh x',
      f: (x) => (x >= 1 ? Math.acosh(x) : null),
      df: (x) => (x > 1 ? 1 / Math.sqrt(x * x - 1) : null)
    }
  }],
  asymptotes: null,
  inverseName: 'y = arcosh x = ln(x + √(x²−1))',
  inverseNote: 'cosh 限制在 [0,+∞) 上才有反函数',
  props: {
    domain: '(−∞, +∞)',
    range: '[1, +∞)',
    monotonic: '[0, +∞) 上递增，(−∞, 0] 上递减；x=0 处取最小值 1',
    parity: '偶函数',
    period: '无',
    bounded: '有下界 1，无上界',
    asymptote: '无',
    continuity: '处处连续可导，(cosh x)′ = sinh x',
    inverse: '限制在 [0,+∞) 上：arcosh x = ln(x + √(x²−1))，[1,+∞) → [0,+∞)',
    derivative: '(cosh x)′ = sinh x',
    integral: '∫cosh x dx = sinh x + C'
  },
  exam: {
    points: [
      'cosh²x − sinh²x = 1 与三角恒等式 sin²+cos²=1 对应但差个负号',
      'arcosh x = ln(x + √(x²−1))：√(x²−a²) 型积分用 x = a·cosh t',
      '悬链线方程 y = a·cosh(x/a) 是实际应用背景'
    ],
    pitfalls: [
      'cosh x ≥ 1，最小值是 1 不是 0',
      'cosh x 在 R 上不一一对应，反函数必须先限制 x≥0'
    ],
    examples: [
      '∫dx/√(x²−1) = arcosh x + C（x&gt;1）',
      '证明 cosh 是偶函数、sinh 是奇函数'
    ]
  }
});

F.push({
  id: 'tanh',
  stage: 'college',
  order: 9,
  name: '双曲正切',
  en: 'Hyperbolic tangent',
  formula: 'y = tanh x = sinh x / cosh x',
  tagline: '把整个实数轴平滑地"夹"进 (−1, 1)。',
  view: { xMin: -4, xMax: 4, yMin: -1.4, yMax: 1.4 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = tanh x',
    color: 'primary',
    f: (x) => Math.tanh(x),
    df: (x) => 1 - Math.tanh(x) * Math.tanh(x),
    inverse: {
      label: 'y = artanh x',
      f: (x) => (Math.abs(x) < 1 ? Math.atanh(x) : null),
      df: (x) => (Math.abs(x) < 1 ? 1 / (1 - x * x) : null)
    }
  }],
  asymptotes: { v: [], h: [1, -1] },
  inverseName: 'y = artanh x = ½ln((1+x)/(1−x))',
  inverseNote: '值域 (−1,1) 是 artanh 的定义域',
  props: {
    domain: '(−∞, +∞)',
    range: '(−1, 1)',
    monotonic: '严格递增',
    parity: '奇函数',
    period: '无',
    bounded: '有界（|tanh x| &lt; 1）',
    asymptote: 'y = 1 与 y = −1（水平渐近线）',
    continuity: '处处连续可导，(tanh x)′ = sech²x = 1 − tanh²x',
    inverse: 'artanh x = ½ln((1+x)/(1−x))，(−1,1) → R',
    derivative: '(tanh x)′ = sech²x = 1 − tanh²x',
    integral: '∫tanh x dx = ln(cosh x) + C'
  },
  exam: {
    points: [
      'tanh x 是"有界且严格单调"的标准例子',
      'lim<sub>x→±∞</sub> tanh x = ±1',
      'artanh x = ½ln((1+x)/(1−x))：与 ln 互化的桥梁'
    ],
    pitfalls: [
      '值域是开区间 (−1,1)，永远取不到 ±1',
      'tanh 的导数公式 1 − tanh²x 与 tan 的 1 + tan²x 差一个符号'
    ],
    examples: [
      '∫dx/(1−x²) = artanh x + C（|x|&lt;1）',
      '证明 tanh 是奇函数'
    ]
  }
});

F.push({
  id: 'coth',
  stage: 'college',
  order: 10,
  name: '双曲余切',
  en: 'Hyperbolic cotangent',
  formula: 'y = coth x = cosh x / sinh x',
  tagline: 'tanh 的"外部"：值域在 (−1,1) 之外。',
  view: { xMin: -4, xMax: 4, yMin: -4, yMax: 4 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = coth x',
    color: 'primary',
    f: (x) => (x === 0 ? NaN : 1 / Math.tanh(x)),
    df: (x) => {
      const t = Math.tanh(x);
      return t === 0 ? null : (t * t - 1) / (t * t);
    },
    inverse: {
      label: 'y = arcoth x',
      f: (x) => (Math.abs(x) > 1 ? Math.atanh(1 / x) : null),
      df: (x) => (Math.abs(x) > 1 ? 1 / (1 - x * x) : null)
    }
  }],
  asymptotes: { v: [0], h: [1, -1] },
  inverseName: 'y = arcoth x = ½ln((x+1)/(x−1))',
  inverseNote: '定义域 |x|&gt;1 正是 coth 的值域',
  props: {
    domain: 'x ≠ 0',
    range: '(−∞, −1) ∪ (1, +∞)',
    monotonic: '(−∞,0) 与 (0,+∞) 内均严格递减',
    parity: '奇函数',
    period: '无',
    bounded: '无界（|coth x| &gt; 1）',
    asymptote: 'x = 0（垂直）、y = 1 与 y = −1（水平）',
    continuity: '定义域内连续可导；x=0 处为无穷间断',
    inverse: 'arcoth x = ½ln((x+1)/(x−1))，|x|&gt;1',
    derivative: '(coth x)′ = −csch²x = 1 − coth²x',
    integral: '∫coth x dx = ln|sinh x| + C'
  },
  exam: {
    points: [
      'coth x 与 tanh x 值域互补：|coth x| &gt; 1，|tanh x| &lt; 1',
      'coth x 的导数 1 − coth²x（注意是负的）',
      'x=0 处垂直渐近线 + 无穷间断'
    ],
    pitfalls: [
      'coth 0 无定义，不是 0',
      '积分是 ln|sinh x|，带绝对值'
    ],
    examples: [
      '∫dx/(1−x²) = arcoth x + C（|x|&gt;1）',
      '求 lim<sub>x→0</sub> coth x（左右极限发散）'
    ]
  }
});

F.push({
  id: 'sech',
  stage: 'college',
  order: 11,
  name: '双曲正割',
  en: 'Hyperbolic secant',
  formula: 'y = sech x = 1 / cosh x',
  tagline: '一座平滑的小山丘：最高点 1，两端归于 0。',
  view: { xMin: -4, xMax: 4, yMin: -0.2, yMax: 1.4 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = sech x',
    color: 'primary',
    f: (x) => 1 / Math.cosh(x),
    df: (x) => -Math.tanh(x) / Math.cosh(x),
    inverse: {
      label: 'y = arsech x',
      f: (x) => (x > 0 && x <= 1 ? Math.acosh(1 / x) : null),
      df: (x) => (x > 0 && x < 1 ? -1 / (x * Math.sqrt(1 - x * x)) : null)
    }
  }],
  asymptotes: null,
  inverseName: 'y = arsech x = ln((1+√(1−x²))/x)',
  inverseNote: '定义域 (0,1] 正是 sech 的值域',
  props: {
    domain: '(−∞, +∞)',
    range: '(0, 1]',
    monotonic: '(−∞,0] 递增，[0,+∞) 递减；x=0 处取最大值 1',
    parity: '偶函数',
    period: '无',
    bounded: '有界（0 &lt; sech x ≤ 1）',
    asymptote: 'y = 0（水平渐近线）',
    continuity: '处处连续可导，(sech x)′ = −sech x·tanh x',
    inverse: '限制在 [0,+∞) 上：arsech x = ln((1+√(1−x²))/x)，(0,1] → [0,+∞)',
    derivative: '(sech x)′ = −sech x·tanh x',
    integral: '∫sech x dx = arctan(sinh x) + C'
  },
  exam: {
    points: [
      '恒等式 sech²x + tanh²x = 1',
      'sech x 偶函数、最大值 1——有界函数的好例子',
      '∫sech x dx = arctan(sinh x) 是漂亮的小结论'
    ],
    pitfalls: [
      '值域是 (0,1]，不是 (−1,1)',
      'arsech 的定义域只有 (0,1]，x=0 处无定义'
    ],
    examples: [
      '求 sech(0) = 1',
      '证明 sech²x + tanh²x = 1'
    ]
  }
});

F.push({
  id: 'csch',
  stage: 'college',
  order: 12,
  name: '双曲余割',
  en: 'Hyperbolic cosecant',
  formula: 'y = csch x = 1 / sinh x',
  tagline: '两支平滑曲线：原点处冲向正负无穷。',
  view: { xMin: -4, xMax: 4, yMin: -4, yMax: 4 },
  params: [],
  curves: [{
    kind: 'fn',
    label: 'y = csch x',
    color: 'primary',
    f: (x) => (x === 0 ? NaN : 1 / Math.sinh(x)),
    df: (x) => (x === 0 ? null : -Math.cosh(x) / (Math.sinh(x) * Math.sinh(x))),
    inverse: {
      label: 'y = arcsch x',
      f: (x) => (x !== 0 ? Math.asinh(1 / x) : null),
      df: (x) => (x !== 0 ? -1 / (Math.abs(x) * Math.sqrt(1 + x * x)) : null)
    }
  }],
  asymptotes: { v: [0], h: [0] },
  inverseName: 'y = arcsch x = ln(1/x + √(1+x²)/|x|)',
  inverseNote: '定义域 R\\{0} 正是 csch 的值域',
  props: {
    domain: 'x ≠ 0',
    range: '(−∞, 0) ∪ (0, +∞)',
    monotonic: '(−∞,0) 与 (0,+∞) 内均严格递减',
    parity: '奇函数',
    period: '无',
    bounded: '无界',
    asymptote: 'x = 0（垂直）与 y = 0（水平）',
    continuity: '定义域内连续可导；x=0 处为无穷间断',
    inverse: 'arcsch x = ln(1/x + √(1+x²)/|x|)，R\\{0} → R\\{0}',
    derivative: '(csch x)′ = −csch x·coth x',
    integral: '∫csch x dx = ln|tanh(x/2)| + C'
  },
  exam: {
    points: [
      '恒等式 coth²x − csch²x = 1',
      '两条渐近线 x=0 与 y=0——"双渐近线"模型',
      'arcsch 的导数带绝对值：−1/(|x|√(1+x²))'
    ],
    pitfalls: [
      'csch 0 无定义',
      'csch 是奇函数，图像关于原点对称'
    ],
    examples: [
      '求 ∫csch x dx（用 t = tanh(x/2) 代换）',
      '证明 csch 是奇函数'
    ]
  }
});

/* ==================== 大学篇 · 反双曲函数总览 ==================== */

var IH = {
  arsinh: {
    label: 'arsinh x',
    f: (x) => Math.asinh(x),
    df: (x) => 1 / Math.sqrt(1 + x * x),
    inv: Math.sinh,
    invDf: Math.cosh,
    invLabel: 'sinh x'
  },
  arcosh: {
    label: 'arcosh x',
    f: (x) => (x >= 1 ? Math.acosh(x) : null),
    df: (x) => (x > 1 ? 1 / Math.sqrt(x * x - 1) : null),
    inv: Math.cosh,
    invDf: Math.sinh,
    invLabel: 'cosh x'
  },
  artanh: {
    label: 'artanh x',
    f: (x) => (Math.abs(x) < 1 ? Math.atanh(x) : null),
    df: (x) => (Math.abs(x) < 1 ? 1 / (1 - x * x) : null),
    inv: Math.tanh,
    invDf: (x) => 1 - Math.tanh(x) * Math.tanh(x),
    invLabel: 'tanh x'
  },
  arcoth: {
    label: 'arcoth x',
    f: (x) => (Math.abs(x) > 1 ? Math.atanh(1 / x) : null),
    df: (x) => (Math.abs(x) > 1 ? 1 / (1 - x * x) : null),
    inv: (x) => (x === 0 ? NaN : 1 / Math.tanh(x)),
    invDf: (x) => {
      if (x === 0) return null;
      const c = 1 / Math.tanh(x);
      return 1 - c * c;
    },
    invLabel: 'coth x'
  },
  arsech: {
    label: 'arsech x',
    f: (x) => (x > 0 && x <= 1 ? Math.acosh(1 / x) : null),
    df: (x) => (x > 0 && x < 1 ? -1 / (x * Math.sqrt(1 - x * x)) : null),
    inv: (x) => 1 / Math.cosh(x),
    invDf: (x) => -Math.tanh(x) / Math.cosh(x),
    invLabel: 'sech x'
  },
  arcsch: {
    label: 'arcsch x',
    f: (x) => (x !== 0 ? Math.asinh(1 / x) : null),
    df: (x) => (x !== 0 ? -1 / (Math.abs(x) * Math.sqrt(1 + x * x)) : null),
    inv: (x) => (x === 0 ? NaN : 1 / Math.sinh(x)),
    invDf: (x) => (x === 0 ? null : -Math.cosh(x) / (Math.sinh(x) * Math.sinh(x))),
    invLabel: 'csch x'
  }
};

F.push({
  id: 'invhyp',
  stage: 'college',
  order: 13,
  name: '反双曲函数',
  en: 'Inverse hyperbolic functions',
  formula: 'y = arsinh x',
  formulaFn: (p) => {
    const opt = IH[p.which];
    return 'y = ' + opt.label;
  },
  tagline: '六个反双曲函数一张卡搞定：下拉切换，每个都带对数表达式。',
  view: { xMin: -4, xMax: 4, yMin: -4, yMax: 4 },
  params: [{
    key: 'which',
    type: 'select',
    label: '查看函数',
    def: 'arsinh',
    options: [
      { value: 'arsinh', label: 'arsinh x' },
      { value: 'arcosh', label: 'arcosh x' },
      { value: 'artanh', label: 'artanh x' },
      { value: 'arcoth', label: 'arcoth x' },
      { value: 'arsech', label: 'arsech x' },
      { value: 'arcsch', label: 'arcsch x' }
    ]
  }],
  curves: [{
    kind: 'fn',
    label: '(当前选择)',
    color: 'primary',
    f: (x, p) => IH[p.which].f(x),
    df: (x, p) => IH[p.which].df(x),
    inverse: {
      label: '(对应双曲函数)',
      f: (x, p) => IH[p.which].inv(x),
      df: (x, p) => IH[p.which].invDf(x)
    }
  }],
  asymptotes: (view, p) => {
    if (p.which === 'artanh') return { v: [-1, 1], h: [] };
    if (p.which === 'arcoth') return { v: [-1, 1], h: [0] };
    if (p.which === 'arcsch') return { v: [0], h: [0] };
    return null;
  },
  inverseName: '对应的六个双曲函数',
  inverseNote: '见各双曲函数卡片',
  props: {
    domain: 'arsinh：R；arcosh：[1,+∞)；artanh：(−1,1)；arcoth：|x|&gt;1；arsech：(0,1]；arcsch：x≠0',
    range: 'arsinh：R；arcosh：[0,+∞)；artanh：R；arcoth：R\\{0}；arsech：[0,+∞)；arcsch：R\\{0}',
    monotonic: 'arsinh、artanh 递增；arcosh、arcoth、arsech、arcsch 递减（定义域内）',
    parity: 'arsinh、artanh、arcoth、arcsch 为奇函数；arcosh、arsech 非奇非偶',
    period: '均无',
    bounded: 'arsinh、artanh 有界（值域有限）时例外：artanh 有界，其余看定义域',
    asymptote: 'artanh、arcoth：x=±1；arcoth、arcsch：y=0；arcsch：x=0',
    continuity: '定义域内连续可导（端点除外）',
    inverse: '分别是 sinh、cosh（限 x≥0）、tanh、coth、sech（限 x≥0）、csch',
    derivative: 'arsinh′ = 1/√(1+x²)；arcosh′ = 1/√(x²−1)；artanh′ = arcoth′ = 1/(1−x²)；arsech′ = −1/(x√(1−x²))；arcsch′ = −1/(|x|√(1+x²))',
    integral: '由对数表达式经换元积分得到，见右侧恒等式表'
  },
  note: '<b>六个反双曲函数的对数表达式（考研常用）：</b><table><tr><th>函数</th><th>对数表达式</th><th>定义域</th><th>导数</th></tr>' +
    '<tr><td>arsinh x</td><td>ln(x + √(x²+1))</td><td>R</td><td>1/√(1+x²)</td></tr>' +
    '<tr><td>arcosh x</td><td>ln(x + √(x²−1))</td><td>[1, +∞)</td><td>1/√(x²−1)</td></tr>' +
    '<tr><td>artanh x</td><td>½ln((1+x)/(1−x))</td><td>(−1, 1)</td><td>1/(1−x²)</td></tr>' +
    '<tr><td>arcoth x</td><td>½ln((x+1)/(x−1))</td><td>|x| &gt; 1</td><td>1/(1−x²)</td></tr>' +
    '<tr><td>arsech x</td><td>ln((1+√(1−x²))/x)</td><td>(0, 1]</td><td>−1/(x√(1−x²))</td></tr>' +
    '<tr><td>arcsch x</td><td>ln(1/x + √(1+x²)/|x|)</td><td>x ≠ 0</td><td>−1/(|x|√(1+x²))</td></tr></table>',
  exam: {
    points: [
      '积分恒等式：∫dx/√(x²+a²) = arsinh(x/a) + C',
      '对数表达式是与 ln 互化的关键：arsinh、arcosh、artanh 三式必背',
      '导数公式与反三角导数高度相似：arsinh 同 arcsin、artanh 同 arctan'
    ],
    pitfalls: [
      'artanh 与 arcoth 的导数都是 1/(1−x²)，但定义域不同',
      'arcosh 的定义域是 [1,+∞)，不是全体实数',
      'arsech、arcsch 的导数带负号和绝对值'
    ],
    examples: [
      '∫dx/√(x²+4) = arsinh(x/2) + C',
      '∫dx/(1−x²) 按 |x|&lt;1 与 |x|&gt;1 分别得 artanh 或 arcoth'
    ]
  }
});

/* ==================== 大学篇 · 特殊函数（考研反例） ==================== */

F.push({
  id: 'sgn',
  stage: 'college',
  order: 14,
  name: '符号函数',
  en: 'Sign function',
  formula: 'sgn(x)',
  tagline: '只输出三个值的函数：−1、0、1。考研分段函数的常客。',
  view: { xMin: -5, xMax: 5, yMin: -2, yMax: 2 },
  params: [],
  curves: [{
    kind: 'segments',
    label: 'y = sgn(x)',
    color: 'primary',
    segments: (view) => [
      { x0: view.xMin, x1: 0, y: -1, openEnd: true },
      { x0: 0, x1: view.xMax, y: 1, openStart: true },
      { x0: 0, x1: 0, y: 0, point: true }
    ]
  }],
  asymptotes: null,
  inverseName: '不存在（值域只有 3 个点）',
  inverseNote: '非一一对应',
  props: {
    domain: '(−∞, +∞)',
    range: '{−1, 0, 1}',
    monotonic: '不单调（分段常值）',
    parity: '奇函数',
    period: '无',
    bounded: '有界',
    asymptote: '无',
    continuity: 'x=0 处为第一类（跳跃）间断点；其余点连续',
    inverse: '不存在反函数（值域只有 3 个点）',
    derivative: 'x≠0 时 f′(x)=0；x=0 处不可导',
    integral: '∫sgn(x)dx = |x| + C（相差一个常数）'
  },
  exam: {
    points: [
      'sgn(x) = x/|x|（x≠0）；|x| = x·sgn(x)',
      'x=0 处第一类跳跃间断点的标准例子',
      '与 |x| 结合：x·sgn(x) = |x| 处处连续'
    ],
    pitfalls: [
      'sgn(0) = 0，不要漏掉原点这个点',
      'sgn 不是阶梯函数的"台阶"——它只有两级'
    ],
    examples: [
      '讨论 f(x) = sgn(x)·x² 的连续性与可导性',
      '用 sgn 表示 (|x|)′（x≠0 时）'
    ]
  }
});

F.push({
  id: 'floor',
  stage: 'college',
  order: 15,
  name: '取整函数',
  en: 'Floor function',
  formula: 'y = [x]',
  tagline: '向下取整：2.9 → 2，−2.1 → −3。楼梯一样的台阶。',
  view: { xMin: -5, xMax: 5, yMin: -3, yMax: 5 },
  params: [],
  curves: [{
    kind: 'segments',
    label: 'y = [x]',
    color: 'primary',
    segments: (view) => {
      const out = [];
      for (let n = Math.floor(view.xMin); n <= Math.ceil(view.xMax); n++) {
        out.push({
          x0: Math.max(view.xMin, n),
          x1: Math.min(view.xMax, n + 1),
          y: n,
          openEnd: true
        });
      }
      return out;
    }
  }],
  asymptotes: null,
  inverseName: '不存在（非一一对应）',
  inverseNote: '同一个整数值对应无穷多个 x',
  props: {
    domain: '(−∞, +∞)',
    range: 'Z（全体整数）',
    monotonic: '单调不减（台阶式）',
    parity: '非奇非偶',
    period: '无',
    bounded: '无界',
    asymptote: '无',
    continuity: '整数点为跳跃间断（右连续、左不连续）；非整数点连续',
    inverse: '不存在反函数（值域是离散整数集）',
    derivative: '非整数点 f′(x)=0；整数点不可导',
    integral: '分段积分（阶梯函数逐段求面积）'
  },
  exam: {
    points: [
      '核心不等式：[x] ≤ x &lt; [x]+1，即 x−1 &lt; [x] ≤ x',
      '整数点处"右连续、左不连续"——间断性判断常考',
      '小数部分函数 {x} = x − [x] 是最小正周期为 1 的函数'
    ],
    pitfalls: [
      '[−2.1] = −3，不是 −2（向下取整，不是截断）',
      'lim<sub>x→n</sub>[x] 不存在（左右极限分别为 n−1 与 n）'
    ],
    examples: [
      '解 [x] = 2 ⇔ x ∈ [2, 3)',
      'lim<sub>x→0⁺</sub>[x] = 0，lim<sub>x→0⁻</sub>[x] = −1'
    ]
  }
});

F.push({
  id: 'dirichlet',
  stage: 'college',
  order: 16,
  name: '狄利克雷函数',
  en: "Dirichlet function",
  formula: 'D(x) = 1（x 为有理数）；0（x 为无理数）',
  tagline: '数学分析"噩梦"：处处不连续、处处不可导、不可积。',
  view: { xMin: -5, xMax: 5, yMin: -0.4, yMax: 1.6 },
  params: [],
  curves: [{ kind: 'dirichlet', label: 'D(x)（示意）' }],
  asymptotes: null,
  inverseName: '不存在（非一一对应）',
  inverseNote: '图示仅为示意，真实图像无法绘制',
  props: {
    domain: '(−∞, +∞)',
    range: '{0, 1}',
    monotonic: '无单调性（处处剧烈跳动）',
    parity: '偶函数',
    period: '任意有理数都是周期（没有最小正周期）',
    bounded: '有界',
    asymptote: '无',
    continuity: '处处不连续（任意点的任意邻域内同时有取 0 和取 1 的点）',
    inverse: '不存在反函数',
    derivative: '处处不可导',
    integral: '黎曼意义下不可积（不连续点不是零测集）'
  },
  exam: {
    points: [
      '"处处不连续"的标准例子——没有连续点',
      '黎曼不可积的经典反例',
      '偶函数 + 任意有理数为周期的例子'
    ],
    pitfalls: [
      'D(x) 在任意点处的极限都不存在',
      '示意图只是概念演示，不能理解为真实图像'
    ],
    examples: [
      '证明 D(x) 在任意点极限不存在（取有理数列与无理数列逼近）',
      'f(x) = x·D(x)：在 x=0 处连续且可导，其余点讨论'
    ]
  }
});

F.push({
  id: 'riemann',
  stage: 'college',
  order: 17,
  name: '黎曼函数',
  en: 'Riemann function',
  formula: 'R(x) = 0（无理数）；1/q（最简有理数 p/q）',
  tagline: '狄利克雷的"温和版"：处处几乎连续，居然可积。',
  view: { xMin: -5, xMax: 5, yMin: -0.2, yMax: 1.2 },
  params: [],
  curves: [{ kind: 'riemann', label: 'R(x)（示意）' }],
  asymptotes: null,
  inverseName: '不存在（非一一对应）',
  inverseNote: '图示为有理点取样示意',
  props: {
    domain: '(−∞, +∞)',
    range: '{0, 1, 1/2, 1/3, 1/4, …}',
    monotonic: '无单调性',
    parity: '偶函数',
    period: '无（常见教材定义 R(0)=0 时）',
    bounded: '有界',
    asymptote: '无',
    continuity: '无理数处连续，非零有理数处不连续',
    inverse: '不存在反函数',
    derivative: '处处不可导',
    integral: '黎曼可积，且 ∫₀¹R(x)dx = 0'
  },
  exam: {
    points: [
      '黎曼可积的经典例子：不连续点集为零测度',
      '与狄利克雷函数对比：一个可积、一个不可积',
      '任意小区间上都有"峰"（1/q 有理点），但总积分仍为 0'
    ],
    pitfalls: [
      '不要以为"不连续点多"就不可积——关键是测度',
      'R(0) 的取值约定因教材而异，考题会明确给出'
    ],
    examples: [
      '用达布上和/下和夹逼证明 ∫₀¹R(x)dx = 0',
      '说明"处处不连续"与"黎曼可积"并不矛盾'
    ]
  }
});

})();
