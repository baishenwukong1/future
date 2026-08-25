/* 考研考点详解、例题答案、周期/有界/渐近线表达式、偶函数对称轴标注 */
window.CARD_EXTRA = window.CARD_EXTRA || {};
(function(){
var X = window.CARD_EXTRA;

/* ==================== 初中篇 ==================== */

X.const = {
  props: {
    period: '任意非零实数都是周期；没有最小正周期（不存在最小正周期的周期函数）'
  },
  note: '<b>偶函数 → 对称轴 x = 0。</b>c≠0 时图像是水平线，关于 y 轴对称；c=0 时既奇又偶（图像就是 x 轴）。',
  points: [
    { t: '唯一既奇又偶的函数是 f(x) ≡ 0', d: '设 f 既奇又偶：f(−x)=f(x) 且 f(−x)=−f(x)，两式相加得 2f(x)=0，故 f(x)≡0。' },
    { t: '有界 + 连续 + 可导的"三好学生"', d: '|f(x)|=|c| 恒为常数，显然有界；常函数处处连续、处处可导，导数恒为 0，是理解"可导 ⇒ 连续"的平凡例子。' },
    { t: '周期问题反例制造机', d: '任何非零实数 T 都满足 f(x+T)=f(x)，因此常函数没有最小正周期——这直接否定了"周期函数必有最小正周期"的错误说法。' }
  ],
  examples: [
    { q: '证明：若 f(x) 既奇又偶，则 f(x) ≡ 0。', a: '由偶性 f(−x)=f(x)，由奇性 f(−x)=−f(x)，两式相加得 2f(x)=0，故 f(x)=0 对一切 x 成立，即 f(x)≡0。' },
    { q: 'f(x)=1+sin x 的周期是多少？常数项影响周期吗？', a: 'sin x 的最小正周期为 2π；加上常数 1 只是把图像整体上移，不改变"重复"的间隔，所以 f 的最小正周期仍是 2π。' }
  ]
};

X.linear = {
  props: {
    bounded: '无界：|f(x)| → +∞（x → ±∞，k≠0 时）',
    asymptote: '无渐近线（直线本身）'
  },
  points: [
    { t: '斜率 k 决定单调性', d: 'f(x₁)−f(x₂)=k(x₁−x₂)，故 k&gt;0 严格递增、k&lt;0 严格递减、k=0 常数。k 的几何意义是直线倾斜角 θ 的正切（θ≠π/2 时 k=tan θ）。' },
    { t: '导数即斜率', d: 'f′(x)=k 恒为常数，说明一次函数的切线就是它本身，是"可导函数中最直"的代表。' },
    { t: '两直线垂直 ⇔ k₁k₂ = −1', d: '垂直时倾斜角相差 π/2，tan(θ+π/2)=−1/tan θ，故斜率乘积为 −1（两条都不垂直于 x 轴时）。' }
  ],
  examples: [
    { q: '已知 f(f(x)) = 4x+3，f 为一次函数，求 f(x)。', a: '设 f(x)=kx+b，则 f(f(x))=k²x+kb+b=4x+3。比较系数：k²=4，kb+b=3。k=2 时 b=1；k=−2 时 b=−3。故 f(x)=2x+1 或 f(x)=−2x−3。' },
    { q: '求 y=2x+1 的反函数，并说出两条直线的斜率关系。', a: 'y=2x+1 ⇒ x=(y−1)/2，交换 x、y 得 y=(x−1)/2。反函数仍是一次函数，两条直线的斜率 2 与 1/2 互为倒数。' }
  ]
};

X.reciprocal = {
  props: {
    bounded: '无界：x→0 时 |f(x)|→+∞',
    asymptote: '垂直渐近线 x = 0（lim f = ∞）；水平渐近线 y = 0（lim f = 0）'
  },
  points: [
    { t: '单调性必须分区间', d: 'f(x)=k/x 在 (−∞,0) 与 (0,+∞) 上分别单调，但不能说"在定义域内单调递减"：取 x₁=−1&lt;x₂=1，k&gt;0 时 f(x₁)=−k&lt;k=f(x₂)。' },
    { t: '自反函数模型', d: 'f(f(x))=k/(k/x)=x，故 y=k/x 的反函数是它自身，图像关于 y=x 对称，是所有"自反函数"的标准例子。' },
    { t: '两条渐近线 + 等轴双曲线', d: 'lim_{x→0} k/x=∞ 得垂直渐近线 x=0；lim_{x→±∞} k/x=0 得水平渐近线 y=0；图像是等轴双曲线。' }
  ],
  examples: [
    { q: '判断："y=1/x 在定义域内单调递减"对吗？', a: '错误。取 x₁=−1&lt;x₂=1，f(−1)=−1&lt;1=f(1)，不满足递减定义。只能说它在 (−∞,0) 与 (0,+∞) 上分别单调递减。' },
    { q: '双曲线 y=1/x 上一点 P(a,b)，求它与两坐标轴围成的矩形面积。', a: 'b=1/a，故 |a·b|=1。矩形面积恒为 1，与 P 的位置无关——这正是反比例函数"乘积不变"的几何意义。' }
  ]
};

X.quadratic = {
  props: {
    range: 'a&gt;0 时 [y₀, +∞)；a&lt;0 时 (−∞, y₀]，其中 y₀=(4ac−b²)/(4a) 是顶点的纵坐标',
    asymptote: '无渐近线（抛物线）',
    parity: 'b=0 时为偶函数（对称轴 x=0）；b≠0 时非奇非偶'
  },
  note: '<b>关键公式（必背）：</b><table>' +
    '<tr><td>对称轴</td><td>x = −b/(2a)</td></tr>' +
    '<tr><td>顶点</td><td>( −b/(2a), (4ac−b²)/(4a) )</td></tr>' +
    '<tr><td>判别式</td><td>Δ=b²−4ac：Δ&gt;0 两个实根；Δ=0 重根；Δ&lt;0 无实根</td></tr>' +
    '<tr><td>韦达定理</td><td>x₁+x₂=−b/a，x₁·x₂=c/a（Δ≥0 时）</td></tr>' +
    '<tr><td>顶点式</td><td>y=a(x−h)²+k，(h,k) 即顶点</td></tr></table>' +
    '<b>参数对图像的影响：</b><ul>' +
    '<li><b>a</b>：决定开口方向与大小。a&gt;0 开口向上，a&lt;0 开口向下；|a| 越大开口越窄（越"瘦"），|a| 越小开口越宽。</li>' +
    '<li><b>b</b>：与 a 共同决定对称轴 x=−b/(2a)；b 变化时抛物线沿自身"滑动"，顶点轨迹仍是一条抛物线。</li>' +
    '<li><b>c</b>：决定与 y 轴交点 (0,c)；c 增大整体上移，c 减小整体下移。</li>' +
    '<li>顶点式 y=a(x−h)²+k 中：a 管形状，h 管左右平移，k 管上下平移。</li></ul>',
  points: [
    { t: '顶点与对称轴公式', d: '配方法 y=a(x+b/(2a))²+(4ac−b²)/(4a) 直接给出对称轴 x=−b/(2a) 与顶点纵坐标 (4ac−b²)/(4a)。' },
    { t: '限制定义域才有反函数', d: '抛物线整体不是一一对应；限制在对称轴一侧（如 x≥−b/(2a)）后单调，反函数为两支：y=−b/(2a)±√((x−d)/a)，其中 d=c−b²/(4a)。' },
    { t: '判别式 Δ 的几何意义', d: 'Δ&gt;0：与 x 轴两个交点；Δ=0：相切（一个交点）；Δ&lt;0：无交点（a&gt;0 时图像全在 x 轴上方，a&lt;0 时全在下方）。' }
  ],
  examples: [
    { q: 'y=x²−4x+3 的对称轴、顶点、零点各是什么？', a: '配方 (x−2)²−1：对称轴 x=2，顶点 (2,−1)。解 x²−4x+3=0 得 x=1 或 x=3，即零点为 1、3。' },
    { q: 'a 从 0.5 变到 2 再变到 −1，抛物线怎么变？', a: 'a=0.5：开口宽而平缓；a=2：开口窄而陡；a=−1：开口翻转向下，顶点由最小值变为最大值。可拖动卡片上的滑块直观验证。' },
    { q: '求 f(x)=x² 在 [0,+∞) 上的反函数。', a: 'y=x²，x≥0 ⇒ x=√y；交换 x、y 得 y=√x（x≥0）。这正说明二次函数必须限制单调区间才存在反函数。' }
  ]
};

X.abs = {
  props: {
    bounded: '有下界无上界：|x| ≥ 0',
    asymptote: '无渐近线（两条射线组成的折线）'
  },
  note: '<b>偶函数 → 图像关于 y 轴对称（对称轴 x=0），顶点/尖点 (0,0)。</b>',
  points: [
    { t: '连续但不可导（x=0）', d: '右导数 lim_{h→0⁺}|h|/h=1，左导数 lim_{h→0⁻}|h|/h=−1，左右导数不相等，故 x=0 处不可导；但 |x| 处处连续。' },
    { t: '分段处理基本功', d: '|x|=x（x≥0），|x|=−x（x&lt;0）。凡含绝对值的函数，一律先分段再讨论极限、导数、积分。' },
    { t: '与符号函数互化', d: '|x|=x·sgn(x)，sgn(x)=x/|x|（x≠0）；且 (|x|)′=sgn(x)（x≠0）。' }
  ],
  examples: [
    { q: '讨论 f(x)=x|x| 在 x=0 处的可导性。', a: 'f(h)/h=h|h|/h=|h|→0（h→0），故 f′(0)=0。又 x≠0 时 f′(x)=2|x|→0，所以 f 处处可导；但 f′(x)=2|x| 在 0 处不可导，即 f 存在二阶不可导点。' },
    { q: '证明 ||x|−|y|| ≤ |x−y|。', a: '|x|=|(x−y)+y|≤|x−y|+|y|，移项得 |x|−|y|≤|x−y|；交换 x、y 得 |y|−|x|≤|x−y|。两式合并即 ||x|−|y||≤|x−y|。' }
  ]
};

/* ==================== 高中篇 ==================== */

X.power = {
  props: {
    period: '无周期',
    asymptote: 'a&lt;0 时：垂直渐近线 x=0 与水平渐近线 y=0；a≥0 时无渐近线'
  },
  note: '<b>奇偶性随指数 a 变化：</b>a 为偶数 → 偶函数（对称轴 x=0）；a 为奇数 → 奇函数（关于原点对称）；其他情形按定义域讨论。可拖动滑块观察图像变化。',
  points: [
    { t: '恒过点 (1,1)', d: '1^a=1 对一切实数 a 成立，所有幂函数图像都经过点 (1,1)。' },
    { t: 'a&gt;1 与 0&lt;a&lt;1 的形态对比', d: '0&lt;a&lt;1 时图像在 (0,+∞) 凸向上（如 √x）；a&gt;1 时凸向下（如 x²）。两族曲线在 (0,1) 与 (1,+∞) 的高低关系正好相反。' },
    { t: '幂指函数 x^x 的套路', d: 'x&gt;0 时 x^x=e^{x·ln x}，求导公式 (u^v)′=u^v·(v′·ln u + v·u′/u)，求极限常转成 e^{指数} 形式。' }
  ],
  examples: [
    { q: '比较 2^{√2} 与 √2 的大小。', a: '取对数：ln(2^{√2})=√2·ln2≈0.980，ln(√2)=0.5·ln2≈0.347，前者大，故 2^{√2}&gt;√2。' },
    { q: '求 y=x^{1/x}（x&gt;0）的最大值。', a: 'ln y=(ln x)/x，两边求导：(ln y)′=(1−ln x)/x²。x=e 时导数为 0 且先正后负，故 x=e 处取最大值 e^{1/e}。' }
  ]
};

X.exp = {
  props: {
    bounded: '有下界无上界：a^x &gt; 0（下界 0，取不到）',
    asymptote: '水平渐近线 y=0：a&gt;1 时 x→−∞ 趋近 0；0&lt;a&lt;1 时 x→+∞ 趋近 0'
  },
  points: [
    { t: 'e 与 e^x 的定义', d: 'e=lim_{n→∞}(1+1/n)^n=lim_{x→0}(1+x)^{1/x}；e^x 的导数等于自身，是初等函数中唯一"求导不变"的函数。' },
    { t: '等价无穷小 e^x − 1 ~ x', d: '由泰勒 e^x=1+x+x²/2!+…，得 e^x−1=x+o(x)，故 lim_{x→0}(e^x−1)/x=1。' },
    { t: '指数增长碾压幂函数', d: 'lim_{x→+∞} a^x/x^n=∞（a&gt;1，n 任意），即任何指数函数最终超过任何幂函数，比较大小与极限的常用结论。' }
  ],
  examples: [
    { q: '求 lim_{x→0}(e^x−1)/x。', a: '按导数定义：lim_{x→0}(e^x−e^0)/(x−0)=(e^x)′|_{x=0}=e^0=1。也可直接用等价无穷小 e^x−1~x。' },
    { q: '化简 e^{ln x} 与 ln(e^x)。', a: 'e^{ln x}=x（需 x&gt;0），ln(e^x)=x（x∈R）。二者是互逆运算的体现，在解指数/对数方程时反复使用。' }
  ]
};

X.log = {
  props: {
    bounded: '无界：x→0⁺ 时 ln x→−∞；x→+∞ 时 ln x→+∞',
    asymptote: '垂直渐近线 x=0（lim_{x→0⁺} log_a x = ∓∞）'
  },
  points: [
    { t: '等价无穷小 ln(1+x) ~ x', d: 'ln(1+x)=x−x²/2+…，故 lim_{x→0} ln(1+x)/x=1；注意前提是 x→0。' },
    { t: '对数恒等式与运算法则', d: 'a^{log_a N}=N；log_a(MN)=log_a M+log_a N（M,N&gt;0）；换底公式 log_a b=ln b/ln a。' },
    { t: '对数增长慢于幂函数', d: 'lim_{x→+∞} ln x/x^ε=0（ε&gt;0），求极限、比较大小的高频结论。' }
  ],
  examples: [
    { q: '求 lim_{x→+∞} ln x / x。', a: '令 t=ln x，则 x=e^t，原式=lim_{t→∞} t/e^t=0（指数增长快于任何多项式/线性增长）。' },
    { q: '解方程 log₂x + log₂(x−1) = 1。', a: '定义域 x&gt;1；合并得 log₂[x(x−1)]=1 ⇒ x(x−1)=2 ⇒ x=2 或 x=−1。x=−1 不在定义域，舍去，故 x=2。' }
  ]
};

X.sin = {
  props: {
    period: '最小正周期 T=2π；一般式 f(x)=A·sin(ωx+φ) 的周期 T=2π/|ω|（ω≠0）；若 g(x)=f(kx)，则周期变为 T/|k|',
    bounded: '有界：|sin x| ≤ 1'
  },
  points: [
    { t: '等价无穷小 sin x ~ x', d: 'sin x=x−x³/6+o(x³)，故 lim_{x→0} sin x/x=1；替换时注意必须是因子形式。' },
    { t: '有界性与夹逼准则', d: '|sin x|≤1，例如 lim_{x→∞} sin x/x=0：0≤|sin x/x|≤1/|x|→0。' },
    { t: '泰勒展开', d: 'sin x=x−x³/3!+x⁵/5!−…，由此得 x−sin x ~ x³/6（x→0），求极限常用。' },
    { t: '奇函数 + 周期公式', d: 'sin(−x)=−sin x（关于原点对称）；T=2π/|ω| 是必背周期公式。' }
  ],
  examples: [
    { q: '求 lim_{x→0} sin x / x。', a: '重要极限，结果 1。证明可夹逼：x→0⁺ 时 cos x&lt;sin x/x&lt;1，由夹逼准则得极限 1。' },
    { q: '求 f(x)=sin 2x 的最小正周期。', a: 'T=2π/|ω|=2π/2=π。频率翻倍则周期减半，可对照卡片滑块体会 ω 的作用。' }
  ]
};

X.cos = {
  props: {
    period: '最小正周期 T=2π；一般式 f(x)=A·cos(ωx+φ) 的周期 T=2π/|ω|（ω≠0）',
    bounded: '有界：|cos x| ≤ 1'
  },
  note: '<b>偶函数 → 图像关于 y 轴对称（对称轴 x=0）。</b>最大值 1 在 x=2kπ，最小值 −1 在 x=π+2kπ。',
  points: [
    { t: '等价无穷小 1−cos x ~ x²/2', d: 'cos x=1−x²/2+o(x²)，故 1−cos x=x²/2+o(x²)，lim(1−cos x)/x²=1/2。' },
    { t: '偶函数判定', d: 'cos(−x)=cos x，图像关于 y 轴对称，对称轴 x=0——偶函数的第一号例子。' },
    { t: '降幂公式', d: 'cos²x=(1+cos 2x)/2，积分、化简中高频使用。' }
  ],
  examples: [
    { q: '求 lim_{x→0}(1−cos x)/x²。', a: '1−cos x~x²/2，故极限=1/2；也可分子有理化 1−cos x=2sin²(x/2)，再代重要极限。' },
    { q: '计算 ∫cos²x dx。', a: 'cos²x=(1+cos 2x)/2，∫=x/2+(sin 2x)/4+C。' }
  ]
};

X.tan = {
  props: {
    period: '最小正周期 T=π；一般式 f(x)=tan(ωx+φ) 的周期 T=π/|ω|（ω≠0）',
    bounded: '无界：tan x 可取任意实数值',
    asymptote: '垂直渐近线 x=π/2+kπ（k∈Z）'
  },
  points: [
    { t: '等价无穷小 tan x ~ x', d: 'tan x=x+x³/3+o(x³)，故 tan x−x ~ x³/3（x→0）。' },
    { t: '垂直渐近线（无穷间断）', d: 'x→(π/2+kπ)⁻ 时 tan x→+∞，x→(π/2+kπ)⁺ 时 tan x→−∞，这些点是第二类无穷间断点。' },
    { t: '导数与恒等式', d: '(tan x)′=sec²x=1+tan²x；∫tan x dx=−ln|cos x|+C。' }
  ],
  examples: [
    { q: '求 lim_{x→0} tan x / x。', a: 'tan x~x，极限=1；或用 (tan x)′|_{x=0}=sec²0=1 的导数定义。' },
    { q: '为什么 tan x 在 (−π/2, π/2) 上存在反函数？', a: '该区间上 tan x 严格递增且值域为 R，是一一对应，故可定义反函数 arctan：R→(−π/2,π/2)。' }
  ]
};

X.cot = {
  props: {
    period: '最小正周期 T=π；f(x)=cot(ωx+φ) 的周期 T=π/|ω|（ω≠0）',
    bounded: '无界：cot x 可取任意实数值',
    asymptote: '垂直渐近线 x=kπ（k∈Z）'
  },
  points: [
    { t: 'cot x 在 (0,π) 严格递减', d: '(cot x)′=−csc²x&lt;0，值域为 R，故限制在 (0,π) 上存在反函数 arccot。' },
    { t: '导数与积分', d: '(cot x)′=−csc²x=−(1+cot²x)；∫cot x dx=ln|sin x|+C。' },
    { t: '与 tan 的渐近线错开', d: 'tan 的渐近线在 π/2+kπ，cot 的在 kπ，二者相差 π/2，都是周期 π。' }
  ],
  examples: [
    { q: '求 ∫cot x dx。', a: '令 u=sin x，du=cos x dx，∫cot x dx=∫du/u=ln|u|+C=ln|sin x|+C。' },
    { q: 'cot x 与 tan x 的周期和渐近线有什么关系？', a: '二者最小正周期都是 π；tan 在 π/2+kπ 处有垂直渐近线，cot 在 kπ 处，恰好相差 π/2。' }
  ]
};

X.sec = {
  props: {
    period: '最小正周期 T=2π；f(x)=sec(ωx) 的周期 T=2π/|ω|（ω≠0）',
    bounded: '无界且有"缝隙"：|sec x| ≥ 1（值域 (−∞,−1]∪[1,+∞)）',
    asymptote: '垂直渐近线 x=π/2+kπ（k∈Z）'
  },
  note: '<b>偶函数 → 图像关于 y 轴对称（对称轴 x=0）。</b>',
  points: [
    { t: '恒等式 sec²x = 1+tan²x', d: 'cos²x+sin²x=1 两边除以 cos²x 即得；导数、积分都要用。' },
    { t: '必背积分 ∫sec x dx', d: '∫sec x dx=ln|sec x+tan x|+C；推导：分子分母同乘 (sec x+tan x)。' },
    { t: '值域与渐近线', d: '|sec x|≥1 说明值域分两段；cos x→0 处 sec x→±∞，产生垂直渐近线。' }
  ],
  examples: [
    { q: '求 ∫sec x dx。', a: '∫sec x·(sec x+tan x)/(sec x+tan x)dx=∫(sec²x+sec x·tan x)/(sec x+tan x)dx=ln|sec x+tan x|+C。' },
    { q: '为什么 sec x 取不到 (−1,1) 内的值？', a: 'sec x=1/cos x，而 |cos x|≤1 且可任意接近 0，故 |sec x|≥1，值域为 (−∞,−1]∪[1,+∞)。' }
  ]
};

X.csc = {
  props: {
    period: '最小正周期 T=2π；f(x)=csc(ωx) 的周期 T=2π/|ω|（ω≠0）',
    bounded: '无界且有"缝隙"：|csc x| ≥ 1（值域 (−∞,−1]∪[1,+∞)）',
    asymptote: '垂直渐近线 x=kπ（k∈Z）'
  },
  points: [
    { t: '恒等式 csc²x = 1+cot²x', d: 'cos²x+sin²x=1 两边除以 sin²x 即得。' },
    { t: '必背积分 ∫csc x dx', d: '∫csc x dx=ln|csc x−cot x|+C（也可写成 −ln|csc x+cot x|+C）。' },
    { t: '奇函数 + 渐近线', d: 'csc(−x)=−csc x；sin x=0 即 x=kπ 处有垂直渐近线。' }
  ],
  examples: [
    { q: '求 ∫csc x dx。', a: '分子分母同乘 (csc x−cot x)：∫(csc x−cot x)′/(csc x−cot x) dx=ln|csc x−cot x|+C。' },
    { q: 'csc x 在哪些点无定义？', a: 'sin x=0，即 x=kπ（k∈Z），这些点是垂直渐近线，函数值为 ±∞ 发散。' }
  ]
};

/* ==================== 大学篇 · 反三角 ==================== */

X.arcsin = {
  props: {
    bounded: '有界：−π/2 ≤ arcsin x ≤ π/2',
    asymptote: '无渐近线（端点 (1,π/2) 与 (−1,−π/2) 处切线竖直）'
  },
  points: [
    { t: '导数公式推导', d: '设 y=arcsin x，则 x=sin y，dx/dy=cos y=√(1−x²)（y∈[−π/2,π/2] 时 cos y≥0），故 dy/dx=1/√(1−x²)。' },
    { t: '等价无穷小 arcsin x ~ x', d: 'arcsin x=x+x³/6+o(x³)，故 arcsin x−x ~ x³/6（x→0）。' },
    { t: '恒等式 arcsin x + arccos x = π/2', d: '对 x∈[−1,1] 成立；两边求导得 1/√(1−x²)−1/√(1−x²)=0，再取 x=0 确定常数。' }
  ],
  examples: [
    { q: '求 ∫dx/√(1−x²)。', a: '因为 (arcsin x)′=1/√(1−x²)（x∈(−1,1)），所以结果为 arcsin x+C。' },
    { q: '证明 arcsin(−x) = −arcsin x。', a: 'arcsin x∈[−π/2,π/2]，且 sin(−arcsin x)=−x，由反函数唯一性 arcsin(−x)=−arcsin x。' }
  ]
};

X.arccos = {
  props: {
    bounded: '有界：0 ≤ arccos x ≤ π',
    asymptote: '无渐近线'
  },
  points: [
    { t: '值域 [0,π] 与严格递减', d: '(arccos x)′=−1/√(1−x²)&lt;0，故严格递减；arccos(1)=0，arccos(−1)=π。' },
    { t: '与 arcsin 互补', d: 'arcsin x+arccos x=π/2，求值、化简常用。' },
    { t: '导数成对记忆', d: '(arcsin x)′=1/√(1−x²)，(arccos x)′=−1/√(1−x²)，只差负号。' }
  ],
  examples: [
    { q: '求 arccos(−1/2)。', a: 'cos(2π/3)=−1/2 且 2π/3∈[0,π]，故 arccos(−1/2)=2π/3。' },
    { q: '求 ∫arccos x dx。', a: '分部积分：x·arccos x − ∫x·(−1/√(1−x²))dx=x·arccos x−√(1−x²)+C。' }
  ]
};

X.arctan = {
  props: {
    bounded: '有界：−π/2 &lt; arctan x &lt; π/2',
    asymptote: '两条水平渐近线：y=π/2（x→+∞）与 y=−π/2（x→−∞）'
  },
  points: [
    { t: '水平渐近线', d: 'lim_{x→+∞} arctan x=π/2，lim_{x→−∞} arctan x=−π/2，考研高频求极限结论。' },
    { t: '导数公式推导', d: '设 y=arctan x，x=tan y，dx/dy=sec²y=1+x²，故 dy/dx=1/(1+x²)。' },
    { t: '等价无穷小 arctan x ~ x', d: 'arctan x=x−x³/3+o(x³)，故 arctan x−x ~ −x³/3（x→0）。' }
  ],
  examples: [
    { q: '求 ∫dx/(1+x²)。', a: '=arctan x+C；广义积分 ∫_{−∞}^{+∞}dx/(1+x²)=π。' },
    { q: '证明 arctan x + arccot x = π/2。', a: '两边求导均为 0（1/(1+x²)−1/(1+x²)=0），故差为常数；取 x=0：0+π/2=π/2。' }
  ]
};

X.arccot = {
  props: {
    bounded: '有界：0 &lt; arccot x &lt; π',
    asymptote: '两条水平渐近线：y=0（x→+∞）与 y=π（x→−∞）'
  },
  points: [
    { t: '值域 (0,π) 与严格递减', d: '(arccot x)′=−1/(1+x²)&lt;0；lim_{x→+∞}=0，lim_{x→−∞}=π。' },
    { t: '与 arctan 的关系', d: 'arctan x+arccot x=π/2（x∈R）；导数互为相反数。' },
    { t: '取值的分段表达', d: 'x&gt;0 时 arccot x=arctan(1/x)；x&lt;0 时 arccot x=arctan(1/x)+π；x=0 时为 π/2。' }
  ],
  examples: [
    { q: '求 lim_{x→−∞} arccot x。', a: '=π：x→−∞ 时 arccot x 趋近值域 (0,π) 的上界 π。' },
    { q: '∫dx/(1+x²) 的原函数还有哪些写法？', a: 'arctan x+C 与 −arccot x+C 均可（二者相差常数 π/2）。' }
  ]
};

X.arcsec = {
  props: {
    bounded: '有界：0 ≤ arcsec x ≤ π（除 π/2）',
    asymptote: '无渐近线'
  },
  points: [
    { t: '导数带绝对值', d: 'arcsec x=arccos(1/x)，链式求导得 (arcsec x)′=1/(|x|√(x²−1))——绝对值是高频失分点。' },
    { t: '定义域 |x|≥1', d: 'sec x 的值域是 (−∞,−1]∪[1,+∞)，这正是 arcsec x 的定义域。' },
    { t: '取值技巧', d: 'arcsec x=arccos(1/x)，如 arcsec 2=arccos(1/2)=π/3。' }
  ],
  examples: [
    { q: '求 arcsec(2)。', a: 'arcsec 2=arccos(1/2)=π/3。' },
    { q: '求 ∫dx/(|x|√(x²−1))（|x|&gt;1）。', a: '=arcsec x+C，直接由导数公式反推。' }
  ]
};

X.arccsc = {
  props: {
    bounded: '有界：−π/2 ≤ arccsc x ≤ π/2（除 0）',
    asymptote: '无渐近线'
  },
  points: [
    { t: '奇函数 + 导数带绝对值', d: 'arccsc x=arcsin(1/x)，是奇函数；导数为 −1/(|x|√(x²−1))。' },
    { t: '与 arcsec 对照', d: '二者导数只差负号：arcsec′=+1/(|x|√(x²−1))，arccsc′=−1/(|x|√(x²−1))。' }
  ],
  examples: [
    { q: '求 arccsc(2)。', a: 'arccsc 2=arcsin(1/2)=π/6。' },
    { q: '证明 arccsc x 是奇函数。', a: 'arcsin(1/(−x))=arcsin(−1/x)=−arcsin(1/x)，故 arccsc(−x)=−arccsc x。' }
  ]
};

/* ==================== 大学篇 · 双曲 ==================== */

X.sinh = {
  props: {
    bounded: '无界：x→±∞ 时 sinh x→±∞',
    asymptote: '无渐近线（两端近似 ½e^x 与 −½e^{−x}）'
  },
  points: [
    { t: '定义与奇偶性', d: 'sinh x=(e^x−e^{−x})/2，sinh(−x)=−sinh x 为奇函数，严格递增，R→R。' },
    { t: '反函数公式', d: 'arsinh x=ln(x+√(x²+1))：设 x=sinh y，令 t=e^y 解二次方程取正根，再取对数。' },
    { t: '恒等式 cosh²x−sinh²x=1', d: '双曲"勾股定理"，对应三角恒等式但差一个符号，双曲代换的核心。' }
  ],
  examples: [
    { q: '求 ∫dx/√(1+x²)。', a: '=arsinh x+C=ln(x+√(x²+1))+C；也可用双曲代换 x=sinh t 验证。' },
    { q: '证明 cosh²x−sinh²x=1。', a: '((e^x+e^{−x})²−(e^x−e^{−x})²)/4=(4e^x·e^{−x})/4=1。' }
  ]
};

X.cosh = {
  props: {
    bounded: '有下界无上界：cosh x ≥ 1（最小值 1，在 x=0 处）',
    asymptote: '无渐近线（两端近似 ½e^x 与 ½e^{−x}）'
  },
  note: '<b>偶函数 → 图像关于 y 轴对称（对称轴 x=0），顶点/最小值点 (0,1)。</b>',
  points: [
    { t: '偶函数 + 最小值 1', d: 'cosh x=(e^x+e^{−x})/2≥1，等号仅在 x=0；[0,+∞) 上递增，故限制后可逆。' },
    { t: '反函数 arcosh', d: 'arcosh x=ln(x+√(x²−1))，定义域 [1,+∞)，值域 [0,+∞)。' },
    { t: '悬链线背景', d: '两端固定自然下垂的绳索形状 y=a·cosh(x/a)，是 cosh 的实际应用。' }
  ],
  examples: [
    { q: '求 ∫dx/√(x²−1)（x&gt;1）。', a: '=arcosh x+C=ln(x+√(x²−1))+C。' },
    { q: 'cosh x 为什么在 R 上无反函数？', a: 'cosh 是偶函数，R 上非一一对应；限制在 [0,+∞) 后单调递增才有反函数 arcosh。' }
  ]
};

X.tanh = {
  props: {
    bounded: '有界：|tanh x| &lt; 1',
    asymptote: '两条水平渐近线：y=1（x→+∞）与 y=−1（x→−∞）'
  },
  points: [
    { t: '值域 (−1,1) 有界', d: '|tanh x|&lt;1，lim_{x→±∞} tanh x=±1，是有界且严格单调函数的代表。' },
    { t: '导数公式', d: '(tanh x)′=sech²x=1−tanh²x&gt;0，严格递增。' },
    { t: '反函数 artanh', d: 'artanh x=½ln((1+x)/(1−x))，定义域 (−1,1)，值域 R。' }
  ],
  examples: [
    { q: '求 ∫dx/(1−x²)，|x|&lt;1。', a: '=artanh x+C=½ln((1+x)/(1−x))+C。' },
    { q: '证明 tanh x 是奇函数。', a: 'tanh(−x)=sinh(−x)/cosh(−x)=−sinh x/cosh x=−tanh x。' }
  ]
};

X.coth = {
  props: {
    bounded: '无界：|coth x| &gt; 1（x→0 时趋于 ±∞）',
    asymptote: '垂直渐近线 x=0；两条水平渐近线 y=1 与 y=−1'
  },
  points: [
    { t: '值域 |coth x| &gt; 1', d: 'coth x=1/tanh x，tanh 的值域 (−1,1) 取倒数后为 (−∞,−1)∪(1,+∞)。' },
    { t: '三条渐近线', d: 'x=0 垂直渐近线；y=±1 两条水平渐近线——"双渐近线"加垂直渐近线的综合模型。' },
    { t: '导数公式', d: '(coth x)′=1−coth²x=−csch²x，恒为负（两段内均递减）。' }
  ],
  examples: [
    { q: '求 ∫dx/(1−x²)，|x|&gt;1。', a: '=arcoth x+C=½ln((x+1)/(x−1))+C。' },
    { q: 'coth x 与 tanh x 的值域关系？', a: '互为倒数：tanh∈(−1,1)，故 coth 的值域为 (−∞,−1)∪(1,+∞)。' }
  ]
};

X.sech = {
  props: {
    bounded: '有界：0 &lt; sech x ≤ 1（最大值 1，在 x=0）',
    asymptote: '水平渐近线 y=0（x→±∞）'
  },
  note: '<b>偶函数 → 图像关于 y 轴对称（对称轴 x=0），最大值点 (0,1)。</b>',
  points: [
    { t: '偶函数 + 最大值 1', d: 'sech x=1/cosh x∈(0,1]，x=0 取最大值。' },
    { t: '恒等式 sech²x + tanh²x = 1', d: 'cosh²x−sinh²x=1 两边除以 cosh²x 即得。' },
    { t: '积分公式', d: '∫sech x dx=arctan(sinh x)+C（令 u=sinh x）。' }
  ],
  examples: [
    { q: '求 ∫sech x dx。', a: '令 u=sinh x，du=cosh x dx，∫sech x dx=∫du/(1+u²)=arctan u+C=arctan(sinh x)+C。' },
    { q: 'sech x 的水平渐近线是什么？', a: 'y=0：x→±∞ 时 cosh x→+∞，sech x→0。' }
  ]
};

X.csch = {
  props: {
    bounded: '无界：|csch x| 在 x→0 时趋于 +∞',
    asymptote: '垂直渐近线 x=0 与水平渐近线 y=0（两条）'
  },
  points: [
    { t: '双渐近线模型', d: 'x=0 垂直渐近线（第二类间断），y=0 水平渐近线——同时具有两类渐近线的例子。' },
    { t: '奇函数', d: 'csch(−x)=1/sinh(−x)=−1/sinh x=−csch x。' },
    { t: '恒等式与积分', d: 'coth²x−csch²x=1；∫csch x dx=ln|tanh(x/2)|+C。' }
  ],
  examples: [
    { q: '求 ∫csch x dx。', a: '令 t=tanh(x/2)，则 dx=2/(1−t²)dt，csch x=(1−t²)/(2t)，积分得 ln|t|+C=ln|tanh(x/2)|+C。' },
    { q: 'csch x 在 x=0 附近的行为？', a: 'x→0⁺ 时 1/sinh x→+∞；x→0⁻ 时 →−∞，属于第二类（无穷）间断点。' }
  ]
};

/* ==================== 大学篇 · 反双曲总览 ==================== */

X.invhyp = {
  points: [
    { t: '反双曲导数与反三角导数对照记忆', d: 'arsinh′ 与 arcsin′ 形式相同：1/√(1+x²) 对 1/√(1−x²)；artanh′ 与 arctan′ 相同：1/(1−x²) 对 1/(1+x²)——成对背不容易错。' },
    { t: '对数表达式三件套', d: 'arsinh x=ln(x+√(x²+1))；arcosh x=ln(x+√(x²−1))；artanh x=½ln((1+x)/(1−x))。积分换元与结果互化都靠它们。' },
    { t: '定义域决定使用场景', d: 'arcosh 只在 x≥1；artanh 只在 |x|&lt;1；arcoth 只在 |x|&gt;1——积分解题时先看积分区间选哪一个。' }
  ],
  examples: [
    { q: '求 ∫dx/√(x²+4)。', a: '提出 4：∫dx/√(x²+4)=arsinh(x/2)+C=ln(x+√(x²+4))+C。' },
    { q: '∫dx/(1−x²) 的答案分几种情况？', a: '|x|&lt;1 时 =artanh x+C=½ln((1+x)/(1−x))+C；|x|&gt;1 时 =arcoth x+C=½ln((x+1)/(x−1))+C。' }
  ]
};

/* ==================== 大学篇 · 特殊函数 ==================== */

X.sgn = {
  points: [
    { t: 'x=0 处第一类跳跃间断', d: 'lim_{x→0⁻}sgn x=−1，lim_{x→0⁺}sgn x=1，左右极限存在但不相等，为跳跃间断。' },
    { t: '与 |x| 互化', d: '|x|=x·sgn x；( |x| )′=sgn x（x≠0）——含绝对值函数求导的快捷方式。' }
  ],
  examples: [
    { q: 'f(x)=sgn(x)·x² 在 x=0 可导吗？', a: 'f(x)=x·|x|（因 x²·sgn x=x·|x|），前面已证 x|x| 处处可导且 f′(0)=0，故可导。' },
    { q: 'sgn x 在 x=0 连续吗？', a: '不连续：左极限 −1、右极限 1，左右极限不相等，属跳跃间断。' }
  ]
};

X.floor = {
  points: [
    { t: '核心不等式 [x] ≤ x &lt; [x]+1', d: '等价于 x−1&lt;[x]≤x，放缩、夹逼、估值题中高频使用。' },
    { t: '整数点右连续、左不连续', d: 'lim_{x→n⁺}[x]=n，lim_{x→n⁻}[x]=n−1，左右极限不相等（差 1）。' },
    { t: '小数部分函数', d: '{x}=x−[x]∈[0,1)，是最小正周期为 1 的周期函数。' }
  ],
  examples: [
    { q: '求 lim_{x→0}[x]。', a: '不存在：x→0⁺ 时 [x]→0，x→0⁻ 时 [x]→−1，左右极限不同。' },
    { q: '解 [x]=2。', a: '由 [x]≤x&lt;[x]+1 得 2≤x&lt;3，即 x∈[2,3)。' }
  ]
};

X.dirichlet = {
  props: {
    bounded: '有界：0 ≤ D(x) ≤ 1',
    period: '任意有理数都是周期；没有最小正周期'
  },
  note: '<b>偶函数 → 示意图中的两条水平带关于 y 轴对称（对称轴 x=0）。</b>',
  points: [
    { t: '处处不连续', d: '任意 x₀，取有理数列逼近得 D=1，取无理数列逼近得 D=0，极限不存在，故无连续点。' },
    { t: '黎曼不可积', d: '任意分划下达布下和恒为 0、上和恒为区间长度，不相等，故黎曼意义下不可积。' },
    { t: '周期与奇偶性', d: '任意有理数 T 都满足 D(x+T)=D(x)（无最小正周期）；D(−x)=D(x)，偶函数。' }
  ],
  examples: [
    { q: '证明 D(x) 在任意点极限不存在。', a: '取有理数列 x_n→x₀ 得 D(x_n)=1→1；取无理数列 y_n→x₀ 得 D(y_n)=0→0，与极限唯一性矛盾。' },
    { q: 'f(x)=x·D(x) 在 x=0 处可导吗？', a: '|f(x)|≤|x|→0，故连续；但 f′(0)=lim_{x→0}D(x) 不存在（有理/无理逼近结果不同），故不可导。' }
  ]
};

X.riemann = {
  props: {
    bounded: '有界：0 ≤ R(x) ≤ 1',
    period: '无（常见教材定义 R(0)=0 时）'
  },
  note: '<b>偶函数 → 图像关于 y 轴对称（对称轴 x=0）。</b>',
  points: [
    { t: '黎曼可积（与 D 函数对比）', d: '不连续点集是全体非零有理数，为零测集，故黎曼可积且积分值为 0；D 函数处处不连续则不可积。' },
    { t: '连续点与间断点', d: '无理点连续（附近有理点的 1/q 可任意小）；非零有理点不连续（跃变 1/q−0）。' },
    { t: '任意小区间都有"峰"但积分仍为 0', d: '峰高 1/q 随 q 增大趋于 0，总和可通过分划控制到任意小，故 ∫₀¹R(x)dx=0。' }
  ],
  examples: [
    { q: '说明 ∫₀¹R(x)dx=0。', a: '任意分划下，达布下和=0；取足够大的 q，使得含 1/q 以上峰的子区间长度和任意小，则上和可任意接近 0，由夹逼得积分=0。' },
    { q: 'R(x) 与 D(x) 的可积性为什么不同？', a: 'R 的不连续点是零测集（可数个点），满足黎曼可积的充要条件；D 处处不连续，不连续集非零测度，故不可积。' }
  ]
};

})();
