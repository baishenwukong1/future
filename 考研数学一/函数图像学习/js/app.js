(function(){
'use strict';

/* ==================== 基础工具 ==================== */

var $ = function(s, r){ return (r || document).querySelector(s); };
var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
var FUNCS = window.FUNCTIONS || [];
var CARD_EXTRA = window.CARD_EXTRA || {};
var FONT = '-apple-system, "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", sans-serif';
var COMMENT_KEY = 'fx-comments-v1';

function esc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function fmtNum(n, dig){
  if (!Number.isFinite(n)) return '—';
  dig = dig || 3;
  var r = Math.round(n * Math.pow(10, dig)) / Math.pow(10, dig);
  return String(r);
}
function niceStep(raw){
  if (!(raw > 0)) return 1;
  var mag = Math.pow(10, Math.floor(Math.log10(raw)));
  var norm = raw / mag;
  var step;
  if (norm < 1.5) step = 1;
  else if (norm < 3.5) step = 2;
  else if (norm < 7.5) step = 5;
  else step = 10;
  return step * mag;
}
function cssVar(name){
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
function colors(){
  return {
    primary: cssVar('--primary'),
    inv: cssVar('--inv'),
    axis: cssVar('--axis'),
    grid: cssVar('--grid'),
    text: cssVar('--text'),
    muted: cssVar('--muted'),
    card: cssVar('--card'),
    line: cssVar('--line'),
    accent: cssVar('--accent')
  };
}
function stageName(s){
  return { junior: '初中篇', senior: '高中篇', college: '大学篇' }[s] || s;
}

/* ==================== 全局状态 ==================== */

var state = {
  tab: 'junior',
  cards: {},
  summaryHtml: null,
  comments: {}
};

function loadComments(){
  try {
    return JSON.parse(localStorage.getItem(COMMENT_KEY)) || {};
  } catch(e){ return {}; }
}
function saveComments(){
  try {
    localStorage.setItem(COMMENT_KEY, JSON.stringify(state.comments));
  } catch(e){}
}
function cardComments(cfgId){
  if (!state.comments[cfgId]) state.comments[cfgId] = { pins: [], notes: [] };
  return state.comments[cfgId];
}

/* ==================== 主题 ==================== */

function applyTheme(dark){
  document.documentElement.classList.toggle('dark', dark);
  var btn = $('#themeToggle');
  if (btn) btn.textContent = dark ? '☀️ 浅色模式' : '🌙 深色模式';
  Object.keys(state.cards).forEach(function(k){ redraw(state.cards[k]); });
}
function initTheme(){
  var saved = null;
  try { saved = localStorage.getItem('fx-theme'); } catch(e){}
  applyTheme(saved === 'dark');
  $('#themeToggle').addEventListener('click', function(){
    var dark = !document.documentElement.classList.contains('dark');
    applyTheme(dark);
    try { localStorage.setItem('fx-theme', dark ? 'dark' : 'light'); } catch(e){}
  });
}

/* ==================== 卡片构建 ==================== */

var PROP_LABELS = [
  ['domain', '定义域'], ['range', '值域'], ['monotonic', '单调性'],
  ['parity', '奇偶性'], ['period', '周期性'], ['bounded', '有界性'],
  ['asymptote', '渐近线'], ['continuity', '连续可导'], ['inverse', '反函数'],
  ['derivative', '导数'], ['integral', '积分']
];

function buildCard(cfg){
  var extra = CARD_EXTRA[cfg.id] || {};
  var hasInv = hasInverse(cfg);
  var hasAsym = !!cfg.asymptotes;
  var hasFn = cfg.curves.some(function(c){ return c.kind === 'fn'; });
  var el = document.createElement('section');
  el.className = 'card';
  el.id = 'card-' + cfg.id;
  el.dataset.stage = cfg.stage;

  var toolbar = '';
  if (hasInv) toolbar += '<button class="btn" type="button" data-act="trace">▶ 追踪演示</button>';
  if (hasInv) toolbar += '<button class="btn" type="button" data-act="mirror">↻ 镜像动画</button>';
  if (hasFn) toolbar += '<button class="btn" type="button" data-act="parity">◎ 奇偶演示</button>';
  if (hasInv) toolbar += '<button class="btn toggle on" type="button" data-act="yx">y = x</button>';
  if (hasAsym) toolbar += '<button class="btn toggle on" type="button" data-act="asym">渐近线</button>';
  toolbar += '<button class="btn" type="button" data-act="reset">复位</button>';
  toolbar += '<span class="plot-hint">点击图像可添加图钉评论</span>';

  var legend = '';
  cfg.curves.forEach(function(c){
    if (c.kind === 'fn') {
      legend += legendRow(c.color, c.label);
      if (c.inverse) legend += legendRow('inv', c.inverse.label);
    } else {
      legend += legendRow(c.color, c.label);
    }
  });

  var props = Object.assign({}, cfg.props, extra.props || {});
  var noteHtml = (cfg.note || '') + (extra.note || '');

  var dl = PROP_LABELS.map(function(p){
    return '<dt>' + esc(p[1]) + '</dt><dd>' + (props[p[0]] || '—') + '</dd>';
  }).join('');

  var examData = getExam(cfg);
  var exam = [
    ['points', '高频考点', examData.points, 'points'],
    ['pitfalls', '易错提醒', examData.pitfalls, 'pitfalls'],
    ['examples', '典型例题', examData.examples, 'examples']
  ].map(function(col){
    var lis = col[2].map(function(t){ return liFor(t, col[3]); }).join('');
    return '<div class="exam-col ' + col[0] + '"><h5>' + esc(col[1]) + '</h5><ul>' + lis + '</ul></div>';
  }).join('');

  var notesHtml =
    '<div class="card-notes">' +
      '<h4>💬 我的评论</h4>' +
      '<div class="note-input">' +
        '<textarea placeholder="给这一节写点笔记或评论（保存在本机浏览器）"></textarea>' +
        '<button class="btn" type="button" data-act="add-note">添加评论</button>' +
      '</div>' +
      '<ul class="note-list"></ul>' +
    '</div>';

  el.innerHTML =
    '<div class="card-head">' +
      '<div>' +
        '<h3>' + esc(cfg.name) + ' <span class="en">' + esc(cfg.en) + '</span></h3>' +
        '<p class="formula"></p>' +
        (cfg.tagline ? '<p class="tagline">' + esc(cfg.tagline) + '</p>' : '') +
      '</div>' +
      '<span class="stage-tag">' + stageName(cfg.stage) + '</span>' +
    '</div>' +
    '<div class="card-body">' +
      '<div class="plot-wrap">' +
        '<div class="plot-toolbar">' + toolbar + '</div>' +
        '<canvas></canvas>' +
        '<div class="legend">' + legend + '</div>' +
        '<div class="tooltip" hidden></div>' +
        '<div class="pin-editor" hidden>' +
          '<div class="pin-pos"></div>' +
          '<textarea placeholder="写评论…"></textarea>' +
          '<div class="pin-btns">' +
            '<button class="btn" type="button" data-pin="save">保存</button>' +
            '<button class="btn danger" type="button" data-pin="del">删除</button>' +
            '<button class="btn" type="button" data-pin="cancel">取消</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="info">' +
        '<div class="sliders"></div>' +
        '<div class="props"><h4>📋 函数档案</h4><dl>' + dl + '</dl></div>' +
        (noteHtml ? '<div class="note">' + noteHtml + '</div>' : '') +
      '</div>' +
    '</div>' +
    '<div class="exam"><h4>🎯 考研专区</h4><div class="exam-grid">' + exam + '</div></div>' +
    notesHtml;

  return el;
}

function getExam(cfg){
  var extra = CARD_EXTRA[cfg.id] || {};
  var e = cfg.exam || {};
  return {
    points: extra.points || e.points || [],
    pitfalls: e.pitfalls || [],
    examples: extra.examples || e.examples || []
  };
}

function liFor(item, type){
  if (typeof item === 'string') return '<li>' + item + '</li>';
  if (type === 'points') {
    return '<li><details class="exam-detail"><summary>' + item.t + '</summary><p>' + item.d + '</p></details></li>';
  }
  return '<li><details class="exam-detail"><summary>' + item.q + '</summary><p class="ans">答案讲解：' + item.a + '</p></details></li>';
}

function legendRow(color, label){
  var col = cssVar(color === 'inv' ? '--inv' : '--primary');
  return '<div class="legend-row"><span class="legend-dot" style="background:' + col + '"></span><span>' + esc(label) + '</span></div>';
}

/* ==================== 画布初始化 ==================== */

function initCard(cfg, el){
  var canvas = $('canvas', el);
  canvas.dataset.cid = cfg.id;
  var ctx = canvas.getContext('2d');
  var cs = {
    cfg: cfg,
    el: el,
    canvas: canvas,
    ctx: ctx,
    view: { xMin: cfg.view.xMin, xMax: cfg.view.xMax, yMin: cfg.view.yMin, yMax: cfg.view.yMax },
    params: {},
    toggles: { yx: true, asym: true },
    anim: null,
    raf: 0,
    traceT: 0,
    hover: null,
    drag: null,
    pinDown: null,
    selectedPin: -1,
    rng: window.mulberry32 ? mulberry32(cfg.id.length * 7919 + 7) : Math.random
  };
  cfg.params.forEach(function(p){ cs.params[p.key] = p.def; });
  state.cards[cfg.id] = cs;

  buildSliders(cs);
  updateFormula(cs);

  function size(){
    var r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw(cs);
  }
  size();
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(size);
    ro.observe(canvas);
    cs.ro = ro;
  }

  canvas.addEventListener('mousemove', function(e){ onHover(cs, e); });
  canvas.addEventListener('mouseleave', function(){
    cs.hover = null;
    hideTooltip(cs);
    redraw(cs);
  });
  canvas.addEventListener('wheel', function(e){
    e.preventDefault();
    zoomAt(cs, e);
  }, { passive: false });
  canvas.addEventListener('pointerdown', function(e){
    cs.drag = { x: e.clientX, y: e.clientY, view: { xMin: cs.view.xMin, xMax: cs.view.xMax, yMin: cs.view.yMin, yMax: cs.view.yMax } };
    cs.pinDown = { x: e.clientX, y: e.clientY };
    try { canvas.setPointerCapture(e.pointerId); } catch(err){}
  });
  canvas.addEventListener('pointermove', function(e){
    if (cs.drag) {
      var r = canvas.getBoundingClientRect();
      if (!r.width) return;
      var dx = (e.clientX - cs.drag.x) / r.width * (cs.drag.view.xMax - cs.drag.view.xMin);
      var dy = (e.clientY - cs.drag.y) / r.height * (cs.drag.view.yMax - cs.drag.view.yMin);
      cs.view.xMin = cs.drag.view.xMin - dx;
      cs.view.xMax = cs.drag.view.xMax - dx;
      cs.view.yMin = cs.drag.view.yMin + dy;
      cs.view.yMax = cs.drag.view.yMax + dy;
      redraw(cs);
    }
  });
  canvas.addEventListener('pointerup', function(e){
    cs.drag = null;
    var moved = cs.pinDown ? (Math.abs(e.clientX - cs.pinDown.x) + Math.abs(e.clientY - cs.pinDown.y)) : 99;
    cs.pinDown = null;
    if (moved > 6) return;
    onCanvasClick(cs, e);
  });
  canvas.addEventListener('pointercancel', function(){ cs.drag = null; });

  $$('.plot-toolbar .btn', el).forEach(function(btn){
    btn.addEventListener('click', function(){ onTool(cs, btn); });
  });
  $$('.pin-editor .btn', el).forEach(function(btn){
    btn.addEventListener('click', function(){ onPinBtn(cs, btn.dataset.pin); });
  });
  var addNoteBtn = $('[data-act="add-note"]', el);
  if (addNoteBtn) addNoteBtn.addEventListener('click', function(){ addNote(cs); });
  renderNotes(cs);

  return cs;
}

/* ==================== 图钉评论 ==================== */

function onCanvasClick(cs, e){
  var r = cs.canvas.getBoundingClientRect();
  if (!r.width) return;
  var px = e.clientX - r.left, py = e.clientY - r.top;
  var hit = findPin(cs, px, py);
  if (hit >= 0) {
    openPinEditor(cs, hit);
  } else {
    var wx = cs.view.xMin + px / r.width * (cs.view.xMax - cs.view.xMin);
    var wy = cs.view.yMax - py / r.height * (cs.view.yMax - cs.view.yMin);
    addPin(cs, wx, wy);
  }
}

function findPin(cs, px, py){
  var data = cardComments(cs.cfg.id);
  var r = cs.canvas.getBoundingClientRect();
  if (!r.width) return -1;
  var x2s = function(x){ return (x - cs.view.xMin) / (cs.view.xMax - cs.view.xMin) * r.width; };
  var y2s = function(y){ return r.height - (y - cs.view.yMin) / (cs.view.yMax - cs.view.yMin) * r.height; };
  for (var i = 0; i < data.pins.length; i++) {
    var p = data.pins[i];
    var sx = x2s(p.x), sy = y2s(p.y) - 16;
    if (Math.abs(sx - px) < 15 && Math.abs(sy - py) < 18) return i;
  }
  return -1;
}

function addPin(cs, x, y){
  var data = cardComments(cs.cfg.id);
  data.pins.push({ x: x, y: y, text: '', t: Date.now() });
  cs.selectedPin = data.pins.length - 1;
  saveComments();
  redraw(cs);
  openPinEditor(cs, cs.selectedPin);
}

function openPinEditor(cs, idx){
  cs.selectedPin = idx;
  var data = cardComments(cs.cfg.id);
  var pin = data.pins[idx];
  if (!pin) return;
  var ed = $('.pin-editor', cs.el);
  $('.pin-pos', ed).textContent = '📌 坐标 (' + fmtNum(pin.x, 2) + ', ' + fmtNum(pin.y, 2) + ')';
  var ta = $('textarea', ed);
  ta.value = pin.text || '';
  ed.hidden = false;
  ta.focus();
  redraw(cs);
}

function closePinEditor(cs){
  cs.selectedPin = -1;
  var ed = $('.pin-editor', cs.el);
  if (ed) ed.hidden = true;
  saveComments();
  redraw(cs);
}

function onPinBtn(cs, act){
  var data = cardComments(cs.cfg.id);
  var ed = $('.pin-editor', cs.el);
  var ta = $('textarea', ed);
  if (act === 'save') {
    var pin = data.pins[cs.selectedPin];
    if (pin) {
      pin.text = ta.value.trim();
      closePinEditor(cs);
    }
  } else if (act === 'del') {
    if (cs.selectedPin >= 0 && cs.selectedPin < data.pins.length) {
      data.pins.splice(cs.selectedPin, 1);
    }
    closePinEditor(cs);
  } else {
    if (cs.selectedPin >= 0 && cs.selectedPin < data.pins.length) {
      var p = data.pins[cs.selectedPin];
      if (p && !p.text) data.pins.splice(cs.selectedPin, 1);
    }
    closePinEditor(cs);
  }
}

/* ==================== 卡片评论 ==================== */

function renderNotes(cs){
  var ul = $('.note-list', cs.el);
  if (!ul) return;
  var data = cardComments(cs.cfg.id);
  ul.innerHTML = '';
  if (!data.notes.length) {
    ul.innerHTML = '<li class="note-empty">还没有评论，写一条吧～</li>';
    return;
  }
  data.notes.forEach(function(n, i){
    var li = document.createElement('li');
    li.className = 'note-item';
    var time = new Date(n.t).toLocaleString('zh-CN', { hour12: false });
    li.innerHTML = '<span class="note-text">' + esc(n.text) + '</span>' +
      '<span class="note-time">' + esc(time) + '</span>' +
      '<button class="btn mini danger" type="button" data-idx="' + i + '">删除</button>';
    ul.appendChild(li);
  });
  $$('button[data-idx]', ul).forEach(function(b){
    b.addEventListener('click', function(){
      var d = cardComments(cs.cfg.id);
      d.notes.splice(Number(b.dataset.idx), 1);
      saveComments();
      renderNotes(cs);
    });
  });
}

function addNote(cs){
  var ta = $('.note-input textarea', cs.el);
  if (!ta) return;
  var text = ta.value.trim();
  if (!text) return;
  cardComments(cs.cfg.id).notes.push({ text: text, t: Date.now() });
  ta.value = '';
  saveComments();
  renderNotes(cs);
}

function buildSliders(cs){
  var wrap = $('.sliders', cs.el);
  if (!cs.cfg.params.length) {
    wrap.innerHTML = '<div class="slider-row" style="grid-template-columns:1fr"><label>无参数（固定函数）</label></div>';
    return;
  }
  wrap.innerHTML = '';
  cs.cfg.params.forEach(function(p){
    var row = document.createElement('div');
    row.className = 'slider-row';
    if (p.type === 'select') {
      var opts = p.options.map(function(o){
        return '<option value="' + esc(o.value) + '"' + (o.value === p.def ? ' selected' : '') + '>' + esc(o.label) + '</option>';
      }).join('');
      row.innerHTML = '<label>' + esc(p.label) + '</label><select>' + opts + '</select><span class="val"></span>';
      var sel = $('select', row);
      var val = $('.val', row);
      val.textContent = p.options.filter(function(o){ return o.value === p.def; })[0].label;
      sel.addEventListener('change', function(){
        cs.params[p.key] = sel.value;
        var o = p.options.filter(function(x){ return x.value === sel.value; })[0];
        if (o) val.textContent = o.label;
        updateFormula(cs);
        redraw(cs);
      });
    } else {
      row.innerHTML = '<label title="' + esc(p.note || '') + '">' + esc(p.label) + '</label>' +
        '<input type="range" id="sl-' + p.key + '" min="' + p.min + '" max="' + p.max + '" step="' + p.step + '" value="' + p.def + '">' +
        '<span class="val"></span>';
      var inp = $('input', row);
      var v = $('.val', row);
      v.textContent = fmtNum(Number(p.def), 2);
      inp.addEventListener('input', function(){
        cs.params[p.key] = parseFloat(inp.value);
        v.textContent = fmtNum(cs.params[p.key], 2);
        updateFormula(cs);
        redraw(cs);
      });
    }
    wrap.appendChild(row);
  });
}

function updateFormula(cs){
  var f = $('.formula', cs.el);
  if (!f) return;
  f.innerHTML = cs.cfg.formulaFn ? cs.cfg.formulaFn(cs.params) : cs.cfg.formula;
}

/* ==================== 绘制引擎 ==================== */

function redraw(cs){
  var canvas = cs.canvas, ctx = cs.ctx;
  var dpr = window.devicePixelRatio || 1;
  var W = canvas.width / dpr, H = canvas.height / dpr;
  if (!W || !H) return;
  var C = colors();
  var view = cs.view;
  var x2s = function(x){ return (x - view.xMin) / (view.xMax - view.xMin) * W; };
  var y2s = function(y){ return H - (y - view.yMin) / (view.yMax - view.yMin) * H; };

  ctx.clearRect(0, 0, W, H);
  drawGrid(ctx, cs, W, H, x2s, y2s, C);
  drawAxes(ctx, cs, W, H, x2s, y2s, C);
  if (cs.toggles.asym && cs.cfg.asymptotes) drawAsymptotes(ctx, cs, x2s, y2s, C);
  if (cs.toggles.yx && hasInverse(cs.cfg)) drawYx(ctx, cs, W, H, x2s, y2s, C);

  cs.cfg.curves.forEach(function(c){
    if (c.kind === 'fn') drawFn(ctx, cs, c, x2s, y2s, C);
    else if (c.kind === 'segments') drawSegments(ctx, cs, c, x2s, y2s, C);
    else if (c.kind === 'dirichlet') drawDirichlet(ctx, cs, W, H, x2s, y2s, C);
    else if (c.kind === 'riemann') drawRiemann(ctx, cs, W, H, x2s, y2s, C);
  });

  if (cs.hover) drawHoverMarkers(ctx, cs, x2s, y2s, C);
  drawPins(ctx, cs, x2s, y2s, C);
}

function drawPins(ctx, cs, x2s, y2s, C){
  var data = cardComments(cs.cfg.id);
  data.pins.forEach(function(p, i){
    var sx = x2s(p.x), sy = y2s(p.y) - 16;
    var sel = (i === cs.selectedPin);
    ctx.lineWidth = 2;
    ctx.strokeStyle = sel ? C.primary : C.muted;
    ctx.beginPath();
    ctx.moveTo(sx, sy + 14);
    ctx.lineTo(sx, sy + 5);
    ctx.stroke();
    ctx.fillStyle = sel ? C.primary : C.muted;
    ctx.beginPath();
    ctx.arc(sx, sy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = C.card;
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.fillStyle = C.card;
    ctx.font = 'bold 9px ' + FONT;
    ctx.textAlign = 'center';
    ctx.fillText(String(i + 1), sx, sy + 3);
    ctx.textAlign = 'start';
    if (p.text) {
      ctx.fillStyle = C.muted;
      ctx.font = '10px ' + FONT;
      var label = p.text.length > 10 ? p.text.slice(0, 10) + '…' : p.text;
      ctx.fillText(label, sx + 9, sy + 4);
    }
  });
}

function hasInverse(cfg){
  return !!cfg.inversePair || cfg.curves.some(function(c){ return c.kind === 'fn' && c.inverse; });
}

function drawGrid(ctx, cs, W, H, x2s, y2s, C){
  var view = cs.view;
  ctx.strokeStyle = C.grid;
  ctx.lineWidth = 1;
  var xStep = niceStep((view.xMax - view.xMin) / 6);
  var x0 = Math.ceil(view.xMin / xStep) * xStep;
  ctx.font = '10.5px ' + FONT;
  ctx.fillStyle = C.muted;
  for (var x = x0; x <= view.xMax + 1e-9; x += xStep) {
    ctx.beginPath();
    ctx.moveTo(x2s(x), 0);
    ctx.lineTo(x2s(x), H);
    ctx.stroke();
    var lx = fmtNum(x, 2);
    if (Math.abs(x) > xStep / 20) {
      ctx.fillText(lx, x2s(x) + 3, H - 5);
    }
  }
  var yStep = niceStep((view.yMax - view.yMin) / 6);
  var y0 = Math.ceil(view.yMin / yStep) * yStep;
  for (var y = y0; y <= view.yMax + 1e-9; y += yStep) {
    ctx.beginPath();
    ctx.moveTo(0, y2s(y));
    ctx.lineTo(W, y2s(y));
    ctx.stroke();
    var ly = fmtNum(y, 2);
    ctx.fillText(ly, 4, y2s(y) - 4);
  }
}

function drawAxes(ctx, cs, W, H, x2s, y2s, C){
  var view = cs.view;
  ctx.strokeStyle = C.axis;
  ctx.lineWidth = 1.6;
  ctx.font = '12px ' + FONT;
  ctx.fillStyle = C.axis;
  if (view.yMin < 0 && view.yMax > 0) {
    ctx.beginPath();
    ctx.moveTo(0, y2s(0));
    ctx.lineTo(W, y2s(0));
    ctx.stroke();
    ctx.fillText('x', W - 14, y2s(0) - 6);
  }
  if (view.xMin < 0 && view.xMax > 0) {
    ctx.beginPath();
    ctx.moveTo(x2s(0), 0);
    ctx.lineTo(x2s(0), H);
    ctx.stroke();
    ctx.fillText('y', x2s(0) + 6, 14);
  }
}

function drawYx(ctx, cs, W, H, x2s, y2s, C){
  var view = cs.view;
  var t0 = Math.max(view.xMin, view.yMin);
  var t1 = Math.min(view.xMax, view.yMax);
  if (t0 >= t1) return;
  ctx.strokeStyle = C.muted;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(x2s(t0), y2s(t0));
  ctx.lineTo(x2s(t1), y2s(t1));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.font = '11px ' + FONT;
  ctx.fillStyle = C.muted;
  ctx.fillText('y = x', x2s(t1) - 52, y2s(t1) - 8);
}

function drawAsymptotes(ctx, cs, x2s, y2s, C){
  var cfg = cs.cfg;
  var asym = typeof cfg.asymptotes === 'function' ? cfg.asymptotes(cs.view, cs.params) : cfg.asymptotes;
  if (!asym) return;
  ctx.strokeStyle = C.axis;
  ctx.lineWidth = 1.1;
  ctx.setLineDash([5, 4]);
  ctx.font = '11px ' + FONT;
  ctx.fillStyle = C.muted;
  (asym.v || []).forEach(function(v){
    ctx.beginPath();
    ctx.moveTo(x2s(v), 0);
    ctx.lineTo(x2s(v), cs.canvas.height / (window.devicePixelRatio || 1));
    ctx.stroke();
    ctx.fillText('x = ' + fmtNum(v, 2), x2s(v) + 4, 14);
  });
  (asym.h || []).forEach(function(h){
    ctx.beginPath();
    ctx.moveTo(0, y2s(h));
    ctx.lineTo(cs.canvas.width / (window.devicePixelRatio || 1), y2s(h));
    ctx.stroke();
    ctx.fillText('y = ' + fmtNum(h, 2), 6, y2s(h) - 5);
  });
  ctx.setLineDash([]);
}

function sampleCurve(f, view, params){
  var n = Math.max(500, Math.round((view.xMax - view.xMin) * 90));
  var dx = (view.xMax - view.xMin) / n;
  var pts = [];
  var prev = null;
  var range = view.yMax - view.yMin;
  for (var i = 0; i <= n; i++) {
    var x = view.xMin + i * dx;
    var y;
    try { y = f(x, params); } catch(e){ y = NaN; }
    if (y === null || y === undefined) y = NaN;
    var valid = Number.isFinite(y);
    if (valid && Math.abs(y) > range * 60) valid = false;
    if (valid) {
      var jump = prev && Math.abs(y - prev.y) > range * 1.8;
      pts.push({ x: x, y: y, break: !!jump, end: false });
      prev = { x: x, y: y };
    } else {
      prev = null;
      if (pts.length && !pts[pts.length - 1].end) pts[pts.length - 1].end = true;
    }
  }
  return pts;
}

function strokePoly(ctx, pts, x2s, y2s, color, width){
  ctx.strokeStyle = color;
  ctx.lineWidth = width || 2.2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  var started = false;
  for (var i = 0; i < pts.length; i++) {
    var p = pts[i];
    if (p.break || p.end) {
      if (started) ctx.stroke();
      ctx.beginPath();
      started = false;
      continue;
    }
    var sx = x2s(p.x), sy = y2s(p.y);
    if (!started) { ctx.moveTo(sx, sy); started = true; }
    else ctx.lineTo(sx, sy);
  }
  if (started) ctx.stroke();
}

function drawFn(ctx, cs, curve, x2s, y2s, C){
  var pts = sampleCurve(curve.f, cs.view, cs.params);
  strokePoly(ctx, pts, x2s, y2s, curve.color === 'inv' ? C.inv : C.primary);
  if (curve.inverse) {
    var ip = sampleCurve(curve.inverse.f, cs.view, cs.params);
    strokePoly(ctx, ip, x2s, y2s, C.inv);
  }
}

function drawSegments(ctx, cs, curve, x2s, y2s, C){
  var segs = typeof curve.segments === 'function' ? curve.segments(cs.view, cs.params) : curve.segments;
  var color = curve.color === 'inv' ? C.inv : C.primary;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.2;
  segs.forEach(function(s){
    if (s.point) {
      ctx.beginPath();
      ctx.arc(x2s(s.x0), y2s(s.y), 4, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    ctx.beginPath();
    ctx.moveTo(x2s(s.x0), y2s(s.y));
    ctx.lineTo(x2s(s.x1), y2s(s.y));
    ctx.stroke();
    var r = 3.6;
    function circle(sx, sy, closed){
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      if (closed) ctx.fill();
      else ctx.stroke();
    }
    circle(x2s(s.x0), y2s(s.y), !s.openStart);
    circle(x2s(s.x1), y2s(s.y), !s.openEnd);
  });
}

function drawDirichlet(ctx, cs, W, H, x2s, y2s, C){
  ctx.font = '11px ' + FONT;
  ctx.strokeStyle = C.inv;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(0, y2s(1));
  ctx.lineTo(W, y2s(1));
  ctx.stroke();
  ctx.strokeStyle = C.primary;
  ctx.beginPath();
  ctx.moveTo(0, y2s(0));
  ctx.lineTo(W, y2s(0));
  ctx.stroke();
  ctx.setLineDash([]);

  var i = 0;
  ctx.fillStyle = C.inv;
  for (var q = 1; q <= 16; q++) {
    var k0 = Math.ceil(cs.view.xMin * q), k1 = Math.floor(cs.view.xMax * q);
    for (var k = k0; k <= k1; k++) {
      if (i++ % 5 !== 0) continue;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(x2s(k / q), y2s(1), 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = C.primary;
  ctx.globalAlpha = 0.32;
  for (var j = 0; j < 420; j++) {
    var x = cs.view.xMin + (cs.view.xMax - cs.view.xMin) * cs.rng();
    ctx.beginPath();
    ctx.arc(x2s(x), y2s(0), 1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = C.muted;
  ctx.fillText('D = 0（无理数）', x2s(cs.view.xMin) + 6, y2s(0) + 14);
  ctx.fillText('D = 1（有理数）', x2s(cs.view.xMin) + 6, y2s(1) - 6);
  drawOverlay(ctx, W, H, ['处处不连续 · 无法真实绘制', '任意小区间内同时存在取 0 与取 1 的点'], C);
}

function drawRiemann(ctx, cs, W, H, x2s, y2s, C){
  ctx.fillStyle = C.primary;
  for (var q = 1; q <= 12; q++) {
    var k0 = Math.ceil(cs.view.xMin * q), k1 = Math.floor(cs.view.xMax * q);
    for (var k = k0; k <= k1; k++) {
      if (k === 0) continue;
      if (gcdInt(k, q) !== 1) continue;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(x2s(k / q), y2s(1 / q), 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = C.axis;
  ctx.globalAlpha = 0.25;
  for (var j = 0; j < 300; j++) {
    var x = cs.view.xMin + (cs.view.xMax - cs.view.xMin) * cs.rng();
    ctx.beginPath();
    ctx.arc(x2s(x), y2s((cs.rng() - 0.5) * 0.03), 1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.font = '11px ' + FONT;
  ctx.fillStyle = C.muted;
  ctx.fillText('R(p/q) = 1/q（有理点取样）', x2s(cs.view.xMin) + 6, y2s(1) - 8);
  ctx.fillText('R(x) = 0（无理点）', x2s(cs.view.xMin) + 6, y2s(0.03) + 12);
  drawOverlay(ctx, W, H, ['有理数处不连续 · 无理数处连续', '黎曼可积，且 ∫₀¹ R(x)dx = 0'], C);
}

function drawOverlay(ctx, W, H, lines, C){
  ctx.font = '600 13px ' + FONT;
  ctx.textAlign = 'center';
  var lw = 0;
  lines.forEach(function(l){ lw = Math.max(lw, ctx.measureText(l).width); });
  var bw = lw + 28, bh = lines.length * 20 + 18;
  var bx = (W - bw) / 2, by = (H - bh) / 2;
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = C.card;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(bx, by, bw, bh, 10) : ctx.rect(bx, by, bw, bh);
  ctx.fill();
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = C.text;
  lines.forEach(function(l, i){
    ctx.fillText(l, W / 2, by + 24 + i * 20);
  });
  ctx.textAlign = 'start';
}

/* ==================== 缩放 / 平移 / 复位 ==================== */

function zoomAt(cs, e){
  var r = cs.canvas.getBoundingClientRect();
  if (!r.width) return;
  var mx = cs.view.xMin + (e.clientX - r.left) / r.width * (cs.view.xMax - cs.view.xMin);
  var my = cs.view.yMax - (e.clientY - r.top) / r.height * (cs.view.yMax - cs.view.yMin);
  var f = e.deltaY > 0 ? 1.16 : 1 / 1.16;
  var xr = (cs.view.xMax - cs.view.xMin) * f / 2;
  var yr = (cs.view.yMax - cs.view.yMin) * f / 2;
  if (xr < 0.001 || yr < 0.001) return;
  cs.view.xMin = mx - xr; cs.view.xMax = mx + xr;
  cs.view.yMin = my - yr; cs.view.yMax = my + yr;
  redraw(cs);
}

function resetCard(cs){
  stopAnim(cs);
  cs.cfg.params.forEach(function(p){
    cs.params[p.key] = p.def;
  });
  cs.view = { xMin: cs.cfg.view.xMin, xMax: cs.cfg.view.xMax, yMin: cs.cfg.view.yMin, yMax: cs.cfg.view.yMax };
  cs.toggles.yx = true;
  cs.toggles.asym = true;
  $$('.plot-toolbar .btn', cs.el).forEach(function(b){
    if (b.dataset.act === 'yx' || b.dataset.act === 'asym') b.classList.add('on');
    b.classList.remove('playing');
  });
  $$('.slider-row', cs.el).forEach(function(row){
    var inp = $('input[type=range]', row);
    var sel = $('select', row);
    var val = $('.val', row);
    if (inp && val) {
      var p = cs.cfg.params.filter(function(x){ return x.key === inp.id.replace('sl-', ''); })[0];
      if (p) { inp.value = p.def; val.textContent = fmtNum(Number(p.def), 2); }
    }
    if (sel && val) {
      var p2 = cs.cfg.params.filter(function(x){ return x.type === 'select'; })[0];
      if (p2) {
        sel.value = p2.def;
        var o = p2.options.filter(function(x){ return x.value === p2.def; })[0];
        if (o) val.textContent = o.label;
      }
    }
  });
  updateFormula(cs);
  redraw(cs);
}

/* ==================== 悬停读数 ==================== */

function onHover(cs, e){
  var r = cs.canvas.getBoundingClientRect();
  if (!r.width || !r.height) return;
  var wx = cs.view.xMin + (e.clientX - r.left) / r.width * (cs.view.xMax - cs.view.xMin);
  var wy = cs.view.yMax - (e.clientY - r.top) / r.height * (cs.view.yMax - cs.view.yMin);
  cs.hover = findHit(cs, wx, wy, r.width, r.height);
  redraw(cs);
  if (cs.hover) showTooltip(cs, cs.hover, e, r);
  else hideTooltip(cs);
}

function findHit(cs, wx, wy, W, H){
  var view = cs.view;
  var sxw = function(x){ return (x - view.xMin) / (view.xMax - view.xMin) * W; };
  var syw = function(y){ return H - (y - view.yMin) / (view.yMax - view.yMin) * H; };
  var best = null, bestD = Infinity;
  cs.cfg.curves.forEach(function(c){
    if (c.kind === 'fn') {
      var cands = [{ c: c, f: c.f, isInv: false }];
      if (c.inverse) cands.push({ c: c, f: c.inverse.f, isInv: true });
      cands.forEach(function(cd){
        var n = 800;
        var dx = (view.xMax - view.xMin) / n;
        var i0 = Math.round((wx - view.xMin) / dx);
        for (var di = -1; di <= 1; di++) {
          var ii = i0 + di;
          if (ii < 0 || ii > n) continue;
          var x = view.xMin + ii * dx;
          var y;
          try { y = cd.f(x, cs.params); } catch(err){ y = NaN; }
          if (!Number.isFinite(y)) continue;
          var d = Math.pow(sxw(x) - sxw(wx), 2) + Math.pow(syw(y) - syw(wy), 2);
          if (d < bestD) {
            bestD = d;
            best = { kind: 'fn', curve: c, isInv: cd.isInv, x: x, y: y };
          }
        }
      });
    } else if (c.kind === 'segments') {
      var segs = typeof c.segments === 'function' ? c.segments(view, cs.params) : c.segments;
      segs.forEach(function(s){
        if (s.point) return;
        if (wx >= s.x0 && wx <= s.x1) {
          var d = Math.pow(syw(s.y) - syw(wy), 2);
          if (d < bestD) { bestD = d; best = { kind: 'seg', y: s.y }; }
        }
      });
    }
  });
  if (!best) {
    var special = cs.cfg.curves.filter(function(c){ return c.kind === 'dirichlet' || c.kind === 'riemann'; })[0];
    if (special) {
      best = {
        kind: 'special',
        text: special.kind === 'dirichlet'
          ? 'D(x)：x 为有理数 → 1；x 为无理数 → 0。处处不连续。'
          : 'R(x)：无理数 → 0；最简有理数 p/q → 1/q。无理点连续、有理点不连续。'
      };
    }
  } else if (bestD > 2500) {
    best = null;
  }
  return best;
}

function showTooltip(cs, hit, e, r){
  var tip = $('.tooltip', cs.el);
  if (hit.kind === 'special') {
    tip.innerHTML = '<div>' + hit.text + '</div>';
  } else if (hit.kind === 'seg') {
    tip.innerHTML = '<div><b>x</b> 位于本段内</div><div><b>y</b> = ' + fmtNum(hit.y, 3) + '</div>';
  } else {
    var c = hit.curve;
    var dfn = hit.isInv ? (c.inverse ? c.inverse.df : null) : c.df;
    var slope = '—';
    if (dfn) {
      try {
        var v = dfn(hit.x, cs.params);
        slope = Number.isFinite(v) ? fmtNum(v, 3) : '∞（不存在）';
      } catch(err){ slope = '—'; }
    }
    var html = '<div><b>x</b> = ' + fmtNum(hit.x, 3) + '</div>' +
      '<div><b>y</b> = ' + fmtNum(hit.y, 3) + '</div>';
    if (hit.isInv) {
      html += '<div>反函数斜率 f⁻¹′(x) = ' + slope + '</div>' +
        '<div class="t-orange">对应原函数点 (' + fmtNum(hit.y, 3) + ', ' + fmtNum(hit.x, 3) + ')</div>';
    } else {
      html += '<div>斜率 f′(x) = ' + slope + '</div>';
      if (c.inverse) html += '<div class="t-orange">反函数点 (' + fmtNum(hit.y, 3) + ', ' + fmtNum(hit.x, 3) + ')</div>';
    }
    tip.innerHTML = html;
  }
  tip.hidden = false;
  var left = e.clientX - r.left + 14;
  var top = e.clientY - r.top - 10;
  var tw = tip.offsetWidth;
  if (left + tw > r.width - 8) left = r.width - tw - 8;
  if (left < 4) left = 4;
  if (top < 4) top = 4;
  tip.style.left = left + 'px';
  tip.style.top = top + 'px';
}

function hideTooltip(cs){
  var tip = $('.tooltip', cs.el);
  if (tip) tip.hidden = true;
}

function drawHoverMarkers(ctx, cs, x2s, y2s, C){
  var h = cs.hover;
  if (!h) return;
  function dot(sx, sy, color){
    ctx.beginPath();
    ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = C.card;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  if (h.kind === 'fn') {
    var col = h.isInv ? C.inv : C.primary;
    dot(x2s(h.x), y2s(h.y), col);
    if (h.curve.inverse && !h.isInv) {
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = C.muted;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x2s(h.x), y2s(h.y));
      ctx.lineTo(x2s(h.y), y2s(h.x));
      ctx.stroke();
      ctx.setLineDash([]);
      dot(x2s(h.y), y2s(h.x), C.inv);
    }
    if (h.isInv && h.curve.inverse) {
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = C.muted;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x2s(h.x), y2s(h.y));
      ctx.lineTo(x2s(h.y), y2s(h.x));
      ctx.stroke();
      ctx.setLineDash([]);
      dot(x2s(h.y), y2s(h.x), C.primary);
    }
  }
}

/* ==================== 动画：追踪与镜像 ==================== */

function stopAnim(cs){
  if (cs.raf) cancelAnimationFrame(cs.raf);
  cs.anim = null;
  cs.raf = 0;
  $$('.plot-toolbar .btn', cs.el).forEach(function(b){ b.classList.remove('playing'); });
}

function startTrace(cs, btn){
  if (cs.anim === 'trace') { stopAnim(cs); redraw(cs); return; }
  var c = cs.cfg.curves.filter(function(x){ return x.kind === 'fn'; })[0];
  if (!c) return;
  stopAnim(cs);
  cs.anim = 'trace';
  btn.classList.add('playing');
  cs.traceT = cs.view.xMin;
  var last = performance.now();
  var dpr = window.devicePixelRatio || 1;
  var W = cs.canvas.width / dpr, H = cs.canvas.height / dpr;
  var view = cs.view;
  var x2s = function(x){ return (x - view.xMin) / (view.xMax - view.xMin) * W; };
  var y2s = function(y){ return H - (y - view.yMin) / (view.yMax - view.yMin) * H; };
  function loop(now){
    if (cs.anim !== 'trace') return;
    var dt = Math.min(100, now - last);
    last = now;
    cs.traceT += (view.xMax - view.xMin) / 6000 * dt;
    redraw(cs);
    drawTrace(cs, c, x2s, y2s);
    if (cs.traceT < view.xMax) {
      cs.raf = requestAnimationFrame(loop);
    } else {
      cs.anim = null;
      btn.classList.remove('playing');
      redraw(cs);
    }
  }
  cs.raf = requestAnimationFrame(loop);
}

function drawTrace(cs, curve, x2s, y2s){
  var x = cs.traceT;
  var y;
  try { y = curve.f(x, cs.params); } catch(e){ y = NaN; }
  if (!Number.isFinite(y)) return;
  var C = colors();
  var ctx = cs.ctx;
  function dot(sx, sy, col){
    ctx.beginPath();
    ctx.arc(sx, sy, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
    ctx.strokeStyle = C.card;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = C.muted;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x2s(x), y2s(y));
  ctx.lineTo(x2s(y), y2s(x));
  ctx.stroke();
  ctx.setLineDash([]);
  dot(x2s(x), y2s(y), C.primary);
  dot(x2s(y), y2s(x), C.inv);
}

function startMirror(cs, btn){
  if (cs.anim === 'mirror') { stopAnim(cs); redraw(cs); return; }
  var c = cs.cfg.curves.filter(function(x){ return x.kind === 'fn'; })[0];
  if (!c) return;
  stopAnim(cs);
  cs.anim = 'mirror';
  btn.classList.add('playing');
  var pts = sampleCurve(c.f, cs.view, cs.params);
  var inv = pts.map(function(p){ return { x: p.y, y: p.x, break: p.break, end: p.end }; });
  var N = 72;
  var k = 0;
  function ease(t){ return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function loop(){
    if (cs.anim !== 'mirror') return;
    var t = ease(k / N);
    redraw(cs);
    drawMorph(cs, pts, inv, t);
    if (k < N) {
      k++;
      cs.raf = requestAnimationFrame(loop);
    } else {
      cs.anim = null;
      btn.classList.remove('playing');
      redraw(cs);
    }
  }
  cs.raf = requestAnimationFrame(loop);
}

function drawMorph(cs, pts, inv, t){
  var ctx = cs.ctx;
  var dpr = window.devicePixelRatio || 1;
  var W = cs.canvas.width / dpr, H = cs.canvas.height / dpr;
  var view = cs.view;
  var x2s = function(x){ return (x - view.xMin) / (view.xMax - view.xMin) * W; };
  var y2s = function(y){ return H - (y - view.yMin) / (view.yMax - view.yMin) * H; };
  var C = colors();
  ctx.strokeStyle = C.accent;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  var started = false;
  for (var i = 0; i < pts.length; i++) {
    var p = pts[i], q = inv[i];
    if (p.break || p.end) {
      if (started) ctx.stroke();
      ctx.beginPath();
      started = false;
      continue;
    }
    var mx = p.x + (q.x - p.x) * t;
    var my = p.y + (q.y - p.y) * t;
    if (!started) { ctx.moveTo(x2s(mx), y2s(my)); started = true; }
    else ctx.lineTo(x2s(mx), y2s(my));
  }
  if (started) ctx.stroke();
  ctx.globalAlpha = 1;
}

/* ==================== 奇偶性动点演示 ==================== */

function startParity(cs, btn){
  if (cs.anim === 'parity') { stopAnim(cs); redraw(cs); return; }
  var c = cs.cfg.curves.filter(function(x){ return x.kind === 'fn'; })[0];
  if (!c) return;
  stopAnim(cs);
  cs.anim = 'parity';
  btn.classList.add('playing');
  cs.traceT = cs.view.xMin;
  var last = performance.now();
  var view = cs.view;
  function loop(now){
    if (cs.anim !== 'parity') return;
    var dt = Math.min(100, now - last);
    last = now;
    cs.traceT += (view.xMax - view.xMin) / 7000 * dt;
    redraw(cs);
    drawParity(cs, c);
    if (cs.traceT < view.xMax) {
      cs.raf = requestAnimationFrame(loop);
    } else {
      cs.anim = null;
      btn.classList.remove('playing');
      redraw(cs);
    }
  }
  cs.raf = requestAnimationFrame(loop);
}

function drawParity(cs, curve){
  var x = cs.traceT;
  var y;
  try { y = curve.f(x, cs.params); } catch(e){ y = NaN; }
  if (!Number.isFinite(y)) return;
  var C = colors();
  var ctx = cs.ctx;
  var dpr = window.devicePixelRatio || 1;
  var W = cs.canvas.width / dpr, H = cs.canvas.height / dpr;
  var view = cs.view;
  var x2s = function(x){ return (x - view.xMin) / (view.xMax - view.xMin) * W; };
  var y2s = function(y){ return H - (y - view.yMin) / (view.yMax - view.yMin) * H; };
  var evenX = -x, oddY = -y;
  function dot(sx, sy, col){
    ctx.beginPath();
    ctx.arc(sx, sy, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
    ctx.strokeStyle = C.card;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  function line(ax, ay, bx, by, col){
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x2s(ax), y2s(ay));
    ctx.lineTo(x2s(bx), y2s(by));
    ctx.stroke();
    ctx.setLineDash([]);
  }
  line(x, y, evenX, y, C.accent);
  line(x, y, evenX, oddY, C.odd);
  dot(x2s(x), y2s(y), C.primary);
  dot(x2s(evenX), y2s(y), C.accent);
  dot(x2s(evenX), y2s(oddY), C.odd);
  ctx.font = '10px ' + FONT;
  ctx.fillStyle = C.accent;
  ctx.fillText('偶对称 (−x, y)', x2s(evenX) + 8, y2s(y) - 7);
  ctx.fillStyle = C.odd;
  ctx.fillText('奇对称 (−x, −y)', x2s(evenX) + 8, y2s(oddY) - 7);
}

/* ==================== 工具栏 ==================== */

function onTool(cs, btn){
  var act = btn.dataset.act;
  if (act === 'trace') startTrace(cs, btn);
  else if (act === 'mirror') startMirror(cs, btn);
  else if (act === 'parity') startParity(cs, btn);
  else if (act === 'yx') {
    cs.toggles.yx = !cs.toggles.yx;
    btn.classList.toggle('on', cs.toggles.yx);
    redraw(cs);
  } else if (act === 'asym') {
    cs.toggles.asym = !cs.toggles.asym;
    btn.classList.toggle('on', cs.toggles.asym);
    redraw(cs);
  } else if (act === 'reset') resetCard(cs);
}

/* ==================== 速查总表 ==================== */

function renderSummary(){
  if (state.summaryHtml) {
    $('#summary').innerHTML = state.summaryHtml;
    return;
  }
  var stageOrder = [['junior', '初中篇'], ['senior', '高中篇'], ['college', '大学篇']];
  var rowsA = '';
  stageOrder.forEach(function(st){
    rowsA += '<tr class="stage-row"><td colspan="8">' + st[1] + '</td></tr>';
    FUNCS.filter(function(f){ return f.stage === st[0]; }).forEach(function(f){
      rowsA += '<tr>' +
        '<td><a href="#card-' + f.id + '">' + esc(f.name) + '</a><div class="sm-formula">' + f.formula + '</div></td>' +
        '<td>' + (f.props.domain || '') + '</td>' +
        '<td>' + (f.props.range || '') + '</td>' +
        '<td>' + (f.props.parity || '') + '</td>' +
        '<td>' + (f.props.period || '') + '</td>' +
        '<td>' + (f.props.monotonic || '') + '</td>' +
        '<td>' + (f.props.derivative || '') + '</td>' +
        '<td>' + (f.props.inverse || '') + '</td>' +
      '</tr>';
    });
  });

  var rowsB = '';
  FUNCS.forEach(function(f){
    rowsB += '<tr>' +
      '<td><a href="#card-' + f.id + '">' + esc(f.name) + '</a></td>' +
      '<td>' + (f.inverseName || '—') + '</td>' +
      '<td>' + (f.inverseNote || '—') + '</td>' +
    '</tr>';
  });

  var eqs = [
    ['sin x ~ x', 'x − sin x ~ x³/6'],
    ['tan x ~ x', 'tan x − x ~ x³/3'],
    ['arcsin x ~ x', 'arcsin x − x ~ x³/6'],
    ['arctan x ~ x', 'arctan x − x ~ −x³/3'],
    ['ln(1+x) ~ x', 'ln(1+x) − x ~ −x²/2'],
    ['eˣ − 1 ~ x', 'eˣ − 1 − x ~ x²/2'],
    ['aˣ − 1 ~ x·ln a', '1 − cos x ~ x²/2'],
    ['(1+x)ᵅ − 1 ~ αx', 'sec x − 1 ~ x²/2']
  ];
  var rowsC = eqs.map(function(p){
    return '<tr><td>' + p[0] + '</td><td>' + p[1] + '</td></tr>';
  }).join('');

  var ids = [
    ['cosh²x − sinh²x = 1', 'cos 的同族恒等式'],
    ['sech²x + tanh²x = 1', '与三角恒等式对应'],
    ['coth²x − csch²x = 1', '与三角恒等式对应'],
    ['arcsin x + arccos x = π/2', 'x ∈ [−1,1]'],
    ['arctan x + arccot x = π/2', 'x ∈ R'],
    ['arsinh x = ln(x+√(x²+1))', '与对数互化'],
    ['arcosh x = ln(x+√(x²−1))', 'x ≥ 1'],
    ['artanh x = ½ln((1+x)/(1−x))', '|x| &lt; 1']
  ];
  var rowsD = ids.map(function(p){
    return '<tr><td>' + p[0] + '</td><td>' + p[1] + '</td></tr>';
  }).join('');

  state.summaryHtml =
    '<div class="sum-block">' +
      '<h2>① 全函数速查表</h2>' +
      '<p class="desc">点击函数名可跳转到对应卡片查看图像与详细档案。</p>' +
      '<div class="table-wrap"><table class="sum-table">' +
        '<thead><tr><th>函数</th><th>定义域</th><th>值域</th><th>奇偶性</th><th>周期性</th><th>单调性</th><th>导数</th><th>反函数</th></tr></thead>' +
        '<tbody>' + rowsA + '</tbody></table></div>' +
    '</div>' +
    '<div class="sum-block">' +
      '<h2>② 反函数对照表</h2>' +
      '<p class="desc">每个函数与它的反函数：图像关于 y=x 对称，定义域与值域互换。</p>' +
      '<div class="table-wrap"><table class="sum-table">' +
        '<thead><tr><th>函数</th><th>反函数</th><th>备注</th></tr></thead>' +
        '<tbody>' + rowsB + '</tbody></table></div>' +
    '</div>' +
    '<div class="sum-block">' +
      '<h2>③ 常用等价无穷小（x → 0）</h2>' +
      '<p class="desc">考研求极限的高频工具，全部与本站函数家族对应。</p>' +
      '<div class="table-wrap"><table class="sum-table eq-table">' +
        '<thead><tr><th>等价式</th><th>等价式</th></tr></thead>' +
        '<tbody>' + rowsC + '</tbody></table></div>' +
    '</div>' +
    '<div class="sum-block">' +
      '<h2>④ 常用恒等式</h2>' +
      '<p class="desc">反三角、双曲函数的互化公式。</p>' +
      '<div class="table-wrap"><table class="sum-table eq-table">' +
        '<thead><tr><th>恒等式</th><th>适用范围 / 说明</th></tr></thead>' +
        '<tbody>' + rowsD + '</tbody></table></div>' +
    '</div>' +
    '<div class="sum-block">' +
      '<h2>⑤ 函数图像变换与常用公式</h2>' +
      '<p class="desc">图像平移、伸缩、对称的规律，以及周期、有界、渐近线的判定表达式。</p>' +
      '<div class="table-wrap"><table class="sum-table eq-table">' +
        '<thead><tr><th>类型</th><th>表达式与结论</th></tr></thead>' +
        '<tbody>' +
          '<tr><td>上下平移</td><td>y=f(x)+a：上移 a；y=f(x)−a：下移 a（a&gt;0）</td></tr>' +
          '<tr><td>左右平移</td><td>y=f(x−h)：右移 h；y=f(x+h)：左移 h（h&gt;0）——"左加右减"</td></tr>' +
          '<tr><td>纵向伸缩</td><td>y=k·f(x)（k&gt;0）：纵向拉伸 k 倍（k&gt;1）或压缩（k&lt;1）</td></tr>' +
          '<tr><td>横向伸缩</td><td>y=f(kx)（k&gt;1）：横向压缩为 1/k；y=f(x/k)：横向拉伸 k 倍</td></tr>' +
          '<tr><td>对称变换</td><td>y=−f(x) 关于 x 轴对称；y=f(−x) 关于 y 轴对称；y=−f(−x) 关于原点对称；y=f⁻¹(x) 关于 y=x 对称</td></tr>' +
          '<tr><td>绝对值变换</td><td>y=|f(x)|：把 x 轴下方的图像翻到上方；y=f(|x|)：去掉 y 轴左侧、右侧对称补全（偶延拓）</td></tr>' +
          '<tr><td>奇偶判定</td><td>f(−x)=f(x) ⇒ 偶函数（关于 y 轴对称，对称轴 x=0）；f(−x)=−f(x) ⇒ 奇函数（关于原点对称）</td></tr>' +
          '<tr><td>周期判定</td><td>存在 T≠0 使 f(x+T)=f(x) ⇒ T 为周期；sin/cos/sec/csc：T=2π/|ω|；tan/cot：T=π/|ω|；若 f 周期 T₀，则 f(kx) 的周期为 T₀/|k|</td></tr>' +
          '<tr><td>有界判定</td><td>存在 M&gt;0 使 |f(x)|≤M ⇒ 有界；|sin x|≤1、|cos x|≤1、|tanh x|&lt;1、0&lt;sech x≤1、a^x&gt;0（只有下界）</td></tr>' +
          '<tr><td>渐近线判定</td><td>水平：lim f(x)=L ⇒ y=L；垂直：lim_{x→a} f(x)=∞ ⇒ x=a；斜：lim [f(x)−(kx+b)]=0 ⇒ y=kx+b</td></tr>' +
          '<tr><td>常见最小正周期</td><td>sin x、cos x、sec x、csc x：2π；tan x、cot x：π；|sin x|、|cos x|：π；{x}=x−[x]：1</td></tr>' +
        '</tbody></table></div>' +
    '</div>';
  $('#summary').innerHTML = state.summaryHtml;
}

/* ==================== 导航 ==================== */

function switchTab(tab){
  state.tab = tab;
  $$('#tabs .tab').forEach(function(b){
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  var isSum = tab === 'summary';
  $('#cards').hidden = isSum;
  $('#summary').hidden = !isSum;
  if (isSum) {
    renderSummary();
  } else {
    $$('#cards .card').forEach(function(c){
      c.hidden = c.dataset.stage !== tab;
    });
    $$('#cards .card:not([hidden]) canvas').forEach(function(cv){
      var cs = state.cards[cv.dataset.cid];
      if (cs) {
        var r = cv.getBoundingClientRect();
        if (r.width) redraw(cs);
      }
    });
  }
}

/* ==================== 初始化 ==================== */

function buildCards(){
  var wrap = $('#cards');
  wrap.innerHTML = '';
  FUNCS.forEach(function(cfg){
    var el = buildCard(cfg);
    wrap.appendChild(el);
    initCard(cfg, el);
  });
}

function init(){
  initTheme();
  state.comments = loadComments();
  buildCards();
  switchTab('junior');
  $$('#tabs .tab').forEach(function(b){
    b.addEventListener('click', function(){ switchTab(b.dataset.tab); });
  });
  $('#summary').addEventListener('click', function(e){
    var a = e.target.closest ? e.target.closest('a[href^="#card-"]') : null;
    if (!a) return;
    e.preventDefault();
    var id = a.getAttribute('href').slice(6);
    var cfg = FUNCS.filter(function(f){ return f.id === id; })[0];
    if (cfg && state.tab !== cfg.stage) switchTab(cfg.stage);
    setTimeout(function(){
      var el = document.getElementById('card-' + id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 30);
  });
  window.addEventListener('resize', function(){
    Object.keys(state.cards).forEach(function(k){
      var cs = state.cards[k];
      if (cs.el.offsetParent !== null) {
        var r = cs.canvas.getBoundingClientRect();
        if (r.width) {
          var dpr = window.devicePixelRatio || 1;
          cs.canvas.width = Math.round(r.width * dpr);
          cs.canvas.height = Math.round(r.height * dpr);
          cs.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          redraw(cs);
        }
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
