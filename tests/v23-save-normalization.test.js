'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const htmlPath = process.env.GAME_HTML;
assert.ok(htmlPath, 'Set GAME_HTML to the extracted project web/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

function extractFunction(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `Missing function ${name} in game HTML`);
  const open = source.indexOf('{', start);
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = open; i < source.length; i++) {
    const ch = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`Could not parse function ${name}`);
}

function loadContext(saved) {
  const context = {
    state: { lang: 'ru', coins: 0, total: 0, level: 1, upgrades: {}, hero: 'sakura', ownedHeroes: ['sakura'], skills: [], skin: 0, ownedSkins: [0], prestige: 0, dailyDay: '', dailyStreak: 0, missions: {}, last: Date.now(), tab: 'upgrades', music: false, enemyStage: 1, enemyHp: 0 },
    localStorage: { getItem: () => JSON.stringify(saved) },
    Number, Math, JSON,
  };
  vm.createContext(context);
  vm.runInContext(extractFunction(html, 'normalizeSavedNumber'), context);
  vm.runInContext(extractFunction(html, 'load'), context);
  context.load();
  return context;
}

test('normalizes saved numeric strings to numbers, preventing string-concatenation currency bug', () => {
  const ctx = loadContext({ coins: '100.5', total: '125.5', level: '7', prestige: '2', enemyStage: '9', enemyHp: '30', dailyStreak: '4', upgrades: { '0': '2.7', '1': '-3', '2': 'not-a-number' } });
  assert.equal(typeof ctx.state.coins, 'number');
  assert.equal(ctx.state.coins, 100.5);
  assert.equal(ctx.state.total, 125.5);
  assert.equal(ctx.state.level, 7);
  assert.equal(ctx.state.prestige, 2);
  assert.equal(ctx.state.enemyStage, 9);
  assert.equal(ctx.state.enemyHp, 30);
  assert.equal(ctx.state.dailyStreak, 4);
  assert.equal(ctx.state.upgrades['0'], 2);
  assert.equal(ctx.state.upgrades['1'], 0);
  assert.equal(ctx.state.upgrades['2'], 0);
});

test('sanitizes malformed and negative save values safely', () => {
  const ctx = loadContext({ coins: '-4', total: 'NaN', level: '0', enemyStage: '-2', enemyHp: '-10', dailyStreak: '-5', upgrades: [], ownedHeroes: null, skills: 'bad', ownedSkins: null, missions: [] });
  assert.equal(ctx.state.coins, 0);
  assert.equal(ctx.state.total, 0);
  assert.equal(ctx.state.level, 1);
  assert.equal(ctx.state.enemyStage, 1);
  assert.equal(ctx.state.enemyHp, 0);
  assert.equal(ctx.state.dailyStreak, 0);
  assert.equal(Array.isArray(ctx.state.upgrades), false);
  assert.deepEqual(Array.from(ctx.state.ownedHeroes), ['sakura']);
  assert.deepEqual(Array.from(ctx.state.skills), []);
  assert.deepEqual(Array.from(ctx.state.ownedSkins), [0]);
  assert.equal(Array.isArray(ctx.state.missions), false);
});

test('passive currency addition stays numeric after loading a string save', () => {
  const ctx = loadContext({ coins: '100', total: '100', level: '1', upgrades: {} });
  ctx.checkLevel = () => {};
  ctx.renderTop = () => {};
  vm.runInContext(extractFunction(html, 'add'), ctx);
  ctx.add(25);
  assert.equal(ctx.state.coins, 125);
  assert.equal(ctx.state.total, 125);
});

test('upgrade purchase deducts currency, increments level and refreshes shop UI', () => {
  const ctx = loadContext({ coins: '150', total: '150', level: '1', upgrades: {} });
  ctx.upgrades = [['✨', 'Test upgrade', 'Test description', 100, 1, 'click']];
  ctx.count = i => ctx.state.upgrades[i] || 0;
  ctx.fmt = n => String(n);
  ctx.toast = () => {};
  ctx.renderTop = () => { ctx.topRendered = true; };
  ctx.renderShop = () => { ctx.shopRendered = true; };
  ctx.renderMissions = () => {};
  ctx.save = () => {};
  ctx.cue = () => {};
  ctx.$ = () => ({ classList: { remove() {}, add() {} }, offsetWidth: 0 });
  vm.runInContext(extractFunction(html, 'buyUpgrade'), ctx);
  ctx.buyUpgrade(0);
  assert.equal(ctx.state.coins, 50);
  assert.equal(ctx.state.upgrades['0'], 1);
  assert.equal(ctx.topRendered, true);
  assert.equal(ctx.shopRendered, true);
  assert.equal(Math.floor(100 * Math.pow(1.17, ctx.state.upgrades['0'])), 117);
});
